import bookCover1 from '@/public/images/book_covers/book_cover_1.webp';
import bookCover2 from '@/public/images/book_covers/book_cover_2.webp';
import bookCover3 from '@/public/images/book_covers/book_cover_3.webp';
import bookCover4 from '@/public/images/book_covers/book_cover_4.webp';
import BookCard from './BookCard';

const BOOK_COVERS = [
  {
    image: bookCover1,
    book_no: 1,
    mood: '다정한',
    keyword: '신뢰 / 연결',
    type: 'epistolary novel',
  },
  {
    image: bookCover2,
    book_no: 2,
    mood: '감동적인',
    keyword: '희망 / 용기',
    type: 'contemporary fiction',
  },
  {
    image: bookCover3,
    book_no: 3,
    mood: '로맨틱한',
    keyword: '사랑 / 이별',
    type: 'romance',
  },
  {
    image: bookCover4,
    book_no: 4,
    mood: '심리적인',
    keyword: '정서 / 성장',
    type: 'psychological novel',
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="flex flex-col items-start gap-2 px-content-x pt-section-lg">
        <p className="text-noto-title-1 py-4">5월의 문장들</p>
        <p className="text-noto-subtitle-2 py-4">
          “<span className="text-noto-subtitle-1">동심</span>, 당신이 믿었던 세계는 무엇인가”
        </p>
      </div>
      <div className="flex flex-col items-center gap-section-sm pt-section-md md:items-end md:pr-content-x mb-hero">
        {BOOK_COVERS.map((cover) => (
          <BookCard
            key={cover.book_no}
            image={cover.image}
            book_no={cover.book_no}
            mood={cover.mood}
            keyword={cover.keyword}
            type={cover.type}
          />
        ))}
      </div>
    </div>
  );
}
