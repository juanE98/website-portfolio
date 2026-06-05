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

// Allow the FPL backend as a fetch target without hardcoding its origin.
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_FPL_API_URL ?? '').origin;
  } catch {
    return '';
  }
})();

// CSP delivered via <meta> — the only header mechanism available to a static
// GitHub Pages export. 'unsafe-inline' is required for Next.js hydration
// bootstrap scripts and next/font inline styles (no nonce possible without a
// server). Even so, locking down object/base/connect/img sources meaningfully
// reduces the blast radius of any injection.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.simpleicons.org",
  "font-src 'self'",
  `connect-src 'self'${apiOrigin ? ` ${apiOrigin}` : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${workSans.variable} ${jetBrainsMono.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body>
        <Background />
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
