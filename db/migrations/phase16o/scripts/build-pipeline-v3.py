#!/usr/bin/env python3
"""
Build phase16o-pipeline-v3.sql by combining:
  - canonical plan body (db/seeds/phase16o_employees_to_view.DRAFT-DEFERRED.sql, stages 0-7)
  - DROP CASCADE 65 views (reverse topo order) — INSERTED before stage 4
  - RECREATE 65 views in topo order — INSERTED after stage 6
  - REFRESH mat views + final view-count assert — INSERTED at end

Single BEGIN/COMMIT transaction.

Run locally (no DB access required). Input: artifacts from S30 + canonical plan.
Output: db/migrations/phase16o/artifacts-v3/phase16o-pipeline-v3.sql
"""
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
ART_V2 = REPO / "db" / "migrations" / "phase16o" / "artifacts"
ART_V3 = REPO / "db" / "migrations" / "phase16o" / "artifacts-v3"
ART_V3.mkdir(parents=True, exist_ok=True)
CANON = REPO / "db" / "seeds" / "phase16o_employees_to_view.DRAFT-DEFERRED.sql"

# Load topo order
topo = (ART_V2 / "topo-order.txt").read_text(encoding="utf-8").strip().split("\n")
print(f"Topo order: {len(topo)} views")

# Load views-list to get kind (v/m)
views_kind = {}
for line in (ART_V2 / "views-list.txt").read_text(encoding="utf-8").strip().split("\n"):
    full, kind = line.split("|")
    views_kind[full] = kind

# Load defs.sql to extract CREATE OR REPLACE VIEW blocks per view
defs = (ART_V3 / "defs.sql").read_text(encoding="utf-8")
view_blocks = {}
# Parse defs.sql: blocks delimited by "-- VIEW xxx" or "-- MATVIEW xxx"
current = None
buf = []
for line in defs.split("\n"):
    m = re.match(r"-- (?:VIEW|MATVIEW) (.+)$", line)
    if m:
        if current:
            view_blocks[current] = "\n".join(buf).rstrip()
        current = m.group(1)
        buf = []
    elif current is not None:
        buf.append(line)
if current:
    view_blocks[current] = "\n".join(buf).rstrip()

print(f"Parsed {len(view_blocks)} view blocks from defs.sql")

# Load canonical plan, strip outer BEGIN/COMMIT
canon = CANON.read_text(encoding="utf-8")
# Strip the "BEGIN;" line and the trailing COMMIT;
canon_body = canon
# Remove first occurrence of "BEGIN;" (after header)
canon_body = re.sub(r"^BEGIN;\s*$", "-- BEGIN handled by pipeline-v3 wrapper", canon_body, count=1, flags=re.MULTILINE)
# Remove last "COMMIT;"
canon_body = re.sub(r"^COMMIT;\s*$", "-- COMMIT handled by pipeline-v3 wrapper", canon_body, count=1, flags=re.MULTILINE)

# Build DROP CASCADE block (reverse topo)
drop_lines = []
drop_lines.append("-- ═══════════════════════════════════════════════════════════════════════════")
drop_lines.append("-- INSERTED by pipeline-v3: DROP CASCADE 65 dependent views BEFORE stage 4 DROP COLUMN")
drop_lines.append("-- Reverse topological order — most dependent first")
drop_lines.append("-- ═══════════════════════════════════════════════════════════════════════════")
for v in reversed(topo):
    obj = "MATERIALIZED VIEW" if views_kind.get(v) == 'm' else "VIEW"
    drop_lines.append(f"DROP {obj} IF EXISTS {v} CASCADE;")
drop_lines.append("")

# Build RECREATE block (forward topo)
recreate_lines = []
recreate_lines.append("-- ═══════════════════════════════════════════════════════════════════════════")
recreate_lines.append("-- INSERTED by pipeline-v3: RECREATE 65 views AFTER VIEW employees + INSTEAD OF triggers")
recreate_lines.append("-- Forward topological order — deps first, dependents last")
recreate_lines.append("-- All defs already reference 'employees' (which is now the VIEW joining core+satellites)")
recreate_lines.append("-- ═══════════════════════════════════════════════════════════════════════════")
for v in topo:
    if v in view_blocks:
        recreate_lines.append(f"-- {v}")
        recreate_lines.append(view_blocks[v])
        recreate_lines.append("")
    else:
        recreate_lines.append(f"-- MISSING DDL for {v}")
        recreate_lines.append("")

# Build REFRESH block
refresh_lines = []
refresh_lines.append("-- ═══════════════════════════════════════════════════════════════════════════")
refresh_lines.append("-- INSERTED by pipeline-v3: REFRESH mat views + final view-count assert")
refresh_lines.append("-- ═══════════════════════════════════════════════════════════════════════════")
for v, k in views_kind.items():
    if k == 'm':
        refresh_lines.append(f"REFRESH MATERIALIZED VIEW {v};")
