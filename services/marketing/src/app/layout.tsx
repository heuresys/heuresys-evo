import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Heuresys — Organizational Intelligence & Workforce Orchestration',
  description:
    'SaaS B2B per governare processi, struttura, ruoli, competenze e performance attraverso un Knowledge Graph ESCO bilingue.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
