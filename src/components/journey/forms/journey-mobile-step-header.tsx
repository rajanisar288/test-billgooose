type JourneyMobileStepHeaderProps = {
  currentStep: number;
  totalSteps: number;
  heading: string;
  description: string;
};

export default function JourneyMobileStepHeader({
  currentStep,
  totalSteps,
  heading,
  description,
}: JourneyMobileStepHeaderProps) {
  const radius = 26;

  const circumference = 2 * Math.PI * radius;

  const progress = currentStep / totalSteps;

  const strokeDashoffset = circumference * (1 - progress);

  return (
    <section
      className="
        flex w-full
        items-center
        justify-between
        gap-4

        bg-[#F9F9F9]

        pb-5
        pt-6

        lg:hidden
      "
    >
      {/* Heading */}
      <div className="min-w-0 flex-1">
        <h1
          className="
            font-red-hat-display
            text-[22px]
            font-extrabold
            leading-[100%]
            tracking-[0]
            text-[#0C3354]

            md:text-[40px]
            md:leading-[48px]
          "
        >
          {heading}
        </h1>

        <p
          className="
            mt-2

            font-inter
            text-[16px]
            font-normal
            leading-[23px]
            tracking-[0]
            text-[#667085]

            md:mt-1
            md:text-[18px]
            md:leading-[25px]
          "
        >
          {description}
        </p>
      </div>

      {/* Step ring */}
      <div
        className="
          relative
          flex h-16
          w-16
          shrink-0
          items-center
          justify-center
        "
      >
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="
            absolute
            inset-0

            h-16
            w-16

            -rotate-90
          "
        >
          {/* Background ring */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#F2F4F7"
            strokeWidth="6"
          />

          {/* Progress */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#00897B"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <span
          className="
            relative z-10

            whitespace-nowrap

            font-inter
            text-[12px]
            font-extrabold
            leading-5
            text-[#0C3354]
          "
        >
          {currentStep} of {totalSteps}
        </span>
      </div>
    </section>
  );
}
