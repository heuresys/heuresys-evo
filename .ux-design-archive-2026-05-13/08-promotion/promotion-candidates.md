# Promotion candidates — registro mockup per selezione finale

> **Scopo**: registrare per ogni surface (login · dashboard · motion · onboarding · ecc.) tutti i mockup generati come candidati alla **promozione a v1.0**, con **rank di preferenza** (1 = primo · 2 = secondo · ecc.). Il rank è assegnato da Enzo durante visual review. Quando un candidato è confermato (rank 1 stabile), la sua promozione tecnica avviene via `/studio:bootstrap <mockup> <route>` (vedi skill `studio` v1.1.0).
>
> **Distinzione operativa**:
>
> - **Selezione candidato** (questo file): ranking tra le varianti generate per ogni surface
> - **Promozione tecnica** (Phase 13 + `/studio:bootstrap`): trasformazione del mockup HTML → React route in `services/app/src/app/<route>/` con backup restorable

## Status legend

| Symbol | Meaning                                                                              |
| ------ | ------------------------------------------------------------------------------------ |
| 🟡     | Pending review — generato, non ancora valutato da Enzo                               |
| ✅     | Ranked — rank assegnato, in pool decisionale                                         |
| 🏆     | Selected (rank 1 confermato) — pronto per promozione tecnica                         |
| 🚀     | Promoted — già passato via `/studio:bootstrap` o `/studio:promote` a `services/app/` |
| ❌     | Rejected — non sarà promosso, mantenuto come archivio                                |
| 🔄     | Iterating — in revisione, attesa di nuova versione                                   |

## Convenzione rank

- Rank `1` = primo per preferenza · `2` = secondo · ecc.
- `—` = pending (non ancora rankato)
- Stesso rank ammesso per "ex aequo" temporaneo (es. due `1` quando bisogna ancora discriminare)
- Rank può cambiare durante la sessione di review (override consentito)

---

## Login (Phase 10 surface 1/5)

Path base: `06-mockups/auth/`

| Rank | Candidato             | Path                         | Status | Note                                                                                                                                                                        |
| ---- | --------------------- | ---------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🏆 1 | **login-aurora**      | `auth/login-aurora.html`     | 🚀     | **Promosso production via Phase 14.SH FASE 1** (2026-05-07, D-LOGIN selection). Live in `services/app/src/app/login/page.tsx`. Glassmorphism · aurora gradient · soft glow. |
| 2    | login (base / formal) | `auth/login.html`            | ❌     | Archive. Enterprise-rigid · M365 + Google Workspace SSO. Mantenuto come riferimento storico, no promozione.                                                                 |
| 2    | login-split           | `auth/login-split.html`      | ❌     | Archive. Layout 50/50 brand showcase + KG topology animata SVG.                                                                                                             |
| 2    | login-playful         | `auth/login-playful.html`    | ❌     | Archive. Magnetic Playful v1 · 5 shapes pastel + magnetic button hover.                                                                                                     |
| 2    | login-playful-v2      | `auth/login-playful-v2.html` | ❌     | Archive. Playful v2 · 8 shapes + 4 motion asimmetriche.                                                                                                                     |

**Decisione resolved** (2026-05-07): visual review chiuso · winner = `login-aurora` · promosso in production durante Phase 14.SH FASE 1.

---

## Dashboard (Phase 9 — 5 surface complete · L21 D1 modello base)

Path base: `06-mockups/dashboards/`

Layout v2 (L22) + L23 architect customizations + L25 logo permanent + L27 retro-update applicati a tutti.

