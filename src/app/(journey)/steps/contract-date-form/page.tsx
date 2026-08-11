import ContractDateForm from '@/components/journey/forms/contract-date-form';
import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import data from '@/data/content.json';

export default function ContractDatePage() {
  const steps = data.journey.sidebar.steps;

  const currentStep = 2;

  const currentStepData = steps[currentStep - 1];

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        heading={currentStepData.title}
        description="Please confirm when you’d like your new energy contract to begin."
      />

      <ContractDateForm />
    </>
  );
}
