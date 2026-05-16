'use client';

import { type FormEvent, useState, useTransition } from 'react';
import { completeOnboarding } from '../actions';

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState('');
  const [oneLineTrace, setOneLineTrace] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isComplete = displayName.trim().length > 0 && oneLineTrace.trim().length > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isComplete || isPending) return;
    setError(null);
    startTransition(async () => {
      const result = await completeOnboarding({ name: displayName, trace: oneLineTrace });
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <main className="mx-auto w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl px-content-x py-content-y">
      <header className="mb-section-sm flex flex-col gap-5">
        <h1 className="text-noto-title-2 text-primary">당신을 한 문장으로 남겨주세요.</h1>
        <p className="text-noto-subtitle-2">
          당신의 이름과 한 줄의 흔적이 PANGEA 에서의 시작이 됩니다.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-section-sm flex flex-col gap-section-sm">
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
          <p className="text-noto-body-1 text-ink-100">
            책 속 문장이나, 그로부터 시작된 당신의 생각을 적어주세요.
          </p>
          <textarea
            id="login-one-line-trace"
            name="oneLineTrace"
            rows={1}
            maxLength={60}
            value={oneLineTrace}
            onChange={(e) => setOneLineTrace(e.target.value)}
            className="text-pretendard-subtitle-1 box-border min-h-[42px] w-full resize-none border-b border-primary bg-transparent py-2 outline-none placeholder:text-primary/60"
          />
          <div className="text-pretendard-body-2 text-ink-100 space-y-1">
            <p>*개인을 식별할 수 있는 정보는 사용할 수 없습니다.</p>
            <p>*나이, 직업, 학교, 지역 등 개인정보는 포함할 수 없습니다.</p>
          </div>
        </section>

        <button
          type="submit"
          disabled={isPending}
          className={`text-pretendard-subtitle-1 rounded-md inline-flex w-full items-center justify-center py-4 text-surface-50 transition-colors disabled:cursor-not-allowed ${isComplete && !isPending ? 'bg-purple2 hover:bg-primary' : 'bg-purple3 hover:bg-purple3/95'}`}
        >
          {isPending ? '저장 중...' : '시작하기'}
        </button>
        {error && <p className="text-pretendard-body-2 text-destructive">{error}</p>}
      </form>
    </main>
  );
}
