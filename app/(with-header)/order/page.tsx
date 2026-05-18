import Image from 'next/image';
import { redirect } from 'next/navigation';
import { PATH } from '@/constants/path';
import { getUserId } from '@/lib/supabase/auth-helpers';
import OrderForm from './_components/OrderForm';
import { getOrderContext } from './_lib/get-order-context';

type Props = {
  searchParams: Promise<{ savedSentenceId?: string }>;
};

export default async function OrderPage({ searchParams }: Props) {
  const userId = await getUserId();
  if (!userId) redirect(PATH.KAKAO_LOGIN);

  const { savedSentenceId } = await searchParams;
  if (!savedSentenceId) redirect(PATH.CART);

  const context = await getOrderContext(savedSentenceId, userId);
  const sentence = context?.sentences;
  const book = sentence?.books;
  if (!context || !sentence || !book) redirect(PATH.CART);

  const paragraph = sentence.content[context.content_index] ?? '';
  // 책 제목은 배송 전까지 노출 금지 — book.title은 화면에 렌더하지 않는다.
  const bookLabel = `No.${String(book.book_no).padStart(2, '0')}`;
  const moodAndKeyword = [book.mood, ...book.keyword].filter(Boolean).join(', ');
  const total = book.price + book.shipping_fee;

  return (
    <div className="mx-auto w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl px-content-x py-content-y">
      <header className="mb-section-sm flex flex-col gap-2">
        <h1 className="text-noto-title-2 text-primary">주문하기</h1>
        <p className="text-pretendard-body-2 text-purple3">
          책 배송을 위한 기본 정보를 입력해 주세요.
        </p>
      </header>

      <section className="mb-section-sm flex flex-col gap-comp-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-noto-subtitle-1 text-primary whitespace-nowrap">상품</h2>
          <hr className="flex-1 border-purple3 border-t" />
        </div>

        <div className="flex gap-6">
          <div className="relative h-40 w-28 shrink-0 sm:h-48 sm:w-32">
            <Image
              src={book.cover_image}
              alt={bookLabel}
              fill
              sizes="(max-width: 640px) 112px, 128px"
              className="object-cover shadow-card"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-noto-subtitle-2 text-primary">{bookLabel}</span>
            <span className="text-pretendard-body-2 text-purple3">{moodAndKeyword}</span>
            <p className="text-pretendard-body-2 text-text line-clamp-4">“{paragraph}”</p>
          </div>
        </div>

        <hr className="border-purple3 border-t" />

        <div className="flex flex-col gap-2 text-pretendard-body-1">
          <Row label="상품가격" value={`${book.price.toLocaleString('ko-KR')} 원`} />
          <Row label="배송비" value={`${book.shipping_fee.toLocaleString('ko-KR')} 원`} />
        </div>

        <hr className="border-purple3 border-t" />

        <div className="flex items-center justify-between text-noto-subtitle-1 text-primary">
          <span>Total</span>
          <span>{total.toLocaleString('ko-KR')} 원</span>
        </div>
      </section>

      <OrderForm savedSentenceId={context.id} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-purple2">{label}</span>
      <span className="text-text">{value}</span>
    </div>
  );
}
