import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Brand/Motion/Library (S48) — demonstrates the production motion library
 * extracted from .ux-design/04-motion-language/motion-final.md.
 *
 * The utility classes shown here ARE the CSS shipped in
 * services/app/src/styles/motion.css (S48 Stage C). This story embeds
 * them inline as <style> so Storybook can render them without coupling
 * to the services/app build.
 */

const MOTION_CSS = `
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-instant: 100ms;
  --dur-fast: 150ms;
  --dur-standard: 300ms;
  --dur-slow: 600ms;
  --dur-chart: 200ms;
  --dur-loop-glow: 4s;
  --accent: #aab5f7;
  --primary: #3b82f6;
  --surface-2: #1a1a2a;
  --surface-3: #22223a;
  --ink: #f5f6fa;
  --rule: #25262d;
}
@keyframes wordmark-glow-breathing {
  0%, 100% { filter: drop-shadow(0 0 0.6rem rgba(168, 85, 247, 0.20)); }
  50%      { filter: drop-shadow(0 0 1.2rem rgba(168, 85, 247, 0.35)); }
}
@keyframes skeleton-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.motion-wordmark-glow { animation: wordmark-glow-breathing var(--dur-loop-glow) var(--ease-in-out) infinite; }
.motion-button-press { transition: transform var(--dur-instant) var(--ease-in-out); }
.motion-button-press:active { transform: scale(0.97); }
.motion-card-lift { transition: transform var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out); }
.motion-card-lift:hover { transform: translateY(-2px); border-color: var(--accent); }
.motion-skeleton {
  background: linear-gradient(90deg, var(--surface-2) 0%, var(--surface-3) 50%, var(--surface-2) 100%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s linear infinite;
  opacity: 0.6;
}
@media (prefers-reduced-motion: reduce) {
  .motion-wordmark-glow, .motion-skeleton { animation: none !important; }
}
`;

function MotionShowcase() {
  return (
    <div
      style={{
        background: 'var(--surface-2, #1a1a2a)',
        color: 'var(--ink, #f5f6fa)',
        padding: '2rem',
        borderRadius: 10,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS }} />
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontFamily: "'Exo 2', sans-serif", fontWeight: 600 }}>
          Motion library — production (S48 Stage C)
        </h2>
        <p style={{ color: '#c8ccd6', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          SoT: <code>.ux-design/04-motion-language/motion-final.md</code> · Shipped:{' '}
          <code>services/app/src/styles/motion.css</code> + <code>src/lib/motion/variants.ts</code>
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <DemoCard
          name=".motion-wordmark-glow"
          desc="Hero wordmark breathing — 4s loop, ease-in-out"
        >
          <div
            className="motion-wordmark-glow"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontWeight: 700,
              fontSize: '2.5rem',
              color: 'var(--primary, #3b82f6)',
            }}
          >
            heures<span style={{ color: 'var(--accent, #aab5f7)' }}>y</span>s
          </div>
        </DemoCard>

        <DemoCard name=".motion-button-press" desc="Tactile press feedback — scale 0.97 (100ms)">
          <button
            type="button"
            className="motion-button-press"
            style={{
              height: 44,
              padding: '0 1.25rem',
              borderRadius: 6,
              background: 'var(--primary, #3b82f6)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Press me
          </button>
        </DemoCard>

        <DemoCard
          name=".motion-card-lift"
          desc="Hover lift — translateY -2px + accent border (150ms)"
        >
          <div
            className="motion-card-lift"
            style={{
              padding: '1rem',
              border: '1px solid var(--rule, #25262d)',
              borderRadius: 6,
              background: 'var(--surface-3, #22223a)',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Hover this card
          </div>
        </DemoCard>

        <DemoCard name=".motion-skeleton" desc="Loading shimmer — 1.5s linear infinite">
          <div
            className="motion-skeleton"
            style={{
              height: 16,
              width: '100%',
              borderRadius: 4,
              marginBottom: '0.5rem',
            }}
          />
          <div className="motion-skeleton" style={{ height: 16, width: '80%', borderRadius: 4 }} />
        </DemoCard>
      </div>

      <footer
        style={{
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--rule, #25262d)',
          fontSize: '0.825rem',
          color: '#9da0aa',
        }}
      >
        <p style={{ margin: 0 }}>
          Complementary Framer Motion variants in <code>src/lib/motion/variants.ts</code>:{' '}
          <code>scrollRevealVariants</code>, <code>cardLiftVariants</code>,{' '}
          <code>modalVariants</code>, <code>toastVariants</code>.
        </p>
        <p style={{ margin: '0.5rem 0 0' }}>
          All patterns respect <code>prefers-reduced-motion: reduce</code> per WCAG 2.2 AAA.
        </p>
      </footer>
    </div>
  );
}

function DemoCard({
  name,
  desc,
  children,
}: {
  name: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: '1.5rem',
        background: 'var(--surface-3, #22223a)',
        border: '1px solid var(--rule, #25262d)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div>
        <code
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.825rem',
            color: 'var(--accent, #aab5f7)',
          }}
        >
          {name}
        </code>
        <p
          style={{
            margin: '0.25rem 0 0',
            fontSize: '0.8rem',
            color: '#c8ccd6',
          }}
        >
          {desc}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 80,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const meta: Meta<typeof MotionShowcase> = {
  title: 'Brand/Motion/Library (S48)',
  component: MotionShowcase,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof MotionShowcase>;

export const Production: Story = {};
