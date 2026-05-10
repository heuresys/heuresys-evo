import { DefaultLoading } from './_components/DefaultLoading';

/**
 * Route group loading boundary (S28 Wave 3 H8).
 * Applies to all 24 pages in (app)/ via Next.js App Router convention.
 * Per-route override possible via specific `<route>/loading.tsx`.
 */
export default function Loading() {
  return <DefaultLoading />;
}
