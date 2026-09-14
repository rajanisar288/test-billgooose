'use client';

import ContractDateForm from '@/components/journey/forms/contract-date-form';
import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import { useJourneyStepInfo } from '@/components/journey/useJourneyStepInfo';

export default function ContractDatePage() {
  const { currentStep, totalSteps, currentStepData } = useJourneyStepInfo(2);

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        heading={currentStepData.title}
        description={currentStepData.description}
      />

      <ContractDateForm />
    </>
  );
}
