'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { Dialog, DialogContent } from './dialog';
import { cn } from '../lib/cn';

/**
 * Command palette wrapper around cmdk. (RTGB B7.20)
 *
 * Use:
 *   const [open, setOpen] = useState(false);
 *   useGlobalCmdK(() => setOpen(true));
 *   <CommandPalette open={open} onOpenChange={setOpen}>
 *     <CommandPalette.Group heading="Navigate">
 *       <CommandPalette.Item onSelect={() => router.push('/dashboard')}>Dashboard</CommandPalette.Item>
 *     </CommandPalette.Group>
 *   </CommandPalette>
 */

export function useGlobalCmdK(callback: () => void): void {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        callback();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [callback]);
}

interface CommandPaletteRootProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  empty?: React.ReactNode;
  children: React.ReactNode;
}

function CommandPaletteRoot({
  open,
  onOpenChange,
  placeholder = 'Type a command or search…',
  empty = 'No results.',
  children,
}: CommandPaletteRootProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
        <Command className="rounded-lg border-none">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            <Command.Input
              placeholder={placeholder}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-fg disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm text-muted-fg">
              {empty}
            </Command.Empty>
            {children}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

const CommandPaletteGroup = React.forwardRef<
  React.ElementRef<typeof Command.Group>,
  React.ComponentPropsWithoutRef<typeof Command.Group>
>(({ className, ...props }, ref) => (
  <Command.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-fg',
      className
    )}
    {...props}
  />
));
CommandPaletteGroup.displayName = 'CommandPaletteGroup';

const CommandPaletteItem = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  React.ComponentPropsWithoutRef<typeof Command.Item>
>(({ className, ...props }, ref) => (
  <Command.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[selected="true"]:bg-accent',
      className
    )}
    {...props}
  />
));
CommandPaletteItem.displayName = 'CommandPaletteItem';

export const CommandPalette = Object.assign(CommandPaletteRoot, {
  Group: CommandPaletteGroup,
  Item: CommandPaletteItem,
  Separator: Command.Separator,
});
