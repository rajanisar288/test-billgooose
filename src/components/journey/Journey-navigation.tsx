'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowRight, LoaderCircle } from 'lucide-react';

import data from '@/data/content.json';

import {
  JOURNEY_STEP_STATUS_EVENT,
  JOURNEY_STEP_SUBMIT_FAILED_EVENT,
} from './journey-step-status';

type JourneyService = 'energy' | 'broadband' | 'insurance' | 'bundle-bills';

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
  const formId = `journey-step-form-${currentStep}`;
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      const form = document.getElementById(formId);
      setIsValid(form?.dataset.journeyValid === 'true');
    };

    updateStatus();
    window.addEventListener(JOURNEY_STEP_STATUS_EVENT, updateStatus);

    return () => {
      window.removeEventListener(JOURNEY_STEP_STATUS_EVENT, updateStatus);
    };
  }, [formId]);

  useEffect(() => {
    setIsSubmitting(false);
  }, [currentStep]);

  useEffect(() => {
    const handleFailed = () => {
      setIsSubmitting(false);
    };

    window.addEventListener(JOURNEY_STEP_SUBMIT_FAILED_EVENT, handleFailed);

    return () => {
      window.removeEventListener(JOURNEY_STEP_SUBMIT_FAILED_EVENT, handleFailed);
    };
  }, []);

  useEffect(() => {
    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;

      if (form.id === formId && form.dataset.journeyValid === 'true') {
        setIsSubmitting(true);
      }
    };

    document.addEventListener('submit', handleSubmit, true);

    return () => {
      document.removeEventListener('submit', handleSubmit, true);
    };
  }, [formId]);

  // Safety timeout to prevent button getting permanently stuck in loading state
  useEffect(() => {
    if (!isSubmitting) return;

    const timeout = setTimeout(() => {
      setIsSubmitting(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isSubmitting]);


  const { navigation } = data.journey;

  const handleBack = () => {
    // router.push(getPreviousJourneyRoute(currentStep, service));
    router.back();
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
        {/* Back */}
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
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

        {/* Continue / Complete */}
        <button
          type="submit"
          form={formId}
          disabled={!isValid || isSubmitting}
          aria-busy={isSubmitting}
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

            disabled:cursor-not-allowed
            disabled:opacity-60

            sm:h-[48px]
            sm:min-w-[160px]
          "
        >
          {continueLabel}
          {isSubmitting ? (
            <LoaderCircle
              aria-label="Loading"
              className="h-5 w-5 animate-spin"
            />
          ) : (
            <ArrowRight
              aria-hidden="true"
              className="
                h-4
                w-4
                shrink-0

                text-white
              "
              strokeWidth={3}
            />
          )}
        </button>
      </div>
    </footer>
  );
}
