#!/bin/bash
# Backup the local Postgres database to a timestamped pg_dump custom-format file.
#
# Usage: bash db/scripts/backup.sh
# Override via env: DB_HOST, DB_PORT, DB_USER, DB_NAME, BACKUP_DIR, PGPASSWORD

set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-heuresys}"
DB_NAME="${DB_NAME:-heuresys_platform}"
BACKUP_DIR="${BACKUP_DIR:-backups/local}"

mkdir -p "$BACKUP_DIR"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.dump"

export PGPASSWORD="${PGPASSWORD:-heuresys}"

echo "[backup] Dumping $DB_NAME from $DB_HOST:$DB_PORT to $OUT_FILE..."
echo "[backup] Format: custom (compressed level 9), no-owner, no-privileges"

pg_dump \
  --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" --dbname="$DB_NAME" \
  --format=custom --compress=9 --no-owner --no-privileges \
  --file="$OUT_FILE"

SIZE=$(du -h "$OUT_FILE" | cut -f1)
echo "[backup] Done. Size: $SIZE"
echo "[backup] To restore later: pg_restore --clean --if-exists -U $DB_USER -d $DB_NAME $OUT_FILE"
