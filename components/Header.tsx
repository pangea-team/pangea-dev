import Link from 'next/link';
import Icon from '@/components/Icon';

type Props = {
  className?: string;
};

export default function Header({ className }: Props) {
  return (
    <header
      className={`flex h-15 shrink-0 items-center justify-between px-page-x py-2 ${className ?? ''}`}
    >
      <Link href="/" className="flex items-center gap-5">
        <Icon name="logo" width={60} height={60} />
        <span className="text-cormorant-logo leading-9 tracking-[4.8px] whitespace-nowrap uppercase">
          PANGEA
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/login"
          className="text-pretendard-nav px-3 py-2 tracking-[4px] whitespace-nowrap text-primary"
        >
          Login
        </Link>
        <button
          type="button"
          className="flex h-[60px] w-[90px] shrink-0 items-center justify-center"
          aria-label="메뉴 열기"
        >
          <Icon name="menubar" width={90} height={60} className="text-primary" />
        </button>
      </div>
    </header>
  );
}
