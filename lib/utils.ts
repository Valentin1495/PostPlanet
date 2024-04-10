import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { Post, Reply, User } from '@prisma/client';

type ReplyWithPost = (Reply & {
  post: Post;
  author: User;
})[];

type RepliesByPost = {
  [key: string]: {
    post: Post;
    replies: Reply[];
  };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function has24HoursPassed(date: Date) {
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate.getTime() - date.getTime();
  const hoursPassed = differenceInMilliseconds / (1000 * 60 * 60);

  return hoursPassed >= 24;
}

function isPastYear(date: Date) {
  const currentYear = new Date().getFullYear();
  const givenYear = date.getFullYear();

  // Check if the given year is before the current year
  return givenYear < currentYear;
}

export function getSimpleDate(date: Date) {
  if (isPastYear(date)) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (has24HoursPassed(date)) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  return formatDistanceToNowStrict(date);
}

export function getDetailedDate(date: Date) {
  const formattedDate = format(date, 'h:mm a · MMM d, yyyy');

  return formattedDate;
}

export function groupRepliesByPost(replies: ReplyWithPost) {
  const repliesByPostId: RepliesByPost = replies.reduce<RepliesByPost>(
    (acc, reply) => {
      const { postId } = reply;

      // If the post ID doesn't exist in the accumulator, initialize it
      if (!acc[postId]) {
        acc[postId] = {
          post: reply.post,
          replies: [],
        };
      }

      // Add the reply to the array for its post
      acc[postId].replies.push(reply);

      return acc;
    },
    {}
  );

  return Object.values(repliesByPostId);
}
