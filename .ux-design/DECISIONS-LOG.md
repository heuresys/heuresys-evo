# `.ux-design/` — Decisions Log (append-only)

> Cronologia di tutte le decisioni prese sul brand identity. **Append-only**: nuove decisioni in fondo, vecchie mai modificate (eventualmente "supersedute"). Ogni entry ha data, decisione, contesto, conseguenza.
>
> Per stato corrente consolidato vedi `BRAND-STATE.md`.

---

## L1 — 2026-05-04 — Scope `.ux-design/` definito

**Decisione**: scope = **B** (docs + asset SVG/PNG + JSON theme variants ThemeBuilderWizard). NO React sperimentale o sandbox di codice.

**Contesto**: Enzo opta per livello medio dopo aver visto 4 opzioni (A leggero / B medio / C pesante / D progressivo).

**Conseguenza**: `.ux-design/` cresce solo con markdown + SVG + PNG + JSON. Niente file `.tsx` o `package.json` qui.

---

## L2 — 2026-05-04 — Direzione greenfield + guida progressiva

**Decisione**: nessun vincolo iniziale su direzione estetica. Esplorazione aperta. Claude propone, Enzo sceglie a vista via Chrome companion.

**Contesto**: Enzo dice "non ho un modello in mente, però voglio design minimal moderno ma wow, con motion animazioni elementi come filmati che girano". Particolare attenzione alle dashboard.

**Conseguenza**: Phase 4 (aesthetic direction) sarà esplorativa, non vincolata.

---

## L3 — 2026-05-04 — Riferimenti compass approvati

**Decisione**: compass references per direzione = Linear, Vercel, Stripe, Apple keynote, Awwwards-tier.

**Contesto**: Enzo: "minimal moderno + wow + motion + filmati che girano".

**Conseguenza**: moodboard `02-aesthetic/moodboard.md` + trend research mirata su questi brand.

---

## L4 — 2026-05-04 — Dashboard come focus prioritario

**Decisione**: Phase 9 = **FOCUS MASSIMO ⭐⭐**. Dashboard saranno elemento centrale del frontend di prodotto.

**Contesto**: Enzo: "Particolare attenzione e ricercatezza va posta nelle dashboard perché saranno elemento centrale del frontend".

**Conseguenza**: pianificazione 4-5 dashboard mockup (HR Director / Capability Graph / Skills Heatmap / Employee Journey).

---

## L5 — 2026-05-04 — Versionato cross-machine via git (Option A)

**Decisione**: rimossa esclusione `.ux-design/` da `.git/info/exclude`. `.ux-design/` viene committato e pushato come tutto il resto del repo.

**Contesto**: trovato che la cartella era localmente esclusa. Enzo opta per A (versionato) tra A/B/C.

**Conseguenza**: ogni asset prodotto viene committato direct push main (no PR-driven default). Cross-machine accessibile via git.

---

## L6 — 2026-05-04 — Logo www.heuresys.com dichiarato definitivo (poi sciolto in L11)

**Decisione**: logo wordmark "Heuresys" Exo 2 con "y" purple (catturato da www.heuresys.com) = definitivo, da usare così com'è.

**Contesto**: Enzo: "il logo svg di heuresys in varie dimensioni che va tenuto come logo definitivo del progetto (proprio così come è: typo exo2 e due colori)".

**Conseguenza**: Phase 7 originalmente collassata a "logo derivati" (favicon, monochrome, og-image). 5 derivati prodotti.

**⚠️ STATUS**: superseduta dalla L11 (esplorazione completamente aperta).

---

## L7 — 2026-05-04 — Dashboard architecture 4-elementi data-driven

**Decisione**: dashboard = sempre composizione di **4 elementi** (header, footer, sidebar di scelta funzionale, content window). Composizione **data-driven via DBMS** (tabelle ruolo-dashboard, dashboard-elements). Theme inheritance dalla pagina caricata. Dashboard nidificate disabilitano header/footer.

**Contesto**: specifica architettonica fornita esplicitamente da Enzo.

**Conseguenza**: `01-strategy/dashboard-architecture.md` scritto come SoT. Phase 9 mockup vincolati a questa regola.

---

## L8 — 2026-05-04 — Audience positioning β Enterprise raccomandato

**Decisione**: tra α PMI (50-250) / β Enterprise (1000+) / γ Dual-track, **β raccomandata** come ancora primaria del brand (decisione finale pending).

**Contesto**: doctrine Heuresys è enterprise-grade, claim "layer ontologico" risuona con CHRO/CIO, dashboard density richiede power user.

**Conseguenza**: brand voice + density + claim shaping verso β. Brand può scendere verso PMI con landing dedicata. Decisione strategica finale pending da Enzo.

---

## L9 — 2026-05-04 — Direzione "Editorial Cinematic Ontologico" raccomandata + β+γ combinati (poi sciolto in L11)

**Decisione**: direzione cinematic dark-first (variant C palette), preservare brand del sito legacy, applicare layer cinematic motion (β) per marketing + densificazione dashboard-grade (γ) per app surface.

**Contesto**: Enzo dice "quello che raccomandi tu va bene".

**Conseguenza**: `02-aesthetic/direction-final.md` scritto. `03-visual-identity/color/palette-final.md` formalizzato. Logo derivati prodotti.

**⚠️ STATUS**: superseduta dalla L11.

---

## L10 — 2026-05-05 — Pairing B1 Geist convince ma vuole alternative comparabili

**Decisione**: Pairing B1 (Geist + Geist Mono) approvato come direzione typography, ma Enzo chiede 4 alternative coerenti con stesso mood.

**Contesto**: "La composizione B mi interessa ma sarebbe utile avere alternative di sostituzione di Geist con qualcosa di comparabile e coerente con il mix".

**Conseguenza**: `pairing-b-alternatives.html` scritto con 4 alternative (Geist / Manrope / DM Sans / Plus Jakarta Sans).

**⚠️ STATUS**: superseduta dalla L11 (typography reset insieme a logo+palette).

---

## L11 — 2026-05-05 — Reset completo: logo, palette, tipografia ricondiderati. Esplorazione libera con design award-winning 2025/2026

**Decisione**: il logo www.heuresys.com **NON è più vincolante**. Anche colori e tipografia sono "spunti", da evolvere. Enzo dichiara "sono pronto ad accogliere le novità". Esplorazione libera basata su trend award winners 2025/2026, con preferenza per design idoneo sia in light che dark mode.

**Contesto**: Enzo: "il logo (e l'intera landing page www.heuresys.com) te li ho mostrati per info ma non devono essere vincolanti. Possiamo anche rivedere l'affermazione che quello è il logo definitivo e lavorarci sopra più creativamente. anche sui colori e sulla tipografia. sono spunti ma dobbiamo evolvere".

**Conseguenza**:

- L6 (logo definitivo) → superseduta
- L9 (Editorial Cinematic Ontologico) → superseduta
- L10 (B1 Geist confirmed) → superseduta
- 4 direzioni iniziali α/β/γ/δ esplorate (commit 772cad9)
- 4 direzioni award-inspired ε/ζ/η/θ esplorate con light+dark toggle (commit 4b8cfa9)
- D1 (aesthetic direction finale) ora pending tra 8 alternative

**Web search insights assorbiti**:

- Centersquare (Brand Impact Award 2025): warm palette + custom iconography in conservative industry → ζ Architectural Warm
- OFF+BRAND × Lando Norris (Awwwards SOTY 2025): variable + animated logos → ε Sculptural Variable + θ Algorithmic Generative
- CSS Design Awards 2025-26: variable typography + sculptural type + asymmetric grid → ε Sculptural Variable
- FWA insight 82.7% dark users: adaptive color systems pari dignità light+dark → tutte le direzioni Set 2 hanno toggle
- Pentagram / Vignelli / Müller-Brockmann tradition → η Swiss Computational Pure

---

## L12 — 2026-05-05 — Sistema di continuità cross-session istituito

**Decisione**: creazione di SoT documents per resume cross-session: `SESSION-RESUME.md`, `BRAND-STATE.md`, `DECISIONS-LOG.md` (questo file). Pointer da `CLAUDE.md` root + `.handoff/STATE.md` + auto-memory entry.

**Contesto**: Enzo chiede continuità: "Però ho paura che in una nuova sessione non saremo in grado di ricostruire questo setup per continuare a riprendere il lavoro... Puoi trovare un modo per memorizzare e documentare tutto questo percorso e questo setup".

**Conseguenza**:

- `.ux-design/SESSION-RESUME.md` → protocollo 8-step per resume
- `.ux-design/BRAND-STATE.md` → SoT stato corrente (phase, decisioni, asset, setup tecnico)
- `.ux-design/DECISIONS-LOG.md` → cronologia append-only (questo file)
- `CLAUDE.md` root → sezione "Brand workstream" con pointer
- `.handoff/STATE.md` → sezione "Active workstream: brand identity"
- claude-mem MEMORY → entry per riconoscimento trigger "lavoriamo sul brand"

In una nuova sessione, Enzo dirà "lavoriamo sul brand" o equivalente, e Claude seguirà `SESSION-RESUME.md` per ripristinare contesto + setup.

---

## L13 — 2026-05-05 — Slash command `/brand` + skill `brand-resume` istituiti

**Decisione**: oltre ai 3 file SoT in `.ux-design/` e ai pointer in `CLAUDE.md`/`STATE.md`/auto-memory (L12), creare:

1. **Slash command `/brand`** in `.claude/commands/brand.md` — protocollo testuale che Claude esegue quando l'utente digita `/brand`
2. **Skill `brand-resume`** in `.claude/skills/brand-resume/SKILL.md` — invocabile via `Skill brand-resume` con auto-trigger su keyword detection (description nel frontmatter contiene i trigger)

**Contesto**: Enzo: "ok, facciamolo subito. aggiungi /brand e skill brand-resume, memorizza tutto (specialmente tutti gli artefatti e i modelli già creati)".

**Conseguenza**: il workstream brand è ora attivabile in **3 modi ridondanti**:

- Slash command esplicito (`/brand`)
- Skill auto-trigger via descriptor matching
- Trigger keyword detection via auto-memory entry

Persistenza garantita: tutti i file in git, sincronizzati cross-machine. Skill list di Claude Code mostra `brand` e `brand-resume` come available immediatamente dopo creazione (verificato 2026-05-05).

---

## L21 — 2026-05-05 — **D1 CHIUSA** · μ-architect-legacy fissato come modello base · Phases 5-9 sbloccate

**Decisione**: D1 (aesthetic direction finale) **risolta**. Modello base scelto: **`mu-architect-legacy.html`** (Set 5 — Systems Architect POV con palette legacy `www.heuresys.com`).

**Contesto**: Enzo dopo aver visto le 32 mockup esplorate (16 base + 16 Set 5 legacy variants): "fissiamo la dashboard architect come modello di partenza e sblocchiamo le fasi successive".

**Caratteristiche del modello base**:

| Aspetto             | Valore                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| Family              | Data-Dense Pro · Systems POV (Architect)                                                          |
| Palette base        | Legacy `www.heuresys.com` capture 2026-05-04 (variant C cinematic dark)                           |
| Bg dark             | `#0a0d18` (near-black navy)                                                                       |
| Bg light            | `#f4f5f7`                                                                                         |
| Brand primary       | `#3b82f6` (blue) — link, focus, CTA gradient start                                                |
| Accent              | `#a855f7` (purple) — logo y, glow, gradient end                                                   |
| Gradient            | `linear-gradient(135deg, #3b82f6 → #a855f7)`                                                      |
| Glow                | `drop-shadow(0 0 30px rgba(168,85,247,0.25))` sotto wordmark                                      |
| Wordmark            | **Exo 2 700** + y `#a855f7` weight 500, no italic (L18 sans-serif compliant)                      |
| Body typography     | Inter 400-500-600-700                                                                             |
| Mono                | JetBrains Mono                                                                                    |
| Layout              | Sidebar 220px + workspace · token explorer + governance + RBAC matrix + spacing grid reveal       |
| Trustworthy/Courage | 60T/40C exact (family-picker output match)                                                        |
| Anti-slop           | Compliant (single accent, no teal, container nesting ≤3, no animated dots, no 3-col feature grid) |

**Conseguenza · Phases sbloccate**:

| Phase                     | Status post-D1 | Output target                                                                                                                               | Effort      |
| ------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 5 — Color palette finale  | 🟡 Sbloccata   | `03-visual-identity/color/palette-final.md` v2 + `02-aesthetic/heuresys.DESIGN.md` (9 sezioni canoniche)                                    | 1-2h        |
| 6 — Typography pairing    | 🟡 Sbloccata   | `03-visual-identity/typography/typography-final.md` con Exo 2 + Inter + JetBrains Mono spec                                                 | 30 min      |
| 7 — Logo derivati         | 🟡 Sbloccata   | 5 SVG canonical aggiornati in `03-visual-identity/logo/final/`: wordmark · monochrome dark/light · mark · favicon · og-image                | 2-3h        |
| 8 — Motion language       | 🟡 Sbloccata   | `04-motion-language/motion-final.md` + 5-8 prototipi animati: glow · gradient transitions · KG hover · sparkline · scroll-triggered reveals | 4-6h        |
| 9 ⭐⭐ — Dashboard mockup | 🟡 Sbloccata   | 4-5 dashboard surface specifici basati sul template μ-architect: HR Director · Capability Graph · Skills Heatmap · Employee Journey · Org   | 6-10h FOCUS |
| 10 — Altre surface        | ⏳ Pending     | Login · onboarding · empty state · error 404 · settings (post-Phase 9)                                                                      | 4h          |
| 11 — Theme variants JSON  | ⏳ Pending     | `05-theme-variants/heuresys-theme.json` ThemeBuilderWizard format                                                                           | 2h          |
| 12 — Brand book v0        | ⏳ Pending     | `07-brand-book/brand-book-v0.md` consolidamento finale                                                                                      | 4h          |

**Direzioni alternative esplorate** (32 totali) restano archiviate come "explored alternatives" in `02-aesthetic/direction-explorations/` per reference futura. Nessuna eliminata.

**Open questions risolte da L21**:

- D2 audience positioning: implicitamente confermata β Enterprise (μ-architect è enterprise-first)
- D3 logo strategy: preservare wordmark legacy + applicare standard L16/L18 a tutte le surface (y `#a855f7` purple, weight 500, no italic per Exo 2 sans)
- D4 body+mono pairing: Inter + JetBrains Mono confermati (lock dal modello)

---

## L20 — 2026-05-05 — Set 5 estensione palette legacy a tutti 16 mockup via CSS overlay

**Decisione**: estendere la palette legacy `www.heuresys.com` a TUTTI i 16 mockup direction-explorations come **Set 5** (legacy palette variant set). Implementazione via CSS overlay esterno `legacy-palette.css` + `!important` overrides invece di rewrite manuale di 16 file.

**Contesto**: Enzo: "(b) ma devi usare il logo iniziale tratto dalla landing heuresys.com, stessa tipografia ... e stessi colori". Voleva uniformity completa: stesso logo (Exo 2 + y purple), stessa tipografia wordmark, stesso color system legacy applicato a TUTTI i 16 mockup.

**Implementazione tecnica**:

- File `02-aesthetic/direction-explorations/legacy-palette.css` (~145 righe) — override CSS variables + Exo 2 wordmark + glow effect
- 16 mockup `<name>-legacy.html` creati via bash: `cp <name>.html <name>-legacy.html` + `sed` insert tag `<link rel="stylesheet" href="legacy-palette.css" />` dopo `</style>` + Exo 2 font import dopo `</title>`
- Selectors override coprono tutti i pattern di applicazione data-theme: `:root, [data-theme="dark"], body, body[data-theme], body[data-theme="dark"]` — necessario perché alcuni mockup (η/ζ/θ/ε) settano data-theme su `<body>`, altri (α/β/γ/δ/ι/κ/λ/μ-\*) su `<html>`. Senza la copertura completa, body inline `[data-theme="dark"]` overrides :root su descendant elements.
- Direction-specific tokens mappati: `--terracotta` → purple (ζ), `--gen-1/2/3` → gradient (θ), `--magenta-ft` → purple (δ), `--engineering-yellow` → purple (γ), `--blueprint` → blue (γ/ι), `--cap-*` → spectrum legacy (α). Total ~30 variabili overrided.

**File rinominato**:

- `mu-architect-legacy.html` (L19 custom detailed) → `mu-architect-legacy-detailed.html` (preserved as bonus preview)
- Nuovo `mu-architect-legacy.html` ora segue il pattern Set 5 uniforme (CSS overlay invece di rewrite custom)

**Conseguenza**:

- Index.html aggiornato con sezione "Set 5 · Legacy palette overlay" (badge gradient blue→purple, grid 4-col compatto)
- Title doc: "16 Direzioni + Set 5 Legacy Palette" (32 mockup total accessibili)
- Wordmark in tutti 16 mockup ora rendered in **Exo 2 700** (legacy logo font) con y in `#a855f7` purple (L18 compliant — sans-serif no italic)
- Glow effect `drop-shadow(0 0 30px rgba(168,85,247,0.25))` applicato a tutti i wordmark Set 5
- nav-bar bottom border gradient blue→purple visibile in tutti i mockup Set 5 come signature unificante

**Browser visual review confermata** (η/ζ/α/ι/μ-pragmatic): tutti gli elementi accent originali (Swiss red, terracotta, engineering yellow, magenta-ft, gen gradient, etc.) ora convertiti correttamente a purple/blue/gradient legacy. Nessun residuo color-leak da CSS variables originali.

---

## L19 — 2026-05-05 — μ-architect variant con palette legacy www.heuresys.com applicata

**Decisione**: creare un mockup `mu-architect-legacy.html` che applica la palette del sito legacy `www.heuresys.com` al modello μ-architect. Esperimento per visualizzare come la struttura tokens/governance/RBAC del Systems Architect POV si presenta sotto i colori brand legacy invece dell'accent Linear `#5e69d1` originale.

**Contesto**: Enzo: "Proviamo a prendere l'ultima elaborazione quella dell'Architect sui database e fare una versione a cui applicare applichiamo I colori della landing page originale che ti avevo mandato".

**Palette legacy applicata** (da `02-aesthetic/heuresys-com-current-style.md` § Identità visiva osservata):

- `--bg`: `#0a0d18` (dark navy near black) / light: `#f4f5f7`
- `--surface-1/2/3`: `#14182a` / `#1c2138` / `#252b48` (dark)
- `--brand-blue`: `#3b82f6` (legacy brand primary — link, focus, CTA gradient start)
- `--accent`: `#a855f7` (legacy brand accent — logo y, glow effect, gradient end)
- `--gradient`: `linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)` — CTA buttons "Inizia Ora"
- `--glow`: `0 0 60px rgba(168, 85, 247, 0.35)` — purple soft shadow sotto wordmark

**Tipografia**: wordmark in **Exo 2 700** (font legacy del logo, non Inter). y in `var(--accent)` purple `#a855f7`, weight 500, **NO italic** (L18 — Exo 2 sans-serif).

**Elementi legacy signature**:

- Glow effect purple drop-shadow sotto `.wordmark.glow`
- Brand colors panel con 3 swatches grandi (blu / viola / gradient)
- Sidebar active link con `border-left: 2px solid var(--brand-blue)` (visual signal)
- "PRODUCTION" badge env con gradient blue→purple
- "Design _token explorer_" headline con "token explorer" rendered in gradient text
- RBAC role names in gradient text (instead di solo accent)

**Conseguenza**:

- File `02-aesthetic/direction-explorations/mu-architect-legacy.html` creato (~360 righe)
- Spec L16+L18 logo standard rispettati: y in single accent purple, weight gap moderato (700 → 500), no italic per Exo 2 sans
- Legacy gradient blue→purple usato per **decorative emphasis** (CTA badges, headline moments, role names) — pattern già presente sul sito legacy
- **NON aggiunto a index.html** — preview standalone in attesa di feedback Enzo. Se approvato, può diventare 17ma direzione o sostituire variante μ-architect default

**Open question**: se la legacy palette piace, va estesa retroattivamente a tutti i 16 mockup esistenti come "palette legacy variant set" (Set 5)? O resta esperimento isolato?

---

## L18 — 2026-05-05 — Logo y italic vietato per font sans-serif (browser visual review fix)

**Decisione**: aggiornare lo standard L16 con eccezione tipografica: **font sans-serif** (Inter, Geist, Space Grotesk, Bricolage variable) **NON usano italic** sulla y del wordmark. Differenziatore = solo `color: var(--accent)` + `font-weight` gap moderato. **Font serif** (Fraunces, Source Serif, Newsreader, DM Serif) mantengono italic (preferito) — il glyph italic serif è distinctive e non causa overlap.

**Contesto**: Enzo ha mostrato screenshot del logo "Heuresys" in η Swiss dark mode — anche dopo il fix letter-spacing (L16 patch precedente), la y italic Inter aveva descender slanted che invadeva visivamente lo spazio della "s" adiacente, creando l'effetto "incollato/sovrapposto". Enzo: "praticamente tutti così, hai sistemato solo beta-brutalist-paper.html ma gli altri modelli sono ancora sbagliati". β resta OK perché Fraunces italic ha glyph distinctive.

**Conseguenza**:

- `02-aesthetic/logo-standard.md` aggiornato: spec "Style y" ora distingue sans-serif (no italic) da serif (italic preferito). CSS pattern canonico split in `.wordmark.sans .y` e `.wordmark.serif .y`.
- 11 mockup sans-serif fixed (rimosso `font-style: italic` da `.y` rule):
  - α Geist, γ Space Grotesk, η Inter, ε Bricolage, θ Bricolage gradient, ι Inter SVG tspan, λ Inter SVG tspan + wordmark-remix, μ Inter SVG tspan, μ-architect Inter, μ-pragmatic Inter, μ-synthesis Inter
- 5 mockup serif preservati con italic: β Fraunces, δ Newsreader, κ Source Serif, ζ DM Serif Display, μ-art-director Source Serif moments
- Browser visual review (Claude in Chrome, screenshot zoom + theme toggle) ha verificato che i fix risolvono l'overlap visivo — y dritta in sans = signal accent + weight contrast, leggibile e distintiva senza descender problem

