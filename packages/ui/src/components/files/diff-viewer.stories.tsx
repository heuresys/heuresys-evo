import type { Meta, StoryObj } from '@storybook/react-vite';
import { DiffViewer, type DiffLine } from './diff-viewer';

const meta: Meta<typeof DiffViewer> = {
  title: 'Files/DiffViewer',
  component: DiffViewer,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DiffViewer>;

const lines: DiffLine[] = [
  { type: 'context', content: 'function getEmployee(id) {', oldLine: 1, newLine: 1 },
  { type: 'remove', content: '  return db.employees.findOne(id);', oldLine: 2 },
  { type: 'add', content: '  return prisma.employee.findUnique({ where: { id } });', newLine: 2 },
  { type: 'add', content: '  // Now with audit log (P4)', newLine: 3 },
  { type: 'context', content: '}', oldLine: 3, newLine: 4 },
];

export const Unified: Story = { args: { lines, variant: 'unified', className: 'max-w-xl' } };
export const Split: Story = { args: { lines, variant: 'split', className: 'max-w-3xl' } };
