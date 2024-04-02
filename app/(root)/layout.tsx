import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import LeftSidebar from '@/components/left-sidebar';
import RightSidebar from '@/components/right-sidebar';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PostPlanet',
  description:
    'A vibrant social media platform designed for quick, engaging conversations, allowing users to share updates, follow trends, and connect with a global community in real-time',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <div className='max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto flex items-start'>
            <LeftSidebar />
            <div className='w-full md:w-2/3 border-l-2 md:border-r-2'>
              {children}
            </div>
            <RightSidebar />
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
