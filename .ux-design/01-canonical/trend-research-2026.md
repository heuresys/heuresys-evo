# Trend Research — Enterprise B2B SaaS Dashboard Analytics 2025-2026

> **Status**: Draft cycle 2 (Phase 0 T0.2) · 2026-05-14 · ricerca consolidata da WebSearch + WebFetch su pattern enterprise B2B SaaS dashboard analytics, con focus banking / HR / workforce intelligence.
>
> **Scope**: 20 pattern canonical da adottare/evitare per il rebuild "investor-ready flight cockpit" delle 17 route × 8 ruoli di heuresys-evo. Baseline palette `μ-architect-legacy` (dark navy + brand blue + purple accent).
>
> **Method**: ogni pattern documenta source (siti/articoli osservati), use case heuresys (HR Director / Talent intelligence cockpit RTL Bank K.64.19 banking), anti-pattern risk se rilevante.

---

## Pattern 1 — Decision-Focused Dashboard (Surface Decisions, Not Data)

- **Source**: SaaSUI 2026 trends · think.design 2026 do's-and-don'ts · Visier Workforce AI · Crunchr "live strategic dashboard not lagging report"
- **Use case heuresys**: dashboard HR Director NON elenca turnover %, latency hire, skill gap come metriche piatte; surface esplicito "azioni raccomandate questa settimana" (es. "3 candidati ad alto rischio churn — apri retention playbook", "2 ruoli critici scoperti in Risk dept — escalate"). Ogni KPI card ha CTA secondaria con next-best-action AI-suggested.
- **Anti-pattern risk**: "Data Vomit" — confondere completezza con utilità. Mai schermo che mostra 30 numeri senza gerarchia di azione.

## Pattern 2 — Role-Based Experience Design (Beyond Permissions)

- **Source**: SaaSUI 2026 · existing heuresys G6 preset architecture (`*_v2` 7 ruoli)
- **Use case heuresys**: stesso underlying DBMS, view radicalmente diverse per HR_DIRECTOR (strategy/risk) vs HR_MANAGER (operations/pipeline) vs LINE_MANAGER (team-only/1:1) vs TENANT_OWNER (cross-tenant + revenue). Already shipped in S35.6 G6 preset binding — confermare e RAFFINARE, non re-implement.
- **Anti-pattern risk**: "one interface for everyone" — un singolo dashboard generic che HR_DIRECTOR e LINE_MANAGER vedono con flag visibility. Neither role gets clean signal.

## Pattern 3 — Progressive Disclosure (5-7 KPI Summary → Drill)

- **Source**: NN/g · UXPin 2026 · F1Studioz Smart SaaS Dashboard Guide 2026 · Pixxen progressive disclosure playbook
- **Use case heuresys**: ogni cockpit apre con 5-7 summary card (working memory limit 4-7 chunks). Click card → expanded panel inline (NON page navigation) con breakdown · trendline · employee list · drill action. Esempio: HR Director "Attrition Risk 8 employees" → expand → 8 nomi · score · skill match alternative role · open retention 1:1.
- **Anti-pattern risk**: aprire pagina con 25 metriche piatte non-clickable. Modal-heavy workflow al posto di inline expansion.

## Pattern 4 — Sidebar 240-280px + Card Grid + Command Palette (Cmd+K)

- **Source**: AdminLTE 2026 templates · Mobbin command palette · Linear Cmd+K · think.design 2026
- **Use case heuresys**: sidebar persistent 240-260px con role-based nav (già implementato AppShell). Cmd+K command palette globale: jump-to-route, search employee/role/skill, recent actions, AI assistant query. Power-user accelerator senza overhead per novice (sidebar resta primary).
- **Anti-pattern risk**: top-nav horizontal con 12 voci che si nasconde dietro hamburger su laptop. Cmd+K assente o limitato a search only (manca navigation/action).

## Pattern 5 — Dark Mode Default (Data-Heavy Eye Strain Reduction)

