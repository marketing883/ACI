#!/usr/bin/env bash
#
# ACI staging auto-deploy.
#
# Polls the tracked branch. When it moves, rebuilds the staging app and
# restarts the staging service, then checks the site actually answers.
# If the build fails, the running service is left alone. If the site
# fails its health check after the restart, this rolls back to the
# commit that was live before.
#
# Scope is deliberately narrow. This script touches exactly two things:
# the staging checkout, and the aci-staging unit. It never touches
# production, nginx, any other vhost, or any other service on the box.
# The sudoers rule it relies on grants precisely one command
# (systemctl restart aci-staging) and nothing else.
#
# Runs unattended from aci-staging-deploy.timer. All output goes to the
# journal:  journalctl -u aci-staging-deploy -n 100

set -uo pipefail

CONF=/etc/aci-staging-deploy.conf
# shellcheck source=/dev/null
[ -r "$CONF" ] && . "$CONF"

REPO="${ACI_STAGING_REPO:-/var/www/aci-staging/aci-infotech}"
APP="$REPO/aci-infotech"
BRANCH="${ACI_STAGING_BRANCH:?set ACI_STAGING_BRANCH in $CONF}"
SERVICE="${ACI_STAGING_SERVICE:-aci-staging}"
PORT="${ACI_STAGING_PORT:-3004}"
SYSTEMCTL="${ACI_STAGING_SYSTEMCTL:-/usr/bin/systemctl}"
HEALTH_URL="http://127.0.0.1:${PORT}/"
HEALTH_TRIES="${ACI_STAGING_HEALTH_TRIES:-12}"
HEALTH_WAIT="${ACI_STAGING_HEALTH_WAIT:-5}"

log() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }
die() { log "FATAL: $*"; exit 1; }

[ -d "$APP" ]              || die "app directory missing: $APP"
[ -r "$APP/.env.staging" ] || die "env file missing: $APP/.env.staging"
[ -x "$SYSTEMCTL" ]        || die "systemctl not found at $SYSTEMCTL"

cd "$REPO" || die "cannot cd into $REPO"

git fetch --quiet origin "$BRANCH" || die "git fetch failed for $BRANCH"

TARGET=$(git rev-parse FETCH_HEAD 2>/dev/null) || die "cannot resolve FETCH_HEAD"
CURRENT=$(git rev-parse HEAD 2>/dev/null)      || die "cannot resolve HEAD"

# Nothing new. Exit quietly so a 5-minute timer doesn't fill the journal.
[ "$TARGET" = "$CURRENT" ] && exit 0

log "deploying $BRANCH: ${CURRENT:0:8} -> ${TARGET:0:8}"

# Check out a ref and produce a build from it. Returns non-zero on any
# failure, leaving the caller to decide what to do about it.
build_ref() {
  local ref="$1"
  git checkout -q -B "$BRANCH" "$ref"                                   || return 1
  ( cd "$APP" && npm ci --no-audit --no-fund )                          || return 1
  ( cd "$APP" && set -a && . ./.env.staging && set +a && npm run build ) || return 1
  return 0
}

# Poll the app directly on its loopback port, so nginx and DNS are not
# part of the verdict.
healthy() {
  local i
  for i in $(seq 1 "$HEALTH_TRIES"); do
    curl -fsS --max-time 10 -o /dev/null "$HEALTH_URL" && return 0
    sleep "$HEALTH_WAIT"
  done
  return 1
}

# --- build the new commit -------------------------------------------
# The service is still serving the previous build throughout this step.
if ! build_ref "$TARGET"; then
  log "BUILD FAILED at ${TARGET:0:8}; restoring checkout to ${CURRENT:0:8}"
  log "service untouched and still serving the previous build"
  git checkout -q -B "$BRANCH" "$CURRENT" || log "WARN: could not restore ${CURRENT:0:8}"
  exit 1
fi

# --- swap it in ------------------------------------------------------
log "build ok; restarting $SERVICE"
sudo -n "$SYSTEMCTL" restart "$SERVICE" || die "could not restart $SERVICE"

if healthy; then
  log "DEPLOY OK: $SERVICE healthy at ${TARGET:0:8}"
  exit 0
fi

# --- health check failed: put the old commit back --------------------
log "HEALTH CHECK FAILED after restart; rolling back to ${CURRENT:0:8}"
if build_ref "$CURRENT" \
  && sudo -n "$SYSTEMCTL" restart "$SERVICE" \
  && healthy; then
  log "ROLLED BACK: $SERVICE healthy again at ${CURRENT:0:8}"
  log "the commit that failed was ${TARGET:0:8}"
  exit 1
fi

die "ROLLBACK FAILED - $SERVICE may be down, manual intervention needed"
