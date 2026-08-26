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
| Port | `3002` | `3003` |
| Linux user | `aciadmin` | `aciadmin` (same) |
| Checkout | `/var/www/aci-prod/aci-infotech/` | `/var/www/aci-staging/aci-infotech/` |
| Env file | `.env` | `.env.staging` |
| Systemd unit | existing (unchanged) | `aci-staging.service` |
| `/` renders | v1 HomePage | v2 homepage (via `NEXT_PUBLIC_USE_V2_HOME=true`) |
| `/v1` | mirrors `/` | v1 HomePage (for side-by-side QA) |
| `/preview/v2-home` | v2 homepage | v2 homepage |

The v1/v2 switch is **build-time only** — `NEXT_PUBLIC_USE_V2_HOME`
is inlined by Next.js during `npm run build`. There is no runtime
toggle, no middleware rewrite, and no shared `.next` directory.

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
NEXT_PUBLIC_USE_V2_HOME=true
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
cd /var/www/aci-staging/aci-infotech
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
User=aciadmin
WorkingDirectory=/var/www/aci-staging/aci-infotech
EnvironmentFile=/var/www/aci-staging/aci-infotech/.env.staging
ExecStart=/usr/bin/node /var/www/aci-staging/aci-infotech/node_modules/.bin/next start -p 3003
Restart=on-failure

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
`127.0.0.1:3003`. Do not touch the production server block.

```nginx
server {
    listen 443 ssl http2;
    server_name staging.aciinfotech.com;

    # … TLS cert directives (same pattern as prod) …

    # Keep staging out of Google's index even if robots.txt is bypassed.
    add_header X-Robots-Tag "noindex, nofollow, noarchive" always;

    location / {
        proxy_pass http://127.0.0.1:3003;
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

Nobody should be doing this by hand. `.github/workflows/deploy-staging.yml`
deploys staging automatically on every push to a watched branch, and on
demand from the Actions tab ("Deploy to staging" > Run workflow) for any
ref. It fetches, builds, restarts, health-checks, and rolls back on
failure, all as `aciadmin` over SSH, using the same VPS secrets as the
production workflow.

Two traps it exists to avoid, both of which cost an afternoon:

- **Never run the deploy as root.** The checkout belongs to `aciadmin`
  and so does the service. A root `npm ci` or `npm run build` leaves
  root-owned `node_modules/` and `.next/`, and every later deploy fails
  on permissions. If it happens:
  `chown -R aciadmin:aciadmin /var/www/aci-staging/aci-infotech`.
- **The app is one directory down.** The repo root carries its own
  small `package.json`; the Next app is
  `/var/www/aci-staging/aci-infotech/aci-infotech`. Building at the repo
  root installs one unrelated package and finds no build script.

The deploy hook (`deploy/README.md`) still works for one-off deploys, but
it skips the build when the checkout already sits on the target commit.
If a checkout reached that commit without ever being built, re-running
the hook does nothing, forever. Force it:

```sh
sudo -u aciadmin ACI_FORCE=1 \
  ACI_SERVICE=aci-staging.service \
  ACI_ENV_SRC=/var/www/aci-staging/aci-infotech/aci-infotech/.env.staging \
  /usr/local/bin/aci-deploy <ref>
```

The fully manual sequence, for when everything else is unavailable:

```sh
cd /var/www/aci-staging/aci-infotech
git pull origin <staging-branch>
npm ci
set -a && source .env.staging && set +a       # export env for the build
npm run build                                  # prebuild env-check runs first
sudo systemctl restart aci-staging             # systemd reloads .env.staging for `next start`
sudo systemctl status aci-staging
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
# Root should render v2 (look for NavV2 / v2 class markers)
curl -sI https://staging.aciinfotech.com/
curl -s  https://staging.aciinfotech.com/ | grep -E 'v2-marquee|V2HomeContent|NavV2'

# /v1 should render v1
curl -sI https://staging.aciinfotech.com/v1
curl -s  https://staging.aciinfotech.com/v1 | grep -E 'HeroSection|PlaybookVaultSection'

# /preview/v2-home should still work
curl -sI https://staging.aciinfotech.com/preview/v2-home

# robots.txt must disallow everything
curl  https://staging.aciinfotech.com/robots.txt
```

Also check that production is unchanged:

```sh
curl -sI https://aciinfotech.com/
# / should still serve v1 with the v1 Nav.
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

### Port 3003 already in use

```sh
sudo lsof -i :3003
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

### Disabling v2 temporarily

Edit `.env.staging` to remove (or comment out)
`NEXT_PUBLIC_USE_V2_HOME=true`, rebuild, restart. `/` reverts to v1
while `/preview/v2-home` keeps working.

---

## What this does NOT change

- **Production is untouched.** No files, no systemd units, no nginx
  blocks, no env vars for prod change as part of the staging setup.
- **No shared `.next` or `node_modules`.** Each environment has its
  own checkout.
- **No promotion script.** Promoting v2 to production is a separate,
  deliberate step (unset the flag on staging, set it on prod,
  rebuild prod). Not automated here.
