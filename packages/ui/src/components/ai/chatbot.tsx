'use client';

import * as React from 'react';
import { Send, Square, Trash } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';
import { useChat } from './chat-provider';
import { MarkdownView } from '../markdown/markdown-view';
import { ToolCallView } from './tool-call-view';

/**
 * Chatbot — UI shell for ChatProvider. Streams assistant responses, renders
 * markdown, shows tool calls inline, exposes abort + clear.
 * (TIER 8)
 */
export function Chatbot({ className }: { className?: string }) {
  const { messages, send, isStreaming, abort, clear, adapter } = useChat();
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-md border border-border bg-background',
        className
      )}
      role="region"
      aria-label="AI chat"
    >
      <header className="flex items-center justify-between border-b border-border p-3">
        <span className="text-xs text-muted-fg">Provider: {adapter.name}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={clear}
          disabled={messages.length === 0 || isStreaming}
        >
          <Trash className="mr-1 h-3 w-3" />
          Clear
        </Button>
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
        {messages.map((m) => (
          <article
            key={m.id}
            className={cn('flex flex-col gap-1', m.role === 'user' && 'items-end')}
          >
            <div className="text-[0.65rem] uppercase tracking-wider text-muted-fg">{m.role}</div>
            <div
              className={cn(
                'max-w-[80%] rounded-md px-3 py-2 text-sm',
                m.role === 'user'
                  ? 'bg-primary text-primary-fg'
                  : m.role === 'assistant'
                    ? 'bg-muted text-foreground'
                    : 'bg-warning/10 text-warning border border-warning/30'
              )}
            >
              {m.role === 'assistant' ? (
                <MarkdownView content={m.content} />
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
              {m.toolCalls?.map((tc) => (
                <ToolCallView
                  key={tc.id}
                  call={tc}
                  result={m.toolResults?.find((r) => r.toolCallId === tc.id)}
                />
              ))}
            </div>
          </article>
        ))}
        {isStreaming ? (
          <div role="status" className="flex items-center gap-2 text-xs text-muted-fg">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
            Streaming…
          </div>
        ) : null}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || isStreaming) return;
          const text = input.trim();
          setInput('');
          void send(text);
        }}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (input.trim() && !isStreaming) {
                const text = input.trim();
                setInput('');
                void send(text);
              }
            }
          }}
          rows={2}
          placeholder="Type a message — Enter to send, Shift+Enter for newline"
          className="flex-1 resize-none rounded-md border border-input bg-background p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Message input"
          disabled={isStreaming}
        />
        {isStreaming ? (
          <Button type="button" variant="destructive" onClick={abort} aria-label="Stop streaming">
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={!input.trim()} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
}
