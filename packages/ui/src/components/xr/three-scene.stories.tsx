import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThreeScene } from './three-scene';

const meta: Meta<typeof ThreeScene> = {
  title: 'XR/ThreeScene',
  component: ThreeScene,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ThreeScene>;

export const Default: Story = {
  render: () => (
    <div className="h-[400px] w-full">
      <ThreeScene>
        {/* @react-three/fiber children — basic mesh */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh rotation={[0.5, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#5b8def" />
        </mesh>
      </ThreeScene>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'WebGL scene con cubo + OrbitControls (drag to rotate).' } },
  },
};
