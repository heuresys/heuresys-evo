# heuresys-evo — Current State

> Updated: 2026-05-05 (post Phase 8 motion enriched · Phase 9 5/5 + L22 + L23 · L25 logo PERMANENT)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Officina, non università. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

**Phase 8 + Phase 9 chiuse · L22-L25 layout/logo finalizzati**. Phase 9: 5 dashboard production-ready (HR Director · Capability Graph · Skills Heatmap · Employee Journey · Org & Systems) + index hub + L22 layout v2 (sidebar collapsible, tenant-mini, no-gradient buttons) + L23 architect-style cross-dashboard (logo legacy, bordered avatars, sticky header+footer fisso, scroll indipendenti, footer dynamic context-aware). Phase 8: 5 motion prototipi enriched playground (6 sezioni each: live demo + live controls + use case map + alternatives compare + anti-pattern + integration code) + `motion-final.md` SoT. **L25 logo PERMANENT**: `h` lowercase · tutte lettere identiche peso/size/style · solo `y` color diverso · embed ovunque (header + footer + meta). Applicato a 13 HTML + 6 SVG canonical. Commit pushati: f27e094 → 6bb7596 (10 commit).

## ⚡ Active workstream — Brand identity

In nuova sessione: **digita `/brand`** o di' "lavoriamo sul brand".

| File                                                                                            | Scopo                                                                |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [`../.ux-design/BRAND-STATE.md`](../.ux-design/BRAND-STATE.md)                                  | SoT — Phase 1-9 done, L25 active                                     |
| [`../.ux-design/02-aesthetic/heuresys.DESIGN.md`](../.ux-design/02-aesthetic/heuresys.DESIGN.md) | DESIGN.md 10 sezioni (Section 3 logo rule L25 aggiornata)             |
| [`../.ux-design/02-aesthetic/logo-standard.md`](../.ux-design/02-aesthetic/logo-standard.md)   | **L25 PERMANENT** in cima · regole canoniche aggiornate               |
| [`../.ux-design/04-motion-language/motion-final.md`](../.ux-design/04-motion-language/motion-final.md) | Phase 8 SoT motion language                                       |
| [`../.ux-design/DECISIONS-LOG.md`](../.ux-design/DECISIONS-LOG.md)                              | L1-L25 cronologia append-only                                         |

## Top priorities

1. **Visual review by Enzo** dei 5 dashboard + 5 motion prototypes con L25 applicato (~30 min). Test live su `http://127.0.0.1:8765/`. Possibili fix retroattivi su logo/footer/motion.
2. **Phase 10 — Altre surface** (~4h): login · onboarding · empty state · 404 · settings. Pattern reusable da Phase 9 dashboard layout v2 + L23 customizations.
3. **Phase 11 — Theme variants JSON** (~2h): `05-theme-variants/heuresys-theme.json` ThemeBuilderWizard format. Tokens da `palette-final.md` + `motion-final.md`.
4. **Phase 12 — Brand book v0** (~4h): consolidamento finale `07-brand-book/brand-book-v0.md`.

## Open questions

- **Direction-explorations Set 1-5** (32 mockup archivio): aggiornarli retroattivamente con L25 logo o lasciare archivio storico? Default lasciare.
- **PR #28** prisma 5→7 grouped major: manual review pending
- **PR #33** commitlint 19→20: manual review pending (XS)
- **License decision repo public**: pending
- **Phase 11 promotion to packages/ui**: tokens da `legacy-palette.css` + `palette-final.md` + `motion-final.md` da promuovere a production tokens (post brand book v0)

## Stack snapshot

API Gateway Express 5 (8200) · Frontend Next.js 16 + React 19 + Tailwind 4 (3200) · Workers BullMQ + Redis (6380) · ORM Prisma 5.22, 566 modelli · DB PostgreSQL 16 (5432) · Auth NextAuth v4 · Test Vitest 4 (250 verdi) · HTTP preview `0.0.0.0:8765` (LAN: `192.168.1.8`) · `.ux-design/`: 5 dashboard production + 5 motion prototypes enriched + 32 mockup direction-explorations archivio + 6 SVG canonical L25.

## Verification

```bash
git status -sb              # working tree clean
git log --oneline -10       # recent: 6bb7596 L25 logo, a86514b motion enriched, 7c53b05 Phase 8
ls .ux-design/06-mockups/dashboards/       # 5 dashboard + index
ls .ux-design/04-motion-language/          # 5 prototypes + index + motion-final.md
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8765/06-mockups/dashboards/index.html      # 200
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8765/04-motion-language/index.html        # 200
```

## Riferimenti

- **Operating baseline**: [`../docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md)
- **CLAUDE.md root**: [`../CLAUDE.md`](../CLAUDE.md) § Brand workstream
- **Modello base D1**: `.ux-design/02-aesthetic/direction-explorations/mu-architect-legacy.html`
- **Logo SVG canonical** (L25): `.ux-design/03-visual-identity/logo/final/heuresys-wordmark.svg`
- **Phase 9 hub**: `.ux-design/06-mockups/dashboards/index.html`
- **Phase 8 hub**: `.ux-design/04-motion-language/index.html`
