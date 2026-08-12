import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import PersonalDetailsForm from '@/components/journey/forms/personal-details-form';
import data from '@/data/content.json';

export default function PersonalDetailsPage() {
  const steps = data.journey.sidebar.steps;

  const currentStep = 1;

  const currentStepData = steps[currentStep - 1];

  return (
    <>
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        heading={currentStepData.title}
        description={currentStepData.description}
      />

      <PersonalDetailsForm />
    </>
  );
}
