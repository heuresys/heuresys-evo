import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGallery } from './image-gallery';

const meta: Meta<typeof ImageGallery> = {
  title: 'Media/ImageGallery',
  component: ImageGallery,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ImageGallery>;

const images = Array.from({ length: 9 }, (_, i) => ({
  src: `https://picsum.photos/seed/heuresys-${i}/400/300`,
  alt: `Stock ${i + 1}`,
  caption: `Image ${i + 1}`,
}));

export const Three: Story = { args: { images, columns: 3 } };
export const Four: Story = { args: { images, columns: 4 } };
export const Two: Story = { args: { images: images.slice(0, 4), columns: 2 } };
