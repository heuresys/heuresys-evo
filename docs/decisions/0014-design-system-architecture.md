# ADR-0014: Design system architecture (Radix + CVA + Tailwind 4 tokens)

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B6/B7

## Context

Direttiva Enzo (§1.1 roadmap):

> «UI ricchissima di strumenti e opzioni per creare interfacce wow con tutte le metodologie e i design più moderni e raffinati.»

Pre-B7 il `packages/ui` ha 3 dipendenze Radix totali e nessun componente real. Il design system deve essere espanso per coprire i pattern critici di un HRMS enterprise (data tables, charts, graph viz, command palette, forms, motion, dark mode).

Forces:

- **A11y first**: SR/keyboard support obbligatorio (WCAG 2.1 AA target).
- **Composition over inheritance**: shadcn/ui-like — copy-paste primitives, no nascosto magic.
- **Type-safe variants**: CVA + clsx + tailwind-merge per varianti dichiarative.
- **Server Components compat**: nessuna lib che richiede browser-only API senza wrapping client island.
- **Bundle size**: tree-shakeable, no monolith bundles forced.
- **Visual richness**: motion, transizioni, microinteractions integrati come prima classe.
- **Performance**: virtual scrolling per tabelle/grafi, lazy loading, RSC streaming.

## Decision

**Stack stratificato a 6 layer**:

### Layer 1 — Theme tokens (Tailwind 4 CSS-first)

- `packages/ui/src/styles/tokens.css` come SoT
- Colori in OKLCH (perceptual uniformity, future-proof per HDR)
- Semantic naming: `background`, `foreground`, `primary`, `primary-fg`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`
- Tipografia fluid (clamp) — sans, serif, mono famiglie
- Motion duration + easing tokens
- Light + Dark + Brand variants via CSS custom properties

### Layer 2 — Primitives (Radix UI + headless wrappers)

Ogni primitivo è wrapped in `packages/ui/src/components/<name>/`:

| Primitivo                                      | Radix package                                        | Variants (CVA)                                                        |
| ---------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| Button                                         | (none)                                               | default/destructive/outline/secondary/ghost/link × sm/default/lg/icon |
| Dialog, AlertDialog                            | `@radix-ui/react-dialog`, `react-alert-dialog`       | size + scrollable                                                     |
| Dropdown, Context                              | `react-dropdown-menu`, `react-context-menu`          | aligned                                                               |
| Popover, Tooltip, HoverCard                    | `react-popover`, `react-tooltip`, `react-hover-card` | side+align                                                            |
| Tabs, Accordion, Collapsible                   | `react-tabs`, `react-accordion`, `react-collapsible` | orientation                                                           |
| Select, Combobox                               | `react-select` + `cmdk`                              | search                                                                |
| Checkbox, RadioGroup, Switch, Slider, Progress | Radix                                                | —                                                                     |
| Form (rhf), Label, Input, Textarea             | react-hook-form + Radix                              | error states                                                          |
| Toast                                          | sonner                                               | type variants                                                         |
| NavigationMenu, Menubar                        | Radix + custom Sidebar                               | —                                                                     |
| DatePicker, Calendar                           | React Aria Components + Radix Popover                | range                                                                 |

### Layer 3 — Patterns (composizioni complesse)

- **DataTable**: TanStack Table 8 + Virtual 3 + Query 5 (sorting, filter, pagination, virtual scroll)
- **Charts**: ECharts 5 wrapped (`echarts-for-react`) — Line, Bar, Pie, Heatmap, Sankey, Treemap
- **Specialized viz**: Visx (D3 + React) — SunburstChart, ForceDirected, RadialTree
- **Graph viz**: Cytoscape.js wrapper — `<GraphView>` per ESCO Knowledge Graph
- **Process/flow**: React Flow 12 (xyflow) — `<ProcessDiagram>`, `<BlueprintCanvas>`
- **CommandPalette**: cmdk — Cmd+K UX con providers pluggable
- **Drawer mobile**: Vaul — bottom sheet iOS-style
- **DateRangePicker**: React Aria + Radix Popover

### Layer 4 — Layout primitives (every-layout style)

`Stack`, `Cluster`, `Switcher`, `Cover`, `Center`, `Grid`, `Frame`, `Sidebar` — tutti via CSS-only props (no JS), composable senza nesting eccessivo.

### Layer 5 — States patterns

`Skeleton`, `Spinner`, `ProgressBar`, `ShimmerCard` (loading)
`EmptyState`, `ErrorState`, `NoResults` (empty + error)
`Avatar`, `AvatarGroup`, `Badge`, `Chip`, `Tag` (compact)
`Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` (container)

### Layer 6 — Motion design

Framer Motion 11 wrappers:

- `<FadeIn>`, `<SlideIn>`, `<ScaleIn>`, `<StaggerChildren>` — primitivi
- Page transitions via `<AnimatePresence>` integration
- Scroll-driven animations via Motion's `useScroll`/`useTransform`
- Reduced motion respect via `prefers-reduced-motion` media query

## Style API contract

Composition pattern:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@heuresys/ui/lib/utils'; // clsx + tailwind-merge

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: { default: 'bg-primary text-primary-fg hover:bg-primary/90' /* ... */ },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
```

