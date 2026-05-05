# μ — Data-Dense Temperata · 3-designer-debate

> Applicazione del prompt `99-samples/rohitg00-prompts/3-designer-debate.md` alla direzione μ.

## Brief

Direzione **μ** Data-Dense Temperata (clean slate). B2B enterprise. Buyer CHRO/CIO. Dashboard FOCUS MASSIMO. Trustworthy 60% / Courage 40% (target esatto). Family Data-Dense Pro pura. Reference: PostHog product-marketing × Linear restraint × Heuresys ontologico ESCO. Single accent purple-blue (`#7a7fad` light / `#5e69d1` dark — Linear "brand-secure"). Anti-slop guardrails active (from `break-default-aesthetic.md`): single accent, no teal, no animated dots, container nesting ≤2, no 3-col feature grid section 2, single icon family. Dashboard-first surface (sidebar 220px + KPI ring + table + KG canvas).

## Personas

| Persona          | Background                              | Believes in                          | Distrusts              |
| ---------------- | --------------------------------------- | ------------------------------------ | ---------------------- |
| **Architect**    | 20yr Stripe/Shopify/Atlassian           | Tokens, scale, governance, trade-off | One-off components     |
| **Art Director** | Pentagram/Vignelli/editorial mag        | Craft, typography, references        | Flatten design systems |
| **Pragmatic**    | 40 features YC-stage, conversion-driven | Velocity, clarity, metrics           | Decoration, theory     |

---

## Opening (3 sentences each)

**ARCHITECT**: "μ è dashboard-first design system fatto bene: sidebar 220px, KPI ring 4 cell, table 32px row height, single accent surgical, tabular nums always-on, anti-slop guardrails attivi. Validate token chain: surface-1 / surface-2 / surface-3 step di luminosità coerente light+dark? `--accent-soft` derived da `--accent` con opacity o hex hardcoded? Se hardcoded, deriva conflitti su color theme. Lock procedure di derivazione token in DESIGN.md."

**ART DIRECTOR**: "Finalmente un design pensato per dashboard sustained, non per landing. Inter weight 600 a 28px è una scelta tipografica corretta per heading dashboard — peso giusto, scala giusta. Ma il differenziatore visivo di Heuresys (l'ontologia) è schiacciato in un piccolo widget KG topology a destra: è il MIO unico segnale di signature, e sta a margin. Il dashboard senza ontology signature è PostHog clone."

**PRAGMATIC**: "Questo è quello che il CHRO di RTL Bank vede quando apre Heuresys ogni mattina. Non un masthead serif (κ), non un blueprint plate (ι), non una composizione editorial (λ). Un dashboard che lavora. KPI ring + 8-row table = scenario di lavoro reale. Tasso conversione enterprise demo: questo design ha la più alta chance di chiudere un trial perché RIDUCE il dover spiegare cosa fa il prodotto. La dimostrazione è il prodotto."

---

## Round 1 — Ontology signature

**ART DIRECTOR**: "Il KG topology a destra è troppo piccolo. Heuresys vende ontology — l'ontology va al centro, non alla finestra. Ho guardato lo screenshot e ho dovuto cercarlo."

**PRAGMATIC**: "Non è marketing surface, è dashboard quotidiano. KG topology è insight, non hero. KPI ring e tabella sono i dati operativi che il CHRO controlla. Mettere il KG al centro vuol dire fare un report, non un dashboard."

**ARCHITECT**: "Esiste un compromise: il sidebar ha 5 ontology nodes (Process / Structure / Performance / Role / Competency) come navigation glyphs. Se quelle diventano clickable + visualizzano KG sub-graph + arricchite con badge metriche live, l'ontology è seamlessly integrata in user flow, non relegata in widget."

**ART DIRECTOR**: "OK quel pattern funziona. Ma le 5 glyphs nel mockup sono solo cerchi neutri ○ ●. Servono mark distinti — non identici. Process diverso da Performance, visivamente."

**ARCHITECT**: "Lavoro Phase 7 logo derivati: 5 capability glyphs come mark system. Non è una direction question — è downstream."

---

## Round 2 — Accent purple-blue derivativity

**ART DIRECTOR**: "Linear lavender + brand-secure → μ accent. È esattamente il pattern Linear. Stiamo facendo Linear per HR."

**PRAGMATIC**: "Linear è amato. Imitare Linear sul B2B HR enterprise è una strategia, non una resa. Vercel ha imitato Linear nel design system e ha vinto il developer market. Heuresys può imitare Linear nel HR market — è un ROI di brand-positioning."

