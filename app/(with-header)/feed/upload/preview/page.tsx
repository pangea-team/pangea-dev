import { redirect } from 'next/navigation';
import { PATH } from '@/constants/path';

export default function FeedUploadPreviewPage() {
  redirect(PATH.FEED_UPLOAD);
}
