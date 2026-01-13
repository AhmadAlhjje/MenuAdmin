import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutClient } from '@/app/layout-client';

export const metadata: Metadata = {
  title: 'Menu Admin Dashboard',
  description: 'Restaurant Menu Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
