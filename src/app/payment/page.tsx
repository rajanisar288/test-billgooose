'use client';

import { useState } from 'react';

import Header from '@/components/marketing/Header';
import BundlePaymentFrame from '@/components/payment/bundle-payment-frame';
import FinalThankYou from '@/components/payment/final-thank-you';
import SetupPaymentMethod from '@/components/payment/setup-payment-method';
import { trackSwitchComplete } from '@/lib/gtm';
import { useJourneyStore } from '@/store/journeyStore';

export default function PaymentPage() {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { journey } = useJourneyStore();
  const isBundle = journey?.serviceType == 'billPackage';

  const handlePaymentSuccess = () => {
    trackSwitchComplete({
      orderId: journey?.orderId || journey?.id || journey?.journeyId,
      serviceType: journey?.serviceType,
      journeyId: journey?.id || journey?.journeyId,
      isBundle,
    });
    setPaymentCompleted(true);
  };

  return (
    <>
      <Header />

      {paymentCompleted ? (
        <FinalThankYou />
      ) : isBundle ? (
        <BundlePaymentFrame onSuccess={handlePaymentSuccess} />
      ) : (
        <SetupPaymentMethod onSuccess={handlePaymentSuccess} />
      )}
    </>
  );
}
