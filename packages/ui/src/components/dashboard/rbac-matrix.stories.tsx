import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RbacMatrix, type RbacAssignment, type RbacPermissionLevel } from './rbac-matrix';

const meta: Meta<typeof RbacMatrix> = {
  title: 'Dashboard/RbacMatrix',
  component: RbacMatrix,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RbacMatrix>;

const ROLES = [
  { id: 'su', label: 'SUPERUSER', level: -1 },
  { id: 'to', label: 'TENANT_OWNER', level: 0 },
  { id: 'it', label: 'IT_ADMIN', level: 1 },
  { id: 'hr_d', label: 'HR_DIRECTOR', level: 2 },
  { id: 'hr_m', label: 'HR_MANAGER', level: 3 },
  { id: 'dh', label: 'DEPT_HEAD', level: 4 },
  { id: 'lm', label: 'LINE_MANAGER', level: 5 },
  { id: 'emp', label: 'EMPLOYEE', level: 6 },
];

const AREAS = [
  { id: 'employees', label: 'Employees' },
  { id: 'recruiting', label: 'Recruiting' },
  { id: 'performance', label: 'Performance' },
  { id: 'compensation', label: 'Compensation' },
  { id: 'learning', label: 'Learning' },
  { id: 'audit', label: 'Audit' },
  { id: 'tenants', label: 'Tenants' },
  { id: 'rbp', label: 'RBP config' },
  { id: 'integrations', label: 'Integrations' },
];

function seedAssignments(): RbacAssignment[] {
  const out: RbacAssignment[] = [];
  for (const r of ROLES) {
    for (const a of AREAS) {
      let level: RbacPermissionLevel = 'none';
      if (r.id === 'su') level = 'owner';
      else if (r.id === 'to') level = a.id === 'audit' ? 'read' : 'admin';
      else if (r.id === 'it' && (a.id === 'integrations' || a.id === 'audit')) level = 'admin';
      else if (
        r.id === 'hr_d' &&
        ['employees', 'recruiting', 'performance', 'learning'].includes(a.id)
      )
        level = 'admin';
      else if (
        r.id === 'hr_m' &&
        ['employees', 'recruiting', 'performance', 'learning'].includes(a.id)
      )
        level = 'write';
      else if (r.id === 'dh' && ['employees', 'performance'].includes(a.id)) level = 'write';
      else if (r.id === 'lm' && ['employees', 'performance'].includes(a.id)) level = 'read';
      else if (r.id === 'emp' && a.id === 'employees') level = 'read';
      out.push({ roleId: r.id, areaId: a.id, level });
    }
  }
  return out;
}

export const Readonly: Story = {
  render: () => (
    <div className="w-full max-w-[960px]">
      <RbacMatrix roles={ROLES} areas={AREAS} assignments={seedAssignments()} readonly />
    </div>
  ),
};

function InteractiveDemo() {
  const [items, setItems] = useState<RbacAssignment[]>(seedAssignments());
  const handleChange = (next: RbacAssignment) => {
    setItems((prev) => {
      const others = prev.filter((p) => !(p.roleId === next.roleId && p.areaId === next.areaId));
      return [...others, next];
    });
  };
  return (
    <div className="w-full max-w-[960px]">
      <RbacMatrix roles={ROLES} areas={AREAS} assignments={items} onChange={handleChange} />
      <p className="mt-2 font-mono text-xs text-muted-fg">
        Click a cell to cycle: none → read → write → admin → owner → none
      </p>
    </div>
  );
}

export const Interactive: Story = { render: () => <InteractiveDemo /> };
