'use client';

import { useSearchParams } from 'next/navigation';

import ContractDateForm from '@/components/journey/forms/contract-date-form';
import HouseholdForm from '@/components/journey/forms/household-form';
import PaymentMethodForm from '@/components/journey/forms/payment-method-form';
import PersonalDetailsForm from '@/components/journey/forms/personal-details-form';

export default function JourneyStepsPage() {
  const searchParams = useSearchParams();

  const requestedStep = Number(searchParams.get('step') ?? '1');

  const currentStep = Math.min(Math.max(requestedStep, 1), 4);

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
}
