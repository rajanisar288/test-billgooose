'use client';

import { useEffect } from 'react';

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

export function notifyJourneyStepFailed() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(JOURNEY_STEP_SUBMIT_FAILED_EVENT));
  }
}

