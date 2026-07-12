'use client';

import { useTransition } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useDialog } from '@/hooks/use-dialog';
import { logout } from '@/actions/user.actions';

export default function LogoutDialog() {
  const { dialogs, closeDialog } = useDialog();
  const [isLoggingOut, startLogout] = useTransition();

  return (
    <Dialog open={dialogs.logout} onOpenChange={() => closeDialog('logout')}>
      <DialogContent className='w-72'>
        <DialogTitle className='text-xl'>Log out?</DialogTitle>
        <DialogDescription className='text-muted-foreground'>
          Are you sure you want to log out of your account?
        </DialogDescription>

        <Button
          className='rounded-full w-full font-bold'
          variant='destructive'
          disabled={isLoggingOut}
          onClick={() =>
            startLogout(async () => {
              closeDialog('logout');
              await logout();
            })
          }
        >
          {isLoggingOut ? (
            <span className='pending'>
              <span></span>
              <span></span>
              <span></span>
            </span>
          ) : (
            'Log out'
          )}
        </Button>
        <DialogClose className='text-sm font-bold rounded-full w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 transition-colors'>
          Cancel
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
