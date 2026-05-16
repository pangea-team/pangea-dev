import Image, { type StaticImageData } from 'next/image';

interface BookCardProps {
  image: StaticImageData;
  book_no: number;
  mood: string;
  keyword: string;
  type: string;
}

export default function BookCard({ image, book_no, mood, keyword, type }: BookCardProps) {
  return (
    <div className="relative mt-10 flex w-full max-w-4xl flex-col gap-comp-sm px-content-x md:flex-row md:gap-comp-md">
      <div className="relative w-full max-w-87.5 shrink-0 self-center md:self-auto">
        <Image
          src={image}
          alt="Book Cover"
          sizes="(max-width: 768px) 100vw, 350px"
          className="w-full h-auto shadow-[-3px_6px_12px_0_rgba(0,0,0,0.25)]"
        />
      </div>
      <div className="relative flex flex-col">
        <span className="text-noto-subtitle-2 py-2 px-1">No.{book_no}</span>
        <div className="flex flex-col flex-wrap gap-comp-md pt-comp-sm md:pt-comp-md">
          <div className="flex flex-col gap-2">
            <span>MOOD</span>
            <p>{mood}</p>
          </div>
          <div className="flex flex-col gap-2">
            <span>KEYWORD</span>
            <p>{keyword}</p>
          </div>
          <div className="flex flex-col gap-2">
            <span>TYPE</span>
            <p>{type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
