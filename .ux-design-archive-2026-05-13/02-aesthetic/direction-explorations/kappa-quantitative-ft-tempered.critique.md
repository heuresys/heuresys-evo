# κ — Quantitative FT Tempered · 3-designer-debate

> Applicazione del prompt `99-samples/rohitg00-prompts/3-designer-debate.md` alla direzione κ.

## Brief

Direzione **κ** Quantitative FT Tempered. B2B enterprise. Buyer CHRO/CIO. Dashboard FOCUS MASSIMO. Trustworthy 65% / Courage 35%. Family Data-Dense Pro · FT-grade restraint. Reference: PostHog product-marketing × Financial Times typographic discipline. Source Serif 4 headline + Inter body + JetBrains Mono numerals. Single muted-rose accent (NOT FT salmon urgency). Claim: layer ontologico via Knowledge Graph ESCO bilingue.

## Personas

| Persona          | Background                              | Believes in                          | Distrusts              |
| ---------------- | --------------------------------------- | ------------------------------------ | ---------------------- |
| **Architect**    | 20yr Stripe/Shopify/Atlassian           | Tokens, scale, governance, trade-off | One-off components     |
| **Art Director** | Pentagram/Vignelli/editorial mag        | Craft, typography, references        | Flatten design systems |
| **Pragmatic**    | 40 features YC-stage, conversion-driven | Velocity, clarity, metrics           | Decoration, theory     |

---

## Opening (3 sentences each)

**ARCHITECT**: "Source Serif headline è una scelta tipografica forte ma costa cara — gestire 3 famiglie tipografiche (Source Serif + Inter + JetBrains Mono) significa 3 fallback stack, 3 weight subset, 3 column di responsabilità nel design system. Tabular nums in Source Serif è molto specifico: serve `font-feature-settings: 'tnum'` esplicito, perché Source Serif default rende oldstyle. Il muted rose `#b8395a` su cream `#fbf7f2` passa WCAG AA per body? Validate."

**ART DIRECTOR**: "Finalmente una direzione che racconta qualcosa. Source Serif su FT-grade cream è il register del Wall Street Journal opinion page, non del SaaS B2B — e questo è il punto: distingue Heuresys da Linear-Linear-Linear. Il masthead 'VOL. I · ISSUE 01 · MILANO TUESDAY 5 MAY 2026' è teatrale ma intentional, dichiara una postura editoriale. La quote-block con `<em>ability</em>` in italic accent è il modo corretto di usare il colore: zero decorativo, tutto semantico."

**PRAGMATIC**: "Editorial-FT direction risuona con CHRO che leggono Sole 24 Ore o FT al mattino — è target match perfetto per i 47-anni RTL Bank. Ma c'è un rischio: dashboard products in serif sono RARI. Chi usa Source Serif su KPI cards sembra elegante in mockup, claustrofobico in 8 ore di uso quotidiano. Il rischio è che il CHRO firmi il contratto e poi gli analyst del team si lamentino dopo 3 settimane."

---

## Round 1 — Serif su dashboard

**PRAGMATIC**: "Serif headline KPI è bello, ma su 14k skill table righe 8px di leading? Sustained reading test prima di ship."

**ART DIRECTOR**: "Lo serif è SOLO sui display + heading + KPI numerals. Tutto il body, label, micro-copy va in Inter. La densità di tabella resta sans-only. Pentagram non è masochista."

**ARCHITECT**: "Token-wise: serif su KPI num è coerente solo se le KPI sono auto-evidenti, max 4-6 per surface. Quando si va su tabella 200 righe il numero in serif scoppia. Lock: serif scale {28+ only}. Body, table, badge → sans+mono."

**PRAGMATIC**: "Ok ma avvisate che la densità complessiva di κ è inferiore a Linear. Per le HR ops di tutti i giorni potrebbe essere un trade-off di leggibilità."

---

## Round 2 — Masthead theatricality

**PRAGMATIC**: "Il masthead 'VOL. I · ISSUE 01 · TUESDAY 5 MAY 2026' è cosplay editoriale. CHRO non comprano newsletter."

**ART DIRECTOR**: "I CHRO comprano DOCUMENTI. La differenza tra newsletter e document è il register, non il tipo. FT vende editorial autorevole; quel masthead trasmette 'questo è un position paper', non 'questo è marketing'. È un anchor di register, non orpello."

**ARCHITECT**: "Però costa zero rimuoverlo. Non è una decisione strutturale. Lasciamo design come è e A/B test su 50 prospect: con e senza masthead. Vincente sale a prod."

**ART DIRECTOR**: "Concordo, ma A/B test va eseguito con il content RIGHT, non con un masthead vuoto. Il masthead funziona se sotto c'è un essay-grade hero copy, non un buzzword 'capability operating system'."

---

## Round 3 — Muted rose vs salmon

**ARCHITECT**: "Muted rose `#b8395a` è scuro: contrast su cream è WCAG AAA, ma rischia di sembrare 'beauty brand' invece di financial. Serve spostare verso tono più dorato/oliva?"

**ART DIRECTOR**: "Rose è scelta deliberata anti-FT-salmon. FT salmon (`#ffd2bb`) è urgency, mercati che girano. Rose è autorevole, libreria, archivi. Ferrari Magazine usa rose simile. Lock il rose."

**PRAGMATIC**: "I CHRO maschi 50+ enterprise B2B forse leggono rose come 'femminile/morbido'. Bias real, non lo invento. Test su sample diviso M/F potrebbe rivelare il problema."

**ART DIRECTOR**: "Dare per scontato bias di genere su un colore è proprio il tipo di analisi che porta a teal default. Se il rose performa peggio nel test si cambia, ma non cambiamo per timore."

---

## Synthesis — written by Architect

Ship in this order:

1. **Lock typography rule**: Source Serif scale 28+ only, sotto va sans+mono — costa 0 (rule in DESIGN.md)
2. **Live test masthead presence**: A/B su 50 enterprise prospect, vincente shipa — sprint 2
3. **Validate rose contrast** WCAG AA pair body+surface, AAA pair display+surface — pre-merge

Tenete la palette cream + navy + rose. Tenete Source Serif. Il register editorial è il differenziatore di κ vs everyone else.

## Minority Report

**PRAGMATIC**: "Il rischio dashboard claustrofobico in sustained use resta unmitigated. Approvo solo se aggiungiamo una "compact mode" toggle in dashboard che switcha a Inter-only senza Source Serif. Ho visto questo killer usabilità troppe volte."

---

## Action Items (3 concrete)

| #   | Owner        | Task                                                               | Deadline |
| --- | ------------ | ------------------------------------------------------------------ | -------- |
| 1   | Architect    | Lock Source Serif scale 28+ only in DESIGN.md sezione typography   | 0        |
| 2   | Art Director | Drafting essay-grade hero copy per masthead live A/B test          | sprint 1 |
| 3   | Pragmatic    | Implementare "compact mode" toggle dashboard (Inter-only fallback) | sprint 3 |

## Verdict — D1 perspective

κ è la **scelta editorial-distinctive**. Ha la più alta signature potential delle 4 (Source Serif + masthead + cream + rose), ma anche il più alto rischio operativo (dashboard sustained reading + serif claustrofobia + bias percezione rose).

Recommendation per Enzo: κ è il **ceiling** in termini di brand voice. Se hai sicurezza che HR ops giornaliera non è il primary use case (es. CHRO/CIO solo, non analyst pool), κ rende Heuresys una categoria a sé stante. Se il dashboard è dove i prosumer vivono 8h/giorno, κ ha bisogno di compact-mode escape valve.
