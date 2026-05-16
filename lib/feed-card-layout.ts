/** 피드 카드·이미지 기준 치수 (업로드 크롭·next/image intrinsic과 동기화) */
export const FEED_CARD_TYPE_LABEL = 'TRACE CARD';

export const FEED_CARD_WIDTH = 360;
/** 카드 전체 비율 3:5 (360×600) */
export const FEED_CARD_HEIGHT = 600;
export const FEED_IMAGE_HEIGHT = 252;
export const MAX_FEED_IMAGES = 3;

/** 카드 높이 대비 이미지 영역 비율 (252/600) */
export const FEED_IMAGE_HEIGHT_RATIO = FEED_IMAGE_HEIGHT / FEED_CARD_HEIGHT;

/** explore 레이아웃은 고정 행 높이 대신 flex stretch로 카드 높이에 맞춤 */

/** 카드 열·그리드 열 수에 맞춘 sizes (반응형) */
export const FEED_CARD_IMAGE_SIZES =
  '(max-width: 767px) min(100vw - 3rem, 360px), (max-width: 1279px) min(50vw - 3rem, 360px), 360px';

export const FEED_IMAGE_MAX_HEIGHT_RATIO = FEED_IMAGE_HEIGHT / FEED_CARD_WIDTH;
