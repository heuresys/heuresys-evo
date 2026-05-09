import type { Metadata } from 'next';
import { Inter, Exo_2, JetBrains_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import '../styles/active-theme.css';
import '../styles/theme-framework/palette-framework.css';
import '../styles/dashboard-brand.css';
import { ThemePreviewInjector } from './_components/ThemePreviewInjector';
import { LocaleProvider } from '@/lib/i18n';
import { readActivePalette } from '@/lib/theme-framework/active-palette-store';
import {
  isValidPaletteId,
  isValidTheme,
  type ActivePaletteState,
} from '@/lib/theme-framework/palettes';

const PALETTE_PREVIEW_COOKIE = 'heuresys-palette-preview';

async function resolveActivePalette(): Promise<ActivePaletteState> {
  const cookieStore = await cookies();
  const previewRaw = cookieStore.get(PALETTE_PREVIEW_COOKIE)?.value;
  if (previewRaw) {
    try {
      const parsed = JSON.parse(previewRaw) as unknown;
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
      // Fall through to file-backed default.
    }
  }
  return readActivePalette();
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Heuresys — Workforce Orchestration',
  description: 'Heuresys.com.evo — Organizational Intelligence platform',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  openGraph: {
    title: 'Heuresys — Workforce Orchestration',
    description: 'Organizational Intelligence & Workforce Orchestration platform',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Heuresys' }],
    type: 'website',
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heuresys — Workforce Orchestration',
    description: 'Organizational Intelligence & Workforce Orchestration platform',
    images: ['/og-image.png'],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { palette, theme } = await resolveActivePalette();
  return (
    <html
      lang="it"
      data-theme={theme}
      data-palette={palette}
      className={`${inter.variable} ${exo2.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemePreviewInjector />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
