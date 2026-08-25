'use client';

import ElectricVehicleForm from '@/components/journey/forms/electric-vehicle-form';
import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import data from '@/data/content.json';

export default function ElectricVehiclePage() {
  const { sidebar } = data.journey;

  const currentStep = 4;

  const currentStepData = sidebar.steps[currentStep - 1];

  return (
    <>
      {/* Mobile + tablet */}
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={sidebar.steps.length}
        heading={currentStepData.title}
        description={currentStepData.description}
      />

      <ElectricVehicleForm />
    </>
  );
}
