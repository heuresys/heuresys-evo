'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';

export interface ShortcutGroup {
  heading: string;
  shortcuts: Array<{ keys: string[]; label: string }>;
}

/**
 * KeyboardShortcutsModal — Cmd+/ trigger that lists app shortcuts grouped.
 * (TIER 3)
 */
export function KeyboardShortcutsModal({
  groups,
  open,
  onOpenChange,
}: {
  groups: ShortcutGroup[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Press Cmd+/ (Ctrl+/) to toggle this dialog.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          {groups.map((g) => (
            <section key={g.heading}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-fg">
                {g.heading}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {g.shortcuts.map((s, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{s.label}</span>
                    <span className="flex items-center gap-1">
                      {s.keys.map((k, j) => (
                        <kbd
                          key={j}
                          className="rounded border border-border bg-muted px-1.5 py-0.5 text-[0.7rem] font-mono"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * useShortcutsModal — hook that toggles a modal on Cmd+/ (or Ctrl+/).
 */
export function useShortcutsModal() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return { open, setOpen } as const;
}