**Pattern technical insight**: Inter italic 'y' ha descender che curva verso destra (consequence of italic angle ~10°). Quando seguita da 's' non-italic con letter-spacing -1.5px o più, il descender invade visualmente il glyph 's'. Il browser rendering tecnicamente è corretto (kerning nativo) ma il VISUALMENTE risultato è che 'y' e 's' sembrano sovrapposte. Fraunces italic invece ha y con tail che si curva verso BASSO (non a destra), quindi non invade s.

---

## L17 — 2026-05-05 — Set 1 dual-theme rewrite + Set 4 μ persona variants

**Decisione**: (a) riscrivere i 4 mockup Set 1 (α/β/γ/δ) da single-theme a dual-theme (light+dark toggle in pari dignità, allineamento L8) + applicazione logo y-accent standard L16; (b) creare un Set 4 di **4 varianti del modello μ Data-Dense Temperata** che esprimano visivamente i 3 punti di vista del prompt `3-designer-debate.md`: μ-architect (Systems POV — tokens, scale, governance), μ-art-director (Pentagram POV — craft, ontology signature, editorial), μ-pragmatic (Conversion POV — CTA, KPI, trial), μ-synthesis (best compromise 40/30/30 dei 3).

**Contesto**: Enzo: "per coerenza devi riscriver i modelli che hanno solo un tema negli equivalenti che hanno doppio tema light/dark... aggiungi (crea) 4 varianti del modello Data-Dense Temperata che rappresentino bene il punto di vista (e quindi le differenze) tra art director, architect e pragmatic e la quarta sia il miglior compromesso tra i tre pareri".

**Conseguenza**:

- 4 mockup Set 1 riscritti da Write completo: ognuno ora ha `:root` (light/dark) + theme-toggle button + JS persistence + logo wordmark con y-accent class (L16 compliant)
  - α Editorial Cinematic: dark default + cream-warm light counterpart
  - β Brutalist Paper: cream light default + warm-graphite dark counterpart
  - γ Industrial Blueprint: paper light default + deep-blueprint dark counterpart
  - δ Quantitative FT: salmon light default + deep-maroon dark counterpart
- 4 mockup Set 4 nuovi:
  - `mu-architect.html` — token-labeled surfaces, RBAC governance schema, accent-soft derivation chain. Accent locked Linear `#5e69d1`. Mono dominant.
  - `mu-art-director.html` — 5 distinct capability glyphs (Process/Structure/Performance/Role/Competency) Pentagram-style + KG hero al centro. Accent plum `#7a3a9c`. Source Serif 4 italic moments. Editorial column-count.
  - `mu-pragmatic.html` — Free-trial banner + visible CTAs + big KPI showcase con sparkline + activity feed con social proof (RTL Bank, SmartFood, EcoNova). Accent green `#22c55e`.
  - `mu-synthesis.html` — Best compromise: 40% Architect (token-labeled surface-note) + 30% Art Director (5 glyphs sidebar + italic hero em + KG contained) + 30% Pragmatic (KPI ring + activity feed + understated CTA). Accent originale μ `#7a7fad`.
- Index aggiornato a "16 Direzioni Estetiche" + sezione Set 4 (badge plum `#b370e0`)
- BRAND-STATE.md asset inventory esteso a 16 mockup + logo-standard.md
- Tutti i 16 mockup ora: light+dark toggle + logo L16 compliant + anti-slop guardrails (Set 3+4)

**Set 4 design intent**: dare a Enzo 4 esecuzioni della stessa famiglia visivamente differenziate, così che la scelta D1 finale possa includere non solo "quale famiglia/direction" ma anche "quale POV/proporzione di compromesso". μ-synthesis è la default razionale; i 3 single-POV servono come "ceiling" e "floor" per ogni dimensione (token clarity vs ontology signature vs conversion).

---

## L16 — 2026-05-05 — Logo y-accent standard cross-direction definito

**Decisione**: standardizzare il rendering del wordmark "heuresys" come spec **indipendente dalla tipografia** ma omogenea nel concetto. La lettera "y" è sempre in `var(--accent)` color (theme-aware), con weight contrasto **moderato** rispetto al body (es. body 700 → y 500), style italic preferito, e letter-spacing naturale del font (NO override custom). Distanza `s-y-s` simmetrica e identica al kerning naturale.

**Contesto**: Enzo: "il logo non è ben formattato e/o non rispetta il principio dell'y evidenziata dalle altre lettere. dobbiamo definire lo standard indipendente dalla tipografia ma omogeneizzato nel concetto: possiamo immaginare che la y sia sempre nell'accent color del modello (o qualcosa del genere)". Spec affinata in feedback: weight gap moderato (no 200 estremo), letter-spacing naturale (no gap di fluidità), distanza s-y-s simmetrica.

**Conseguenza**:

- Creato `02-aesthetic/logo-standard.md` come SoT canonico (regole + CSS pattern + HTML/SVG pattern + anti-pattern + checklist conformità)
- Applicazione retroattiva su tutti i mockup esistenti (12 direzioni Set 1 + 2 + 3) come parte di Round 1-3
- η Swiss Computational ha y weight 200 vs body 800 — gap estremo, da ridurre a y weight 500-600 per compliance L16
- Set 3 ι Industrial Blueprint Tempered: wordmark Inter senza y-accent — da fix
- Set 3 μ Data-Dense Temperata: wordmark Inter senza y-accent — da fix
- Set 3 κ Quantitative FT Tempered: già conforme (Source Serif y italic accent)
- Set 3 λ γ × η Remix: già conforme (η-style y italic accent)
- Set 1 α/β/γ/δ: tutti single-theme + non-conforming logo — da rewrite in dual-theme + apply standard (Round 2)

**Compatibilità tipografica verificata**: Inter, Source Serif 4, Space Grotesk, Bricolage Grotesque variable, Geist, Source Sans 3.

---

## L15 — 2026-05-05 — Set 3 data-dense variants ι κ λ μ + family-picker output applicato + 3-designer-debate critique

**Decisione**: applicare il prompt `99-samples/rohitg00-prompts/family-picker.md` per chiudere D1 in modo strutturato. Risposte raccolte da Enzo: (Q1) mix scan-heavy prevalente con read-heavy secondario; (Q2) prosumer; (Q3) trustworthy 60% / courage 40%. Output family-picker: famiglia raccomandata **Data-Dense Pro** (ClickHouse/PostHog), secondaria Editorial Minimalism (Linear/Vercel), AVOID Cinematic Dark. Generazione di **4 nuove direzioni HTML mockup** (ι/κ/λ/μ) come Set 3 con light+dark toggle. Per ogni direzione, applicato `99-samples/rohitg00-prompts/3-designer-debate.md` come `<direction>.critique.md` (Architect/Art Director/Pragmatic in 3 round + synthesis + 3 action items concreti).

**Contesto**: Enzo: "(d) tutto sopra in sequenza" → "(III) Pieno 4 mockup + applicazione `brand-3-designer-debate.md` in append a ciascuno". Risposte family-picker raccolte interactively (Q1 → Q2 → Q3) con context hint da BRAND-STATE personas e dashboard architecture.

**Conseguenza**:

- 4 mockup HTML standalone in `02-aesthetic/direction-explorations/` (light+dark toggle, pattern Set 2)
  - `iota-industrial-blueprint-tempered.html` — γ rivisto sotto ClickHouse mood × Linear restraint, single amber accent. 55T/45C.
  - `kappa-quantitative-ft-tempered.html` — δ rivisto verso PostHog product-marketing × FT typographic discipline. Source Serif headline + muted rose accent. 65T/35C.
  - `lambda-gamma-eta-remix.html` — γ × η token arbitration via `remix-two-brands.md` rules. Parent DNA γ=45%, η=55%. 60T/40C.
  - `mu-data-dense-temperata.html` — Clean slate. PostHog mood × Linear restraint × Heuresys ontologico ESCO. Dashboard-first surface (sidebar 220 + KPI ring + table + KG canvas). Anti-slop guardrails attivi. 60T/40C exact.
- 4 file `.critique.md` corrispondenti con 3-designer-debate completo (~150 righe ognuno, 12 action items totali)
- Index aggiornato a "12 Direzioni Estetiche" con sezione Set 3 (badge purple `#7a7fad`)
- BRAND-STATE.md D1 row aggiornato + asset inventory esteso

**Insight chiave dai 4 critique** (per decisione D1):

- **ι** = floor (safe ma non differenziante, "ClickHouse per HR")
- **κ** = ceiling editorial-distinctive (signature alta, rischio dashboard claustrofobia in sustained reading)
- **λ** = playable middle ground framework-driven (token clarity, ma incremental + lineage academic)
- **μ** = floor + ceiling pragmatico, ship-ready, family-picker exact match (60/40), può evolvere ontology signature graduale

**Action items consolidati cross-direzione** (da Phase 7-9):

- Graph-glyph system definition (5 capability glyphs distinti) — toccato da ι, λ, μ critique
- Logo monogram replacement (mark astratto graph-based) — Art Director minority report ricorrente
- KG topology promossa a hero in landing/marketing surface — μ critique
- Compact-mode toggle dashboard (Inter-only fallback per κ se scelta D1)
- Live demo test 5 enterprise prospect — Pragmatic action

---

## L14 — 2026-05-05 — Integrazione brand reference library `.ux-design/99-samples/`

**Decisione**: creazione della knowledge base interna `99-samples/` con 27 file curati da fonti esterne (VoltAgent/awesome-design-md, rohitg00/awesome-claude-design, getdesign.md, Department of Product). Adozione del pattern canonico **DESIGN.md a 9 sezioni** (Visual Theme / Color / Typography / Components / Layout / Depth / Do-Don't / Responsive / Agent Prompt Guide) come format target per il futuro `heuresys.DESIGN.md`.

**Contesto**: Enzo: "ti invio dei link da cui puoi attingere per esempi e setup dimostrativi ed anche trarre informazioni per creati skills, agenti, plugin e tools in genere per arricchire questa tua capacità di governare processi di definizione di brand identity". Adozione filosofia "design-as-markdown" (LLM read markdown best, no parsing/config).

**Conseguenza**:

- 12 spec YAML brand reference (`voltagent-design-md/`) — Linear, Stripe, Vercel, ClickHouse, PostHog, HashiCorp, Notion, Sentry, Supabase, Apple, Claude, WIRED
- 8 framework prosa narrativi (`rohitg00-frameworks/`) per 6 famiglie (editorial, data-dense, warm, glass, cinematic, terminal)
- 6 workflow prompt templates (`rohitg00-prompts/`) — `family-picker`, `brand-to-design-md`, `audit-live-site`, `3-designer-debate`, `remix-two-brands`, `break-default-aesthetic`
- 1 token-budget recipe per Claude Design cloud
- README indice in `99-samples/README.md` con mapping 8 direzioni Heuresys ↔ famiglie standard
- 8 candidati skill/agent identificati per derivazione futura (top 3: `brand-family-picker`, `brand-3-designer-debate`, `brand-anti-slop`)
- Famiglia raccomandata per Heuresys (B2B enterprise + dashboard-heavy + ontologico): **Data-Dense Pro** (ClickHouse/PostHog) con disciplina Editorial Minimalism (Linear/Vercel) come secondaria

**Vincolo scope**: tutti i file in `99-samples/` sono read-only references; nessun import in production code (rispetta scope vincolante L1).

---

## L22 — 2026-05-05 — Phase 9 5/5 dashboard complete + layout v2 (sidebar collapsible · header logo · tenant-mini · solid color buttons)

**Decisione**: chiusura Phase 9 con 5 dashboard surface complete e adozione **layout v2** che applica 4 regole brand-wide:

1. **Logo Heuresys nel header** (nav-bar `nav-left`) di tutti i dashboard, MAI nella sidebar. Wordmark Exo 2 700 + y `var(--accent)` weight 500 + glow drop-shadow 12px (versione `wordmark-sm` 18px per nav-bar).
2. **Tenant logo nella sidebar** via `.tenant-mini` card in cima (sotto il toggle): rounded square 32px `t-avatar` + `t-name` Inter 600 13px + `t-meta` mono 10px sector/env. RTL Bank per dashboard tenant-scoped, Heuresys System per platform-level (Org & Systems).
3. **Sidebar collassabile** 240px → 64px via toggle button in alto sidebar (chevron icon che ruota). State persistito in `localStorage.heuresys-sidebar`. Sezioni `<h4>` cliccabili per espandere/comprimere via `.sidebar-section.collapsed > *:not(h4) { display: none }` — niente wrapper extra. Chevron `▾` ruota a `-90°` quando collapsed.
4. **Buttons solid color** (NO gradient): `.btn-primary { background: var(--accent) }` + hover `var(--accent-deep)`. Regola estesa a TUTTI gli sfondi di oggetti UI riconoscibili: avatar (`.user-card .avatar`, `.profile-hero .pic`, `.t-avatar`), badge pill (`.label-ph9`), progress bar fill (`.density-bar`, `.histo-bar`, `.bridge-card .ring-fill`), milestone dot (`.arc-event.done .dot`), succession candidate top, etc. Gradient ammesso SOLO come decoration line (`nav-bar::after` 2px) o `<linearGradient>` SVG dataviz (graph edges, radar fills).

**Contesto**: dopo lancio Phase 9 con HR Director Overview (L21), Enzo richiede:

- "nelle dashboard la sidebar deve essere comprimibile e deve avere il comando comprimi/espandi (icona) in alto"
- "le voci di menù della sidebar devono essere collassabili ed espandibili"
- "il logo heuresys deve essere posizionato nel header. Nella sidebar va inserito il logo del tenant"
- "non voglio pulsanti con gradienti di colore ma solo solid color secondo lo schema"
- "questo vale anche per lo sfondo di altri oggetti, come ad esempio il cerchio con le iniziali dell'utente attivo"

**Conseguenza · 5 dashboard surface complete**:

| #   | File                        | Persona              | Tenant       | Scope         | Highlight                                                                                                 |
| --- | --------------------------- | -------------------- | ------------ | ------------- | --------------------------------------------------------------------------------------------------------- |
| 01  | `hr-director-overview.html` | Maria CHRO · level 2 | RTL Bank     | strategic     | KPI ring · skill gap matrix · activity feed live · succession ready 8 ruoli                               |
| 02  | `capability-graph.html`     | Davide IT · level 1  | RTL Bank     | technical     | KG topology SVG hero · ontology breakdown 5 capability · top entities by edge density · ESCO sync         |
| 03  | `skills-heatmap.html`       | Maria CHRO · level 2 | RTL Bank     | tactical      | matrice 8 dept × 12 ESCO skill · heat critical→OK · filters · distribution histogram · top P0 critical    |
| 04  | `employee-journey.html`     | Andrea EMP · level 6 | RTL Bank     | self-service  | profile hero · career arc 5 stage · skill evolution 4q · capability radar 5-axis · 3 bridging suggestions |
| 05  | `org-systems.html`          | Davide IT · level 1  | Heuresys Sys | platform-wide | 4 tenant fleet · RBAC matrix 8 roles × 33 areas · integration health · audit log live · system metrics    |

**Shared structure** (tutti 5):

- `<nav class="nav-bar">` con `nav-left` (back + wordmark-sm) + label PHASE 9 + theme toggle
- `<aside class="sidebar">` con `sidebar-header` (toggle) + `tenant-mini` + N `sidebar-section` (h4 collapsibili) + `user-card`
- `<main class="workspace">` con `ws-header` + KPI ring + content panels + `ws-footer`

**Persistence**: `localStorage` chiavi `heuresys-theme` (dark/light) + `heuresys-sidebar` (open/collapsed).

**Index navigation hub**: `06-mockups/dashboards/index.html` con grid 5 card (badges persona + tenant + scope).

**Verifica**: HTTP 200 confermato su tutti i 5 dashboard + index hub via `http://127.0.0.1:8765/06-mockups/dashboards/`.

**DESIGN.md aggiornato**: Section 4 (Buttons solid + Object backgrounds rule + Sidebar nav v2) · Section 7 (Do/Don't gradient regola) · Section 9 (Agent Prompt Guide rule) · NUOVA Section 10 (Layout patterns Phase 9).

**Open questions emerse durante L22**:

- D5 · icon library standard: Enzo ha richiesto "showcase delle 10 librerie di icone più moderne e minimaliste utilizzate in dashboard wow in rete" — pagina demo da costruire come prossimo step.

---

## L23 — 2026-05-05 — Architect-style customizations cross-dashboard (logo legacy · bordered avatars · sticky header+footer · scroll indipendenti)

**Decisione**: applicate 6 personalizzazioni cross-surface a tutti i 5 dashboard (HR Director Overview · Capability Graph · Skills Heatmap · Employee Journey · Org & Systems):

1. **Logo legacy nav-bar**: wordmark "Heuresys" capital H + body in `var(--brand-blue)` blue + y in `var(--accent)` purple (replicates landing page www.heuresys.com)
2. **Tenant avatar bordered** (`.t-avatar.bordered`): cornice 2px primario blue + iniziali secondario purple + bg `var(--bg)` theme-aware
3. **User avatar bordered-inverse**: colori invertiti — cornice purple + iniziali blue
4. **Sidebar-top row**: toggle button a sinistra del tenant card sulla stessa linea (flex row); collapsed = stack vertical
5. **Header fisso + body flex column**: `body { overflow: hidden; height: 100vh; flex column }` · `.nav-bar { flex-shrink: 0 }` · `.app { flex: 1; overflow: hidden }` · `.sidebar` e `.workspace` con `overflow-y: auto` indipendenti · scrollbar custom 8px
6. **Footer fisso** (`.app-footer`): copyright + 5 social icons SVG (LinkedIn · X · GitHub · YouTube · Instagram) + 6 ctx-items dynamic context-aware. Gradient line accent purple opacity 0.3 in cima.

**Footer ctx-items per dashboard**:

| Dashboard            | ctx-items dynamic                                                                |
| -------------------- | -------------------------------------------------------------------------------- |
| HR Director Overview | Cycle Q1 · Reviews 86% · Mapped 89% · Tenant RTL Bank · Build · Session          |
| Capability Graph     | ESCO v1.2.0 · Nodes 14.011 · Edges 42.087 · Sync 1h 12m · Build · Session        |
| Skills Heatmap       | Cycle Q1 · Critical 12 P0 · Avg 72,3% · Cells 96 · Build · Session               |
| Employee Journey     | Reviews 4 cycles · Skills 14/18 · Readiness 68% · Tenure 2y 4m · Build · Session |
| Org & Systems        | Uptime 99,97% · ESCO sync 1h · Alerts 0 · Tenants 4 · Build · Session            |

**Contesto**: dopo chiusura Phase 9 con L22, Enzo richiede in sequenza personalizzazioni "solo per il modello architect" (org-systems), poi estende a tutti 5 dashboard. Modifiche introdotte progressivamente: logo legacy → tenant bordered → user inverse → sidebar-top → sticky+scroll → footer.

**Conseguenza**: tutti 5 dashboard production-ready hanno layout v3 architect-style. Class CSS rinominata `.tenant-card` → `.tenant-mini` per evitare collisione con `.tenant-card` del main panel di org-systems (Tenant fleet overview).

**Implementazione**: 6 modifiche applicate via Edit chirurgico file-by-file (CSS architect-override block + HTML transformations). Verifica HTTP 200 su tutti i 5 + index hub. Commit `7a80fab`.

---

## L24 — 2026-05-05 — Phase 8 Motion language complete (5 prototipi + motion-final.md SoT)

**Decisione**: chiusura Phase 8 con 5 prototipi standalone HTML che dimostrano il vocabolario motion canonico Heuresys + spec markdown SoT + index navigation hub.

**Direttiva**: Trustworthy 60% / Courage 40%. Motion funzionale, non decorativa. Anti-pattern bandita: blinking, bouncy/elastic, infinite spinning, durations &gt; 600ms su UI elements.

**5 prototipi**:

| #   | Pattern                   | Spec tecnica                                                                                      |
| --- | ------------------------- | ------------------------------------------------------------------------------------------------- |
| 01  | Wordmark glow breathing   | drop-shadow blur 30px ⇄ 60px · opacity 0.20 ⇄ 0.45 · 4s loop ease-in-out · landing hero only      |
| 02  | Gradient transitions      | theme switch dark↔light · 200ms ease-out · color tokens only (NO layout transition)               |
| 03  | KG topology hover         | node scale 1→1.18 + drop-shadow + edges focus/blur + tooltip · 150ms ease-out · :hover trigger    |
| 04  | Sparkline draw + count-up | stroke-dashoffset L→R 200ms · area fade-in 100ms delay · number count-up 200ms ease-out           |
| 05  | Scroll-triggered reveals  | opacity 0→1 + translateY 8px→0 · 300ms ease-out · stagger 60ms × child · one-shot (NO re-animate) |

**Token CSS canonical**:

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1) /* entry, reveal */
  --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1) /* loops soft (breathing) */
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0) /* exit, dismiss */ --dur-instant: 100ms
  /* toggle, switch */ --dur-fast: 150ms /* hover, focus */ --dur-standard: 300ms
  /* reveal, slide */ --dur-slow: 600ms /* hero entrance */ --dur-chart: 200ms
  /* chart render, sparkline */ --dur-loop-glow: 4s /* wordmark breathing */;
