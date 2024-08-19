'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { CircleUser, LogOut, PenTool } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PostDialog from './post-dialog';
import { SignOutButton, useSession } from '@clerk/nextjs';
import { logout } from '@/actions/user.actions';

type LeftSidebarProps = {
  username: string;
  userId: string;
  profileImage: string;
};

export default function LeftSidebar({
  username,
  userId,
  profileImage,
}: LeftSidebarProps) {
  const pathname = usePathname();
  const isProfilePage = pathname.includes(username);
  const { isSignedIn } = useSession();

  return (
    <nav className='flex flex-col items-end sticky top-0 min-h-screen py-5 md:pr-4 xl:pr-8 px-2.5 sm:px-5 lg:w-44 xl:w-[500px]'>
      <div className='flex flex-col gap-5 md:items-end xl:items-start min-h-[calc(100vh-40px)] w-full'>
        <Link
          className='inline-block p-2.5 hover:bg-secondary shadow-secondary rounded-full duration-300'
          href='/home'
        >
          <Image src='/logo.svg' alt='logo' width={28} height={28} />
        </Link>

        {sidebarLinks.map((link) => {
          const { activeIcon, href, icon, label } = link;
          const isActive = pathname.includes(href);

          return (
            <Link
              key={label}
              className='flex items-center gap-4 hover:bg-secondary p-2.5 rounded-full duration-300 max-w-fit'
              href={href === '/home' ? '/home' : href}
            >
              {isActive ? activeIcon : icon}
              <span
                className={cn(
                  'text-xl hidden xl:inline',
                  isActive && 'font-semibold text-primary'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
        <Link
          href={`/${username}/posts`}
          className='flex items-center gap-4 hover:bg-secondary p-2.5 rounded-full duration-300 max-w-fit'
        >
          <CircleUser
            size='28'
            strokeWidth={isProfilePage ? 2 : 1.5}
            className={cn(isProfilePage && 'text-primary')}
          />
          <span
            className={cn(
              'text-xl hidden xl:inline',
              isProfilePage && 'font-semibold text-primary'
            )}
          >
            Profile
          </span>
        </Link>

        <PostDialog userId={userId} profileImage={profileImage}>
          Post
        </PostDialog>
        <PostDialog userId={userId} profileImage={profileImage} icon>
          <PenTool size='28' strokeWidth='1.5' className='text-background' />
        </PostDialog>

        <div className='mt-auto max-w-fit cursor-pointer'>
          {isSignedIn ? (
            <SignOutButton redirectUrl='/'>
              <div className='flex items-center gap-4 hover:bg-secondary p-2.5 rounded-full duration-300'>
                <LogOut size='28' strokeWidth='1.5' />
                <span className='text-xl hidden xl:inline'>Log out</span>
              </div>
            </SignOutButton>
          ) : (
            <button
              onClick={async () => {
                await logout();
              }}
              className='flex items-center gap-4 hover:bg-secondary p-2.5 rounded-full duration-300'
            >
              <LogOut size='28' strokeWidth='1.5' />
              <span className='text-xl hidden xl:inline'>Log out</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
