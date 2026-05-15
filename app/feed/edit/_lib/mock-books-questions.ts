import { MOCK_HEADER_BAR_BACKGROUNDS } from '@/app/feed/_lib/mock-header-bar-backgrounds';

/**
 * 목업: 홈 4권과 동일한 식별자(표지, No.)를 맞춤. API 연동 시 이 모듈을 서버/클라이언트 fetch로 교체.
 */
export type FeedBook = {
  id: string;
  bookNo: number;
  coverSrc: string;
  mood: string;
  type: string;
  /** FeedCard 상단 type 영역에 표시 */
  feedTypeLabel: string;
  orderPurchasable: boolean;
  /**
   * 피드 카드 상단 바 배경 — 표지 webp 상단 영역을 샘플링한 hex (파일 교체 시 동일 방식으로 갱신)
   */
  headerBarBg: string;
};

export type FeedBookQuestion = {
  id: string;
  bookId: string;
  text: string;
};

const MOOD_BOOKS: FeedBook[] = [
  {
    id: 'book-1',
    bookNo: 1,
    coverSrc: '/images/book_covers/book_cover_1.webp',
    mood: '다정한',
    type: 'epistolary novel',
    feedTypeLabel: 'WONDER NOTE',
    orderPurchasable: true,
    headerBarBg: MOCK_HEADER_BAR_BACKGROUNDS[0],
  },
  {
    id: 'book-2',
    bookNo: 2,
    coverSrc: '/images/book_covers/book_cover_2.webp',
    mood: '감동적인',
    type: 'contemporary fiction',
    feedTypeLabel: 'WONDER NOTE',
    orderPurchasable: true,
    headerBarBg: MOCK_HEADER_BAR_BACKGROUNDS[1],
  },
  {
    id: 'book-3',
    bookNo: 3,
    coverSrc: '/images/book_covers/book_cover_3.webp',
    mood: '로맨틱한',
    type: 'romance',
    feedTypeLabel: 'WONDER NOTE',
    orderPurchasable: false,
    headerBarBg: MOCK_HEADER_BAR_BACKGROUNDS[2],
  },
  {
    id: 'book-4',
    bookNo: 4,
    coverSrc: '/images/book_covers/book_cover_4.webp',
    mood: '심리적인',
    type: 'psychological novel',
    feedTypeLabel: 'WONDER NOTE',
    orderPurchasable: true,
    headerBarBg: MOCK_HEADER_BAR_BACKGROUNDS[3],
  },
];

const QUESTIONS_BY_BOOK: Record<string, FeedBookQuestion[]> = {
  'book-1': [
    { id: 'q1-1', bookId: 'book-1', text: '당신에게 편지란 어떤 의미인가요?' },
    { id: 'q1-2', bookId: 'book-1', text: '말하지 못한 마음을 책 속 한 구절로 고른다면?' },
    { id: 'q1-3', bookId: 'book-1', text: '누군가에게 진심을 전하는 순간을 떠올려 보세요.' },
  ],
  'book-2': [
    { id: 'q2-1', bookId: 'book-2', text: '요즘 마음을 움직인 한 장면은 무엇인가요?' },
    { id: 'q2-2', bookId: 'book-2', text: '삶이 달라진 작은 순간이 있었나요?' },
    { id: 'q2-3', bookId: 'book-2', text: '당신이 붙잡고 싶은 희망의 색은 무엇인가요?' },
    { id: 'q2-4', bookId: 'book-2', text: '오늘 하루, 용기를 낸 일이 있었나요?' },
  ],
  'book-3': [
    { id: 'q3-1', bookId: 'book-3', text: '사랑이라고 부르기엔 아직 어색했던 순간이 있나요?' },
    { id: 'q3-2', bookId: 'book-3', text: '헤어짐과 만남 중, 지금 마음에 더 가까운 쪽은?' },
    { id: 'q3-3', bookId: 'book-3', text: '미워하지 못하는 사람에게 남기고 싶은 한 마디는?' },
  ],
  'book-4': [
    { id: 'q4-1', bookId: 'book-4', text: '스스로를 이해하게 된 문장이 있었나요?' },
    { id: 'q4-2', bookId: 'book-4', text: '마음의 균열이 비로 드러난 순간을 적어 주세요.' },
    { id: 'q4-3', bookId: 'book-4', text: '누구에게도 말하지 않았던 생각을 한 줄로 남긴다면?' },
    { id: 'q4-4', bookId: 'book-4', text: '성장했다고 느낀 건 언제였나요?' },
  ],
};

export function getMockBooks(): FeedBook[] {
  return MOOD_BOOKS;
}

export function getMockQuestionsByBookId(bookId: string): FeedBookQuestion[] {
  return QUESTIONS_BY_BOOK[bookId] ?? [];
}

export function getMockBookById(bookId: string | null): FeedBook | undefined {
  if (!bookId) {
    return undefined;
  }
  return MOOD_BOOKS.find((b) => b.id === bookId);
}
