import * as React from 'react';
import { MarkdownView } from '../../components/markdown/markdown-view';

const UX_BASE = '/ux-design';

export function uxPath(relative: string): string {
  const trimmed = relative.startsWith('/') ? relative.slice(1) : relative;
  return `${UX_BASE}/${trimmed}`;
}

export function UxFrame({
  src,
  height = 720,
  title,
}: {
  src: string;
  height?: number | string;
  title: string;
}) {
  return (
    <div
      style={{
        border: '1px solid var(--color-border, #e5e5e5)',
        borderRadius: 8,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <iframe
        src={uxPath(src)}
        title={title}
        style={{ width: '100%', height, border: 'none', display: 'block' }}
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
      <div
        style={{
          padding: '6px 12px',
          fontSize: 11,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          color: '#888',
          background: '#f8f8f8',
          borderTop: '1px solid #e5e5e5',
        }}
      >
        .ux-design/{src}
      </div>
    </div>
  );
}

export function UxAsset({
  src,
  alt,
  background = 'transparent',
  maxHeight = 240,
}: {
  src: string;
  alt: string;
  background?: string;
  maxHeight?: number;
}) {
  return (
    <div>
      <div
        style={{
          background,
          border: '1px solid var(--color-border, #e5e5e5)',
          borderRadius: 8,
          padding: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
        }}
      >
        <img src={uxPath(src)} alt={alt} style={{ maxWidth: '100%', maxHeight }} />
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          color: '#888',
        }}
      >
        .ux-design/{src}
      </div>
    </div>
  );
}

export function UxMarkdownDoc({ src }: { src: string }) {
  const [content, setContent] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setContent('');
    setError(null);
    fetch(uxPath(src))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (error) {
    return (
      <div
        style={{
          padding: 16,
          background: '#fff5f5',
          border: '1px solid #fecaca',
          color: '#991b1b',
          borderRadius: 8,
        }}
      >
        <strong>Errore caricamento:</strong> {error}
        <div style={{ marginTop: 8, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
          .ux-design/{src}
        </div>
      </div>
    );
  }

  if (!content) {
    return <div style={{ padding: 16, color: '#888' }}>Loading .ux-design/{src}…</div>;
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: '6px 12px',
          fontSize: 11,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          color: '#666',
          background: '#f4f4f5',
          border: '1px solid #e4e4e7',
          borderRadius: 4,
          display: 'inline-block',
        }}
      >
        source: .ux-design/{src}
      </div>
      <MarkdownView content={content} />
    </div>
  );
}

export function PaletteSwatch({
  name,
  token,
  oklch,
  hex,
  note,
}: {
  name: string;
  token: string;
  oklch: string;
  hex?: string;
  note?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: oklch,
          height: 120,
          borderRadius: 8,
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: '#666' }}>
          {token}
        </div>
        <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: '#888' }}>
          {oklch}
        </div>
        {hex ? (
          <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: '#888' }}>
            {hex}
          </div>
        ) : null}
        {note ? <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{note}</div> : null}
      </div>
    </div>
  );
}

export function PaletteGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}
