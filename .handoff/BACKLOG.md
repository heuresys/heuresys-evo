# BACKLOG — Raccomandazioni opzionali

> **Stato:** menu non vincolante. Nessuna entry qui è un debito.
> Cancellare/aggiungere liberamente. Promuovere a `STATE.md` § Debt solo se diventa intenzionalmente prioritario.
> **Non eredita automaticamente cross-session.** Se non viene toccato per 4 sprint → archiviato in `docs/90-archive/backlog/`.
>
> Vedi anche `docs/_meta/operating-baseline.md` § "Debt vs Raccomandazioni" per la regola che governa questo file.

## Perf

- **Investigazione chunk duplicate 2× 4 MB** (~2h, LOW risk) — capire se i due chunk identici da 4.01 MB visti in `services/app/.next/diagnostics/analyze` sono dedupabili. Potenziale −4 MB su tutte le route. Source: `docs/_audit/2026-05-13-bundle-perf-audit-s55.md` L77.
- **Dynamic import BrandShell** in `(app)/layout.tsx` (~1-2h, MEDIUM risk) — split client island da server layout. Potenziale split client-side chunk dalla server layout.
- **Lazy-load `dashboard-brand.css`** (3177 LOC, ~190 KB raw) — solo route `/dashboard/*` ne ha bisogno, attualmente in root layout. Pattern identico a CW-LCP1 palette-variants split (commit `354c549`).
- **Server-only Prisma boundary** (~16h, HIGH effort) — strict `import 'server-only'` per evitare leak Prisma in client bundle. Check via next.config webpack/turbopack externals.
- **LCP re-measurement `/login` su VM** dopo CW-LCP1 ship (~30min) — Lighthouse CLI crasha su Windows (`EPERM` Chrome temp). Comando documentato in `docs/_audit/2026-05-13-bundle-perf-cw-lcp1-result.md` § "LCP carry-forward note".
- **Bundle budget enforcement** — CI step blocca PR con first-load > 2 MB. Da definire soglia per route group.

## Backup / Ops

- **Backup OCI bucket schedule** (~2h) — automatizzare `pg_dump heuresys_platform` upload settimanale a `oci://heuresys-evo-backups`. Manuale shipped S60-p11. Cron+SSH+CLI. Ref ADR-0004.
- **Restore drill mensile** — runbook scaffolded in `docs/40-operations/dbms-backup-restore.md`, mai eseguito end-to-end.

## Architecture

- **`/dashboard` 4 process_\* secondary nav** (HR_DIRECTOR/HR_MANAGER) — mancano suffix `_v2` + elements seedati. Refactor incrementale ~2-3h, non-blocking. Ref CLAUDE.md "Roadmap successiva" #3.
- **pg_cron migration** future — se installato, sostituire systemd timer mat views con `cron.schedule()` row + disable unit.
- **Promote `packages/ui` non utilizzati** — data-table, hero-sections restano `available` nel catalog ma mai consumati in 10 mockup.

## Brand

- **WCAG AAA enhanced contrast** carry S54+ (4 nodi residui) — palette token rebalance, non-blocking, già AA shipped.
- **Brand-studio v2 refactor** (cycle 2) — `services/app/src/app/brand-studio/actions.ts` scrive ancora `active-theme.css` (stub post-S62). Refactor target a `tokens-foundation.css` + audit token system gestiti dal wizard. Dipende da decisioni canonical L-NN cycle 2 ancora da firmare.
- **Brand v1.0 cycle 1 promotion checklist** — archived in `.ux-design-archive-2026-05-13/08-promotion/v1.0-checklist.md`. NON è cycle 2 work item, è reference storico (rimosso da BACKLOG attivo).

## Tooling

- **`lighthouse` su Windows fix workaround** — chrome-launcher EPERM su rmSync temp. Trovare CLI flag o env var per evitare il crash, o usare lighthouse-ci Docker.
- **`npm run dev` parallel su Windows** — `--parallel` non riconosciuto da npm. Valutare `npm-run-all2` o `concurrently` come dep o lasciare workflow "3 background tasks" come canonical.
