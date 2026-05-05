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