- **Source**: 60+ Muz.li 2026 dashboard inspiration · Qodequay dark mode principles · SaaSUI 2026 (Linear/Notion/Figma default dark)
- **Use case heuresys**: baseline `μ-architect-legacy` palette dark navy + brand blue + purple accent è già allineato. HR Director / IT Admin / SUPERUSER lavorano 6-8h al giorno sul cockpit — dark mode riduce eye strain e signala product quality. Light mode resta opt-in per stampe/screenshot.
- **Anti-pattern risk**: dark mode "tinted black" (grigio sporco) invece di navy/charcoal saturato. Contrast 4.5:1 obbligatorio anche in dark (WCAG AA).

## Pattern 6 — KPI Card con Sparkline + Trend + Delta % + Smart Narrative

- **Source**: Tabular Editor KPI guide · EPCGroup 2026 · ChartLoad sparkline KPI · datawirefra.me layout patterns
- **Use case heuresys**: ogni KPI card = (1) headline number large; (2) sparkline 30-90gg trend inline; (3) delta % vs target con direction color (verde su, rosso giù — coerente con cultural reading); (4) smart narrative micro-text generato da AI "↑ 12% post nuovo CCNL banking applicato". Pattern già parziale in heuresys, da estendere.
- **Anti-pattern risk**: card con solo numero secco + label. Manca contesto temporale, target, direction → utente deve cliccare per capire significato.

## Pattern 7 — 40-30-20-10 Space Rule

- **Source**: Tabular Editor 2026 · datawirefra.me 12 layout patterns
- **Use case heuresys**: 40% area = hero KPI (cosa devo decidere ORA), 30% = 2-3 secondary KPI supporting, 20% = trend context (sparkline · comparison bar), 10% = filter/nav. Pagina HR Director: hero "Attrition Risk %" 40% schermo, 3 card supporting (open roles · skill gap · learning velocity), trend strip bottom, filter chips top.
- **Anti-pattern risk**: 16 card uguali in griglia 4×4 → nessuna gerarchia, occhio si perde.

## Pattern 8 — Filter Chips Horizontal + Faceted Search

- **Source**: PatternFly filters · Mobbin · UXPin 2026 advanced search
- **Use case heuresys**: filter chips top-strip per tenant (RTL Bank · SmartFood · EcoNova · Heuresys System) · department · role · seniority · time-window. Chip con X dismiss, "Clear all" sempre presente, OR within category / AND across category. Combinato con Cmd+K full-text search.
- **Anti-pattern risk**: filter sidebar 320px che mangia screen real-estate. Dropdown stack con 8 voci collassate.

## Pattern 9 — Empty State as Primary Onboarding Surface

- **Source**: NN/g · Carbon Design System · SaaSUI 2026 · Smashing Magazine
- **Use case heuresys**: vista Talent Pipeline vuota (tenant nuovo) NON mostra "No data" generico. Mostra: (a) ascii illustration heuresys-styled; (b) "Inizia importando employees da HRIS o crea il primo employee manualmente"; (c) 3 CTA ranked (import CSV · connect HRIS · manual entry); (d) "Chiedi all'AI assistant: cosa devo configurare per primo?". Anche `<DataNotAvailable />` esistente va evoluto in questa direzione per cells specifici.
- **Anti-pattern risk**: "No data available" puro testo grigio centrato. Onboarding tour modale 7-step skip-skip-skip.

## Pattern 10 — Skeleton Shimmer (Structure-Aware) per Async Load

- **Source**: NN/g skeleton 101 · shimmer-from-structure · Syncfusion DataGrid 2026 · Next.js loading.js
- **Use case heuresys**: ogni route group `(app)/` con `loading.tsx` Next.js dedicated. Skeleton mirror la struttura finale (KPI card grid 4×2 → 8 skeleton card stessa dimensione, NON spinner centro pagina). Shimmer animation ~1.4s loop. Le mat views Postgres refresh ogni 4h → query <500ms ma cold-cache può salire → skeleton sempre presente.
- **Anti-pattern risk**: spinner singolo centro pagina per 800ms (layout shift CLS quando arriva data). Skeleton hardcoded non-matching final layout.

## Pattern 11 — Monospace Numerals (Tabular Figures) per Data Density

- **Source**: FontAlternatives best fonts dense dashboards · Inforiver financial reporting · ClickHouse homepage observed
- **Use case heuresys**: stack typography deve includere `font-feature-settings: "tnum" 1, "lnum" 1` su tutte le cell numeriche (KPI · table · sparkline tooltip). Inter o JetBrains Mono per code/IDs. Allineamento verticale di numeri in colonna critico per scan veloce (es. salary bands, headcount per dept).
- **Anti-pattern risk**: numeri proporzionali in table column → "1,234.56" e "999.00" non allineati → eye refocusing ad ogni riga.

