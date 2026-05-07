# ADR-0022 — OpenAI advisor integration for /ontology

- Status: accepted
- Date: 2026-05-07
- Supersedes: —
- Phase: 14 Sprint 2.F

## Context

Phase 14 Sprint 2.F introduces the `/ontology` route as the first surface
where Heuresys exposes ESCO knowledge graph data to end users with an
LLM-assisted advisory layer. The advisor is intended to translate raw ESCO
occupation/skill data into actionable recommendations (career-path advice,
similar roles, suggested upskill paths) without bypassing the existing
auth + RBP + tenant gates already enforced in services/app.

Three implementation options were considered:

| Option                                                                 | Pro                                                        | Con                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| **A** OpenAI client embedded in `services/app` (Next.js Route Handler) | Co-located with auth, no extra hop, streaming-ready (Edge) | Couples services/app to a heavy SDK            |
| **B** Express endpoint in `services/api-gateway` consuming OpenAI      | Aligns with other domain endpoints, isolates LLM latency   | Adds a hop, doubles RBP enforcement, more glue |
| **C** Direct browser → OpenAI via short-lived session token            | Lowest server cost                                         | No cost cap, no audit, no RBP — non-starter    |

## Decision

**Option A** — Implement the advisor as a Next.js Route Handler at
`services/app/src/app/api/ontology/advisor/route.ts`. Auth via
`getServerSession`; cost cap via in-memory bucket
(`services/app/src/lib/ontology/cost-tracker.ts`) keyed on UTC day.
The `OPENAI_API_KEY` env var is the activation switch — when missing,
the route returns 503 `advisor_unavailable` and the UI renders a
"Setup required" panel.

## Rationale

- **Single auth path**: auth + RBP already runs in services/app, no
  duplication of session-cookie validation.
- **Officina pragma**: one new package install (`openai`) on one
  workspace — Sprint 3 already plans more LLM surfaces (advisor on
  `/explorer/kg`); they will live next to this one.
- **Cost ceiling is non-negotiable**: in-memory tracker is the V1
  guard. Redis swap is documented in `docs/setup/openai-advisor.md`
  and trivial when horizontal scaling lands.
- **Test posture**: zero real API calls in CI. The wrapper module
  (`openai-client.ts`) cleanly separates instantiation so unit tests
  mock `getOpenAIClient`.

## Consequences

- `services/app/package.json` gains `openai@^4` (412 transitive deps).
- New env vars must be propagated to deployed environments
  (`OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_COST_CAP_USD_DAILY`,
  `OPENAI_TIMEOUT_MS`). `.env.example` updated in services/api-gateway
  for documentation parity (the actual reads happen in services/app).
- `requirePermission('ESCO_KG', 'read')` enforcement is **deferred** —
  the helper currently lives in services/api-gateway. A follow-up
  ticket extracts it to a shared module so /ontology gates RBP at the
  same level as Express routes. Until then the page is auth-only.
- Streaming response is **deferred** — V1 returns the full completion;
  the client component already isolates the network call so the
  upgrade is local.

## Verification

- Without key set: `POST /api/ontology/advisor` → 503; UI shows
  "Setup required" panel.
- With key set: smoke against `gpt-4o-mini` returns 200 + answer +
  ≈$0.0002 cost recorded.
- Cost cap reached: 429 `cost_cap_reached` with `todayUsd` and
  `capUsd` in body.

## References

- ADR-0020 — Tenant Ontology Versioning (defines the canonical ESCO data
  source this advisor consumes).
- `docs/setup/openai-advisor.md` — operational runbook.
- `docs/20-architecture/knowledge-graph-esco.md` — data model.
