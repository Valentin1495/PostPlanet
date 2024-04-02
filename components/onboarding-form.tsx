'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createUser } from '@/actions/user.actions';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ImagePlus } from 'lucide-react';
import { Textarea } from './ui/textarea';

type OnboardingFormProps = {
  imageUrl?: string;
  firstName?: string | null;
  lastName?: string | null;
};

const initialState = {
  message: '',
};

export default function OnboardingForm({
  imageUrl,
  firstName,
  lastName,
}: OnboardingFormProps) {
  const [state, formAction] = useFormState(createUser, initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };
  const onboarded = state.message === 'Onboarded.';
  const onboardingFailed = state.message && state.message !== 'Onboarded.';

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  useEffect(() => {
    const defaultName = firstName && lastName ? `${firstName} ${lastName}` : '';
    setName(defaultName);
  }, []);

  if (onboarded) redirect('/home?feed=for-you');
  return (
    <div className='w-1/2 xl:w-1/3'>
      <h1 className='text-2xl font-bold'>Onboarding</h1>
      <p className='mb-3'>
        Complete your profile now, <br /> to use PostPlanet.
      </p>
      <form
        action={formAction}
        className='space-y-5 bg-secondary px-5 pb-5 pt-2 rounded-md'
      >
        <Input
          type='file'
          id='profileImage'
          name='profileImage'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
          ref={fileRef}
        />

        <section className='flex justify-center'>
          {previewUrl ? (
            <section className='relative w-32 h-32'>
              <Image
                src={previewUrl}
                alt='profile image'
                fill
                priority
                className='rounded-full object-cover'
              />
              <article
                className='hover:opacity-90 cursor-pointer transition bg-black/60 rounded-full p-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                onClick={() => fileRef.current?.click()}
              >
                <ImagePlus size={18} className='text-secondary' />
              </article>
            </section>
          ) : imageUrl ? (
            <section className='relative w-32 h-32'>
              <Image
                priority
                src={imageUrl}
                alt='profile image'
                fill
                className='rounded-full object-cover'
              />
              <article
                className='hover:opacity-90 cursor-pointer transition bg-black/60 rounded-full p-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                onClick={() => fileRef.current?.click()}
              >
                <ImagePlus size={18} className='text-secondary' />
              </article>
            </section>
          ) : (
            <section className='bg-primary/10 rounded-full w-32 h-32 flex justify-center items-center'>
              <article
                className='hover:opacity-90 cursor-pointer transition bg-black/60 rounded-full p-3'
                onClick={() => fileRef.current?.click()}
              >
                <ImagePlus size={18} className='text-secondary' />
              </article>
            </section>
          )}
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
        <SubmitButton
          file={selectedFile}
          username={username.trim()}
          name={name.trim()}
        />
        {onboardingFailed && (
          <p className='text-destructive text-center whitespace-pre-line text-sm'>
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}

type SubmitButtonProps = {
  file: File | null;
  username: string;
  name: string;
};

function SubmitButton({ file, username, name }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      className='w-full'
      disabled={pending || !username || !name || !file}
    >
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}
