'use client';

import { useState } from 'react';

import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import PaymentMethodForm from '@/components/journey/forms/payment-method-form';
import data from '@/data/content.json';

type JourneyService = 'energy' | 'broadband';

export default function PaymentDetailsPage() {
  const { sidebar } = data.journey;

  const currentStep = 4;

  const [service] = useState<JourneyService>(() => {
    if (typeof window === 'undefined') {
      return 'energy';
    }

    try {
      const storedCompareFlow = sessionStorage.getItem('compareFlowDetails');

      if (!storedCompareFlow) {
        return 'energy';
      }

      const parsedCompareFlow = JSON.parse(storedCompareFlow) as {
        service?: string;
      };

      return parsedCompareFlow.service === 'broadband' ? 'broadband' : 'energy';
    } catch {
      return 'energy';
    }
  });

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
