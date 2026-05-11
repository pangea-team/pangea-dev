import type { Metadata } from 'next';
import PostLoginStartView from './_components/PostLoginStartView';

export const metadata: Metadata = {
  title: '시작 | Pangea',
};

export default function PostLoginStartPage() {
  return <PostLoginStartView />;
}
