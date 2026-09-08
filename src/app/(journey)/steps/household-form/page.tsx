'use client';

import { useSyncExternalStore } from 'react';

import HouseholdForm from '@/components/journey/forms/household-form';
import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import data from '@/data/content.json';

type JourneyFlow = 'energy' | 'bundle-bills' | 'broadband';

function getJourneyFlowSnapshot(): JourneyFlow {
  try {
    const storedFlow = sessionStorage.getItem('billgooseJourneyFlow');
    const serviceType = localStorage.getItem('journey-storage')
      ? JSON.parse(localStorage.getItem('journey-storage') as string)?.state?.journey?.serviceType
      : null;

    // if (storedFlow === 'bundle') {
    //   return 'bundle';
    // }

    // if (storedFlow === 'broadband') {
    //   return 'broadband';
    // }

    return serviceType == 'billPackage' ? 'bundle-bills' : serviceType;
  } catch {
    return 'energy';
  }
}

function getJourneyFlowServerSnapshot(): JourneyFlow {
  const serviceType = localStorage.getItem('journey-storage')
    ? JSON.parse(localStorage.getItem('journey-storage') as string)?.state?.journey?.serviceType
    : null;
  return serviceType == 'billPackage' ? 'bundle-bills' : serviceType;
}

function subscribeToJourneyFlow(callback: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === 'billgooseJourneyFlow' || event.key === 'compareFlowDetails') {
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

export default function HouseholdPage() {
  const { sidebar } = data.journey;

  const journeyFlow = useSyncExternalStore(
    subscribeToJourneyFlow,
    getJourneyFlowSnapshot,
    getJourneyFlowServerSnapshot,
  );

  const steps =
    journeyFlow === 'bundle-bills'
      ? sidebar.bundleSteps
      : journeyFlow === 'broadband'
        ? sidebar.broadbandSteps
        : sidebar.energySteps;

  const currentStep = 3;

  const currentStepData = steps[currentStep - 1];

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        heading={currentStepData.title}
        description={
          journeyFlow === 'broadband'
            ? currentStepData.description
            : 'Tell us about house type and household size.'
        }
      />

      <HouseholdForm />
    </>
  );
}
