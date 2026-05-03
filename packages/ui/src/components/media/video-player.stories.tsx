import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoPlayer } from './video-player';

/**
 * Auto-generated scaffold story (2026-05-03).
 * TODO: arricchire con props concrete, varianti, play() functions, MSW handlers.
 */
const meta: Meta<typeof VideoPlayer> = {
  title: 'Media/VideoPlayer',
  component: VideoPlayer,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof VideoPlayer>;

export const Default: Story = {};
