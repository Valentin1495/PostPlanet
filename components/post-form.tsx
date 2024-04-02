'use client';

import TextareaAutosize from 'react-textarea-autosize';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { ImagePlus, X } from 'lucide-react';
import { createPost } from '@/actions/post.actions';
import { Input } from './ui/input';
import Image from 'next/image';
import { toast } from 'sonner';

const initialState = {
  message: '',
};

export default function PostForm({ profilePic }: { profilePic?: string }) {
  const [text, setText] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewurl, setPreviewurl] = useState<string | null>(null);
  const [state, formAction] = useFormState(createPost, initialState);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setPreviewurl(reader.result as string);
      };
    } else {
      setPreviewurl(null);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (state.message) {
      setText('');
      setSelectedFile(null);
      setPreviewurl(null);
      toast(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className='border-b-2 border-b-secondary p-3 space-y-2'
    >
      <section className='flex gap-2'>
        <Link href='/profile'>
          <Avatar className='w-10 h-10 darker'>
            <AvatarImage src={profilePic} alt='profile picture' />
            <AvatarFallback className='bg-primary/10'>
              <Skeleton className='rounded-full' />
            </AvatarFallback>
          </Avatar>
        </Link>
        {mounted && (
          <TextareaAutosize
            className='resize-none w-full outline-none my-auto text-lg'
            minRows={1}
            placeholder='What is happening?!'
            value={text}
            onChange={(e) => setText(e.target.value)}
            id='text'
            name='text'
          />
        )}
      </section>
      {previewurl && (
        <section className='relative ml-10 aspect-video rounded-xl overflow-hidden'>
          <Image
            src={previewurl}
            alt='image to post'
            fill
            className='object-cover'
          />
          <article
            onClick={() => setPreviewurl(null)}
            className='absolute top-2 right-2 bg-black p-1 rounded-full hover:opacity-70 cursor-pointer transition'
          >
            <X color='white' size={20} />
          </article>
        </section>
      )}
      <div className='justify-end flex items-center gap-2'>
        <Input
          className='hidden'
          type='file'
          ref={fileRef}
          onChange={handleFileChange}
          name='imageToPost'
          id='imageToPost'
        />
        <section
          className='hover:bg-secondary p-2.5 rounded-full transition cursor-pointer'
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus size={18} className='text-primary' />
        </section>
        <SubmitButton text={text} file={selectedFile} />
      </div>
    </form>
  );
}

type SubmitButtonProps = {
  text: string;
  file: File | null;
};

function SubmitButton({ text, file }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className='rounded-full h-8'
      disabled={(!text.trim() && !file) || pending}
    >
      {pending ? 'Posting...' : 'Post'}
    </Button>
  );
}
