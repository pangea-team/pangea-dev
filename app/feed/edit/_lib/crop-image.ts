import type { Area } from 'react-easy-crop';

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    if (!url.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }
    img.src = url;
  });
}

/** Canvas에서 원본 이미지와 픽셀 크롭 영역으로 이미지 Blob을 만든다. */
export async function getCroppedImageBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await loadImageElement(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = Math.round(pixelCrop.width);
  canvas.height = Math.round(pixelCrop.height);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
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
      0.92,
    );
  });
}
