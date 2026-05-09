'use server';

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import {
  isValidPaletteId,
  isValidTheme,
  type ActivePaletteState,
  type PaletteId,
  type ThemeMode,
} from '@/lib/theme-framework/palettes';
import { writeActivePalette } from '@/lib/theme-framework/active-palette-store';

const ACTIVE_THEME_PATH = join(process.cwd(), 'src', 'styles', 'active-theme.css');
const PREVIEW_COOKIE = 'heuresys-theme-preview';
const PALETTE_PREVIEW_COOKIE = 'heuresys-palette-preview';
const MAX_CSS_BYTES = 8 * 1024;
const ALLOWED_ROLES = new Set(['SUPERUSER']);

async function assertSuperuser(): Promise<{ id: string; username: string }> {
  const session = await auth();
  const user = session?.user as { id?: string; username?: string; role?: string } | undefined;
  if (!user || !user.role || !ALLOWED_ROLES.has(user.role)) {
    throw new Error('Forbidden: SUPERUSER role required');
  }
  return { id: user.id ?? 'unknown', username: user.username ?? 'unknown' };
}

function assertSafeCss(css: string): string {
  if (typeof css !== 'string') throw new Error('CSS payload must be a string');
  if (css.length === 0) throw new Error('CSS payload is empty');
  if (Buffer.byteLength(css, 'utf8') > MAX_CSS_BYTES) {
    throw new Error(`CSS payload exceeds ${MAX_CSS_BYTES} bytes`);
  }
  if (/<\/style|<script|<\/script/i.test(css)) {
    throw new Error('CSS payload contains forbidden tag-like sequences');
  }
  return css;
}

export async function applyThemeToProject(cssContent: string): Promise<{ ok: true; path: string }> {
  const actor = await assertSuperuser();
  const safe = assertSafeCss(cssContent);
  const header = `/* Heuresys active theme — applied via Brand Studio at ${new Date().toISOString()} by ${actor.username} (id=${actor.id}).\n * Do not edit by hand: re-run /brand-studio to update.\n */\n`;
  await writeFile(ACTIVE_THEME_PATH, header + safe, 'utf8');
  return { ok: true, path: 'services/app/src/styles/active-theme.css' };
}

export async function setPreviewTheme(cssContent: string): Promise<{ ok: true }> {
  await assertSuperuser();
  const safe = assertSafeCss(cssContent);
  const store = await cookies();
  store.set(PREVIEW_COOKIE, safe, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return { ok: true };
}

export async function clearPreviewTheme(): Promise<{ ok: true }> {
  await assertSuperuser();
  const store = await cookies();
  store.delete(PREVIEW_COOKIE);
  return { ok: true };
}

// ============================================================================
// Phase 15.H · L49 — Palette preset actions
// ============================================================================

function assertValidPaletteState(palette: unknown, theme: unknown): ActivePaletteState {
  if (!isValidPaletteId(palette)) {
    throw new Error(`Invalid palette id: ${String(palette)}`);
  }
  if (!isValidTheme(theme)) {
    throw new Error(`Invalid theme mode: ${String(theme)}`);
  }
  return { palette, theme };
}

/** Persist palette+theme choice to active-palette.json (committed to repo). */
export async function applyPaletteToProject(
  palette: PaletteId,
  theme: ThemeMode
): Promise<{ ok: true; palette: PaletteId; theme: ThemeMode }> {
  await assertSuperuser();
  const state = assertValidPaletteState(palette, theme);
  await writeActivePalette(state);
  return { ok: true, ...state };
}

/** Stage palette+theme as a session-cookie preview (does not write file). */
export async function setPreviewPalette(
  palette: PaletteId,
  theme: ThemeMode
): Promise<{ ok: true }> {
  await assertSuperuser();
  const state = assertValidPaletteState(palette, theme);
  const store = await cookies();
  store.set(PALETTE_PREVIEW_COOKIE, JSON.stringify(state), {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return { ok: true };
}

export async function clearPreviewPalette(): Promise<{ ok: true }> {
  await assertSuperuser();
  const store = await cookies();
  store.delete(PALETTE_PREVIEW_COOKIE);
  return { ok: true };
}
