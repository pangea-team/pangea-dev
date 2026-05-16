import { FeedUploadDraftProvider } from './_lib/feed-upload-draft-context';

export default function FeedUploadLayout({ children }: { children: React.ReactNode }) {
  return <FeedUploadDraftProvider>{children}</FeedUploadDraftProvider>;
}
