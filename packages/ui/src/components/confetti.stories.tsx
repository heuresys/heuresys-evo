import type { Meta, StoryObj } from '@storybook/react-vite';
import { useConfetti, ConfettiButton } from './confetti';
import { Button } from './Button';

const meta: Meta<typeof ConfettiButton> = {
  title: 'Components/Confetti',
  component: ConfettiButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ConfettiButton>;

export const Default: Story = {
  render: () => (
    <ConfettiButton className="rounded-md bg-primary text-primary-fg px-4 py-2 text-sm font-medium hover:opacity-90">
      🎉 Celebrate
    </ConfettiButton>
  ),
};

function FireFromTop() {
  const fire = useConfetti();
  return <Button onClick={() => fire({ origin: { y: 0 } })}>Fire from top</Button>;
}
export const FromTop: Story = { render: () => <FireFromTop /> };

function CornerBlast() {
  const fire = useConfetti();
  const blast = () => {
    fire({ angle: 60, spread: 55, origin: { x: 0, y: 1 }, particleCount: 80 });
    fire({ angle: 120, spread: 55, origin: { x: 1, y: 1 }, particleCount: 80 });
  };
  return <Button onClick={blast}>Both corners</Button>;
}
export const Corners: Story = { render: () => <CornerBlast /> };

function SuccessFlow() {
  const fire = useConfetti();
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        onClick={() => {
          fire({ particleCount: 200, spread: 100 });
        }}
      >
        ✓ Mark task complete
      </Button>
      <p className="text-xs text-neutral-500">
        Pattern: confetti come reward su success completion
      </p>
    </div>
  );
}
export const SuccessReward: Story = { render: () => <SuccessFlow /> };
