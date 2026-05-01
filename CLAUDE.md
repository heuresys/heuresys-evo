# heuresys.com.evo

## Mission

Piattaforma SaaS B2B di Organizational Intelligence & Workforce Orchestration: layer ontologico tra ERP, HR e BI per governare processi, struttura, ruoli, competenze e performance attraverso un Knowledge Graph ESCO bilingue.

## Tech Stack

- **Workspace**: monorepo npm workspaces (Node ≥20, npm ≥10)
- **Frontend**: Next.js 16 + React 19, Tailwind + Radix UI, TanStack Query/Table, viz Cytoscape/D3/ECharts/XY-Flow
- **Backend**: Express 5 + TypeScript, Pino, Sentry, Prometheus, Zod, JWT/2FA
- **AI/Enrichment**: Anthropic SDK + OpenAI + Google AI + MCP SDK + BullMQ
- **Database**: PostgreSQL **bare-metal** (no container), schema/migrations/seeds in `db/`
- **Cache/Queue**: Redis (containerizzato in `infra/`)
- **Tooling**: TypeScript 5+, ESLint 9, Prettier, Vitest, Jest, Playwright, Husky+lint-staged
- **Infra**: Docker Compose per servizi non-DB; Nginx reverse proxy

## Mental Model

- `services/*` — deploy unit indipendenti (`marketing`, `app`, `api-gateway`, `enrichment`, `playground`)
- `packages/*` — codice condiviso (`ui` design system, `shared` types/zod)
- `db/` — schema PostgreSQL gestito separatamente dal DBMS bare-metal: `baseline/` (pg_dump SQL del v1), `migrations/` (`0001_baseline` + future incrementali), `seeds/`, `scripts/` (setup-local/vm/restore/backup)
- `backups/from-vm/` — dump binari (gitignored), source per restore della baseline
- `infra/` — Docker Compose per Redis/Nginx/monitoring (mai per Postgres)
- `cowork_code_exchange/` — handoff Cowork (supervisore) ↔ CLI (esecutore)
- `prompts/` — prompt LLM versionati (system/task/templates/evals), consumati da `services/enrichment/` e altri
- `.github/workflows/` — pipeline CI/CD (stub `.yml.example` finché non completati)
- `.mcp.json` — server MCP condivisi del progetto (vuoto inizialmente; ospiterà p.es. `heuresys-enrichment-mcp` quando il servizio enrichment sarà pronto)

## Workflow Orchestration

1. Plan Mode Default
   Always use /superpowers when working in Plan Mode.
   Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
   If something goes sideways, STOP and re-plan immediately - don't keep pushing
   Use plan mode for verification steps, not just building
   Write detailed specs upfront to reduce ambiguity
2. Subagent Strategy
   Use subagents liberally to keep main context window clean
   Offload research, exploration, and parallel analysis to subagents
   For complex problems, throw more compute at it via subagents
   One tasck per subagent for focused execution
3. Self-Improvement Loop
   After ANY correction from the user: update tasks/lessons.md with the pattern
   Write rules for yourself that prevent the same mistake
   Ruthlessly iterate on these lessons until mistake rate drops
   Review lessons at session start for relevant project
4. Verification Before Done
   Never mark a task complete without proving it works
   Diff behavior between main and your changes when relevant
   Ask yourself: "Would a staff engineer approve this?"
   Run tests, check logs, demonstrate correctness
5. Demand Elegance (Balanced)
   For non-trivial changes: pause and ask "is there a more elegant way?"
   If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
   Skip this for simple, obvious fixes - don't over-engineer
   Challenge your own work before presenting it
6. Autonomous Bug Fixing
   When given a bug report: just fix it. Don't ask for hand-holding
   Point at logs, errors, failing tests - then resolve them
   Zero context switching required from the user
   Go fix failing CI tests without being told how

## Task Management

Plan First: Write plan to tasks/todo.md with checkable items
Verify Plan: Check in before starting implementation
Track Progress: Mark items complete as you go
Explain Changes: High-level summary at each step
Document Results: Add review section to tasks/todo.md
Capture Lessons: Update tasks/lessons.md after corrections

## Core Principles

Simplicity First: Make every change as simple as possible. Impact minimal code.
No Laziness: Find root causes. No temporary fixes. Senior developer standards.
Minimat Impact: Changes should only touch what's necessary. Avoid introducing bugs.

### CONSTRAINTS

