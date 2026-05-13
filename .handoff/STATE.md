# heuresys-evo — Current State

> Updated: 2026-05-13T22:40Z · S62 brand & design system reset closed · HEAD `17ffc5e`

## Debt attivo

Nessuno. Sistema fermo.

## Stack snapshot delta (S62 reset)

- **Brand workstream cycle 1 archived** (`.ux-design/` → `.ux-design-archive-2026-05-13/` immutabile, single `git mv` top-level, 1027 file con history preservation). Marker `_ARCHIVED-IMMUTABLE.md`.
- **Brand workstream cycle 2 bootstrapped** (`.ux-design/` vuoto scaffold: README + SESSION-RESUME + BRAND-STATE + DECISIONS-LOG-v2 + 4 subdirectory).
- **ADR-0032 reset charter** (`docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`, supersedes ADR-0025 + ADR-0026).
- **Decision migration audit** (`.ux-design/04-promotion/decision-migration-audit.md`) — 85 entry cycle 1 scorecard: MIGRATE 14 / DECAY 16 / SUPERSEDED 5 / N-A 50. Le 14 MIGRATE consolidate in 4 entry L2-L5 di `DECISIONS-LOG-v2.md` (più L1 charter reset).
- **Production CSS consolidation (conservativa)**: foundation tokens estratti da `active-theme.css` (213 LOC) in nuovo `services/app/src/styles/tokens-foundation.css` (palette-agnostic: sp/radius/ease/dur/role/glass/logo-body/gradient-aurora/Tailwind 4 @theme/body baseline/.label-mono). `active-theme.css` ridotto a stub (preserved as brand-studio Apply write target). `palette-core.css` + `palette-variants.css` invariate. Runtime palette switching infrastructure **preservata** (DashboardPaletteApplier + PaletteSwitcher + brand-studio + 17 palette).
- **`/studio2:*` v2 skill** (4 sub-comandi: studio2 / propose / promote / rollback, 3-gate flow: canonical-derivation + live-data + user-confirm) in `.claude/skills/studio2/` + `.claude/commands/studio2/`. **`/studio:*` cycle 1 frozen DEPRECATED** (frontmatter aggiornato, contenuto preservato per audit storico).
- **Governance docs sync**: CLAUDE.md root § Brand workstream + § Sistema corrente + § Roadmap aggiornati cycle 2. `.claude/skills/brand-resume/SKILL.md` + `.claude/commands/brand.md` ridisegnati protocol 4-step cycle 2. `.handoff/BACKLOG.md` aggiornato (rimossa entry "Brand v1.0 promotion" archiviata).
- **Memory files** aggiornati: `feedback_brand_workstream.md` → cycle 2 protocol. Nuovo `project_brand_reset_s62.md` con event timeline. `MEMORY.md` index sincronizzato.
- **Safety**: tag `pre-reset-s62` + branch `backup/pre-reset-s62` pushati a `origin/`.

## Verification

```bash
# Working tree pulito post-commit
git status -sb

# Tag e branch safety
git tag --list | grep pre-reset-s62
git branch -r | grep backup/pre-reset-s62

# Archive history preservata
ls .ux-design-archive-2026-05-13/ | head
git log --oneline --follow .ux-design-archive-2026-05-13/DECISIONS-LOG.md | wc -l

# Cycle 2 scaffolding presente
test -f .ux-design/README.md && test -f .ux-design/SESSION-RESUME.md && test -f .ux-design/BRAND-STATE.md && test -f .ux-design/DECISIONS-LOG-v2.md && echo OK

# ADR-0032 presente
test -f docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md && echo OK

# Foundation CSS canonical presente
test -f services/app/src/styles/tokens-foundation.css && echo OK

# /studio2 commands
ls .claude/commands/studio2/ | wc -l   # expect 4

# /studio DEPRECATED marker
grep -q "deprecated: true" .claude/skills/studio/SKILL.md && echo OK

# Typecheck PASS
cd services/app && npx tsc --noEmit

# Build PASS (PowerShell on Windows)
# PowerShell: $env:NODE_OPTIONS='--max-old-space-size=4096'; cd services/app; npx next build

# Smoke produzione live (VM non redeployata in S62)
curl -sI https://evo.heuresys.com/login | head -1   # expect HTTP/1.1 200 OK
```

## References

- **ADR-0032 charter reset**: `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md` (supersedes ADR-0025 + ADR-0026)
- **Plan canonical S62**: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`
- **Archive marker**: `.ux-design-archive-2026-05-13/_ARCHIVED-IMMUTABLE.md`
- **Decision migration audit**: `.ux-design/04-promotion/decision-migration-audit.md`
- **Cycle 2 SoT**: `.ux-design/BRAND-STATE.md` · `.ux-design/DECISIONS-LOG-v2.md`
- **Operating baseline CARD-5**: `docs/_meta/operating-baseline.md` § Debt vs Raccomandazioni (regola invariata)
