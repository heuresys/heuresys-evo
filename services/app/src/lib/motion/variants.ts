/**
 * Heuresys motion variants — Framer Motion presets (Phase 8 · L24)
 *
 * SoT: .ux-design/04-motion-language/motion-final.md
 * CSS counterpart: src/styles/motion.css
 *
 * Use when orchestration (AnimatePresence, stagger, gesture) is required.
 * For static enter/hover, prefer CSS utility classes in motion.css.
 *
 * Token alignment:
 *   ease-out      cubic-bezier(0.16, 1, 0.3, 1)
 *   ease-in-out   cubic-bezier(0.45, 0, 0.55, 1)
 *   ease-spring   cubic-bezier(0.34, 1.56, 0.64, 1)
 *   dur-instant   0.10s   dur-fast     0.15s
 *   dur-chart     0.20s   dur-standard 0.30s
 *   dur-slow      0.60s
 */

import type { Variants, Transition } from 'framer-motion';

export const easings = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.45, 0, 0.55, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
} as const;

export const durations = {
  instant: 0.1,
  fast: 0.15,
  chart: 0.2,
  standard: 0.3,
  slow: 0.6,
} as const;

const standardTransition: Transition = {
  duration: durations.standard,
  ease: easings.out,
};

/** Pattern 5: Scroll-triggered reveal — one-shot enter with stagger support. */
export const scrollRevealVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: standardTransition,
  },
};

/** Stagger container — pair with scrollRevealVariants children. */
export const scrollRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
};

/** Auxiliary: Card lift on hover. */
export const cardLiftVariants: Variants = {
  rest: { y: 0 },
  hover: {
    y: -2,
    transition: { duration: durations.fast, ease: easings.out },
  },
};

/** Auxiliary: Modal enter/exit (AnimatePresence). */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.chart, ease: easings.out },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: durations.fast, ease: easings.in },
  },
};

/** Auxiliary: Toast/banner slide-in from right. */
export const toastVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.standard, ease: easings.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.chart, ease: easings.in },
  },
};

/** KPI count-up helper — animate number from 0 → target over chart duration. */
export const countUpTransition: Transition = {
  duration: durations.chart,
  ease: easings.out,
};
