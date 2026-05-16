'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import Modal from '@/components/Modal';
import { PATH } from '@/constants/path';
import { answerSurvey, createMemo } from '../actions';

const MAX_LENGTH = 160;

type Props = {
  selectedSentenceId: number | null;
  selectedContentIndex: number | null;
  isLoggedIn: boolean;
  hasAnsweredSurvey: boolean;
};

export default function MemoPanel({
  selectedSentenceId,
  selectedContentIndex,
  isLoggedIn,
  hasAnsweredSurvey,
}: Props) {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAnsweredSurveyLocal, setHasAnsweredSurveyLocal] = useState(hasAnsweredSurvey);
  const [isPending, startTransition] = useTransition();

  const isActive = selectedSentenceId !== null && selectedContentIndex !== null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: props change triggers note/error reset
  useEffect(() => {
    setNote('');
    setError(null);
    setSuccess(false);
  }, [selectedSentenceId, selectedContentIndex]);

  const handleSubmit = () => {
    if (!isLoggedIn) {
      router.push(PATH.LOGIN);
      return;
    }
    if (selectedSentenceId === null || selectedContentIndex === null) return;
    const sentenceId = selectedSentenceId;
    const contentIndex = selectedContentIndex;
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await createMemo({ sentenceId, contentIndex, note });

      if ('error' in result) {
        if (result.error === '로그인이 필요합니다.') {
          router.push(PATH.LOGIN);
          return;
        }
        setError(result.error);
        return;
      }

      setSuccess(true);
      setNote('');
      if (!hasAnsweredSurveyLocal) {
        setIsModalOpen(true);
      }
    });
  };

  const handleSurveyConfirm = () => {
    startTransition(async () => {
      const result = await answerSurvey({ wantsToSeeOthers: true });
      if ('success' in result) {
        setHasAnsweredSurveyLocal(true);
      }
      setIsModalOpen(false);
      router.push(PATH.CART);
    });
  };

  const handleSurveyCancel = () => {
    startTransition(async () => {
      const result = await answerSurvey({ wantsToSeeOthers: false });
      if ('success' in result) {
        setHasAnsweredSurveyLocal(true);
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-noto-body-1 text-purple3">
        {isActive ? '흔적을 남겨보세요.' : '문단을 선택하면 메모할 수 있어요.'}
      </p>

      <div className={`flex flex-col gap-2 ${!isActive ? 'pointer-events-none opacity-35' : ''}`}>
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value.slice(0, MAX_LENGTH));
            setSuccess(false);
          }}
          placeholder="이 문단에서 느낀 것을 적어보세요."
          rows={5}
          disabled={!isActive || isPending}
          className="w-full resize-none border border-purple3 bg-transparent p-3 text-pretendard-body-2 text-text outline-none placeholder:text-purple3 focus:border-primary"
        />
        <span className="self-end text-pretendard-caption text-purple3">
          {note.length}/{MAX_LENGTH}
        </span>
      </div>

      {error && <p className="text-pretendard-caption text-destructive">{error}</p>}
      {success && (
        <div className="flex items-center justify-between">
          <p className="text-pretendard-caption text-primary">흔적이 남겨졌습니다.</p>
          <Link
            href={PATH.CART}
            className="text-pretendard-caption text-primary underline underline-offset-4 hover:opacity-60"
          >
            담아둔 것들 →
          </Link>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isActive && (isPending || note.trim().length === 0)}
        className="self-start border border-primary px-6 py-2 text-pretendard-body-2 text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-30"
      >
        {isPending ? '저장 중...' : '마침표 찍기'}
      </button>

      <Modal
        isOpen={isModalOpen}
        description="다른 사람들의 흔적도 궁금하신가요?"
        cancelText="아니오"
        confirmText="예"
        onCancel={handleSurveyCancel}
        onConfirm={handleSurveyConfirm}
      />
    </div>
  );
}
