import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, MessageCircle, Edit, Phone } from 'lucide-react';
import { FAB } from './fab';

const meta: Meta<typeof FAB> = {
  title: 'Components/Fab',
  component: FAB,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left'],
    },
    tone: { control: 'select', options: ['primary', 'secondary', 'accent'] },
  },
};
export default meta;
type Story = StoryObj<typeof FAB>;

const wrapperStyle = 'relative h-[400px] border border-dashed border-border bg-muted/10';

export const Default: Story = {
  args: {
    label: 'Compose',
    icon: <Plus className="h-5 w-5" />,
    position: 'bottom-right',
    tone: 'primary',
  },
  decorators: [
    (S) => (
      <div className={wrapperStyle}>
        <S />
      </div>
    ),
  ],
};

export const Extended: Story = {
  args: {
    label: 'New message',
    icon: <MessageCircle className="h-5 w-5" />,
    extended: true,
    position: 'bottom-right',
  },
  decorators: [
    (S) => (
      <div className={wrapperStyle}>
        <S />
      </div>
    ),
  ],
};

export const Sizes: Story = {
  render: () => (
    <div className={wrapperStyle}>
      <FAB label="SM" size="sm" position="bottom-left" icon={<Plus className="h-4 w-4" />} />
      <FAB label="MD" size="md" position="bottom-center" icon={<Plus className="h-5 w-5" />} />
      <FAB label="LG" size="lg" position="bottom-right" icon={<Plus className="h-6 w-6" />} />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className={wrapperStyle}>
      <FAB
        label="Primary"
        tone="primary"
        position="top-left"
        icon={<Phone className="h-5 w-5" />}
      />
      <FAB
        label="Secondary"
        tone="secondary"
        position="top-right"
        icon={<Edit className="h-5 w-5" />}
      />
      <FAB
        label="Accent"
        tone="accent"
        position="bottom-right"
        icon={<Plus className="h-5 w-5" />}
      />
    </div>
  ),
};
