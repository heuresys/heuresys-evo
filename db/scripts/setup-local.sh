#!/bin/bash
# Setup PostgreSQL 16 + pgvector + database role and DB on local host (bare-metal).
# Supports macOS (Homebrew) and Ubuntu/Debian (apt).
#
# Usage: bash db/scripts/setup-local.sh
# Override defaults via env: DB_NAME, DB_USER, DB_PASSWORD

set -euo pipefail

DB_NAME="${DB_NAME:-heuresys_platform}"
DB_USER="${DB_USER:-heuresys}"
DB_PASSWORD="${DB_PASSWORD:-heuresys}"
BACKUP_USER="${BACKUP_USER:-heuresys_backup}"
BACKUP_PASSWORD="${BACKUP_PASSWORD:-heuresys}"

OS="$(uname -s)"
case "$OS" in
  Darwin)
    echo "[setup-local] Detected macOS. Installing PostgreSQL 16 + pgvector via Homebrew..."
    if ! command -v brew >/dev/null 2>&1; then
      echo "ERROR: Homebrew not found. Install from https://brew.sh first." >&2
      exit 1
    fi
    brew install postgresql@16 pgvector
    brew services start postgresql@16
    sleep 2
    PSQL_SUPER="psql -d postgres"
    ;;
  Linux)
    echo "[setup-local] Detected Linux. Installing PostgreSQL 16 + pgvector via apt..."
    if ! command -v apt >/dev/null 2>&1; then
      echo "ERROR: apt not found. This script supports Debian/Ubuntu. For other distros, install Postgres 16 + pgvector manually." >&2
      exit 1
    fi
    sudo apt update
    sudo apt install -y postgresql-16 postgresql-16-pgvector
    sudo systemctl enable --now postgresql
    PSQL_SUPER="sudo -u postgres psql"
    ;;
  *)
    echo "ERROR: unsupported OS: $OS" >&2
    echo "  - macOS / Linux: this script" >&2
    echo "  - OCI VM (Ubuntu 24.04 ARM64): use db/scripts/setup-vm.sh" >&2
    echo "  - Windows: install Postgres 16 + pgvector manually via the official installer" >&2
    exit 1
    ;;
esac

echo "[setup-local] Creating role '$DB_USER' (if not exists)..."
$PSQL_SUPER <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;
SQL

echo "[setup-local] Creating database '$DB_NAME' (if not exists)..."
$PSQL_SUPER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
  $PSQL_SUPER -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo "[setup-local] Enabling pgvector extension in '$DB_NAME'..."
$PSQL_SUPER -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS vector;"

echo "[setup-local] Creating backup role '$BACKUP_USER' (BYPASSRLS, read-only)..."
$PSQL_SUPER <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$BACKUP_USER') THEN
    CREATE ROLE $BACKUP_USER WITH LOGIN PASSWORD '$BACKUP_PASSWORD' BYPASSRLS;
  END IF;
END
\$\$;
SQL
$PSQL_SUPER -d "$DB_NAME" <<SQL
GRANT CONNECT ON DATABASE $DB_NAME TO $BACKUP_USER;
SQL

# Grant SELECT across ALL non-system schemas, present and future. The FOR ROLE
# clause is mandatory: tables created by the application role $DB_USER (which
# applies migrations) inherit default privileges only if the ALTER targets that
# specific role.
SCHEMAS=$($PSQL_SUPER -d "$DB_NAME" -tAc "SELECT nspname FROM pg_namespace WHERE nspname NOT IN ('pg_catalog','information_schema','pg_toast') AND nspname NOT LIKE 'pg_temp%' AND nspname NOT LIKE 'pg_toast_temp%';")
for SCHEMA in $SCHEMAS; do
  echo "[setup-local]   granting SELECT to $BACKUP_USER on schema '$SCHEMA' (current + future)..."
  $PSQL_SUPER -d "$DB_NAME" <<SQL
GRANT USAGE ON SCHEMA "$SCHEMA" TO $BACKUP_USER;
GRANT SELECT ON ALL TABLES IN SCHEMA "$SCHEMA" TO $BACKUP_USER;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA "$SCHEMA" TO $BACKUP_USER;
ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA "$SCHEMA" GRANT SELECT ON TABLES TO $BACKUP_USER;
ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA "$SCHEMA" GRANT SELECT ON SEQUENCES TO $BACKUP_USER;
SQL
done

echo ""
echo "[setup-local] Done. Roles created:"
echo "  - $DB_USER          (application role, RLS-enforced)"
echo "  - $BACKUP_USER      (backup role, BYPASSRLS, read-only)"
echo ""
echo "Connection string:"
echo "  postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
echo "Next steps:"
echo "  1. bash db/scripts/restore-baseline.sh       (restore v1 baseline dump)"
echo "  2. bash db/scripts/mark-baseline-applied.sh  (mark 0001_baseline as applied)"
echo "  3. npm run db:migrate                         (apply any future migrations 0002+)"
