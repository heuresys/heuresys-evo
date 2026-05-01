'use client';

import * as React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../lib/cn';

export const DropdownMenu = Dropdown.Root;
export const DropdownMenuTrigger = Dropdown.Trigger;
export const DropdownMenuGroup = Dropdown.Group;
export const DropdownMenuPortal = Dropdown.Portal;
export const DropdownMenuSub = Dropdown.Sub;
export const DropdownMenuRadioGroup = Dropdown.RadioGroup;

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof Dropdown.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof Dropdown.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <Dropdown.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
  </Dropdown.SubTrigger>
));
DropdownMenuSubTrigger.displayName = Dropdown.SubTrigger.displayName;

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof Dropdown.SubContent>,
  React.ComponentPropsWithoutRef<typeof Dropdown.SubContent>
>(({ className, ...props }, ref) => (
  <Dropdown.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-background p-1 text-foreground shadow-lg',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = Dropdown.SubContent.displayName;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof Dropdown.Content>,
  React.ComponentPropsWithoutRef<typeof Dropdown.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Dropdown.Portal>
    <Dropdown.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-background p-1 text-foreground shadow-md',
        className
      )}
      {...props}
    />
  </Dropdown.Portal>
));
DropdownMenuContent.displayName = Dropdown.Content.displayName;

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof Dropdown.Item>,
  React.ComponentPropsWithoutRef<typeof Dropdown.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <Dropdown.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = Dropdown.Item.displayName;

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof Dropdown.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof Dropdown.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <Dropdown.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Dropdown.ItemIndicator>
        <Check className="h-4 w-4" />
      </Dropdown.ItemIndicator>
    </span>
    {children}
  </Dropdown.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = Dropdown.CheckboxItem.displayName;

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof Dropdown.RadioItem>,
  React.ComponentPropsWithoutRef<typeof Dropdown.RadioItem>
>(({ className, children, ...props }, ref) => (
  <Dropdown.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Dropdown.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </Dropdown.ItemIndicator>
    </span>
    {children}
  </Dropdown.RadioItem>
));
DropdownMenuRadioItem.displayName = Dropdown.RadioItem.displayName;

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dropdown.Label> & { inset?: boolean }) {
  return (
    <Dropdown.Label
      className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
      {...props}
    />
  );
}

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof Dropdown.Separator>,
  React.ComponentPropsWithoutRef<typeof Dropdown.Separator>
>(({ className, ...props }, ref) => (
  <Dropdown.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
));
DropdownMenuSeparator.displayName = Dropdown.Separator.displayName;

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
  );
}
