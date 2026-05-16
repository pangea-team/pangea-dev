'use client';

import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useRef, useState, useTransition } from 'react';
import { PATH } from '@/constants/path';
import { createOrder } from '../actions';

type Props = {
  savedSentenceId: string;
};

const PHONE_REGEX = /^(010-?\d{4}-?\d{4}|01[16789]-?\d{3,4}-?\d{4})$/;
const POSTCODE_SCRIPT_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export default function OrderForm({ savedSentenceId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');

  const addressDetailRef = useRef<HTMLInputElement>(null);

  const openPostcode = () => {
    if (!window.daum?.Postcode) {
      setError('우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setError(null);
    new window.daum.Postcode({
      oncomplete: (data) => {
        const roadOrJibun =
          data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress || data.address;
        setPostalCode(data.zonecode);
        setAddress(roadOrJibun);
        // 상세 주소 입력 칸으로 포커스 이동
        requestAnimationFrame(() => addressDetailRef.current?.focus());
      },
    }).open();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!recipientName.trim()) return setError('이름을 입력해주세요.');
    if (!recipientPhone.trim()) return setError('연락처를 입력해주세요.');
    if (!PHONE_REGEX.test(recipientPhone.trim()))
      return setError('연락처 형식이 올바르지 않습니다. (예: 010-1234-5678)');
    if (!postalCode.trim()) return setError('우편번호를 입력해주세요.');
    if (!address.trim()) return setError('주소를 입력해주세요.');
    if (!addressDetail.trim()) return setError('상세 주소를 입력해주세요.');

    startTransition(async () => {
      const result = await createOrder({
        savedSentenceId,
        recipientName,
        recipientPhone,
        postalCode,
        address,
        addressDetail,
        deliveryMessage,
      });

      if ('error' in result) {
        setError(result.error);
        return;
      }

      router.push(`${PATH.ORDER_COMPLETE}?orderNumber=${result.orderNumber}`);
    });
  };

  return (
    <>
      <Script
        src={POSTCODE_SCRIPT_SRC}
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
        onLoad={() => setIsScriptReady(true)}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-section-sm">
        <Section title="받으시는 분">
          <Field label="이름">
            <input
              type="text"
              maxLength={60}
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              className="w-full border-b border-purple3 bg-transparent py-2 text-pretendard-body-1 outline-none focus:border-primary"
            />
          </Field>

          <Field label="연락처">
            <input
              type="tel"
              maxLength={20}
              placeholder="010-0000-0000"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              required
              className="w-full border-b border-purple3 bg-transparent py-2 text-pretendard-body-1 outline-none focus:border-primary"
            />
          </Field>

          <Field label="주소">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={10}
                  readOnly
                  value={postalCode}
                  placeholder="우편번호"
                  className="w-32 border-b border-purple3 bg-transparent py-2 text-pretendard-body-1 outline-none"
                />
                <button
                  type="button"
                  onClick={openPostcode}
                  disabled={!isScriptReady}
                  className="border border-purple3 px-3 py-1 text-pretendard-body-2 text-primary transition-opacity hover:opacity-70 disabled:opacity-40"
                >
                  우편번호 찾기
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={address}
                placeholder="기본 주소"
                className="w-full border-b border-purple3 bg-transparent py-2 text-pretendard-body-1 outline-none"
              />
              <input
                ref={addressDetailRef}
                type="text"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="상세 주소"
                required
                className="w-full border-b border-purple3 bg-transparent py-2 text-pretendard-body-1 outline-none focus:border-primary"
              />
            </div>
          </Field>

          <Field label="배송메시지">
            <textarea
              value={deliveryMessage}
              onChange={(e) => setDeliveryMessage(e.target.value)}
              rows={2}
              placeholder="배송 시 요청사항이 있다면 적어주세요."
              className="w-full resize-none border-b border-purple3 bg-transparent py-2 text-pretendard-body-1 outline-none focus:border-primary"
            />
          </Field>
        </Section>

        {error && (
          <p className="text-pretendard-body-2 text-destructive text-center" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="text-noto-subtitle-1 text-primary underline underline-offset-4 transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            {isPending ? '주문 처리 중...' : '결제하기'}
          </button>
        </div>
      </form>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-comp-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-noto-subtitle-1 text-primary whitespace-nowrap">{title}</h2>
        <hr className="flex-1 border-purple3 border-t" />
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[80px_1fr] sm:items-start sm:gap-4">
      <span className="pt-2 text-pretendard-body-2 text-purple2">{label}</span>
      <div>{children}</div>
    </div>
  );
}
