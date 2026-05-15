export const PATH = {
  HOME: '/',

  START: '/start',
  LOGIN: '/login',
  KAKAO_LOGIN: '/kakaologin',

  CART: '/cart',
  REQUESTS: '/requests',
  NOTIFICATIONS: '/notifications',

  FEED: '/feed',
  FEED_UPLOAD: '/feed/upload',
  FEED_USER: (userId: string) => `/feed/user/${userId}`,

  HISTORY_CODE: '/history/code',
  HISTORY_DETAIL: (copyId: string) => `/history/${copyId}`,

  MY_PROFILE: '/my/profile',
  MY_FEED: '/my/feed',

  ORDER: '/order',
  ORDER_COMPLETE: '/order/complete',
  ORDER_PROCESSING: '/order/processing',
  ORDER_FAILED: '/order/failed',

  SENTENCE: (bookId: string) => `/sentence/${bookId}`,
};
