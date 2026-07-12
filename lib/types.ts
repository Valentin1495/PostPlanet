export type FileType = {
  url: string;
  name: string;
};

export type User = {
  id: string;
  username: string;
  name: string;
  bio: string | null;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  text: string | null;
  image: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type Reply = {
  id: string;
  text: string | null;
  image: string | null;
  postId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type ReplyWithPost = Reply & {
  post: Post;
  author: User;
};

export type ActivityType = 'follow' | 'like' | 'reply';

export type Activity = {
  id: string;
  type: ActivityType;
  giverId: string;
  receiverId: string;
  postId: string | null;
  text: string | null;
  createdAt: string;
};

export type PostInfo = {
  author: User;
  hasLiked: boolean | undefined;
  replyCount: number;
  followers: number;
  likesCount: number | undefined;
};