## Pattern 12 — AI Insight Card (Plain English Recommendation)

- **Source**: Improvado 2026 AI dashboards · ThoughtSpot AI dashboards 2026 enterprise guide · Spinta Digital predictive analytics · DiligenceVault
- **Use case heuresys**: card dedicata "AI Suggerisce" persistente in HR Director cockpit: 1-3 insight ranked priority generati da `lib/ai/insights.ts` (da scrivere) che leggono mat views + employee_journey table. Esempio: "3 candidati Senior Risk Analyst potrebbero coprire ruolo scoperto Head of Compliance — promo internal entro Q3 stima cost saving €180k vs external hire". Plain Italian, 1-2 frasi max, sempre con CTA "Apri scenario" + "Dismiss".
- **Anti-pattern risk**: AI insight verbose 4-paragrafi technical. "Confidence score 0.73 model v2.1" exposed senza beneficio per HR Director non-data-scientist.

## Pattern 13 — Drill-Down Detail Panel (Slide-Over, Not Page Navigation)

- **Source**: Linear ENG-2703 pattern · Stripe drill flows · Airtable row expand
- **Use case heuresys**: click employee in TalentPool table → side panel slide-over (480-600px) con tab interne (Profile · Performance · Skills · 9-box · Compensation). MAI navigate-away verso `/employees/[id]`. Side panel ESC dismiss, X close, keyboard arrow up/down per scroll lista mantenendo panel.
- **Anti-pattern risk**: click row → full page navigation → user perde filter/sort state → back button → re-apply filter. 6-click ping-pong tra lista e detail.

## Pattern 14 — Tab Views per Multi-Perspective Same Entity

- **Source**: Splunk Dashboard Studio · Airtable tab views · Setproduct tabs UI · designmonks nested tabs
- **Use case heuresys**: route `/dashboard` G6 preset HR Director già usa concept presets. Estendere a tab interne per perspective swap senza route change: Tab "Strategic" (esecutivo) · "Operational" (manager) · "Analytical" (deep dive). Within preset, tab nested per dimensione (es. Talent Pipeline → tab Recruiting / Onboarding / 9-box / Mobility). Nested tab pattern: max 2 livelli.
- **Anti-pattern risk**: tab orizzontale con 9 voci scrolling. Tab nested 3+ livelli (perdita orientation).

## Pattern 15 — Org Chart Tree + Network View Switchable

- **Source**: yWorks org viz · OrgChart 2026 research · Ingentis · Venngage 2026 examples
- **Use case heuresys**: route `/explorer` (capability_graph preset) deve supportare 2 layout switchable: (a) classic tree hierarchical top-down per reporting line; (b) network/force-directed per skill cluster / cross-functional collab. Stesso underlying data (OPOURSKA ontology), 2 rendering. Click node → drill panel pattern 13.
- **Anti-pattern risk**: solo tree statico immagine. Network view senza filter (3000 nodi unreadable).

## Pattern 16 — 9-Box Matrix Performance × Potential (Talent Calibration)

- **Source**: Leapsome 9-box · AIHR 9-box · Creately calibration framework · emPerform succession
- **Use case heuresys**: route `/talent-pipeline` (employee_journey preset) include vista 9-box matrice 3×3 (Performance asse Y, Potential asse X). Dot/avatar in cell, drag-and-drop per recalibration (HR_MANAGER+ role only). Hover dot → tooltip employee + "Ready Now / 1-2 year / 3+ year". Color-coded cells: hi-hi verde, lo-lo rosso. Pattern legacy ma altamente leggibile per board/CHRO presentation.
- **Anti-pattern risk**: 9-box come unica vista talent (oversimplification — già criticata 2025+ literature, va integrato con skill graph + tenure + market scarcity).

## Pattern 17 — Status Pills + Semantic Color (Consistent Across App)

