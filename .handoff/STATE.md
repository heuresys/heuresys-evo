# heuresys-evo — Current State

> Updated: 2026-05-10T20:25Z · S28-bis closed · REMEDIATION-2026-05 Wave 7-13 shipped (post-S28 user accountability intervention)

## Last session brief (S28 + S28-bis — full session dedicated to autonomous tech debt remediation)

**S28 (18:35-19:50Z)** — 6 commit pushed `0191461` → `605f76c`. Wave 1-6: docker eradication + Bucket A-E sweep. 880 test verdi. C3 audit false-positive parziale verificato (runtime già bare-metal puro).

**S28-bis (19:50-20:25Z)** — 7 commit pushed `a9ed6df` → `f4a4459` + Wave 13 doc. User intervention "ma non sono stati risolti tutti. Perchè?" → riconoscimento R20 cautela eccessiva → S28-bis aggressive sweep autorizzato. Ulteriori 7 finding addressed, +16 test verdi (totale 896), Bucket F ridotto da 28 → 17.

- **Wave 7** (`a9ed6df`): H5 RBP UI gate sweep FULL su 6 Next.js routes (NextAuth skip)
- **Wave 8** (`d14b50a`): H4 auditedTransaction sweep employees.ts sample reference (24 routes restanti S29)
- **Wave 9** (`2465e7d`): H11 +5 integration · H13 +4 RLS · H16 +11 a11y unit (Button + Input)
- **Wave 10** (`42da287`): M10 TOTP scaffold (otplib v12 + qrcode + 5 test) + M1 wordmark stories
- **Wave 11** (`095fb30`): C1 Phase 2 audit complete — 65 dependents catalogati, view definitions saved (1812 + 155 lines), execute pipeline script ready, backup verified. Apply DEFER Enzo manual gate.
- **Wave 12** (`f4a4459`): C8 a11y annotation post-unit test + LOW (~14) triage finale (8 STRENGTH · 4 RESOLVED-by-design · 1 OUTDATED · 1 DEFER load test)

**Verdict S28-bis**: **42/63 finding addressed** (era 35/63), **17 residual Bucket F** (era 28). Di residual, 11 genuinamente esterni (capex/vendor/wait), 6 multi-session work.

## Top priorities S29+

1. **`[ARCH-S29]` C1 Phase 2 vertical-split APPLY step** (~1-2h Enzo manual) — audit completo pronto in `docs/_audit/_artifacts/`. Script bash 5-step `phase16o-execute-pipeline-2026-05-10.sh` con manual confirm gates a ogni step. Backup verificato `pre-phase16o-20260510T043706Z.dump`. Esecuzione: ssh oracle-vm-default + `sudo -u postgres bash /tmp/phase16o-execute-pipeline.sh`. Verify post-apply: test:integration + smoke + mat view refresh timer. **Note**: postgres VM è ora 18.3 (era 16.13 ADR-0023) — verificare compat in STEP 5.

2. **`[ADOPTION-S29]` H4 auditedTransaction sweep esteso** (~12-20h FTE wall = ~3-5h AI velocity) — applicare pattern S28-bis Wave 8 (employees.ts reference) ad altri 24 route api-gateway con write ops: leaves, performance-reviews, time-off, attendance, candidates, interviews, offers, requisitions, courses, enrollments, certifications, learning-paths, merit-cycles, org-units, roles, skill-assessments, skill-analytics, skills, succession, talent-intelligence, tenant-onboarding, workforce-planning, workspace, admin-tenant-schema, job-postings.

3. **`[STRATEGIC]` Decisioni audit pre-LOI** (Enzo decision-only, ≤7 giorni — invariato da S27) — 3 azioni immediate: (a) aggiungere `LICENSE` file, (b) EUIPO/UIBM trademark check "Heuresys", (c) decisione strategic legacy repo include/exclude nel deal scope.

## Open questions

- **C2 (HA €15-30k/anno) + C4 (DR €200/anno) + C8 (a11y auditor €8-15k)**: budget capex priorità?
- **H14 (Workforce orchestration 300-600h)**: build vs vendor (Temporal/Prefect)?
- **C7 (Connettori HRIS 200-400h primo)**: target vendor (Workday, SAP, BambooHR, Personio)?
- **postgres VM 18.3 vs ADR-0023 16.13**: confirma upgrade intenzionale o accidentale? Aggiornare ADR.

## Stack snapshot (changed this session)

- DBMS: invariato (S28+S28-bis Wave 11 audit read-only, NO migration applicata)
- Code: services/app +3 endpoint API (forgot-password page · TOTP setup · TOTP verify) + RBP gate sweep 6 routes · packages/ui Button + Input AAA refactor + Wave 9 a11y unit test · services/api-gateway employees.ts auditedTransaction adoption + tests/integration + tests/security · packages/shared/test-utils/postgres-bare-metal.ts + property-test
- Helpers nuovi: `requirePermissionApi` (Wave 4), `postgres-bare-metal.ts` (Wave 5), `buildActor` employees (Wave 8), TOTP setup/verify (Wave 10)
- Tests: **896 verdi (+26 vs baseline 870)** + 14 conditional skip
- Docs: ADR-0027 NEW · 4 ADR superseded/aggiornati · 4 doc canonical riscritti bare-metal · 19-remediation-execution-report.md NEW (S28+S28-bis) · audit annotated (00, 08, 16) · a11y manual checklist annotated · ADR-0023 docker-decommissioned annotated
- Scripts: 13 docker-legacy eliminati in db/scripts/ (era 23, ora 10)
- Audit artifacts NEW: `docs/_audit/_artifacts/employees-dependent-views-2026-05-10.txt` + `phase16o-execute-pipeline-2026-05-10.sh`
- Repo: 12 commit aggiunti su origin/main (S28: 0191461→605f76c · S28-bis: a9ed6df→f4a4459 + Wave 13)

## Verification

```bash
git log --oneline -14  # expected: S28-bis 7 commit + S28 6 commit + handoff
ls db/scripts/ | wc -l  # expected: 10 (post Wave 1 cleanup)
ls docs/50-reference/decisions/0027-*.md  # expected: exists
ls docs/_audit/2026-05-10-acquisition-audit/19-*.md  # exists (S28+S28-bis)
ls docs/_audit/_artifacts/phase16o-execute-pipeline-2026-05-10.sh  # exists READY for apply
npm run lint && npm run typecheck && npm run test:unit  # expected: ALL PASS · 896 verdi
```

Riferimenti: [`docs/_audit/2026-05-10-acquisition-audit/19-remediation-execution-report.md`](../docs/_audit/2026-05-10-acquisition-audit/19-remediation-execution-report.md) (sezione 11 S28-bis addendum) · [`docs/_audit/_artifacts/phase16o-execute-pipeline-2026-05-10.sh`](../docs/_audit/_artifacts/phase16o-execute-pipeline-2026-05-10.sh) (C1 Phase 2 ready for Enzo execute) · `~/.claude/plans/mi-piacerebbe-un-dreamy-creek.md` (plan REMEDIATION-2026-05).
