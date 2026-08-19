# Production deploy hook

Lets the development agent deploy aciinfotech.com without SSH.

## Why not SSH

The sandbox the agent runs in has no route to port 22. Direct connections
time out, and the egress proxy only opens CONNECT tunnels to 443:

```
direct TCP 22 -> VPS         Connection timed out
CONNECT :22 via proxy        no tunnel
CONNECT :443 via proxy       HTTP/1.1 200 Connection Established
```

443 reaches the box, so the deploy trigger arrives over HTTPS instead.

## What gets installed

| File | Path on VPS | Purpose |
|---|---|---|
| `aci-deploy-launcher.sh` | `/usr/local/bin/aci-deploy` | fetches the ref and runs its deploy script |
| `aci-deploy.sh` | *not installed* | fetch, build, restart, health check, roll back |
| `deploy-hook.py` | `/usr/local/bin/aci-deploy-hook` | loopback HTTPS-fronted trigger |
| `aci-deploy-hook.service` | `/etc/systemd/system/` | runs the hook as the deploy user |
| `nginx-deploy-hook.conf` | nginx server block | proxies `/__deploy` to the hook |
| `deploy_aci_prod.sh` | `/home/aciadmin/aci-website/` | manual deploy; wraps the same launcher |

`aci-deploy.sh` is deliberately absent from that list. It is read out of the
ref being deployed, so a fix to the deploy logic ships with the code like
any other change. The installed launcher is the only file that needs
reinstalling, and it is built not to need it.

That split exists because the old arrangement cost an afternoon: the deploy
logic lived in the installed copy, so a fix pushed to git could not reach
production through a deploy. Three consecutive deploys failed on a bug that
had already been fixed, because the deploy fetched the fix and then ran the
stale script.

## Env

`ACI_ENV_SRC` in the unit points at `env/aci-prod.env`, the authoritative
production env, and `aci-deploy` installs it over `.env` on every deploy.
`.env` is a tracked file that must differ on the server, so the dirty guard
excludes it by name rather than relying on a `skip-worktree` flag set by
hand in the server's git index.

Set no `ACI_ENV_SRC` and the existing `.env` is preserved instead.

The file has to be readable by the deploy user. `deploy_aci_prod.sh` used
to do that one copy as root, so a root-only env file worked by hand for
years and then failed the moment the hook - which runs as `aciadmin` - took
over. `aci-deploy` checks readability before it fetches or resets anything,
so that failure costs nothing.

## Staging

A second instance of the same hook, on port 9098, with its own token, its
own unit, and `ACI_SERVICE=aci-staging.service`. Separate tokens are the
point: a staging token cannot deploy production, so standing staging access
is a much smaller decision than standing production access.

| | Production | Staging |
|---|---|---|
| Unit | `aci-deploy-hook.service` | `aci-deploy-hook-staging.service` |
| Hook port | 9099 | 9098 |
| Token file | `/etc/aci-deploy.env` | `/etc/aci-deploy-staging.env` |
| App service | `aci-next.service` | `aci-staging.service` |
| Health port | 3002 | 3004 |
| Host | `aciinfotech.com` | `staging.aciinfotech.com` |

`aci-deploy` needs no per-environment logic: it reads `APP_DIR` from the
unit's `WorkingDirectory`, which is how it copes with the staging repo
being cloned into a directory that shares the app's name.

Staging needs its own sudoers line. The existing one grants
`aci-next.service` only, so without this the staging deploy builds and then
fails at the restart:

```sh
echo 'aciadmin ALL=(root) NOPASSWD: /usr/bin/systemctl restart aci-staging.service, /usr/bin/systemctl status aci-staging.service' \
  > /etc/sudoers.d/aci-staging-deploy
chmod 440 /etc/sudoers.d/aci-staging-deploy
visudo -c
```

## Security shape

This is an authenticated remote-execution endpoint. It is narrow on
purpose:

- Binds to `127.0.0.1` only. Nothing reaches it except through nginx.
- Bearer token compared with `hmac.compare_digest`, so it cannot be
  guessed a byte at a time by timing the response.
- The only input is a git ref, matched against `^[A-Za-z0-9._/-]{1,255}$`
  in both the hook and the deploy script. It never reaches a shell.
- No command, path or script name comes from the request.
- Runs as the deploy user, not root. The single privileged action is
  `systemctl restart` on one unit, via `/etc/sudoers.d/gha-deploy`.
- One deploy at a time (`flock` plus an in-process lock); concurrent
  requests get 409 rather than two builds in one checkout.
- A failed build or an unhealthy service rolls the checkout back to the
  previous commit and restarts.

Rotate the token by editing `/etc/aci-deploy.env` and restarting
`aci-deploy-hook.service`. That immediately revokes the old one.

## Install

Run as root on the VPS, from a checkout of this repo:

```sh
install -m 755 -o root -g root deploy/aci-deploy-launcher.sh /usr/local/bin/aci-deploy
install -m 755 -o root -g root deploy/deploy-hook.py     /usr/local/bin/aci-deploy-hook
install -m 644 -o root -g root deploy/aci-deploy-hook.service /etc/systemd/system/

# Token. Generate it here; it never needs to be typed by hand.
TOKEN=$(head -c 48 /dev/urandom | base64 | tr -d '/+=' | head -c 48)
printf 'ACI_DEPLOY_TOKEN=%s\n' "$TOKEN" > /etc/aci-deploy.env
chown aciadmin:aciadmin /etc/aci-deploy.env
chmod 600 /etc/aci-deploy.env

systemctl daemon-reload
systemctl enable --now aci-deploy-hook.service
systemctl status aci-deploy-hook.service --no-pager -n 10

echo "DEPLOY TOKEN: $TOKEN"
```

Then add the nginx location from `nginx-deploy-hook.conf` to the
`aciinfotech.com` server block and `nginx -t && systemctl reload nginx`.

Verify locally before exposing it:

```sh
curl -s localhost:9099/healthz                      # {"ok": true}
curl -s -o /dev/null -w '%{http_code}\n' \
  -X POST localhost:9099/deploy                     # 401 without a token
```

## Use

```sh
curl -sS -X POST https://aciinfotech.com/__deploy \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"ref":"main"}'
```

Returns the deploy's exit code plus the tail of stdout/stderr, so a failure
explains itself rather than just returning 500.
