export type FileType = {
  url: string;
  name: string;
};

export type PostInfo = {
  author: {
    id: string;
    username: string;
    name: string;
    bio: string | null;
    profileImage: string;
    createdAt: Date;
    updatedAt: Date;
    followingIds: string[];
  };
  hasLiked: boolean | undefined;
  replyCount: number;
  followers: number;
  likesCount: number | undefined;
};
