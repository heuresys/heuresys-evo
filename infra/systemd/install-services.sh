#!/usr/bin/env bash
# Install all heuresys-evo systemd units (RTG Phase 5 task 5.2).
#
# Idempotent: re-running replaces existing unit files. Does NOT auto-start
# services — you start them manually after .env files are populated.
#
# Usage (must run as root or with sudo):
#   sudo bash /home/ubuntu/heuresys-evo/infra/systemd/install-services.sh
#
# After install:
#   sudo systemctl daemon-reload
#   sudo systemctl enable --now heuresys-api-gateway heuresys-app heuresys-enrichment
#   sudo systemctl status heuresys-api-gateway

set -euo pipefail

if [ "$EUID" -ne 0 ]; then
  echo "ERROR: must be run as root (use sudo)" >&2
  exit 1
fi

UNITS=(heuresys-api-gateway.service heuresys-app.service heuresys-enrichment.service)
SRC_DIR="/home/ubuntu/heuresys-evo/infra/systemd"
DST_DIR="/etc/systemd/system"

# Ensure log dir exists
mkdir -p /var/log/heuresys-evo
chown ubuntu:ubuntu /var/log/heuresys-evo

for u in "${UNITS[@]}"; do
  src="$SRC_DIR/$u"
  dst="$DST_DIR/$u"
  if [ ! -f "$src" ]; then
    echo "ERROR: $src not found" >&2
    exit 2
  fi
  echo "Installing $u → $dst"
  cp "$src" "$dst"
  chmod 0644 "$dst"
done

echo ""
echo "Units installed. Run:"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable --now ${UNITS[*]}"
echo ""
echo "Verify:"
echo "  sudo systemctl status ${UNITS[*]}"
echo "  curl -fsS http://127.0.0.1:8200/health"
echo "  curl -fsS http://127.0.0.1:3200/"
