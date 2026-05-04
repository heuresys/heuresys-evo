# heuresys-evo — Current State

> Updated: 2026-05-05 (sessione brand identity close)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Officina, non università. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md). Se Claude over-engineered: "stai over-engineering" → stop, semplificare, continuare.

## Last session brief

Avviato workstream brand identity in `.ux-design/` (segregato). Phase 1-3 + 5 + 7 completed. 8 direzioni estetiche esplorate (α/β/γ/δ Set 1 + ε/ζ/η/θ Set 2 award-inspired light+dark). **Sistema di continuità cross-session istituito**: 3 SoT files in `.ux-design/` + slash command `/brand` + skill `brand-resume` + auto-memory entry. Decisione D1 (scelta direzione) pending.

## ⚡ Active workstream — Brand identity

In nuova sessione: **digita `/brand`** o di' "lavoriamo sul brand". Claude segue protocollo automatico.

| File | Scopo |
| --- | --- |
| [`../.ux-design/SESSION-RESUME.md`](../.ux-design/SESSION-RESUME.md) | Protocollo 8-step ripresa |
| [`../.ux-design/BRAND-STATE.md`](../.ux-design/BRAND-STATE.md) | SoT stato, decisioni, asset, setup |
| [`../.ux-design/DECISIONS-LOG.md`](../.ux-design/DECISIONS-LOG.md) | Cronologia L1-L13 append-only |
| [`../.claude/commands/brand.md`](../.claude/commands/brand.md) | Slash command `/brand` |
| [`../.claude/skills/brand-resume/SKILL.md`](../.claude/skills/brand-resume/SKILL.md) | Skill `brand-resume` |

## Top priorities

1. **Brand D1 — scelta aesthetic direction** (~30min): scegliere tra 8 (α/β/γ/δ + ε/ζ/η/θ light+dark). Bloccante per Phase 5/6/7/8/9/10/11/12. Naviga `http://127.0.0.1:8765/02-aesthetic/direction-explorations/index.html` (server local da avviare via `/brand`).
2. **Phase 6+ Tier 1 area port** (~6-10h): prima area completa dal legacy (raccomandata `employees/`). Ref: `docs/10-strategy/migration-strategy-pet-driven.md`
3. **Prisma 5.22 → 6.x intermediate** (~1-2h, low risk): bump per chiudere deprecation warning.

## Open questions

- **Brand D1**: aesthetic direction finale tra 8 esposte. Vedi `BRAND-STATE.md` § Decisioni pending.
- **PR #28**: prisma 5→7 grouped major, manual review pending
- **PR #33**: commitlint config-conventional 19→20, manual review pending (effort XS)
- **next-auth v5 stable timing**: Q3-Q4 2026 atteso. No beta in prod
- **License decision repo public**: pending

## Stack snapshot

API Gateway Express 5 (8200) · Frontend Next.js 16 + React 19 + Tailwind 4 (3200) · Workers BullMQ + Redis (6380) · ORM Prisma 5.22, 566 modelli · DB PostgreSQL 16 (5432) · Auth NextAuth v4 · Test Vitest 4 (250 verdi) · CI gitleaks always + lint/typecheck/test/build/audit/semgrep on PR + cron.

## Verification

```bash
git status -sb              # working tree clean
git log --oneline -5        # recent commits readable
gh pr list --state open     # 2 PR pending (#28, #33)
ls .ux-design/02-aesthetic/direction-explorations/  # 8 mockup HTML + index
```

## Riferimenti

- **Operating baseline**: [`../docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md)
- **CLAUDE.md root**: [`../CLAUDE.md`](../CLAUDE.md) (include § Brand workstream)
- **Doc architecture**: [`../docs/_meta/doc-architecture.md`](../docs/_meta/doc-architecture.md)
- **ADR**: [`../docs/50-reference/decisions/`](../docs/50-reference/decisions/)
