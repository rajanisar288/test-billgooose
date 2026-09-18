'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { type FormEvent, useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

import BackendErrorAlert from '@/components/common/BackendErrorAlert';
import type { StandardPlan } from '@/components/result/plan.types';
import { humanizeLabel } from '@/components/result/result-labels';
import { readStoredSelectedPlans, sumPlanPrices } from '@/components/result/selected-plans';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { useJourneyStore } from '@/store/journeyStore';
import { getCurrentRelativeUrl } from '@/utils/helper';

/* =========================================================
   TYPES
========================================================= */

type SetupPaymentMethodProps = {
  onSuccess: () => void;
};

type PaymentForm = {
  accountHolderName: string;
  bankName: string;
  sortCode: string;
  accountNumber: string;
  acceptedGuarantee: boolean;
};

/* =========================================================
   CONSTANTS
========================================================= */

const SERVICE_USER_NUMBER = 'BillGoose Ltd';

const SERVICE_USER_ADDRESS = '25 Victoria Street, London, SW1H 0EX';

const REFERENCE_NUMBER = 'DD-BG-XMKNAY';

function formatSortCode(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 6)
    .replace(/(\d{2})(?=\d)/g, '$1-');
}

const SECURITY_ITEMS = [
  {
    id: 'ssl',
    icon: '/images/security-lock.png',
    label: '256-bit SSL encryption',
  },
  {
    id: 'bacs',
    icon: '/images/security-shield.png',
    label: 'BACS approved bureau',
  },
  {
    id: 'fca',
    icon: '/images/security-tick.png',
    label: 'FCA authorised (987654)',
  },
  {
    id: 'banks',
    icon: '/images/security-building.png',
    label: 'UK banks & building societies',
  },
] as const;

const DIRECT_DEBIT_GUARANTEE_ITEMS = [
  'This Guarantee is offered by all banks and building societies that accept instructions to pay Direct Debits.',
  'If there are any changes to the amount, date or frequency of your Direct Debit, BillGoose Ltd will notify you 10 working days in advance of your account being debited or as otherwise agreed.',
  'If you request BillGoose Ltd to collect a payment, confirmation of the amount and date will be given to you at the time of the request.',
  'If an error is made in the payment of your Direct Debit by BillGoose Ltd or your bank or building society, you are entitled to a full and immediate refund of the amount paid from your bank or building society.',
  'If you receive a refund you are not entitled to, you must pay it back when BillGoose Ltd asks you to.',
  'You can cancel a Direct Debit at any time by simply contacting your bank or building society. Written confirmation may be required. Please also notify us.',
] as const;

/* =========================================================
   COMPONENT
========================================================= */

