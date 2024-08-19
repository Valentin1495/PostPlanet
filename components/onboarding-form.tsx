'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createUser } from '@/actions/user.actions';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { FileType } from '@/lib/types';
import { AvatarPicture } from './avatar-picture';
import UploadProfilePic from './upload/upload-profile-pic';

type OnboardingFormProps = {
  imageUrl: string;
  fullName: string;
};

const initialState = {
  message: '',
};

export default function OnboardingForm({
  imageUrl,
  fullName,
}: OnboardingFormProps) {
  const [state, onboardUser] = useFormState(createUser, initialState);
  const [file, setFile] = useState<FileType | null>(null);
  const [image, setImage] = useState(imageUrl);
  const [username, setUsername] = useState('');
  const [mouseEnter, setMouseEnter] = useState(false);
  const [name, setName] = useState('');
  const router = useRouter();
  const successful = state.message === 'Success';
  const failed = state.message && !successful;

  useEffect(() => {
    setName(fullName);
  }, [fullName]);

  useEffect(() => {
    if (successful) {
      router.push('/home');
    }

    if (failed) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className='w-1/2 xl:w-1/3'>
      <p className='text-xl text-center font-bold mb-5'>
        Welcome to PostPlanet! 🥳
      </p>
      <form
        action={onboardUser}
        className='space-y-5 bg-violet-50 px-5 pb-5 pt-2 rounded-md'
      >
        {file ? (
          <div
            onMouseEnter={() => setMouseEnter(true)}
            onMouseLeave={() => setMouseEnter(false)}
            onClick={() => {
              setFile(null);
            }}
            className='relative rounded-full size-32 center cursor-pointer mx-auto'
          >
            <AvatarPicture src={file.url} alt={file.name} className='size-32' />
            <Input
              value={file.url}
              className='hidden'
              name='fileUrl'
              type='hidden'
              readOnly
            />

            {mouseEnter && (
              <section className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center'>
                <h3 className='text-xs text-center font-bold text-primary-foreground dark:text-foreground'>
                  CHANGE <br /> PICTURE
                </h3>
              </section>
            )}
          </div>
        ) : image ? (
          <div
            onMouseEnter={() => setMouseEnter(true)}
            onMouseLeave={() => setMouseEnter(false)}
            onClick={() => {
              setImage('');
            }}
            className='relative rounded-full size-32 center cursor-pointer mx-auto'
          >
            <section
              className='size-32 rounded-full mx-auto'
              style={{
                backgroundColor: image,
              }}
            />
            <Input
              value={image}
              className='hidden'
              name='image'
              type='hidden'
              readOnly
            />
            {mouseEnter && (
              <section className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center'>
                <h3 className='text-xs text-center font-bold text-primary-foreground dark:text-foreground'>
                  CHANGE <br /> PICTURE
                </h3>
              </section>
            )}
          </div>
        ) : (
          <UploadProfilePic
            handleFile={setFile}
            handleMouseEnter={setMouseEnter}
          />
        )}

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

        <div className='text-end'>
          <SubmitButton
            fileUrl={file?.url}
            image={image}
            username={username.trim()}
            name={name.trim()}
          />
        </div>
      </form>
    </div>
  );
}

type SubmitButtonProps = {
  fileUrl?: string;
  image: string;
  username: string;
  name: string;
};

function SubmitButton({ fileUrl, username, name, image }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className='w-[66px]'
      disabled={pending || !username || !name || (!fileUrl && !image)}
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
