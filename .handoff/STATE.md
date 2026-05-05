# heuresys-evo — Current State

> Updated: 2026-05-05 (post sessione skill `studio` v1.1.0 · 6 slash command `/brand:*` · 9 commit)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Officina, non università. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

**Sessione doppia: brand sub-commands + skill studio**. Promossi 6 prompt template `99-samples/rohitg00-prompts/*` a slash command namespaced `/brand:family-picker`, `/brand:designer-debate`, `/brand:anti-slop`, `/brand:audit`, `/brand:extract`, `/brand:remix`. Poi creata skill **`studio` v1.1.0** in 7 fase: 9 sub-command (`/studio`, `:clone`, `:bootstrap`, `:diff`, `:promote`, `:restore`, `:backup-list`, `:status`, `:doctor`) per ciclo clone↔promote↔backup di route Next.js attraverso `.ux-design/10-staging/` + backup restorable in `.ux-design/.backups/<route>/<TS>-pre-promote/` con `MANIFEST.json`. Promote a 5-gate (motivazione · brand audit · anti-slop · verification · user confirm) + 2 fail-safe (repo clean · husky). Self-evolution: `/studio:doctor` (8 categorie check + auto-fix), JSONL log append-only `.logs/usage.jsonl` (gitignored), `references/lessons-learned.md` append-only, `CHANGELOG.md` semver. Bug trovato e fixato: drift detection CR/LF strip su Windows Git Bash. Plan: `~/.claude/plans/voglio-creare-una-skill-magical-castle.md`. Commit pushati: `fdf6a5d → df8dec1` (9 commit).

## ⚡ Active workstream — Brand identity + Studio

In nuova sessione: **digita `/brand`** o "lavoriamo sul brand" · per route work **`/studio`** o "iteriamo sulla pagina X".

| File                                                                          | Scopo                                                                              |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`../.ux-design/BRAND-STATE.md`](../.ux-design/BRAND-STATE.md)                | SoT brand — Phase 1-9 done, L25 active, **L26 skill studio**                       |
| [`../.ux-design/DECISIONS-LOG.md`](../.ux-design/DECISIONS-LOG.md)            | L1-L26 cronologia append-only                                                      |
| [`../.claude/skills/studio/SKILL.md`](../.claude/skills/studio/SKILL.md)      | Skill studio v1.1.0 entry + 9 sub-command + 3-modi attivazione                     |
| [`../.claude/skills/studio/CHANGELOG.md`](../.claude/skills/studio/CHANGELOG.md) | Versioning skill-level semver (v1.0.0, v1.1.0)                                  |

## Top priorities

1. **Test happy-path /studio** (~30 min): test 6 (`/studio:promote --confirmed`) + test 8 (`/studio:restore`) + test 7 (husky fail) su route canary `dashboard`. Smoke test 1-5 e 9-12 PASS, restanti richiedono modifica reale produzione.
2. **Visual review by Enzo** dei 5 dashboard + 5 motion prototypes con L25 applicato (~30 min). Test su `http://127.0.0.1:8765/`. Possibili fix retroattivi.
3. **Phase 10 — Altre surface** (~4h): login · onboarding · empty state · 404 · settings. Pattern reusable da Phase 9 dashboard layout v2 + L23 customizations. Usare `/studio:bootstrap` per prima promozione.
4. **Phase 11 — Theme variants JSON** (~2h): `05-theme-variants/heuresys-theme.json` ThemeBuilderWizard format.
5. **Phase 12 — Brand book v0** (~4h): consolidamento finale `07-brand-book/brand-book-v0.md`.

## Open questions

- **Direction-explorations Set 1-5** (32 mockup archivio): retro-update L25 logo o lasciare? Default lasciare.
- **`/studio:doctor --apply`** future: regen tabella sub-command da frontmatter `description` di `commands/studio/*.md` (non implementato day-1).
- **PR #28** prisma 5→7 grouped major: manual review pending
- **PR #33** commitlint 19→20: manual review pending (XS)
- **License decision repo public**: pending
- **Phase 11 promotion to packages/ui**: tokens da `legacy-palette.css` + `palette-final.md` + `motion-final.md` post brand book v0

## Stack snapshot

API Gateway Express 5 (8200) · Frontend Next.js 16 + React 19 + Tailwind 4 (3200) · Workers BullMQ + Redis (6380) · ORM Prisma 5.22 · DB PostgreSQL 16 (5432) · Auth NextAuth v4 · Test Vitest 4 (250 verdi) · HTTP preview `0.0.0.0:8765` (LAN: `192.168.1.8`). `.ux-design/`: 5 dashboard prod-ready + 5 motion enriched + 32 mockup archivio + 6 SVG canonical L25. **Skill studio v1.1.0**: 30 file (1 SKILL.md + 9 commands + 8 references + 9 scripts + 2 templates + CHANGELOG). **Brand sub-commands**: 6 wrappers `99-samples/rohitg00-prompts/*` → `/brand:*`.

## Verification

```bash
git status -sb              # working tree clean
git log --oneline -12       # recent: df8dec1 doctor row, b99a825 self-evolution, 9af7643 bootstrap
bash .claude/skills/studio/scripts/doctor.sh   # 50 pass · 0 fail · 1 warn
ls .claude/skills/studio/                      # SKILL.md + CHANGELOG + 4 dirs
ls .claude/commands/studio/                    # 9 .md
ls .claude/commands/brand/                     # 6 .md
```

## Riferimenti

- **Operating baseline**: [`../docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md)
- **CLAUDE.md root**: [`../CLAUDE.md`](../CLAUDE.md) § Brand workstream + § Studio workstream
- **Plan studio**: `~/.claude/plans/voglio-creare-una-skill-magical-castle.md`
- **Self-evolution doc**: [`../.claude/skills/studio/references/self-evolution.md`](../.claude/skills/studio/references/self-evolution.md)
- **Lessons learned**: [`../.claude/skills/studio/references/lessons-learned.md`](../.claude/skills/studio/references/lessons-learned.md)
