'use client';

import Link from 'next/link';
import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/cn';

const inputCn =
  'w-full resize-none border-0 border-b border-primary bg-transparent pb-2 pt-2 text-pretendard-subtitle-1 tracking-[1.8px] text-primary placeholder:text-ink-400/60 focus:border-primary focus:outline-none';

const startCtaBase =
  'mt-[4.75rem] flex w-full items-center justify-center px-6 py-6 text-center tracking-[1.8px] text-pretendard-subtitle-1 transition-colors duration-150';

const startCtaEnabled = 'bg-primary text-surface-50 hover:bg-ink-500';

const startCtaDisabled = 'cursor-not-allowed bg-purple3 text-surface-50 opacity-50';

export default function ProfileSetupForm() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  const isReady = useMemo(
    () => displayName.trim().length > 0 && bio.trim().length > 0,
    [displayName, bio],
  );

  return (
    <div className="relative z-[1] mx-auto w-full max-w-[960px] px-6 pb-32 pt-10 sm:px-10 md:pl-[clamp(2rem,12vw,15rem)] md:pr-12">
      <h1 className="text-balance tracking-[4.8px] text-primary text-noto-display break-keep">
        당신을 한 문장으로
        <wbr />
        <span className="whitespace-nowrap">남겨주세요.</span>
      </h1>
      <p className="mt-5 tracking-[1.8px] text-primary text-noto-subtitle-2">
        당신의 이름과 한 줄의 흔적이 PANGEA에서의 시작이 됩니다.
      </p>

      <div className="mt-16 flex flex-wrap items-baseline gap-3 md:gap-5 text-noto-body-1 tracking-[1.8px] text-primary md:tracking-[0]">
        <label htmlFor="profile-display-name">이름</label>
        <span id="profile-display-name-helper">(닉네임도 가능합니다.)</span>
      </div>
      <input
        id="profile-display-name"
        name="displayName"
        type="text"
        autoComplete="nickname"
        placeholder="이름을 입력해주세요."
        aria-describedby="profile-display-name-helper"
        value={displayName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
        className={`${inputCn} mt-8`}
      />

      <label
        htmlFor="profile-bio"
        className={cn('mt-[5.125rem] block tracking-[1.8px] text-primary text-noto-subtitle-2')}
      >
        한 줄의 흔적
      </label>
      <textarea
        id="profile-bio"
        name="bio"
        rows={1}
        placeholder="책 속 문장이나, 그로부터 시작된 당신의 생각을 적어주세요."
        value={bio}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
        className={`${inputCn} mt-7 min-h-[var(--text-pretendard-subtitle-1--line-height)]`}
      />

      <ul className="mt-28 space-y-1 font-light tracking-[1.4px] text-pretendard-body-2 text-ink-100">
        <li>*개인을 식별할 수 있는 정보는 사용할 수 없습니다.</li>
        <li>*나이·직업·학교·지역 등 개인정보는 포함할 수 없습니다.</li>
      </ul>

      {isReady ? (
        <Link prefetch href="/" className={cn(startCtaBase, startCtaEnabled)}>
          시작하기
        </Link>
      ) : (
        <button type="button" disabled className={cn(startCtaBase, startCtaDisabled)}>
          시작하기
        </button>
      )}
    </div>
  );
}
