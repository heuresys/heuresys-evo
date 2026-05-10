'use client';

import { DefaultError } from './_components/DefaultError';

/**
 * Route group error boundary (S28 Wave 3 H8).
 * Applies to all 24 pages in (app)/ via Next.js App Router convention.
 * Per-route override possible via specific `<route>/error.tsx`.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <DefaultError error={error} reset={reset} />;
}
