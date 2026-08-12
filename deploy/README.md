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
| `aci-deploy.sh` | `/usr/local/bin/aci-deploy` | fetch, build, restart, health check, roll back |
| `deploy-hook.py` | `/usr/local/bin/aci-deploy-hook` | loopback HTTPS-fronted trigger |
| `aci-deploy-hook.service` | `/etc/systemd/system/` | runs the hook as the deploy user |
| `nginx-deploy-hook.conf` | nginx server block | proxies `/__deploy` to the hook |

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
install -m 755 -o root -g root deploy/aci-deploy.sh      /usr/local/bin/aci-deploy
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
