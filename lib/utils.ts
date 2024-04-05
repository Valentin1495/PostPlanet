import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const thisYear = new Date().getFullYear();
  const formattedDate = thisYear
    ? date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })
    : date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  return formattedDate;
}

export function pickRandomElements<T>(number: number, array: T[]) {
  const result: T[] = [];
  const usedIndices = new Set();

  while (result.length < number) {
    const randomIndex = Math.floor(Math.random() * array.length);

    if (!usedIndices.has(randomIndex)) {
      result.push(array[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  return result;
}
