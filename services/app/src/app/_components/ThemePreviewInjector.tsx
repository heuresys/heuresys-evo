'use client';

import * as React from 'react';

const PREVIEW_COOKIE = 'heuresys-theme-preview';
const PREVIEW_MAX_BYTES = 8 * 1024;
const PREVIEW_FORBIDDEN = /<\/style|<script|<\/script/i;
const STYLE_ID = 'heuresys-theme-preview-style';

function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split('; ')) {
    if (part.startsWith(prefix)) {
      try {
        return decodeURIComponent(part.slice(prefix.length));
      } catch {
        return null;
      }
    }
  }
  return null;
}

function isSafeCss(css: string): boolean {
  if (!css || new Blob([css]).size > PREVIEW_MAX_BYTES) return false;
  return !PREVIEW_FORBIDDEN.test(css);
}

export function ThemePreviewInjector() {
  React.useEffect(() => {
    const css = readCookieValue(PREVIEW_COOKIE);
    const existing = document.getElementById(STYLE_ID);
    if (!css || !isSafeCss(css)) {
      existing?.remove();
      return;
    }
    const el = existing instanceof HTMLStyleElement ? existing : document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css;
    if (!existing) document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, []);

  return null;
}
