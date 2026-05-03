import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { VoiceInput } from './voice-input';

const meta: Meta<typeof VoiceInput> = {
  title: 'AI/VoiceInput',
  component: VoiceInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof VoiceInput>;

function Demo({ language = 'it-IT' }: { language?: string }) {
  const [transcript, setTranscript] = useState('');
  return (
    <div className="space-y-3 w-[400px]">
      <VoiceInput language={language} onTranscript={(t, isFinal) => isFinal && setTranscript(t)} />
      <div className="rounded border p-3 min-h-[60px] text-sm bg-muted/20">
        {transcript || <span className="text-neutral-400">Transcript will appear here…</span>}
      </div>
      <p className="text-xs text-neutral-500">
        Lang: {language}. Browser support varia (Safari: no SpeechRecognition).
      </p>
    </div>
  );
}

export const Italian: Story = { render: () => <Demo language="it-IT" /> };
export const English: Story = { render: () => <Demo language="en-US" /> };
