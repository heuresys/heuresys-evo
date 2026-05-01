'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

/**
 * Motion primitives (RTGB B7.28-B7.30).
 *
 * Wrap framer-motion `motion.div` with a small set of presets so callers don't
 * have to repeat keyframes. All respect `prefers-reduced-motion` via the
 * media query in tokens.css.
 */

export const FadeIn: React.FC<HTMLMotionProps<'div'> & { delay?: number }> = ({
  children,
  delay = 0,
  ...rest
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2, ease: 'easeOut', delay }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const SlideIn: React.FC<
  HTMLMotionProps<'div'> & { from?: 'top' | 'bottom' | 'left' | 'right'; delay?: number }
> = ({ children, from = 'bottom', delay = 0, ...rest }) => {
  const offset = 12;
  const initial =
    from === 'top'
      ? { opacity: 0, y: -offset }
      : from === 'bottom'
        ? { opacity: 0, y: offset }
        : from === 'left'
          ? { opacity: 0, x: -offset }
          : { opacity: 0, x: offset };
  return (
    <motion.div
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut', delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn: React.FC<HTMLMotionProps<'div'> & { delay?: number }> = ({
  children,
  delay = 0,
  ...rest
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, ease: 'easeOut', delay }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const StaggerChildren: React.FC<
  HTMLMotionProps<'div'> & { delay?: number; stagger?: number }
> = ({ children, delay = 0, stagger = 0.06, ...rest }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delayChildren: delay, staggerChildren: stagger },
      },
    }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<HTMLMotionProps<'div'>> = ({ children, ...rest }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 8 },
      visible: { opacity: 1, y: 0 },
    }}
    {...rest}
  >
    {children}
  </motion.div>
);
