'use client';

import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

export default function SearchBar() {
  const [focus, setFocus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [preventBlur, setPreventBlur] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('f');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(
          filter
            ? `/search?q=${searchQuery}&f=user`
            : `/search?q=${searchQuery}`
        );
      }}
      className={cn(
        'rounded-full flex pl-5 pr-1 py-3 items-center border mx-5 mb-5',
        focus
          ? 'bg-background border-primary'
          : 'bg-secondary border-transparent'
      )}
    >
      <Search
        size={20}
        className={cn(
          focus ? 'text-primary' : 'text-muted-foreground',
          'min-w-5'
        )}
      />

      <input
        ref={inputRef}
        placeholder='Search'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          if (!preventBlur) setFocus(false);
        }}
        className='outline-none bg-transparent focus:bg-background w-full ml-5'
      />
      {searchQuery && focus && (
        <button
          type='button'
          onMouseDown={() => setPreventBlur(true)}
          onMouseUp={() => setPreventBlur(false)}
          onClick={() => {
            setSearchQuery('');
            setFocus(true);
            inputRef.current?.focus();
          }}
          disabled={!searchQuery}
          className='rounded-full bg-primary p-1 darker mr-4'
        >
          <X size={16} color='hsl(var(--background))' />
        </button>
      )}
    </form>
  );
}
