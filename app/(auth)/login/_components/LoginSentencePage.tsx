'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PATH } from '@/constants/path';

export default function LoginSentencePage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [oneLineTrace, setOneLineTrace] = useState('');
  const oneLineTraceRef = useRef<HTMLTextAreaElement>(null);

  const syncOneLineTraceHeight = useCallback(() => {
    const el = oneLineTraceRef.current;
    if (!el) return;

    el.rows = 1;
    el.style.height = 'auto';

    if (el.value.trim()) {
      el.style.height = `${el.scrollHeight}px`;
      return;
    }

    const placeholder = el.placeholder;
    if (!placeholder) {
      el.style.height = `${el.scrollHeight}px`;
      return;
    }

    const clone = document.createElement('textarea');
    clone.className = el.className;
    clone.style.width = `${el.getBoundingClientRect().width}px`;
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.visibility = 'hidden';
    clone.rows = 1;
    clone.value = placeholder;
    document.body.appendChild(clone);
    const height = clone.scrollHeight;
    clone.remove();
    el.style.height = `${height}px`;
  }, []);

  const isComplete = displayName.trim().length > 0 && oneLineTrace.trim().length > 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: controlled textarea — value 반영 후 scrollHeight로 높이 동기화
  useLayoutEffect(() => {
    syncOneLineTraceHeight();
  }, [oneLineTrace, syncOneLineTraceHeight]);

  useEffect(() => {
    const el = oneLineTraceRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => syncOneLineTraceHeight());
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncOneLineTraceHeight]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isComplete) return;
    // TODO: displayName, oneLineTrace를 API로 저장
    router.push(PATH.FEED);
  };

  return (
    <main className="flex flex-1 flex-col px-page-x pb-section-lg pt-section-lg">
      <div className="mx-auto flex w-full max-w-layout-content flex-col">
        <h1 className="text-noto-display max-w-[50ch]">당신을 한 문장으로 남겨주세요.</h1>
        <p className="text-noto-subtitle-2 mt-comp-sm">
          당신의 이름과 한 줄의 흔적이 PANGEA에서의 시작이 됩니다.
        </p>

        <form onSubmit={handleSubmit} className="mt-section-md flex flex-col gap-section-sm">
          <section className="flex flex-col gap-comp-sm">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <h2 className="text-noto-subtitle-2">이름</h2>
              <p className="text-noto-body-1">닉네임도 가능합니다.</p>
            </div>
            <label htmlFor="login-display-name" className="sr-only">
              이름
            </label>
            <input
              id="login-display-name"
              name="displayName"
              type="text"
              autoComplete="nickname"
              maxLength={10}
              placeholder="이름을 입력해주세요."
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-pretendard-subtitle-1 w-full border-b border-primary bg-transparent py-2 outline-none placeholder:text-primary/60"
            />
          </section>

          <section className="flex flex-col gap-comp-sm">
            <h2 className="text-noto-subtitle-2">한 줄의 흔적</h2>
            <label htmlFor="login-one-line-trace" className="sr-only">
              한 줄의 흔적
            </label>
            <textarea
              ref={oneLineTraceRef}
              id="login-one-line-trace"
              name="oneLineTrace"
              rows={1}
              maxLength={60}
              placeholder="책 속 문장이나, 그로부터 시작된 당신의 생각을 적어주세요."
              value={oneLineTrace}
              onChange={(e) => setOneLineTrace(e.target.value)}
              className="text-pretendard-subtitle-1 box-border w-full resize-none overflow-hidden border-b border-primary bg-transparent py-2 outline-none placeholder:text-primary/60"
            />
            <div className="text-pretendard-body-2 text-ink-100 space-y-1">
              <p>*개인을 식별할 수 있는 정보는 사용할 수 없습니다.</p>
              <p>*나이, 직업, 학교, 지역 등 개인정보는 포함할 수 없습니다.</p>
            </div>
          </section>

          <button
            type="submit"
            className={`text-pretendard-subtitle-1 mt-comp-sm inline-flex w-full items-center justify-center py-6 text-surface-50 transition-colors ${isComplete ? 'bg-purple2 hover:bg-primary' : 'bg-purple3 hover:bg-purple3/95'}`}
          >
            시작하기
          </button>
        </form>
      </div>
    </main>
  );
}
