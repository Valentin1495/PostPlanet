'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TabsProps = {
  username?: string;
  tabItems: {
    path: string;
    label: string;
  }[];
};

export default function Tabs({ username, tabItems }: TabsProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        !username && 'sticky top-0',
        'flex h-12 backdrop-blur-md z-10'
      )}
    >
      {tabItems.map((item, i) => {
        const { label, path } = item;
        const isActive = pathname.includes(path);

        return (
          <Link
            key={i}
            className={cn(
              'relative border-b-[0.5px] w-1/2 text-center hover:bg-secondary transition-colors duration-300',
              isActive ? 'font-bold' : 'font-medium'
            )}
            href={username ? `/${username}${path}` : path}
          >
            <span className='text-sm absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
              {label}
            </span>
            {isActive && (
              <div className='h-1 w-12 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full'></div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
