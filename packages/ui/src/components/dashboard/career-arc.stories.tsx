import type { Meta, StoryObj } from '@storybook/react-vite';
import { CareerArc } from './career-arc';

const meta: Meta<typeof CareerArc> = {
  title: 'Dashboard/CareerArc',
  component: CareerArc,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof CareerArc>;

const ANDREA_STAGES = [
  { id: '1', label: 'Junior Analyst', year: '2018' },
  { id: '2', label: 'Analyst', year: '2020' },
  { id: '3', label: 'Senior Analyst', year: '2023' },
  { id: '4', label: 'Lead Quant', year: '2026 →' },
  { id: '5', label: 'Head of Quant', year: '2029+' },
];

export const FiveStages: Story = {
  render: () => (
    <div className="w-[760px]">
      <CareerArc stages={ANDREA_STAGES} currentIndex={2} />
    </div>
  ),
};

export const ExplicitStatus: Story = {
  render: () => (
    <div className="w-[760px]">
      <CareerArc
        stages={[
          { id: 'a', label: 'Hire', year: 'Jan 2024', status: 'past' },
          { id: 'b', label: 'Onboarding', year: 'Q1 2024', status: 'past' },
          { id: 'c', label: 'Ramp-up', year: 'Q2-Q3 2024', status: 'current' },
          { id: 'd', label: 'First review', year: 'Q4 2024', status: 'future' },
          { id: 'e', label: 'Promotion', year: '2026+', status: 'future' },
        ]}
      />
    </div>
  ),
};

export const ThreeStages: Story = {
  render: () => (
    <div className="w-[520px]">
      <CareerArc
        stages={[
          { id: '1', label: 'IC', year: '2020' },
          { id: '2', label: 'Manager', year: '2024 →' },
          { id: '3', label: 'Director', year: '2027' },
        ]}
        currentIndex={1}
      />
    </div>
  ),
};
