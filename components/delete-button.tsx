import { Button } from './ui/button';

type DeleteButtonProps = {
  isPending: boolean;
  remove: () => void;
};

export default function DeleteButton({ isPending, remove }: DeleteButtonProps) {
  return (
    <Button
      className='rounded-full w-full font-bold'
      variant='destructive'
      onClick={remove}
      disabled={isPending}
    >
      {isPending ? (
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
