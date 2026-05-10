# heuresys-evo — Current State

> Updated: 2026-05-10T20:30Z · S28-bis closed · Tech debt remediation Wave 1-13 shipped

## Last session brief

**S28+S28-bis (18:35Z → 20:25Z)** — 13 commit pushed `0191461` → `3e1edaa`. REMEDIATION-2026-05 plan eseguito autonomamente: 42/63 finding addressed, 17 residui (11 esterni capex/strategic, 6 multi-session tech). 896 test verdi (+26 vs baseline 870) + 14 conditional skip. Docker eradication completa (52 file impactati, 13 script eliminati, 4 ADR superseded, 1 nuovo ADR-0027 bare-metal test strategy).

## Top priorities S29+ (tech-only)

1. **`[ARCH-S29]` C1 Phase 2 vertical-split apply** — script bash 5-step pronto su VM `/tmp/phase16o-execute-pipeline.sh` (anche in repo `docs/_audit/_artifacts/`). Backup verificato `pre-phase16o-20260510T043706Z.dump`. ~1-2h con manual confirm gate ad ogni step. Verify post-apply: `npm run test --workspace=services/api-gateway` + smoke + mat view refresh timer.

2. **`[ADOPTION-S29]` H4 auditedTransaction sweep esteso** — 24 routes restanti api-gateway (employees.ts già done Wave 8 come pattern reference): leaves, performance-reviews, time-off, attendance, candidates, interviews, offers, requisitions, courses, enrollments, certifications, learning-paths, merit-cycles, org-units, roles, skill-assessments, skill-analytics, skills, succession, talent-intelligence, tenant-onboarding, workforce-planning, workspace, admin-tenant-schema, job-postings. ~3-5h AI velocity. Pattern lift-and-shift documentato.

3. **`[TEST-S29]` H11+H13 test extension** — H11 integration suite full (~8-12h AI velocity, oltre 5 example shipped Wave 9). H13 RLS cross-tenant test full coverage (~4-8h AI velocity, oltre 6 scenari shipped Wave 5+9).

## Other tech pending (non-priority)

- **M3** Prisma client consolidation (~2-3h refactor cross-workspace)
- **M10** TOTP UI wizard + login signIn step-up integration (~4-6h, handler già shipped Wave 10)
- **M1** Storybook 3 component data-heavy: esco-tree-navigator, kg-graph-canvas, sap-sync-panel (~1-2h)
- **LOW** Load test perf bench autocannon 8 viste auth-required, target P95 ≤500ms (~30 min)
- **H6** NextAuth v5 migration — force-wait Q3-Q4 2026 stable

## Open questions (tech)

- **postgres VM 18.3 vs ADR-0023 16.13**: confermare upgrade intenzionale + update ADR (impatta C1 STEP 5 verify Prisma client compat).

## Stack snapshot

- DBMS: invariato (S28+S28-bis Wave 11 audit read-only, NO migration applicata). postgres VM 18.3 (drift da ADR-0023 16.13)
- Code S28+S28-bis: services/app +3 endpoint API (forgot-password · TOTP setup · TOTP verify) + RBP gate sweep 6 routes · packages/ui Button + Input AAA refactor + 11 a11y unit test · services/api-gateway employees.ts auditedTransaction adoption + tests/integration + tests/security · packages/shared/test-utils/postgres-bare-metal.ts + property test
- Helpers nuovi: `requirePermissionApi` · `postgres-bare-metal.ts` · `buildActor` · TOTP setup/verify
- Tests: **896 verdi (+26 vs baseline 870)** + 14 conditional skip
- Docs: ADR-0027 NEW · 4 ADR superseded · 4 doc canonical riscritti bare-metal · `19-remediation-execution-report.md` (S28+S28-bis)
- Scripts: 13 docker-legacy eliminati in db/scripts/ (era 23, ora 10)
- Audit artifacts NEW: `docs/_audit/_artifacts/employees-dependent-views-2026-05-10.txt` + `phase16o-execute-pipeline-2026-05-10.sh`
- Repo: 13 commit aggiunti su origin/main (S28: 6 + S28-bis: 7)

## Verification

```bash
git log --oneline -15                                  # expected: 13 S28+S28-bis commit + handoff
ls db/scripts/ | wc -l                                 # expected: 10
ls docs/_audit/_artifacts/phase16o-execute-pipeline-2026-05-10.sh   # exists READY
npm run lint && npm run typecheck && npm run test:unit # expected: ALL PASS · 896 verdi
```

Riferimenti: [`docs/_audit/2026-05-10-acquisition-audit/19-remediation-execution-report.md`](../docs/_audit/2026-05-10-acquisition-audit/19-remediation-execution-report.md) (sezione 11 S28-bis) · [`docs/_audit/_artifacts/phase16o-execute-pipeline-2026-05-10.sh`](../docs/_audit/_artifacts/phase16o-execute-pipeline-2026-05-10.sh) (C1 ready) · `~/.claude/plans/mi-piacerebbe-un-dreamy-creek.md`.
