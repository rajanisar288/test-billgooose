'use client';

import { useSyncExternalStore } from 'react';

import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import PaymentMethodForm from '@/components/journey/forms/payment-method-form';
import data from '@/data/content.json';

type JourneyFlow = 'energy' | 'bundle' | 'broadband';

function getJourneyFlowSnapshot(): JourneyFlow {
  try {
    const storedFlow = sessionStorage.getItem('billgooseJourneyFlow');

    if (storedFlow === 'bundle') {
      return 'bundle';
    }

    if (storedFlow === 'broadband') {
      return 'broadband';
    }

    const raw = sessionStorage.getItem('compareFlowDetails');

    if (!raw) {
      return 'energy';
    }

    const parsed = JSON.parse(raw) as {
      service?: string;
      flow?: string;
    };

    if (parsed.flow === 'bundle') {
      return 'bundle';
    }

    if (parsed.service === 'broadband') {
      return 'broadband';
    }

    return 'energy';
  } catch {
    return 'energy';
  }
}

function getServerSnapshot(): JourneyFlow {
  return 'energy';
}

function subscribe(callback: () => void) {
  function handleStorage(event: StorageEvent) {
    if (
      event.key === 'compareFlowDetails' ||
      event.key === 'billgooseJourneyFlow' ||
      event.key === 'billgooseJourneyService'
    ) {
      callback();
    }
  }

  function handleJourneyChanged() {
    callback();
  }

  window.addEventListener('storage', handleStorage);

  window.addEventListener('billgoose-compare-flow-changed', handleJourneyChanged);

  window.addEventListener('billgoose-journey-service-changed', handleJourneyChanged);

  return () => {
    window.removeEventListener('storage', handleStorage);

    window.removeEventListener('billgoose-compare-flow-changed', handleJourneyChanged);

    window.removeEventListener('billgoose-journey-service-changed', handleJourneyChanged);
  };
}

export default function PaymentDetailsPage() {
  const { sidebar } = data.journey;

  const journeyFlow = useSyncExternalStore(subscribe, getJourneyFlowSnapshot, getServerSnapshot);

  /*
   * Broadband:
   * payment-details-form is reused as
   * Contract Length = Step 4 of 4.
   *
   * Bundle:
   * payment-details-form is
   * Payment Method Type = Step 5 of 5.
   *
   * Normal Energy:
   * this route is no longer part of the journey.
   */
  const isBroadband = journeyFlow === 'broadband';

  const steps = isBroadband ? sidebar.broadbandSteps : sidebar.bundleSteps;

  const currentStep = isBroadband ? 4 : 5;

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
