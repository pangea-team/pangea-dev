'use client';

import { useEffect, useState, useTransition } from 'react';
import { createMemo } from '../actions';

const MAX_LENGTH = 160;

type Props = {
  selectedSentenceId: number | null;
  selectedContentIndex: number | null;
};

export default function MemoPanel({ selectedSentenceId, selectedContentIndex }: Props) {
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isActive = selectedSentenceId !== null && selectedContentIndex !== null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: props change triggers note/error reset
  useEffect(() => {
    setNote('');
    setError(null);
    setSuccess(false);
  }, [selectedSentenceId, selectedContentIndex]);

  const handleSubmit = () => {
    if (selectedSentenceId === null || selectedContentIndex === null) return;
    const sentenceId = selectedSentenceId;
    const contentIndex = selectedContentIndex;
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await createMemo({
        sentenceId,
        contentIndex,
        note,
      });

      if ('error' in result) {
        setError(result.error);
      } else {
        setSuccess(true);
        setNote('');
      }
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
      {success && <p className="text-pretendard-caption text-primary">흔적이 남겨졌습니다.</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isActive || isPending || note.trim().length === 0}
        className="self-start border border-primary px-6 py-2 text-pretendard-body-2 text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-30"
      >
        {isPending ? '저장 중...' : '마침표 찍기'}
      </button>
    </div>
  );
}
