# Staging deployment runbook

This doc describes how the ACI staging site is set up on the VPS and
how to deploy updates to it. Production is **not affected** by any
instruction in this file — staging is a separate working tree, a
separate systemd unit, and a separate port.

---

## Overview

| | Production | Staging |
|---|---|---|
| Hostname | `aciinfotech.com` | `staging.aciinfotech.com` |
| Port | `3002` | `3004` |
| Linux user | `aciadmin` | `aciadmin` (same) |
| Repo root | `/var/www/aci-prod/aci-infotech/` | `/var/www/aci-staging/aci-infotech/` |
| **App dir** | (one level in) | `/var/www/aci-staging/aci-infotech/aci-infotech/` |
| Env file | `.env` | `.env.staging` |
| Systemd unit | existing (unchanged) | `aci-staging.service` |
| `/` renders | v4 editorial homepage | v4 editorial homepage (same code) |
| `/v1` | v1 HomePage | v1 HomePage (for side-by-side QA) |

### Two traps this doc used to set

**The checkout is nested.** The whole ACI repo is cloned into a
directory that is itself called `aci-infotech`, so the Next.js app sits
one level deeper than you would guess:

```
/var/www/aci-staging/aci-infotech/            <- git repo root
/var/www/aci-staging/aci-infotech/aci-infotech/  <- npm/next run HERE
```

`git` commands run at the repo root; `npm ci` and `npm run build` run in
the app dir. `.env.staging` lives in the app dir. The systemd unit's
`WorkingDirectory` is the authoritative answer if you are ever unsure.

**`aciadmin` has no login shell.** It is set to
`/usr/local/cpanel/bin/noshell`, so `sudo -iu aciadmin` fails with
"Shell access is not enabled on your account!" — and, importantly, sudo
returns rather than aborting, so anything you paste after it silently
runs as **root**. Always use the non-login form, which invokes bash
directly and works fine:

```sh
sudo -u aciadmin bash -c 'cd /var/www/aci-staging/aci-infotech && git status'
```

This also means CI cannot SSH in as `aciadmin` — sshd runs the login
shell, so an external runner gets the same refusal. Deploys here are
run by hand from a root shell on the box.

### The `NEXT_PUBLIC_USE_V2_HOME` flag is obsolete

This runbook used to describe staging as the place where `/` rendered
the **v2** homepage behind `NEXT_PUBLIC_USE_V2_HOME=true`. That is no
longer how the site works. `src/app/page.tsx` now renders the **v4**
editorial homepage unconditionally, with no flag check, so the
variable no longer switches anything:

- `ConditionalLayout` suppresses the global chrome on `/` via
  `isV4Home` regardless of the flag, so the old `isV2Root` branch is
  dead weight.
- The only thing the flag still does is label the prebuild env-check
  output as `STAGING` vs `PRODUCTION`
  (`scripts/check-build-env.mjs`), which is cosmetic.

Setting it is therefore harmless but pointless. **Staging's job now is
to preview homepage changes on the same code path production runs**,
which is what you want before promoting an edit. The v2 homepage is
still reachable at `/preview/v2-home` if you need to compare.

Everything else here still holds: staging is a separate working tree,
a separate systemd unit, and a separate port. There is no shared
`.next` and no shared `node_modules`.

---

## One-time setup on the staging VPS

All steps run as `aciadmin`.

### 1. Clone the repo into a new working tree

```sh
sudo mkdir -p /var/www/aci-staging
sudo chown aciadmin:aciadmin /var/www/aci-staging
cd /var/www/aci-staging
git clone <repo-url> aci-infotech
cd aci-infotech
git checkout <staging-branch>   # the branch you want staging to track
npm ci
```

### 2. Drop in `.env.staging`

Copy `.env.staging.example` to `.env.staging` and fill in real
values. Critical fields:

```
NEXT_PUBLIC_SITE_URL=https://staging.aciinfotech.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Permissions:

```sh
chmod 600 .env.staging     # keep the secrets readable only by aciadmin
```

### 3. First build

```sh
cd /var/www/aci-staging/aci-infotech/aci-infotech
set -a && . ./.env.staging && set +a
npm run build
```

The `prebuild` hook runs `scripts/check-build-env.mjs` first; if any
required env var is missing, the build aborts before Next starts
compiling. Fix the missing var and re-run.

### 4. Drop in the staging `public/robots.txt`

Staging should not be indexed. Create the file inside this
checkout's `public/` directory so it's served at the root:

```sh
cat > public/robots.txt <<'EOF'
User-agent: *
Disallow: /
EOF
```

(Production's `public/robots.txt` in `/var/www/aci-prod/` is untouched.)

### 5. Install the systemd unit

Create `/etc/systemd/system/aci-staging.service`:

```ini
[Unit]
Description=ACI staging (Next.js)
After=network.target

[Service]
Type=simple
User=aciadmin
WorkingDirectory=/var/www/aci-staging/aci-infotech/aci-infotech
EnvironmentFile=/var/www/aci-staging/aci-infotech/aci-infotech/.env.staging
Environment=NODE_ENV=production
Environment=PORT=3004
ExecStart=/var/www/aci-staging/aci-infotech/aci-infotech/node_modules/.bin/next start -H 127.0.0.1 -p 3004
Restart=always
RestartSec=5
MemoryMax=2G

