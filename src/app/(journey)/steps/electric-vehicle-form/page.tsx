'use client';

import { useSyncExternalStore } from 'react';

import ElectricVehicleForm from '@/components/journey/forms/electric-vehicle-form';
import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
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

    return 'energy';
  } catch {
    return 'energy';
  }
}

function getJourneyFlowServerSnapshot(): JourneyFlow {
  return 'energy';
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

export default function ElectricVehiclePage() {
  const { sidebar } = data.journey;

  const journeyFlow = useSyncExternalStore(
    subscribeToJourneyFlow,
    getJourneyFlowSnapshot,
    getJourneyFlowServerSnapshot,
  );

  const steps =
    journeyFlow === 'bundle'
      ? sidebar.bundleSteps
      : journeyFlow === 'broadband'
        ? sidebar.broadbandSteps
        : sidebar.energySteps;

  const currentStep = 4;

  const currentStepData = steps[currentStep - 1];

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        heading={currentStepData.title}
        description={currentStepData.description}
      />

      <ElectricVehicleForm />
    </>
  );
}
