import HouseholdForm from '@/components/journey/forms/household-form';
import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import data from '@/data/content.json';

export default function HouseholdPage() {
  const steps = data.journey.sidebar.steps;

  const currentStep = 3;

  const currentStepData = steps[currentStep - 1];

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        heading={currentStepData.title}
        description="Tell us about house type and household size."
      />

      <HouseholdForm />
    </>
  );
}
