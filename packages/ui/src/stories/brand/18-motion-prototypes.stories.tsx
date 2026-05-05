import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Motion/Prototypes',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

const H = '90vh';

export const Index: Story = {
  args: {
    src: '04-motion-language/index.html',
    title: 'Motion language — navigation hub',
    height: H,
  },
};

export const WordmarkGlow: Story = {
  args: {
    src: '04-motion-language/01-wordmark-glow.html',
    title: '01 — Wordmark glow breathing 4s loop ease-in-out',
    height: H,
  },
};

export const GradientTransitions: Story = {
  args: {
    src: '04-motion-language/02-gradient-transitions.html',
    title: '02 — Theme switch dark↔light 200ms ease-out · auto-cycle',
    height: H,
  },
};

export const KgTopologyHover: Story = {
  args: {
    src: '04-motion-language/03-kg-topology-hover.html',
    title: '03 — KG node hover scale + edges focus/blur + tooltip 150ms',
    height: H,
  },
};

export const SparklineAnimate: Story = {
  args: {
    src: '04-motion-language/04-sparkline-animate.html',
    title: '04 — KPI sparkline draw stroke-dashoffset + count-up 200ms',
    height: H,
  },
};

export const ScrollReveals: Story = {
  args: {
    src: '04-motion-language/05-scroll-reveals.html',
    title: '05 — Scroll-triggered opacity+translateY stagger 60ms · one-shot',
    height: H,
  },
};
