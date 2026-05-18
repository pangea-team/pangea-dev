'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { BookWithQuestions } from '@/app/(with-header)/feed/_lib/get-feeds';
import type { FeedUploadDraftImage } from '@/app/(with-header)/feed/upload/_lib/types';
import FeedCard from '@/components/FeedCard';
import type { FeedItem } from '@/types/feed';

type Question = BookWithQuestions['questions'][number];

type Props = {
  questions: Question[];
  images: FeedUploadDraftImage[];
  selectedBook: BookWithQuestions | null;
  selectedQuestion: Question | null;
  answer: string;
  onSelectQuestion: (q: Question) => void;
  onAnswerChange: (answer: string) => void;
  errorMessage: string | null;
};

function formatPreviewDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}.`;
}

export default function StepQuestionAnswer({
  questions,
  images,
  selectedBook,
  selectedQuestion,
  answer,
  onSelectQuestion,
  onAnswerChange,
  errorMessage,
}: Props) {
  const answerTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: controlled textarea — value·disabled 반영 후 scrollHeight로 높이 동기화
  useLayoutEffect(() => {
    const el = answerTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [answer, selectedQuestion]);

  const previewFeed: FeedItem = useMemo(
    () => ({
      id: 'draft-preview',
      type: 'WONDER NOTE',
      images: images.map((img) => ({ id: img.id, src: '' })),
      date: formatPreviewDate(),
      status: '미리보기',
      question: selectedQuestion?.content ?? '',
      answer,
      orderPurchasable: false,
    }),
    [images, selectedQuestion, answer],
  );

  const previewImageSrcs = useMemo(() => images.map((i) => i.previewUrl), [images]);

  function handleSelectQuestion(q: Question) {
    onSelectQuestion(q);
    setCollapsed(true);
  }

  function handleReselect() {
    setCollapsed(false);
  }

  return (
    <div className="flex w-full flex-col gap-section-sm lg:flex-row lg:items-start">
      {/* 좌측: 질문·답변 폼 */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-noto-subtitle-1">어떤 질문에 답하고 싶으신가요?</h2>
          <p className="text-pretendard-body-2 text-primary/60">
            당신의 시선이 누군가에게 새로운 페이지가 됩니다.
            <br />
            떠오른 생각을 자유롭게 적어주세요.
          </p>
        </div>

        <section className="flex flex-col gap-2">
          {questions.length === 0 ? (
            <p className="text-pretendard-body-2 text-primary/60">
              이 책에 등록된 질문이 없습니다.
            </p>
          ) : (
            <>
              {collapsed && selectedQuestion && (
                <button
                  type="button"
                  onClick={handleReselect}
                  className="self-end text-pretendard-body-2 text-purple2 underline-offset-2 hover:underline"
                >
                  다른 질문 선택하기
                </button>
              )}
              <ul className="flex flex-col gap-2" aria-label="질문 선택">
                <AnimatePresence initial={false}>
                  {questions.map((q) => {
                    const selected = selectedQuestion?.id === q.id;
                    if (collapsed && !selected) return null;
                    return (
                      <motion.li
                        key={q.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => handleSelectQuestion(q)}
                          className={`w-full cursor-pointer rounded-md border px-4 py-3 text-left text-pretendard-body-2 transition-colors ${
                            selected
                              ? 'border-purple2 bg-purple2/5 text-primary'
                              : 'border-primary/20 text-primary hover:border-primary/50'
                          }`}
                        >
                          {q.content}
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </>
          )}
        </section>

        <textarea
          ref={answerTextareaRef}
          id="feed-answer"
          name="answer"
          rows={1}
          maxLength={200}
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={selectedQuestion === null}
          placeholder={
            selectedQuestion === null
              ? '질문을 선택한 뒤 작성할 수 있습니다.'
              : '답변을 입력해 주세요.'
          }
          className={`text-pretendard-body-1 box-border min-h-10.5 w-full resize-none overflow-hidden rounded-md border bg-transparent px-3 py-2 outline-none transition-colors placeholder:text-primary/60 disabled:opacity-50 ${
            answer.length >= 200 ? 'border-primary' : 'border-primary/30'
          }`}
        />

        {errorMessage ? (
          <p className="text-pretendard-body-2 text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>

      {/* 우측: 미리보기 */}
      <div className="flex shrink-0 flex-col gap-comp-sm lg:sticky lg:top-section-sm">
        <h3 className="text-noto-subtitle-2">미리보기</h3>
        <FeedCard
          feed={previewFeed}
          previewImageSrcs={previewImageSrcs}
          headerBarBackgroundColor={selectedBook?.cover_color ?? undefined}
        />
      </div>
    </div>
  );
}
