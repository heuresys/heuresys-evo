import type { Meta, StoryObj } from '@storybook/react-vite';
import { LottiePlayer } from './lottie-player';

const meta: Meta<typeof LottiePlayer> = {
  title: 'Components/LottiePlayer',
  component: LottiePlayer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof LottiePlayer>;

// Minimal valid Lottie animation (a circle that scales)
const minimalLottie = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: 'Circle',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'circle',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [50, 50, 100], h: 0 },
            { t: 30, s: [120, 120, 100], h: 0 },
            { t: 60, s: [50, 50, 100], h: 0 },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'el',
          d: 1,
          s: { a: 0, k: [80, 80] },
          p: { a: 0, k: [0, 0] },
          nm: 'Ellipse',
          mn: 'ADBE Vector Shape - Ellipse',
          hd: false,
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.4, 0.6, 1, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: 'Fill 1',
          mn: 'ADBE Vector Graphic - Fill',
          hd: false,
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
};

export const InlineData: Story = {
  args: { data: minimalLottie, ariaLabel: 'Pulsing circle', className: 'h-48 w-48' },
};

export const PlaceholderWhileLoading: Story = {
  args: { src: '/this-does-not-exist.json', ariaLabel: 'Loading…', className: 'h-32 w-32' },
  parameters: {
    docs: {
      description: { story: 'Senza data e con src invalido, mostra placeholder animate-pulse.' },
    },
  },
};
