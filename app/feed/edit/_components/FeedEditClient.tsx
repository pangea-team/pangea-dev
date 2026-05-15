'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImageBlob } from '@/app/feed/edit/_lib/crop-image';
import { useFeedEditDraft } from '@/app/feed/edit/_lib/feed-edit-draft-context';
import {
  FEED_IMAGE_HEIGHT,
  FEED_IMAGE_MAX_HEIGHT_RATIO,
  MAX_FEED_IMAGES,
} from '@/lib/feed-card-layout';

const MAX_HEIGHT_RATIO = FEED_IMAGE_MAX_HEIGHT_RATIO;

function clampCropHeight(c: PixelCrop): PixelCrop {
  if (c.width > 0 && c.height > c.width * MAX_HEIGHT_RATIO) {
    return { ...c, height: Math.round(c.width * MAX_HEIGHT_RATIO) };
  }
  return c;
}

function revokeBlobUrl(url: string | null | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export default function FeedEditClient() {
  const router = useRouter();
  const { images: savedImages, setImages } = useFeedEditDraft();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const editingSrcRef = useRef<string | null>(null);

  const [editingSrc, setEditingSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  editingSrcRef.current = editingSrc;

  const canAddMore = savedImages.length < MAX_FEED_IMAGES;
  const isEditing = editingSrc !== null;

  useEffect(() => {
    return () => {
      revokeBlobUrl(editingSrcRef.current);
    };
  }, []);

  const openFilePicker = () => {
    if (!canAddMore || isEditing) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file?.type.startsWith('image/')) {
      return;
    }
    revokeBlobUrl(editingSrc);
    setEditingSrc(URL.createObjectURL(file));
    setCrop(undefined);
    setCompletedCrop(null);
    setErrorMessage(null);
  };

  const handleCancelEditing = () => {
    revokeBlobUrl(editingSrc);
    setEditingSrc(null);
    setCrop(undefined);
    setCompletedCrop(null);
  };

  const handleRemoveSaved = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
  };

  const handleCropChange = (c: PixelCrop) => {
    setCrop(clampCropHeight(c));
  };

  const handleCropComplete = (c: PixelCrop) => {
    setCompletedCrop(clampCropHeight(c));
  };

  const handleAddImage = async () => {
    if (!editingSrc || !completedCrop || !imgRef.current || savedImages.length >= MAX_FEED_IMAGES) {
      return;
    }
    setIsAddingImage(true);
    setErrorMessage(null);
    try {
      const blob = await getCroppedImageBlob(imgRef.current, completedCrop);
      const previewUrl = URL.createObjectURL(blob);
      setImages((prev) => [...prev, { id: crypto.randomUUID(), blob, previewUrl }]);
      revokeBlobUrl(editingSrc);
      setEditingSrc(null);
      setCrop(undefined);
      setCompletedCrop(null);
    } catch {
      setErrorMessage('이미지를 처리하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setIsAddingImage(false);
    }
  };

  const handleProceedToPreview = () => {
    if (savedImages.length === 0 || isEditing) {
      return;
    }
    router.push('/feed/edit/preview');
  };

  const showEmptyPlaceholder = savedImages.length === 0 && !isEditing;

  return (
    <article className="flex w-full max-w-[690px] flex-col gap-comp-sm bg-surface-50 p-6 shadow-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      {savedImages.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {savedImages.map((image, index) => (
            <li
              key={image.id}
              className="relative h-[126px] w-[180px] shrink-0 overflow-hidden bg-feed-placeholder"
            >
              {/* biome-ignore lint/performance/noImgElement: blob 미리보기 */}
              <img
                src={image.previewUrl}
                alt={`선택한 이미지 ${index + 1}`}
                className="size-full object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 flex size-6 items-center justify-center bg-primary/80 text-pretendard-caption text-surface-50"
                aria-label={`이미지 ${index + 1} 삭제`}
                onClick={() => handleRemoveSaved(image.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {isEditing ? (
        <>
          <div className="w-full">
            <ReactCrop
              crop={crop}
              onChange={handleCropChange}
              onComplete={handleCropComplete}
              keepSelection
              ruleOfThirds
            >
              {/* biome-ignore lint/performance/noImgElement: react-image-crop은 imgRef.width/naturalWidth 비율로 좌표를 계산하므로 Next/Image의 래핑 구조와 호환 불가 */}
              <img ref={imgRef} src={editingSrc} alt="" className="block max-h-[70vh] max-w-full" />
            </ReactCrop>
          </div>
          <p className="text-pretendard-caption text-primary/60">
            {`이미지를 드래그해 선택 영역을 그리고, 핸들로 크기를 조절하세요. 세로 비율은 피드카드 높이(${FEED_IMAGE_HEIGHT}px)에 맞게 자동 제한됩니다.`}
          </p>
          <p className="text-pretendard-caption text-primary/60">
            {savedImages.length + 1}/{MAX_FEED_IMAGES}장
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!completedCrop || isAddingImage}
              className={
                completedCrop && !isAddingImage
                  ? 'bg-purple2 px-4 py-3 text-pretendard-body-2 text-surface-50 hover:bg-primary'
                  : 'cursor-not-allowed bg-purple3/40 px-4 py-3 text-pretendard-body-2 text-surface-50'
              }
              onClick={handleAddImage}
            >
              {isAddingImage ? '처리 중…' : '이 이미지 추가'}
            </button>
            <button
              type="button"
              className="text-pretendard-body-2 text-primary underline"
              onClick={handleCancelEditing}
            >
              취소
            </button>
            <button
              type="button"
              className="text-pretendard-body-2 text-primary underline"
              onClick={() => fileInputRef.current?.click()}
            >
              다른 파일 선택
            </button>
          </div>
        </>
      ) : showEmptyPlaceholder ? (
        <button
          type="button"
          className="flex h-feed-image-h w-full flex-col items-center justify-center gap-section-sm bg-feed-placeholder px-4 py-6 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50"
          onClick={openFilePicker}
        >
          <p className="text-pretendard-subtitle-1 whitespace-pre-line">
            {'밑줄 또는 메모가 있는\n책의 일부만 업로드할 수 있습니다.'}
          </p>
          <p className="text-pretendard-body-2 whitespace-pre-line">
            {
              '1~3장까지 원하는 만큼 업로드할 수 있습니다.\n개인 정보가 포함된 이미지는 허용되지 않습니다.'
            }
          </p>
        </button>
      ) : canAddMore ? (
        <button
          type="button"
          className="flex h-[120px] w-full flex-col items-center justify-center gap-2 border border-dashed border-primary/30 bg-feed-placeholder/50 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50"
          onClick={openFilePicker}
        >
          <p className="text-pretendard-body-2">
            이미지 추가 ({savedImages.length}/{MAX_FEED_IMAGES})
          </p>
        </button>
      ) : null}

      {errorMessage ? (
        <p className="text-pretendard-body-2 text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={savedImages.length === 0 || isEditing}
          className={
            savedImages.length > 0 && !isEditing
              ? 'bg-purple2 px-4 py-3 text-pretendard-body-2 text-surface-50 hover:bg-primary'
              : 'cursor-not-allowed bg-purple3/40 px-4 py-3 text-pretendard-body-2 text-surface-50'
          }
          onClick={handleProceedToPreview}
        >
          {`선택 완료 (${savedImages.length}장)`}
        </button>
      </div>
    </article>
  );
}
