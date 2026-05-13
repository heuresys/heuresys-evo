# .ux-design/ — Cycle 2 brand identity workstream

> **Cycle 2 protocol post-S62 reset 2026-05-13** — vedi `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`.
> Cycle 1 archive (S22→S61, 1027 file, 87 decisioni) in `../.ux-design-archive-2026-05-13/` (immutabile, read-only).

## Policy segregazione (vincolante)

| Regola                                                                      | Enforcement                                                                                                                                                             |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nessun import da `.ux-design/` in production code                           | Build pipeline non tocca questa directory. Lint check su `services/app/src/**/*.{ts,tsx}` per import path `.ux-design`.                                                 |
| Nessun export via package.json                                              | npm workspaces ignora `.ux-design/`.                                                                                                                                    |
| File qui = draft/experimental/proposta mai canonical                        | Promozione richiede flow `/studio2:promote` con 3-gate.                                                                                                                 |
| Promozione a produzione = decisione esplicita Enzo                          | Mai automatica. Mai derivata. Sempre via `/studio2:promote`.                                                                                                            |
| Cycle 2 NON eredita decisioni cycle 1                                       | Migration richiede ri-affermazione esplicita in `DECISIONS-LOG-v2.md` con citazione predecessore archive. Audit completo in `04-promotion/decision-migration-audit.md`. |
| Brand-resume skill / `/brand` command NON leggono automaticamente l'archive | Archive cycle 1 = materia prima per consultazione manuale, solo su richiesta esplicita.                                                                                 |

## Struttura directory

```
.ux-design/
├── README.md                       # Questo file
├── SESSION-RESUME.md               # Protocol 4-step cycle 2
├── BRAND-STATE.md                  # SoT consolidato corrente (phase, canonical SoT, pending)
├── DECISIONS-LOG-v2.md             # Append-only L1-LN cycle 2
├── 01-canonical/                   # SoT vincolanti cycle 2 (semantically versioned)
├── 02-tokens/                      # W3C DTCG tokens.json (1 SoT)
├── 03-mockups/                     # Mockup HTML/React cycle 2
└── 04-promotion/                   # Workflow promozione v2 + audit migration
    └── decision-migration-audit.md
```

## Workflow cycle 2

1. **Decision firmata** → entry in `DECISIONS-LOG-v2.md` (L-NN) + se canonical → file in `01-canonical/<topic>.md`
2. **Token cambia** → update `02-tokens/tokens.json` (W3C DTCG) → sync `services/app/src/styles/tokens.css`
3. **Mockup nuovo** → file in `03-mockups/<route>.html` con header `<!-- canonical-ref: L-NN -->` linking decisione
4. **Promote** → `/studio2:promote <route> <staging-id>` esegue 3-gate flow
5. **Rollback** → `/studio2:rollback <route>` restore istantaneo

## Archive cycle 1 — quando consultare

✅ Audit storico (capire perché una scelta cycle 2 sceglie X invece di Y)
✅ Estrazione materia prima per mockup cycle 2 (ispirazione, non copia diretta)
✅ Consultazione SQLite DB asset showcase se servono asset specifici già lavorati
✅ Lettura `_ARCHIVED-IMMUTABLE.md` per inventario completo

❌ Mai puntare skill brand-resume all'archive
❌ Mai promuovere asset dall'archive a produzione senza ri-affermazione decisione cycle 2

## Reference

- **ADR-0032** charter del reset: `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`
- **Plan canonical** S62: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`
- **Skill cycle 2**: `.claude/skills/brand-resume/SKILL.md`
- **Skill promotion cycle 2**: `.claude/skills/studio2/SKILL.md` (creata Phase 6 S62)
- **Archive**: `.ux-design-archive-2026-05-13/_ARCHIVED-IMMUTABLE.md`
