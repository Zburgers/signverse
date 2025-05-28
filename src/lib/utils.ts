import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines className strings with Tailwind CSS classes and handles conflicts
 * @param inputs - List of class names or conditional class objects
 * @returns A merged, de-duplicated className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
