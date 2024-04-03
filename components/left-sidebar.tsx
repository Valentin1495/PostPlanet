'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { SignOutButton, SignedIn } from '@clerk/nextjs';
import { CircleUser, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function LeftSidebar({ username }: { username?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isProfilePage = pathname === `/${username}`;

  return (
    <nav className='w-1/6 xl:w-1/4 py-5 flex flex-col gap-5 items-center xl:items-start sticky top-0 min-h-screen md:pl-10 xl:pl-24'>
      <Link
        className='text-xl inline-block font-bold p-3 hover:bg-secondary shadow-secondary rounded-full duration-300'
        href='/'
      >
        <Image src='/logo.svg' alt='logo' width={28} height={28} />
      </Link>

      {sidebarLinks.map((link) => {
        const { activeIcon, href, icon, label } = link;
        const active = pathname === href;
        return (
          <Link
            key={label}
            className='flex items-center gap-2 hover:bg-secondary p-3 rounded-full duration-300 max-w-fit'
            href={href}
          >
            {active ? activeIcon : icon}
            <span
              className={cn(
                'text-lg hidden xl:inline',
                active && 'font-bold text-primary'
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
      <Link
        href={`/${username}`}
        className='flex items-center gap-2 hover:bg-secondary p-3 rounded-full duration-300 max-w-fit'
      >
        <CircleUser
          size='28'
          strokeWidth={isProfilePage ? 2 : 1.5}
          className={cn(isProfilePage && 'text-primary')}
        />
        <span
          className={cn(
            'text-lg hidden xl:inline',
            isProfilePage && 'font-bold text-primary'
          )}
        >
          Profile
        </span>
      </Link>

      <div className='mt-auto mb-5 max-w-fit cursor-pointer'>
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className='flex items-center gap-2 hover:bg-secondary p-3 rounded-full duration-300'>
              <LogOut size='28' strokeWidth='1.5' />
              <span className='text-lg hidden xl:inline'>Log out</span>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </nav>
  );
}
