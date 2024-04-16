'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type ProfileTabsProps = {
  username: string;
  tabItems: {
    path: string;
    label: string;
  }[];
};

export default function ProfileTabs({ username, tabItems }: ProfileTabsProps) {
  const pathname = usePathname();

  return (
    <div className='flex h-12 backdrop-blur-md z-10'>
      {tabItems.map((item, i) => {
        const { label, path } = item;
        const isActive = pathname.includes(path);

        return (
          <Link
            key={i}
            className={cn(
              'relative border-b w-1/2 text-center hover:bg-secondary transition-colors duration-300',
              isActive ? 'font-bold' : 'font-medium'
            )}
            href={`/${username}${path}`}
          >
            <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
              {label}
            </span>
            {isActive && (
              <div
                className={cn(
                  'h-1 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full',
                  label === 'Replies' ? 'w-[76px]' : 'w-14'
                )}
              ></div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
