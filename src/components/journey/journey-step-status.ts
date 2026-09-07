'use client';

import { useEffect } from 'react';

export const JOURNEY_STEP_STATUS_EVENT = 'billgoose-journey-step-status-changed';

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
