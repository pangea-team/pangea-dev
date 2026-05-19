'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { BookWithQuestions } from '@/app/(with-header)/feed/_lib/get-feeds';
import type { FeedUploadDraftImage } from '@/app/(with-header)/feed/upload/_lib/types';
import { PATH } from '@/constants/path';
import { createClient } from '@/lib/supabase/client';
import CropModal from './CropModal';
import StepBookSelect from './StepBookSelect';
import StepFooter from './StepFooter';
import StepImageUpload from './StepImageUpload';
import StepIndicator from './StepIndicator';
import StepQuestionAnswer from './StepQuestionAnswer';

// 1차 배포 후 false로 변경
const IS_BEFORE_BOOK_ARRIVAL = true;

type Step = 1 | 2 | 3;
type Question = BookWithQuestions['questions'][number];

type Props = {
  books: BookWithQuestions[];
};

function revokeBlobUrl(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url);
}

export default function FeedUploadFlow({ books }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedBook, setSelectedBook] = useState<BookWithQuestions | null>(null);
  const [images, setImages] = useState<FeedUploadDraftImage[]>([]);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // unmount 시 blob URL 전체 정리
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(() => {
    return () => {
      for (const img of imagesRef.current) revokeBlobUrl(img.previewUrl);
    };
  }, []);

  // cropSrc blob URL 정리 (모달 닫힐 때)
  const cropSrcRef = useRef(cropSrc);
  cropSrcRef.current = cropSrc;
  useEffect(() => {
    return () => {
      if (cropSrcRef.current) revokeBlobUrl(cropSrcRef.current);
    };
  }, []);

  const handleSelectBook = useCallback(
    (book: BookWithQuestions) => {
      if (selectedBook?.id !== book.id) {
        setSelectedQuestion(null);
      }
      setSelectedBook(book);
    },
    [selectedBook],
  );

  const handleOpenCrop = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file?.type.startsWith('image/')) return;
    if (cropSrc) revokeBlobUrl(cropSrc);
    setCropSrc(URL.createObjectURL(file));
  };

  const handleCropAdd = useCallback(
    (blob: Blob) => {
      const previewUrl = URL.createObjectURL(blob);
      setImages((prev) => [...prev, { id: crypto.randomUUID(), blob, previewUrl }]);
      if (cropSrc) revokeBlobUrl(cropSrc);
      setCropSrc(null);
    },
    [cropSrc],
  );

  const handleCropCancel = useCallback(() => {
    if (cropSrc) revokeBlobUrl(cropSrc);
    setCropSrc(null);
  }, [cropSrc]);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) revokeBlobUrl(removed.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handlePublish = async () => {
    if (!selectedBook || !selectedQuestion || answer.trim().length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage('로그인이 필요합니다.');
      setIsSubmitting(false);
      return;
    }

    const userId = user.id;
    let feedId: string | null = null;
    const uploadedPaths: string[] = [];

    try {
      // 1. feeds row 생성
      const { data: feed, error: feedError } = await supabase
        .from('feeds')
        .insert({
          user_id: userId,
          book_id: selectedBook.id,
          question_id: selectedQuestion.id,
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

      // 성공 시 blob URL 정리 후 이동
      for (const img of images) revokeBlobUrl(img.previewUrl);
      router.push(PATH.FEED);
    } catch {
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

  const questions = selectedBook?.questions ?? [];

  const isNextDisabled =
    (currentStep === 1 && (selectedBook === null || IS_BEFORE_BOOK_ARRIVAL)) ||
    (currentStep === 2 && images.length === 0) ||
    (currentStep === 3 &&
      (selectedQuestion === null || answer.trim().length === 0 || isSubmitting));

  function handleNext() {
    if (currentStep < 3) setCurrentStep((currentStep + 1) as Step);
    else handlePublish();
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  }

  return (
    <>
      {/* 숨겨진 파일 입력 — StepImageUpload의 "+ 이미지 추가" 버튼이 트리거 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      {cropSrc ? (
        <CropModal src={cropSrc} onAdd={handleCropAdd} onCancel={handleCropCancel} />
      ) : null}

      <div className="flex flex-col gap-section-sm">
        <StepIndicator currentStep={currentStep} />

        <div className="">
          {currentStep === 1 ? (
            <StepBookSelect books={books} selectedBook={selectedBook} onSelect={handleSelectBook} />
          ) : null}

          {currentStep === 2 ? (
            <StepImageUpload
              images={images}
              bookTitle={selectedBook?.title ?? ''}
              bookAuthor={selectedBook?.author ?? ''}
              onOpenCrop={handleOpenCrop}
              onRemove={handleRemoveImage}
            />
          ) : null}

          {currentStep === 3 ? (
            <StepQuestionAnswer
              questions={questions}
              images={images}
              selectedBook={selectedBook}
              selectedQuestion={selectedQuestion}
              answer={answer}
              onSelectQuestion={setSelectedQuestion}
              onAnswerChange={setAnswer}
              errorMessage={errorMessage}
            />
          ) : null}
        </div>

        {currentStep === 1 && IS_BEFORE_BOOK_ARRIVAL && selectedBook !== null && (
          <div className="rounded-none border border-primary/30 bg-primary/5 p-4">
            <p className="text-pretendard-body-2 text-primary">
              아직 첫 번째 책이 도착하기 전입니다.
            </p>
          </div>
        )}

        <StepFooter
          showBack={currentStep > 1}
          onBack={handleBack}
          onNext={handleNext}
          nextLabel={currentStep === 3 ? '게시하기' : '다음 →'}
          isNextDisabled={isNextDisabled}
          isLoading={currentStep === 3 && isSubmitting}
        />
      </div>
    </>
  );
}
