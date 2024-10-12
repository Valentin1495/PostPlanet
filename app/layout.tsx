import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import ClientProvider from '@/components/client-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Home / PostPlanet',
  description:
    'Connect, share, and engage on our dynamic social media platform, where users can effortlessly post content, interact through likes and comments, and stay updated with friends and trends.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <ClientProvider>{children}</ClientProvider>
          <Toaster position='top-center' />
        </body>
      </html>
    </ClerkProvider>
  );
}
