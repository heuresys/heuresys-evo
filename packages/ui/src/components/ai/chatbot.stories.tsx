import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chatbot } from './chatbot';
import { ChatProvider } from './chat-provider';
import type { ChatProviderAdapter } from './chat-provider';

const meta: Meta<typeof Chatbot> = {
  title: 'AI/Chatbot',
  component: Chatbot,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Chatbot>;

// Mock adapter — simulates streaming response with setTimeout
const mockAdapter: ChatProviderAdapter = {
  name: 'mock-stream',
  async *send(messages) {
    const last = messages[messages.length - 1]?.content || '';
    const reply = `Echo: ${last}. (mock streaming response with simulated delay)`;
    for (let i = 0; i < reply.length; i += 4) {
      await new Promise((r) => setTimeout(r, 60));
      yield { delta: reply.slice(i, i + 4) };
    }
  },
};

export const Default: Story = {
  render: () => (
    <ChatProvider adapter={mockAdapter}>
      <div className="h-[500px] w-[500px]">
        <Chatbot />
      </div>
    </ChatProvider>
  ),
  parameters: {
    docs: {
      description: { story: 'Mock adapter streamizza echo della tua input con delay 60ms/4chars.' },
    },
  },
};
