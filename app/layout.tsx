import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abebe Zeleke Hotel — Guest Portal',
  description: 'Your stay at Abebe Zeleke International Hotel'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
