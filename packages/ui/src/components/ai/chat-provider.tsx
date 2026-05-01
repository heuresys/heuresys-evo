'use client';

import * as React from 'react';

/**
 * ChatProvider — provider-agnostic AI chat interface.
 *
 * Supports streaming via SSE/fetch. Concrete adapters live in:
 *   - @heuresys/ui/ai/adapters/anthropic
 *   - @heuresys/ui/ai/adapters/openai
 *   - @heuresys/ui/ai/adapters/google
 *
 * Tools/agent steps and message history rendered by sibling components
 * (Chatbot, AgentSteps, ToolCallView). (TIER 8)
 */
export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  reasoning?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  output: unknown;
  error?: string;
}

export interface ChatProviderAdapter {
  id: string;
  name: string;
  send(
    messages: ChatMessage[],
    opts?: { signal?: AbortSignal }
  ): AsyncIterable<{
    type: 'text-delta' | 'tool-call' | 'tool-result' | 'done' | 'error';
    delta?: string;
    toolCall?: ToolCall;
    toolResult?: ToolResult;
    error?: string;
  }>;
}

interface ChatContextValue {
  messages: ChatMessage[];
  send: (text: string) => Promise<void>;
  isStreaming: boolean;
  abort: () => void;
  clear: () => void;
  adapter: ChatProviderAdapter;
}

const ChatContext = React.createContext<ChatContextValue | null>(null);

export function ChatProvider({
  adapter,
  initialMessages = [],
  children,
}: {
  adapter: ChatProviderAdapter;
  initialMessages?: ChatMessage[];
  children: React.ReactNode;
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  async function send(text: string) {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    const next = [...messages, userMsg];
    setMessages(next);

    const assistantId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date().toISOString() },
    ]);

    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      for await (const evt of adapter.send(next, { signal: controller.signal })) {
        if (evt.type === 'text-delta' && evt.delta) {
          setMessages((m) =>
            m.map((msg) =>
              msg.id === assistantId ? { ...msg, content: msg.content + evt.delta } : msg
            )
          );
        } else if (evt.type === 'tool-call' && evt.toolCall) {
          setMessages((m) =>
            m.map((msg) =>
              msg.id === assistantId
                ? { ...msg, toolCalls: [...(msg.toolCalls ?? []), evt.toolCall!] }
                : msg
            )
          );
        } else if (evt.type === 'tool-result' && evt.toolResult) {
          setMessages((m) =>
            m.map((msg) =>
              msg.id === assistantId
                ? { ...msg, toolResults: [...(msg.toolResults ?? []), evt.toolResult!] }
                : msg
            )
          );
        }
      }
    } catch (err) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: msg.content + `\n\n[Error: ${(err as Error).message}]` }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function abort() {
    abortRef.current?.abort();
    setIsStreaming(false);
  }

  function clear() {
    setMessages([]);
  }

  return (
    <ChatContext.Provider value={{ messages, send, isStreaming, abort, clear, adapter }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = React.useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
