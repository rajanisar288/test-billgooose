'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

export const JOURNEY_STEP_STATUS_EVENT = 'billgoose-journey-step-status-changed';
export const JOURNEY_STEP_SUBMIT_FAILED_EVENT = 'billgoose-journey-step-submit-failed';

export function useJourneyStepStatus(formId: string, isValid: boolean) {
  useEffect(() => {
    const form = document.getElementById(formId);

    if (!form) {
      return;
    }

    form.dataset.journeyValid = String(isValid);
    window.dispatchEvent(new Event(JOURNEY_STEP_STATUS_EVENT));
  }, [formId, isValid]);
}

export function notifyJourneyStepFailed(errorMessage?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(JOURNEY_STEP_SUBMIT_FAILED_EVENT, {
        detail: { message: errorMessage },
      }),
    );
  }
}

export function useJourneyStepError() {
  const [stepError, setStepError] = useState<string>('');
  const [prevPathname, setPrevPathname] = useState<string>('');
  const pathname = usePathname();

  // Reset error when step / route changes
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setStepError('');
  }

  useEffect(() => {
    const handleFailed = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      if (customEvent?.detail?.message) {
        setStepError(customEvent.detail.message);
      }
    };

    const handleSubmit = () => {
      setStepError('');
    };

    window.addEventListener(JOURNEY_STEP_SUBMIT_FAILED_EVENT, handleFailed);
    document.addEventListener('submit', handleSubmit, true);

    return () => {
      window.removeEventListener(JOURNEY_STEP_SUBMIT_FAILED_EVENT, handleFailed);
      document.removeEventListener('submit', handleSubmit, true);
    };
  }, []);

  const clearError = () => setStepError('');

  return { stepError, setStepError, clearError };
}
