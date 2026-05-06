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

| Rank | Candidato             | Path                         | Status | Note                                                                                                                                                                   |
| ---- | --------------------- | ---------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| —    | login (base / formal) | `auth/login.html`            | 🟡     | Enterprise-rigid · tenant pill RTL Bank · M365 + Google Workspace SSO · primary feel B2B                                                                               |
| —    | login-aurora          | `auth/login-aurora.html`     | 🟡     | Glassmorphism futuristico · animated mesh gradient blu→viola · 6 floating dots · soft glow buttons hover                                                               |
| —    | login-split           | `auth/login-split.html`      | 🟡     | Layout 50/50 brand showcase + form · KG topology animata SVG · trust badges · editorial typography                                                                     |
| —    | login-playful         | `auth/login-playful.html`    | 🟡     | Magnetic Playful v1 · 5 shapes pastel (peach/sky/lilac) 120-240px · magnetic button hover · wordmark mouse-parallax · animated underline focus                         |
| —    | login-playful-v2      | `auth/login-playful-v2.html` | 🟡     | Playful v2 (no tenant) · 8 shapes piccole 40-92px solo brand-blue+accent · 4 motion asimmetriche (drift-rotate · bounce-tilt · flutter · scale-pulse) durate 6.2-11.3s |

**Decisione pending**: visual review + assegnazione rank · selezione winner per `/studio:bootstrap login`.

---

## Dashboard (Phase 9 — 5 surface complete · L21 D1 modello base)

Path base: `06-mockups/dashboards/`

Layout v2 (L22) + L23 architect customizations + L25 logo permanent + L27 retro-update applicati a tutti.

| Rank | Surface              | Path                                   | Status | Note                                                                                     |
| ---- | -------------------- | -------------------------------------- | ------ | ---------------------------------------------------------------------------------------- |
| 🏆 1 | hr-director-overview | `dashboards/hr-director-overview.html` | 🏆     | Maria CHRO · KPI ring + skill gap matrix + activity feed live + succession ready         |
| 🏆 1 | capability-graph     | `dashboards/capability-graph.html`     | 🏆     | Davide IT · KG topology SVG hero + ontology breakdown + ESCO sync                        |
| 🏆 1 | skills-heatmap       | `dashboards/skills-heatmap.html`       | 🏆     | Maria CHRO · matrice 8 dept × 12 skill heat + filters + distribution                     |
| 🏆 1 | employee-journey     | `dashboards/employee-journey.html`     | 🏆     | Andrea EMP · profile hero + career arc 5 stage + capability radar + bridging suggestions |
| 🏆 1 | org-systems          | `dashboards/org-systems.html`          | 🏆     | Davide IT (platform) · 4 tenant fleet + RBAC matrix + integration health + audit log     |
| —    | (index hub)          | `dashboards/index.html`                | 🏆     | Navigation hub 5 surface                                                                 |

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

## Other Phase 10 surface (work-in-progress)

| Surface           | Status                        | Path expected               |
| ----------------- | ----------------------------- | --------------------------- |
| 1/5 Login         | 🟡 5 candidati pending review | `06-mockups/auth/` (5 file) |
| 2/5 404 Not Found | ⏳ Not yet generated          | `06-mockups/public/`        |
| 3/5 Empty state   | ⏳ Not yet generated          | `06-mockups/application/`   |
| 4/5 Onboarding    | ⏳ Not yet generated          | `06-mockups/application/`   |
| 5/5 Settings      | ⏳ Not yet generated          | `06-mockups/application/`   |

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
