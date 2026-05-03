import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiveRegionProvider, useAnnounce } from './live-region';
import { Button } from '../Button';

const meta: Meta<typeof LiveRegionProvider> = {
  title: 'A11y/LiveRegion',
  component: LiveRegionProvider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof LiveRegionProvider>;

function Demo() {
  const announce = useAnnounce();
  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-500">
        Click → screen reader annuncia (sr-only). Open dev tools → Accessibility tree per vedere
        live region.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => announce('File saved successfully')}>
          Polite announce
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => announce('Connection lost!', 'assertive')}
        >
          Assertive
        </Button>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <LiveRegionProvider>
      <Demo />
    </LiveRegionProvider>
  ),
};
