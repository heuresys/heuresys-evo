import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Layout primitives — every-layout style. CSS-only, composable, no JS layout
 * logic. (RTGB B7.23)
 */

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'nav' | 'main' | 'aside';
}

function Polymorphic({ as: Tag = 'div', ...rest }: LayoutProps) {
  return <Tag {...rest} />;
}

export function Stack({
  className,
  gap = 'md',
  ...props
}: LayoutProps & { gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  const map = { xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' };
  return <Polymorphic className={cn('flex flex-col', map[gap], className)} {...props} />;
}

export function Cluster({
  className,
  gap = 'md',
  align = 'center',
  justify = 'start',
  ...props
}: LayoutProps & {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}) {
  const gapMap = { xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' };
  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };
  return (
    <Polymorphic
      className={cn('flex flex-wrap', gapMap[gap], alignMap[align], justifyMap[justify], className)}
      {...props}
    />
  );
}

export function Center({ className, ...props }: LayoutProps) {
  return (
    <Polymorphic
      className={cn('flex min-h-full items-center justify-center', className)}
      {...props}
    />
  );
}

export function Cover({ className, ...props }: LayoutProps) {
  return (
    <Polymorphic
      className={cn(
        'flex min-h-screen flex-col [&>*]:my-auto [&>:first-child]:mt-0 [&>:last-child]:mb-0',
        className
      )}
      {...props}
    />
  );
}

export function Frame({
  className,
  ratio = '16/9',
  ...props
}: LayoutProps & { ratio?: '1/1' | '4/3' | '16/9' | '21/9' | '3/4' }) {
  const ratioMap = {
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '21/9': 'aspect-[21/9]',
    '3/4': 'aspect-[3/4]',
  };
  return <Polymorphic className={cn('overflow-hidden', ratioMap[ratio], className)} {...props} />;
}

export function Grid({
  className,
  cols = 'auto',
  gap = 'md',
  ...props
}: LayoutProps & {
  cols?: 'auto' | 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}) {
  const colsMap = {
    auto: 'grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))]',
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };
  const gapMap = { xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' };
  return <Polymorphic className={cn('grid', colsMap[cols], gapMap[gap], className)} {...props} />;
}

export function Switcher({
  className,
  threshold = '30rem',
  gap = 'md',
  ...props
}: LayoutProps & { threshold?: string; gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  const gapMap = { xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' };
  return (
    <Polymorphic
      style={{
        ['--threshold' as never]: threshold,
        ['display' as never]: 'flex',
        ['flexWrap' as never]: 'wrap',
      }}
      className={cn(
        gapMap[gap],
        '[&>*]:flex-1 [&>*]:min-w-[min(var(--threshold),100%)]',
        className
      )}
      {...props}
    />
  );
}
