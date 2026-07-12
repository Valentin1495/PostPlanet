import { useDialogStore } from '@/lib/dialog-store';

export const useDialog = () => {
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const dialogs = useDialogStore((state) => state.dialogs);
  const data = useDialogStore((state) => state.data);

  return { openDialog, closeDialog, dialogs, data };
};
