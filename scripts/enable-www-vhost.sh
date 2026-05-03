#!/usr/bin/env bash
# Enable nginx vhost for www.heuresys.com + heuresys.com (legacy) and obtain
# Let's Encrypt certs. Idempotent: safe to run multiple times.
#
# Prerequisites (must be done OUTSIDE the VM, on Porkbun):
#   - A record `www`  → 80.225.82.207
#   - A record `@`    → 80.225.82.207
#
# Then run this script. It will:
#   1. symlink the vhost into sites-enabled
#   2. nginx -t && reload
#   3. run certbot to obtain HTTPS cert + auto-redirect HTTP→HTTPS
#
# Usage: sudo bash scripts/enable-www-vhost.sh
# Or:    bash scripts/enable-www-vhost.sh   (will sudo internally)

set -euo pipefail

DOMAINS=(www.heuresys.com heuresys.com)
EXPECTED_IP=80.225.82.207
VHOST_NAME=www.heuresys.com.conf
VHOST_AVAILABLE=/etc/nginx/sites-available/${VHOST_NAME}
VHOST_ENABLED=/etc/nginx/sites-enabled/${VHOST_NAME}
EMAIL=${LE_EMAIL:-enzo.spenuso@outlook.com}

if [[ $EUID -ne 0 ]]; then
  exec sudo -E bash "$0" "$@"
fi

echo "==> 1. Verify DNS resolution"
for d in "${DOMAINS[@]}"; do
  ip=$(getent hosts "$d" | awk '{print $1}' | head -1 || true)
  printf '   %-25s -> %s' "$d" "${ip:-<unresolved>}"
  if [[ "$ip" != "$EXPECTED_IP" ]]; then
    echo "   [FAIL]"
    echo
    echo "ABORT: $d does not resolve to $EXPECTED_IP yet. Update DNS on Porkbun and retry."
    exit 1
  fi
  echo "   [OK]"
done

echo
echo "==> 2. Verify vhost config exists"
if [[ ! -f "$VHOST_AVAILABLE" ]]; then
  echo "ABORT: $VHOST_AVAILABLE not found. Did you run the prep step?"
  exit 1
fi
echo "   $VHOST_AVAILABLE present"

echo
echo "==> 3. Enable vhost (symlink to sites-enabled)"
ln -sfn "$VHOST_AVAILABLE" "$VHOST_ENABLED"
ls -la "$VHOST_ENABLED"

echo
echo "==> 4. nginx -t"
nginx -t

echo
echo "==> 5. Reload nginx"
systemctl reload nginx
echo "   reloaded"

echo
echo "==> 6. Sanity HTTP probe"
for d in "${DOMAINS[@]}"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 5 "http://$d/")
  echo "   http://$d/  -> $code"
done

echo
echo "==> 7. Run certbot (HTTPS)"
mkdir -p /var/www/certbot
certbot --nginx \
  --non-interactive --agree-tos \
  --email "$EMAIL" \
  --redirect \
  -d www.heuresys.com -d heuresys.com

echo
echo "==> 8. Final verification"
for d in "${DOMAINS[@]}"; do
  hcode=$(curl -s -o /dev/null -w '%{http_code}' -m 5 "https://$d/")
  echo "   https://$d/ -> $hcode"
done

echo
echo "DONE. www.heuresys.com and heuresys.com are now served by nginx with HTTPS."
echo "Repo: /home/ubuntu/heuresys.com.evo (legacy Docker stack)."
