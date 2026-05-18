'use client';

import { useEffect, useRef, useState } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImageBlob } from '@/app/(with-header)/feed/upload/_lib/crop-image';
import { FEED_IMAGE_HEIGHT, FEED_IMAGE_MAX_HEIGHT_RATIO } from '@/lib/feed-card-layout';

type Props = {
  src: string;
  onAdd: (blob: Blob) => void;
  onCancel: () => void;
};

function clampCropHeight(c: PixelCrop): PixelCrop {
  if (c.width > 0 && c.height > c.width * FEED_IMAGE_MAX_HEIGHT_RATIO) {
    return { ...c, height: Math.round(c.width * FEED_IMAGE_MAX_HEIGHT_RATIO) };
  }
  return c;
}

export default function CropModal({ src, onAdd, onCancel }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 배경 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleAdd = async () => {
    if (!completedCrop || !imgRef.current || isProcessing) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const blob = await getCroppedImageBlob(imgRef.current, completedCrop);
      onAdd(blob);
    } catch {
      setErrorMessage('이미지를 처리하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 크롭"
    >
      <div className="flex w-full max-w-[600px] flex-col gap-4 bg-surface-50 p-6 shadow-card">
        <h2 className="text-noto-subtitle-2">이미지 영역 선택</h2>

        <div className="w-full overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(clampCropHeight(c))}
            onComplete={(c) => setCompletedCrop(clampCropHeight(c))}
            keepSelection
            ruleOfThirds
          >
            {/* biome-ignore lint/performance/noImgElement: react-image-crop은 imgRef.width/naturalWidth 비율로 좌표를 계산하므로 Next/Image의 래핑 구조와 호환 불가 */}
            <img ref={imgRef} src={src} alt="" className="block max-h-[60vh] max-w-full" />
          </ReactCrop>
        </div>

        <p className="text-pretendard-caption text-primary/60">
          {`이미지를 드래그해 선택 영역을 그리고, 핸들로 크기를 조절하세요. 세로 비율은 피드카드 높이(${FEED_IMAGE_HEIGHT}px)에 맞게 자동 제한됩니다.`}
        </p>

        {errorMessage ? (
          <p className="text-pretendard-caption text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex gap-3">
          <button
            type="button"
            disabled={!completedCrop || isProcessing}
            onClick={handleAdd}
            className="flex-1 rounded-md bg-purple2 px-4 py-3 text-pretendard-body-2 text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? '처리 중…' : '이 영역 추가'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 text-pretendard-body-2 text-primary underline"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