- **Source**: Linear status badges · Vercel deployment status · Mobbin chips · existing heuresys pills
- **Use case heuresys**: definire 6 status semantic tokens canonical: success (verde 7:1 contrast) · warning (orange) · danger (red) · info (blue) · neutral (gray) · ai-suggested (purple accent — match baseline palette). Pills usate per: contract type, risk level, hiring stage, performance rating, learning completion. Mai colore decorative random.
- **Anti-pattern risk**: orange = warning in pagina A ma = "in progress" in pagina B. Color senza icon fallback (color-blind a11y fail).

## Pattern 18 — Activity Feed / Audit Timeline Persistent Right-Rail

- **Source**: Vercel activity feed · Linear comments · audit_logs heuresys exists
- **Use case heuresys**: right-rail 320px collapsible mostra audit timeline live: "Mario Rossi promoted to Senior Risk Analyst by HR Manager 12:34" · "AI flagged 3 attrition risks 11:00" · "Backup completed 04:00 UTC". Filter by entity. Sfrutta `audit_logs` table esistente (P4). Right-rail toggle Cmd+. shortcut.
- **Anti-pattern risk**: timeline 500 row senza filter (noise). Timeline persistent ma su mobile mangia 100% width (deve essere drawer su <1024px).

## Pattern 19 — Predictive Forecast Overlay (Past Solid + Future Dashed)

- **Source**: Spinta Digital 2026 predictive · Inforiver · DiligenceVault 5 AI dashboards 2026
- **Use case heuresys**: line chart trend (headcount over time, training completion, attrition rate) deve includere overlay forecast: solid line passato (12 mesi), dashed line forecast (3-6 mesi) con confidence band shaded. Generato da query `lib/forecast/*.ts` (da scrivere) usando time-series su mat views. Banking context: forecast attrition critical (regulatory compliance staff requirement).
- **Anti-pattern risk**: solo storico senza forecast → reactive dashboard. Forecast esposto senza confidence band → false precision (banking auditor lo segnala).

## Pattern 20 — Calm Density: Whitespace Strategico + Saturated Accents

- **Source**: SaaSUI Calm Minimalism · NN/g cognitive load · Eleken fintech trust patterns 2026
- **Use case heuresys**: NON è "spacious airy marketing site" né "Bloomberg terminal industrial". Calm density: whitespace generoso tra section group (32-48px), denso entro card (12-16px), accent colors saturated solo su action/critical (brand blue su primary CTA, purple su AI insight, red su danger only). Risultato: HR Director può scan dashboard in <10s e identificare le 3 cose critiche del giorno.
- **Anti-pattern risk**: Bloomberg-like 80% screen colored cells (overwhelming, non-investor-ready). Marketing-page airy con 5 KPI in 1920×1080 (waste of screen, non-cockpit).

---

## Synthesis — Direzione Visuale Emergente

Il pattern dominante che emerge consolidando i 20 trend è **"Calm Cockpit Decisionale"**: dark mode default con palette saturated brand-controlled (la baseline μ-architect-legacy navy + brand-blue + purple-accent è già allineata), sidebar persistent 240-260px + command palette Cmd+K, layout 40-30-20-10 con KPI hero + sparkline trend + AI-generated insight narrative, drill-down via slide-over panel (non page nav), monospace tabular numerals per data scan, status pills semantically consistent, skeleton shimmer structure-aware per async load, predictive forecast overlay con confidence band. La spina dorsale è progressive disclosure (5-7 chunks, NN/g working memory) accoppiata a role-based experience (già shipped via G6 preset \_v2). L'investor-ready feeling viene dal contrasto tra calm minimalism strategico (HR Director vede 3 decisioni, non 30 numeri) e data fidelity industrial (tabular figures, sparkline accurate, forecast con confidence band, audit trail live). Niente Bloomberg terminal aggression, niente marketing-airy waste — un Linear-meets-Stripe-meets-Visier focalizzato su workforce intelligence banking-grade.

---

## Sources

### Trend research

