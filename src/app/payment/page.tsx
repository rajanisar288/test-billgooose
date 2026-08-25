'use client';

import { useState } from 'react';

import Header from '@/components/marketing/Header';
import FinalThankYou from '@/components/payment/final-thank-you';
import SetupPaymentMethod from '@/components/payment/setup-payment-method';

export default function PaymentPage() {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  return (
    <>
      <Header />

      {paymentCompleted ? (
        <FinalThankYou />
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
