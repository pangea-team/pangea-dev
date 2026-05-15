'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Area, Point } from 'react-easy-crop';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { getCroppedImageBlob } from '@/app/feed/edit/_lib/crop-image';

/** 피드 카드 이미지 영역과 동일 (가로 맞춤 시 세로는 이 값을 넘지 않음) */
const FEED_CARD_IMAGE_WIDTH_PX = 360;
const FEED_CARD_IMAGE_HEIGHT_PX = 252;

const MIN_CROP_ASPECT = FEED_CARD_IMAGE_WIDTH_PX / FEED_CARD_IMAGE_HEIGHT_PX;
/** 가로가 더 넓은 크롭(세로 짧음)까지 허용하는 상한 (가로÷세로) */
const MAX_CROP_ASPECT = 3;

const PRESET_MATCH_EPSILON = 0.03;

const ASPECT_PRESETS = [
  { id: '10:7' as const, label: '10:7', ratio: MIN_CROP_ASPECT },
  { id: '16:9' as const, label: '16:9', ratio: 16 / 9 },
  { id: '2:1' as const, label: '2:1', ratio: 2 },
];

function isNearRatio(value: number, target: number) {
  return Math.abs(value - target) < PRESET_MATCH_EPSILON;
}

const CROP_CONTAINER_CLASSES =
  'relative h-[252px] w-full max-w-[360px] shrink-0 overflow-hidden bg-[#d9d9d9]';

export default function FeedEditClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(MIN_CROP_ASPECT);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const revokeSrc = useCallback((src: string | null) => {
    if (src?.startsWith('blob:')) {
      URL.revokeObjectURL(src);
    }
  }, []);

  useEffect(() => {
    return () => {
      revokeSrc(imageSrc);
    };
  }, [imageSrc, revokeSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file?.type.startsWith('image/')) {
      return;
    }
    setErrorMessage(null);
    setImageSrc((prev) => {
      revokeSrc(prev);
      return URL.createObjectURL(file);
    });
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspect(MIN_CROP_ASPECT);
    setCroppedAreaPixels(null);
  };

  const handleCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handlePresetClick = (preset: (typeof ASPECT_PRESETS)[number]) => {
    setAspect(preset.ratio);
    setCrop({ x: 0, y: 0 });
  };

  const handleSubmit = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      const uploadUrl = process.env.NEXT_PUBLIC_FEED_IMAGE_UPLOAD_URL;
      if (uploadUrl) {
        const formData = new FormData();
        formData.append('image', blob, 'feed-crop.jpg');
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Upload failed');
        }
      }
      router.push('/feed');
    } catch {
      setErrorMessage('업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="relative flex w-full max-w-[690px] flex-col bg-surface-50 p-6 shadow-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className={CROP_CONTAINER_CLASSES}>
        {imageSrc ? (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            restrictPosition
            zoomWithScroll
          />
        ) : (
          <button
            type="button"
            className="flex size-full flex-col items-center justify-center gap-20 px-4 py-6 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-pretendard-subtitle-1 text-primary whitespace-pre-line">
              {'밑줄 또는 메모가 있는\n책의 일부만 업로드할 수 있습니다.'}
            </p>
            <p className="text-pretendard-body-2 text-primary whitespace-pre-line">
              {'최대 3장까지 업로드 가능합니다.\n개인 정보가 포함된 이미지는 허용되지 않습니다.'}
            </p>
          </button>
        )}
      </div>

      {imageSrc ? (
        <div className="mt-comp-sm flex flex-col gap-3">
          <label className="flex max-w-[360px] flex-col gap-1">
            <span className="text-pretendard-label text-primary">
              비율 (가로÷세로) — 슬라이더로 조절
            </span>
            <input
              type="range"
              min={MIN_CROP_ASPECT}
              max={MAX_CROP_ASPECT}
              step={0.005}
              value={aspect}
              onChange={(e) => setAspect(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-pretendard-caption text-primary/80" aria-live="polite">
              현재 {aspect.toFixed(2)} — 피드에는 가로 360px에 맞추고 세로는 비율대로 표시됩니다.
            </span>
          </label>
          <fieldset className="m-0 flex flex-wrap gap-2 border-0 p-0">
            <legend className="sr-only">크롭 비율 빠른 선택</legend>
            {ASPECT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={
                  isNearRatio(aspect, preset.ratio)
                    ? 'border border-primary px-3 py-1.5 text-pretendard-body-2 text-primary'
                    : 'border border-primary/25 px-3 py-1.5 text-pretendard-body-2 text-primary/80'
                }
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </button>
            ))}
          </fieldset>
          <label className="flex flex-col gap-1">
            <span className="text-pretendard-label text-primary">
              확대 (슬라이더 또는 회색 영역에서 휠)
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full max-w-[360px]"
            />
          </label>
          <button
            type="button"
            className="text-pretendard-body-2 w-fit text-primary underline"
            onClick={() => fileInputRef.current?.click()}
          >
            다른 이미지 선택
          </button>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="text-pretendard-body-2 mt-comp-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-comp-sm flex justify-end">
        <button
          type="button"
          disabled={!imageSrc || !croppedAreaPixels || isSubmitting}
          className={
            imageSrc && croppedAreaPixels && !isSubmitting
              ? 'bg-[#d9d9d9] px-4 py-3 text-pretendard-body-2 text-surface-50'
              : 'cursor-not-allowed bg-purple3/40 px-4 py-3 text-pretendard-body-2 text-surface-50'
          }
          onClick={handleSubmit}
        >
          {isSubmitting ? '업로드 중…' : '선택 완료'}
        </button>
      </div>
    </article>
  );
}
