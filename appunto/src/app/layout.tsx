'use client'

import './globals.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <html lang="en">
      <body className={isHome ? 'notebook-cover' : 'notebook-background min-h-screen m-0 p-0 text-black'}>
        <header>
            {!isHome && (<Link href="/" className="appunto-logo">appunto.</Link>)}
        </header>
        <main>
            {children}
        </main>
      </body>
    </html>
  );
}
