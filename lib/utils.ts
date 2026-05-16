import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/';
  }
  let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000/';
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};
