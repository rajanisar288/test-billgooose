'use client';

import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import PersonalDetailsForm from '@/components/journey/forms/personal-details-form';
import { useJourneyStepInfo } from '@/components/journey/useJourneyStepInfo';

export default function PersonalDetailsPage() {
  const { currentStep, totalSteps, currentStepData } = useJourneyStepInfo(1);

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        heading={currentStepData.title}
        description={currentStepData.description}
      />

      <PersonalDetailsForm />
    </>
  );
}
