# heuresys-evo — Current State

> Updated: 2026-05-04 (S11 close, post radical simplification)

## Last session brief

S11: doc consolidation + workflow simplification radicale. Branch protection rimossa, CI solo on PR + cron, /handoff ridotto a 1 file. Default ora: direct push to main, no PR salvo richiesta esplicita.

## Top priorities

1. **Phase 6+ Tier 1 area port** (~6-10h): prima area completa dal legacy `heuresys.com.evo` (raccomandata `employees/`). Ref: `docs/10-strategy/migration-strategy-pet-driven.md`.
2. **Prisma 5.22 → 6.x intermediate** (~1-2h, low risk): bump per chiudere deprecation warning. Major 7 deferred (richiede driver adapter refactor 6-8h, vedi `docs/90-archive/handoff-history/PROJECT-LOG-S0-S11.md` S8 entry).
3. **License decision repo public**: scegliere tra "all rights reserved" implicit (status quo), "Source-Available proprietary", o OSS (MIT/Apache).

## Open questions

- **next-auth v5 stable timing**: aspettare release? Q3-Q4 2026 atteso. Beta in prod NO.
- **PR #28 prisma 5→7 grouped major**: aperto, manual review pending. Da chiudere quando si pianifica migration Prisma 7.
- **PR #33 commitlint config-conventional 19→20**: aperto, manual review pending (effort XS).

## Stack snapshot

- API Gateway: Express 5 (port 8200)
- Frontend: Next.js 16 + React 19 + Tailwind 4 (port 3200)
- Workers: BullMQ + Redis
- ORM: Prisma 5.22, schema 566 modelli
- DB: PostgreSQL 16 bare-metal (5432) — distinto dal legacy (5433 container)
- Auth: NextAuth v4 (Credentials + bcryptjs)
- Test: Vitest 4 (250 test verdi)
- CI: gitleaks (always) + lint/typecheck/test/build/npm-audit/semgrep (only on PR + nightly cron)

## Verification (next session can resume cleanly)

```bash
git status -sb               # working tree clean
git log --oneline -5         # recent commits readable
gh pr list --state open      # 2 PR pending manual review (#28, #33)
```

## Riferimenti

- `docs/_meta/doc-architecture.md` — schema canonical docs/
- `docs/50-reference/decisions/` — 21 ADR (3 superseded)
- `docs/90-archive/handoff-history/` — full PROJECT-LOG, CHANGELOG, snapshots, retro pre-S11
- `CLAUDE.md` (root) + `.claude/CLAUDE.md` — behavioral defaults
