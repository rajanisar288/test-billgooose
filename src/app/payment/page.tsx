'use client';

import { useState } from 'react';

import Header from '@/components/marketing/Header';
import BundlePaymentFrame from '@/components/payment/bundle-payment-frame';
import FinalThankYou from '@/components/payment/final-thank-you';
import SetupPaymentMethod from '@/components/payment/setup-payment-method';
import { useJourneyStore } from '@/store/journeyStore';

export default function PaymentPage() {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { journey } = useJourneyStore();
  const isBundle = journey?.serviceType == 'billPackage';

  return (
    <>
      <Header />

      {paymentCompleted ? (
        <FinalThankYou />
      ) : isBundle ? (
        <BundlePaymentFrame />
      ) : (
        <SetupPaymentMethod
          onSuccess={() => {
            setPaymentCompleted(true);
          }}
        />
      )}
    </>
  );
}
