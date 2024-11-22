import { atom } from 'recoil';

export type DialogState = {
  createPost: boolean;
  deletePost: boolean;
  deleteReply: boolean;
  replyToPost: boolean;
};

type DialogData = {
  [key: string]: any;
};

export const dialogState = atom<DialogState>({
  key: 'dialogState',
  default: {
    createPost: false,
    deletePost: false,
    deleteReply: false,
    replyToPost: false,
  },
});

export const dialogData = atom<DialogData>({
  key: 'dialogdata',
  default: {},
});
