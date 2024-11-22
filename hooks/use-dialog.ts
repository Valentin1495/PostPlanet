import { dialogData, DialogState, dialogState } from '@/lib/dialog-atoms';
import { useRecoilState } from 'recoil';

export const useDialog = () => {
  const [dialogs, setDialogs] = useRecoilState(dialogState);
  const [data, setData] = useRecoilState(dialogData);

  const openDialog = (dialogName: keyof DialogState, data?: any) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: true }));
    if (data) setData((prev) => ({ ...prev, [dialogName]: data }));
  };

  const closeDialog = (dialogName: keyof DialogState) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: false }));
    setData((prev) => ({ ...prev, [dialogName]: undefined })); // 데이터 초기화
  };

  return { openDialog, closeDialog, dialogs, data };
};
