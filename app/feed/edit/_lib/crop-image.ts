import type { PixelCrop } from 'react-image-crop';

const JPEG_QUALITY = 0.92;

/** 표시 크기 → 원본 해상도 스케일을 적용해 Blob을 만든다. */
export async function getCroppedImageBlob(
  imgElement: HTMLImageElement,
  pixelCrop: PixelCrop,
): Promise<Blob> {
  const scaleX = imgElement.naturalWidth / imgElement.width;
  const scaleY = imgElement.naturalHeight / imgElement.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = Math.round(pixelCrop.width * scaleX);
  canvas.height = Math.round(pixelCrop.height * scaleY);

  ctx.drawImage(
    imgElement,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      },
      'image/jpeg',
      JPEG_QUALITY,
    );
  });
}
