'use client';

type Props = {
  content: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

export default function SentenceContent({ content, selectedIndex, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {content.map((paragraph, index) => (
        <button
          // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are static ordered content
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className={[
            'text-noto-subtitle-1 w-full cursor-pointer whitespace-pre-line text-left leading-relaxed transition-opacity',
            'hover:opacity-60',
            selectedIndex === index ? 'underline decoration-1 underline-offset-8' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {paragraph}
        </button>
      ))}
    </div>
  );
}
