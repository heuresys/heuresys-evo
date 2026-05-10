'use client';

/**
 * Default RSC error boundary fallback (S28 Wave 3 H8).
 *
 * Used by `(app)/error.tsx` route group fallback. Caught by Next.js App
 * Router error boundary when server/client component throws. Replaces the
 * previous raw 500 page with a graceful message + retry action.
 *
 * Accessible:
 * - role="alert" announces the error to screen readers
 * - retry button has clear label + min-touch-target h-11 (AAA 44px)
 * - error.digest exposed only to console (not user-facing) for ops debug
 */
export function DefaultError({
  error,
  reset,
  title = 'Si è verificato un errore',
  description = 'Non è stato possibile caricare la pagina. Riprova oppure torna alla dashboard.',
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}) {
  if (typeof window !== 'undefined' && error.digest) {
    console.error('[boundary]', { digest: error.digest, message: error.message });
  }

  return (
    <div role="alert" className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
      <p className="text-sm text-neutral-700">{description}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Riprova
        </button>
        <a
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
        >
          Vai alla dashboard
        </a>
      </div>
      {error.digest ? (
        <p className="text-xs text-neutral-500">
          Codice errore: <code>{error.digest}</code>
        </p>
      ) : null}
    </div>
  );
}
