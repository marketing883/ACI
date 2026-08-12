#!/usr/bin/env bash
#
# Production deploy for aciinfotech.com.
#
# Fetches a ref into the prod checkout, rebuilds, restarts the service, and
# rolls back if the build fails or the site does not come back healthy.
#
# Runs as the deploy user (not root). The only privileged thing it does is
# restart one systemd unit, via the narrow sudoers rule in
# /etc/sudoers.d/gha-deploy.
#
# Usage:  aci-deploy <ref>
# Install: /usr/local/bin/aci-deploy  (chmod 755, owned by root)

set -euo pipefail

SERVICE="${ACI_SERVICE:-aci-next.service}"
HEALTH_PORT="${ACI_HEALTH_PORT:-3002}"
LOCK="/var/lock/aci-deploy.lock"

REF="${1:-}"
if [ -z "$REF" ]; then
  echo "usage: aci-deploy <ref>" >&2
  exit 2
fi

# A ref reaches this script from a network request, so it never goes near a
# shell unquoted and it has to look like a ref before we use it at all.
if ! printf '%s' "$REF" | grep -qE '^[A-Za-z0-9._/-]{1,255}$'; then
  echo "refusing suspicious ref: $REF" >&2
  exit 2
fi

# One deploy at a time. Two overlapping builds in the same checkout leave
# .next in a state neither of them expects.
exec 9>"$LOCK"
if ! flock -n 9; then
  echo "another deploy is already running" >&2
  exit 75
fi

APP_DIR=$(systemctl show "$SERVICE" -p WorkingDirectory --value)
[ -n "$APP_DIR" ] && [ -d "$APP_DIR" ] || { echo "bad WorkingDirectory: '$APP_DIR'" >&2; exit 1; }

cd "$APP_DIR"
REPO_ROOT=$(git rev-parse --show-toplevel)
PREVIOUS=$(git -C "$REPO_ROOT" rev-parse HEAD)

echo "== deploy start =="
echo "ref=$REF service=$SERVICE app_dir=$APP_DIR repo_root=$REPO_ROOT"
echo "current=$PREVIOUS"

restore() {
  echo "!! deploy failed - restoring $PREVIOUS"
  git -C "$REPO_ROOT" reset --hard "$PREVIOUS" || true
  cd "$APP_DIR"
  npm ci --no-audit --no-fund || true
  build || echo "!! restore build failed too - service left on its running process"
  sudo /usr/bin/systemctl restart "$SERVICE" || true
}

build() {
  # check-build-env.mjs reads process.env and does not load .env files
  # itself, so source them first exactly as docs/staging.md describes.
  set -a
  # shellcheck disable=SC1091
  . ./.env
  [ -f ./.env.local ] && . ./.env.local
  set +a
  npm run build
}

git -C "$REPO_ROOT" fetch --prune origin "$REF"
TARGET=$(git -C "$REPO_ROOT" rev-parse FETCH_HEAD)
echo "target=$TARGET"

if [ "$TARGET" = "$PREVIOUS" ]; then
  echo "already at $TARGET - nothing to deploy"
  exit 0
fi

trap restore ERR

git -C "$REPO_ROOT" reset --hard "$TARGET"
cd "$APP_DIR"
npm ci --no-audit --no-fund
build

sudo /usr/bin/systemctl restart "$SERVICE"
trap - ERR

echo "== health check =="
ok=0
for i in $(seq 1 20); do
  sleep 3
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${HEALTH_PORT}/" || echo 000)
  state=$(systemctl is-active "$SERVICE" || true)
  echo "attempt $i: http=$code service=$state"
  if [ "$state" = "active" ] && [ "$code" -ge 200 ] && [ "$code" -lt 400 ]; then
    ok=1
    break
  fi
done

if [ "$ok" -ne 1 ]; then
  echo "!! unhealthy after restart"
  systemctl status "$SERVICE" --no-pager -n 40 || true
  restore
  exit 1
fi

echo "== deployed $TARGET (was $PREVIOUS) =="
echo "roll back: git -C $REPO_ROOT reset --hard $PREVIOUS && cd $APP_DIR && npm ci && npm run build && sudo systemctl restart $SERVICE"
