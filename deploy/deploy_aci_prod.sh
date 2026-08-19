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
# Usage: deploy_aci_prod.sh [ref]        (default: main)

set -Eeuo pipefail

REF="${1:-main}"
DEPLOY_USER="${ACI_DEPLOY_USER:-aciadmin}"

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
