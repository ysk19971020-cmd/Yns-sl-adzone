import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Link from 'next/link';
import { SheetTitle, SheetDescription } from '@/components/ui/sheet';


const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'AdZone Lanka - Classified Ads in Sri Lanka',
  description: 'The best place to buy and sell in Sri Lanka. Post your ad on AdZone Lanka.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', ptSans.variable)}>
        <div className="relative flex min-h-screen flex-col">
          <FirebaseClientProvider>
            {/* Top Banner */}
            <div className="banner banner-top">
              <Link href="/post-ad-options">
                <span className="add-your-ad">ඔබේ දැන්වීම එක් කරන්න</span>
              </Link>
            </div>

            {/* Left Banner */}
            <div className="banner banner-left">
              <Link href="/post-ad-options">
                <span className="add-your-ad">ඔබේ දැන්වීම එක් කරන්න</span>
              </Link>
            </div>
            
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />

            {/* Right Banner */}
            <div className="banner banner-right">
              <Link href="/post-ad-options">
                <span className="add-your-ad">ඔබේ දැන්වීම එක් කරන්න</span>
              </Link>
            </div>

            {/* Bottom Banner */}
            <div className="banner banner-bottom">
              <Link href="/post-ad-options">
                <span className="add-your-ad">ඔබේ දැන්වීම එක් කරන්න</span>
              </Link>
            </div>

            <Toaster />
          </FirebaseClientProvider>
        </div>
      </body>
    </html>
  );
}
