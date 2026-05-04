# heuresys-evo — Current State

> Updated: 2026-05-04 (S11 close + Operating Baseline establishment)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA — 2026-05-04

**SEMPLICITÀ + ROBUSTEZZA** come pilastri. Officina, non università. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md) per regole comportamentali complete (canonical SoT cross-machine via git).

Se Claude over-engineered (PR multipli per task coerente, ADR/README/snapshot superflui, plan elaborati per cose banali, smart wrapper non testati): **segnale "stai over-engineering"** → stop, riconoscere, semplificare, continuare.

## Last session brief

S11 + behavioral consolidation: doc consolidation + workflow simplification radicale + behavioral baseline establishment. Branch protection rimossa, CI solo on PR + cron, /handoff ridotto a 1 file, CLAUDE.md riscritti essenziali, operating-baseline.md canonical SoT in repo.

## Top priorities

1. **Phase 6+ Tier 1 area port** (~6-10h): prima area completa dal legacy (raccomandata `employees/`). Ref: `docs/10-strategy/migration-strategy-pet-driven.md`
2. **Prisma 5.22 → 6.x intermediate** (~1-2h, low risk): bump per chiudere deprecation warning. Major 7 deferred (refactor 6-8h)
3. **License decision repo public**: "all rights reserved" implicit (status quo) | "Source-Available proprietary" | OSS (MIT/Apache)

## Open questions

- **next-auth v5 stable timing**: Q3-Q4 2026 atteso. No beta in prod
- **PR #28 prisma 5→7 grouped major**: aperto, manual review pending
- **PR #33 commitlint config-conventional 19→20**: aperto, manual review pending (effort XS)

## Stack snapshot

- API Gateway: Express 5 (port 8200)
- Frontend: Next.js 16 + React 19 + Tailwind 4 (port 3200)
- Workers: BullMQ + Redis (6380)
- ORM: Prisma 5.22, schema 566 modelli
- DB: PostgreSQL 16 bare-metal (5432) — distinto dal legacy (5433 container)
- Auth: NextAuth v4 (Credentials + bcryptjs)
- Test: Vitest 4 (250 test verdi)
- CI: gitleaks (always) + lint/typecheck/test/build/npm-audit/semgrep (only on PR + nightly cron)

## Verification

```bash
git status -sb               # working tree clean
git log --oneline -5         # recent commits readable
gh pr list --state open      # 2 PR pending manual review (#28, #33)
cat docs/_meta/operating-baseline.md | head -20   # baseline operativa accessibile
```

## Riferimenti

- **[`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md)** — operating rules canonical SoT (cross-machine via git)
- [`CLAUDE.md`](../CLAUDE.md) (root) — project mission/stack/commands/P1-P10/workflow
- [`.claude/CLAUDE.md`](../.claude/CLAUDE.md) — cross-context behavioral defaults
- [`docs/_meta/doc-architecture.md`](../docs/_meta/doc-architecture.md) — schema canonical docs/
- [`docs/50-reference/decisions/`](../docs/50-reference/decisions/) — 21 ADR (3 superseded)
- [`docs/90-archive/handoff-history/`](../docs/90-archive/handoff-history/) — pre-S11 archive
