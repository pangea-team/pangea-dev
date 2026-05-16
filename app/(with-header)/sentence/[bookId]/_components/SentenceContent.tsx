'use client';

// TODO: [SEASON-1] 시즌 1 종료 시 아래 항목 모두 제거:
// - DISABLED_INDICES_BY_BOOK 상수
// - bookId prop 및 isDisabled 관련 로직
// - 부모(BookReader)에서 bookId 전달하는 부분
const DISABLED_INDICES_BY_BOOK: Record<number, number[]> = {
  8: [0],
};

type Props = {
  bookId: number;
  content: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

export default function SentenceContent({ bookId, content, selectedIndex, onSelect }: Props) {
  const disabledIndices = DISABLED_INDICES_BY_BOOK[bookId] ?? [];

  return (
    <div className="flex flex-col gap-8">
      {content.map((paragraph, index) => {
        const isDisabled = disabledIndices.includes(index);
        return (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are static ordered content
            key={index}
            type="button"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            onClick={isDisabled ? undefined : () => onSelect(index)}
            className={[
              'text-noto-subtitle-1 w-full whitespace-pre-line text-left leading-relaxed transition-opacity',
              isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:opacity-60',
              !isDisabled && selectedIndex === index
                ? 'underline decoration-1 underline-offset-8 decoration-purple2'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {paragraph}
          </button>
        );
      })}
    </div>
  );
}
