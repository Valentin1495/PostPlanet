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

function has24HoursPassed(date: string | Date) {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate.getTime() - parsedDate.getTime();
  const hoursPassed = differenceInMilliseconds / (1000 * 60 * 60);

  return hoursPassed >= 24;
}

function isPastYear(date: string | Date) {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const currentYear = new Date().getFullYear();
  const givenYear = parsedDate.getFullYear();

  // Check if the given year is before the current year
  return givenYear < currentYear;
}

export function getSimpleDate(date: string | Date) {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isPastYear(parsedDate)) {
    return parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (has24HoursPassed(parsedDate)) {
    return parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  return formatDistanceToNowStrict(date);
}

export function getDetailedDate(date: string | Date) {
  const formattedDate = format(
    typeof date === 'string' ? new Date(date) : date,
    'h:mm a · MMM d, yyyy'
  );

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

export const generateRandomUsername = () => {
  const prefix = 'user-';
  const length = 8;
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return prefix + randomString;
};

export const generateRandomColor = () => {
  const arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
  ];

  let hexNum = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    hexNum += arr[randomIndex];
  }

  return `#${hexNum}`;
};

export const removeAllSpaces = (str: string) => {
  return str.replace(/ /g, '');
};

export const leaveSingleSpace = (str: string) => {
  return str.trim().replace(/\s+/g, ' ');
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
