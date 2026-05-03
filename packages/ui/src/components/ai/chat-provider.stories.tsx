import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatProvider, useChat } from './chat-provider';
import type { ChatProviderAdapter } from './chat-provider';
import { Button } from '../Button';

const meta: Meta<typeof ChatProvider> = {
  title: 'AI/ChatProvider',
  component: ChatProvider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ChatProvider>;

const mockAdapter: ChatProviderAdapter = {
  name: 'echo',
  async *send(messages) {
    const last = messages[messages.length - 1]?.content || '';
    yield { delta: `[echo] ${last}` };
  },
};

function Inspector() {
  const { messages, send, isStreaming, clear } = useChat();
  return (
    <div className="space-y-3 w-[500px]">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => send('Hello AI')}>
          Send "Hello AI"
        </Button>
        <Button size="sm" variant="outline" onClick={clear}>
          Clear
        </Button>
      </div>
      <p className="text-xs text-neutral-500">
        Streaming: {String(isStreaming)} | Messages: {messages.length}
      </p>
      <ul className="space-y-1 text-sm">
        {messages.map((m) => (
          <li key={m.id} className="rounded border p-2">
            <span className="text-xs uppercase text-neutral-500">{m.role}</span>: {m.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ChatProvider adapter={mockAdapter}>
      <Inspector />
    </ChatProvider>
  ),
};
