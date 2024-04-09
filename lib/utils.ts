import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNowStrict } from 'date-fns';

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
