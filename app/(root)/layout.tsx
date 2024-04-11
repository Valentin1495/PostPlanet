import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import LeftSidebar from '@/components/left-sidebar';
import RightSidebar from '@/components/right-sidebar';
import { ClerkProvider, currentUser } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { readUser } from '@/actions/user.actions';
import { User as U } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PostPlanet',
  description:
    'A vibrant social media platform designed for quick, engaging conversations, allowing users to share updates, follow trends, and connect with a global community in real-time',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = (await currentUser()) as U;
  const { username } = (await readUser(user.id)) as User;

  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <div className='max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto flex items-start'>
            <LeftSidebar username={username} />
            <div className='w-full md:w-2/3 border-l sm:border-r'>
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