refresh_lines.append("")
refresh_lines.append("-- Verify all 65 phase16o views recreated successfully")
refresh_lines.append("DO $$")
refresh_lines.append("DECLARE v_count integer;")
refresh_lines.append("BEGIN")
refresh_lines.append("  SELECT count(*) INTO v_count FROM (")
refresh_lines.append("    SELECT schemaname || '.' || viewname AS name FROM pg_views")
refresh_lines.append("    UNION ALL")
refresh_lines.append("    SELECT schemaname || '.' || matviewname FROM pg_matviews")
refresh_lines.append("  ) v WHERE v.name = ANY(ARRAY[")
for v in topo:
    suffix = "" if v == topo[-1] else ","
    refresh_lines.append(f"    '{v}'{suffix}")
refresh_lines.append("  ]);")
refresh_lines.append("  IF v_count != 65 THEN")
refresh_lines.append("    RAISE EXCEPTION 'phase16o pipeline-v3 final: only % of 65 dependent views recreated', v_count;")
refresh_lines.append("  END IF;")
refresh_lines.append("  RAISE NOTICE 'phase16o pipeline-v3: 65/65 dependent views recreated successfully';")
refresh_lines.append("END;")
refresh_lines.append("$$;")
refresh_lines.append("")

# Now assemble: header + BEGIN + (canon stages 0-3) + DROP block + (canon stages 4-6) + RECREATE block + REFRESH block + (canon stage 7) + COMMIT

# Find insertion points in canon_body
# 1. After stage 3 (RENAME TO employees_core) — before stage 4 (DROP COLUMN)
#    Actually, the 65 views DROP must happen BEFORE the stage 3 RENAME? No — DROP CASCADE is on views referencing the table cols, so:
#    - If we DROP views first, then RENAME, then DROP COLUMN works
#    - If we RENAME first, the views still reference 'employees' (no longer exists) — they'd auto-update? Actually PostgreSQL updates view references when table is RENAMEd.
#    Best to DROP views BEFORE stage 4 (DROP COLUMN), AFTER stage 3 (RENAME). That way the RENAME doesn't break the views, but stage 4 has them out of the way.
# 2. After stage 6 (INSTEAD OF triggers) — before stage 7 (final asserts)

# Strategy: split canon_body at marker lines
# Marker for DROP block insertion: line containing "-- 4. DROP 77 redundant columns"
# Marker for RECREATE block insertion: line containing "-- 7. Verification asserts"

drop_marker = "-- 4. DROP 77 redundant columns from employees_core"
recreate_marker = "-- 7. Verification asserts (final)"

assert drop_marker in canon_body, f"DROP marker not found in canon_body"
assert recreate_marker in canon_body, f"RECREATE marker not found in canon_body"

drop_idx = canon_body.index(drop_marker)
recreate_idx = canon_body.index(recreate_marker)

pre_drop = canon_body[:drop_idx]
between = canon_body[drop_idx:recreate_idx]
post_recreate = canon_body[recreate_idx:]

# Compose pipeline-v3
header = """-- ═══════════════════════════════════════════════════════════════════════════
-- phase16o-pipeline-v3.sql — employees vertical-split Phase 2 (S31 pre-flight)
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Composition:
--   - canonical plan: db/seeds/phase16o_employees_to_view.DRAFT-DEFERRED.sql
--   - + INSERTED: DROP CASCADE 65 views (reverse topo) before stage 4 DROP COLUMN
--   - + INSERTED: RECREATE 65 views (forward topo) after stage 6 INSTEAD OF triggers
--   - + INSERTED: REFRESH mat views + final assert
--   - all wrapped in single BEGIN/COMMIT transaction
--
-- Usage (DRY-RUN on temp DB):
--   psql -d heuresys_phase16o_test -f phase16o-pipeline-v3.sql
--
-- Usage (APPLY PROD — requires explicit sign-off):
--   1. Verify backup sha256: dba5a08b…
--   2. Maintenance window coordinated with systemd mat view refresh timer (4h UTC)
--   3. psql -d heuresys_platform -1 -v ON_ERROR_STOP=on -f phase16o-pipeline-v3.sql
--   4. Post-apply: run npm test --workspaces
--
-- Generated by: db/migrations/phase16o/scripts/build-pipeline-v3.py
-- ═══════════════════════════════════════════════════════════════════════════

\\set ON_ERROR_STOP on
\\timing on

BEGIN;

"""

pipeline_v3 = (
    header
    + pre_drop
    + "\n".join(drop_lines)
    + "\n"
    + between
    + "\n".join(recreate_lines)
    + "\n"
    + "\n".join(refresh_lines)
    + "\n"
    + post_recreate
    + "\n\nCOMMIT;\n"
)

out = ART_V3 / "phase16o-pipeline-v3.sql"
out.write_text(pipeline_v3, encoding="utf-8")
print(f"pipeline-v3.sql: {len(pipeline_v3.splitlines())} lines, {len(pipeline_v3)} bytes")
print(f"  Output: {out}")
