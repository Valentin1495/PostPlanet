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
  const { username, profileImage, id } = (await readUser(user.id)) as User;

  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <div className='flex items-start max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto lg:pr-8 xl:px-5'>
            <LeftSidebar
              username={username}
              userId={id}
              profileImage={profileImage}
            />
            <div className='w-full border-l sm:border-r'>{children}</div>
            <RightSidebar />
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
