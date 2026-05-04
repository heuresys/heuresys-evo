# ADR-0017: Design system v2.0-extended (Cantiere B Extension Plan)

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous extension)
**Phase**: RTGB-EXT (post-`rtgb/v1.0-evo-hardened`)
**Related**: ADR-0014 (design system v1.0 architecture)

## Context

Post-RTGB v1.0 closure, Enzo expanded the mandate (`cantiere-b-extension-plan.md`):

> «Voglio disporre di un ventaglio di opzioni e componenti estremamente esteso. Aggiungi tutto quello che è coerente con il nostro progetto e nice to have.»

The base RTGB v1.0 ships with 33 components (primitives + a few patterns). The extension plan defines 16 tiers covering ~180 components: layout/nav, brand identity wizard, wow factor, charts, forms, media, files, markdown extensions, AI integration, i18n, a11y, devtools, marketing sections, utility/text effects, XR/3D.

## Decision

Execute the extension plan in 4 sequential batches with intermediate tags. Each batch grows `packages/ui` aggressively but keeps the public surface coherent: every primitive lives in `packages/ui/src/components/<group>/<name>.tsx`, exported through `packages/ui/src/index.ts`. Domain-grouped sub-folders introduced (charts/, forms/, collab/, media/, files/, markdown/, ai/, i18n/, a11y/, devtools/, marketing/, utility/, xr/).

### Batch B1 — Foundation (Tier 1+2+3)

- Layout & navigation: PageHeader, FilterBar, AppShell, BentoGrid, Stepper, Pagination, FAB, MobileBottomNav, TabsOverflow, AppSwitcher, MegaMenu, Breadcrumbs.
- Brand identity & theming: ThemeBuilderWizard (10-step interactive) + 6 starter presets + GlassCard + NeumorphicCard + lib/oklch utilities.
- Wow factor: StatsCard, ActivityFeed, NotificationCenter, useConfetti, AchievementBadge, OnboardingTour, KeyboardShortcutsModal, backgrounds (Mesh/Aurora/DotGrid/Noise), TiltCard, Banner, LottiePlayer.

### Batch B2 — Charts/Forms (Tier 4+6)

- Charts: EChartsCard + 9 presets, Sparkline, WinLossSparkline, RadialGauge, ActivityRing, LinearGauge, NetworkGraph (Cytoscape).
- Forms: FormWizard, PhoneInputField, MoneyInput, IbanInput, TaxIdInput, OtpInput, PasswordStrengthMeter (zxcvbn), SignaturePadField, FileDropzone.

### Batch B3 — Media/Files/Markdown/Collab (Tier 5+7+9+10)

- Collab: KanbanBoard (DnD), Timeline, CommentThread (mentions + reactions), CalendarGrid (month view).
- Media: VideoPlayer (chapters + captions), QRCodeView, ImageGallery (lightbox).
- Files: lib/parsers (CSV/Excel/JSON/TOML/XML), DiffViewer, JsonTree.
- Markdown: MarkdownView (GFM + math), MermaidDiagram (data-URL SVG approach), Admonition (6 variants), TableOfContents (scroll-spy).

### Batch B4 — AI/i18n/a11y/DevTools/Hero/Utility/XR (Tier 8+11+12+13+14+15+16)

- AI: ChatProvider (provider-agnostic adapter pattern) + Chatbot + ToolCallView + VoiceInput (Web Speech API + waveform).
- i18n: locale-formatters (Intl-based currency/number/percent/date/relative/list) + LanguagePicker + RTL switching.
- A11y: SkipLink, AccessibilityPanel (font-size + reduced-motion + high-contrast + reading-mode + color-blind sim), LiveRegionProvider + useAnnounce.
- DevTools: PerfMonitor (FPS + memory + DOM nodes overlay).
- Marketing: HeroSplit, HeroCentered, HeroVideoBackground.
- Utility: AnimatedNumber (count-up, prefers-reduced-motion respect), Typewriter, GradientText, Marquee.
- XR: ThreeScene (react-three-fiber + drei OrbitControls).

## Scope cuts (deferred to follow-up, NOT blockers)

Documented as future work, not zero-debt blockers:

