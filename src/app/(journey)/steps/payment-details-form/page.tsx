import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import PaymentMethodForm from '@/components/journey/forms/payment-method-form';
import data from '@/data/content.json';

export default function PaymentDetailsPage() {
  const steps = data.journey.sidebar.steps;

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

      <PaymentMethodForm />
    </>
  );
}
