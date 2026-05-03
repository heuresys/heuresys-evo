import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect } from 'storybook/test';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="pt-3">
        Account preferences and profile data.
      </TabsContent>
      <TabsContent value="password" className="pt-3">
        Password reset workflow + 2FA setup.
      </TabsContent>
      <TabsContent value="advanced" className="pt-3">
        Danger zone settings (delete account, export data).
      </TabsContent>
    </Tabs>
  ),
};

// Auto switch via play(): verifica transizione fluida tra tab
export const InteractiveSwitch: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-3">
        High-level summary of system health.
      </TabsContent>
      <TabsContent value="metrics" className="pt-3">
        Live charts: latency, throughput, error rate.
      </TabsContent>
      <TabsContent value="logs" className="pt-3">
        Recent log entries with filter/search.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('tab', { name: /metrics/i }));
    await expect(c.getByText(/live charts/i)).toBeVisible();
    await userEvent.click(c.getByRole('tab', { name: /logs/i }));
    await expect(c.getByText(/recent log entries/i)).toBeVisible();
    await userEvent.click(c.getByRole('tab', { name: /overview/i }));
    await expect(c.getByText(/high-level/i)).toBeVisible();
  },
  parameters: {
    docs: {
      description: { story: 'play() ciclica su 3 tab — vedi step Interactions con timing motion.' },
    },
  },
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="t1" className="w-[700px]">
      <TabsList>
        {Array.from({ length: 6 }, (_, i) => (
          <TabsTrigger key={i} value={`t${i + 1}`}>
            Tab {i + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {Array.from({ length: 6 }, (_, i) => (
        <TabsContent key={i} value={`t${i + 1}`} className="pt-3">
          Content area #{i + 1} — typical workspace pattern.
        </TabsContent>
      ))}
    </Tabs>
  ),
};
