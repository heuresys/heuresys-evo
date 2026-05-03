import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccessibilityPanel } from './accessibility-panel';

const meta: Meta<typeof AccessibilityPanel> = {
  title: 'A11y/AccessibilityPanel',
  component: AccessibilityPanel,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AccessibilityPanel>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[500px] border rounded p-4 bg-muted/20">
      <p className="text-sm text-neutral-500 mb-3">
        Click bottone in basso a destra per aprire il panel.
      </p>
      <p>Sample content per testare font scaling + high contrast + reading mode.</p>
      <ul className="list-disc pl-5 mt-3 text-sm">
        <li>Use settings toolbar to adjust font size, contrast, motion preferences</li>
        <li>Settings persist in localStorage (key `heuresys-a11y`)</li>
        <li>Color blind sim applies CSS filter to body</li>
      </ul>
      <AccessibilityPanel />
    </div>
  ),
};
