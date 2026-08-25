'use client';

import { useSyncExternalStore } from 'react';

import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import PaymentMethodForm from '@/components/journey/forms/payment-method-form';
import data from '@/data/content.json';

type JourneyService = 'energy' | 'broadband';

function getServiceSnapshot(): JourneyService {
  try {
    const raw = sessionStorage.getItem('compareFlowDetails');

    if (!raw) {
      return 'energy';
    }

    const parsed = JSON.parse(raw) as {
      service?: string;
    };

    return parsed.service === 'broadband' ? 'broadband' : 'energy';
  } catch {
    return 'energy';
  }
}

function getServerSnapshot(): JourneyService {
  return 'energy';
}

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'compareFlowDetails') {
      callback();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
  };
}

export default function PaymentDetailsPage() {
  const { sidebar } = data.journey;

  const service = useSyncExternalStore(subscribe, getServiceSnapshot, getServerSnapshot);

  /*
   * Energy Payment = step 5
   * Broadband Contract Length = step 4
   */
  const currentStep = service === 'broadband' ? 4 : 5;

  const steps = service === 'broadband' ? sidebar.broadbandSteps : sidebar.steps;

  const currentStepData = steps[currentStep - 1];

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        heading={currentStepData.title}
        description={currentStepData.description}
      />

      <PaymentMethodForm />
    </>
  );
}
