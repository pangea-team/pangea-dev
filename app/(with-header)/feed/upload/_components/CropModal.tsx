'use client';

import { useEffect, useRef, useState } from 'react';
import ReactCrop, { type PixelCrop } from 'react-image-crop';
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
    return {
      ...c,
      height: Math.round(c.width * FEED_IMAGE_MAX_HEIGHT_RATIO),
    };
  }

  return c;
}

export default function CropModal({ src, onAdd, onCancel }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [crop, setCrop] = useState<PixelCrop | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // iOS Safari까지 고려한 배경 스크롤 잠금
  useEffect(() => {
    const scrollY = window.scrollY;

    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyLeft = document.body.style.left;
    const prevBodyRight = document.body.style.right;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyWidth = document.body.style.width;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.left = prevBodyLeft;
      document.body.style.right = prevBodyRight;
      document.body.style.width = prevBodyWidth;
      document.body.style.overflow = prevBodyOverflow;

      window.scrollTo(0, scrollY);
    };
  }, []);

  // dialog가 키보드 이벤트를 받을 수 있게 포커스 부여
  useEffect(() => {
    modalRef.current?.focus();
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
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleDialogKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 크롭"
      tabIndex={-1}
    >
      <div className="flex max-h-[90dvh] w-full max-w-[600px] flex-col gap-4 bg-surface-50 p-6 shadow-card">
        <h2 className="text-noto-subtitle-2">이미지 영역 선택</h2>

        <div className="flex w-full justify-center overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop) => {
              const nextCrop = clampCropHeight(pixelCrop);
              setCrop(nextCrop);
            }}
            onComplete={(pixelCrop) => {
              const nextCompletedCrop = clampCropHeight(pixelCrop);
              setCompletedCrop(nextCompletedCrop);
            }}
            keepSelection
            ruleOfThirds
            className="touch-none select-none"
            style={{
              touchAction: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              userSelect: 'none',
            }}
          >
            {/* biome-ignore lint/performance/noImgElement: canvas crop 작업을 위해 실제 HTMLImageElement 참조가 필요합니다. */}
            <img
              ref={imgRef}
              src={src}
              alt=""
              draggable={false}
              className="block max-h-[55dvh] max-w-full touch-none select-none"
              style={{
                touchAction: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
              }}
            />
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