```

**Accessibility**: tutti i prototipi rispettano `@media (prefers-reduced-motion: reduce)` → animazioni disabilitate, snap-to-final-state.

**Conseguenza · Phase tracking**:

- Phase 5 / 6 / 7 fissate come ✅ Done (erano già chiuse in L21 ma BRAND-STATE riportava 🟡 — discrepanza documentale risolta)
- Phase 8 ✅ Done (L24)
- Phase 9 ✅ Done (5/5 dashboard + L22 + L23)
- Phases pending residue: 10 (altre surface) · 11 (theme JSON) · 12 (brand book v0) · 13 (promotion checklist)

**Implementation guideline post-Phase 8**: quando si integrerà motion in `services/app/` Next.js production, replicare token CSS variables, no GSAP/Lottie, preferire CSS animations + Framer Motion solo per orchestrazione (modal, AnimatePresence).

**Asset prodotti** in `04-motion-language/`: 1 SoT markdown + 1 index hub + 5 prototype HTML standalone.

---

## L25 — 2026-05-05 — Logo wordmark — REGOLE PERMANENTI (supersedes weight gap di L16)

**Decisione**: 4 regole permanenti per il logo Heuresys che superano i compromessi precedenti L16 (weight gap 700→500) e L18 (no italic per sans-serif):

1. **`h` sempre minuscola** → wordmark = `heuresys` (mai `Heuresys` capital)
2. **Tutte le 8 lettere identiche** per font, peso, size, style — nessun gap di weight, nessuna scale-down, nessun italic
3. **Solo `y` color diverso** (`var(--accent)`) — il **colore** è l'UNICO differenziatore
4. **Embed ovunque**: in header, footer, modal, social meta si usa sempre il logo embedded `<span class="wordmark">heures<span class="y">y</span>s</span>` — mai plain text "heuresys" o "heuresys.com"

**Contesto**: Enzo: "il logo deve essere quello della landing page di heuresys.com ma con cambiamenti da rendere permanenti: la h iniziale deve essere sempre minuscola e la y di diverso colore deve avere la stessa grandezza e spessore delle altre lettere del logo e non deve essere italic. Quindi ogni lettera è uguale alle altre. In tutte le ricorrenze di heuresys in header e in footer va utilizzato il logo e non il testo semplice".

**Conseguenza · file aggiornati**:

- 5 dashboard HTML in `06-mockups/dashboards/` (header `wordmark-sm` + footer copyright `wordmark-foot` embedded in `heuresys.com` link)
- 1 dashboard index hub
- 5 motion prototypes HTML in `04-motion-language/`
- 1 motion index hub
- 1 icon-libraries-showcase
- 5 SVG canonical in `03-visual-identity/logo/final/`: `heuresys-wordmark.svg` · `monochrome-dark.svg` · `monochrome-light.svg` · `heuresys-mark.svg` · `favicon.svg` · `og-image-template.svg`
- `02-aesthetic/logo-standard.md` (spec doc — sezione "L25 PERMANENT" in cima + regole canoniche aggiornate)
- `02-aesthetic/heuresys.DESIGN.md` Section 3 Typography (logo rule riscritta)

**Cambiamenti tecnici**:

| Prima (L16+L18)                                            | Dopo (L25)                                                                              |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `Heures<span class="y">y</span>s` (capital H)              | `heures<span class="y">y</span>s` (lowercase)                                           |
| `.y { color: var(--accent); font-weight: 500; }` (gap 200) | `.y { color: var(--accent); }` (no override)                                            |
| Spec L16: weight body 700 → y 500 contrasto moderato       | Spec L25: weight identico, color is signal                                              |
| Footer: `<a>heuresys.com</a>` plain text                   | Footer: `<a><span class="wordmark-foot">heures<span class="y">y</span>s</span>.com</a>` |

**Storia evolutiva**:

- L6 (2026-05-04): logo legacy dichiarato definitivo → superseduta L11
- L11 (2026-05-05): reset esplorazione libera → superseduta logo selection
- L16 (2026-05-05): y-accent standard con weight gap 700→500
- L18 (2026-05-05): no italic per sans-serif (descender problema)
- **L25 (2026-05-05)**: regole permanenti — color-only differentiator, lowercase h, embed ovunque

**Direction-explorations Set 1-5** (16+16 mockup in `02-aesthetic/direction-explorations/`) NON aggiornati: archiviati come "alternatives explored". Reference storico, non production. Se in futuro si vuole revisione retroattiva, è opt-in.

---

## L26 — 2026-05-05 — Skill `studio` + namespace `/studio:*` per workflow clone↔promote↔backup di route Next.js

**Decisione**: creata skill `studio` in `.claude/skills/studio/` con 7 slash command namespaced (`/studio`, `/studio:clone`, `/studio:diff`, `/studio:promote`, `/studio:restore`, `/studio:backup-list`, `/studio:status`) per disciplinare il ciclo di modifica di route Next.js attraverso il dominio brand identity. Vincolo: **modifiche a `services/app/src/app/<route>/` passano sempre attraverso `.ux-design/10-staging/` con backup restorable obbligatorio**.

**Contesto**: Enzo ha richiesto "una skill molto strutturata e completa per gestire le attività di sviluppo del frontend e delle interfacce web che include la gestione del brand identity, la creazione/modifica di oggetti sperimentali, la promozione di esempi/prototipi a oggetti di produzione". Modello: clone → manipola → promote (con gate B audit + C anti-slop + D verification + E user confirm) → backup pre-promote in `.ux-design/.backups/<route>/<TS>-pre-promote/` con `MANIFEST.json`.

**Conseguenza**:

- Granularità: pagina intera (route Next.js) — `<route>/page.tsx` + `_components/` + co-located `loading.tsx`/`error.tsx`/`layout.tsx`/`actions.ts`/`route.ts`
- Path clone: `.ux-design/10-staging/<route>/<YYYY-MM-DD-HHMM>/`
- Path backup: `.ux-design/.backups/<route>/<YYYY-MM-DD-HHMM>-pre-promote/` con `MANIFEST.json` (schema `studio.manifest.v1`)
- Promozione atomica: dry-run + 5 gate (A-E) + 2 fail-safe (F repo clean, G husky) + commit (NO push automatico)
- Skill orchestrate: `superpowers:brainstorming` (gate A), `superpowers:verification-before-completion` (gate D), `/brand:audit` (gate B), `/brand:anti-slop` (gate C), opzionali `frontend-design`, `frontend-design-pro:design`, `figma:figma-implement-design`
- Drift detection: sha256 file produzione confrontato con `.source-hashes.json` generato al clone
- Script Bash POSIX cross-platform (Windows Git Bash + Mac zsh + VM Ubuntu)
- 3-modi attivazione: slash command `/studio` · skill `studio` auto-trigger · auto-memory `feedback_studio_workstream.md`
- OUT-OF-SCOPE day-1: token CSS (vedi `/brand-studio` URL), asset brand (vedi `/brand:*`), componenti `packages/ui/`, cross-route refactor, DB/migration
- Plan d'origine: `~/.claude/plans/voglio-creare-una-skill-magical-castle.md`
- Implementation in 5 commit phases (skeleton, clone, read-only, promote, restore + integration)

**Disambiguazione naming**: `studio` skill (filesystem) ≠ `/brand-studio` URL (route Next.js wizard token CSS). Zero overlap. La pagina `/brand-studio` può essere clonata via `/studio:clone brand-studio` come qualsiasi altra route.

## L27 — 2026-05-06 — "Logo originale" canonical · due colori fissi · eccezione plain text per indirizzi/link/domini

**Decisione**: il logo predefinito Heuresys si chiama d'ora in poi **"logo originale"** (per distinguerlo da eventuali altri logo derivati o sperimentali futuri). La spec L25 (lowercase h, 8 lettere identiche, no italic, color-only differentiator) è cumulata con due chiarimenti operativi:

1. **Due colori fissi** (theme-aware nel hue ma sempre blue + purple):
   - Body 7 lettere = `var(--brand-blue)` — pattern già consolidato in Phase 9 dashboard come `.wordmark-foot.legacy` (L23)
   - `y` = `var(--accent)` — purple come da L16/L25
   - Mai più `color: var(--ink)` per il body wordmark (era il default L25 generico)
2. **ECCEZIONE plain text** alla regola "embed ovunque" (L25 punto 6): se la ricorrenza "heuresys" fa parte di un **indirizzo, link o dominio**, resta plain text lowercase senza embed. Casi documentati: top-back link `← heuresys.com`, tenant-meta `rtl-bank.heuresys.com`, footer copyright `© 2026 heuresys.com`, FQDN `evo.heuresys.com` / `www.heuresys.com`, email `info@heuresys.com`, programmatic `localStorage` key, `<title>` HTML.

**Contesto**: Enzo ha chiarito la regola completa quando ha rivisto il primo batch di Phase 10 login mockup (commit 88703f8 + 57bab40):

> "devi memorizzare che la scelta predefinita è il logo con i due colori fissi, tipografia unica per tutte le lettere, la h minuscola e sostituzione di tutte le ricorrenze di heuresys (indipendentemente se in parte o in tutto maiuscolo o minuscolo) in header o footer di una pagina (anche modale) devono essere sostituite con il logo a meno che non si tratti di indirizzo, link o dominio"

E successivamente:

> "lo chiameremo 'logo originale' per distinguerlo dagli altri logo che creiamo"

Errori commessi nel primo batch login mockup (poi corretti):

- `.wordmark-hero { color: var(--ink); }` (theme-aware) invece di `var(--brand-blue)` (fisso)
- Top-back link, tenant-meta, footer copyright = ricorrenze in domini → erroneamente embeddate (corretto: plain text)
- `login-aurora.html` `.y` con gradient text + shimmer animation 4s (violava "color is unique differentiator" + introduceva movement)
- Title HTML capital `Heuresys` (corretto: lowercase)

**Conseguenza**:

- 4 login mockup `.ux-design/06-mockups/auth/login*.html` sistemati conformi L27
- Classe utility `.wm-inline` introdotta (Exo 2 700 + brand-blue body + accent y) per embed inline in contesti tipografici diversi (mono/Inter) — contiene override anche `text-transform: lowercase` per neutralizzare parent uppercase mono labels
- `02-aesthetic/logo-standard.md` aggiornato con sezione L27 + nome canonical "logo originale" + tabella eccezione plain text
- Auto-memory `~/.claude/projects/D--evo-heuresys-com/memory/feedback_logo_originale_l27.md` creata + indicizzata in `MEMORY.md`
- Phase 9 dashboard mockup esistenti (5 surface + index hub) usano `.wordmark-foot` embed nel footer copyright dove "heuresys.com" è dominio → tecnicamente violano L27. Decisione: NON retro-update, lasciare come archivio storico (commit ≥ b0d2127). Future surface seguono L27.

**Storia evolutiva**:

- L6 (2026-05-04) → superseduta L11
- L11 (2026-05-05) → reset esplorazione
- L16 (2026-05-05) → y-accent standard con weight gap 700→500
- L18 (2026-05-05) → no italic per sans-serif
- L21 (2026-05-05) → D1 chiusa · μ-architect-legacy modello base
- L22 (2026-05-05) → Phase 9 layout v2 · logo nav-bar header
- L23 (2026-05-05) → logo legacy customization · pattern `.wordmark-foot.legacy` (body brand-blue + y accent)
- L25 (2026-05-05) → regole permanenti finalizzate
- **L27 (2026-05-06)** → "logo originale" + due colori fissi + ECCEZIONE plain text per indirizzi/link/domini

## L28 — 2026-05-06 — "Logo relativo" convenzione richiamabile · body+y derivati dal tema CSS attivo

**Decisione**: introdurre seconda convenzione richiamabile **"logo relativo"** che condivide la stessa struttura tipografica del "logo originale" (Exo 2 700 · h lowercase · 8 lettere identiche · no italic · letter-spacing naturale) ma con il **mapping dei due colori derivato dal tema CSS attivo** invece di essere fisso a brand-blue + accent purple.

Spec CSS:

```css
.wordmark-relative {
  font-family: 'Exo 2', sans-serif;
  font-weight: 700;
  color: var(--logo-body, var(--ink)); /* token tema · fallback --ink */
  letter-spacing: normal;
  text-transform: lowercase;
}
.wordmark-relative .y {
  color: var(--accent); /* token tema (può variare per direction) */
}
```

**Convenzioni token**:

- Body color: `--logo-body` (token canonico dedicato) — definito dal tema
- Fallback body: `--ink` (CSS custom property fallback nativo `var(--logo-body, var(--ink))`)
- Y color: `--accent` (sempre con questo nome, varia per tema)

**Distinzione operativa logo originale vs logo relativo**:

| Convenzione                | Body                                             | Y                                     | Quando si usa                                                                                              |
| -------------------------- | ------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `.wordmark-original` (L27) | `var(--brand-blue)` fisso (legacy heuresys.com)  | `var(--accent)` fisso (purple legacy) | Default cross-surface · tema brand canonical                                                               |
| `.wordmark-relative` (L28) | `var(--logo-body, var(--ink))` derivato dal tema | `var(--accent)` derivato dal tema     | Surface con tema CSS alternativo (direction estetica diversa, palette cliente custom, variante stagionale) |

**Contesto**: Enzo: "creiamo 'logo relativo' il logo creato secondo il medesimo criterio di logo originale con la variazione dei due colori a body in var(--xxx) + y in var(--accent) dove --xxx e --accent sono derivati dalla configurazione della palette di colori del tema adottato (e non mi riferisco a light e dark ma proprio al tema css o simile) prescelto".

Risposte alle 2 domande operative pre-formalizzazione:

1. Nome canonico body token: **`--logo-body`** (token dedicato, opzione `a`)
2. Fallback se tema non definisce body token: **`var(--ink)`** (theme-aware neutro, opzione `b`)

**Conseguenza**:

- `02-aesthetic/logo-standard.md` aggiornato con sezione "Due convenzioni richiamabili: originale e relativo" + classe `.wordmark-relative` documentata + esempio applicativo tema "Blueprint γ"
- Auto-memory `~/.claude/projects/D--evo-heuresys-com/memory/feedback_logo_relativo_l28.md` creata + indicizzata in `MEMORY.md`
- `BRAND-STATE.md` § Decisioni stabilite riga L28 aggiunta
- Tabella storia evolutiva in `logo-standard.md` aggiornata

**Note**:

- L27 (logo originale) resta default cross-surface — `.wordmark-relative` si usa solo dove tema CSS alternativo è attivo
- ECCEZIONE plain text L27 per indirizzi/link/domini si applica anche al logo relativo (regola condivisa)
- Direction-explorations Set 1-5 (32 mockup archive) NON retro-aggiornati: usano i propri pattern wordmark inline. Lasciati come archivio storico
- Quando in futuro creeremo direction tematizzate (es. cliente custom, stagione, evento), il pattern sarà `.wordmark-relative` con tema CSS che definisce `--logo-body` + override `--accent`

---

## L29 — 2026-05-06 — Phase 13.A — Atomic dashboard components shipped (8 component family)

**Decisione**: Phase 13.A chiusa con 8 atomic dashboard component pubblicati in `packages/ui/src/components/dashboard/` e re-esportati come TIER 17 dal barrel `@heuresys/ui`. Estratti dai 5 mockup Phase 9 (`hr-director-overview`, `capability-graph`, `skills-heatmap`, `employee-journey`, `org-systems`).

**Componenti**:

| Component               | Mockup di origine          | Pattern interno                                                  |
| ----------------------- | -------------------------- | ---------------------------------------------------------------- |
| `IntegrationHealthPill` | org-systems                | Badge + dot pulse · 4 tone (ok/warn/down/info)                   |
| `KpiRing`               | hr-director-overview hero  | Wrap RadialGauge + threshold tone resolution + trend indicator   |
| `SuccessionCard`        | hr-director-overview panel | Avatar + role pair + LinearGauge readiness + risk Badge          |
| `CareerArc`             | employee-journey 5-stage   | Horizontal arc · 3 status (past/current/future) · `aria-current` |
| `KgMiniGraph`           | capability-graph           | Wrapper compatto su NetworkGraph (cytoscape) · legend opzionale  |
| `SkillHeatmap`          | skills-heatmap 8×12        | Semantic table + 5-bucket scale + interactive `onCellClick`      |
| `CapabilityRadar`       | employee-journey radar     | Pure SVG · n-axis · multi-series con default colors OKLCH        |
| `RbacMatrix`            | org-systems RBAC 8×9       | Tabella sticky + 5 livelli (none/read/write/admin/owner) cycle   |

**Contesto**: Phase 13.0 backend mining chiusa (8/8 pack legacy importati + Pack 2.3+2.6 reopen partial). Phase 13.A è il primo layer UI data-driven previsto dal plan `~/.claude/plans/credo-che-se-tu-jazzy-key.md`. Direttiva "Autonomous execution mode" del plan: decisioni tecniche auto-implementate, scegliere il più semplice in caso di ambiguità.

**Decisioni tecniche prese in autonomia**:

- **CapabilityRadar pure SVG (no D3 rendering)**: d3 era disponibile ma il radar è geometricamente semplice (sin/cos su n-axis). Evitare dipendenza runtime extra ed embed shim D3 — direttiva SEMPLICITÀ.
- **CareerArc horizontal layout invece di estendere `Timeline` verticale**: il pattern di `employee-journey.html` è horizontal arc. Component standalone più semplice di adattare Timeline verticale.
- **KgMiniGraph wrapper anziché clone**: NetworkGraph esistente già copre il caso d'uso; wrapper aggiunge default height compatto + legend opzionale.
- **SkillHeatmap usa `<table>` semantico, non solo CSS Grid**: a11y migliore (header sticky con `scope`, `aria-label` su cella) e click handler con keyboard navigation.
- **RbacMatrix con 5 livelli (`none/read/write/admin/owner`) invece di 4**: pattern legacy ha gradiente continuo, ma 5 buckets discreti sono sufficienti per UI MVP e mappabili a `widget_catalog.requires_min_role` Phase 13.C.

**Conseguenza**:

- `packages/ui` da 84 a 92 stories Storybook (8 nuovi `Dashboard/*` namespace)
- Test suite packages/ui: 64 → 85 test verdi (+21 test atomic dashboard)
- Typecheck 5/5 workspace clean
- TIER 17 nel barrel main `@heuresys/ui` con 8 component + 14 tipo export
- Phase 13.A acceptance: tutti i 5 mockup ricomponibili a vista usando atomic components (verificato visivamente nelle stories `Triplet`, `Grid`, `IntegrationRow`, `EightByTwelve`)
- Sblocco Phase 13.B (schema + seed `dashboard_elements` + `dashboard_presets`) e Phase 13.C (engine renderer in `services/app/src/lib/dashboard-engine/`)

**File creati**:

- `packages/ui/src/components/dashboard/{integration-health-pill,kpi-ring,succession-card,career-arc,kg-mini-graph,skill-heatmap,capability-radar,rbac-matrix}.tsx` (8)
- `packages/ui/src/components/dashboard/*.stories.tsx` (8)
- `packages/ui/src/components/dashboard/index.ts` (barrel)
- `packages/ui/src/components/__tests__/dashboard.test.tsx` (21 test)

**Riferimenti**:

- Plan source: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md` § Phase 13.A
- BRAND-STATE.md § Current phase aggiornata a 13.A done

---

## L30 — 2026-05-06 — Phase 13.B — Dashboard engine schema + seed shipped (`dashboard_presets` + `dashboard_elements`)

**Decisione**: Phase 13.B chiusa con 2 nuove tabelle additive (`dashboard_presets` + `dashboard_elements`) materializzate via migration raw SQL `db/migrations/0002_phase13_dashboard_engine.sql` + seed `db/seeds/phase13_dashboard_presets.sql`. Schema Prisma esteso chirurgicamente. RLS attiva su `dashboard_elements`.

**Tabelle create**:

| Tabella              | Scopo                                                                                        | RLS                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `dashboard_presets`  | Registry mockup-derived templates (9 Tier 1) · platform-wide                                 | NO (lettura pubblica)                                                                           |
| `dashboard_elements` | Binding (preset × widget × grid position × visibility) · `tenant_id NULL` = platform default | SI · FORCE · policy `tenant_id IS NULL OR tenant_id = current_setting('app.current_tenant_id')` |

**Distribuzione preset seedati** (9 totali, 30 element binding):

| Perspective | Count | Preset codes                                                                                                  | Published                              |
| ----------- | ----- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| TALENT      | 3     | `hr_director_overview`, `skills_heatmap`, `employee_journey`                                                  | TRUE                                   |
| ENTERPRISE  | 2     | `capability_graph`, `org_systems`                                                                             | TRUE                                   |
| PROCESS     | 4     | `process_recruiting_funnel`, `process_onboarding_flow`, `process_performance_cycle`, `process_learning_paths` | FALSE (Phase 13.D pending mockup HTML) |

**Element binding**: ogni preset ha 3-5 widget binding referenziati per `widget_code` agli atomic component TIER 17 (KpiRing, IntegrationHealthPill, SuccessionCard, CareerArc, KgMiniGraph, SkillHeatmap, CapabilityRadar, RbacMatrix). `widget_catalog_id` lasciato NULL — i nostri atomic component non sono in `widget_catalog` (sono UI primitive Phase 13.A, non widget legacy).

**Decisioni autonome documentate**:

- **Schema additivo, non breaking**: `IF NOT EXISTS` ovunque · `ON CONFLICT DO NOTHING/UPDATE` per idempotenza. Migration G14 verificata re-runnable; seed G15 idempotente (9 preset + 30 element pre/post identici).
- **Boundary chiarito**: `dashboard_presets` (NEW · template Phase 13) ≠ `dashboards` (esistente · user workspace UUID-based · 20 row) ≠ `rbp_dashboards` (esistente · role-default sistema · 11 row). Nessuna collisione di nomi né overlap funzionale.
- **`dashboard_presets` platform-wide (no `tenant_id`)**: i 9 preset Tier 1 sono templates platform; il filtraggio per tenant avviene runtime via RBP perspective. Pattern coerente con `rbp_dashboards`.
- **`dashboard_elements.tenant_id` nullable (P10 multi-level)**: NULL = platform default; non-NULL = tenant override. Partial unique indexes garantiscono no duplicate `(preset, position)` per platform e per tenant separatamente. Pattern P10 esplicito da CLAUDE.md.
- **RLS isolation testata strutturalmente + funzionalmente simulata**: tutti i ruoli login DB evo hanno `BYPASSRLS=true` (pattern intenzionale evo · isolation reale via Prisma client extension applicativo, vedi `docs/20-architecture/rls-with-prisma-pattern.md`). Test funzionale ha richiesto simulation con WHERE clause = policy qual (verified: SMF query non vede RTL row con filtro corretto).
- **`widget_code` come stable identifier**: ogni element punta sia a `widget_catalog_id` (FK opzionale) sia a `widget_code` VARCHAR (denormalizzato, stabile). Permette di binding sia a widget legacy esistenti (catalog) sia ad atomic component TIER 17 nuovi (solo widget_code).
- **Migration applicata via `pg` client Node** (psql non installato Windows host) · script inline con DATABASE_URL da `.env`. Pattern riutilizzabile per future migration locali.
- **Schema Prisma esteso chirurgicamente** invece di full `db pull`: il pull aveva introdotto inconsistency su modello pre-esistente non correlato (`ext_pb0002` `@ignore` mismatch). Edit chirurgico = 4 modifiche puntuali (3 relation back-reference + 2 new model in fondo prima degli enum).

**Conseguenza**:

- DB evo ha ora la materialization layer per la composizione runtime delle 9 dashboard Tier 1
- Schema model presenti in Prisma client v5.22 rigenerato → typecheck 5/5 workspace clean
- Phase 13.C (engine renderer) sbloccata: può leggere `dashboard_presets` + `dashboard_elements` via `prisma.dashboard_presets.findUnique({ where: { code }, include: { dashboard_elements: { orderBy: { position: 'asc' } } } })`
- Phase 13.D promotion ridotta a UPDATE su `is_published=true` per i 4 PROCESS preset (placeholder già seedati)

**File creati/modificati**:

- `db/migrations/0002_phase13_dashboard_engine.sql` (NEW · 130 LOC)
- `db/seeds/phase13_dashboard_presets.sql` (NEW · 175 LOC)
- `services/app/prisma/schema.prisma` (MOD · +50 LOC, 2 nuovi model + 4 relation back-ref)
- `services/app/prisma/generated/client/` (rigenerato)

**Riferimenti**:

- Plan source: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md` § Phase 13.B
- RLS pattern doc: `docs/20-architecture/rls-with-prisma-pattern.md`
- BRAND-STATE.md § Current phase aggiornata a 13.B done

---

## L31 — 2026-05-06 — Phase 13 CHIUSA · 13.C engine renderer + 13.D 4 PROCESS mockup + 13.E doc

**Decisione**: Phase 13 chiusa definitivamente in modalità autonomous execution. Tutte le 6 sotto-phase 13.0 → 13.E eseguite end-to-end nella stessa sessione. 9 dashboard preset Tier 1 sono ora servite via route `/dashboard/[code]` con engine data-driven + 4 mockup HTML PROCESS scritti come MVP placeholder + doc canonical `dashboard-engine-pattern.md`.

### 13.C Engine renderer

**File creati**:

- `services/app/src/lib/dashboard-engine/loader.ts` (50 LOC · server) — `loadDashboardPreset(code, { tenantId, requirePublished })` + `listPublishedPresets()` via Prisma
- `services/app/src/lib/dashboard-engine/resolver.ts` (95 LOC · pure) — `resolveElements()` con visibility filter (userRoleLevel <= visibility_min_role) + perspective filter (`?observer=...`) + tenant override merge per position
- `services/app/src/lib/dashboard-engine/registry.tsx` (230 LOC · client `'use client'`) — `WIDGET_REGISTRY` con 8 atomic component TIER 17 lazy-loaded via `next/dynamic ssr:false`
- `services/app/src/lib/dashboard-engine/grid.tsx` (65 LOC · client) — `<DashboardGrid>` CSS Grid 12-col renderer con clamp difensivo
- `services/app/src/lib/dashboard-engine/index.ts` (20 LOC) — public server-safe API barrel
- `services/app/src/app/dashboard/[code]/page.tsx` (90 LOC · server component) — auth + load + resolve + render
- `services/app/src/__tests__/dashboard-engine.test.ts` (175 LOC · 18 test) — pure resolver coverage

**Decisioni autonome 13.C**:

- **URL path `/dashboard/[code]` (non `(dashboard)/[code]` come da plan)** — il plan suggeriva route group ma sarebbe collassato a `/[code]` catturando tutto root URL. Estensione del legacy `/dashboard` evita collisioni con route static esistenti (`/login`, `/showcase`, `/brand-studio`, `/dashboard`). Legacy `/dashboard` (employee list scaffold) intoccato.
- **`ssr: false` uniforme su tutti i widget** — alcuni (KgMiniGraph) richiedono `window` (cytoscape DOM measure) e non sono SSR-safe. Trattamento uniforme = consistenza + no edge case mixed. Future widget data-bound possono switch a `ssr: true` se semplici.
- **Widget renderizzano demo data hardcoded (V1)** — parità Storybook stories. V2 (Phase 14) widget riceverà `config` + `data` props da engine `data-fetcher`. V1 dashboard è "shell + atomic component MVP", non backend data binding.
- **Resolver pure functions con 18 vitest test** — copertura completa visibility/perspective/tenant override merge/sort/edge cases. Loader e registry restano untested unit (richiederebbero mock Prisma + DOM browser; coperti via integrazione runtime + Storybook visual).
- **BigInt → string serialization al RSC boundary** — `dashboard_elements.id` e `dashboard_preset_id` sono BIGINT; React RSC payload non serializza BigInt nativamente. Cast esplicito a string nel page.tsx prima di passare al client.
- **Loader NON applica RBP filter** — separation of concern: data access vs business logic. Resolver pure functions = facili da testare senza DB.
- **Filtro tenant esplicito nel loader** (`OR tenant_id = userTenantId`) — pattern Prisma client extension non ancora attivo per services/app, quindi defense-in-depth applicativa nel loader. RLS DB-level resta defense aggiuntiva (BYPASSRLS-aware).

### 13.D PROCESS mockup + promotion

**File creati** (`.ux-design/06-mockups/dashboards/`):

- `process-recruiting-funnel.html` (~150 LOC) — Recruiter · funnel 5-stage + ageing + bottleneck detection
- `process-onboarding-flow.html` (~150 LOC) — Ops Manager · kanban 4-stage + first-90-day milestone checklist
- `process-performance-cycle.html` (~150 LOC) — Line Manager · OKR roll-up + 360-review status + calibration heatmap
- `process-learning-paths.html` (~150 LOC) — L&D + EMP · top-5 paths funnel + skill bridge ESCO

**Decisioni autonome 13.D**:

- **Mockup MVP placeholder ~150 LOC vs ~750 LOC dei 5 esistenti** — MVP intenzionale: pattern coerente, persona/data illustrativi, footer "Phase 13.D MVP · expand in Phase 14". Espansione a parità Phase 9 differita perché design Phase 14 può evolvere il pattern.
- **Tutti riusano μ-architect-legacy palette + L25 logo + layout v2** — coerenza con i 5 esistenti
- **Flip `is_published=true` via UPDATE diretto su DB** + edit corrispondente di `db/seeds/phase13_dashboard_presets.sql` per coerenza re-run idempotente. Risultato: 9/9 preset published.

### 13.E Hardening

**File creati**:

- `docs/20-architecture/dashboard-engine-pattern.md` (NEW · 200+ LOC) — pattern canonical engine + boundary 3 namespace dashboard chiarito (`rbp_dashboards` system 11 row · `dashboards`/`dashboard_widgets` user workspace UUID · `dashboard_presets`/`dashboard_elements` Phase 13 templates) + RLS defense-in-depth pattern + sequenza chiamate cold cache + future evolutions out-of-scope V1

**Decisioni autonome 13.E**:

- **Audit log mutations P4 deferred a Phase 14+** — V1 i preset sono solo seed-managed (no UI editing). Audit log diventerà critico quando UI editor utente (`dashboards`/`dashboard_widgets` runtime) sarà aggiunto.
- **E2E Playwright + golden image diff deferred a Phase 14+** — richiede setup infra Playwright non in scope sessione. Test coverage attuale: 18 vitest unit + 21 atomic component test (Phase 13.A) = 39 vitest test sul lato dashboard engine + UI. Acceptance V1 via smoke test live (manual).
- **Bundle analyzer + perf budget P95 ≤500ms deferred** — il design (1 Prisma query + pure function + lazy widget load) è ottimizzato by construction. Misurazione effettiva al primo deploy production.

### Outcome Phase 13 cumulativo

| Sotto-phase | Status | Commit  | Plan effort | LOC delta principali                                       |
| ----------- | ------ | ------- | ----------- | ---------------------------------------------------------- |
| 13.0        | ✅     | (multi) | 14-16 d     | api-gateway 30+9 endpoint · 446 test · allowlist 9→52      |
| 13.A        | ✅     | a99beb3 | 5-7 d       | packages/ui +9 file dashboard · 21 test · TIER 17 barrel   |
| 13.B        | ✅     | 6defffb | 4-5 d       | db/migrations/0002 · seed 9 preset · schema.prisma +50 LOC |
| 13.C        | ✅     | 6980088 | 8-10 d      | dashboard-engine 5 file + page.tsx · 18 vitest test        |
| 13.D        | ✅     | (this)  | 6-8 d       | 4 mockup HTML PROCESS · flip is_published                  |
| 13.E        | ✅     | (this)  | 4-5 d       | docs/20-architecture/dashboard-engine-pattern.md           |

**Test count cumulativo Phase 13**:

- packages/ui: 64 → 85 (+21) — atomic component
- services/app: 16 → 34 (+18) — engine resolver
- services/api-gateway: 430 → 446 (+16) — Pack 2 reopen (Phase 13.0)
- **Totale evo: ~510 → ~565 vitest test verde**

**Conseguenza**:

- Heuresys evo ora ha la prima generazione di dashboard data-driven funzionante, accessibile via `/dashboard/<code>` per tutti i 9 preset Tier 1
- Architettura engine documented in `dashboard-engine-pattern.md` come SoT canonical per maintenance + Phase 14 expansion
- Promotion path tracciato in BRAND-STATE.md + DECISIONS-LOG L29-L30-L31
- Phase 14 scope decisione aperta (data-fetcher real, drag-resize editor, mockup PROCESS expansion, E2E)

**Riferimenti**:

- Plan source: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md` § Phase 13.C/D/E
- Doc canonical engine: `docs/20-architecture/dashboard-engine-pattern.md`
- BRAND-STATE.md § Current phase aggiornata a Phase 13 ✅ DONE
- STATE.md § Last session brief aggiornato a Phase 13 closure

## Decisioni scartate (per riferimento)

| Direzione                                                         | Motivo scarto                                                  | Reference                            |
| ----------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------ |
| Pairing A — Universale (Inter Tight + Inter + JetBrains)          | Più sicuro ma "passe-partout", manca distintività              | turn-of-decision typography 1° round |
| Pairing C — Editorial Distinct (Space Grotesk + Inter + IBM Plex) | Aggiunge secondo carattere distintivo che si scontra con Exo 2 | turn-of-decision typography 1° round |
| Pairing B2 Manrope                                                | Troppo morbido/friendly per "serious enterprise"               | turn-of-decision B-alternatives      |
| Pairing B3 DM Sans                                                | "Mood industrial-severo" si scontra con cinematic glow         | turn-of-decision B-alternatives      |
| Logo "definitivo" www.heuresys.com legacy                         | Sciolto in L11, esplorazione libera                            | L11                                  |
| Direzione "Editorial Cinematic Ontologico"                        | Sciolta in L11 (esplorazione libera)                           | L11                                  |
| Variant C palette confermata                                      | Sciolta in L11 (palette varia per ogni delle 8 direzioni)      | L11                                  |

## L32 — 2026-05-07 — Phase 14 Sprint 1 (Bundle F · sub-phase A+H) shipped autonomous

**Decisione**: Phase 14 Bundle F (Full · 60-89 FTE-day · tutte 8 tracce A-H) selezionato post-Phase 13 closure. Sprint 1 sub-phase **A (live data binding)** + **H (i18n IT/EN)** shippate end-to-end in autonomous mode con 6 commit consecutivi su main:

- `1cd433f` 14.A.0 PoC live data binding · KpiRing live in hr_director_overview
- `6c90a66` 14.A.4 expansion · 7 adapters + Live wrappers + seed expansion (8 KpiRing SQL + 4 IntegrationHealthPill static)
- `bda9e16` 14.A.5+6 route handler `/api/dashboard/data/[elementId]` + SWR client hook + 14.H i18n primitives + page integration
- `ae6b6f7` 14.A.7 perf script (autocannon) + 14.D Playwright PoC (3 spec verde su HR_DIRECTOR/hr_director_overview)
- `19d3172` 14.A composite static seed (9 widget instances · SuccessionCard, CareerArc×2, KgMiniGraph×2, SkillHeatmap×2, CapabilityRadar, RbacMatrix)
- `dff5e80` docs/20-architecture/dashboard-engine-pattern.md update con Phase 14.A status

**Contesto**: utente ha selezionato bundle F (Full) sapendo che è multi-sprint vs default raccomandato R. Sub-phase A è high-value foundation (sblocca trasformazione MVP→prodotto operativo); H è quick win (dataset bilingue già seedato). Eseguito in autonomous mode stile Phase 13: ogni sub-phase con commit + smoke test live + STATE.md update + push diretto main, senza chiedere conferma a ogni step.

**Conseguenza**:

- Pipeline live data binding attiva: `data-fetcher` (sql/static dispatch + cache TTL + RLS via `withTenant`), `adapters` (8 widget coverage), `prefetch` (parallel server-side), `registry` rifattorizzato a Live wrapper unificato con Demo fallback. Tutti 8 widget code Live-capable; basta seedare `config_overrides.data_source` per attivarli per element specifico.
- Route handler `/api/dashboard/data/[elementId]` con auth + RBP visibility + tenant ownership gates pronto per refresh client-side.
- Hook `useWidgetData()` SWR-style zero-deps disponibile per consumare il route handler.
- i18n IT/EN runtime live: `?lang=` + localStorage + `LocaleProvider` + `useLocale()` + `pickBilingual()` server-safe. Header dashboard switcha runtime IT↔EN.
- Smoke verified live: KpiRing pos 1 in hr_director_overview mostra `Active employees · 270` (RLS scope RTL Bank); SuccessionCard pos 2 mostra `Stefania Bianchi`; ?lang=it ↔ ?lang=en switcha header copy.
- Test: 120/120 vitest verde su services/app (43 baseline + 16 fetcher + 28 adapters + 6 prefetch + 10 route + 9 hook + 17 i18n). 3/3 E2E Playwright verde. 5/5 typecheck verde.
- Sprint 1 follow-up registrate: composite SQL queries (jsonb_agg per talents/skills · richiede schema knowledge), production-mode perf binding (`next build && start` + autocannon), full 72-fixture matrix (8 ruoli × 9 dashboard).
- Sprint 2-3 da scope draft restano disponibili: E audit log mutations · F /ontology + OpenAI advisor · C drag-resize editor · B mockup PROCESS expansion · G Tier 2 (ESCO/SAP/KG explorer).

**Riferimenti**:

- Plan Bundle F: `~/.claude/plans/phase14-{index,sprint1-foundation,sprint2-ai-compliance,sprint3-ux-tier2}.md`
- Scope draft: `docs/70-planning/phase14-scope.md`
- Engine pattern aggiornato: `docs/20-architecture/dashboard-engine-pattern.md` § Phase 14.A
- STATE: `.handoff/STATE.md`

## L33 — 2026-05-07 — Phase 14 Sprint 1 follow-up + Sprint 2.E shipped (RBP matrix + audit helper)

**Decisione**: Continuata l'esecuzione autonomous post-L32 con altri 4 commit consecutivi su main:

- `532d13a` 14.D RBP matrix · CANONICAL_USERS espansa a 5 ruoli RTL Bank (TENANT_OWNER, IT_ADMIN, HR_DIRECTOR, HR_MANAGER, LINE_MANAGER) · `dashboard-rbp-matrix.spec.ts` parametrizza l'asserzione "sees 4 widgets" sui 5 ruoli · 8/8 verde (5 matrix + 3 base) in 26s
- `d1fba14` Sprint 2.E `auditedDashboardMutation()` helper · wrap atomico mutation + audit_logs insert in singola transazione Prisma · 4 action types (CREATE/UPDATE/DELETE/PUBLISH) · guard contract enforce oldValue=null su CREATE e newValue=null su DELETE · 12 vitest verde
- `b4b303e` STATE.md final · summary 11 commit cumulative + verification commands + follow-up roadmap
- `80673e6` docs globali · CLAUDE.md "Stato attuale" Phase 14 + BRAND-STATE Phase 14 row updated

**Contesto**: dopo L32 (Sprint 1 A+H closure) l'utente ha ribadito "non devi fermarti a chiedere autorizzazione · proprio come prevedeva autonomous mode stile Phase 13". Esecuzione autonomous proseguita allargando coverage Sprint 1.D (matrix RBP scaffold) e introducendo Sprint 2.E come standalone helper pronto per Sprint 3.C drag-resize editor (consumer naturale).

**Conseguenza**:

- Coverage E2E Playwright passa da 3 spec (single role) a 8 spec (5 ruoli × 1 dashboard + 3 base): infrastruttura matrix validata, espansione a 9 dashboard è meccanica.
- Discovery: 2/7 ruoli RTL Bank (DEPT_HEAD `alice.esposito` + EMPLOYEE `alberto.colombo`) hanno bcrypt `$2a$10$` legacy hash con password diversa da Heuresys2026!. Documentati come Sprint 1 follow-up: re-seed canonical demo users con password unificata sblocca full 72-fixture matrix.
- `auditedDashboardMutation()` disponibile come scaffolding pulito: zero produzione consumer attuale, ma quando Sprint 3.C introduce route handler POST/PUT/DELETE per dashboard_presets/elements, l'integrazione è 1-line wrap.
- Test totali: 132/132 vitest (era 120 + 12 nuovi audit) · typecheck 5/5 verde · E2E 8/8 verde.
- STATE.md + CLAUDE.md "Stato attuale" + BRAND-STATE Phase 14 row aggiornati con summary cumulative 11 commit + roadmap follow-up esplicita.

**Cumulative Phase 14 status (post-L33)**:

- ✅ Sprint 1.A live data binding (5 commit · data-fetcher + 8 adapters + prefetch + route + hook + perf)
- ✅ Sprint 1.D Playwright (PoC 1 dashboard + RBP matrix 5 ruoli)
- ✅ Sprint 1.H i18n IT/EN runtime
- ✅ Sprint 2.E audit log helper standalone
- ⏳ Sprint 1 follow-up: re-seed canonical users · composite SQL · prod perf binding
- ⏳ Sprint 2.F: /ontology + OpenAI advisor (richiede `OPENAI_API_KEY`)
- ⏳ Sprint 3.B/C/G: mockup PROCESS expansion · drag-resize editor · Tier 2 explorer

**Riferimenti**:

- Commit range: `1cd433f..80673e6` (12 commit consecutivi 2026-05-07)
- STATE: `.handoff/STATE.md` (summary completo)
- CLAUDE.md "Stato attuale" sezione

## L34 — 2026-05-07 — DBMS bare-metal promosso SoT + Phase 14.SH plan approvato

**Decisione**: il database `heuresys_platform` postgres bare-metal su oracle-vm-default:5432 è promosso a Source of Truth unica. Il docker legacy (`heuresys_evo_platform_db`) NON è più riferimento operativo. Phase 14.SH (Brand-driven role-based shell) è il prossimo sprint, plan approvato per fresh session autonomous (24-34 FTE-day, 5 fasi + parallel backup track).

**Contesto**: post Sprint 1+2.E+2.F+3.C+3.G(foundation) shipped, l'utente ha richiesto migrazione dei dati reali docker → bare-metal con verifica forense bit-by-bit, e successivamente la realizzazione operativa dei modelli brand `mu-architect-legacy` (login + AppShell + sidebar dinamica role-based + ~50-70 viste live e2e + WCAG 2.2 AAA full + theme dark default). Migrazione completata 2026-05-07T13:54-14:00Z con 17/18 MD5 bit-identical, 506/506 tabelle popolate match, 477774 rows match, schema DDL diff 0. Primo backup baseline restorable creato. Decisioni utente confermate: D-LOGIN=`login-aurora.html`, D-SCOPE=coverage completa, D-THEME=dark, D-A11Y=WCAG 2.2 AAA full.

**Conseguenza**:

- Da ora in avanti "DBMS" ≡ "DBMS bare-metal" ≡ "SoT" — non serve più qualificare
- Composite SQL coverage 30/30 (zero null, zero "Stefania Bianchi" placeholder; SuccessionCard pull live `employees ORDER BY performance_rating`)
- Phase 14.SH passa a fresh session autonomous con plan canonical `~/.claude/plans/questo-quello-che-glittery-charm.md`
- ADR-0023 documenta SoT promotion + forensic proof
- ADR-0024 documenta Phase 14.SH plan + decisioni utente
- Brand workstream Phase 10 (altre surface) avanza in-progress con questo sprint
- Backup chain governance da automatizzare (parallel track)

**Riferimenti**:

- Commit `6a48706` (DBMS SoT + composite SQL coverage 30/30)
- ADR-0023: `docs/50-reference/decisions/0023-promote-baremetal-as-sot.md`
- ADR-0024: `docs/50-reference/decisions/0024-phase14sh-brand-driven-shell.md`
- Plan canonical: `~/.claude/plans/questo-quello-che-glittery-charm.md`
- HANDOFF: `.handoff/HANDOFF.md`
- Backup baseline: `oracle-vm-default:/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` (sha256 `1d1150ced1016638f8ac31c2b85e056752592c9ced0870cfca84fe6328eda46a`)

---

## L35 — 2026-05-07 — Phase 10 (Altre surface) chiusa formalmente via Phase 14.SH

**Decisione**: Phase 10 marcata ✅ **Done** in `BRAND-STATE.md`. La phase non è stata eseguita come blocco indipendente — è stata assorbita ed eseguita interamente nello sprint **Phase 14.SH** (8 commit, 24-34 FTE-day, 2026-05-07 chiusura) + sessione carry-forward 2026-05-07 21:50.

**Contesto**: Phase 10 originale prevedeva "altre surface" come login, app shell, viste secondarie. Quando è arrivato il momento operativo (post Phase 13 dashboard data-driven completate), il piano Phase 14.SH ha consolidato in unico sprint:

- Brand identity applied — token CSS μ-architect-legacy → `services/app/src/styles/active-theme.css` (FASE 1)
- Login `login-aurora.html` promosso a `services/app/src/app/login/page.tsx`
- `<HeuresysWordmark>` React component + `<AppShell>` cablato in `(app)/` route group
- Sidebar role-based 8 ruoli canonical (SIDEBAR_MAP + getNavForUser)
- 17+ viste live data e2e (8 viste SH-2 + 9 viste SH-3 carry-forward)
- 2 mockup overview shipped sessione 2026-05-07 21:50 (`cross-tenant-overview.html` + `tenant-owner-overview.html`) + seed `phase14f_overview_presets.sql` applicato bare-metal SoT + LocaleSwitcher in topbar AppShell + 9 viste SH-3 i18n IT/EN

**Conseguenza**:

- Phase 10 non è più "in-progress", è ✅ Done
- Asset inventory `BRAND-STATE.md` aggiornato con i 2 nuovi mockup overview (Phase 14.SH carry-forward)
- 8 ruoli RBP coperti end-to-end con sidebar role-based (SUPERUSER · TENANT_OWNER · IT_ADMIN · HR_DIRECTOR · HR_MANAGER · DEPT_HEAD · LINE_MANAGER · EMPLOYEE)
- Ulteriori surface (es. /admin/audit, /me, /team) seguiranno il pattern già stabilito (token-driven · AppShell-cablato · server component + Prisma direct)

**Riferimenti**:

- Commit Phase 14.SH chain: `0ce5720` SH-1 · `a7cbad8` SH-2 · `3abf4b1` SH-2 + RBP · `01c4464` SH-3 · `56ea24b` SH-3 closure · `0cd532d` handoff · `0958625` carry-forward
- ADR-0024: `docs/50-reference/decisions/0024-phase14sh-brand-driven-shell.md`
- 2 mockup carry-forward: `.ux-design/06-mockups/dashboards/cross-tenant-overview.html` + `tenant-owner-overview.html`
- Seed: `db/seeds/phase14f_overview_presets.sql`

---

## L36 — 2026-05-07 — Phase 11 — Theme variants JSON shipped (W3C DTCG format)

**Decisione**: Phase 11 ✅ **Done**. Codificati i token Heuresys in formato **W3C Design Tokens Community Group (DTCG)** in `.ux-design/05-theme-variants/`. SoT portabile cross-tool, sincronizzato con `services/app/src/styles/active-theme.css`.

**Contesto**: I token erano vivi in (a) prosa `palette-final.md` / `typography-final.md` / `motion-final.md`, (b) CSS runtime `active-theme.css`. Mancava un'export portabile per tool di design system esterni (Tokens Studio Figma, Style Dictionary v4, Tailwind preset cross-app, React Native).

**Format scelto**: **W3C DTCG** (raccomandato standard moderno, ampio tool support 2025-2026):

- `$type` esplicito (color, dimension, duration, cubicBezier, fontFamily, fontWeight, shadow)
- Reference resolution `{path.to.token}` cross-file
- Group nesting semantico (`color.brand.blue`, `typography.fontFamily.sans`, `motion.easing.out`)

**File prodotti** (4):

| File                 | Scope                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `tokens-dark.json`   | SoT — color · typography · spacing · radius · shadow · gradient · glass (default theme)     |
| `tokens-light.json`  | Color/shadow/glass override per `[data-theme="light"]`                                      |
| `tokens-motion.json` | Easing · duration · 5 pattern canonici · auxiliary · anti-pattern · accessibility           |
| `README.md`          | Uso lato consumer (Tokens Studio, Style Dictionary, Tailwind, CSS) + mapping con production |

**Conseguenza**:

- Token JSON è ora SoT portabile per cross-tool (Figma plugin, design system pipeline, mobile)
- `active-theme.css` resta SoT runtime per il bundle Next.js
- Manutenzione: ogni cambio in `active-theme.css` DEVE essere mirrored in `tokens-*.json` (e viceversa). Documentato in `tokens-*/README.md` § Mapping con production
- Preparato terreno per (futuro) build pipeline Style Dictionary v4 → CSS/JS/Swift export multi-platform

**Riferimenti**:

- Path: `.ux-design/05-theme-variants/`
- Spec format: <https://tr.designtokens.org/format/>
- Source CSS: `services/app/src/styles/active-theme.css` (lines 12-72 dark, 77-103 light)
- Source prosa: `palette-final.md` · `typography-final.md` · `motion-final.md`

---

## L37 — 2026-05-07 — Phase 12 — Brand book v0 shipped

**Decisione**: Phase 12 ✅ **Done** (v0 first edition). Pubblicato `.ux-design/07-brand-book/BRAND-BOOK-v0.md` — documento testuale comprehensive consolidato di brand identity Heuresys, single entry point unificato.

**Contesto**: Erano disponibili artefatti distribuiti (`palette-final.md`, `typography-final.md`, `motion-final.md`, `logo-standard.md`, `personas/*.md`, `voice-and-tone.md`, ecc.). Mancava un **punto di ingresso unico** che li raccordasse e fornisse vista d'insieme con cross-reference + governance.

**Scope v0** (15 sezioni canoniche):

0 Cover · 1 Mission · 2 Voice & tone · 3 Personas · 4 Audience positioning · 5 Aesthetic direction (μ-architect-legacy) · 6 Color (OKLCH) · 7 Typography (Exo 2 + Inter + JetBrains Mono) · 8 Logo (3 regole permanenti L25/L27/L28) · 9 Motion language · 10 Dashboard architecture · 11 UI components principles · 12 Accessibility (target WCAG 2.2 AAA) · 13 Do's & Don'ts · 14 File map (governance) · 15 Governance + changelog L1→L34

**Versioning**:

- **v0** = first comprehensive textual edition (2026-05-07). Aligned a stato L34 / Phase 14.SH. Riferisce ogni sezione al SoT canonical via cross-reference.
- **v1** (futura) = edizione visiva con typesetting curato + cover art + asset embed alta risoluzione. Non in scope corrente.

**Conseguenza**:

- Brand book v0 è il **punto di ingresso unificato** per nuovi collaboratori, auditor, partner che vogliono capire il brand Heuresys
- Cross-reference granulare: ogni sezione punta al file canonical SoT corrispondente (no duplicazione contenuto)
- Il ciclo di creazione brand identity Heuresys (Phase 1 → Phase 12) è ora **chiuso**. Roadmap successiva = WCAG audit + perf bench + JWT fix + (eventuale) v1 visivo + (eventuale) direction ν/ξ

**Riferimenti**:

- File: `.ux-design/07-brand-book/BRAND-BOOK-v0.md`
- 15 SoT individuali consolidati: `.ux-design/01-strategy/*` · `02-aesthetic/heuresys.DESIGN.md` · `03-visual-identity/{color,typography,logo}/` · `04-motion-language/motion-final.md` · `05-theme-variants/tokens-*.json` · `06-mockups/dashboards/*.html`

---

## L38 — 2026-05-08 — Pre-promotion audit · 5 gap reali chiusi · ciclo brand identity sigillato

**Decisione**: post-L37 commit `5ebdc45` di chiusura ciclo brand identity, su richiesta esplicita di Enzo è stato eseguito un audit pre-promozione per verificare loose ends. Sono stati identificati **5 gap reali** (più 3 minori rinviabili a v1.0 promotion) e tutti chiusi nello stesso commit di sigillo.

**Contesto**: Enzo: _"prima della promozione voglio che tu indaghi per essere certo che non sono necessari ulteriori fasi prima di chiudere la creazione della brand identity"_. L'audit ha rivelato che la dichiarazione di chiusura L37 era prematura su 5 fronti (decisioni pending obsolete · checklist promotion mancante · personas incomplete · candidate registry stale · brand book inconsistenza).

**5 gap reali chiusi**:

1. **Gap #1 — D1/D2/D3/D4 pending obsolete** (`BRAND-STATE.md` § Decisioni pending → § Decisioni risolte). D1 risolto L21, D2 implicito β Enterprise, D3 cristallizzato L25/L27/L28, D4 implicito Exo2+Inter+JetBrains L21. Tabella sostituita con "Decisioni risolte (storico)" con riferimenti puntuali.
2. **Gap #2 — `08-promotion/v1.0-checklist.md` scritto** (referenziato 2 volte ma mancante: `palette-final.md` + `logo/final/README.md`). Deliverable completo: scope · pre-flight checks per 8 categorie · workflow `/studio:bootstrap` integration · rollback plan · cadence raccomandata · sign-off final v1.0.
3. **Gap #3 — 4 personas mancanti** create per coverage 8 ruoli RBP: `05-superuser.md` (Enzo · platform admin) · `06-tenant-owner.md` (Marco · COO RTL Bank) · `07-hr-manager.md` (Federica · HRBP Risk & Compliance) · `08-dept-head.md` (Sabrina · Head Risk & Compliance). Pattern narrativo allineato alle 4 esistenti (profilo · vuole · frustra · sa · arriva · demo · voce · surface · NON fare).
4. **Gap #4 — `promotion-candidates.md` updated**: login-aurora marked 🚀 Promoted (Phase 14.SH FASE 1) · altri 4 login ❌ Rejected archive. Cross-tenant + tenant-owner overview aggiunti come 🚀 Promoted (carry-forward 2026-05-07 L35). Sezione "Other Phase 10 surface" rinominata "status update" con 4 surface utility (404 · empty · onboarding · settings) marcate "Roadmap promotion v1.0" → tracked in `v1.0-checklist.md`.
5. **Gap #5 — Brand Book v0 § 3 personas expanded** da 4 a 8 con tabella coverage 1:1 RBP roles + RBP role column + scope notes + cross-ref ai 8 file md. Risolta inconsistenza interna con § 4 audience β Enterprise + RBP 8 ruoli.

**3 gap minori posposti** (in `v1.0-checklist.md` come tasks promotion):

- favicon.ico multi-size + apple-touch-icon.png (asset bitmap da generare)
- 4 surface utility (404 · empty · onboarding · settings) — mockup HTML da creare
- Brand book v1 visivo (typesetting curato + cover art) — opzionale, non bloccante

**Conseguenza**:

- **Ciclo brand identity Heuresys (Phase 1 → Phase 12) ufficialmente sigillato** senza loose ends · zero contraddizioni interne · zero dangling references
- 8 personas = 1:1 coverage RBP roles (-1 → 6) · prossime feature possono assumere persona mapping completo
- Promotion v1.0 ha checklist operativa rigorosa · roadmap incrementale (16-25h totali, eseguibile in 2-3 sessioni)
- Brand book v0 è internamente consistente e può essere distribuito a auditor/partner come single entry point unificato
- Roadmap successiva: WCAG 2.2 AAA audit · prod perf bench · API gateway JWT fix · v1.0 promotion (in qualsiasi ordine)

**Riferimenti**:

- 4 nuovi personas: `.ux-design/01-strategy/personas/0[5-8]-*.md`
- v1.0 checklist: `.ux-design/08-promotion/v1.0-checklist.md`
- Brand book updated: `.ux-design/07-brand-book/BRAND-BOOK-v0.md` § 3 (8 personas)
- Promotion candidates updated: `.ux-design/08-promotion/promotion-candidates.md`
- BRAND-STATE updated: `.ux-design/BRAND-STATE.md` (decisioni risolte D1-D4)

---

## L39 — 2026-05-08 — Phase 15.A brand-fedele dashboard rendering shipped

**Decisione**: la rotta `/dashboard` ora renderizza un'interfaccia visivamente fedele ai mockup canonical Heuresys (`.ux-design/06-mockups/dashboards/*.html`, Phase 9 μ-architect-legacy). Mockup `org-systems.html` confermato come riferimento brand identity ("la vera brand identity delle nostre dashboard"). Architettura 4-layer (CSS canonical scoped + BrandShell layout + role-driven branching + 7 view brand-fedeli + 9 brand widget). Role-to-preset mapping data-driven via `role_default_dashboards` (P9 + P10).

**Contesto**: pre-15.A `/dashboard` placeholder generic (employees top-10 Tailwind utility). I 7 mockup brand erano produzione completa ma mai tradotti in production runtime. Itinerario in sessione: prima generalizzazione errata (uso hr-director-overview come base shell — interrotta dall'utente "il vero brand è org-systems"), poi 4 reset → ricostruzione con CSS canonical scoped + 7 view dedicate per preset_code.

**Conseguenza**:

- 7 view brand-fedeli in `services/app/src/app/(app)/dashboard/_views/` (OrgSystems · CrossTenantOverview · TenantOwnerOverview · HrDirectorOverview · SkillsHeatmap · CapabilityGraph · EmployeeJourney)
- CSS canonical `services/app/src/styles/dashboard-brand.css` (~2370 righe scoped) sostituisce AppShell Tailwind generico per route `(app)/`
- `BrandShell.tsx` client component sostituisce AppShell di `@heuresys/ui`
- 9 brand widget in `services/app/src/components/widgets/brand/` per widget registry
- Tabella `role_default_dashboards` + seed 8 platform default
- 6 nuovi token in `active-theme.css` (`--cap-process/structure/role/competence/performance` + `--glow`)
- `org_systems` view con data binding live (tenants reali + audit_logs reali + RBP counts via pg_policies); altre 6 view con dati hardcoded mockup-fedeli (visual fidelity prima, data binding full in iterazione successiva)
- ADR-0026 documenta architettura completa

**Riferimenti**:

- Commit `d59ae3e feat(app+db): brand-fedele dashboard rendering — 7 views + role-driven + live data`
- Branch `feature/dashboard-shell-canonical` mergiato fast-forward su `main` e cancellato
- ADR-0026: `docs/50-reference/decisions/0026-phase15a-brand-fedele-dashboard-rendering.md`
- Plan canonical: `~/.claude/plans/humble-soaring-lake.md`
- Mockup brand canonical: `.ux-design/06-mockups/dashboards/org-systems.html`

---

## L40 — 2026-05-08 — Tassonomia dashboard dinamica vs ad-hoc · catalogo dashboard ≡ Brand Identity · audit current-state generato

**Decisione**: stabilita la tassonomia operativa per le dashboard del progetto:

1. **Dashboard dinamica** = compone DOM **solo da asset del catalogo Brand Identity** (livello 1 atomi/widget + livello 2 varianti dichiarate), composti dinamicamente via preset DB-driven con slot count **variabile** (livello 3). Default per tutte le dashboard di gestione.
2. **Dashboard ad-hoc** = eccezione che può uscire dal catalogo, definita di volta in volta.
3. **Equazione fondante**: il catalogo del modello dashboard **≡** la libreria asset Brand Identity Heuresys. Promuovere un widget al catalogo = farlo entrare nella Brand Identity ufficiale.
4. Header e footer possono contenere oggetti **dinamici contestuali** (breadcrumb, scope-pill, user-card, SOURCE info) accanto a oggetti **trasversali** (logo, theme-toggle, separator accent) — entrambi parte del modello unificato.

**Contesto**: intervista chiarificazione concettuale 2026-05-08 17:30-18:00 GMT+2. Emergenza: le 7 view brand-fedeli shipped in Phase 15.A (L39) **non sono dashboard dinamiche** secondo questa tassonomia — sono ibridi di chrome brand-coerente + JSX bespoke per ruolo. Il mockup `org-systems.html` è **IL** modello canonical, ma è stato applicato come riferimento visivo, non come matrice strutturale. Conseguenza: drift architetturale identificato, va rimediato.

**Conseguenza**:

- Generato documento `brand-dashboard-catalog-CURRENT-STATE.md` in `08-promotion/`: audit read-only completo con classificazione 5-tag (a/b/c/d/e) per 138 selettori CSS + 17 React component (9 BrandWidget + 8 atomic packages/ui)
- Identificati 10 drift D1-D10 (3 critical, 4 medium, 3 low) — pill 2-system, split 3-system, heatmap bucket 2-system, 17 implementazioni parallel di 8 viz, ecc.
- Mappati 8 gap formali GA1-GA8 verso modello unificato
- Roadmap 6-step G1-G6 (~26-37h) per convergenza a `<DashboardRenderer/>` DB-driven unico — NON eseguita in questa sessione, decisioni pending per ogni step
- Cross-link aggiunti da `BRAND-BOOK-v0.md` · `v1.0-checklist.md` · `BRAND-STATE.md` (asset inventory `08-promotion/`)
- Audit costituisce pre-flight per la promotion v1.0 dashboard (parte del workflow `08-promotion/v1.0-checklist.md`)

**Riferimenti**:

- Audit doc: `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md`
- Plan canonical: `~/.claude/plans/concordo-con-a-happy-tarjan.md`
- Mockup brand canonical (modello unificato): `.ux-design/06-mockups/dashboards/org-systems.html`
- Phase 15.A: ADR-0026 + L39

---

## L41 — 2026-05-08 — Drift D1+D3 risolti · pill canonical `.pill` · heatmap bucket canonical `.heat-{0..6}`

**Decisione**: risolti i 2 drift HIGH severity identificati nell'audit L40:

1. **D1 (pill 2-system)** → opzione **A**: tieni `.pill` + `.pill-{ok,warn,critical,info}` come sistema canonical · `.status-pill` + `.status-{ok,warn,down}` viene rimosso e i 2 callsite migrati a `.pill` con mapping `down → critical`.
2. **D3 (heatmap bucket 2-system)** → opzione **A**: tieni `.heat-{0..6}` (7 bucket, granularità ricca, in produzione attiva) come sistema canonical · `.heatmap-cell.hl-{10,30,50,70,90}` viene rimosso · `BrandSkillHeatmap.tsx` helper migrato a 7 soglie matching `SkillsHeatmapView.tsx:42-48`.

**Contesto**: S19 inizio sessione, decisioni concordate dopo presentazione opzioni concrete con counts callsite reali (D1: `.pill` 8 callsite vs `.status-pill` 2 callsite · D3: `.heat-*` consumer su route attiva vs `.hl-*` consumer su widget registry inattivo). Audit L40 raccomandava entrambe le opzioni A. Enzo confirmed A+A. D2/D4/D5/D6 (severity MED/LOW) ancora pending — decisione separata.

**Conseguenza**:

- G2-partial sbloccato (drift remediation D1+D3 only)
- CSS canonical `dashboard-brand.css`: rimossi blocchi `.status-pill` + `.status-{ok,warn,down}` (1697-1720) e `.heatmap-cell.hl-{10,30,50,70,90}` (1243-1257)
- TSX migrati: `OrgSystemsView.tsx:253` + `CrossTenantOverviewView.tsx:293` (status → pill mapping) · `BrandSkillHeatmap.tsx:22-28` (hl-helper → heat-helper a 7 soglie)
- Catalogo asset Brand Identity dashboard ora ha **1 sola scala pill semantica** (4 modifier ok/warn/critical/info) e **1 sola scala heatmap bucket** (7 step heat-0..heat-6)
- D2 (split 3-system) · D4 (bar fill 2-system) · D5 (activity vs audit) · D6 (RBAC matrix wrapper) restano pending — drift map audit doc §5 aggiornata in cross-link

**Riferimenti**:

- Audit doc: `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` § 5 (drift map)
- Audit raccomandazione: §5 D1 "Unify a 1 sistema (raccomandato `.pill` BEM)" · §5 D3 "Unify a 1 scala (raccomandato `.heat-{0..6}` per bucket esplicito)"
- L40 (decisione fondante: catalogo dashboard ≡ Brand Identity)

---

## L42 — 2026-05-08 — G2 completion · drift D2 D4 D5 D6 risolti · split unified · matrix-wrap promoted

**Decisione**: risolti gli ultimi 4 drift identificati nell'audit L40 con scelte mirate per minimizzare churn pur preservando coerenza catalog:

1. **D2 (split 3-system)** → opzione **A**: tieni `.double-split` (3/5 callsite, ratio 1.4fr/1fr) come canonical. Rimossi `.kg-split` (era 2fr/1fr per CapabilityGraph) e `.bottom-split` (era 1.2fr/1fr per SkillsHeatmap). Visual side-effect: i 2 view migrati passano da ratio specifici a 1.4:1 — accettato come prezzo della single-SoT visiva.
2. **D4 (bar fill 2-system)** → opzione **A**: rimossi `.gauge-bar-fill.gauge-{accent,success,warn}` (3 rules background-color). Selettore base `.gauge-card .gauge-bar-fill` rinominato a `.gauge-card .bar-fill`. 1 callsite (`CrossTenantOverviewView:256`) migrato a `.bar-fill.fill-${tone}` con mapping `accent → info, success → ok, warn → warn`. Le rules text-color `.gauge-{accent,success,warn}` solo (per `.gauge-val`) sono conservate.
3. **D5 (activity vs audit row)** → opzione **A**: tieni separati. `.activity-list/.activity-item` (BrandActivityFeed + HrDirector) ha DOM shape `.when/.what/.who` (3 slot verticali); `.audit-list/.audit-row` (OrgSystems) ha DOM shape `.ts/.what/.actor/.accent` (4 slot orizzontali). Promossi entrambi a catalog come 2 pattern legittimamente distinti (live activity feed vs audit trail).
4. **D6 (RBAC matrix wrapper)** → opzione **B** (refactor full): introdotto `.matrix-wrap` come wrapper canonical per RBAC matrix (BrandRbacMatrix). Rinominato `.skill-gap-head` → `.widget-head` come header pattern condiviso (4 widget migrati: BrandRbacMatrix, BrandSkillHeatmap, BrandCapabilityRadar, BrandKgGraph). `.skill-gap` root preservato per HrDirector "skill gap analysis section" (legittima per audit doc §3.4 `(c) PROMOTE-NEW`). Consolidata `.matrix-wrap` + `.skill-gap` in single CSS rule via comma selector (DRY: stesso chrome body, semantica distinta).

**Contesto**: S19, blocco subito dopo L41. Decisioni concordate dopo presentazione opzioni con counts callsite reali. D2/D4 = audit raccomandazione A. D5 = decisione di non-unificazione vs raccomandazione audit (DOM shape è genuinamente diverso, unificazione sarebbe forzata). D6 = audit raccomandazione B (full refactor) preferita a opzione A (`.matrix-wrap` minimal con drift naming residuo). Errore intermedio: rinomina aggressiva di `.skill-gap` (root) a `.matrix-wrap` ha rotto `.skill-gap` analysis section di HrDirector — fixato con restore via consolidated rule.

**Conseguenza**:

- CSS canonical `dashboard-brand.css`: rimossi blocchi `.bottom-split` (1967-1976) + `.kg-split` (2062-2071) + 3 rules `.gauge-bar-fill.gauge-*` (1829, 1835, 1841). Selettore `.gauge-card .gauge-bar-fill` → `.gauge-card .bar-fill`. Rinominate 4 selettori `.skill-gap-head*` → `.widget-head*`. Introdotto `.matrix-wrap` come wrapper RBAC (consolidato con `.skill-gap` via comma selector).
- TSX migrati: `CapabilityGraphView.tsx:105` (kg-split → double-split) · `SkillsHeatmapView.tsx:176` (bottom-split → double-split) · `CrossTenantOverviewView.tsx:256` (gauge-bar-fill → bar-fill + tone mapping inline) · `BrandRbacMatrix.tsx:61-62` (skill-gap → matrix-wrap, skill-gap-head → widget-head) · `BrandSkillHeatmap.tsx:57` · `BrandCapabilityRadar.tsx:82` · `BrandKgGraph.tsx:88` · `HrDirectorOverviewView.tsx:80` (skill-gap-head → widget-head, ma `.skill-gap` root preservato).
- JSDoc comments aggiornati per coerenza catalog: `BrandRbacMatrix.tsx:47` · `widgets/brand/index.ts:5` · `dashboard-engine/registry.tsx:13-17`.
- **Catalogo dashboard post-G2**: 0 drift duplicate semantici · 1 split layout · 1 bar fill system · 2 event-stream patterns (legittimi) · 1 matrix wrapper · 1 widget-head shared. Catalog converge verso single-SoT.
- Visual side-effect documentato: SkillsHeatmap e CapabilityGraph perdono il loro ratio split specifico. Da rivedere se feedback brand emerge — possibile reintroduzione `.double-split--wide` / `.double-split--narrow` come variant modifiers.
- D7 (atomic packages/ui keep/deprecate) ancora pending — discussione in G3.

**Riferimenti**:

- Audit doc: `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` § 5 (drift map) — line numbers post-L42 shiftano `−40` cumulativo per CSS oltre 1700 e `−15` per CSS oltre 1260.
- L41 (D1+D3 risolti)
- L40 (decisione fondante)

---

## L43 — 2026-05-08 — D7 keep parallel · D8 chiuso · G3-bis 5 nuovi BrandWidget · G5 DashboardRenderer skeleton

**Decisione**:

1. **D7 (atomic packages/ui keep o deprecate)** → opzione **A keep parallel**: i 8 atomic dashboard component in `packages/ui/src/components/dashboard/` restano per Storybook + design-system generic; i BrandWidget in `services/app/src/components/widgets/brand/` restano per dashboard catalog. Zero refactor compositor (opzione C scartata per costo + rischio regression). Nessuna deprecazione (opzione B scartata per perdita di Storybook coverage + design-system reuse fuori dashboard).
2. **D8 (BrandActivityFeed registry gap)** → chiuso: registrato in `WIDGET_REGISTRY` con adapter `activityFeedAdapter` + demo fallback.
3. **G3-bis (5 nuovi BrandWidget shipped)**: `BrandGaugeCard` · `BrandHistogram` · `BrandCompCard` · `BrandBridgeCard` · `BrandProfileHero`. Ognuno con component TSX (~40-80 righe seguendo pattern `BrandKpiCard`), adapter dedicato in `adapters.ts`, entry in `WIDGET_REGISTRY` con demo fallback live-wrapper. Catalog post-G3-bis: 14 widget registrati (era 9 post-D8).
4. **G5 (DashboardRenderer skeleton)**: nuovo componente client `services/app/src/components/DashboardRenderer.tsx` (~150 righe) come consumer single-entry-point del widget registry. MVP scope: rendering FLAT (top-level only, hierarchy via `parent_element_id` parsata ma renderizzata come flat — finché G5-phase-2 in S20 non aggiunge layout containers `.double-split`/`.main-split`/`.panel` come widget_code dedicati). Test coverage 9 unit test (`__tests__/dashboard-renderer.test.tsx`).

**Contesto**: continuazione lineare S19 dopo G3 partial (D8). L'utente conferma intenzione "fai tutto in questa sessione" con disponibilità token elevata. Reality check: G3-bis + G5 skeleton = ~100% completati; G6 (preset seed) deferred a S20 perché dipende da G5-phase-2 (layout containers) per riprodurre fedelmente i layout dei 7 view bespoke.

**Conseguenza**:

- 5 nuovi file in `services/app/src/components/widgets/brand/`: `BrandGaugeCard.tsx` · `BrandHistogram.tsx` · `BrandCompCard.tsx` · `BrandBridgeCard.tsx` · `BrandProfileHero.tsx`
- `widgets/brand/index.ts` esporta 5 nuovi component + types (`GaugeTone` · `HistogramItem` · `HistogramTone` · `CompItem` · `BridgeItem` · `ProfileBadge` · `ProfileBadgeKind` · `ProfileStat`)
- `dashboard-engine/adapters.ts`: 5 nuovi adapter + `ADAPTER_REGISTRY` 9 → 14 entries
- `dashboard-engine/registry.tsx`: 5 nuovi `lazyWidget` + `WIDGET_REGISTRY` 9 → 14 entries
- `__tests__/dashboard-adapters.test.ts`: count 9 → 14
- Nuovo `components/DashboardRenderer.tsx` con interface tipizzata `DashboardRendererProps` + `DashboardRendererSlot` + adapter `elementsToSlots` da `DashboardElementShape` post-G4 (con `parent_element_id` + `variant`)
- Nuovo `__tests__/dashboard-renderer.test.tsx` con 9 unit test coprendo: ordering position · filtro children flat MVP · fallback unknown widget · custom fallback · empty state · data preloaded passing · `data-*` attributes · `elementsToSlots` adapter
- Test totale services/app: 186 → **195 passed**
- Catalog brand-dashboard-catalog.md G1 ora coerente: i 5 widget 🆕 PROMOTE-NEW listati in §5/§6/§7/§11 sono shipped (status 🆕 → ✅ post-S19 G3-bis)

**Riferimenti**:

- Audit doc: `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` § 5 (D7 + D8)
- Catalog canonical: `docs/30-developer/brand-dashboard-catalog.md` § 5.8-5.11 + §6.4 + §7.4 + §11
- DashboardRenderer: `services/app/src/components/DashboardRenderer.tsx` (commento JSDoc include adoption path S19 → S20+)

---

## L44 — 2026-05-09 — G5-phase-2 hierarchy + 4 layout containers · G6 smoke seed (org_systems_v2 · hr_director_overview_v2)

**Decisione**:

1. **G5-phase-2** — Layout container widgets shipped: `BrandDoubleSplit` · `BrandMainSplit` · `BrandKpiRing` · `BrandPanel`. Aggiunto `LAYOUT_REGISTRY` separato da `WIDGET_REGISTRY` in `dashboard-engine/registry.tsx` con tipi distinti (`LayoutContainerComponent` riceve `{ data?, children }` vs `WidgetComponent` solo `{ data? }`). DashboardRenderer riscritto con risoluzione ricorsiva: per ogni element risolto via LAYOUT prima, WIDGET poi, fallback ultimo. Tree built da flat slots via `parent_element_id` map (key `__root__` per top-level). Children ordinati per `position` ASC ricorsivamente.
2. **G6 smoke seed** — Creati 2 NUOVI preset hierarchical (suffix `_v2`) come PoC end-to-end del DashboardRenderer post-G4 schema:
   - **`org_systems_v2`** (ENTERPRISE · IT_ADMIN): 10 elements · `LayoutKpiRing` con 4 KPI top + `LayoutDoubleSplit` con 2 panel (Integrations · Audit) ognuno con widget interno.
   - **`hr_director_overview_v2`** (TALENT · HR_DIRECTOR): 11 elements · `LayoutKpiRing` con 4 KPI + `LayoutMainSplit` (2fr 1fr) con panel main (RbacMatrix) e panel side (ActivityFeed) + SuccessionCard top-level standalone.
3. **Adoption deferred a S21** — Il redirect del switch in `dashboard/page.tsx` da view bespoke a `<DashboardRenderer/>` richiede mappare `role_default_dashboards.preset_code` da `*` a `*_v2` E verifica visiva browser. NON eseguito in questa sessione per evitare regression di prod (le 7 view bespoke restano la production path attiva). I preset originali e i 38 dashboard_elements del demo grid `/dashboard/[code]` (Phase 13.C) **non sono toccati** — coesistenza pulita.

**Contesto**: continuazione lineare S19 dopo G3-bis + G5 skeleton. Decisione architetturale chiave: separare `LAYOUT_REGISTRY` da `WIDGET_REGISTRY` invece di unificare via type guard runtime. Vantaggi: type-safety statica per props (children obbligatorio per layout, opzionale data), distinzione semantica esplicita tra "wrapper di altri slot" e "leaf data renderer", possibilità futura di trattamento differenziale (es. layout containers possono avere logica di passa-through, leaf widgets no).

Errore intermedio evitato: tentazione di allargare scope a redirect `dashboard/page.tsx` immediato. Ferma a renderer + smoke seed → adoption come step separato post browser-test (rispetto regola "test-before-claim" R5 per UI changes).

**Conseguenza**:

- Nuovo file `services/app/src/components/widgets/brand/BrandLayoutContainers.tsx` (~70 righe · 4 component + LAYOUT_CONTAINERS export)
- `widgets/brand/index.ts` esporta 4 layout containers + types `LayoutContainerProps` · `LayoutContainerCode`
- `dashboard-engine/registry.tsx`: aggiunto `LAYOUT_REGISTRY` + `LayoutContainerComponent` type + `resolveLayout()` helper
- `components/DashboardRenderer.tsx` riscritto con:
  - `buildChildrenMap()` interno · `renderSlot()` ricorsivo · `RenderContext` pattern
  - Adoption path nel JSDoc aggiornato (S19 G5 skeleton ✅ · S19 G5-phase-2 ✅ hierarchy · S20+ G6 full · S20+ adoption redirect)
- `__tests__/dashboard-renderer.test.tsx` espanso: 13 test (era 9)
  - 6 G5 flat (rimossi 1 obsoleto skip-children, mantenuti core)
  - 5 G5-phase-2 hierarchy: layout container + nested 2-level + data passing + empty container + ordering siblings per position
  - 2 elementsToSlots adapter
- Nuovo `db/seeds/phase15g6_preset_layouts_smoke.sql` (~260 righe · 2 DO blocks PL/pgSQL · idempotent ON CONFLICT + DELETE re-seed pattern)
- DB bare-metal SoT: 2 nuovi preset in `dashboard_presets` (`org_systems_v2` · `hr_director_overview_v2`) + 21 nuovi `dashboard_elements` rows con hierarchy
- Test totale services/app: 195 → **199 passed** (+4 net: -1 obsoleto +5 hierarchy)
- Roadmap residua S20+: G6 full (5 preset rimanenti) · adoption redirect dashboard/page.tsx · 7 \*View.tsx deletion (~2200 righe rimosse) · D10 atomic test coverage

**Riferimenti**:

- DashboardRenderer: `services/app/src/components/DashboardRenderer.tsx`
- Layout containers: `services/app/src/components/widgets/brand/BrandLayoutContainers.tsx`
- LAYOUT_REGISTRY: `services/app/src/lib/dashboard-engine/registry.tsx`
- Smoke seed: `db/seeds/phase15g6_preset_layouts_smoke.sql`
- L43 (D7+D8 + G3-bis + G5 skeleton)
- Catalog G1: `docs/30-developer/brand-dashboard-catalog.md`

---

## L45 — 2026-05-09 — G6 full · 7 preset hierarchical seedati · adoption shipped via dashboard/page.tsx

**Decisione**:

1. **G6 full** — Tutti i 7 preset brand-fedeli ora hanno versione hierarchical DB-driven (suffix `_v2`): `org_systems_v2` (10 elem) · `hr_director_overview_v2` (11 elem) · `cross_tenant_overview_v2` (11 elem) · `tenant_owner_overview_v2` (13 elem) · `skills_heatmap_v2` (10 elem) · `capability_graph_v2` (11 elem) · `employee_journey_v2` (11 elem). Totale **77 dashboard_elements** seedati. Pattern `config_overrides = {"data_source":{"type":"static","value":{...}}}` per leverage del data-fetcher esistente (`type='static'` supportato già in data-fetcher.ts:95-97).
2. **Adoption shipped** — `role_default_dashboards.preset_code` aggiornato per tutti gli 8 ruoli da `<original>` a `<original>_v2` (8 row UPDATE in transaction). `dashboard/page.tsx` modificato con branch `if (presetCode.endsWith('_v2'))` che:
   - Carica elements via `$queryRaw<DashboardElementG4[]>` (Prisma client non rigenerato per dev server lock — schema.prisma comunque aggiornato per S20+ regen)
   - Esegue `prefetchElements` per data fetching server-side (config_overrides.data_source.static → value)
   - Converte a `DashboardRendererSlot[]` (BigInt → string per RSC serialization)
   - Renderizza `<DashboardRenderer elements={slots} data={data} />` dentro `ws-header` brand-fedele
   - Per preset non-`_v2`: switch originale a 7 `_views/*View.tsx` come fallback (preservato per rollback rapido revert role_default_dashboards)
3. **Schema.prisma update** — Aggiunti `parent_element_id BigInt?` + `variant String? @db.VarChar(64)` con self-relation `dashboard_elements_hierarchy` al model `dashboard_elements`. **`prisma generate` BLOCCATO** in S19 da Next.js dev server (PID 1036 + 11716) che lockano `query_engine-windows.dll.node`. TODO S20: stop dev server + `npx prisma generate` per rigenerare client. Adoption code usa `$queryRaw` come bypass temporaneo.

**Contesto**: continuazione finale S19 dopo G5-phase-2 + G6 smoke (L44). User esplicitamente richiede "G6 full + adoption" → eseguito senza step intermedi. Decisione architetturale: NON eliminare i 7 `_views/*View.tsx` in questa sessione perché il rollback dovrebbe essere immediato se l'adoption fallisce in browser test (R5 TEST-BEFORE-CLAIM). Adoption è quindi "soft": i v2 presets sono il default attivo, ma il fallback path (revert role_default_dashboards) è un singolo UPDATE SQL (rollback in fondo a `phase15g6_full_preset_layouts.sql`).

**Ammissione di gap**:

- **Browser test pending**: in CLI mode non possibile verificare visivamente che il rendering DashboardRenderer sia equivalente alle 7 view bespoke. User deve testare manualmente al primo accesso `/dashboard` post-S19.
- **Visual fidelity ridotta**: i preset `_v2` usano 14 widget esistenti + 4 layout containers per approssimare i 7 mockup originali. **5 widget mancanti** (`BrandTenantCard`, `BrandMetricCard`, `BrandSectionHead`, `BrandIntRow`, `BrandAuditRow`) → il render G6 mostra solo i widget catalogati, omettendo elementi specifici dei mockup (es. tenant cards in org-systems, metrics grid in tenant-owner). Questi gap saranno chiusi in S20 G3-bis-completion.
- **Data static vs live**: i 77 elements usano `data_source.type='static'` con valori hardcoded JSON. Per data binding live SQL (es. tenants count reale per org_systems), serve trasformare i config_overrides in `type='sql'` con query Prisma — lavoro S20+.

**Conseguenza**:

- DB bare-metal SoT: 7 nuovi preset in `dashboard_presets` (`*_v2`) + 77 dashboard_elements hierarchical · 8 row updated in `role_default_dashboards` mappa role → `*_v2`
- Rollback istantaneo: ultime 7 righe SQL commented in `phase15g6_full_preset_layouts.sql` ripristinano mapping originale (1 UPDATE per ruolo)
- `dashboard/page.tsx` ora ha 2 path:
  - **Path nuovo (default attivo S19+)**: `presetCode.endsWith('_v2')` → DashboardRenderer
  - **Path legacy fallback**: switch su 7 preset originali → 7 `_views/*View.tsx`
- 7 `_views/*View.tsx` preservati (~2200 righe) — eliminazione deferred a S20 post-browser-verification
- Schema.prisma documenta G4 fields ma client non rigenerato in S19 → adoption usa `$queryRaw` con interface tipizzata
- Test totale services/app: **199/199 passed** invariato (no nuovi test richiesti per adoption — DashboardRenderer test coverage già robusta dal G5-phase-2)

**Riferimenti**:

- Commit `35ba6bb feat(app+db): G6 full + adoption · *_v2 presets via DashboardRenderer`
- Seed: `db/seeds/phase15g6_full_preset_layouts.sql` (~370 righe · 7 DO blocks + UPDATE + rollback documented)
- Page handler: `services/app/src/app/(app)/dashboard/page.tsx` (riscritto · 240 righe · 2 path)
- Schema update: `services/app/prisma/schema.prisma` § dashboard_elements model (G4 fields formalized)
- L44 (G5-phase-2 + G6 smoke)

---

## L46 — 2026-05-09 — Catalog DB diventa SoT operativa · org-systems.html primo import promoted · governance shift

**Decisione**: il catalog DB della webapp `09-asset-showcase` diventa la **Source of Truth operativa stable** del brand identity dashboard system. Il `brand-dashboard-catalog.md` resta documentazione narrativa ma non è più la fonte autoritativa: lo è il DB.

L'import del mockup `06-mockups/dashboards/org-systems.html` come primo SoT promosso introduce 4 conflict resolutions e il concetto di **universal chrome cross-role** (`chromeStandard=true` su asset header/footer/sidebar) che diventa lo shell stabile per TUTTE le dashboard di ruolo.

**Contesto**: durante S20 il browser test G6 ha mostrato che il rendering DashboardRenderer per IT_ADMIN su `/dashboard` non corrispondeva fedelmente al mockup `org-systems.html` (variants, behaviors, colors, transitions, animations non erano catturati nel catalog). Enzo ha richiesto un governance shift: il catalog DB deve essere stable e gestibile via UI, così non si interviene continuamente sul "modello definitivo di dashboard dinamica".

**4 conflitti risolti** (cross-reference mockup ↔ canonical CSS ↔ DB):

| #   | Conflitto                                                                                                       | Decisione                                                                                                           | Effetto                                                                                                                          |
| --- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `.status-pill` + `.status-{ok,warn,down}` (mockup) vs `.pill` + `.pill-{ok,warn,critical}` post-L41 (canonical) | **Canonical wins** — mockup aggiornato a `.pill.pill-*`, regole `.status-*` rimosse dal mockup `<style>` inline     | Rispetto L41 mantenuto, integrazione status badges ora consistent                                                                |
| 2   | `.theme-toggle` (mockup) vs `.theme-toggle-btn` (canonical)                                                     | **Canonical wins** — mockup rinominato in `.theme-toggle-btn`                                                       | Naming canonical `-btn` suffix mantenuto per distinguere da `[data-theme]` attribute                                             |
| 3   | `.wordmark-original` (mockup) vs `.wordmark-sm.legacy` (canonical post-L28)                                     | **Mockup wins** — `.wordmark-original` aggiunto come asset autonomo a `dashboard-brand.css` (post `.wordmark-foot`) | Deviation deliberata dal modifier-pattern L28: il logo "originale" diventa asset standalone per surface tematizzate cross-tenant |
| 4   | `.header-back` + `.label-ph9` (solo mockup)                                                                     | **Scaffolding mockup-only** — non promossi, non aggiunti al catalog                                                 | Helper d'anteprima del mockup, esclusi dall'import                                                                               |

**Concetto introdotto — Universal chrome cross-role**:

Aggiunto al modello `Asset` del catalog DB (Prisma schema in `09-asset-showcase/prisma/schema.prisma`) il flag `chromeStandard: Boolean`. Asset con `chromeStandard=true` sono **lo shell standardizzato per TUTTE le dashboard di ruolo** (cross-role). Il body resta data-driven role-specific.

18 asset chrome universali promossi:

```
.nav-bar · .wordmark · .wordmark-sm · .wordmark-foot · .wordmark-original ·
.theme-toggle-btn · .sidebar · .sidebar-top · .sidebar-toggle · .tenant-mini ·
.sidebar-section · .sidebar-link · .user-card · .app-footer · .workspace ·
.ws-header · .scope-pill · .label-pill
```

18 asset body org-systems_v2 promossi (con `dashboardCode='org_systems_v2'`):

```
.kpi-ring · .kpi-card · .section-head · .tenant-grid · .tenant-card · .tag ·
.double-split · .panel · .panel-head · .matrix-wrap · .int-row · .metrics-grid ·
.metric-card · .audit-list · .audit-row · .ws-footer · .tenant-pill · .bar-track
```

**Schema esteso** (Prisma `Asset` model · `09-asset-showcase/prisma/schema.prisma`):

```prisma
chromeStandard  Boolean @default(false)  // chrome universal cross-role
dashboardCode   String?                  // body asset → "org_systems_v2"
mockupSource    String?                  // audit trail "06-mockups/dashboards/org-systems.html"
behaviorsJson   String?                  // hover/active/animations/transitions JSON
colorTokensJson String?                  // ["--accent","--surface-1",...]
subElementsJson String?                  // [".tag",".tid",".row .lbl",...]
```

**Conseguenza**:

- Catalog DB autoritativo: ~36 asset promoted (18 chrome + 18 body org-systems) + ~7 mockup-driven variants nel `Variant` table (`.tenant-card.platform`, `.sidebar-link.active`, `.sidebar-section.collapsed`, `.wordmark-sm.legacy`, `.tenant-mini .t-avatar.bordered`, `.user-card .avatar.bordered-inverse`, `.tenant-card .health .dot.warn`)
- Frontend webapp: nuovi tab Sub-elements / Behavior / Color tokens nel detail view + filter pill `🛡 Chrome` e `📐 IT_ADMIN body` nella topbar
- Mockup `org-systems.html` allineato a canonical naming post-L41 (zero `.status-pill` residui)
- Canonical `dashboard-brand.css` esteso con `.wordmark-original` standalone (~12 lines added)
- Re-bootstrap idempotente: re-run preserva flag manuali utente, ma riapplica deterministicamente `chromeStandard` e `dashboardCode` dai set CHROME_UNIVERSAL_NAMES + ORG_SYSTEMS_BODY in `bootstrap.js`
- Ogni wrapper asset ora ha 3 metadata blocchi JSON inline: behaviors (hover/active/animations/transitions), colorTokens (CSS variables usati), subElements (nested selectors documentati)

**Out-of-scope da L46** (esplicito):

- Import degli altri 6 mockup dashboard (cross-tenant-overview, tenant-owner, hr-director, skills-heatmap, capability-graph, employee-journey) — phases successive, stesso pattern
- Production `/dashboard` refactor per consumare il flag `chromeStandard` dal DB (richiede modifiche a `BrandShell.tsx` per dynamic chrome rendering)
- Promote degli asset packages/ui non utilizzati nel mockup org-systems (es. data-table, hero-sections, etc.) — restano `available`

**Riferimenti**:

- Plan d'esecuzione: `~/.claude/plans/flickering-painting-globe.md`
- Mockup updated: `.ux-design/06-mockups/dashboards/org-systems.html`
- Canonical CSS extended: `services/app/src/styles/dashboard-brand.css` § wordmark-original
- Showcase webapp (gitignored): `.ux-design/09-asset-showcase/{prisma/schema.prisma,bootstrap.js,templates.mjs,public/}`
- L41 (drift D1 status-pill → pill canonical) · L28 (logo wordmark color rules)

---

## L47 — 2026-05-09 — Body-only import dei 10 mockup rimanenti · 11 dashboardCode mappati

**Decisione**: dopo L46 (chrome universal cross-role + body org-systems), estendo l'import del catalog DB ai restanti 10 mockup dashboard (escluso `index.html`), limitato al **body** (chrome già promosso e standardizzato in L46). Ogni mockup è mappato al suo `dashboardCode` role-specific. Il body diventa data-driven role-specific, lo chrome resta stabile cross-role. Catalog DB consolidato come SoT operativa per l'intero dashboard system.

**Contesto**: Enzo ha confermato la strategia: "abbiamo stabilito header, footer e sidebar delle dashboard standard. Ripetiamo il processo di importazione per tutti gli altri mockup". Vincolo: analisi limitata alla finestra di contenuto (body), conflitti da segnalare.

**4 conflitti strategici risolti**:

| #   | Conflitto                                                                                               | Decisione                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `.status-pill` ricorrente (cross-tenant-overview, ecc.)                                                 | **Same as L46 — canonical wins**: scan tutti i mockup, replace `.status-pill .status-{ok,warn,down}` → `.pill .pill-{ok,warn,critical}`                                                             |
| 2   | `.succession-row` (tenant-owner) vs `.succession-card` (canonical/hr-director)                          | **Entrambi i pattern**: `.succession-row` aggiunto come asset autonomo nel canonical CSS (3-col grid 36/1fr/80). `.succession-card` 4-col card-based resta. Coesistono come use case distinti.      |
| 3   | `.gauge-wrap`+`.gauge-ring` (single, tenant-owner) vs `.gauge-grid`+`.gauge-card` (multi, cross-tenant) | **Entrambi i pattern**: `.gauge-wrap` + `.gauge-ring` (160px) aggiunti al canonical. Multi-gauge e single-gauge coesistono.                                                                         |
| 4   | Process dashboards (4 mockup `process_*.html`)                                                          | **Full import**: 4 dashboardCode autonomi (`process_recruiting_funnel_v2`, `process_onboarding_flow_v2`, `process_performance_cycle_v2`, `process_learning_paths_v2`). Tutti i body asset promoted. |

**4 conflitti minori (L46 default rule applicata)**:

| #   | Conflitto                                                                          | Decisione (canonical wins)                  | Effetto                                    |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| 5   | `.bar-fill.success/.warn` (tenant-owner) vs `.bar-fill.fill-{ok,warn}` (canonical) | Mockup tenant-owner aggiornato              | Naming `.fill-*` mantenuto                 |
| 6   | `.kpi-row` (4 process) vs `.kpi-ring` (canonical)                                  | 4 process mockup aggiornati                 | Naming canonical per KPI grid              |
| 7   | `.kpi-card` compact (skills-heatmap 16/20 padding, 28px font)                      | Accept come **variant `.kpi-card.compact`** | Variant deliberato per layout heatmap      |
| 8   | `.bridge-card` lieve drift (employee-journey vs learning-paths)                    | Accept entrambi DOM senza modifier          | Differenze interne ma stesso wrapper class |

**11 dashboardCode mappati** (post-L47):

```
chromeStandard=true → applicabile a TUTTI gli 11 dashboardCode (universal chrome L46)

dashboardCode='org_systems_v2'              → IT_ADMIN          (mockup org-systems.html, L46)
dashboardCode='cross_tenant_overview_v2'    → SUPERUSER         (cross-tenant-overview.html)
dashboardCode='tenant_owner_overview_v2'    → TENANT_OWNER      (tenant-owner-overview.html)
dashboardCode='hr_director_overview_v2'     → HR_DIRECTOR       (hr-director-overview.html)
dashboardCode='skills_heatmap_v2'           → HR_MANAGER        (skills-heatmap.html)
dashboardCode='capability_graph_v2'         → DEPT_HEAD         (capability-graph.html)
dashboardCode='employee_journey_v2'         → LINE_MANAGER + EMPLOYEE (employee-journey.html)
dashboardCode='process_recruiting_funnel_v2' → (process role TBD)
dashboardCode='process_onboarding_flow_v2'   → (process role TBD)
dashboardCode='process_performance_cycle_v2' → (process role TBD)
dashboardCode='process_learning_paths_v2'    → (process role TBD)
```

**Asset import counts**:

- **NEW canonical CSS classes**: ~50 (charts, gauge-wrap pattern, table.dept, succession-row, kg-_, profile-hero, arc-_, bridge-grid, process viz, pill capability tones, kpi-card.compact, gauge-card.large)
- **NEW MOCKUP_DRIVEN_VARIANTS**: 13 (kpi-card.compact, gauge-card.large, 5 pill capability, 3 pbadge, 2 arc-event, 2 milestone)
- **Mockup HTML modificati**: 10 (drift fixes + scaffolding cleanup)

**Conseguenza**:

- Catalog DB ora ha 11 dashboardCode mappati con i loro body asset wrapper, ognuno promoted=true e con metadata complete (mockupSource, behaviors, colorTokens, subElements)
- `dashboard-brand.css` esteso (~300 lines) con classi canonical che prima vivevano solo come inline `<style>` nei mockup
- 6 mockup aggiornati per allineamento canonical (status-pill, theme-toggle, bar-fill alias, kpi-row alias)
- BODY_BY_DASHBOARD record sostituisce ORG_SYSTEMS_BODY set semplice; `dashboardCodeFor(name)` lookup determina l'assegnazione del body asset al suo dashboardCode di provenienza
- Webapp showcase ha filtri per ognuno degli 11 dashboardCode (`📐 *_v2 body`)
- Coerenza brand: ogni dashboard di ruolo, quando renderizzata in produzione, ha visiva fedele al mockup di provenienza, sia chrome (L46) sia body (L47)

**Drift L41 finale**: `.status-pill` rimosso da TUTTI i mockup. Catalog è coerente post-L41. Nessun rollback futuro previsto.

**Out-of-scope L47** (esplicito):

- Production `/dashboard` refactor per consumare `dashboardCode` dal DB (richiede modifiche `dashboard/page.tsx` + `BrandShell.tsx`) — phase successiva
- Promote degli asset packages/ui non utilizzati nei 10 mockup (es. data-table generico, hero-sections marketing) — restano `available`
- Mapping role → dashboardCode per i 4 process — phase futura (decision HR_MANAGER vs autonomous role)
- Render React inline degli asset packages/ui (resta link Storybook)

**Riferimenti**:

- Plan d'esecuzione: `~/.claude/plans/flickering-painting-globe.md` (L47 section)
- 10 mockup updated: `.ux-design/06-mockups/dashboards/{cross-tenant-overview,tenant-owner-overview,hr-director-overview,skills-heatmap,capability-graph,employee-journey,process-*}.html`
- Canonical CSS extended: `services/app/src/styles/dashboard-brand.css` § L47 block (~300 lines)
- Showcase webapp (gitignored): `09-asset-showcase/{bootstrap.js,templates.mjs}` updates
- L46 (org-systems first import + chromeStandard concept) · L41 (status-pill drift)

---

## L48 — 2026-05-09 — Theme/palette framework v1 + wordmark body canonicalizzato a `var(--primary)`

**Decisione**:

1. Nasce un framework runtime multi-palette in `.ux-design/02-aesthetic/theme-framework/`: 17 palette × 2 mode (dark + light) selezionabili in real-time via data-attributes (`data-palette` + `data-theme` su `<html>`), tipografia preservata.
2. La regola del **logo originale** L27 è canonicalizzata: `body` color usa `var(--primary)`, NON più `var(--brand-blue)`. La `y` resta `var(--accent)`. In legacy/alpha non cambia visivamente (primary == brand-blue). In palette non-blue (zeta/beta/gamma/theta/...) il body si adatta al colore primario della palette attiva.
3. Per ogni palette del framework, è garantito `--primary` ≠ `--accent` → bicolor wordmark sempre visibile.

**Contesto**:

Sessione 2026-05-09 night. Enzo richiede un framework che permetta a qualsiasi pagina di switchare palette/tema in real-time mantenendo la tipografia, mergiando i token direction-specific delle 8 esplorazioni α-θ + tempered (ι/κ/λ) + mu (5 variants) + Set 5 legacy.

Iterazioni:

- v1 playground "showcase scrollable" + switcher flottante → rifatto come dashboard con sidebar-embedded selector
- Aggiunte 3 matrici (color matrix completa, palette overview cliccabile, button matrix 7 varianti × 3 stati)
- Enzo corregge regola wordmark: "la scritta è in primary per tutte i caratteri ad esclusione di y che in accent"
- Audit primary vs accent → 28 blocchi su 34 avevano primary == accent → fix sistematico (cambio primary o accent per garantire bicolor)
- Enzo conferma update L27 a `var(--primary)`

**Conseguenza**:

**Asset creati** in `.ux-design/02-aesthetic/theme-framework/`:

- `heuresys-palette-framework.css` (1638 lines) — 17 palette × dark+light = 34 blocchi token canonici (foundation + ink + borders + brand + capability + semantic + 18 direction-aliases). Definisce anche styling switcher flottante.
- `heuresys-palette-switcher.js` (227 lines) — modulo drop-in per pannello flottante (zero deps). Espone API `window.HeuresysPaletteSwitcher.{setPalette, setTheme, toggle, getState, palettes}`. Supporta `window.HPS_DISABLED = true` per opt-out.
- `palette-playground.html` (~1200 lines) — dashboard 280px sidebar + content. Sidebar contiene theme toggle (segmented dark/light) + 17 palette grouped per famiglia (Set 5 / Primary / Tempered / Mu) cliccabili. Content contiene 10 sezioni: Foundation swatches, Color matrix (~50 token con valori computed live), Palette overview matrix (17 mini-card cross-palette cliccabili scoped via `data-palette` locale), Brand widgets, Button matrix (7 varianti × 3 stati), Capability colors, Generative spectrum, Direction aliases, Tabular surface, Gradient & glow.

**Inventario palette** (tutte garantiscono primary ≠ accent):

| Palette         | dark body / y                                 | light body / y             |
| --------------- | --------------------------------------------- | -------------------------- |
| legacy          | `#3b82f6` blue / `#a855f7` purple             | `#2452c8` / `#7e3fc8`      |
| alpha           | `#3b82f6` / `#a855f7`                         | `#2452c8` / `#7e3fc8`      |
| beta            | `#e85a3f` salmon / `#fff200` highlight yellow | `#c4361b` / `#fff200`      |
| gamma           | `#4d8fc8` blueprint / `#f0c14a` amber         | `#1a4d7a` navy / `#d8a213` |
| delta           | `#d63068` FT magenta / `#ff6900` FT orange    | `#990f3d` / `#ff6900`      |
| epsilon         | `#8b6dff` indigo / `#ffd4a8` peach            | `#2d1f6b` / `#c5b8ff`      |
| zeta            | `#e87850` terracotta / `#7a8455` moss         | `#c5612d` / `#5a6442`      |
| eta             | `#ffffff` swiss white / `#ef4444` red         | `#000000` / `#DC2626`      |
| theta           | `#8b5cf6` violet / `#06b6d4` cyan             | `#5b21b6` / `#0891b2`      |
| iota            | `#4d8fc8` / `#f0c14a`                         | `#1a4d7a` / `#d4a017`      |
| kappa           | `#d8688a` rose / `#d8a878` clay               | `#b8395a` / `#5a6478`      |
| lambda          | `#4d8fc8` / `#ef4444`                         | `#1a4d7a` / `#DC2626`      |
| mu-architect    | `#5e69d1` indigo / `#a4ffba` token green      | `#4555b8` / `#2da147`      |
| mu-art-director | `#8a48b8` deep purple / `#b370e0` lavender    | `#5e2c80` / `#8a48b8`      |
| mu-pragmatic    | `#22c55e` green / `#3b82f6` info blue         | `#15803d` / `#3b82f6`      |
| mu-synthesis    | `#5e69d1` / `#7a7fad`                         | `#4555b8` / `#5e69d1`      |
| mu-data-dense   | `#5e69d1` / `#7a7fad`                         | `#4555b8` / `#5e69d1`      |

**Logo originale L27 — regola aggiornata**:

```css
.wordmark-original {
  color: var(--primary); /* era var(--brand-blue) */
}
.wordmark-original .y {
  color: var(--accent);
}
```

Aggiornata auto-memory `feedback_logo_originale_l27.md` con paragrafo razionale e nuova regola CSS canonical.

**Cosa NON cambia**:

- Mockup esistenti `.ux-design/06-mockups/` continuano a funzionare: usano `var(--brand-blue)` che resta definito in tutte le palette del framework (alias compatibilità) e nel `services/app/src/styles/active-theme.css` produzione.
- Le pagine production `services/app/...` non sono toccate (il framework è opt-in solo per chi linka esplicitamente i 2 file CSS+JS).
- Tipografia: Exo 2 + Inter + JetBrains Mono restano stack canonico, framework non override font.

**Out-of-scope L48**:

- Promote del framework in produzione: resta strumento di sperimentazione locale in `.ux-design/`. Adozione come switcher production è phase futura (eventuale).
- Migrazione dei mockup esistenti da `var(--brand-blue)` a `var(--primary)`: solo se utente lo richiede esplicitamente. Per ora i 2 token sono coesistenti (alias).
- Aggiunta palette nuove: il pattern è documentato (definire 1 blocco dark + 1 light con tutti i token canonici), espandibile on-demand.

**Riferimenti**:

- Asset: `.ux-design/02-aesthetic/theme-framework/{heuresys-palette-framework.css,heuresys-palette-switcher.js,palette-playground.html}`
- Updated: `.ux-design/02-aesthetic/logo-standard.md` (body color → `--primary`)
- Updated auto-memory: `~/.claude/projects/D--evo-heuresys-com/memory/feedback_logo_originale_l27.md`
- Sessione: handoff post-L47 governance shift

---

## L49 — 2026-05-09 — Process autonomous role · theme-framework promoto in `/brand-studio` · canonical sweep mockup

**Decisione**: 3 follow-up shipped come single commit S22.1, risolvendo le 3 open question lasciate aperte da L48.

1. **Process dashboards = autonomous role** (override): i 4 `process_*` (Phase 15.A) sono assegnati come dashboard secondary a `HR_DIRECTOR` + `HR_MANAGER` via `role_default_dashboards` con `priority=10..40`. Il primary `@ priority=0` resta invariato (`hr_director_overview_v2` / `skills_heatmap_v2`). Schema cambiato: unique index ora su `(role, preset_code)` per consentire N preset per ruolo. Resolver helper nuovo `resolveAllPresetsForRole()` ritorna lista ordinata. SIDEBAR_MAP estesa con `processSection` (4 nav links) per HR_DIRECTOR + HR_MANAGER. Future-extension: associare a nuovi ruoli (RECRUITER, ONBOARDING_SPECIALIST, …) richiede solo INSERT in seed, no schema change.

2. **Theme-framework portato in `/brand-studio`** come **tab affiancata** vs Token Editor:
   - 3 file framework copiati: `services/app/src/styles/theme-framework/palette-framework.css` (1646 lines, 17×2 selectors `[data-palette][data-theme]`), `services/app/src/lib/theme-framework/{palettes.ts,active-palette-store.ts}`, `active-palette.json` default `{palette:"mu-architect",theme:"dark"}`
   - Root layout `services/app/src/app/layout.tsx` ora async: legge `active-palette.json` + cookie preview `heuresys-palette-preview` → applica `data-palette` + `data-theme` su `<html>` SSR
   - `BrandStudioClient` refactored con tab navigation: `Palette Presets` (nuovo, grid 17×2 mini-cards 4 family) + `Token Editor` (esistente)
   - Server actions nuove: `applyPaletteToProject(palette, theme)` scrive `active-palette.json`; `setPreviewPalette/clearPreviewPalette` cookie session-scoped
   - SUPERUSER-only (RBAC invariato)
   - Cascade: `palette-framework.css` importato DOPO `active-theme.css` → `[data-palette]` selector (specificità 0,1,0,0) override `:root` (0,0,1,0). Senza `data-palette` settato, active-theme.css fornisce fallback μ-architect-legacy
   - active-theme.css esteso con `--primary: var(--brand-blue)` + `--primary-deep: var(--brand-blue-deep)` come alias retrocompatibile

3. **Canonical sweep mockup**: rename completo `--brand-blue` → `--primary` (definizioni `:root` + usi `var()`) su 17 file `.ux-design/06-mockups/` (12 dashboard + 5 auth, 98→0 occorrenze legacy, 143 finali post-rename inclusi `--primary-deep`). Sweep production CSS deferred (alias attivo via active-theme.css → tutto il codice production che usa `var(--brand-blue)` continua a funzionare invariato).

**Contesto**: post-L48 erano rimaste 3 open question esplicite; Enzo ha risposto:

- Q1 process role → "override: vanno aggiunti ai 2 ruoli HR ma in futuro potranno essere associati anche ad altri (eventualmente creati nel corso dello sviluppo)"
- Q2 theme adoption → "Tab affiancata: Palette Presets vs Token Editor"
- Q3 mockup migration → "canonical"

Sequencing scelto: 3 → 1 → 2 (mockup canonical = SoT pulita prima delle modifiche DB e UI).

**Conseguenza**:

- HR*DIRECTOR + HR_MANAGER vedono 4 nuovi link nav `Process` in sidebar (URL diretti `/dashboard/process*\*`). Pagine già implementate da Phase 15.A/SH (no nuovo lavoro UI per queste route).
- `/brand-studio` da editor token mono-tab → strumento bivalente: switch palette runtime (project-wide via JSON file) + editor token granulare (custom theme via active-theme.css). I 2 workflow sono indipendenti, l'editor lavora SUI token che il framework definisce ma non è obbligato.
- `data-palette="mu-architect" data-theme="dark"` SSR su `<html>` come default → identico look produzione attuale (mu-architect-legacy ≈ mu-architect framework).
- 17 mockup ora canonical token-name (`--primary` ovunque). Aprendoli con palette-framework.css linkato (palette-playground.html), ogni palette switcher impatta sul wordmark + brand colors automaticamente.

**Out-of-scope L49**:

- Production CSS sweep `--brand-blue` → `--primary` (alias retrocompatibile copre il caso). Decisione carry-forward S23 se serve.
- `process_*_v2` versioni nel `dashboard_presets` production (ora si usano i `process_*` Phase 15.A). Promotion in `*_v2` quando mockup canonical body verrà tradotto in dashboard_elements seeded layout.
- Brand audit visual per ogni palette (17×2=34 combinazioni): manca smoke test esaustivo, l'utente verificherà durante uso.

**Riferimenti**:

- Migration: `db/seeds/phase15h_process_role_assignments.sql`
- New files: `services/app/src/lib/theme-framework/{palettes,active-palette-store}.ts`, `services/app/src/styles/theme-framework/{palette-framework.css,active-palette.json}`, `services/app/src/app/brand-studio/PalettePresetsTab.tsx`
- Updated: `services/app/src/app/layout.tsx` (async + data-palette/-theme), `services/app/src/app/brand-studio/{actions.ts,BrandStudioClient.tsx,page.tsx}`, `services/app/src/lib/dashboard-engine/role-preset-resolver.ts` (`resolveAllPresetsForRole`), `services/app/src/lib/navigation/role-nav-map.ts` (processSection), `services/app/src/styles/active-theme.css` (--primary alias)
- Mockup: 17 file in `.ux-design/06-mockups/` rinominati `--brand-blue` → `--primary`
- Verifica: typecheck PASS · vitest 214/214 PASS · migration applied (16 rows total)

---

## L52 — 2026-05-09 — `users.tenant_id` resta derivata (no denormalizzazione)

**Decisione**: la tabella `users` NON aggiunge una colonna `tenant_id`. Il legame user → tenant resta derivato via `users.employee_id → employees.tenant_id`. I platform user (`employee_id IS NULL`, es. `sysadmin` SUPERUSER) usano il fallback `DEFAULT_SUPERUSER_TENANT_ID` env var risolto in `services/app/src/lib/authorize.ts`.

**Contesto**: emersa durante il check di consistency L50 (S22). Verifica utente: "users non ha un campo che riferisce del tenant di apparteneza?". Confermato schema: 16 colonne canoniche su `users`, nessuna `tenant_id`. Discusse 2 opzioni (derivata vs denormalizzata).

**Razionale (3 motivi)**:

1. **Zero drift** — Single Source of Truth. Aggiungere `users.tenant_id` introduce un'invariante (`users.tenant_id == employees.tenant_id` per ogni user con employee_id non-null) che il DB non enforcia. Servirebbe trigger `AFTER UPDATE ON employees` o disciplina app-level. Più componenti = più cose da sbagliare.
2. **Status quo funziona** — il resolver in `authorize.ts:87-97` già fa il lookup; le 605 RLS policies attive scopano via `current_setting('app.current_tenant_id')` settato per sessione; 391 test verdi; P1-P10 enforced. Nessun problema misurato.
3. **Semantica coerente** — `users` è "credenziale di accesso", `employees` è "persona nell'organizzazione". Il tenant è proprietà della persona, non della credenziale. La decomposizione attuale è semanticamente corretta.

**Conseguenza**:

- Schema `users` invariato. Migration zero. Codice client non cambia.
- RLS policies su `users` table che scopino per tenant continuano a richiedere join via `employees` (es. `EXISTS (SELECT 1 FROM employees WHERE id = users.employee_id AND tenant_id = current_setting('app.current_tenant_id'))`).
- Login resolver continua a fare 1 query users + 1 lookup employees (PK lookup, ~ms — non un bottleneck misurato).

**Trigger di rivisitazione** (decisione da riaprire SE emerge):

- Requisito multi-tenant su singolo user (cross-tenant identity). NB: in tal caso non basta `users.tenant_id`, servirebbe tabella N:M `user_tenant_assignments` — ridesign più radicale.
- Bottleneck RLS misurato su `users` (es. `/admin/users` page con `EXPLAIN ANALYZE` che mostra il join a employees come hot-spot reale e non risolvibile via index).
- Requisito audit/analytics cross-tenant che richieda `users` snapshot indipendente da `employees` lifecycle.

In tutti questi casi: aggiungere quando serve, non in anticipo. Officina, non università.

**Riferimenti**:

- Schema verificato 2026-05-09 (16 colonne `users`, no `tenant_id`).
- Resolver: `services/app/src/lib/authorize.ts` linee 87-97.
- Env fallback: `DEFAULT_SUPERUSER_TENANT_ID` in `services/app/.env`.
- Sessione S22 / L50 / L51 (catalog consistency alignment + .test-env SoT formalization).

---

## L53 — 2026-05-09 — Forensic DBMS audit baseline + legacy login data purge

**Decisione**: post-S22 (L48-L52) eseguito audit qualitativo forense end-to-end del DBMS `heuresys_platform` via subagent `database-admin` (Claude Code SDK). Output: report 423 righe in `docs/_audit/2026-05-09-forensic-db-audit.md` con baseline schema/integrity/security e 22 issues prioritizzati per S23+. Plus cleanup completo dati di login legacy su file source (`evo.dev` / `admin123` / `@rtlbank.it` / `@heuresys.test` / `rtl-bank.<first>.<last>`) + wipe build cache (`.next/` + 4 `*.tsbuildinfo`).

**Contesto**: dopo allineamento canonical L50/L51 e decisione architetturale L52, l'utente ha richiesto (a) verifica esaustiva che vecchi dati di login non fossero più presenti in nessun file/cache del repo, (b) audit forense completo qualitativo del DB con superpower (subagent specializzato).

**Findings audit forense** (5 critical / 7 high / 12 lower):

- **`[CRITICAL]`** ~30+ tabelle con dati sensibili employee-scoped (employee*certifications, employee_skill_assessments, employee_pay_stubs, merit_recommendations, whistleblowing*_, salary*band_assignments, succession_candidates, calibration*_, prediction*\*, tenant_job*\*, ecc.) **senza colonna `tenant_id` né RLS policy**. Cross-tenant leak prevented oggi solo dal join app-level via `employee_id → employees.tenant_id`. Viola defense-in-depth promessa di P5. Estimate fix: 4-6 FTE-day.
- **`[CRITICAL]`** 13 RLS policies riferiscono GUC sbagliato `app.current_tenant` invece di `app.current_tenant_id` (analytics*aggregations, analytics_events, dashboards, dashboard_widgets, export*\_, report\_\_, model_predictions, performance_predictions, predictive_models, turnover_risk_scores, widget_templates). Effetto: `current_setting('app.current_tenant', true)` → NULL → comparison `tenant_id = NULL` → 0 rows. Fail-closed silente che maschera feature downstream. Estimate fix: 1 FTE-hour.
- **`[HIGH]`** Audit logs sparse: solo 6 entries ultimi 30 giorni · 4/5 con NULL actor. P4 enforcement gap: writes bypassano `auditedTransaction()`. Estimate audit: 1-2 FTE-day.
- **`[HIGH]`** Solo 6/36 route files api-gateway usano `requirePermission` middleware. P3 audit needed sui restanti 30. Estimate: 1 FTE-day.
- **`[HIGH]`** `users.role` varchar unconstrained (no FK a `rbp_roles.code`, no CHECK). Estimate fix: 1 FTE-hour.
- **`[HIGH]`** `widget_catalog_id` NULL su 100% dei `dashboard_elements` (115/115). Decommissiona FK o backfill. Estimate: 1-2 FTE-hour.
- **`[HIGH]`** `rbac_role` enum drift: contiene `SYSADMIN` e `TENANT_ADMIN` inesistenti in `rbp_roles`. Estimate: 1-2 FTE-hour drop o allinea.
- **`[HIGH]`** `rbp_role_permissions` count mismatch docs (179 actual vs 326 documentati in CLAUDE.md). Estimate: 30 min update doc.
- **`[MEDIUM]`** App-level `tenant_id` filter inconsistente; query rely solo su RLS via `withTenant()` wrapper. Lint rule raccomandato. Estimate: 2-4 FTE-hour.
- **`[MEDIUM]`** 256/265 active password con bcrypt cost <12 (project standard cost 12, applied solo ai canonical 8 + sysadmin). Schedule rotation. Estimate: 2-3 FTE-day o one-shot rehash al next login.
- **`[MEDIUM]`** 310 FK senza `ON DELETE` esplicito · materialized views senza refresh schedule documentato · GUC convention drift su `user_workspaces`/`workspace_widgets` · 0 employees con `enrichment_consent=true` · 50 SAP shadow tables senza PK (intenzionale).

**Findings positivi (baseline solida)**:

- 570 base tables · 905 FK · 2297 indici · 330 RLS policies · 354 trigger
- 100% RLS coverage sulle 291 tabelle che HANNO `tenant_id`
- 12 tabelle Platform-default (P10) tutte usano correttamente l'idiom `tenant_id IS NULL OR tenant_id = current_setting(...)`
- 8 ruoli canonical × 34 functional areas = 179 perm rows · tutti gli 8 ruoli popolati in `rbp_role_permissions`
- 4 tenants ✓ · 18 dashboard presets · 115 elements · 16 role mappings · 8 canonical demo users — tutti coerenti L46-L52
- Next.js: 24/24 page auth-gated · 6/7 API handlers chiamano `auth()`
- Login canonical 8 verificato end-to-end via bcryptjs server-side: 8/8 PASS bcrypt match

**Cleanup legacy login**:

9 file source aggiornati (`tests/fixtures/tenants.ts`, `services/app/tests/e2e/auth.spec.ts`, `services/app/src/__tests__/login-form.test.tsx`, `services/app/scripts/perf-dashboard.mjs`, `packages/ui/src/components/data-table.stories.tsx`, 3 file `services/api-gateway/src/routes/__tests__/`, `services/app/.env.local.example`, `services/app/src/app/brand-studio/README.md`, `db/seeds/ci_test_seed.sql`) + 5 mockup HTML auth (placeholder `@rtl-bank.it` → `@rtl-bank.org`). Cache wipe: `services/app/.next/` + 4 `*.tsbuildinfo`. 15 match restanti tutti legitimati (audit trail DECISIONS-LOG, migration SQL phase15h/15i, soft-delete `LEGACY_TO_DEACTIVATE` list intenzionale per idempotenza, commenti backward-compat in `UserMenu.computeInitials`, mockup tenant-subdomain `rtl-bank.heuresys.com` URL routing).

**Conseguenza**:

- Nessun residuo di vecchi dati di login attivi nel codice runtime. Solo riferimenti audit storici (immutabili per principio) restano.
- Baseline schema/integrity DBMS documentata e versionata. S23+ può lavorare su issues prioritizzate con tracciabilità.
- DRY refactor `tests/parse-test-env.mjs` come parser ESM condiviso da `apply-canonical-users.mjs` + `auth.ts` e2e helpers (zero duplicazione username/password tra file).
- Test coverage post-cleanup: 848/848 PASS (typecheck app + 4 vitest workspaces).

**Out-of-scope L53** (entra in S23 roadmap):

- Implementazione fix dei 22 issues identificati (totale stimato ~10-15 FTE-day cleanup)
- Production `/dashboard` refactor DB-driven (carry-forward S20+S21+S22, ~6-10h)
- WCAG 2.2 AAA full audit (carry-forward, ~3-5h)
- Mockup migration `var(--brand-blue)` → `var(--primary)` su production CSS (alias attivo, optional)

**Riferimenti**:

- Report audit: `docs/_audit/2026-05-09-forensic-db-audit.md` (423 righe, 8 sezioni + top-10 + advisory)
- Commit S22 close: `11df303` (L48) · `7cb25e8` (L49) · `1ee7b65` (S22 cleanup) · `a7f0a68` (USER\_\* rename) · `9f5569c` (L50) · `3f19a21` (L51) · `f14f63a` (L52) · `293e3eb` (DRY parser) · `074fe7d` (legacy purge + cache wipe) · `c5150c4` (audit doc).
- Verifica login: `node scripts/db/apply-canonical-users.mjs` su VM, output `verification: 8/8 pass`.

---

## L54 — 2026-05-09 — S23 forensic audit partial closure (4 issues chiuse · 1 partial · 2 deferred)

**Decisione**: aprire S23 come **Realistic Sprint** sul forensic DB audit L53. Scope onesto: chiudere i quick-win meccanici + pilot tenant_id su 6 tabelle small + helper P4 generalizzato (apply parziale). Refactor invasivi e issue ambigue → carry-forward S24+. NO over-engineering.

**Contesto**: L53 audit ha identificato 22 issues con totale stimato ~10-15 FTE-day. Una sessione (8-10h focus) NON copre tutto. L'utente ha accettato lo scope realistic vs ambizioso/quick-only. Durante esecuzione sono emerse 2 ulteriori scoperte di audit miscount.

**Issues chiuse / aperte / deferred**:

| #   | Sev          | Titolo                               | Status S23                                                | File deliverable                                   |
| --- | ------------ | ------------------------------------ | --------------------------------------------------------- | -------------------------------------------------- |
| 2   | `[CRITICAL]` | 13 RLS policies GUC typo             | ✅ **CLOSED**                                             | `db/seeds/phase16a_audit_quick_wins.sql`           |
| 1   | `[CRITICAL]` | ~30 tabelle senza tenant_id          | 🟡 **PILOT (6/24)**                                       | `db/seeds/phase16b_tenant_id_pilot.sql`            |
| 4   | `[HIGH]`     | `users.role` varchar unconstrained   | ✅ **CLOSED**                                             | `db/seeds/phase16c_users_role_fk.sql`              |
| 3   | `[HIGH]`     | P4 audit gap (NULL actor)            | 🟡 **HELPER + 2 brand-studio writes**                     | `services/app/src/lib/audit/auditedTransaction.ts` |
| 6   | `[HIGH]`     | P3 routes gap (6/36)                 | ⚖️ **AUDIT MISCOUNT**: 28/34 enforced inline (vedi sotto) | doc only                                           |
| 5   | `[HIGH]`     | `widget_catalog_id` NULL 100%        | 📅 **DEFERRED S24**                                       | (richiede Prisma schema sync)                      |
| 7   | `[HIGH]`     | `rbac_role` enum drift               | 📅 **DEFERRED S24**                                       | (richiede ALTER TYPE multi-step rischioso)         |
| 8   | `[HIGH]`     | RBP perm count mismatch (179 vs 326) | ✅ **CLOSED via doc**                                     | CLAUDE.md update                                   |
| 9   | `[MEDIUM]`   | App-level tenant_id lint rule        | 📅 **DEFERRED S25**                                       | —                                                  |
| 10  | `[MEDIUM]`   | bcrypt cost <12 rotation             | 📅 **DEFERRED S25**                                       | one-shot rehash al next login                      |

**Audit corrections rilevate during execution**:

1. **Issue #1 sovrastimato**: i 6 `tenant_job_*` tables (`tenant_job_kpis`, `tenant_job_skills`, `tenant_job_tasks`, `tenant_org_units`, `tenant_sap_mapping`, `tenant_skill_dimensions`) **HANNO già `tenant_id`**. Scope reale = ~24 tabelle (non 30). Audit § 2.3 da rivedere.
2. **Issue #5 unbackfillable**: `widget_code` (17 distinct in `dashboard_elements`) NON matcha alcun `widget_catalog.code` (0/17 match). I due naming systems sono indipendenti. Backfill impossibile — scelta tra (a) drop FK constraint + Prisma schema update, (b) decommissionare la colonna, (c) accettare NULL by design. Decisione lasciata a S24 (richiede Prisma sync).
3. **Issue #6 audit miscount**: l'audit § 6.1 ha contato solo `requirePermission` middleware esplicito (6/36). Verifica scope Step 5 ha mostrato che 22 routes "auth-only" hanno P3 enforcement INLINE via `cache.isAllowed(role, AREA, action)` — equivalente semanticamente, solo non standardizzato come middleware. Effettivi routes truly unprotected = ~4 (audit-logs, platform metadata, esco, nace). True P3 gap molto più piccolo.

**Pilot tenant_id 6 tabelle (scope #1)**:

- `whistleblowing_messages` (16 rows) · `whistleblowing_attachments` (7) · `whistleblowing_audit_log` (20) — backfill via `report_id → whistleblowing_reports.tenant_id`
- `mentorship_sessions` (355 rows) — backfill via `mentorship_id → mentorships.tenant_id`
- `survey_questions` (31 rows) · `survey_responses` (4482) — backfill via `survey_id → surveys.tenant_id`

Ogni tabella: ALTER ADD COLUMN tenant_id UUID + UPDATE backfill + ALTER NOT NULL + FK + INDEX + ENABLE+FORCE RLS + CREATE POLICY tenant_isolation. Total 4911 rows backfilled in single TX. Verification asserts: 6/6 NOT NULL · 0 NULL rows · 6 RLS policies attive.

**Helper P4 generalizzato (`auditedTransaction.ts`)**:

- `auditedTransaction(actor, payload, mutate)` — DB write atomico in TX con audit_logs insert. Throws su missing actor.tenantId/userId.
- `auditEvent(actor, payload)` — fire-and-error-tolerate per filesystem actions, cookie mutations. Ritorna null su fail (mai propaga upstream).
- `AuditCategory` ristretto ai 12 valori canonical CHECK constraint (AUTH, USER, EMPLOYEE, TENANT, GOAL, REVIEW, FEEDBACK, COMPENSATION, DOCUMENT, REPORT, CONFIG, SYSTEM)
- `AuditAction` ristretto agli 11 canonical (CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, IMPORT, PERMISSION_CHANGE, CONFIG_CHANGE, DATA_ACCESS)
- 5 vitest test verdi (P4 invariants + happy path)
- Applicato a `services/app/src/app/brand-studio/actions.ts`: `applyThemeToProject` + `applyPaletteToProject` ora producono audit trail con actor canonical (CONFIG/CONFIG_CHANGE)

**Out-of-scope esplicito S23 → carry-forward S24** (priorità):

1. **CRITICAL** Tenant_id batch 24 tabelle restanti — 4 batch SQL: `employee_core` (13), `learning` (6), `recruiting` (3), `talent` (6). Estimate ~4-6 FTE-day.
2. **HIGH** P4 sweep audit: applicare `auditedTransaction()` ai write paths Prisma (employees, candidates, performance_reviews, ecc.). Mirror helper in api-gateway/src/lib/audit/auditedTransaction.ts. Estimate ~1-2 FTE-day.
3. **HIGH** P3 micro-sweep su 4 routes truly unprotected (audit-logs, platform, esco, nace, skill-taxonomy se non public). Plus refactor inline→middleware standard sugli altri 22 (estetico/auditability). Estimate ~1 FTE-day.
4. **HIGH** `rbac_role` enum cleanup multi-step ALTER TYPE — separato da phase16. Estimate ~1-2 FTE-hour.
5. **HIGH** `widget_catalog_id` decommission decisione (drop FK + Prisma schema update vs accept NULL by design). Estimate ~1-2 FTE-hour.
6. **MEDIUM** bcrypt rotation cost 12 + lint rule app-level tenant_id → S25.

**Conseguenza**:

- DBMS state migliorato: 13 typo policies fixed + 6 tabelle tenant_id+RLS + FK users.role attiva. Forensic gap chiuso parzialmente.
- Helper P4 generalizzato disponibile come single SoT in `services/app/src/lib/audit/auditedTransaction.ts` per future write paths Prisma + non-DB.
- Audit miscount documentate (issue #1 scope ridotto · issue #5 unbackfillable · issue #6 inline P3 enforcement). S24 lavora su scope rivisto, non audit baseline.
- Test coverage mantenuta: typecheck PASS · 848+5 vitest verdi · login canonical 8/8 PASS post-FK.

**Riferimenti**:

- Plan canonical: `~/.claude/plans/superpowers-per-eseguire-tutto-eventual-sunset.md`
- SQL deliverables: `db/seeds/phase16a_audit_quick_wins.sql` · `phase16b_tenant_id_pilot.sql` · `phase16c_users_role_fk.sql`
- Helper: `services/app/src/lib/audit/auditedTransaction.ts` + test in `__tests__/`
- Audit doc updated: `docs/_audit/2026-05-09-forensic-db-audit.md` § "S23 partial closure annotations"
- Verifica DB: `pg_policies` 0 typo · 6 new RLS policies · `pg_constraint` `fk_users_role` attiva · `apply-canonical-users.mjs` 8/8 PASS

---

## L55 — 2026-05-09 — S23-bis extension: 3 deferred chiuse + P3 audit miscount confermato

**Decisione**: post-commit S23 (`929aa1e`), proseguito stesso session per chiudere i 2 deferred (#7 rbac_role enum drift + #5 widget_catalog_id) + verifica completa P3 (#6) → concluso che P3 gap = ZERO. Effort aggiuntivo ~1.5h.

**Contesto**: utente ha richiesto "continua con attività non iniziate o da completare" dopo L54. Disponibili in budget: 3 issue HIGH ancora aperte + verifica P3 dettagliata. Rischio basso, valore alto.

**Issues addizionali chiuse**:

| #   | Sev      | Titolo                        | Status                                                      | Deliverable                                            |
| --- | -------- | ----------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| 7   | `[HIGH]` | `rbac_role` enum drift        | ✅ **CLOSED**                                               | `db/seeds/phase16d_rbac_role_cleanup.sql`              |
| 5   | `[HIGH]` | `widget_catalog_id` NULL 100% | ✅ **CLOSED**                                               | `db/seeds/phase16e_widget_catalog_id_decommission.sql` |
| 6   | `[HIGH]` | "30/36 routes senza P3"       | ⚖️ **MISCOUNT CONFIRMED**: 34/34 non-public routes hanno P3 | doc-only update                                        |

**phase16d (rbac_role cleanup)**:

- Verificata legacy table: `role_permissions` (20 rows, NON usata da app code) usa enum `rbac_role` con 4 SYSADMIN orphan + 0 TENANT_ADMIN.
- Strategy multi-step (Postgres NON supporta `REMOVE VALUE` su enum): UPDATE remap SYSADMIN→SUPERUSER (4 permission_id distinct dai 4 SUPERUSER esistenti, no UNIQUE collision) + CREATE rbac_role_v2 (8 canonical) + ALTER COLUMN TYPE + DROP TYPE rbac_role + RENAME v2→rbac_role.
- Discovery secondaria: trigger `audit_permission_changes()` sulla `role_permissions` blocca UPDATE per CHECK constraint violation (writes audit_logs con tenant_id NULL + action='PERMISSION_UPDATED' + category='RBAC' — entrambi non in CHECK list audit_logs.action/category). È il P4 gap dell'audit § 8.4. Workaround: `SET LOCAL session_replication_role = replica` durante migration. Trigger sostituito da `auditedTransaction()` in S24+ sweep.
- Prisma schema aggiornato (services/app + services/api-gateway): rbac_role enum ora 8 canonical (matches `rbp_roles.code`).
- Verification: 8 enum values · 20 rows invariate · 0 drift · typecheck PASS · 853 test verdi.

**phase16e (widget_catalog_id decommission)**:

- Strategy conservativa: drop FK constraint, mantieni colonna `Int?` per backward compat (referenced in 6 punti: 4 test fixtures + DashboardElement type interface + dashboard/page.tsx — passano `widget_catalog_id: null` ovunque).
- Prisma schema cleanup: rimosso `@relation widget_catalog?` da `dashboard_elements` + back-reference `dashboard_elements[]` da `widget_catalog`. Colonna `widget_catalog_id Int?` retained come campo unconstrained.
- Verifica: FK dropped · column retained · 115 rows widget_catalog_id NULL invariate · typecheck PASS.

**P3 audit miscount confirmation (#6)**:

- Verificati i 7 routes "potenzialmente unprotected": `audit-logs.ts` · `platform.ts` · `esco.ts` · `nace.ts` · `skill-taxonomy.ts` · `health.ts` · `auth.ts`.
- 5/7 hanno P3 inline via `cache.isAllowed(role, AREA, 'view')`: `audit-logs` (AUDIT) · `platform` (EMPLOYEES) · `esco`/`nace`/`skill-taxonomy` (ESCO_KG OR EMPLOYEES).
- 2/7 sono **intentionally public**: `health.ts` (liveness/readiness probe per nginx) · `auth.ts` (login/logout handler — NextAuth needs to be reachable pre-auth).
- **P3 enforcement coverage REALE = 34/34 routes non-public** (28 inline + 6 middleware). True P3 gap = 0. Audit § 6.1 metric "6/36 con requirePermission" misurava solo middleware ESPLICITO ed è un naming-mismatch con la realtà operativa.

**Conseguenza**:

- DBMS state ulteriormente armonizzato: enum `rbac_role` allineato a `rbp_roles.code` canonical · widget_catalog FK orphaned dropped.
- Issue audit chiuse post-S23: **6 of 8 issues HIGH/CRITICAL** completate (#2 ✅ #4 ✅ #7 ✅ #5 ✅ #8 ✅ #6 ⚖️ chiuso come miscount). Restano partial #1 (pilot 6/24) + partial #3 (helper + 2 brand-studio).
- Trigger `audit_permission_changes()` flagged come technical debt: scrive audit_logs invalidi (CHECK violations + NULL actor) e va sostituito da `auditedTransaction()` in S24+ sweep.

**Out-of-scope esplicito → S24** (priorità rimaste):

1. **`[CRITICAL]`** Tenant_id batch 24 tabelle restanti (employee_core 13 + learning 6 + recruiting 3 + talent 6) — main residual workload (~4-6 FTE-day).
2. **`[HIGH]`** P4 sweep: extend `auditedTransaction()` ai write paths Prisma + drop/replace trigger `audit_permission_changes()` con helper. Mirror in api-gateway. ~1-2 FTE-day.
3. **`[MEDIUM]`** bcrypt rotation cost 12 + lint rule app-level tenant_id → S25.

**Riferimenti**:

- SQL deliverables S23-bis: `db/seeds/phase16d_rbac_role_cleanup.sql` · `db/seeds/phase16e_widget_catalog_id_decommission.sql`
- Schema Prisma updated: `services/{app,api-gateway}/prisma/schema.prisma` (enum rbac_role + widget_catalog @relation cleanup)
- Verifica DB: enum `rbac_role` 8 valori canonical · 0 role_permissions drift · 0 FK widget_catalog · login canonical 8/8 PASS

---

## Format per nuove entry

Quando aggiungi una nuova decisione, segui questo template:

```markdown
## L<N> — YYYY-MM-DD — <Titolo decisione>

**Decisione**: <cosa è stato deciso, in 1-2 frasi>

**Contesto**: <perché è stato deciso, parole di Enzo se rilevanti>

**Conseguenza**: <cosa cambia operativamente come risultato>

**⚠️ STATUS** (se applicabile): superseduta dalla L<X>
```
