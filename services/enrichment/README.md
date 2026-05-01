# services/enrichment

> **Status (2026-05-01, RTGB Phase B9.2)**: scaffold-only. Real implementation deferred — Phase 3 task 3.9-3.10 of the legacy ROAD_TO_GLORY plan (`/home/ubuntu/heuresys.com.evo/RTG.md`) covers this. Tracked separately by Cantiere A. Cantiere B confirms scaffold and does not modify substance.

Worker semantico — estrazione, arricchimento e verifica di dati ESCO/NACE/skill via LLM.

## Scope

- Process worker (non HTTP-facing)
- Consumer di queue BullMQ (Redis-backed)
- Provider LLM multipli: Anthropic, OpenAI, Google AI
- Espone tool MCP via `@modelcontextprotocol/sdk` per agenti esterni
- Idempotency, fact-hash, merge strategies, identity verification

## Stack target

- TypeScript + Node 20+ (ESM)
- Anthropic SDK + OpenAI + Google Generative AI
- MCP SDK (sia server tools che CLI)
- BullMQ + ioredis per coda jobs
- Pino logging, Zod validation
- `pg` per scrittura risultati su Postgres bare-metal

## Deploy target

- VM OCI come process separato (systemd o pm2)
- Scaling orizzontale via numero di worker

## Convenzioni

- Job sempre idempotenti (chiave da fact-hash)
- API key LLM via env (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY`)
- Cost tracking obbligatorio: log spend per job
- Test integration con stub provider, no chiamate LLM reali in CI
