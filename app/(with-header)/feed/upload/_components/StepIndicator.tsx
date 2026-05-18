type Props = {
  currentStep: 1 | 2 | 3;
};

const STEPS = [1, 2, 3] as const;

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step) => {
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-pretendard-caption transition-colors ${
                isActive
                  ? 'bg-purple2 font-bold text-white'
                  : isDone
                    ? 'bg-purple2/30 text-purple2'
                    : 'bg-primary/10 text-primary/40'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {step}
            </div>
            {step < 3 ? (
              <div
                className={`h-px w-8 transition-colors ${isDone ? 'bg-purple2/40' : 'bg-primary/15'}`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
