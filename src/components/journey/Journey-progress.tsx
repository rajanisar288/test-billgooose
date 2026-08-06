type JourneyProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export default function JourneyProgress({ currentStep, totalSteps }: JourneyProgressProps) {
  return (
    <div className="shrink-0 px-5 pt-5 sm:px-8 lg:px-12 lg:pt-6">
      <div
        className="
          mx-auto flex w-full max-w-[500px]
          items-center justify-between
          gap-2 sm:gap-2.5 lg:gap-3
        "
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isReached = stepNumber <= currentStep;

          return (
            <span
              key={stepNumber}
              className={`
                h-1.5 min-w-0 flex-1
                rounded-[4px]
                transition-colors duration-200

                sm:h-[7px]

                lg:h-2
                lg:w-[116px]
                lg:flex-none

                ${isReached ? 'bg-[#00897B]' : 'bg-[#D8DDE3]'}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}