export default function SetupPaymentMethod({ onSuccess }: SetupPaymentMethodProps) {
  const router = useRouter();
  const { journey, setJourney } = useJourneyStore();

  const [submitError, setSubmitError] = useState<string>('');

  const [form, setForm] = useState<PaymentForm>({
    accountHolderName: '',
    bankName: '',
    sortCode: '',
    accountNumber: '',
    acceptedGuarantee: false,
  });

  const [guaranteeOpen, setGuaranteeOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof PaymentForm, string>>>({});

  const selectedPlans = useMemo<StandardPlan[]>(() => readStoredSelectedPlans(), []);
  const totalMonthlyPrice = sumPlanPrices(selectedPlans, 'price');

  function updateField<K extends keyof PaymentForm>(field: K, value: PaymentForm[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    if (submitError) setSubmitError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const accountHolderName = form.accountHolderName.trim();
    const bankName = form.bankName.trim();
    const sortCode = form.sortCode.replace(/\D/g, '');
    const accountNumber = form.accountNumber.replace(/\D/g, '');

    const nextErrors: Partial<Record<keyof PaymentForm, string>> = {};

    if (accountHolderName.length < 2)
      nextErrors.accountHolderName = 'Enter the account holder name.';
    if (bankName.length < 2) nextErrors.bankName = 'Enter your bank or building society.';
    if (sortCode.length !== 6) nextErrors.sortCode = 'Sort code must contain exactly 6 digits.';
    if (accountNumber.length !== 8)
      nextErrors.accountNumber = 'Account number must contain exactly 8 digits.';
    if (!form.acceptedGuarantee)
      nextErrors.acceptedGuarantee = 'Accept the Direct Debit Guarantee.';

    setFieldErrors(nextErrors);
    setSubmitError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const journeyId = journey?.id || journey?.journeyId || journey?.uuid;
    const orderId = sessionStorage.getItem('journeyOrderId');

    if (!journeyId || !orderId) {
      setSubmitError('Your journey order is missing. Please return to review and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const journeyResponse = await journeyApi.createJourney({
        // ...journey,
        journeyId,
        uuid: journeyId,
        lastUrl: getCurrentRelativeUrl(),
      });

      if (!journeyResponse?.data) {
        throw new Error('We could not update your journey. Please try again.');
      }

      setJourney(journeyResponse.data);

      await journeyApi.submitJourneyOrderBankDetails(journeyId, orderId, {
        accountHolderName,
        bankNameOrBuildingSociety: bankName,
        accountNumber,
        sortCode,
        directDebitConsentAccepted: form.acceptedGuarantee,
      });

      sessionStorage.setItem(
        'journeyPaymentDetails',
        JSON.stringify({ ...form, accountHolderName, bankName, sortCode, accountNumber }),
      );
      onSuccess();
    } catch (error: any) {
      setSubmitError(error?.message || 'Failed to submit payment details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="
        min-h-screen
        w-full

        bg-[#F9F9F9]
      "
    >
      {/* =====================================================
          BACK ROW
      ====================================================== */}
      <div
        className="
          w-full

          border-b
          border-[#EAECF0]

          bg-white
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[54px]
            w-full
            max-w-[1440px]

            items-center

            px-4

            sm:h-[58px]
            sm:px-6

            md:px-8

            lg:h-[62px]
            lg:px-[54px]
          "
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="
              inline-flex
              items-center
              gap-2

              font-inter
              text-[13px]
              font-medium
              leading-5

              text-[#344054]

              transition-colors

              hover:text-[#0C3354]

              sm:text-[14px]
            "
          >
            <ArrowLeft
              aria-hidden="true"
              className="
                h-[17px]
                w-[17px]

                sm:h-[18px]
                sm:w-[18px]
              "
              strokeWidth={1.8}
            />

            <span>Back</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}
      <section
        className="
          w-full

          px-4
          pb-10
          pt-6

          sm:px-6
          sm:pb-12
          sm:pt-7

          md:px-8
          md:pt-8

          lg:px-[54px]
          lg:pb-16
          lg:pt-9
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1380px]
          "
        >
          {/* =================================================
              HEADING
          ================================================== */}
          <header>
            <h1
              className="
                font-red-hat-display

                text-[26px]
                font-[645]
                leading-[34px]
                tracking-[0]

                text-[#0C3354]

                sm:text-[28px]
                sm:leading-[38px]

                md:text-[30px]
                md:leading-[44px]

                lg:text-[34px]
                lg:leading-[56px]
              "
            >
              Setup up payment method
            </h1>

            <p
              className="
                mt-1

                font-red-hat-display

                text-[13px]
                font-[467]
                leading-[19px]
                tracking-[0]

                text-[#667085]

                sm:text-[14px]
                sm:leading-5

                md:text-[16px]
                md:leading-[23px]

                lg:text-[18px]
                lg:leading-[25px]
              "
            >
              Set up your payment method
            </p>
          </header>

          {/* =================================================
              MAIN GRID
          ================================================== */}
          <div
            className="
              mt-6

              grid
              grid-cols-1
              gap-5

              md:mt-7

              lg:mt-8
              lg:grid-cols-[minmax(0,872px)_minmax(300px,424px)]
              lg:items-start
              lg:gap-6
            "
          >
            {/* =================================================
                LEFT — DIRECT DEBIT FORM
            ================================================== */}
            <form
              id="direct-debit-form"
              data-direct-debit-form
              onSubmit={handleSubmit}
              className="
                overflow-hidden

                rounded-[14px]

                border
                border-[#EAECF0]

                bg-white
              "
            >
              {/* ===============================================
                  BLUE INSTRUCTION HEADER
              ================================================ */}
              <div
                className="
                  flex
                  min-h-[126px]
                  w-full
                  flex-col
                  justify-center

                  gap-2.5

                  border-b
                  border-[#EAECF0]

                  bg-[#0D3B66]

                  px-5
                  py-5

                  sm:min-h-[138px]
                  sm:px-6
                  sm:py-6

                  lg:h-[156px]
                  lg:min-h-[156px]
                  lg:gap-[14px]
                  lg:px-[30px]
                  lg:py-[30px]
                "
              >
                <Image
                  src="/images/direct-debit-white.png"
                  alt="Direct Debit"
                  width={92}
                  height={30}
                  priority
                  className="
                    h-auto
                    w-[76px]

                    object-contain

                    sm:w-[84px]

                    lg:h-[30px]
                    lg:w-[92px]
                  "
                />

                <div>
                  <h2
                    className="
                      font-red-hat-display

                      text-[16px]
                      font-[645]
                      leading-[21px]
                      tracking-[0]

                      text-white

                      sm:text-[18px]
                      sm:leading-[22px]

                      lg:text-[20px]
                      lg:leading-6
                    "
                  >
                    Instruction to your Bank
                  </h2>

                  <p
                    className="
                      mt-0.5

                      font-red-hat-display

                      text-[14px]
                      font-[467]
                      leading-5
                      tracking-[0]

                      text-[#D0D5DD]

                      sm:text-[16px]
                      sm:leading-[22px]

                      lg:text-[18px]
                      lg:leading-[25px]
                    "
                  >
                    Please fill in the details
                  </p>
                </div>
              </div>

              {submitError && (
                <BackendErrorAlert
                  error={submitError}
                  className="mt-4 mx-4"
                />
              )}

              {/* ===============================================
                  FORM BODY
              ================================================ */}
              <div
                className="
                  px-4
                  pb-5
                  pt-5

                  sm:px-5
                  sm:pb-6
                  sm:pt-6

                  md:px-6

                  lg:px-[30px]
                  lg:pb-[30px]
                  lg:pt-[30px]
                "
              >
                {/* =============================================
                    ORIGINATOR / REFERENCE
                ============================================== */}
                <div
                  className="
                    flex
                    min-h-[76px]
                    w-full

                    flex-col
                    justify-between
                    gap-4

                    rounded-[12px]

                    bg-[#F2F4F7]

                    p-4

                    sm:flex-row
                    sm:items-center

                    lg:h-[90px]
                    lg:min-h-[90px]
                    lg:rounded-[14px]
                    lg:p-4
                  "
                >
                  <div className="min-w-0">
                    <p
                      className="
                        font-red-hat-display

                        text-[11px]
                        font-[667]
                        leading-4
                        tracking-[0]

                        text-[#667085]

                        lg:text-[12px]
                        lg:leading-4
                      "
                    >
                      Service user (originator)
                    </p>

                    <p
                      className="
                        mt-[2px]

                        font-red-hat-display

                        text-[14px]
                        font-[645]
                        leading-5
                        tracking-[0]

                        text-[#101828]

                        lg:text-[16px]
                        lg:leading-6
                      "
                    >
                      {SERVICE_USER_NUMBER}
                    </p>

                    <p
                      className="
                        mt-[1px]

                        font-red-hat-display

                        text-[11px]
                        font-[667]
                        leading-4
                        tracking-[0]

                        text-[#667085]

                        lg:text-[12px]
                        lg:leading-4
                      "
                    >
                      {SERVICE_USER_ADDRESS}
                    </p>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <p
                      className="
                        font-red-hat-display

                        text-[11px]
                        font-[667]
                        leading-4
                        tracking-[0]

                        text-[#667085]

                        lg:text-[12px]
                      "
                    >
                      Reference number
                    </p>

                    <p
                      className="
                        mt-[2px]

                        font-red-hat-display

                        text-[14px]
                        font-[645]
                        leading-5
                        tracking-[0]

                        text-[#101828]

                        sm:text-right

                        lg:text-[16px]
                        lg:leading-6
                      "
                    >
                      {REFERENCE_NUMBER}
                    </p>
                  </div>
                </div>

                {/* =============================================
                    FIELDS
                ============================================== */}
                <div
                  className="
                    mt-6
                    space-y-5

                    lg:mt-[30px]
                    lg:space-y-6
                  "
                >
                  <PaymentField
                    id="account-holder-name"
                    label="Name(s) of account holder(s)"
                    placeholder="Full name of account holder"
                    helperText="As they appear on your bank statements"
                    value={form.accountHolderName}
                    onChange={(value) => updateField('accountHolderName', value)}
                    error={fieldErrors.accountHolderName}
                  />

                  <PaymentField
                    id="bank-name"
                    label="Bank or building society"
                    placeholder="e.g. Barclays Bank PLC"
                    helperText="Name of your bank or building society"
                    value={form.bankName}
                    onChange={(value) => updateField('bankName', value)}
                    error={fieldErrors.bankName}
                  />

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-5

                      sm:grid-cols-2
                      sm:gap-4

                      lg:gap-5
                    "
                  >
                    <PaymentField
                      id="sort-code"
                      label="Sort code"
                      placeholder="12-34-56"
                      helperText="6-digit sort code"
                      value={form.sortCode}
                      onChange={(value) => updateField('sortCode', formatSortCode(value))}
                      inputMode="numeric"
                      maxLength={8}
                      error={fieldErrors.sortCode}
                    />

                    <PaymentField
                      id="account-number"
                      label="Account number"
                      placeholder="12345678"
                      helperText="8-digit account number"
                      value={form.accountNumber}
                      onChange={(value) =>
                        updateField('accountNumber', value.replace(/\D/g, '').slice(0, 8))
                      }
                      inputMode="numeric"
                      maxLength={8}
                      error={fieldErrors.accountNumber}
                    />
                  </div>

                  {/* ===========================================
                      CONFIRMATION
                  ============================================ */}
                  <label
                    className="
                      flex
                      cursor-pointer
                      items-start

                      gap-2.5

                      pt-1

                      lg:gap-3
                    "
                  >
                    <span
                      className="
                        relative
                        mt-[2px]

                        h-[18px]
                        w-[18px]
                        shrink-0
                      "
                    >
                      <input
                        type="checkbox"
                        checked={form.acceptedGuarantee}
                        onChange={(event) => updateField('acceptedGuarantee', event.target.checked)}
                        className="
                          absolute
                          inset-0
                          z-10

                          cursor-pointer
                          opacity-0
                        "
                      />

                      <span
                        aria-hidden="true"
                        className={`
                          flex
                          h-[18px]
                          w-[18px]

                          items-center
                          justify-center

                          rounded-[4px]

                          border

                          ${
                            form.acceptedGuarantee
                              ? 'border-[#00897B] bg-[#00897B]'
                              : 'border-[#D0D5DD] bg-white'
                          }
                        `}
                      >
                        <Check
                          aria-hidden="true"
                          className={`
                            h-3
                            w-3

                            text-white

                            ${form.acceptedGuarantee ? 'opacity-100' : 'opacity-0'}
                          `}
                          strokeWidth={3}
                        />
                      </span>
                    </span>

                    <span
                      className="
                        font-inter

                        text-[11px]
                        font-normal
                        leading-[17px]

                        text-[#667085]

                        sm:text-[12px]
                        sm:leading-[18px]

                        lg:text-[13px]
                        lg:leading-[20px]
                      "
                    >
                      I confirm I am the account holder and the only person required to authorise
                      Direct Debits from this account. I have read and agree to the{' '}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          setGuaranteeOpen(true);
                        }}
                        className="
                          font-medium
                          text-[#00897B]
                          underline
                          underline-offset-2
                        "
                      >
                        Direct Debit Guarantee.
                      </button>
                    </span>
                  </label>

                  {fieldErrors.acceptedGuarantee && (
                    <p className="mt-1.5 font-inter text-[11px] font-normal leading-4 text-[#D92D20] sm:text-[12px]">
                      {fieldErrors.acceptedGuarantee}
                    </p>
                  )}

                  {/* =================================================
                      DIRECT DEBIT GUARANTEE ACCORDION
                  ================================================== */}
                  <section
                    className="
                      overflow-hidden

                      rounded-[12px]

                      border
                      border-[#EAECF0]

                      bg-white

                      lg:rounded-[14px]
                    "
                  >
                    <button
                      type="button"
                      aria-expanded={guaranteeOpen}
                      aria-controls="direct-debit-guarantee-content"
                      onClick={() => setGuaranteeOpen((current) => !current)}
                      className="
                        flex
                        min-h-[48px]
                        w-full

                        items-center
                        justify-between
                        gap-3

                        bg-[#FCFCFD]

                        px-3.5
                        py-3

                        text-left

                        transition-colors

                        hover:bg-[#F9FAFB]

                        sm:min-h-[52px]
                        sm:px-4

                        lg:min-h-[58px]
                        lg:px-5
                      "
                    >
                      <span
                        className="
                          flex
                          min-w-0
                          items-center

                          gap-2

                          sm:gap-2.5
                        "
                      >
                        <ShieldCheck
                          aria-hidden="true"
                          className="
                            h-3
                            w-3
                            shrink-0

                            text-[#00897B]

                            sm:h-[13px]
                            sm:w-[13px]

                            lg:h-[14px]
                            lg:w-[14px]
                          "
                          strokeWidth={1.8}
                        />

                        <span
                          className="
                            font-red-hat-display

                            text-[12px]
                            font-[667]
                            leading-[18px]
                            tracking-[0]

                            text-[#364153]

                            sm:text-[13px]
                            sm:leading-[19px]

                            lg:text-[14px]
                            lg:leading-[20px]
                          "
                        >
                          The Direct Debit Guarantee
                        </span>
                      </span>

                      {guaranteeOpen ? (
                        <ChevronUp
                          aria-hidden="true"
                          className="
                            h-3.5
                            w-3.5
                            shrink-0

                            text-[#475467]

                            lg:h-4
                            lg:w-4
                          "
                          strokeWidth={1.8}
                        />
                      ) : (
                        <ChevronDown
                          aria-hidden="true"
                          className="
                            h-3.5
                            w-3.5
                            shrink-0

                            text-[#475467]

                            lg:h-4
                            lg:w-4
                          "
                          strokeWidth={1.8}
                        />
                      )}
                    </button>

                    {guaranteeOpen && (
                      <div
                        id="direct-debit-guarantee-content"
                        className="
                          border-t
                          border-[#EAECF0]

                          px-3.5
                          pb-3.5
                          pt-3

                          sm:px-4
                          sm:pb-4
                          sm:pt-3.5

                          lg:px-5
                          lg:pb-5
                          lg:pt-4
                        "
                      >
                        <ul
                          className="
                            space-y-2

                            sm:space-y-2.5

                            lg:space-y-[6px]
                          "
                        >
                          {DIRECT_DEBIT_GUARANTEE_ITEMS.map((item) => (
                            <li
                              key={item}
                              className="
                                  relative

                                  pl-3

                                  font-inter

                                  text-[10.5px]
                                  font-[660]
                                  leading-[17px]
                                  tracking-[0]

                                  text-[#475467]

                                  before:absolute
                                  before:left-0
                                  before:top-0
                                  before:content-['•']

                                  sm:text-[11px]
                                  sm:leading-[18px]

                                  lg:text-[13px]
                                  lg:leading-[19.5px]
                                "
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </form>

            {/* =================================================
                RIGHT COLUMN
            ================================================== */}
            <aside
              className="
                space-y-4

                lg:space-y-5
              "
            >
              {/* ===============================================
                  SUMMARY
              ================================================ */}
              <section
                className="
                  overflow-hidden

                  rounded-[14px]

                  border
                  border-[#EAECF0]

                  bg-white
                "
              >
                <div
                  className="
                    flex
                    h-[52px]

                    items-center
                    gap-2

                    border-b
                    border-[#EAECF0]

                    px-4

                    lg:h-[60px]
                    lg:px-5
                  "
                >
                  <Image
                    src="/images/summary-icon.png"
                    alt=""
                    width={18}
                    height={18}
                    aria-hidden="true"
                    className="
                      h-4
                      w-4
                      object-contain

                      lg:h-[18px]
                      lg:w-[18px]
                    "
                  />

                  <h2
                    className="
                      font-red-hat-display

                      text-[15px]
                      font-[645]
                      leading-5

                      text-[#101828]

                      lg:text-[18px]
                      lg:leading-6
                    "
                  >
                    Summary
                  </h2>
                </div>

                <div
                  className="
                    px-4
                    pb-4

                    lg:px-5
                    lg:pb-5
                  "
                >
                  {selectedPlans.map((plan) => (
                    <SummaryRow
                      key={plan.id}
                      label={plan.groupDisplayName ?? plan.provider}
                      value={plan.annualPrice ?? plan.price}
                      logo={plan.logo}
                      logoAlt={plan.logoAlt || plan.provider}
                      subtitle={
                        plan.planName && plan.planName !== plan.provider ? plan.planName : undefined
                      }
                    />
                  ))}

                  {/* <SummaryRow
                    label="Broadband"
                    value="£25.90"
                  /> */}

                  {/* <SummaryRow
                    label="Mobile"
                    value="£15.90"
                  /> */}

                  {/* <SummaryRow
                    label="Platform fee"
                    value="£1.90"
                  /> */}

                  {/* TOTAL */}
                  <div
                    className="
                      mt-3

                      flex
                      items-center
                      justify-between
                      gap-3

                      rounded-[9px]

                      bg-[#F6FEF9]

                      p-3

                      lg:rounded-[10px]
                      lg:p-4
                    "
                  >
                    <div>
                      <p
                        className="
                          font-inter
                          text-[11px]
                          leading-[14px]

                          text-[#667085]

                          font-[667]
                          lg:text-[13px]
                          lg:leading-4
                        "
                      >
                        Your total {humanizeLabel(journey?.customer?.paymentPreference)}
                      </p>

                      <div
                        className="
                          mt-[2px]

                          flex
                          items-baseline
                          gap-1
                        "
                      >
                        <span
                          className="
                            font-red-hat-display

                            text-[20px]
                            font-[645]
                            leading-6

                            text-[#101828]

                            lg:text-[24px]
                            lg:leading-[30px]
                          "
                        >
                          {totalMonthlyPrice}
                        </span>

                        <span
                          className="
                            font-inter

                            text-[10px]
                            font-normal

                            text-[#667085]

                            lg:text-[12px]
                          "
                        >
                          /mo
                        </span>
                      </div>
                    </div>

                    {/* <div
                      className="
                        flex
                        min-h-[50px]
                        min-w-[76px]

                        flex-col
                        items-center
                        justify-center

                        rounded-[7px]

                        border
                        border-[#73E2A3]

                        bg-[#ECFDF3]

                        px-2
                        py-1.5

                        lg:min-h-[62px]
                        lg:min-w-[90px]
                      "
                    >
                      <span
                        className="
                          font-red-hat-display

                          text-[16px]
                          font-[645]
                          leading-5

                          text-[#101828]

                          lg:text-[20px]
                          lg:leading-6
                        "
                      >
                        £580
                      </span>

                      <span
                        className="
                          font-inter

                          text-[11px]
                          font-[660]
                          leading-[11px]

                          text-[#027A48]

                          lg:text-[11px]
                          lg:leading-3
                        "
                      >
                        annual saving
                      </span>
                    </div> */}
                  </div>

                  {/* CONFIRM */}
                  <button
                    type="submit"
                    form="direct-debit-form"
                    disabled={isSubmitting}
                    className="
                      mt-4
                      inline-flex
                      h-[46px]
                      w-full

                      items-center
                      justify-center
                      gap-2

                      rounded-full

                      bg-[#00897B]

                      px-4

                      font-red-hat-display

                      text-[13px]
                      font-[645]
                      leading-5

                      text-white

                      transition-colors

                      hover:bg-[#00796D]

                      disabled:cursor-not-allowed
                      disabled:opacity-60

                      sm:text-[14px]

                      lg:h-[50px]
                      lg:text-[14px]
                    "
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Confirm Direct Debit'}</span>

                    <ArrowRight
                      aria-hidden="true"
                      className="
                        h-4
                        w-4
                      "
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </section>

              {/* ===============================================
                  SECURITY
              ================================================ */}
              <section
                className="
                  rounded-[14px]

                  border
                  border-[#EAECF0]

                  bg-white

                  p-4

                  lg:p-5
                "
              >
                <p
                  className="
                    font-red-hat-display

                    text-[10px]
                    font-[645]
                    uppercase
                    leading-4
                    tracking-[0.08em]

                    text-[#98A2B3]

                    lg:text-[11px]
                  "
                >
                  Security
                </p>

                <div
                  className="
                    mt-3
                    space-y-2

                    lg:mt-4
                    lg:space-y-2.5
                  "
                >
                  {SECURITY_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className="
                          flex
                          items-center
                          gap-2
                        "
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={14}
                        height={14}
                        aria-hidden="true"
                        className="
                            h-3
                            w-3
                            shrink-0

                            object-contain

                            lg:h-[15px]
                            lg:w-[15px]
                          "
                      />

                      <span
                        className="
                            font-inter

                            text-[12px]
                            font-[660]
                            leading-4

                            text-[#667085]

                            lg:text-[12px]
                          "
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ===============================================
                  DIRECT DEBIT LOGO
              ================================================ */}
              <div
                className="
                  flex
                  flex-col
                  items-center

                  py-2

                  text-center

                  sm:py-3

                  lg:py-4
                "
              >
                <Image
                  src="/images/direct-debit-black.png"
                  alt="Direct Debit"
                  width={104}
                  height={33}
                  className="
                    h-auto
                    w-[86px]

                    object-contain

                    sm:w-[94px]

                    lg:h-[33px]
                    lg:w-[104px]
                  "
                />

                <p
                  className="
                    mt-2

                    font-inter

                    text-[10px]
                    font-medium
                    leading-[14px]
                    tracking-[0]

                    text-black

                    sm:text-[11px]

                    lg:text-[12px]
                    lg:leading-4
                  "
                >
                  Protected by the DD Guarantee
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   PAYMENT FIELD
========================================================= */

type PaymentFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  helperText: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: 'text' | 'numeric';
  maxLength?: number;
  error?: string;
};

function PaymentField({
  id,
  label,
  placeholder,
  helperText,
  value,
  onChange,
  inputMode = 'text',
  maxLength,
  error,
}: PaymentFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="
          mb-1.5
          block

          font-inter

          text-[12px]
          font-medium
          leading-[18px]
          tracking-[0]

          text-[#344054]

          sm:text-[13px]

          lg:mb-2
          lg:text-[14px]
          lg:leading-5
        "
      >
        {label}
      </label>

      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-[46px]
          w-full

          rounded-full

          border
          border-[#D0D5DD]

          bg-white

          px-4

          font-inter

          text-[13px]
          font-normal
          leading-5

          text-[#101828]

          shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

          outline-none

          transition

          placeholder:text-[#667085]

          focus:border-[#00897B]
          focus:ring-4
          focus:ring-[#E6F4F2]

          sm:h-[48px]
          sm:px-[18px]
          sm:text-[14px]

          lg:h-[52px]
          lg:text-[14px]
          lg:leading-5
        "
      />

      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 font-inter text-[11px] leading-[17px] text-[#D92D20]"
        >
          {error}
        </p>
      ) : null}

      <p
        className="
          mt-1.5

          font-inter

          text-[11px]
          font-normal
          leading-[17px]
          tracking-[0]

          text-[#667085]

          sm:text-[12px]
          sm:leading-[18px]

          lg:text-[14px]
          lg:leading-5
        "
      >
        {helperText}
      </p>
    </div>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

type SummaryRowProps = {
  label: string;
  value: string;
  logo?: string;
  logoAlt?: string;
  subtitle?: string;
};

function SummaryRow({ label, value, logo, logoAlt, subtitle }: SummaryRowProps) {
  return (
    <div
      className="
        flex
        min-h-[42px]

        items-center
        justify-between
        gap-3

        border-b
        border-[#F2F4F7]
        py-2

        font-inter

        lg:min-h-[48px]
      "
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {logo && (
          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-[8px] border border-[#EAECF0] bg-white p-0.5">
            <Image
              src={logo}
              alt={logoAlt || label}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[12px] font-[660] leading-4 text-[#344054] truncate lg:text-[13px]">
            {label}
          </p>
          {subtitle && (
            <p className="text-[11px] font-normal leading-3 text-[#667085] truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <span
        className="
          shrink-0

          text-[13px]
          font-[660]
          leading-4

          text-[#101828]

          lg:text-[13px]
        "
      >
        {value}
      </span>
    </div>
  );
}
