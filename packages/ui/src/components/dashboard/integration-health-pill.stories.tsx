import type { Meta, StoryObj } from '@storybook/react-vite';
import { IntegrationHealthPill } from './integration-health-pill';

const meta: Meta<typeof IntegrationHealthPill> = {
  title: 'Dashboard/IntegrationHealthPill',
  component: IntegrationHealthPill,
  parameters: { layout: 'centered' },
  argTypes: {
    tone: { control: { type: 'select' }, options: ['ok', 'warn', 'down', 'info'] },
    pulse: { control: 'boolean' },
    showDot: { control: 'boolean' },
  },
  args: { tone: 'ok', pulse: false, showDot: true },
};
export default meta;

type Story = StoryObj<typeof IntegrationHealthPill>;

export const OK: Story = { args: { tone: 'ok', label: 'OK' } };
export const Warn: Story = { args: { tone: 'warn', label: 'WARN', pulse: true } };
export const Down: Story = { args: { tone: 'down', label: 'DOWN', pulse: true } };
export const Info: Story = { args: { tone: 'info', label: 'SYNC' } };

export const NoDot: Story = { args: { tone: 'ok', showDot: false } };

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IntegrationHealthPill tone="ok" />
      <IntegrationHealthPill tone="warn" pulse />
      <IntegrationHealthPill tone="down" pulse />
      <IntegrationHealthPill tone="info" label="SYNCING" />
      <IntegrationHealthPill tone="ok" label="HEALTHY" showDot={false} />
    </div>
  ),
};

export const IntegrationRow: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col divide-y divide-border rounded-md border border-border">
      {[
        {
          name: 'ESCO ontology feed',
          meta: 'v1.2.0 · sync 2h ago · 312 skill',
          tone: 'ok' as const,
        },
        { name: 'Azure AD · SSO', meta: 'SAML 2.0 · 1.524 users provisioned', tone: 'ok' as const },
        { name: 'SmartFood · ATECO sync', meta: 'cron · last failed 13:42', tone: 'warn' as const },
        {
          name: 'Workday · payroll sync',
          meta: 'REST · 3× daily · last 06:42',
          tone: 'ok' as const,
        },
      ].map((row) => (
        <div key={row.name} className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <div className="text-sm font-semibold">{row.name}</div>
            <div className="font-mono text-xs text-muted-fg">{row.meta}</div>
          </div>
          <IntegrationHealthPill tone={row.tone} pulse={row.tone === 'warn'} />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Composizione tipica: lista integrazioni con pill di status.' } },
  },
};
