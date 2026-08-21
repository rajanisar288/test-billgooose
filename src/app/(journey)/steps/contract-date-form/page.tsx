'use client';

import { useState } from 'react';

import data from '@/data/content.json';

import ContractDateForm from '../../../../components/journey/forms/contract-date-form';
import JourneyMobileStepHeader from '../../../../components/journey/forms/journey-mobile-step-header';

type JourneyService = 'energy' | 'broadband';

export default function ContractDatePage() {
  const { journey } = data;

  const [service] = useState<JourneyService>(() => {
    if (typeof window === 'undefined') {
      return 'energy';
    }

    try {
      const stored = sessionStorage.getItem('compareFlowDetails');

      if (!stored) {
        return 'energy';
      }

      const parsed = JSON.parse(stored) as {
        service?: string;
      };

      return parsed.service === 'broadband' ? 'broadband' : 'energy';
    } catch {
      return 'energy';
    }
  });

  const steps = service === 'broadband' ? journey.sidebar.broadbandSteps : journey.sidebar.steps;

  const step = steps[1];

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={2}
        totalSteps={steps.length}
        heading={step.title}
        description={step.description}
      />

      <ContractDateForm />
    </>
  );
}