**ART DIRECTOR**: "Ma c'è un effetto unintended: i developer sanno riconoscere Linear da Vercel. I CHRO no. A loro Linear non dice nulla. Quindi μ accent purple-blue per il CHRO è 'generic Saas blue'. Bias diverso da pubblico."

**ARCHITECT**: "Test ipotesi: se il CHRO è naive del trend SaaS, allora accent purple-blue è neutrale-positivo. Se è SaaS-savvy, vede Linear. Quale CHRO è target? Maria 47 RTL Bank è probabilmente naive — usa Salesforce/SAP, non Linear."

**ART DIRECTOR**: "Concordo, ma allora dichiarate l'origine del color: 'Linear brand-secure', non 'colore neutro elegante'. Onestà di lineage."

---

## Round 3 — Anti-slop guardrails efficacy

**ARCHITECT**: "Il commento HTML `Anti-slop guardrails active` lista 6 reject rules dichiarate. Verifica una per una nel mockup attuale: single accent ✓, no teal ✓, no animated dots ✓, container nesting ≤2 — devo contare. Sidebar > section > sidebar-link è 3 livelli, fail."

**PRAGMATIC**: "Sidebar > sidebar-section > sidebar-link è 3, ma sidebar e workspace sono peers — non c'è container-on-container decoration. Spirit della regola rispettato anche se letter borderline."

**ART DIRECTOR**: "Spirit > letter quando la regola è anti-slop, non WCAG. OK approvato."

**ARCHITECT**: "Però lock in DESIGN.md: 'sidebar nesting come pattern ammesso, max 3 livelli, ulteriori livelli vietati'. Senza chiarimento, futuro coding agent espande a 5."

---

## Synthesis — written by Architect

Ship in this order:

1. **Lock token derivation rules** in DESIGN.md sezione 2: surface-1/2/3 luminance steps, accent-soft derived (NOT hardcoded), procedure light+dark theme propagation — costa 1h
2. **Promote 5 ontology glyphs from sidebar generic ○ ● to distinct marks**: Process, Structure, Performance, Role, Competency. Usable in sidebar nav + footer + about — sprint Phase 7
3. **Document Linear lineage** in DESIGN.md: "accent inspired by Linear brand-secure `#7a7fad`, used per Heuresys-specific role." Onestà di lineage previene re-derivation in 6 mesi — costa 0

Tenete il dashboard-first surface. Tenete sidebar 220px. Tenete tabular numerals always-on. Tenete anti-slop guardrails attivi.

## Minority Report

**ART DIRECTOR**: "Il differenziatore ontologico non è risolvibile via 5 glyphs in sidebar di prossimo sprint. Approvo μ a condizione che il graph-glyph system venga definito e testato in mockup live ENTRO la decisione D1 — non dopo. Altrimenti μ è 'Linear con tabella ESCO', non 'Heuresys data-dense temperata'."

---

## Action Items (3 concrete)

| #   | Owner        | Task                                                                          | Deadline |
| --- | ------------ | ----------------------------------------------------------------------------- | -------- |
| 1   | Architect    | Lock token derivation rules in DESIGN.md sezione 2 (surface steps + accent)   | 1h       |
| 2   | Pragmatic    | Live demo test μ con 5 enterprise prospect: tasso conversione vs ι/κ/λ        | sprint 2 |
| 3   | Art Director | 5 capability glyphs prototype (Process/Structure/Performance/Role/Competency) | pre-D1   |

## Verdict — D1 perspective

μ è la **scelta dashboard-native + family-picker exact match (60/40)**. Esegue alla lettera la raccomandazione: PostHog mood + Linear restraint + Heuresys ontologico (per ora light-touch, da rinforzare).

Recommendation per Enzo: μ è il **floor + ceiling pragmatico**.

- **Floor** perché funziona già bene per uso quotidiano dashboard senza signature ontologica forte (la Art Director minority report ha ragione, ma non è blocking).
- **Ceiling pragmatico** perché può evolvere — 5 capability glyphs nuovi + KG topology promossa a hero in landing/marketing surface = signature ontologica acquisita senza riscrivere il design system.

μ è la scelta razionale se: (1) priorità è dashboard product-market fit, (2) brand signature può arrivare gradualmente Phase 7-9, (3) sei ok con lineage Linear esplicito nel DESIGN.md.

Tra le 4 direzioni, μ è la più **ship-ready**.
