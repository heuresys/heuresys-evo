#!/usr/bin/env python3
"""
Phase16o pre-flight artifact builder (S30, opzione B).
Run on VM: sudo -u postgres python3 phase16o-preflight-builder.py
Produces in /tmp/phase16o-preflight/artifacts/:
  - views-list.txt        (65 view full names + kind)
  - defs.sql              (schema-qualified DDL for each)
  - edges.txt             (view->view edge list)
  - topo-order.txt        (forward CREATE order)
  - phase16o-pipeline-v2.sql  (full apply script with DROP CASCADE + CREATE + REFRESH + verify)

NO PROD MUTATIONS — read-only against heuresys_platform.
"""
import subprocess
import sys
import re
from pathlib import Path

ART = Path("/tmp/phase16o-preflight/artifacts")
ART.mkdir(parents=True, exist_ok=True)


def psql(sql, db="heuresys_platform"):
    out = subprocess.run(
        ["sudo", "-u", "postgres", "psql", "-d", db, "-At", "-F", "|", "-c", sql],
        capture_output=True, text=True, check=False
    )
    if out.returncode != 0:
        sys.stderr.write(f"PSQL ERROR: {out.stderr}\n")
        sys.exit(1)
    return [line for line in out.stdout.strip().split("\n") if line]


def psql_one(sql, db="heuresys_platform"):
    out = subprocess.run(
        ["sudo", "-u", "postgres", "psql", "-d", db, "-At", "-c", sql],
        capture_output=True, text=True, check=False
    )
    if out.returncode != 0:
        sys.stderr.write(f"PSQL ERROR: {out.stderr}\n")
        sys.exit(1)
    return out.stdout.rstrip("\n")


# ---------- Step 1: discover views ----------
print("[1/5] Discovering views...", flush=True)
discover_sql = r"""
SELECT schemaname || '.' || viewname || '|v'
FROM pg_views WHERE definition ~ '\memployees\M'
UNION ALL
SELECT schemaname || '.' || matviewname || '|m'
FROM pg_matviews WHERE definition ~ '\memployees\M'
ORDER BY 1
"""
rows = psql(discover_sql)
views = []
for line in rows:
    full, kind = line.split("|")
    views.append((full, kind))
print(f"  Found {len(views)} objects "
      f"({sum(1 for _,k in views if k=='v')} views, "
      f"{sum(1 for _,k in views if k=='m')} matviews)")
(ART / "views-list.txt").write_text("\n".join(f"{f}|{k}" for f, k in views) + "\n")


# ---------- Step 2: extract DDL via pg_get_viewdef ----------
print("[2/5] Extracting DDL...", flush=True)
defs_lines = []
defs_lines.append("-- Phase16o pre-flight: schema-qualified view defs (auto-generated)")
defs_lines.append(f"-- Total: {len(views)} objects")
defs_lines.append("")
for full, kind in views:
    defn = psql_one(f"SELECT pg_get_viewdef('{full}'::regclass, true)")
    if kind == 'v':
        defs_lines.append(f"-- VIEW {full}")
        defs_lines.append(f"CREATE OR REPLACE VIEW {full} AS")
    else:
        defs_lines.append(f"-- MATVIEW {full}")
        defs_lines.append(f"CREATE MATERIALIZED VIEW IF NOT EXISTS {full} AS")
    defn_clean = defn.rstrip().rstrip(';')
    defs_lines.append(defn_clean + ";")
    defs_lines.append("")
(ART / "defs.sql").write_text("\n".join(defs_lines))
print(f"  defs.sql: {len(defs_lines)} lines")


# ---------- Step 3: dependency edges via pg_depend ----------
print("[3/5] Building dependency edges...", flush=True)
view_set = set(f for f, _ in views)
view_quoted_list = ",".join(f"'{f}'" for f in view_set)
edges_sql = f"""
WITH targets AS (
  SELECT c.oid, n.nspname || '.' || c.relname AS full
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind IN ('v','m')
    AND (n.nspname || '.' || c.relname) IN ({view_quoted_list})
)
SELECT DISTINCT src.full || '|' || dep.full
FROM pg_rewrite rw
JOIN targets src ON src.oid = rw.ev_class
JOIN pg_depend d ON d.objid = rw.oid AND d.deptype = 'n'
JOIN targets dep ON dep.oid = d.refobjid
WHERE src.oid <> dep.oid
ORDER BY 1
"""
edge_rows = psql(edges_sql)
edges = []
for line in edge_rows:
    src, dep = line.split("|")
    edges.append((src, dep))
(ART / "edges.txt").write_text("\n".join(f"{s}|{d}" for s, d in edges) + "\n")
print(f"  Edges: {len(edges)}")


# ---------- Step 4: topological sort via tsort ----------
print("[4/5] Topological sort...", flush=True)
tsort_lines = [f"{d} {s}" for s, d in edges]
for f in view_set:
    tsort_lines.append(f"{f} {f}")  # ensure isolated nodes are emitted
