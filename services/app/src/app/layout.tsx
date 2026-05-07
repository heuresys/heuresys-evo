import type { Metadata } from 'next';
import { Inter, Exo_2, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import '../styles/active-theme.css';
import { ThemePreviewInjector } from './_components/ThemePreviewInjector';
import { LocaleProvider } from '@/lib/i18n';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      data-theme="dark"
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
