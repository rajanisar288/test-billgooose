'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import ContractDateForm from '@/components/journey/forms/contract-date-form';
import HouseholdForm from '@/components/journey/forms/household-form';
import JourneyMobileStepHeader from '@/components/journey/forms/journey-mobile-step-header';
import PaymentMethodForm from '@/components/journey/forms/payment-method-form';
import PersonalDetailsForm from '@/components/journey/forms/personal-details-form';
import data from '@/data/content.json';

export const dynamic = 'force-dynamic';

function StepsContent() {
  const searchParams = useSearchParams();

  const requestedStep = Number(searchParams.get('step') ?? '1');

  const currentStep = Math.min(Math.max(requestedStep, 1), 4);

  const steps = data.journey.sidebar.steps;

  const currentStepData = steps[currentStep - 1];

  /*
   * Mobile-only description override.
   *
   * Desktop descriptions still come
   * from each individual form component.
   */
  const mobileStepDescription =
    currentStep === 2
      ? 'Please confirm when you’d like your new energy contract to begin.'
      : currentStep === 3
        ? 'Tell us about house type and household size.'
        : currentStepData.description;

  const renderStepForm = () => {
    switch (currentStep) {
      case 2:
        return <ContractDateForm />;

      case 3:
        return <HouseholdForm />;

      case 4:
        return <PaymentMethodForm />;

      case 1:
      default:
        return <PersonalDetailsForm />;
    }
  };

  return (
    <>
      {/* Mobile step title + progress ring */}
      <JourneyMobileStepHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        heading={currentStepData.title}
        description={mobileStepDescription}
      />

      {/* Step form */}
      {renderStepForm()}
    </>
  );
}

export default function StepsPage() {
  return (
    <Suspense fallback={null}>
      <StepsContent />
    </Suspense>
  );
}
