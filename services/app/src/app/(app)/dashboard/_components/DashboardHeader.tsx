import type { PaletteId, ThemeMode } from '@/lib/theme-framework/palettes';
import { PaletteSwitcherDropdown } from './PaletteSwitcherDropdown';

interface Props {
  initialPalette: PaletteId;
  initialTheme: ThemeMode;
}

/**
 * Dashboard sub-header rendered above page content for every /dashboard/* route.
 * Hosts user-scoped controls (currently: palette switcher).
 */
export function DashboardHeader({ initialPalette, initialTheme }: Props) {
  return (
    <div className="flex items-center justify-end border-b border-[var(--rule)] bg-[var(--surface-1)] px-4 py-2">
      <PaletteSwitcherDropdown initialPalette={initialPalette} initialTheme={initialTheme} />
    </div>
  );
}
