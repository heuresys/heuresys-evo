'use client';

/**
 * Root error boundary (S48 Brand v1.0 Stage D).
 *
 * Catches unhandled errors in segments outside (app)/ route group, plus
 * any uncaught (app)/error.tsx escapes. Uses brand tokens consistent
 * with not-found.tsx + login-aurora surface.
 */

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error.digest) {
      // eslint-disable-next-line no-console
      console.error('[root-error]', { digest: error.digest, message: error.message });
    }
  }, [error]);

  return (
    <main
      role="alert"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg)',
        color: 'var(--ink)',
        padding: '2rem',
        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: 520,
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 9vw, 5rem)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: 'var(--semantic-danger)',
          }}
        >
          50<span style={{ color: 'var(--accent)' }}>0</span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            margin: 0,
          }}
        >
          Si è verificato un <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>errore</em>
        </h1>
        <p
          style={{
            color: 'var(--ink-soft)',
            fontSize: '0.95rem',
            margin: 0,
            maxWidth: 420,
            marginInline: 'auto',
          }}
        >
          Non è stato possibile caricare la pagina. Puoi riprovare oppure tornare alla dashboard. Se
          il problema persiste, segnala il codice errore al supporto.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            marginTop: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={reset}
            className="motion-button-press"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '2.75rem',
              padding: '0 1.25rem',
              borderRadius: 'var(--radius-3, 6px)',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Riprova
          </button>
          <Link
            href="/dashboard"
            className="motion-button-press"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '2.75rem',
              padding: '0 1.25rem',
              borderRadius: 'var(--radius-3, 6px)',
              border: '1px solid var(--rule-strong)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Vai alla dashboard
          </Link>
        </div>
        {error.digest ? (
          <p
            style={{
              fontFamily: 'var(--font-jetbrains), "JetBrains Mono", monospace',
              fontSize: '0.75rem',
              color: 'var(--ink-tertiary)',
              marginTop: '0.5rem',
            }}
          >
            Codice errore: <code>{error.digest}</code>
          </p>
        ) : null}
      </section>
    </main>
  );
}
