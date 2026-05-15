/** 피드 카드·이미지 영역 고정 치수 (spacing.css 토큰과 동일 값) */
export const FEED_CARD_WIDTH = 360;
export const FEED_CARD_HEIGHT = 600;
export const FEED_IMAGE_HEIGHT = 252;
export const MAX_FEED_IMAGES = 3;

/** explore: 카드 아래 프로필 연결선 연장 */
export const FEED_EXPLORE_CONNECTOR_EXTRA = 120;
export const FEED_EXPLORE_ROW_WITH_CONNECTOR_HEIGHT =
  FEED_CARD_HEIGHT + FEED_EXPLORE_CONNECTOR_EXTRA;

export const FEED_CARD_IMAGE_SIZES = `${FEED_CARD_WIDTH}px`;
export const FEED_IMAGE_MAX_HEIGHT_RATIO = FEED_IMAGE_HEIGHT / FEED_CARD_WIDTH;
