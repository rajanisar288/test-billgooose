'use client';

import { useRouter } from 'next/navigation';

import { ArrowRight } from 'lucide-react';

import data from '@/data/content.json';

import { getPreviousJourneyRoute } from './journey-routes';

type JourneyService = 'energy' | 'broadband' | 'insurance';

type JourneyNavigationProps = {
  currentStep: number;
  totalSteps: number;
  service: JourneyService;
};

export default function JourneyNavigation({
  currentStep,
  totalSteps,
  service,
}: JourneyNavigationProps) {
  const router = useRouter();

  const { navigation } = data.journey;

  const handleBack = () => {
    router.push(getPreviousJourneyRoute(currentStep, service));
  };

  const continueLabel =
    service === 'energy' && currentStep === 2
      ? 'Acknowledge & Continue'
      : currentStep === totalSteps
        ? navigation.completeButton
        : navigation.continueButton;

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
        <button
          type="button"
          onClick={handleBack}
          className="
            inline-flex
            h-[44px]
            items-center
            justify-center
            gap-1

            rounded-full

            border
            border-[#D0D5DD]

            bg-white

            px-5

            font-red-hat-display
            text-[16px]
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
          <span
            aria-hidden="true"
            className="
              mr-1
              h-[8px]
              w-[8px]
              shrink-0
              rotate-45
              border-b-[2px]
              border-l-[2px]
              border-[#344054]
            "
          />

          {navigation.backButton}
        </button>

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
            text-[16px]
            font-[800]
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
            className="h-4 w-4 shrink-0 text-white"
            strokeWidth={3}
          />
        </button>
      </div>
    </footer>
  );
}
