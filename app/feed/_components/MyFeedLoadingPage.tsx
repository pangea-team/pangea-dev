import Image from 'next/image';
import Header from '@/components/Header';

const ELLIPSE_CENTER_SRC = '/icons/ellipse-center.svg';
const LOADING_DOT_SRC = '/icons/Loading.svg';

export default function MyFeedLoadingPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main
        className="flex min-h-0 flex-1 flex-col items-center justify-start gap-section-sm px-page-x pt-hero"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">피드를 불러오는 중입니다.</span>
        <Image
          src={ELLIPSE_CENTER_SRC}
          alt=""
          width={96}
          height={98}
          className="mt-12 h-[98px] w-24 shrink-0"
          unoptimized
          priority
        />
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <p className="text-noto-subtitle-1 text-center whitespace-normal">
              하나가 만들어지고 있습니다.
            </p>
            <div className="flex items-center justify-center" aria-hidden>
              {(['dot-1', 'dot-2', 'dot-3', 'dot-4'] as const).map((id) => (
                <Image
                  key={id}
                  src={LOADING_DOT_SRC}
                  alt=""
                  width={24}
                  height={80}
                  className="h-20 w-6 shrink-0"
                  unoptimized
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
