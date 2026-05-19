export const PATH = {
  HOME: '/',
  BOOKS: '/books',

  KAKAO_LOGIN: '/kakaologin',
  ONBOARDING: '/onboarding',

  CART: '/cart',
  EXPLORE: '/explore',

  FEED: '/feed',
  FEED_UPLOAD: '/feed/upload',

  ORDER: '/order',
  ORDER_COMPLETE: '/order/complete',

  SENTENCE: (bookId: string) => `/sentence/${bookId}`,
};
