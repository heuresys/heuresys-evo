# heuresys-evo — Current State

> Updated: 2026-05-10T19:50Z · S28 closed · REMEDIATION-2026-05 docker-eradication + tech debt remediation Wave 1-5 shipped

## Last session brief (S28 — full session dedicated to autonomous tech debt remediation)

**S28 (18:35-19:50Z)** — 5 commit pushed `0191461` → `8385799` → `b4ee82b` → `d7112a4` → `19f9b24`. Remediation autonoma del 35/63 finding ACQ-AUDIT-2026-05 (Bucket A-E) eseguita senza interruzioni. 880 test verdi (+10 vs baseline 870). Direttiva utente "no Docker, solo bare-metal" applicata sistematicamente: 13 script docker-legacy eliminati, 4 ADR superseded, 1 nuovo ADR-0027 bare-metal test strategy.

- **Wave 1** (`0191461`): Docker eradication + doc cleanup. 36 file: 393 ins, 2276 del. Direttiva esplicita user. C3 audit verificato false-positive parziale.
- **Wave 2** (`8385799`): Config/CI fixes. H7 CSP enforce flip · H12 coverage gate CI + Postgres bare-metal install · M2 next-themes · M5 stryker · M6 fast-check + property test · M9 Input label + forgot-password.
- **Wave 3** (`b4ee82b`): UI component. H8 RSC boundaries route group · H10 Button AAA h-11/h-12 (44/48px) · H9 NO-OP.
- **Wave 4** (`d7112a4`): Code adoption scaffold. H5 `requirePermissionApi` helper + 6 test. H4 reality check (auditedDashboardMutation GIÀ adopted).
- **Wave 5** (`19f9b24`): Test scaffolding. H11 postgres-bare-metal helper · H13 RLS cross-tenant 2 scenari · ADR-0027 helper integration. 5 conditional skip pronti per CI con DB.

**Verdict S28**: Wave 6 documentation (questa STATE.md + `19-remediation-execution-report.md`) — Bucket F (28 finding strategic/capex/multi-session) carry-forward S29+.

## Top priorities S29+

1. **`[ARCH-S29]` § 1.2 vertical-split Phase 2 + 65 view audit** (~15-25h FTE — invariato da S26+S28) — sequenza: audit 65 view via `pg_depend`, salva definitions, DROP CASCADE, apply `phase16o_employees_to_view.DRAFT-DEFERRED.sql`, ricreare 65 view refactorate, verify mat view + 12 hot view. Backup pre-attempt: `heuresys_platform-pre-phase16o-20260510T044105Z.dump`. **Ora prioritario** (C1 acquirer Condition Precedent).

2. **`[ADOPTION-S29]` H4+H5 sweep esteso** (~20-36h FTE) — applicare `auditedTransaction()` a tutte le write ops api-gateway routes (~20-40 call sites) + applicare `requirePermissionApi(area, action)` helper Wave 4 a 7 Next.js routes. Multi-session work, richiede review per ogni endpoint per area mapping corretto.

3. **`[STRATEGIC]` Decisioni audit pre-LOI** (Enzo decision-only, ≤7 giorni — invariato da S27) — 3 azioni immediate: (a) aggiungere `LICENSE` file, (b) EUIPO/UIBM trademark check "Heuresys" + registration se gap, (c) decisione strategic legacy repo include/exclude nel deal scope. Ref: `docs/_audit/2026-05-10-acquisition-audit/18-open-questions-suggested-answers.md`.

## Open questions

- **C2 (HA infra €15-30k/anno) + C4 (DR off-site €200/anno) + C8 (a11y auditor €8-15k)**: budget capex Enzo per quali sbloccare prima?
- **H14 (Workforce orchestration 300-600h)**: build in-house vs vendor (Temporal/Prefect)?
- **H6 (NextAuth v5 migration)**: aspettare v5 stable Q3-Q4 2026 oppure pinnare a v4 LTS quando esce?
- **C7 (Connettori HRIS 200-400h primo)**: quale primo target (Workday, SAP SuccessFactors, BambooHR, Personio)?

## Stack snapshot (changed this session)

- DBMS: **invariato** dal S26 (zero migration applicate, zero schema changes, S28 read-only su DB)
- Code: services/app +1 page (forgot-password placeholder), packages/ui Button + Input AAA refactor, services/api-gateway middleware/security.ts CSP enforce flip, +2 helper packages/shared/src/test-utils/postgres-bare-metal.ts + services/app/src/lib/authorize-api.ts
- Tests: **880 verdi (+10 vs baseline 870)** + 5 conditional skip
- Docs: `docs/_audit/2026-05-10-acquisition-audit/19-remediation-execution-report.md` NEW + ADR-0027 NEW + 4 ADR superseded/annotated + 4 doc canonical riscritti (deploy-evo, incident-runbook, db/README, infra/README)
- Scripts: 13 script docker-legacy eliminati in `db/scripts/` (era 23 → ora 10 essenziali: backup/restore/setup/test-restore/sql/rls-coverage/reset-test/mark-baseline)
- Memory: nessun update (remediation work non ha richiesto memoria persistente cross-session)
- Repo: 5 commit aggiunti su origin/main (`0191461`, `8385799`, `b4ee82b`, `d7112a4`, `19f9b24`)

## Verification

```bash
git log --oneline -8  # expected: S28 5 commit + S27 4 commit
ls db/scripts/ | wc -l  # expected: 10 (post Wave 1 cleanup)
ls docs/50-reference/decisions/0027-*.md  # expected: exists
ls docs/_audit/2026-05-10-acquisition-audit/19-*.md  # expected: exists
npm run lint && npm run typecheck && npm run test:unit  # expected: ALL PASS · 880 verdi
grep -rli "docker" --include="*.md" docs/40-operations docs/30-developer | grep -v _audit  # expected: zero
```

Riferimenti: [`docs/_audit/2026-05-10-acquisition-audit/19-remediation-execution-report.md`](../docs/_audit/2026-05-10-acquisition-audit/19-remediation-execution-report.md) · [`docs/_audit/2026-05-10-acquisition-audit/16-final-decision-brief.md`](../docs/_audit/2026-05-10-acquisition-audit/16-final-decision-brief.md) (decision brief signed + post-S28 annotation) · `~/.claude/plans/mi-piacerebbe-un-dreamy-creek.md` (plan REMEDIATION-2026-05 eseguito 100% Bucket A-E).
