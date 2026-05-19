import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PATH } from '@/constants/path';
import { getAppSettings } from '@/lib/app-settings';
import { getUserId } from '@/lib/supabase/auth-helpers';
import CopyAccountButton from './_components/CopyAccountButton';
import { getOrderByNumber } from './_lib/get-order';

type Props = {
  searchParams: Promise<{ orderNumber?: string }>;
};

export default async function OrderCompletePage({ searchParams }: Props) {
  const userId = await getUserId();
  if (!userId) redirect(PATH.KAKAO_LOGIN);

  const { orderNumber } = await searchParams;
  if (!orderNumber) redirect(PATH.CART);

  const [order, settings] = await Promise.all([
    getOrderByNumber(orderNumber, userId),
    getAppSettings(),
  ]);
  if (!order) redirect(PATH.CART);

  const paymentDueAt = new Date(order.payment_due_at).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="mx-auto w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl px-content-x py-content-y">
      <header className="mb-section-sm flex flex-col gap-3 text-center">
        <h1 className="text-noto-title-2 text-primary">주문이 접수되었습니다.</h1>
        <p className="text-pretendard-body-2 text-purple2">
          아래 계좌로 입금해 주시면 배송이 시작됩니다.
        </p>
      </header>

      <section className="mb-section-sm flex flex-col gap-3 text-pretendard-body-1">
        <SummaryRow label="주문번호" value={order.order_number} />
        {/* 2차 때 고치기 */}
        {/* <SummaryRow label="입금 금액" value={`${order.total_amount.toLocaleString('ko-KR')} 원`} /> */}
        <div className="flex items-center justify-between ">
          <span className="text-pretendard-body-2 text-purple2">입금 금액</span>
          <span>12,900 원</span>
        </div>
        <SummaryRow label="받는 분" value={order.recipient_name} />

        {/* <SummaryRow label="입금 기한" value={paymentDueAt} /> */}
        <SummaryRow label="입금 기한" value={'주문 후 1시간 이내'} />
        <p className="text-pretendard-caption text-red-800">
          * 입금 기한 1시간 초과 시 자동 취소됩니다. <br />*{' '}
          <span className="underline">수요일 오후 2시 전</span> ‘입금’ 완료 건에 한하여 이번주
          발송됩니다.
        </p>
      </section>

      <section className="mb-section-sm rounded-lg border border-purple3 p-6">
        <div className="flex flex-col gap-3">
          <SummaryRow label="은행" value={settings.bankName} />
          <div className="flex items-center justify-between gap-2">
            <span className="text-pretendard-body-2 text-purple2">계좌번호</span>
            <div className="flex items-center gap-3">
              <span className="text-pretendard-body-3 text-text">{settings.bankAccountNumber}</span>
              <CopyAccountButton value={settings.bankAccountNumber} />
            </div>
          </div>
          <SummaryRow label="예금주" value={settings.bankAccountHolder} />
        </div>
        <p className="mt-4 text-pretendard-body-2 text-purple3">
          입금자명은 주문자명과 동일하게 부탁드립니다.
        </p>
      </section>

      <div className="flex justify-center">
        <Link
          href={PATH.CART}
          className="text-noto-subtitle-2 text-primary underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          담아둔 것들 보기
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-pretendard-body-2 text-purple2">{label}</span>
      <span className="text-pretendard-body-1 text-text">{value}</span>
    </div>
  );
}
