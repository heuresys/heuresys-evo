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

## Format per nuove entry

Quando aggiungi una nuova decisione, segui questo template:

```markdown
## L<N> — YYYY-MM-DD — <Titolo decisione>

**Decisione**: <cosa è stato deciso, in 1-2 frasi>

**Contesto**: <perché è stato deciso, parole di Enzo se rilevanti>

**Conseguenza**: <cosa cambia operativamente come risultato>

**⚠️ STATUS** (se applicabile): superseduta dalla L<X>
```
