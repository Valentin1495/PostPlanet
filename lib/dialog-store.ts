import { create } from 'zustand';

export type DialogName =
  | 'createPost'
  | 'deletePost'
  | 'deleteReply'
  | 'replyToPost'
  | 'logout';

type DialogState = Record<DialogName, boolean>;
type DialogData = Partial<Record<DialogName, any>>;

type DialogStore = {
  dialogs: DialogState;
  data: DialogData;
  openDialog: (dialogName: DialogName, data?: any) => void;
  closeDialog: (dialogName: DialogName) => void;
};

export const useDialogStore = create<DialogStore>((set) => ({
  dialogs: {
    createPost: false,
    deletePost: false,
    deleteReply: false,
    replyToPost: false,
    logout: false,
  },
  data: {},
  openDialog: (dialogName, data) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [dialogName]: true },
      data: data ? { ...state.data, [dialogName]: data } : state.data,
    })),
  closeDialog: (dialogName) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [dialogName]: false },
      data: { ...state.data, [dialogName]: undefined },
    })),
}));