## Alternatives considered

- **Mantine / Chakra UI / MUI** (full library): rejected — ridotta libertà di customization, bundle size, non favorisce composition shadcn-style.
- **Headless UI (Tailwind Labs)**: ottima per primitives ma copre meno casi rispetto a Radix; rejected come SoT, conservato come fallback per casi specifici.
- **Aria React Components solo**: a11y eccellente ma DX più complessa; usato selettivamente per DatePicker/ComboBox.
- **React Spring invece di Framer Motion**: rejected — Framer Motion 11 (motion.dev) è de facto standard React e più ergonomico.
- **D3 puro vs Visx**: rejected D3 puro — imperative API mal si sposa con React; Visx fornisce wrappers React mantenendo accesso D3.
- **Recharts vs ECharts**: rejected Recharts — ECharts è feature-complete (Sankey, Treemap, Heatmap già pronti).

## Consequences

Positive:

- **Surface ricchissima**: 30+ componenti ready-to-use, copre 90% dei pattern HRMS enterprise.
- **A11y baked-in**: Radix forza ARIA + keyboard, axe testing in B8.
- **Type-safe**: CVA variants + VariantProps generano tipi TS automatici.
- **Theming dinamico**: dark mode + brand variants via tokens.css, runtime switch via ThemeProvider.
- **Tree-shakeable**: ogni componente independent export.

Negative:

- **Dep count alto**: ~25 nuove dipendenze in `packages/ui` post-B7. Mitigato da pinning esatto (B1.9) e dependabot grouping (B10.6).
- **Curva apprendimento Radix**: developer nuovi al team devono imparare il pattern primitive-wrap-with-variants. Docs di onboarding (B6.12) coprono.
- **Bundle size services/app**: monitorato via budget B12.5 (< 500KB initial JS). Ogni componente non importato non finisce nel bundle.
- **Storybook stories obbligatorie**: ogni componente pubblico → ≥ 1 story in B8. Effort gestibile (~2gg).

## Open questions (deferred)

- **Iconography tier-2**: Lucide React come default (1500+ icons). Eventuale aggiunta Phosphor/Heroicons valutata case-by-case.
- **Form schema source**: react-hook-form + Zod resolver è confermato; sharing schemas con `packages/shared` pattern da raffinare in B7.12.
- **Internationalization**: RTL support garantito a livello CSS via `[dir="rtl"]` selectors; libreria i18n out-of-scope Cantiere B (vedi §25 OOS).

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §12 Phase B7
- shadcn/ui pattern: https://ui.shadcn.com
- Radix UI primitives: https://www.radix-ui.com/primitives
- Tailwind CSS v4 @theme: https://tailwindcss.com/docs/v4-beta
- TanStack Table: https://tanstack.com/table
- Visx: https://airbnb.io/visx
- Cytoscape.js: https://js.cytoscape.org
- React Flow / xyflow: https://reactflow.dev
- ECharts: https://echarts.apache.org
- Framer Motion: https://motion.dev
- React Aria Components: https://react-spectrum.adobe.com/react-aria/components.html
