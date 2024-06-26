import { Button } from './ui/button';
import { useFormStatus } from 'react-dom';

export default function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      className='rounded-full w-full font-bold'
      variant='destructive'
      disabled={pending}
    >
      {pending ? (
        <span className='pending'>
          <span></span>
          <span></span>
          <span></span>
        </span>
      ) : (
        'Delete'
      )}
    </Button>
  );
}
