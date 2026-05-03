import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoPlayer } from './video-player';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Media/VideoPlayer',
  component: VideoPlayer,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof VideoPlayer>;

export const Default: Story = {
  args: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://picsum.photos/seed/poster/800/450',
    ariaLabel: 'Sample video',
  },
};

export const WithChapters: Story = {
  args: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    chapters: [
      { start: 0, title: 'Intro' },
      { start: 3, title: 'Action' },
      { start: 6, title: 'Outro' },
    ],
  },
};
