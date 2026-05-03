import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Cluster, Center } from './layout-primitives';

const meta: Meta<typeof Stack> = {
  title: 'Components/LayoutPrimitives',
  component: Stack,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Stack>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded border bg-primary/10 p-3 text-sm">{children}</div>
);

export const StackXL: Story = {
  render: () => (
    <Stack gap="xl" className="border border-dashed p-3">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const ClusterDemo: Story = {
  name: 'Cluster',
  render: () => (
    <Cluster gap="md" justify="between" className="border border-dashed p-3">
      <Box>Brand</Box>
      <Cluster gap="sm">
        <Box>Nav 1</Box>
        <Box>Nav 2</Box>
        <Box>Nav 3</Box>
      </Cluster>
    </Cluster>
  ),
};

export const CenterDemo: Story = {
  name: 'Center',
  render: () => (
    <Center className="h-[200px] border border-dashed">
      <Box>Centered</Box>
    </Center>
  ),
};
