'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import data from '@/data/content.json';

type JourneyNavigationProps = {
  currentStep: number;
  totalSteps: number;
};

export default function JourneyNavigation({ currentStep, totalSteps }: JourneyNavigationProps) {
  const router = useRouter();
  const { navigation } = data.journey;

  function handleBack() {
    if (currentStep === 1) {
      router.push(navigation.backToWebsiteHref);
      return;
    }

    router.push(`/steps?step=${currentStep - 1}`);
  }

  function handleContinue() {
    const formId = `journey-step-form-${currentStep}`;

    const form = document.getElementById(formId) as HTMLFormElement | null;

    if (form) {
      form.requestSubmit();
      return;
    }

    if (currentStep < totalSteps) {
      router.push(`/steps?step=${currentStep + 1}`);
    }
  }

  return (
    <footer className="z-40 shrink-0 border-t border-[#E4E7EC] bg-white">
      <div className="mx-auto flex min-h-[68px] w-full max-w-[1120px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-6">
        <button
          type="button"
          onClick={handleBack}
          className="
            inline-flex h-9 items-center justify-center gap-1.5
            rounded-full border border-[#D0D5DD] bg-white
            px-4 font-inter text-[13px] font-medium text-[#344054]
            shadow-[0px_1px_2px_rgba(16,24,40,0.05)]
            transition

            hover:bg-[#F9FAFB]

            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-[#E6F4F2]
          "
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.8}
          />

          <span>{navigation.backButton}</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="
            inline-flex h-9 items-center justify-center gap-1.5
            rounded-full border border-[#00897B] bg-[#00897B]
            px-4 font-inter text-[13px] font-semibold text-white
            shadow-[0px_1px_2px_rgba(16,24,40,0.05)]
            transition

            hover:bg-[#00796D]

            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-[#D5F2EE]
          "
        >
          <span>Continue</span>

          <ArrowRight
            size={15}
            strokeWidth={2}
          />
        </button>
      </div>
    </footer>
  );
}
