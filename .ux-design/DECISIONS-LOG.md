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
