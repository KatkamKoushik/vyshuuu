import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteShell } from '@/components/layout/SiteShell';
import { GlobalCanvas } from '@/experience/GlobalCanvas';

export const metadata: Metadata = {
  title: 'VYSHUUU — The Unstitched Continuum',
  description:
    'A luxury digital fashion house experience centered on the Indian saree, handloom intelligence, and unstitched silk architecture.',
  keywords: ['haute couture', 'saree', 'handloom', 'digital fashion', 'vyshuuu', 'vyshnavi', 'silk'],
  openGraph: {
    title: 'VYSHUUU — The Unstitched Continuum',
    description: 'The saree is the subject. The browser is the digital loom.',
    type: 'website',
    locale: 'en_US',
    siteName: 'VYSHUUU',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0A09',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen relative overflow-x-hidden antialiased">
        <GlobalCanvas />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