- [7 SaaS UI Design Trends in 2026](https://www.saasui.design/blog/7-saas-ui-design-trends-2026)
- [Top 15 B2B SaaS Dashboard Design Examples 2026 — Orbix](https://www.orbix.studio/blogs/b2b-saas-dashboard-design-examples)
- [Smart SaaS Dashboard Design Guide 2026 — F1Studioz](https://f1studioz.com/blog/smart-saas-dashboard-design/)
- [Dashboard Design 2026 Do's and Don'ts — think.design](https://think.design/blog/dashboard-design-in-2026-dos-and-donts/)
- [SaaS Design Trends 2026 — DesignStudioUIUX](https://www.designstudiouiux.com/blog/top-saas-design-trends/)
- [Enterprise UI Design 2026 — Hashbyt](https://hashbyt.com/blog/enterprise-ui-design)
- [60+ Best Dashboards Design Ideas 2026 — Muz.li](https://muz.li/inspiration/dashboard-inspiration/)
- [50 Best Dashboard Design Examples 2026 — Muz.li](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/)

### HR / workforce / banking

- [Visier Workforce AI](https://www.visier.com/)
- [Workforce Analytics Tools 2026 — HireBorderless](https://www.hireborderless.com/post/best-workforce-analytics-tools)
- [HRM Dashboard Workforce 2026 — Multipurposethemes](https://multipurposethemes.com/blog/hrm-dashboard-for-efficient-workforce-management-in-2026-job-portals/)
- [Fintech Banking Dashboard 2026 — AdminLTE](https://adminlte.io/blog/fintech-banking-dashboard-templates/)
- [Fintech Design Trust Patterns 2026 — Eleken](https://www.eleken.co/blog-posts/modern-fintech-design-guide)
- [Banking App Design 2026 — Purrweb](https://www.purrweb.com/blog/banking-app-design/)
- [9-Box Grid Practical Guide — Leapsome](https://www.leapsome.com/blog/9-box-grid)
- [9 Box Talent Calibration — Creately](https://creately.com/guides/9-box-talent-review/)
- [Org Chart Visualization — yWorks](https://www.yworks.com/pages/organization-chart-visualization)

### Pattern primitives

- [Progressive Disclosure — NN/g](https://www.nngroup.com/articles/progressive-disclosure/)
- [Progressive Disclosure Playbook — Pixxen](https://pixxen.com/progressive-disclosure-saas/)
- [Skeleton Screens 101 — NN/g](https://www.nngroup.com/articles/skeleton-screens/)
- [Empty States — Carbon Design System](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- [Empty State Examples — Pencil & Paper](https://www.pencilandpaper.io/articles/empty-states)
- [Filters Design Guidelines — PatternFly](https://www.patternfly.org/patterns/filters/design-guidelines/)
- [15 Filter UI Patterns 2026 — BricxLabs](https://bricxlabs.com/blogs/universal-search-and-filters-ui)
- [Command Palette UI — Mobbin](https://mobbin.com/glossary/command-palette)
- [Tabs UX — Eleken](https://www.eleken.co/blog-posts/tabs-ux)
- [Tab Design Guide — Lollypop](https://lollypop.design/blog/2025/december/tabs-design/)
- [KPI Card Best Practices — Tabular Editor](https://tabulareditor.com/blog/kpi-card-best-practices-dashboard-design)
- [Power BI KPI Visuals 2026 — EPCGroup](https://www.epcgroup.net/power-bi-kpi-visuals-dashboard-guide-2026)
- [12 Dashboard Layout Patterns — datawirefra.me](https://www.datawirefra.me/blog/dashboard-layout-patterns)
- [Best Fonts Dense Dashboards — FontAlternatives](https://fontalternatives.com/blog/best-fonts-dense-dashboards/)
- [Best Fonts Financial Reporting — Inforiver](https://inforiver.com/blog/general/best-fonts-financial-reporting/)
- [Color Contrast WCAG 2026 — WebAbility](https://www.webability.io/blog/color-contrast-for-accessibility)
- [Engineering Color & Contrast WCAG 2.2 APCA 2026 — Humbl Design](https://humbldesign.io/blog-posts/color-accessibility-guide-wcag)
- [Dark Mode Dashboard Principles — Qodequay](https://www.qodequay.com/dark-mode-dashboards)
- [AI Performance Analytics 2026 — Spinta Digital](https://spintadigital.com/blog/ai-predictive-analytics-2026/)
- [AI Dashboards Enterprise Guide — ThoughtSpot](https://www.thoughtspot.com/data-trends/dashboard/ai-dashboard)
- [5 AI Dashboards 2026 — DiligenceVault](https://diligencevault.com/5-ai-powered-diligence-dashboards-2026/)