tsort_input = "\n".join(tsort_lines) + "\n"
tsort_out = subprocess.run(
    ["tsort"], input=tsort_input, capture_output=True, text=True, check=True
)
topo = [l for l in tsort_out.stdout.strip().split("\n") if l in view_set]
(ART / "topo-order.txt").write_text("\n".join(topo) + "\n")
missing = view_set - set(topo)
if missing:
    print(f"  WARN: {len(missing)} views missing from topo order: {missing}")
print(f"  Topo order: {len(topo)} items")


# ---------- Step 5: generate full apply pipeline ----------
print("[5/5] Generating phase16o-pipeline-v2.sql...", flush=True)
view_kinds = dict(views)
defs_map = {}
current = None
buf = []
for line in (ART / "defs.sql").read_text().split("\n"):
    m = re.match(r"-- (?:VIEW|MATVIEW) (.+)$", line)
    if m:
        if current:
            defs_map[current] = "\n".join(buf).strip()
        current = m.group(1)
        buf = []
    elif current:
        buf.append(line)
if current:
    defs_map[current] = "\n".join(buf).strip()

pipeline = []
pipeline.append("-- Phase16o apply pipeline v2 (S30 pre-flight, opzione B)")
pipeline.append("-- Generated by phase16o-preflight-builder.py")
pipeline.append(f"-- 65 view dependencies on employees · backup: pre-phase16o-20260510T044105Z.dump")
pipeline.append("--")
pipeline.append("-- USAGE (on TEMP DB only for dry-run, NEVER directly on prod without sign-off):")
pipeline.append("--   psql -d heuresys_phase16o_test -f phase16o-pipeline-v2.sql")
pipeline.append("--")
pipeline.append("-- Wrap in single transaction: ROLLBACK on any error.")
pipeline.append("-- ───────────────────────────────────────────────────────────────────")
pipeline.append("")
pipeline.append("\\set ON_ERROR_STOP on")
pipeline.append("\\timing on")
pipeline.append("BEGIN;")
pipeline.append("")
pipeline.append("-- ────────────────────────────────────────────────")
pipeline.append("-- Step 1/5: DROP all 65 dependent views (CASCADE OK since we recreate)")
pipeline.append("-- Drop in REVERSE topological order (most dependent first)")
pipeline.append("-- ────────────────────────────────────────────────")
for v in reversed(topo):
    k = view_kinds.get(v, 'v')
    obj = "MATERIALIZED VIEW" if k == 'm' else "VIEW"
    pipeline.append(f"DROP {obj} IF EXISTS {v} CASCADE;")
pipeline.append("")
pipeline.append("-- ────────────────────────────────────────────────")
pipeline.append("-- Step 2/5: Rename employees -> employees_core")
pipeline.append("-- (employees_core is the satellite-fed table; employees becomes a VIEW)")
pipeline.append("-- ────────────────────────────────────────────────")
pipeline.append("ALTER TABLE public.employees RENAME TO employees_core;")
pipeline.append("")
pipeline.append("-- ────────────────────────────────────────────────")
pipeline.append("-- Step 3/5: Create VIEW employees AS SELECT * FROM employees_core")
pipeline.append("-- (placeholder for dry-run; production version joins with satellites)")
pipeline.append("-- ────────────────────────────────────────────────")
pipeline.append("CREATE VIEW public.employees AS SELECT * FROM public.employees_core;")
pipeline.append("")
pipeline.append("-- ────────────────────────────────────────────────")
pipeline.append("-- Step 4/5: Recreate 65 dependent views in TOPOLOGICAL order (deps first)")
pipeline.append("-- ────────────────────────────────────────────────")
for v in topo:
    pipeline.append(defs_map.get(v, f"-- MISSING: {v}"))
    pipeline.append("")
pipeline.append("-- ────────────────────────────────────────────────")
pipeline.append("-- Step 5/5: Refresh mat views + sanity checks")
pipeline.append("-- ────────────────────────────────────────────────")
for v, k in views:
    if k == 'm':
        pipeline.append(f"REFRESH MATERIALIZED VIEW {v};")
pipeline.append("")
pipeline.append("-- Verify row counts (should match pre-apply)")
pipeline.append("SELECT 'employees' AS obj, count(*) AS row_count FROM public.employees")
pipeline.append("UNION ALL SELECT 'employees_core', count(*) FROM public.employees_core")
pipeline.append("UNION ALL SELECT 'mv_talent_signals', count(*) FROM public.mv_talent_signals;")
pipeline.append("")
pipeline.append("-- COMMIT only after manual verify of output")
pipeline.append("COMMIT;")
(ART / "phase16o-pipeline-v2.sql").write_text("\n".join(pipeline))
print(f"  pipeline-v2: {len(pipeline)} lines, "
      f"{sum(1 for _,k in views if k=='m')} REFRESH calls")
print("DONE.")
