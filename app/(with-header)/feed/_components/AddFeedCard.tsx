import Link from 'next/link';
import { PATH } from '@/constants/path';

export default function AddFeedCard() {
  return (
    <Link
      href={PATH.FEED_UPLOAD}
      className="group inline-flex items-center gap-2 rounded-full bg-purple2 px-5 py-2.5 text-pretendard-body-2 text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
      aria-label="피드 추가하기"
    >
      <span className="text-base leading-none">+</span>
      <span>흔적 남기기</span>
    </Link>
  );
}
