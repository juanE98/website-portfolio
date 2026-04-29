import type { Metadata } from 'next';
import { Work_Sans, JetBrains_Mono } from 'next/font/google';
import { SWRProvider } from '@/components/SWRProvider';
import Background from '@/components/Background/Background';
import './globals.scss';

const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
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
    <html lang="en" className={`${workSans.variable} ${jetBrainsMono.variable}`}>
      <body>
        <Background />
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
