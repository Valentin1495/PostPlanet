'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function LoginForm() {
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const supabase = createClient();

  const signInWithProvider = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const continueAsGuest = async () => {
    setIsGuestLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    setIsGuestLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    window.location.href = '/onboarding';
  };

  return (
    <div className='w-72 space-y-4'>
      <Button
        type='button'
        className='w-full'
        disabled={isGuestLoading}
        onClick={continueAsGuest}
      >
        {isGuestLoading ? 'Please wait...' : 'Try it as a guest 👀'}
      </Button>

      <div className='flex items-center gap-2 text-muted-foreground text-sm'>
        <div className='h-px bg-border flex-1' />
        or
        <div className='h-px bg-border flex-1' />
      </div>

      <div className='space-y-2'>
        <Button
          type='button'
          variant='secondary'
          className='w-full'
          onClick={() => signInWithProvider('google')}
        >
          Continue with Google
        </Button>
        <Button
          type='button'
          variant='outline'
          className='w-full'
          onClick={() => signInWithProvider('github')}
        >
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}
