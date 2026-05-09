/**
 * Phase 15.H · L49 — Active palette state persistence.
 *
 * Mirrors the `active-theme.css` file pattern: a single source-of-truth file
 * committed to the repo. Reads/writes JSON: { palette, theme }.
 *
 * Server-side only. Client persistence (preview) goes through localStorage
 * in PalettePresetsTab via the runtime switcher.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_ACTIVE_PALETTE,
  isValidPaletteId,
  isValidTheme,
  type ActivePaletteState,
} from './palettes';

const STORE_PATH = path.join(
  process.cwd(),
  'src',
  'styles',
  'theme-framework',
  'active-palette.json'
);

export async function readActivePalette(): Promise<ActivePaletteState> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'palette' in parsed &&
      'theme' in parsed &&
      isValidPaletteId((parsed as { palette: unknown }).palette) &&
      isValidTheme((parsed as { theme: unknown }).theme)
    ) {
      return parsed as ActivePaletteState;
    }
  } catch {
    // File missing or invalid → fall through to default.
  }
  return DEFAULT_ACTIVE_PALETTE;
}

export async function writeActivePalette(state: ActivePaletteState): Promise<void> {
  if (!isValidPaletteId(state.palette) || !isValidTheme(state.theme)) {
    throw new Error(`Invalid palette state: ${JSON.stringify(state)}`);
  }
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}
