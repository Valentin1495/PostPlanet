import { Button } from './ui/button';
import { useFormStatus } from 'react-dom';

export default function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      className='rounded-full w-full'
      variant='destructive'
      disabled={pending}
    >
      {pending ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
