import type { Metadata } from 'next';
import './globals.css';
import '../styles/active-theme.css';
import { ThemePreviewInjector } from './_components/ThemePreviewInjector';

export const metadata: Metadata = {
  title: 'Heuresys — Workforce Orchestration',
  description: 'Heuresys.com.evo — Organizational Intelligence platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <ThemePreviewInjector />
        {children}
      </body>
    </html>
  );
}
