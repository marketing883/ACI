#!/usr/bin/env bash
#
# Manual production deploy. Kept because the muscle memory is
# `sudo /home/aciadmin/aci-website/deploy_aci_prod.sh`, and there is no
# reason to retrain that.
#
# It is now a wrapper. The previous version was a second, independent
# implementation of the deploy, and the two drifted: it copied
# env/aci-prod.env over .env on every run while the hook preserved
# whatever .env already held, which is how the app-dir copy silently fell
# behind the authoritative file. It also had no rollback, no lock against
# concurrent deploys, and a health check against the public URL that only
# warned on failure - so a deploy that broke the site still reported
# success.
#
# Everything now goes through /usr/local/bin/aci-deploy, so a deploy run
# by hand and a deploy run by the hook execute the same code.
#
# Usage: deploy_aci_prod.sh [ref]
#
# With no argument it redeploys the branch this checkout is already on,
# picking up whatever has been pushed to it. It used to default to `main`,
# which is wrong for this repo and quietly dangerous: main carries only the
# old static site and the documentation, with no aci-infotech/ directory at
# all, so a bare `deploy_aci_prod.sh` would reset production onto a tree
# with no app in it. The guards would catch it and roll back, but that is
# an outage window spent on a default nobody wanted.
#
# Deploying a different branch is what the argument is for. Nothing here or
# in aci-deploy pins a branch name - the ref is an input at every layer,
# including the hook's JSON body - so moving to another branch needs no
# change to any of this.

set -Eeuo pipefail

DEPLOY_USER="${ACI_DEPLOY_USER:-aciadmin}"
SERVICE="${ACI_SERVICE:-aci-next.service}"

REF="${1:-}"
if [ -z "$REF" ]; then
  APP_DIR=$(systemctl show "$SERVICE" -p WorkingDirectory --value)
  if [ -z "$APP_DIR" ] || [ ! -d "$APP_DIR" ]; then
    echo "cannot find $SERVICE's WorkingDirectory to infer a branch" >&2
    echo "usage: deploy_aci_prod.sh <ref>" >&2
    exit 2
  fi
  REF=$(git -C "$APP_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || true)
  # Detached HEAD reports the literal string "HEAD", which is not a branch
  # anyone can mean to deploy. Refuse rather than guess at one.
  if [ -z "$REF" ] || [ "$REF" = "HEAD" ]; then
    echo "checkout is not on a branch (detached HEAD), so there is no ref to infer" >&2
    echo "usage: deploy_aci_prod.sh <ref>" >&2
    exit 2
  fi
  echo "no ref given - redeploying the checked-out branch: $REF"
fi

# The deploy has to run as the account that owns the checkout. Running it
# as root leaves root-owned objects in .git, and the next deploy - which
# does run as aciadmin - then cannot write the index.
#
# `sudo -u` runs the binary directly rather than through a login shell,
# which matters here: aciadmin's shell is cpanel's noshell, so anything
# that wants a login shell is refused.
if [ "$(id -un)" = "$DEPLOY_USER" ]; then
  exec /usr/local/bin/aci-deploy "$REF"
fi

exec sudo -u "$DEPLOY_USER" /usr/local/bin/aci-deploy "$REF"
