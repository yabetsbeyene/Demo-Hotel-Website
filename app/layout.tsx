import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abebe Zeleke Hotel — Staff Console',
  description: 'Operations dashboard for Abebe Zeleke International Hotel'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
