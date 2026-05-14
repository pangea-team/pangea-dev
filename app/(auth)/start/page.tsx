import type { Metadata } from 'next';
import PostLoginStartPage from './_components/PostLoginStartPage';

export const metadata: Metadata = {
  title: '시작 | Pangea',
};

export default function PostLoginStart() {
  return <PostLoginStartPage />;
}
