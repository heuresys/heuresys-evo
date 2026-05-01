import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Heuresys — Workforce Orchestration',
  description: 'Heuresys.com.evo — Organizational Intelligence platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
