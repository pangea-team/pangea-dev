export const PATH = {
  HOME: '/',

  START: '/start',
  LOGIN: '/login',
  KAKAO_LOGIN: '/kakaologin',
  ONBOARDING: '/onboarding',

  CART: '/cart',
  EXPLORE: '/explore',
  REQUESTS: '/requests',
  NOTIFICATIONS: '/notifications',

  FEED: '/feed',
  FEED_UPLOAD: '/feed/upload',
  FEED_UPLOAD_PREVIEW: '/feed/upload/preview',

  FEED_USER: (userId: string) => `/feed/user/${userId}`,

  HISTORY_CODE: '/history/code',
  HISTORY_DETAIL: (copyId: string) => `/history/${copyId}`,

  ORDER: '/order',
  ORDER_COMPLETE: '/order/complete',
  ORDER_PROCESSING: '/order/processing',
  ORDER_FAILED: '/order/failed',

  SENTENCE: (bookId: string) => `/sentence/${bookId}`,
};
