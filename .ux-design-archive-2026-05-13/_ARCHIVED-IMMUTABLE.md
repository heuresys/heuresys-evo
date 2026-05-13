# ARCHIVED — IMMUTABLE — 2026-05-13 (S62)

> Cycle 1 brand identity & design workstream — archived as immutable reference post-S62 reset.

## Status

**FROZEN · READ-ONLY · NON-CANONICAL**

Questo archivio contiene l'intero workstream brand identity & design system di Heuresys EVO accumulato dalla S22 alla S61 (10 giorni operativi, 2026-05-04 → 2026-05-13). È stato consolidato in archivio durante S62 (commit `<TBD>`) come parte del reset radicale dichiarato in **ADR-0032 `brand-design-reset-cycle-2.md`**.

## Cosa contiene

- **`01-strategy/`** — Brand foundations, 5 personas (HR Director, IT Admin, Line Manager, Employee, Superuser), audience positioning, dashboard architecture
- **`02-aesthetic/`** — 32 direzioni esplorate Set 1-4 (tutte scartate) + 5 direzioni Set 5 legacy overlay (μ-architect-legacy selezionata in L19) + theme framework runtime + logo standard
- **`03-visual-identity/`** — Asset visual library (logo, colori, typography reference)
- **`04-motion-language/`** — 5 prototipi animati HTML + SoT motion-final.md
- **`05-theme-variants/`** — W3C DTCG tokens (tokens-dark.json, tokens-light.json, tokens-motion.json)
- **`06-mockups/dashboards/`** — 5 dashboard HTML canonici + 2 carry-forward
- **`07-brand-book/`** — BRAND-BOOK-v0.md (15 sezioni canoniche)
- **`08-promotion/`** — v1.0-checklist.md (14 categorie, 14/14 ✅) + promotion-candidates.md + brand-dashboard-catalog-CURRENT-STATE.md (audit L40)
- **`09-asset-showcase/`** — Webapp Express+Prisma+SQLite locale (346 asset, 138 promoted, 11 dashboardCode `*_v2`)
- **`10-staging/`** — Empty (`.gitkeep`)
- **`99-samples/`** — Read-only reference library integrata L14 (12 spec YAML, 8 framework prosa, 6 workflow templates)
- **`audit/`** — Forensic QA (AUDIT-GRID, BASELINE-REPORT)

## Governance

- **`BRAND-STATE.md`** — Phase 15.F final state (Phase 1-15 tutte chiuse)
- **`DECISIONS-LOG.md`** — 87 entry L1-L87 cycle 1 (3 supersedute: L6→L11, L9→L11, L10→L11)
- **`SESSION-RESUME.md`** — Vecchio protocollo 8-step
- **`README.md`** — Policy segregazione cycle 1

## Cosa NON fare

❌ Non modificare file in questa directory
❌ Non importare in production code
❌ Non eseguire skill brand-resume puntando qui
❌ Non promuovere asset da qui in produzione

## Cosa fare se serve materia prima

✅ Lettura per audit storico / context comprensione
✅ Estrazione manuale di singole decisioni per ri-affermazione esplicita in cycle 2
✅ Consultazione mockup HTML per ispirazione cycle 2
✅ Estrazione SQLite `09-asset-showcase/data.db` se serve consultare il catalog (read-only)

## SoT corrente

`.ux-design/` (cycle 2) — vedi `.ux-design/README.md`.

## Migration audit

Audit selettivo L1-L87 cycle 1 → cycle 2 in `.ux-design/04-promotion/decision-migration-audit.md`. Decisioni con outcome `MIGRATE` ri-affermate esplicitamente come L1-LN nuovi nel `.ux-design/DECISIONS-LOG-v2.md`.

## References

- ADR-0032 `docs/50-reference/decisions/ADR-0032-brand-design-reset-cycle-2.md` — charter del reset
- Plan canonical S62 `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`
- Tag safety `pre-reset-s62` + branch `backup/pre-reset-s62` per rollback completo se necessario
