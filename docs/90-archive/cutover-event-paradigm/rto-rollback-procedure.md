# RTO + Rollback Procedure (RTG Phase 5 task 5.8)

**Date**: 2026-05-01
**Status**: validated via dry-run (script `scripts/cutover/dry-run-cutover.sh`)
**Target RTO**: ≤ 5 minutes (300 seconds) end-to-end legacy → evo cutover
**Rollback window**: 48 hours post-cutover

## RTO definition

RTO (Recovery Time Objective) = time from "stop legacy" to "evo serving 100%
production traffic with all smoke transactions green".

Legacy stop window includes:

- DNS TTL pre-cutover lower (24h prior, OA 6.1) → sub-minute propagation expected
- Connection drain wait: ~5min worst-case (long-poll / SSE)
- Evo smoke verification: ~30s (4 endpoint probes)
- Total target: ≤ 5min

## Cutover procedure (production)

### Pre-cutover (T-24h)

1. Owner-action OA-6.1 — DNS TTL evo.heuresys.com lowered to 60s
2. Owner-action OA-6.2 — Stakeholder communication (banner + email)
3. Pre-cutover checklist signed off (`docs/cutover/pre-cutover-checklist.md`)
4. Last data sync legacy → evo (PC SoT push if needed)

### Cutover (T0)

1. **T0**: emit `[CUTOVER] start` to ops channel + start RTO timer
2. **T0+10s**: stop legacy systemd unit / docker-compose stop legacy
3. **T0+60s**: wait for legacy connection drain (websocket/SSE/long-poll)
4. **T0+90s**: update DNS A record evo.heuresys.com → VM public IP (already
   correct from OA-1.3, but verify); some DNS providers also need TTL
   re-confirmation
5. **T0+120s**: smoke evo via curl https://evo.heuresys.com/health (must 200)
6. **T0+150s**: smoke evo via UI on test browser (login + dashboard)
7. **T0+180s**: emit `[CUTOVER] complete` to ops channel + stop RTO timer
8. **T0+24h-48h**: monitor evo logs, error rate, performance

### Rollback procedure (within 48h post-cutover)

If critical issue surfaces in the 48h window:

1. **DNS revert**: A record evo.heuresys.com → legacy VM IP (or maintain
   legacy.heuresys.com → legacy IP and update evo DNS to alias)
2. **Restart legacy**: systemctl start legacy units (or docker-compose up -d)
3. **Verify legacy /health = 200**
4. **Comm**: emit `[CUTOVER] rolled back, reason=<X>` to stakeholders
5. **Investigate**: capture evo state for postmortem; do NOT delete evo data
6. **Decide**: re-attempt cutover after fix or postpone

### Post 48h window

Rollback NO LONGER possible automatically:

- Evo has new transactions (leaves submitted, audit logs accumulated, tenant
  schema versions bumped)
- Legacy is stale; merging back would require complex data reconciliation

After 48h, only forward fix possible; legacy decommission can begin (RTG
Phase 6 task 6.10, still owner-deferred since OCI bucket policy).

## Validation evidence

### Dry-run (RTG task 5.7)

Script `scripts/cutover/dry-run-cutover.sh` exercises the full sequence on
the VM without touching real DNS:

- Steps 1-4 measure RTO inline
- Step 5 reverts /etc/hosts override + restarts legacy
- HTML report at `/tmp/dry-run-cutover-<TS>.html`

Pass criterion: RTO ≤ 300s + legacy back to 200 post-rollback.

### Cross-system smoke (RTG task 5.5)

Script `scripts/cutover/cross-system-transactions.sh` runs 10 business
transactions and emits a side-by-side report. Used in cutover Step 5-6 + in
post-cutover monitoring.

### Performance benchmark (RTG task 5.6)

Script `scripts/cutover/perf-benchmark.sh` measures p95 latency on 10
endpoints with `ab` (Apache Bench). Pass criterion: evo p95 / legacy p95 ≤ 1.2.
Triggers STOP-AUTONOMO-5 if any endpoint regresses > 1.2×.

## Known risks + mitigations

| Risk                                                 | Mitigation                                                                                    |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| DNS TTL still cached at some ISPs                    | OA-6.1 lower TTL 24h prior + accept 1-2 min propagation                                       |
| Long-running enrichment job interrupted              | Stop window = 5 min handles BullMQ in-flight; jobs requeued on worker restart                 |
| Session cookie domain mismatch                       | Both stacks use AUTH_SECRET-shared cookies; should survive                                    |
| Database lag between PC SoT and VM mirror            | Cron 04:30 runs daily; pre-cutover (T-12h) take fresh manual pull to ensure ≤ TBD seconds lag |
| Performance regression on first request (cold start) | Pre-warm via curl /health × 10 immediately post-deploy                                        |
| TLS cert mismatch                                    | certbot --nginx auto-renews; verify cert presence pre-cutover                                 |

## RTO target rationale

5 minutes is conservative for an HRMS system:

- Most SaaS SLA "downtime" thresholds are 5-15 min
- Heuresys is internal-tooling (not customer-facing public site); 5 min is
  acceptable per prior incident response targets
- DR drill (5.9) targets 30 min for full site recovery; 5 min is ~6× tighter
  for planned cutover

If actual RTO measured > 300s during dry-run:

- STOP-AUTONOMO-5 fires
- Investigate what consumed time: connection drain? DNS? smoke? cold start?
- Revise target if structural reasons exist (e.g. accept 8 min if legacy has
  slow shutdown unavoidable)
