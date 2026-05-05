import type { Meta, StoryObj } from '@storybook/react-vite';

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap';

function FontLoader() {
  return <link rel="stylesheet" href={FONT_LINK} />;
}

const meta: Meta = {
  title: 'Brand/Visual Identity/Typography/Specimen',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const ExoTwoWordmark: Story = {
  render: () => (
    <div>
      <FontLoader />
      <h2
        style={{
          fontFamily: 'system-ui',
          fontSize: 14,
          color: '#666',
          marginBottom: 24,
          fontWeight: 600,
        }}
      >
        Exo 2 — Wordmark only (NON usare per altri heading)
      </h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          background: '#0a0e1a',
          padding: 48,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 700,
            fontSize: 88,
            letterSpacing: '-3px',
            lineHeight: 1,
            color: '#fafaf7',
            filter: 'drop-shadow(0 0 60px oklch(0.63 0.26 297 / 0.4))',
          }}
        >
          heures<span style={{ color: '#a855f7', fontWeight: 500 }}>y</span>s
        </div>
        <div
          style={{
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 700,
            fontSize: 64,
            letterSpacing: '-2px',
            lineHeight: 1.05,
            color: '#fafaf7',
          }}
        >
          heures<span style={{ color: '#a855f7', fontWeight: 500 }}>y</span>s
        </div>
        <div
          style={{
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 700,
            fontSize: 48,
            letterSpacing: '-1.5px',
            color: '#fafaf7',
          }}
        >
          heures<span style={{ color: '#a855f7', fontWeight: 500 }}>y</span>s
        </div>
        <div
          style={{
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: '-0.8px',
            color: '#fafaf7',
          }}
        >
          heures<span style={{ color: '#a855f7', fontWeight: 500 }}>y</span>s
        </div>
        <div
          style={{
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '-0.5px',
            color: '#fafaf7',
          }}
        >
          heures<span style={{ color: '#a855f7', fontWeight: 500 }}>y</span>s
        </div>
      </div>
      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: '#fff5f5',
          border: '1px solid #fecaca',
          borderRadius: 8,
          fontSize: 13,
          color: '#991b1b',
        }}
      >
        <strong>Anti-pattern:</strong> NO italic sulla y · NO upper-case · NO weight 200 · NO
        letter-spacing custom su y o adiacenti
      </div>
    </div>
  ),
};

export const InterScale: Story = {
  render: () => (
    <div>
      <FontLoader />
      <h2
        style={{
          fontFamily: 'system-ui',
          fontSize: 14,
          color: '#666',
          marginBottom: 24,
          fontWeight: 600,
        }}
      >
        Inter — Body / heading (tutto il resto)
      </h2>
      <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {[
          {
            size: 88,
            weight: 700,
            ls: '-3px',
            lh: 1,
            label: '88 / 700 / hero gigante landing — --font-hero',
          },
          {
            size: 64,
            weight: 700,
            ls: '-2px',
            lh: 1.05,
            label: '64 / 700 / hero headline marketing — --font-5xl',
          },
          {
            size: 48,
            weight: 700,
            ls: '-1.5px',
            lh: 1.05,
            label: '48 / 700 / hero subhead, KPI gigante — --font-4xl',
          },
          {
            size: 36,
            weight: 700,
            ls: '-1px',
            lh: 1.1,
            label: '36 / 700 / headline grandi, KPI numbers — --font-3xl',
          },
          {
            size: 28,
            weight: 600,
            ls: '-0.8px',
            lh: 1.1,
            label: '28 / 600 / dashboard h1 — --font-2xl',
          },
          {
            size: 22,
            weight: 600,
            ls: '-0.5px',
            lh: 1.2,
            label: '22 / 600 / subhead, dashboard h2 — --font-xl',
          },
          {
            size: 18,
            weight: 500,
            ls: '-0.3px',
            lh: 1.4,
            label: '18 / 500 / body large, deck — --font-lg',
          },
          {
            size: 16,
            weight: 400,
            ls: 'normal',
            lh: 1.5,
            label: '16 / 400 / body default — --font-md',
          },
          {
            size: 14,
            weight: 400,
            ls: 'normal',
            lh: 1.5,
            label: '14 / 400 / button, table cell, form label — --font-base',
          },
          {
            size: 13,
            weight: 400,
            ls: 'normal',
            lh: 1.5,
            label: '13 / 400 / UI labels, sidebar, body small — --font-sm',
          },
          {
            size: 11,
            weight: 600,
            ls: '1.5px',
            lh: 1.4,
            label: '11 / 600 / UPPERCASE breadcrumb, badge — --font-xs',
            upper: true,
          },
        ].map((s) => (
          <div
            key={s.size}
            style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #eee' }}
          >
            <div style={{ fontSize: 11, color: '#888', marginBottom: 8, fontFamily: 'monospace' }}>
              {s.label}
            </div>
            <div
              style={{
                fontSize: s.size,
                fontWeight: s.weight,
                letterSpacing: s.ls,
                lineHeight: s.lh,
                textTransform: s.upper ? 'uppercase' : 'none',
              }}
            >
              The quick brown fox · Heuresys evo · 14.011 capabilities
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const JetBrainsMono: Story = {
  render: () => (
    <div>
      <FontLoader />
      <h2
        style={{
          fontFamily: 'system-ui',
          fontSize: 14,
          color: '#666',
          marginBottom: 24,
          fontWeight: 600,
        }}
      >
        JetBrains Mono — Data / mono (numeri tabular, code, ID, token)
      </h2>
      <div
        style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          background: '#0a0e1a',
          color: '#fafaf7',
          padding: 32,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#888',
            marginBottom: 8,
          }}
        >
          D-001 · TABLES
        </div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
          tenantId: 9f8a7b6c-... | role: HR_DIRECTOR | scope: rtl-bank
        </div>
        <pre style={{ fontSize: 14, lineHeight: 1.5, color: '#a855f7', margin: 0 }}>
          {`const tenant = await prisma.tenant.findFirst({
  where: { id: tenantId },
  include: { users: true },
});`}
        </pre>
        <hr style={{ border: 'none', borderTop: '1px solid #222', margin: '24px 0' }} />
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          14.011 <span style={{ fontSize: 14, color: '#a855f7', fontWeight: 500 }}>+12.3%</span>
        </div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>
          tabular-nums for KPI alignment
        </div>
      </div>
    </div>
  ),
};