[Install]
WantedBy=multi-user.target
```

Then:

```sh
sudo systemctl daemon-reload
sudo systemctl enable aci-staging
sudo systemctl start aci-staging
sudo systemctl status aci-staging
```

### 6. Nginx reverse proxy

Add a server block for `staging.aciinfotech.com` that proxies to
`127.0.0.1:3004`. Do not touch the production server block.

```nginx
server {
    listen 443 ssl http2;
    server_name staging.aciinfotech.com;

    # … TLS cert directives (same pattern as prod) …

    # Keep staging out of Google's index even if robots.txt is bypassed.
    add_header X-Robots-Tag "noindex, nofollow, noarchive" always;

    location / {
        proxy_pass http://127.0.0.1:3004;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Reload nginx:

```sh
sudo nginx -t && sudo systemctl reload nginx
```

---

## Routine deploys

Note the two different directories, and the `sudo -u aciadmin bash -c`
form (see the traps section above):

```sh
REPO=/var/www/aci-staging/aci-infotech
APP=$REPO/aci-infotech
BRANCH=<staging-branch>

sudo -u aciadmin bash -c "cd $REPO && \
  git fetch origin $BRANCH && git checkout -B $BRANCH FETCH_HEAD"

sudo -u aciadmin bash -c "cd $APP && npm ci && \
  set -a && . ./.env.staging && set +a && npm run build"

sudo systemctl restart aci-staging
curl -fsS -o /dev/null http://127.0.0.1:3004/ && echo "staging is up"
```

> **Why `set -a && source`:** Next.js auto-loads `.env`, `.env.local`,
> `.env.production`, etc., but **not** `.env.staging` (it's a custom
> filename). The `set -a` before `source` marks every var exported,
> so both the `prebuild` env-check and the Next.js build pick them
> up. `systemctl` reads the same file via `EnvironmentFile=` in the
> unit, so `next start` sees the same values.

If the build fails, the service keeps running the previous build —
`next start` restarts against whatever is currently in `.next/`. Fix
the error, rebuild, then restart.

---

## Smoke tests

```sh
# Root should render the v4 homepage. These strings come from the
# section headings, so they only match if the page actually rendered.
curl -sI https://staging.aciinfotech.com/
curl -s  https://staging.aciinfotech.com/ | grep -E 'Our Partner Platforms|Shipped, measured|working&nbsp;AI|Not ready for coffee'

# Section order: Services must appear before Playbooks. Prints the
# order the headings occur in; eyeball that it reads services -> proof
# -> playbooks.
curl -s https://staging.aciinfotech.com/ \
  | grep -oE 'What we build|Shipped, measured|The playbook vault'

# /v1 should still render the old homepage
curl -sI https://staging.aciinfotech.com/v1
curl -s  https://staging.aciinfotech.com/v1 | grep -E 'HeroSection|PlaybookVaultSection'

# robots.txt must disallow everything
curl  https://staging.aciinfotech.com/robots.txt

# Canonical must point at PRODUCTION, never at staging — otherwise
# staging can self-canonicalize into the index.
curl -s https://staging.aciinfotech.com/ | grep -o 'rel="canonical" href="[^"]*"'
```

Also check that production is unchanged:

```sh
curl -sI https://aciinfotech.com/
curl -s https://aciinfotech.com/ | grep -oE 'Proof that runs|Shipped, measured'
# Before promoting, prod should still print "Proof that runs".
```

---

## Failure modes + rollback

### Build aborted with missing-env error

The prebuild script lists the specific variables that are missing and
why (empty, pointing at localhost, etc.). Add them to
`/var/www/aci-staging/aci-infotech/.env.staging` and re-run
`npm run build`.

### Build succeeds but `/` serves v1

`NEXT_PUBLIC_USE_V2_HOME` was not set to the exact string `true` at
build time. Double-check `.env.staging`, rebuild, restart the
service.

### Staging Nav/Footer show v1 chrome wrapped around v2

`ConditionalLayout` only flips when `pathname === '/'` **and**
`NEXT_PUBLIC_USE_V2_HOME === 'true'`. Most likely the env var wasn't
inlined at build time — re-check the env file, rebuild, restart.

### Port 3004 already in use

```sh
sudo lsof -i :3004
```

Kill the squatter (or pick a different free port in the systemd unit
and in the nginx block).

### Rolling back to previous staging build

Each `npm run build` overwrites `.next/`. To revert a bad release:

```sh
cd /var/www/aci-staging/aci-infotech
git checkout <previous-commit-sha>
npm ci
npm run build
sudo systemctl restart aci-staging
```

### Comparing against the old homepage

`/v1` serves the previous homepage from the same build, so you can
diff the two side by side without touching env vars or rebuilding.
`/preview/v2-home` still serves the v2 design.

Note that removing `NEXT_PUBLIC_USE_V2_HOME` no longer changes what
`/` renders — see the obsolete-flag note at the top of this doc. To
roll `/` back to an earlier design you have to check out an earlier
commit and rebuild.

---

## What this does NOT change

- **Production is untouched.** No files, no systemd units, no nginx
  blocks, no env vars for prod change as part of the staging setup.
- **No shared `.next` or `node_modules`.** Each environment has its
  own checkout.
- **No promotion script.** Promoting v2 to production is a separate,
  deliberate step (unset the flag on staging, set it on prod,
  rebuild prod). Not automated here.
