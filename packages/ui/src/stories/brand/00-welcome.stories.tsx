import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownView } from '../../components/markdown/markdown-view';

const WELCOME = `# Brand identity workstream — Storybook view

Questa sezione espone tutto il materiale del workstream brand identity Heuresys (\`.ux-design/\`) come **read-only viewer** dentro Storybook, senza promuoverlo a code production.

## Cos'è \`.ux-design/\`

Sandbox segregato dove vengono costruiti collaborativamente: brand foundations, aesthetic direction, logo, palette, typography, motion language, dashboard mockup, brand book v0.

**Policy**:

- Nessun import JS da \`.ux-design/\` in \`packages/\`, \`services/\`, \`apps/\`
- Nessuna build pipeline \`.ux-design/\` (escluso da typecheck/test/build)
- Promozione a v1.0 = decisione esplicita di Enzo (Phase 13 promotion checklist)

## Come funziona questa integrazione

\`packages/ui/.storybook/main.ts\` aggiunge \`.ux-design/\` come \`staticDirs\` montato su \`/ux-design/*\`. Le stories qui sotto:

- **\`<UxFrame>\`** → embed via \`<iframe>\` di file HTML (mockup, direzioni, motion prototype, dashboard, pairing typography)
- **\`<UxAsset>\`** → embed via \`<img>\` di file SVG (logo)
- **\`<UxMarkdownDoc>\`** → fetch + render con \`react-markdown\` di file \`.md\` (foundations, palette, typography, motion, samples)
- **Componenti React custom** → palette swatches OKLCH, typography specimen

Edit a un file \`.ux-design/...\` → refresh Storybook → cambio visibile. Sorgente unica, zero duplicazione.

## Sezioni in sidebar

| Categoria | Stories |
|---|---|
| Foundations / Strategy | 4 (brand-foundations, voice-tone, audience-positioning, dashboard-architecture) |
| Foundations / Personas | 4 (HR Director, IT Admin, Line Manager, Employee) |
| Aesthetic / Docs | 4 (heuresys-current-style, moodboard, direction-final, logo-standard) |
| Aesthetic / Critiques | 4 (iota, kappa, lambda, mu-data-dense) |
| Aesthetic / Direction Explorations | 35 (5 set × 4 + index + Set 5 Legacy ×2 + Legacy Overlay ×15) |
| Visual Identity / Logo | 6 (wordmark, monochrome dark/light, mark, favicon, og-image) |
| Visual Identity / Palette | 5 swatches React (brand inviolabili, dark, light, capability, gradient) + 2 docs |
| Visual Identity / Typography | 3 specimen React (Exo 2, Inter, JetBrains Mono) + 2 pairings + 2 docs |
| Motion | 6 prototypes + 1 doc |
| Dashboards (Phase 9) | 6 (5 surface + index) |
| Icon Libraries | 1 |
| 99-Samples | 1 README + 8 frameworks + 6 prompts + 12 voltagent + 1 recipe |

**Totale**: ~110 stories renderizzate.

## Riferimenti

- Project root: \`.ux-design/README.md\` — policy + struttura
- SoT stato corrente: \`.ux-design/BRAND-STATE.md\`
- Cronologia decisioni: \`.ux-design/DECISIONS-LOG.md\`
- Resume protocol: \`.ux-design/SESSION-RESUME.md\`
`;

function Welcome() {
  return <MarkdownView content={WELCOME} />;
}

const meta: Meta<typeof Welcome> = {
  title: 'Brand/Welcome',
  component: Welcome,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Welcome>;

export const Overview: Story = {};
