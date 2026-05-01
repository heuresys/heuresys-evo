'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '../../lib/cn';

// NOTE: consumers must import 'katex/dist/katex.min.css' once at app entry
// to render math correctly. We don't import here because TS without CSS loaders
// configured cannot resolve it; the consuming Next.js app handles CSS.

/**
 * MarkdownView — react-markdown wrapper preset for Heuresys docs.
 * GFM tables/strikethrough/tasklists, KaTeX math, custom code blocks slot.
 * (TIER 10)
 */
export function MarkdownView({
  content,
  className,
  components,
}: {
  content: string;
  className?: string;
  components?: React.ComponentProps<typeof ReactMarkdown>['components'];
}) {
  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