| Rank | Surface               | Path                                    | Status | Note                                                                                                                                                                                                                                           |
| ---- | --------------------- | --------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🏆 1 | hr-director-overview  | `dashboards/hr-director-overview.html`  | 🏆     | HR Director · KPI ring + skill gap matrix + activity feed live + succession ready                                                                                                                                                              |
| 🏆 1 | capability-graph      | `dashboards/capability-graph.html`      | 🏆     | IT Admin · KG topology SVG hero + ontology breakdown + ESCO sync                                                                                                                                                                               |
| 🏆 1 | skills-heatmap        | `dashboards/skills-heatmap.html`        | 🏆     | HR Director · matrice 8 dept × 12 skill heat + filters + distribution                                                                                                                                                                          |
| 🏆 1 | employee-journey      | `dashboards/employee-journey.html`      | 🏆     | Employee · profile hero + career arc 5 stage + capability radar + bridging suggestions                                                                                                                                                         |
| 🏆 1 | org-systems           | `dashboards/org-systems.html`           | 🏆     | IT Admin (platform) · 4 tenant fleet + RBAC matrix + integration health + audit log                                                                                                                                                            |
| 🏆 1 | cross-tenant-overview | `dashboards/cross-tenant-overview.html` | 🚀     | **Promosso 2026-05-07 carry-forward Phase 14.SH** (L35). SUPERUSER · cross-tenant analytics + 12-month workforce trend + 4-tenant comparison + capability gauges. Bound a preset `cross_tenant_overview` (sort 5, visibility -1).              |
| 🏆 1 | tenant-owner-overview | `dashboards/tenant-owner-overview.html` | 🚀     | **Promosso 2026-05-07 carry-forward Phase 14.SH** (L35). TENANT_OWNER (Marco Rossi · RTL Bank) · org snapshot + 8-dept breakdown + compensation FY26 + 9-box top-2 succession. Bound a preset `tenant_owner_overview` (sort 15, visibility 0). |
| —    | (index hub)           | `dashboards/index.html`                 | 🏆     | Navigation hub 5 surface                                                                                                                                                                                                                       |

**Note**: i 5 dashboard non sono "varianti tra cui scegliere" — sono **5 surface diverse** della stessa famiglia, tutte da promuovere ognuna alla propria route React. Il "rank 🏆 1" indica "selected for promotion" (non confronto tra esse).

**Promozione tecnica pending**: `/studio:bootstrap` per ognuna delle 5 → route React in `services/app/src/app/(dashboard)/`.

---

## Motion (Phase 8 — 5 prototipi · L24 motion-final.md SoT)

Path base: `04-motion-language/`

| Rank | Pattern              | Path                                              | Status | Note                                                           |
| ---- | -------------------- | ------------------------------------------------- | ------ | -------------------------------------------------------------- |
| 🏆 1 | wordmark-glow        | `04-motion-language/01-wordmark-glow.html`        | 🏆     | Drop-shadow blur 30→60px breathing 4s loop · landing hero only |
| 🏆 1 | gradient-transitions | `04-motion-language/02-gradient-transitions.html` | 🏆     | Theme switch dark↔light 200ms ease-out                         |
| 🏆 1 | kg-topology-hover    | `04-motion-language/03-kg-topology-hover.html`    | 🏆     | Node scale + edges focus/blur + tooltip 150ms                  |
| 🏆 1 | sparkline-animate    | `04-motion-language/04-sparkline-animate.html`    | 🏆     | Stroke-dashoffset L→R 200ms + count-up                         |
| 🏆 1 | scroll-reveals       | `04-motion-language/05-scroll-reveals.html`       | 🏆     | Opacity + translateY stagger 60ms one-shot                     |

**Note**: motion canonici già consolidati in `motion-final.md` (L24). Promozione tecnica = integrazione token CSS in `packages/ui/src/styles/tokens.css` + Framer Motion orchestrazione (Phase 11).

---

## Direction explorations (Phase 4 — 32 mockup archive · L21 D1 closure)

Path base: `02-aesthetic/direction-explorations/`

Status: ❌ archive alternative explored (D1 risolto in `mu-architect-legacy`).

| Rank | Direction                         | Path                                              | Status                    |
| ---- | --------------------------------- | ------------------------------------------------- | ------------------------- |
| 🏆 1 | mu-architect-legacy (D1 winner)   | `direction-explorations/mu-architect-legacy.html` | 🏆 modello base canonical |
| ❌   | 31 alternative scartate (Set 1-5) | vedi `direction-explorations/index.html`          | ❌ archive                |

---

## Logo (Phase 7 — 6 SVG canonical · L21 + L25/L27 permanent)