- Conventional commits (feat:, fix:, chore:, docs:, refactor:, test:)
- Postgres su host bare-metal, connessione via env (`DATABASE_URL`)
- Componenti UI condivisi vivono in `packages/ui/`, mai duplicati nei `services/`
- `services/playground/` è sandbox dev-only, mai deploy in prod
- Lint + typecheck + test devono passare prima del merge in `main` (gate CI obbligatorio)
- Prompt LLM versionati in `prompts/`, mai inline nel codice dei servizi
- IMPORTANTE
  Tra i tuoi compiti c'è quello di automatizzare il lavoro e procedere in autonomia anche in pipelines lunghe e complesse. Quando ti crei piani e todo list, devi definire e rispettare percorsi e sequenze, verifiche e test con gates, cicli reiterati di verifica e correzione, e uscire solo quando tutto è concluso con il 100% di successo o se incontri situazioni bloccanti che non sei riuscito a risolvere dopo 3-5 cicli di verifica e correzione e che ti metterebbero in una situazione di stallo, idle, loop o blocco.
- In olre il 90% dei casi, io non ho le competenze necessarie per rispondere alle tue domande, perciò non devi chiedere e attendere attendere istruzioni/soluzioni tecniche da me.
- Lo spezzettamento in microtask o task elementari è accolto positivamente ma non deve tradursi in continue interruzioni e richieste di conferme a procedere.
  Sei tenuto a fare sempre scelte basate sulle tue raccomandazioni e sulle best practice, privilegiando qualità, completezza e robustezza senza virare a riduzioni di scopo, a semplificazioni, workaround. 
- Una volta che hai la sicurezza di avere individuato la raccomandazione/soluzione migliore ciascun specifico contesto, applicala come scelta e procedi in autonomia.

## Never

- Containerizzare PostgreSQL (decisione architetturale, vedi `infra/README.md` e `db/README.md`)
- Deploy `services/playground/` in produzione
- Commit diretti su `main`/`master` (usa feature branches)
- Hardcode di secret/token nel codice (usa `.env`, mai committato)

## Bootstrap (next session start — MANDATORY first action)

When starting any new session on this project, BEFORE touching any code:

0. **Acknowledge claude-mem auto-injection (if present)**: claude-mem `SessionStart` hook injects observations from past sessions into the conversation context BEFORE the bootstrap runs. If you see auto-injected memory at session start, treat it as **complementary** to `.handoff/HANDOFF.md` — never duplicate the recap. The handoff files are the curated source of truth; claude-mem injection is the raw, comprehensive backdrop. Cite the auto-injection only if it surfaces something the handoff missed.
1. Read `.handoff/HANDOFF.md` — get plan + todolist + open questions
2. Read `.handoff/PROJECT-STATE.md` — get current architecture / components state
3. Scan `.handoff/auto/` for breadcrumbs newer than `.handoff/HANDOFF.md` mtime — surface them to user if any
4. Run the verification commands listed in `HANDOFF.md` §Verification commands
5. **DBMS sync check**: run `bash db/scripts/evo-db status`. Se la suggestion segnala "bucket NEWER than your last pull", proporre `evo-db pull` PRIMA di iniziare modifiche al codice (allinea il DBMS locale al SoT bucket).
6. Present a 1-line state recap + top 3-5 todos + open questions to the user
7. Ask: "Continuiamo dalla priority #1, scegli un'altra, o qualcosa di nuovo?"
8. WAIT for user direction before any other action

The session-close counterpart is the `/handoff` skill (`.claude/skills/handoff/SKILL.md`). Quando la sessione chiude, se ci sono state scritture significative nel DBMS locale (inserimenti via app, migration applicate, fixture caricate), proporre `evo-db push` per pubblicare il nuovo SoT al bucket prima del handoff.

## Memory & tooling

This project benefits from two complementary memory systems running side by side:

- **`.handoff/`** — curated, human-readable, append-only journal + overwrite-on-close state. Source of truth for "what's where, what's next". Owned by the agent via the `/handoff` skill.
- **claude-mem v12.4.7** (Alex Newman, AGPL-3.0, plugin `claude-mem@thedotmack`) — automatic transcript compression into a SQLite + Chroma vector DB at `~/.claude-mem/`. Worker on `http://localhost:37777` (web UI). Search via `/mem-search` slash command in Claude Code. Hooks lifecycle: `Setup`, `SessionStart`, `UserPromptSubmit`, `PreToolUse(Read)`, `PostToolUse`, `Stop`. Coexists with the project-level `Stop` hook (`auto-handoff.sh`) — both fire on the same event without conflict.

Do not commit `~/.claude-mem/` contents (machine-local, contains transcript material). The directory is outside the repo so no `.gitignore` entry is needed.

## Quick references

@docs/decisions/README.md
