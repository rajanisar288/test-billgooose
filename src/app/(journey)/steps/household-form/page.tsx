'use client';

import HouseholdForm from '@/components/journey/forms/household-form';
import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import { useJourneyStepInfo } from '@/components/journey/useJourneyStepInfo';

export default function HouseholdPage() {
  const { currentStep, totalSteps, currentStepData } = useJourneyStepInfo(3);

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        heading={currentStepData.title}
        description={currentStepData.description}
      />

      <HouseholdForm />
    </>
  );
}
