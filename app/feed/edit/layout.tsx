import { FeedEditDraftProvider } from '@/app/feed/edit/_lib/feed-edit-draft-context';

export default function FeedEditLayout({ children }: { children: React.ReactNode }) {
  return <FeedEditDraftProvider>{children}</FeedEditDraftProvider>;
}