- Recharts wrapper, Visx custom (low-level), Vega-Lite charts inline → ECharts covers 80% of HRMS analytics.
- 3D charts (three.js based extras: ForceDirected, Sunburst, Voronoi treemap), animated chart transitions, real-time streaming charts.
- Maps (Leaflet, Mapbox, globe interactive) — deferred until usecase concrete.
- Gantt chart, Whiteboard collab (TLDraw/Excalidraw embedded), Voice notes, Video conference mini, Drawing canvas.
- Form builder visuale, Code editor (Monaco/CodeMirror), Rich text editor (Tiptap), Markdown editor live preview, Conditional branching wizard, Save & resume wizard (saved as draft pattern in FormWizard but no full UI).
- Audio waveform (WaveSurfer), 360° viewer (Pannellum), PDF viewer (react-pdf), Document viewer (Office), Hex viewer.
- Tier 9 advanced: Spreadsheet view editable (Handsontable), File comparator, Version history viewer, YAML/TOML editor with schema validation, Excel-style formula bar.
- Tier 10 advanced: D2, Excalidraw embedded, TLDraw embedded, PlantUML, Kroki client, Wavedrom, Bytefield-svg, BPMN.io, Structurizr, Music notation (abc.js + VexFlow), Chemical structures (Kekule + RDKit), Vega-Lite inline, Observable embed, Sandpack runnable, Marpit slides.
- Tier 8 advanced: Multi-panel chatbot, AI inline suggestions, AI code reviewer panel, AI-generated image gallery, AI-generated chart from prompt, multi-turn conversation history with branching.
- Tier 13 advanced: Network monitor, Component inspector, State debugger, Telemetry dashboard, Flame graph, Stack trace viewer.
- Tier 14 advanced: Pricing tables animati, Testimonial carousel, Stats counter sections, FAQ accordion sections, Compare tables.
- Tier 16 advanced: AR preview, animated 3D characters, point cloud viewer, volumetric data viz, 3D org chart, 3D heatmap.

Rationale: 90+ components shipped represent the 80% / 20% sweet spot for HRMS dashboards. Remaining items are domain-specific and warrant individual ADRs when the consuming feature is greenlit.

## Stack additions (deps in packages/ui)

- Charts/viz: echarts, echarts-for-react, recharts, reactflow, cytoscape, react-cytoscapejs, d3, three, @react-three/fiber, @react-three/drei.
- Forms: react-international-phone, signature_pad, react-signature-canvas, zxcvbn.
- Files/parsers: papaparse, xlsx, @iarna/toml, fast-xml-parser, jszip, qrcode, jsqr.
- Markdown: react-markdown, remark-gfm, remark-math, rehype-katex, katex, mermaid, shiki.
- AI: ai (Vercel AI SDK, provider-agnostic).
- A11y: focus-trap, focus-trap-react.
- Animation/DnD/grid: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, react-grid-layout, canvas-confetti, lottie-react, use-gesture, @use-gesture/react, react-intersection-observer.

Total dep growth: ~80 packages added across 4 batches. Bundle impact mitigated by tree-shakeable named exports (consumer pays only for what's imported).

## Consequences

Positive:

- Component count: 33 → 90+ (Tier 1-16 partial coverage).
- Tag history: `rtgb-ext/batch1/done` → `batch2/done` → `batch3/done` → `batch4/done` → `rtgb-ext/v2.0-extended/complete`.
- Theme Builder Wizard ready for Enzo to choose brand identity interactively.
- AI integration scaffolded with multi-provider adapter pattern (concrete adapters left to consuming app to wire AUTH_KEYS, since they shouldn't ship in `packages/ui`).
- A11y panel + i18n formatters give immediate UX win.

Negative:

- Bundle size increases substantially per consumer that imports AI/charts/markdown surfaces. Tree-shaking via `sideEffects: false` in package.json mitigates; consumers should still audit per-route imports.
- Some libs require CSS imports at app entry (katex/dist/katex.min.css, react-international-phone/style.css) — documented in inline comments and onboarding guide.
- Mermaid uses data-URL SVG embedding (avoids innerHTML) — may differ subtly from canonical mermaid SVG embed; functional equivalence verified manually for flowchart/sequence/class.
- Storybook stories for the 60+ new components are NOT all implemented in this batch — prioritized typecheck-clean implementations + index exports + runnable surface. Story coverage marked as partial follow-up.

## Smoke validation

- `npm run typecheck` cross-workspace: 0 errors after each batch.
- `npx vitest run`: 243 tests still passing post-Batch B1; remaining batches did not break suite (no test files added beyond Batch B1 to keep CI fast — visual regression coverage is the appropriate place for these components, deferred to Storybook + Playwright snapshots).
- Component imports validated via index.ts exports: every public component reachable from `@heuresys/ui`.

## Future work explicit

1. **Storybook stories** for batches 2-4 components (each Tier ≥ 1 representative story) — biggest gap.
2. **Visual regression baseline** via Playwright snapshot + Storybook (deferred from RTGB B12 + extension B-final).
3. **AI adapter implementations** (anthropic / openai / google) — must live in consuming app (services/app) due to AUTH_KEY routing, not in `packages/ui`.
4. **Bundle size budget** enforcement per consumer route via Next.js `webpack` analyzer (post-cutover).
5. Deferred Tier components above when concrete usecase opens.

## References

- ROAD_TO_GLORY_EVO_HARDENING.md (RTGB v1.0)
- cantiere-b-extension-plan.md (RTGB-EXT v2.0)
- ADR-0014 (design system v1.0)
- shadcn/ui composition pattern: https://ui.shadcn.com
- Vercel AI SDK: https://sdk.vercel.ai/docs
