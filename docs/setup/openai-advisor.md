# OpenAI advisor — setup

> **Phase 14 Sprint 2.F** — `/ontology` page + `/api/ontology/advisor` route handler

## What it is

The OpenAI advisor is an LLM-backed workforce-planning panel. Given an ESCO
occupation and a question from an HR practitioner, the advisor returns a 2-paragraph
recommendation citing relevant ESCO concepts. Auth, RBP and a daily cost cap are
enforced server-side.

## Activation

Add the following to `services/app/.env.local` (and mirror in `.env` for the
deployed environment) — the values are read at request time, no rebuild needed:

```env
OPENAI_API_KEY=sk-...                  # required to enable the advisor
OPENAI_MODEL=gpt-4o-mini               # default; gpt-4o supported (≈16× cost)
OPENAI_COST_CAP_USD_DAILY=5            # daily ceiling; advisor returns 429 over cap
OPENAI_TIMEOUT_MS=30000                # OpenAI client request timeout
```

Without `OPENAI_API_KEY` the advisor route returns:

```json
{ "error": "advisor_unavailable", "reason": "missing_key" }
```

…and the UI degrades gracefully to a "Setup required" panel (no leak of internal
config to unauthenticated callers — the page still requires login).

## Cost monitoring

The cost tracker is process-local (`services/app/src/lib/ontology/cost-tracker.ts`)
and resets at 00:00 UTC. Production should swap the in-memory map for Redis using
the same interface (`checkCostCap` + `recordCost`), keyed on `openai:cost:YYYY-MM-DD`.

Pricing table (USD per 1M tokens, 2026 published rates):

| Model       | Input | Output |
| ----------- | ----- | ------ |
| gpt-4o-mini | 0.15  | 0.60   |
| gpt-4o      | 2.50  | 10.00  |

A typical advisor call uses ≈400 input tokens + 250 output → ≈ $0.000210
on gpt-4o-mini. The default $5/day cap therefore allows ≈ 23,800 calls/day.

## Verification

```powershell
# 1. Without OPENAI_API_KEY (default)
curl -X POST http://localhost:3200/api/ontology/advisor `
  -H "Content-Type: application/json" `
  -H "Cookie: authjs.session-token=<token>" `
  -d '{"occupationId":"<uuid>","question":"test"}'
# expect: 503 {"error":"advisor_unavailable","reason":"missing_key"}

# 2. With OPENAI_API_KEY set + valid key
# expect: 200 {"answer":"...","model":"gpt-4o-mini","costUsd":0.00021,...}

# 3. Cost cap reached (after enough calls)
# expect: 429 {"error":"cost_cap_reached","todayUsd":5.01,"capUsd":5.0}
```

## Architecture notes

- **Auth gate**: `services/app/src/app/api/ontology/advisor/route.ts` calls
  `auth()` (NextAuth getServerSession). Unauthenticated → 401.
- **RBP gate**: deferred to a follow-up — currently any authenticated session
  can call. Add `requirePermission('ESCO_KG', 'read')` once the helper is
  exposed in services/app (it lives in services/api-gateway today).
- **No streaming yet**: V1 returns the full completion. Streaming (SSE/Edge
  runtime) is a follow-up; the client component already isolates the network
  call so the upgrade is local.
- **Test isolation**: tests must NOT hit the real API. Use `msw` or a stubbed
  `getOpenAIClient`. CI runs without `OPENAI_API_KEY`, exercising the 503 path.