Path base: `03-visual-identity/logo/final/`

| Rank | Asset                     | Path                                                | Status           |
| ---- | ------------------------- | --------------------------------------------------- | ---------------- |
| 🏆 1 | wordmark canonical        | `logo/final/heuresys-wordmark.svg`                  | 🏆 L25 permanent |
| 🏆 1 | wordmark monochrome dark  | `logo/final/heuresys-wordmark-monochrome-dark.svg`  | 🏆               |
| 🏆 1 | wordmark monochrome light | `logo/final/heuresys-wordmark-monochrome-light.svg` | 🏆               |
| 🏆 1 | mark (y isolata)          | `logo/final/heuresys-mark.svg`                      | 🏆               |
| 🏆 1 | favicon                   | `logo/final/favicon.svg`                            | 🏆               |
| 🏆 1 | og-image template         | `logo/final/og-image-template.svg`                  | 🏆               |

**Note**: tutti già allineati spec L25/L27 (h lowercase · 8 lettere identiche · 2 colori fissi blue+purple). Promozione = copia in `services/app/public/brand/`.

---

## Palette (Phase 5 — palette-final.md v2 · L21 D1)

| Rank | Asset                    | Path                                        | Status |
| ---- | ------------------------ | ------------------------------------------- | ------ |
| 🏆 1 | palette OKLCH dark+light | `03-visual-identity/color/palette-final.md` | 🏆     |

**Promozione**: token CSS → `packages/ui/src/styles/tokens.css` (Phase 11).

---

## Typography (Phase 6 — typography-final.md · L21)

| Rank | Stack                                                   | Path                                                                   | Status     |
| ---- | ------------------------------------------------------- | ---------------------------------------------------------------------- | ---------- |
| 🏆 1 | Exo 2 (wordmark) + Inter (body) + JetBrains Mono (data) | `03-visual-identity/typography/typography-final.md`                    | 🏆         |
| ❌   | Pairing originale + B-alternatives                      | `typography/pairing-explorations.html` + `pairing-b-alternatives.html` | ❌ archive |

---

## Other Phase 10 surface (status update 2026-05-08)

| Surface           | Status                         | Path expected               | Note                                                                      |
| ----------------- | ------------------------------ | --------------------------- | ------------------------------------------------------------------------- |
| 1/5 Login         | 🚀 **Promoted** (login-aurora) | `06-mockups/auth/` (5 file) | Vedi sezione Login sopra. Phase 14.SH FASE 1.                             |
| 2/5 404 Not Found | ⏳ Roadmap promotion v1.0      | `06-mockups/public/`        | Non bloccante per chiusura brand. Va in `08-promotion/v1.0-checklist.md`. |
| 3/5 Empty state   | ⏳ Roadmap promotion v1.0      | `06-mockups/application/`   | idem                                                                      |
| 4/5 Onboarding    | ⏳ Roadmap promotion v1.0      | `06-mockups/application/`   | idem                                                                      |
| 5/5 Settings      | ⏳ Roadmap promotion v1.0      | `06-mockups/application/`   | idem                                                                      |

---

## Workflow di review (sessione tipo)

1. Enzo apre Storybook (`http://localhost:6006/`) sezione `Brand/Other Surfaces (Phase 10)/*` o equivalente
2. Visiona tutti i candidati di una surface
3. Aggiorna questo file con rank assegnato (1 / 2 / 3 / ...) + status (✅ ranked)
4. Se rank 1 stabile → status `🏆 selected` → trigger `/studio:bootstrap <mockup> <route>` per promozione tecnica
5. Mockup non scelti restano `❌ rejected (archive)` — non eliminati, riferimento storico

## Cross-reference

- Spec promozione: [`README.md`](../README.md) § Workflow di promozione a v1.0
- Skill bootstrap: [`.claude/skills/studio/SKILL.md`](../../.claude/skills/studio/SKILL.md) · `/studio:bootstrap`
- Stato corrente brand: [`BRAND-STATE.md`](../BRAND-STATE.md) § Current phase
- Decisioni: [`DECISIONS-LOG.md`](../DECISIONS-LOG.md)
