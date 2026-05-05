import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/Foundations/Personas',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const MariaHRDirector: Story = {
  args: { src: '01-strategy/personas/01-hr-director.md' },
};

export const DavideITAdmin: Story = {
  args: { src: '01-strategy/personas/02-it-admin.md' },
};

export const StefaniaLineManager: Story = {
  args: { src: '01-strategy/personas/03-line-manager.md' },
};

export const AndreaEmployee: Story = {
  args: { src: '01-strategy/personas/04-employee.md' },
};
