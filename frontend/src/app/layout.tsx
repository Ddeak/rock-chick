import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import { TopBar } from '@/components/TopBar';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: {
    default: 'Rock Chick Farm',
    template: '%s | Rock Chick Farm',
  },
  description: 'Fresh baked goods from Rock Chick Farm',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fredoka.variable}`}>
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
