'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createUser } from '@/app/actions';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ImagePlus } from 'lucide-react';
import { Textarea } from './ui/textarea';

const initialState = {
  message: '',
};

export default function OnboardingForm() {
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

  if (onboarded) redirect('/home?feed=for-you');
  return (
    <form action={formAction} className='space-y-3 w-1/2 xl:w-1/3'>
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
          <section className='relative w-32 h-32 rounded-full'>
            <Image
              src={previewUrl}
              alt='profile image'
              fill
              objectFit='cover'
              className='rounded-full'
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
  );
}

type Props = {
  file: File | null;
  username: string;
  name: string;
};

function SubmitButton({ file, username, name }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant='default'
      type='submit'
      className='w-full'
      disabled={pending || !username || !name || !file}
    >
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}
