/**
 * Default RSC loading boundary fallback (S28 Wave 3 H8).
 *
 * Used by `(app)/loading.tsx` route group fallback. Streamed by Next.js
 * App Router via React Suspense while server components for the requested
 * route are pending data. Replaces the previous "white screen" wait.
 *
 * Accessible:
 * - role="status" + aria-live="polite" announces the wait to screen readers
 * - aria-busy on the wrapper for assistive tech state
 * - skeleton blocks visually convey "content loading"
 */
export function DefaultLoading({ label = 'Caricamento contenuti…' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex w-full flex-col gap-4 px-6 py-8"
    >
      <span className="sr-only">{label}</span>
      <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-200" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg bg-neutral-100"
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-neutral-100" aria-hidden="true" />
    </div>
  );
}
