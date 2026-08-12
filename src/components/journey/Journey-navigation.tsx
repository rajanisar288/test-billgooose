'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import data from '@/data/content.json';

import { getPreviousJourneyRoute } from './journey-routes';

type JourneyNavigationProps = {
  currentStep: number;
  totalSteps: number;
};

export default function JourneyNavigation({ currentStep, totalSteps }: JourneyNavigationProps) {
  const router = useRouter();

  const { navigation } = data.journey;

  const handleBack = () => {
    router.push(getPreviousJourneyRoute(currentStep));
  };

  const continueLabel =
    currentStep === totalSteps ? navigation.completeButton : navigation.continueButton;

  return (
    <footer
      className="
        w-full
        shrink-0

        border-t
        border-[#EAECF0]

        bg-white

        px-4
        py-4

        min-[390px]:px-5

        sm:px-8

        lg:px-12
      "
    >
      <div
        className="
          mx-auto

          flex
          w-full
          max-w-[1120px]

          items-center
          justify-between
          gap-4
        "
      >
        {/* Back */}
        <button
          type="button"
          onClick={handleBack}
          className="
            inline-flex
            h-[44px]
            items-center
            justify-center
            gap-2

            rounded-full

            border
            border-[#D0D5DD]

            bg-white

            px-5

            font-red-hat-display
            text-[14px]
            font-bold
            leading-5
            text-[#344054]

            shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

            transition-colors

            hover:bg-[#F9FAFB]

            sm:h-[48px]
            sm:px-6
          "
        >
          <ArrowLeft
            aria-hidden="true"
            className="
              h-4 w-4
              shrink-0
            "
            strokeWidth={2}
          />

          {navigation.backButton}
        </button>

        {/* Continue / Complete */}
        <button
          type="submit"
          form={`journey-step-form-${currentStep}`}
          className="
            inline-flex
            h-[44px]
            min-w-[140px]
            items-center
            justify-center
            gap-2

            rounded-full

            border
            border-[#00897B]

            bg-[#00897B]

            px-6

            font-red-hat-display
            text-[14px]
            font-bold
            leading-5
            text-white

            shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

            transition-colors

            hover:bg-[#00796D]

            sm:h-[48px]
            sm:min-w-[160px]
          "
        >
          {continueLabel}

          <ArrowRight
            aria-hidden="true"
            className="
              h-4 w-4
              shrink-0
            "
            strokeWidth={2}
          />
        </button>
      </div>
    </footer>
  );
}
