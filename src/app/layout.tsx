import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import './globals.scss';

const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: 'Juan Espares - Portfolio',
  description: 'Personal portfolio website of Juan Espares - Software Developer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={workSans.variable}>
      <body>{children}</body>
    </html>
  );
}
