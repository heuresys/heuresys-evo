# heuresys-evo — Current State

> Updated: 2026-05-05 (post Phase 5+6+7 done · Phase 9 starter · D1 chiusa L21)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Officina, non università. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

**D1 CHIUSA · `mu-architect-legacy.html` fissato come modello base** (Set 5 Systems POV palette legacy `www.heuresys.com`). 32 mockup esplorati (Set 1+2+3+4+5). Phase 5 (`heuresys.DESIGN.md` 9 sezioni canoniche + `palette-final.md` v2) · Phase 6 (`typography-final.md` Exo 2 + Inter + JetBrains Mono) · Phase 7 (5 SVG logo aggiornati L16+L18) tutti completati. Phase 9 starter: `06-mockups/dashboards/hr-director-overview.html` (Maria CHRO RTL Bank). 6 commit pushati: 79d8561 → fa0c72d.

## ⚡ Active workstream — Brand identity

In nuova sessione: **digita `/brand`** o di' "lavoriamo sul brand".

| File                                                                                | Scopo                                                |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [`../.ux-design/BRAND-STATE.md`](../.ux-design/BRAND-STATE.md)                      | SoT — D1 chiusa, Phase tracking aggiornato            |
| [`../.ux-design/02-aesthetic/heuresys.DESIGN.md`](../.ux-design/02-aesthetic/heuresys.DESIGN.md) | Canonical 9 sezioni drop-in per AI agents      |
| [`../.ux-design/02-aesthetic/logo-standard.md`](../.ux-design/02-aesthetic/logo-standard.md) | L16 + L18 spec                                  |
| [`../.ux-design/DECISIONS-LOG.md`](../.ux-design/DECISIONS-LOG.md)                  | L1-L21 cronologia append-only                         |

## Top priorities

1. **Phase 9 — 4 dashboard mockup rimanenti** (~6-8h): Capability Graph (Davide IT) · Skills Heatmap · Employee Journey · Org & Systems. Template base `mu-architect-legacy.html` + DESIGN.md compliant. HR Director starter già fatto in `06-mockups/dashboards/hr-director-overview.html`.
2. **Phase 8 — Motion language** (~4-6h): `motion-final.md` + 5-8 prototipi animati (glow · gradient transitions · KG hover · sparkline · scroll-triggered).
3. **Phase 10/11/12** (~10h totali): altre surface · theme variants JSON · brand book v0.

## Open questions

- **PR #28** prisma 5→7 grouped major: manual review pending
- **PR #33** commitlint 19→20: manual review pending (effort XS)
- **License decision repo public**: pending
- **Phase 11 promotion to packages/ui**: tokens da `legacy-palette.css` + `palette-final.md` da promuovere a production tokens.css (post Phase 9)

## Stack snapshot

API Gateway Express 5 (8200) · Frontend Next.js 16 + React 19 + Tailwind 4 (3200) · Workers BullMQ + Redis (6380) · ORM Prisma 5.22, 566 modelli · DB PostgreSQL 16 (5432) · Auth NextAuth v4 · Test Vitest 4 (250 verdi) · HTTP server UX preview live `0.0.0.0:8765` (LAN: `192.168.1.8`) · 32 mockup direction-explorations + 1 dashboard Phase 9.

## Verification

```bash
git status -sb              # working tree clean
git log --oneline -8        # recent: fa0c72d Phase 9 starter, f8e9024 Phase 5+6+7
ls .ux-design/06-mockups/dashboards/      # 1 dashboard (HR Director)
ls .ux-design/02-aesthetic/heuresys.DESIGN.md  # canonical drop-in
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8765/06-mockups/dashboards/hr-director-overview.html  # 200
```

## Riferimenti

- **Operating baseline**: [`../docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md)
- **CLAUDE.md root**: [`../CLAUDE.md`](../CLAUDE.md) § Brand workstream
- **Modello base D1**: `.ux-design/02-aesthetic/direction-explorations/mu-architect-legacy.html`
- **Logo SVG canonical**: `.ux-design/03-visual-identity/logo/final/heuresys-wordmark.svg` (L16+L18)
