import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormWizard, type FormWizardStep } from './form-wizard';
import { Input } from '../Input';

interface SignupState {
  name: string;
  email: string;
  role: string;
  consent: boolean;
}

const meta: Meta<typeof FormWizard<SignupState>> = {
  title: 'Forms/FormWizard',
  component: FormWizard as never,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FormWizard<SignupState>>;

const steps: FormWizardStep<SignupState>[] = [
  {
    id: 'identity',
    label: 'Identity',
    render: (state, update) => (
      <div className="grid gap-3">
        <label className="grid gap-1 text-sm">
          <span>Full name</span>
          <Input value={state.name} onChange={(e) => update({ name: e.target.value })} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Email</span>
          <Input
            type="email"
            value={state.email}
            onChange={(e) => update({ email: e.target.value })}
          />
        </label>
      </div>
    ),
    validate: (s) => (!s.name || !s.email ? 'Name and email required' : null),
  },
  {
    id: 'role',
    label: 'Role',
    render: (state, update) => (
      <div className="grid gap-2 text-sm">
        {['Employee', 'Manager', 'Director'].map((r) => (
          <label key={r} className="flex items-center gap-2">
            <input type="radio" checked={state.role === r} onChange={() => update({ role: r })} />
            {r}
          </label>
        ))}
      </div>
    ),
    validate: (s) => (!s.role ? 'Pick a role' : null),
  },
  {
    id: 'review',
    label: 'Review',
    render: (state) => (
      <div className="space-y-2 text-sm">
        <p>
          <strong>Name:</strong> {state.name}
        </p>
        <p>
          <strong>Email:</strong> {state.email}
        </p>
        <p>
          <strong>Role:</strong> {state.role}
        </p>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    steps,
    initial: { name: '', email: '', role: '', consent: false } as never,
    onComplete: (state) => console.log('completed', state),
    title: 'Employee onboarding',
  } as never,
};
