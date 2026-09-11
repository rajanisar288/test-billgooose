'use client';

import { useMemo } from 'react';

type PaymentHandoff = {
  formActionUrl?: string;
  apiKey?: string;
  orderId?: string;
  customerReference?: string;
  timestamp?: string;
  responseUrl?: string;
  signature?: string;
};

function readPaymentHandoff(): PaymentHandoff | null {
  try {
    const storedOrder = sessionStorage.getItem('journeyOrder');
    if (!storedOrder) return null;

    const order = JSON.parse(storedOrder) as { payment?: { handoff?: PaymentHandoff } };
    return order.payment?.handoff ?? null;
  } catch {
    return null;
  }
}

export default function BundlePaymentFrame() {
  const handoff = useMemo(readPaymentHandoff, []);
  const iframeUrl = useMemo(() => {
    if (!handoff?.formActionUrl || !handoff.apiKey) return null;

    const url = new URL(handoff.formActionUrl);
    Object.entries(handoff).forEach(([key, value]) => {
      if (key !== 'formActionUrl' && value) url.searchParams.set(key, value);
    });
    return url.toString();
  }, [handoff]);

  if (!iframeUrl) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-10">
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          The supplier payment form is unavailable. Please return to review and try again.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <iframe
        title="Supplier payment details"
        src={iframeUrl}
        className="min-h-[760px] w-full rounded-xl border border-[#EAECF0] bg-white"
        allow="payment"
      />
    </main>
  );
}
