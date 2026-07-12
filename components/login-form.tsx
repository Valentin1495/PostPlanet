'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setIsSubmitting(false);

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
          variant='secondary'
          className='w-full'
          onClick={() => signInWithProvider('github')}
        >
          Continue with GitHub
        </Button>
      </div>

      <div className='flex items-center gap-2 text-muted-foreground text-sm'>
        <div className='h-px bg-border flex-1' />
        or
        <div className='h-px bg-border flex-1' />
      </div>

      <form onSubmit={handleSubmit} className='space-y-3'>
        <div className='space-y-1.5'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting
            ? 'Please wait...'
            : mode === 'sign-in'
              ? 'Log in'
              : 'Sign up'}
        </Button>
      </form>

      <button
        type='button'
        className='text-sm text-muted-foreground hover:text-primary w-full text-center'
        onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
      >
        {mode === 'sign-in'
          ? "Don't have an account? Sign up"
          : 'Already have an account? Log in'}
      </button>
    </div>
  );
}
