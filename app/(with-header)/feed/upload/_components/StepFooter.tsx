'use client';

type Props = {
  showBack?: boolean;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
};

export default function StepFooter({
  showBack,
  onBack,
  onNext,
  nextLabel,
  isNextDisabled,
  isLoading,
}: Props) {
  return (
    <div className=" bottom-0 z-10 py-3">
      <div className="flex gap-3">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="min-w-[80px] rounded-md border border-primary/20 px-4 py-3 text-pretendard-body-2 text-primary transition-colors hover:border-primary/40"
          >
            ← 이전
          </button>
        ) : null}
        <button
          type="button"
          disabled={isNextDisabled || isLoading}
          onClick={onNext}
          className="flex-1 rounded-md bg-purple2 px-4 py-3 text-pretendard-body-2 text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '게시 중…' : nextLabel}
        </button>
      </div>
    </div>
  );
}
