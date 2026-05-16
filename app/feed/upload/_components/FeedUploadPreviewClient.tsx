'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFeedUploadDraft } from '@/app/feed/upload/_lib/feed-upload-draft-context';
import {
  getMockBookById,
  getMockBooks,
  getMockQuestionsByBookId,
} from '@/app/feed/upload/_lib/mock-books-questions';
import {
  FeedImageUploadError,
  uploadFeedImageBlobs,
} from '@/app/feed/upload/_lib/upload-feed-images';
import FeedCard from '@/components/FeedCard';
import { PATH } from '@/constants/path';
import type { FeedItem } from '@/types/feed';

function formatPreviewDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}.`;
}

export default function FeedUploadPreviewClient() {
  const router = useRouter();
  const { images, clearDraft } = useFeedUploadDraft();
  const books = useMemo(() => getMockBooks(), []);

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const answerTextareaRef = useRef<HTMLTextAreaElement>(null);

  const questions = useMemo(
    () => (selectedBookId ? getMockQuestionsByBookId(selectedBookId) : []),
    [selectedBookId],
  );

  useEffect(() => {
    if (images.length === 0) {
      router.replace(PATH.FEED_UPLOAD);
    }
  }, [images.length, router]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: controlled textarea — value·disabled 반영 후 scrollHeight로 높이 동기화
  useLayoutEffect(() => {
    const el = answerTextareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [answer, selectedQuestionId]);

  const selectedBook = getMockBookById(selectedBookId);
  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);
  const questionText = selectedQuestion?.text ?? '';

  const previewFeed: FeedItem = useMemo(() => {
    return {
      id: 'draft-preview',
      type: selectedBook?.feedTypeLabel ?? 'WONDER NOTE',
      images: images.map((img) => ({ id: img.id, src: '' })),
      date: formatPreviewDate(),
      status: '미리보기',
      question: questionText,
      answer: answer,
      orderPurchasable: selectedBook?.orderPurchasable ?? false,
    };
  }, [images, selectedBook?.feedTypeLabel, selectedBook?.orderPurchasable, questionText, answer]);

  const previewImageSrcs = useMemo(() => images.map((i) => i.previewUrl), [images]);

  const canSubmit =
    selectedBookId !== null &&
    selectedQuestionId !== null &&
    answer.trim().length > 0 &&
    !isSubmitting;

  const handlePublish = async () => {
    if (!canSubmit || images.length === 0) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await uploadFeedImageBlobs(images.map((i) => i.blob));
      // TODO: POST /feeds { bookId: selectedBookId, questionId: selectedQuestionId, answer, imageUrls[] }
      clearDraft();
      router.push(PATH.FEED);
    } catch (e) {
      if (e instanceof FeedImageUploadError && e.code === 'MISSING_UPLOAD_URL') {
        setErrorMessage('이미지 업로드가 아직 준비되지 않았습니다.');
      } else {
        setErrorMessage('업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-section-md lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-section-sm">
        <Link
          href={PATH.FEED_UPLOAD}
          className="text-pretendard-body-2 text-primary underline w-fit"
        >
          ← 이미지 수정
        </Link>

        <section className="flex flex-col gap-comp-sm">
          <h2 className="text-noto-subtitle-2">책 선택</h2>
          <div className="grid grid-cols-2 gap-comp-sm sm:grid-cols-4">
            {books.map((book) => {
              const selected = selectedBookId === book.id;
              return (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => {
                    if (selectedBookId !== book.id) {
                      setSelectedQuestionId(null);
                    }
                    setSelectedBookId(book.id);
                  }}
                  className={`flex flex-col gap-2 rounded-none border-2 bg-transparent p-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50 ${
                    selected ? 'border-primary' : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="relative aspect-5/7 w-full overflow-hidden bg-feed-placeholder shadow-[-3px_6px_12px_0_rgba(0,0,0,0.15)]">
                    <Image
                      src={book.coverSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 45vw, 180px"
                    />
                  </div>
                  <span className="text-pretendard-caption text-ink-100">
                    No.{book.bookNo} · {book.mood}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-comp-sm">
          <h2 className="text-noto-subtitle-2">질문 선택</h2>
          {selectedBookId === null ? (
            <p className="text-pretendard-body-2 text-primary/60">먼저 책을 선택해 주세요.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {questions.map((q) => {
                const checked = selectedQuestionId === q.id;
                return (
                  <li key={q.id}>
                    <label className="flex cursor-pointer gap-3">
                      <input
                        type="radio"
                        name="feed-question"
                        value={q.id}
                        checked={checked}
                        onChange={() => setSelectedQuestionId(q.id)}
                        className="mt-1.5 shrink-0"
                      />
                      <span className="text-pretendard-body-2">{q.text}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-comp-sm">
          <h2 className="text-noto-subtitle-2">답변</h2>
          <label htmlFor="feed-preview-answer" className="sr-only">
            답변
          </label>
          <textarea
            ref={answerTextareaRef}
            id="feed-preview-answer"
            name="answer"
            rows={1}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={selectedQuestionId === null}
            placeholder={
              selectedQuestionId === null
                ? '질문을 선택한 뒤 작성할 수 있습니다.'
                : '답변을 입력해 주세요.'
            }
            className="text-pretendard-body-1 box-border min-h-[42px] w-full resize-none overflow-hidden border-b border-primary bg-transparent py-2 outline-none placeholder:text-primary/60 disabled:opacity-50"
          />
        </section>

        {errorMessage ? (
          <p className="text-pretendard-body-2 text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handlePublish}
          className={
            canSubmit
              ? 'bg-purple2 px-4 py-6 text-pretendard-subtitle-1 text-surface-50 hover:bg-primary'
              : 'cursor-not-allowed bg-purple3 px-4 py-6 text-pretendard-subtitle-1 text-surface-50'
          }
        >
          {isSubmitting ? '게시 중…' : '게시하기'}
        </button>
      </div>

      <div className="flex shrink-0 flex-col gap-comp-sm lg:sticky lg:top-section-sm">
        <h2 className="text-noto-subtitle-2 hidden lg:block">미리보기</h2>
        <FeedCard
          feed={previewFeed}
          previewImageSrcs={previewImageSrcs}
          headerBarBackgroundColor={selectedBook?.headerBarBg}
        />
      </div>
    </div>
  );
}
