'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

export interface TocItem {
  id: string;
  level: number;
  text: string;
}

/**
 * TableOfContents — auto-generated from h1-h6 in a target container, with
 * scroll-spy active highlight via IntersectionObserver. (TIER 10)
 */
export function TableOfContents({
  containerSelector = 'article',
  className,
}: {
  containerSelector?: string;
  className?: string;
}) {
  const [items, setItems] = React.useState<TocItem[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const el = document.querySelector(containerSelector);
    if (!el) return;
    const headings = el.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6');
    const arr: TocItem[] = [];
    headings.forEach((h) => {
      if (!h.id) {
        h.id =
          h.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') ?? '';
      }
      arr.push({ id: h.id, level: Number(h.tagName.slice(1)), text: h.textContent ?? '' });
    });
    setItems(arr);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [containerSelector]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={cn('text-sm', className)}>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-fg">
        On this page
      </h2>
      <ol className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: (item.level - 1) * 8 }}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={cn(
                'block py-0.5 text-muted-fg transition-colors hover:text-foreground',
                activeId === item.id && 'font-medium text-primary'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
