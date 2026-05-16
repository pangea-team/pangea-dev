/**
 * 피드 이미지 업로드. env가 없으면 호출부에서 메시지를 구분해 표시한다.
 * TODO: 백엔드 스펙 확정 시 단일 API·응답 URL 배열·TanStack Query mutation으로 교체
 */
export class FeedImageUploadError extends Error {
  readonly code: 'MISSING_UPLOAD_URL' | 'UPLOAD_FAILED';

  constructor(code: 'MISSING_UPLOAD_URL' | 'UPLOAD_FAILED', message: string) {
    super(message);
    this.code = code;
    this.name = 'FeedImageUploadError';
  }
}

export async function uploadFeedImageBlobs(blobs: Blob[]): Promise<void> {
  const uploadUrl = process.env.NEXT_PUBLIC_FEED_IMAGE_UPLOAD_URL;
  if (!uploadUrl) {
    throw new FeedImageUploadError('MISSING_UPLOAD_URL', 'MISSING_UPLOAD_URL');
  }
  for (const [index, blob] of blobs.entries()) {
    const formData = new FormData();
    formData.append('image', blob, `feed-crop-${index + 1}.jpg`);
    const res = await fetch(uploadUrl, { method: 'POST', body: formData });
    if (!res.ok) {
      throw new FeedImageUploadError('UPLOAD_FAILED', 'Upload failed');
    }
  }
}
