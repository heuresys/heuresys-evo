#!/bin/bash
# Setup PostgreSQL 16 + pgvector on Ubuntu 24.04 ARM64 (designed for OCI oracle-vm-default).
#
# Run on the VM:
#   ssh ubuntu@oracle-vm-default 'bash -s' < db/scripts/setup-vm.sh
#
# Or copy + execute:
#   scp db/scripts/setup-vm.sh ubuntu@oracle-vm-default:/tmp/
#   ssh ubuntu@oracle-vm-default 'bash /tmp/setup-vm.sh'
#
# Override defaults via env: DB_NAME, DB_USER, DB_PASSWORD

set -euo pipefail

DB_NAME="${DB_NAME:-heuresys_platform}"
DB_USER="${DB_USER:-heuresys}"
DB_PASSWORD="${DB_PASSWORD:-heuresys}"
BACKUP_USER="${BACKUP_USER:-heuresys_backup}"
BACKUP_PASSWORD="${BACKUP_PASSWORD:-heuresys}"

if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

# Verify Ubuntu
if [ ! -f /etc/os-release ] || ! grep -q "Ubuntu" /etc/os-release; then
  echo "ERROR: this script is for Ubuntu 24.04. For other distros adapt manually." >&2
  exit 1
fi

echo "[setup-vm] Adding PostgreSQL APT repo for Ubuntu $(lsb_release -cs)..."
$SUDO apt update
$SUDO apt install -y curl ca-certificates gnupg lsb-release
$SUDO install -d /usr/share/postgresql-common/pgdg
$SUDO curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc \
  --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc

echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] \
https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
  | $SUDO tee /etc/apt/sources.list.d/pgdg.list

$SUDO apt update
$SUDO apt install -y postgresql-16 postgresql-16-pgvector

$SUDO systemctl enable --now postgresql
sleep 2

echo "[setup-vm] Creating role '$DB_USER'..."
$SUDO -u postgres psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;
SQL

echo "[setup-vm] Creating database '$DB_NAME'..."
$SUDO -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
  $SUDO -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo "[setup-vm] Enabling pgvector extension in '$DB_NAME'..."
$SUDO -u postgres psql -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS vector;"

echo "[setup-vm] Creating backup role '$BACKUP_USER' (BYPASSRLS, read-only)..."
$SUDO -u postgres psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$BACKUP_USER') THEN
    CREATE ROLE $BACKUP_USER WITH LOGIN PASSWORD '$BACKUP_PASSWORD' BYPASSRLS;
  END IF;
END
\$\$;
SQL
$SUDO -u postgres psql -d "$DB_NAME" <<SQL
GRANT CONNECT ON DATABASE $DB_NAME TO $BACKUP_USER;
SQL

# Grant SELECT across ALL non-system schemas, present and future.
# CRITICAL: ALTER DEFAULT PRIVILEGES *needs* "FOR ROLE $DB_USER" to cover tables
# created by the application role (which runs migrations). Without FOR ROLE, the
# default privilege only applies to objects created by the role doing the ALTER
# (postgres superuser here), which never happens in normal operation. This was
# the root cause of the 2026-04-28 backup outage after migration 222 created the
# NextAuth tables (account/session/verification_token) without backup grants.
SCHEMAS=$($SUDO -u postgres psql -d "$DB_NAME" -tAc "SELECT nspname FROM pg_namespace WHERE nspname NOT IN ('pg_catalog','information_schema','pg_toast') AND nspname NOT LIKE 'pg_temp%' AND nspname NOT LIKE 'pg_toast_temp%';")
for SCHEMA in $SCHEMAS; do
  echo "[setup-vm]   granting SELECT to $BACKUP_USER on schema '$SCHEMA' (current + future)..."
  $SUDO -u postgres psql -d "$DB_NAME" <<SQL
GRANT USAGE ON SCHEMA "$SCHEMA" TO $BACKUP_USER;
GRANT SELECT ON ALL TABLES IN SCHEMA "$SCHEMA" TO $BACKUP_USER;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA "$SCHEMA" TO $BACKUP_USER;
ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA "$SCHEMA" GRANT SELECT ON TABLES TO $BACKUP_USER;
ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA "$SCHEMA" GRANT SELECT ON SEQUENCES TO $BACKUP_USER;
SQL
done

echo ""
echo "[setup-vm] Done. PostgreSQL listening on port 5432."
echo "Roles created:"
echo "  - $DB_USER          (application role, RLS-enforced)"
echo "  - $BACKUP_USER      (backup role, BYPASSRLS, read-only)"
echo ""
echo "Connection string from VM localhost:"
echo "  postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
echo "Next steps:"
echo "  1. scp backups/from-vm/platform_db.dump ubuntu@<vm-host>:/home/ubuntu/"
echo "  2. ssh + bash db/scripts/restore-baseline.sh"
echo "  3. ssh + bash db/scripts/mark-baseline-applied.sh"
echo "  4. (optional) ssh + bash db/scripts/install-cron.sh   # daily backup at 03:00 UTC"
