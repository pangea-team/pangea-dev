import Link from 'next/link';
import { PATH } from '@/constants/path';

type Props = {
  params: Promise<{ bookId: string }>;
};

export default async function SentencePage({ params }: Props) {
  const { bookId } = await params;
  return (
    <div className="mx-auto max-w-layout-form px-page-x py-section-sm">
      <p className="text-lg text-zinc-700">Sentence · bookId: {bookId}</p>
      <p className="mt-4 text-sm text-zinc-500">문장 상세(플레이스홀더)</p>
      <Link className="mt-8 inline-block text-zinc-900 underline" href={PATH.HOME}>
        ← 홈으로
      </Link>
    </div>
  );
}
