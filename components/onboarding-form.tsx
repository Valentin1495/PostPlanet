'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createUser } from '@/actions/user.actions';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Textarea } from './ui/textarea';
import UploadBtn from './upload-btn';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';

type OnboardingFormProps = {
  imageUrl?: string;
  firstName?: string | null;
  lastName?: string | null;
  userId: string;
};

const initialState = {
  message: '',
};

export default function OnboardingForm({
  imageUrl,
  firstName,
  lastName,
  userId,
}: OnboardingFormProps) {
  const [state, onboardUser] = useFormState(createUser, initialState);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');

  const onboarded = state.message === 'Onboarded.';
  const onboardingFailed = state.message && state.message !== 'Onboarded.';

  useEffect(() => {
    const defaultName = firstName && lastName ? `${firstName} ${lastName}` : '';
    setName(defaultName);
  }, [firstName, lastName]);

  useEffect(() => {
    if (onboardingFailed) {
      toast(state.message);
    }
  }, [state, onboardingFailed]);

  if (onboarded) redirect('/home');
  return (
    <div className='w-1/2 xl:w-1/3'>
      <h1 className='text-2xl text-center font-bold'>Onboarding</h1>
      <p className='mb-3 text-center font-medium'>Welcome to PostPlanet! 🥳</p>
      <form
        action={onboardUser}
        className='space-y-5 bg-primary/15 px-5 pb-5 pt-2 rounded-md'
      >
        <section className='flex flex-col items-center gap-2.5'>
          {fileUrl ? (
            <Avatar className='w-32 h-32'>
              <AvatarImage src={fileUrl} />
              <AvatarFallback className='bg-primary/25'>
                <Skeleton className='rounded-full' />
              </AvatarFallback>
            </Avatar>
          ) : imageUrl ? (
            <Avatar className='w-32 h-32'>
              <AvatarImage src={imageUrl} />
              <AvatarFallback className='bg-primary/25'>
                <Skeleton className='rounded-full' />
              </AvatarFallback>
            </Avatar>
          ) : (
            <section className='bg-background rounded-full w-32 h-32 flex justify-center items-center'></section>
          )}
          <Input value={fileUrl} className='hidden' name='fileUrl' readOnly />
          <UploadBtn setFileUrl={setFileUrl} />
        </section>

        <section className='space-y-2'>
          <Label htmlFor='username'>Username</Label>
          <Input
            placeholder='Username'
            id='username'
            name='username'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </section>
        <section className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input
            placeholder='Name'
            id='name'
            name='name'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </section>
        <section className='gap-y-2 flex flex-col'>
          <Label htmlFor='bio'>Bio (optional)</Label>
          <Textarea
            placeholder='Bio'
            id='bio'
            name='bio'
            rows={3}
            className='outline-none resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          />
        </section>
        <Input className='hidden' name='userId' value={userId} readOnly />
        <SubmitButton
          file={fileUrl}
          username={username.trim()}
          name={name.trim()}
        />
      </form>
    </div>
  );
}

type SubmitButtonProps = {
  file: string;
  username: string;
  name: string;
};

function SubmitButton({ file, username, name }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      className='w-[66px]'
      disabled={pending || !username || !name || !file}
    >
      {pending ? (
        <span className='pending'>
          <span></span>
          <span></span>
          <span></span>
        </span>
      ) : (
        'Save'
      )}
    </Button>
  );
}
