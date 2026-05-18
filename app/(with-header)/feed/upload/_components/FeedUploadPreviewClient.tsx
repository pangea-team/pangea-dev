'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { BookWithQuestions } from '@/app/(with-header)/feed/_lib/get-feeds';
import { useFeedUploadDraft } from '@/app/(with-header)/feed/upload/_lib/feed-upload-draft-context';
import FeedCard from '@/components/FeedCard';
import { PATH } from '@/constants/path';
import { createClient } from '@/lib/supabase/client';
import type { FeedItem } from '@/types/feed';

type Props = {
  books: BookWithQuestions[];
};

function formatPreviewDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}.`;
}

export default function FeedUploadPreviewClient({ books }: Props) {
  const router = useRouter();
  const { images, clearDraft } = useFeedUploadDraft();

  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const answerTextareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedBook = books.find((b) => b.id === selectedBookId) ?? null;
  const questions = selectedBook?.questions ?? [];
  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) ?? null;
  const questionText = selectedQuestion?.content ?? '';

  useEffect(() => {
    if (images.length === 0) {
      router.replace(PATH.FEED_UPLOAD);
    }
  }, [images.length, router]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: controlled textarea — value·disabled 반영 후 scrollHeight로 높이 동기화
  useLayoutEffect(() => {
    const el = answerTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [answer, selectedQuestionId]);

  const previewFeed: FeedItem = useMemo(
    () => ({
      id: 'draft-preview',
      type: 'WONDER NOTE',
      images: images.map((img) => ({ id: img.id, src: '' })),
      date: formatPreviewDate(),
      status: '미리보기',
      question: questionText,
      answer,
      orderPurchasable: false,
    }),
    [images, questionText, answer],
  );

  const previewImageSrcs = useMemo(() => images.map((i) => i.previewUrl), [images]);

  const canSubmit =
    selectedBookId !== null &&
    selectedQuestionId !== null &&
    answer.trim().length > 0 &&
    !isSubmitting;

  const handlePublish = async () => {
    if (
      !canSubmit ||
      images.length === 0 ||
      selectedBookId === null ||
      selectedQuestionId === null
    ) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    const supabase = createClient();
    const { data: claimsData } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub as string | undefined;

    if (!userId) {
      setErrorMessage('로그인이 필요합니다.');
      setIsSubmitting(false);
      return;
    }

    let feedId: string | null = null;
    const uploadedPaths: string[] = [];

    try {
      // 1. feeds row 생성
      const { data: feed, error: feedError } = await supabase
        .from('feeds')
        .insert({
          user_id: userId,
          book_id: selectedBookId,
          question_id: selectedQuestionId,
          answer: answer.trim(),
          images: [],
        })
        .select('id')
        .single();
      if (feedError) throw feedError;
      feedId = feed.id;

      // 2. Storage에 이미지 업로드
      for (const [index, img] of images.entries()) {
        const ext = img.blob.type.split('/')[1] ?? 'jpg';
        const path = `${userId}/${feedId}/${Date.now()}-${index}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('feed-images')
          .upload(path, img.blob, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
      }

      // 3. public URL 수집 후 feeds.images 업데이트
      const imageUrls = uploadedPaths.map(
        (path) => supabase.storage.from('feed-images').getPublicUrl(path).data.publicUrl,
      );
      const { error: updateError } = await supabase
        .from('feeds')
        .update({ images: imageUrls })
        .eq('id', feedId);
      if (updateError) throw updateError;

      clearDraft();
      router.push(PATH.FEED);
    } catch {
      // 롤백: 업로드된 이미지 + feeds row 삭제
      if (uploadedPaths.length > 0) {
        await supabase.storage.from('feed-images').remove(uploadedPaths);
      }
      if (feedId) {
        await supabase.from('feeds').delete().eq('id', feedId);
      }
      setErrorMessage('업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
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
          className="w-fit text-pretendard-body-2 text-primary underline"
        >
          ← 이미지 수정
        </Link>

        <section className="flex flex-col gap-comp-sm">
          <h2 className="text-noto-subtitle-2">책 선택</h2>
          {books.length === 0 ? (
            <p className="text-pretendard-body-2 text-primary/60">등록된 책이 없습니다.</p>
          ) : (
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
                        src={book.cover_image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 45vw, 180px"
                      />
                    </div>
                    <span className="text-pretendard-caption text-ink-100">
                      No.{book.book_no} · {book.mood}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-comp-sm">
          <h2 className="text-noto-subtitle-2">질문 선택</h2>
          {selectedBookId === null ? (
            <p className="text-pretendard-body-2 text-primary/60">먼저 책을 선택해 주세요.</p>
          ) : questions.length === 0 ? (
            <p className="text-pretendard-body-2 text-primary/60">
              이 책에 등록된 질문이 없습니다.
            </p>
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
                      <span className="text-pretendard-body-2">{q.content}</span>
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
          className="w-full bg-purple2 px-4 py-4 text-pretendard-body-2 text-white transition-opacity hover:opacity-80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '게시 중…' : '게시하기'}
        </button>
      </div>

      <div className="flex shrink-0 flex-col gap-comp-sm lg:sticky lg:top-section-sm">
        <h2 className="text-noto-subtitle-2 hidden lg:block">미리보기</h2>
        <FeedCard
          feed={previewFeed}
          previewImageSrcs={previewImageSrcs}
          headerBarBackgroundColor={selectedBook?.cover_color ?? undefined}
        />
      </div>
    </div>
  );
}
