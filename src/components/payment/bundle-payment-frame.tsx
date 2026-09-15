'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { journeyApi } from '@/lib/api/endpoints/journey.api';

type PaymentHandoff = {
  formActionUrl?: string;
  formActionURL?: string;
  formMethod?: string;
  apiKey?: string;
  orderId?: string;
  tenantId?: string | number;
  customerReference?: string;
  timestamp?: string;
  responseUrl?: string;
  signature?: string;
};

type StoredOrder = {
  orderId?: string;
  journeyId?: string;
  payment?: { handoff?: PaymentHandoff };
  Data?: { payment_method_details?: PaymentHandoff };
};

function readStoredOrder(): StoredOrder | null {
  try {
    const storedOrder = sessionStorage.getItem('journeyOrder');
    if (!storedOrder) return null;

    return JSON.parse(storedOrder) as StoredOrder;
  } catch {
    return null;
  }
}

export default function BundlePaymentFrame({ onSuccess }: { onSuccess: () => void }) {
  const order = useMemo(() => readStoredOrder(), []);
  const handoff = order?.payment?.handoff ?? order?.Data?.payment_method_details;
  const [pollingError, setPollingError] = useState('');
  const [hasOpenedPaymentForm, setHasOpenedPaymentForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formAction = handoff?.formActionURL ?? handoff?.formActionUrl;
  const paymentOrderId = handoff?.orderId ?? order?.orderId;
  const tenantId = handoff?.tenantId ?? handoff?.customerReference;

  useEffect(() => {
    const journeyId = order?.journeyId;
    const orderId = order?.orderId ?? handoff?.orderId;
    if (!hasOpenedPaymentForm || !journeyId || !orderId) return;

    let isActive = true;
    let requestInProgress = false;

    const checkPaymentStatus = async () => {
      if (requestInProgress) return;
      requestInProgress = true;

      try {
        const response = await journeyApi.getJourneyOrderPaymentStatus(journeyId, orderId);
        if (!isActive) return;

        setPollingError('');
        const statusPayload = response.data?.Data ?? response.data?.data;
        const paymentStatus = String(
          typeof statusPayload === 'string'
            ? statusPayload
            : (statusPayload?.paymentStatus ?? response.data?.paymentStatus ?? ''),
        ).toUpperCase();
        if (
          paymentStatus === 'PAYMENT_SUCCESS' ||
          paymentStatus === 'SUCCESSFUL' ||
          paymentStatus === 'SUCCEEDED'
        ) {
          onSuccess();
        }
      } catch (error) {
        if (!isActive) return;
        setPollingError(
          error &&
            typeof error === 'object' &&
            'message' in error &&
            typeof error.message === 'string'
            ? error.message
            : 'We could not verify the payment status.',
        );
      } finally {
        requestInProgress = false;
      }
    };

    void checkPaymentStatus();
    const intervalId = window.setInterval(() => void checkPaymentStatus(), 3000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [handoff?.orderId, hasOpenedPaymentForm, onSuccess, order?.journeyId, order?.orderId]);

  if (
    !formAction ||
    !handoff?.apiKey ||
    !paymentOrderId ||
    tenantId === undefined ||
    !handoff.timestamp ||
    !handoff.responseUrl ||
    !handoff.signature
  ) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-10">
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          The supplier payment form is unavailable. Please return to review and try again.
        </p>
      </main>
    );
  }

  const openDirectDebitForm = () => {
    setHasOpenedPaymentForm(true);
    window.requestAnimationFrame(() => formRef.current?.submit());
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      {pollingError && (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {pollingError}
        </p>
      )}
      {!hasOpenedPaymentForm && (
        <div className="mb-4 flex flex-col gap-4 rounded-xl border border-[#EAECF0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-red-hat-display text-base font-bold text-[#101828]">
              Review Payment Plan
            </h2>
            <p className="mt-1 text-sm text-[#667085]">
              Please review your payment details and continue to set up your Direct Debit.
            </p>
          </div>
          <button
            type="button"
            onClick={openDirectDebitForm}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#00897B] px-7 font-red-hat-display text-sm font-bold text-white hover:bg-[#00796D]"
          >
            Setup Direct Debit
          </button>
        </div>
      )}

      <form
        ref={formRef}
        action={formAction}
        method={(handoff.formMethod ?? 'GET').toLowerCase() === 'post' ? 'POST' : 'GET'}
        target="hiddenFrame"
        className="hidden"
      >
        <input
          type="hidden"
          name="timestamp"
          value={handoff.timestamp}
        />
        <input
          type="hidden"
          name="apiKey"
          value={handoff.apiKey}
        />
        <input
          type="hidden"
          name="orderId"
          value={paymentOrderId}
        />
        <input
          type="hidden"
          name="tenantId"
          value={String(tenantId)}
        />
        <input
          type="hidden"
          name="responseUrl"
          value={handoff.responseUrl}
        />
        <input
          type="hidden"
          name="signature"
          value={handoff.signature}
        />
      </form>

      <iframe
        title="Supplier payment details"
        name="hiddenFrame"
        className="w-full border-0 bg-white transition-[height] duration-200"
        style={{ height: hasOpenedPaymentForm ? '70dvh' : '0' }}
        allow="payment"
      />
    </main>
  );
}
