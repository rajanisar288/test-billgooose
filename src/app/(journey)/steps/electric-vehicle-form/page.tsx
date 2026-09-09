'use client';

import ElectricVehicleForm from '@/components/journey/forms/electric-vehicle-form';
import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import { useJourneyStepInfo } from '@/components/journey/useJourneyStepInfo';

export default function ElectricVehiclePage() {
  const { currentStep, totalSteps, currentStepData } = useJourneyStepInfo(4);

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        heading={currentStepData.title}
        description={currentStepData.description}
      />

      <ElectricVehicleForm />
    </>
  );
}
