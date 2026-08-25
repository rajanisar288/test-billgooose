'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import type { StandardPlan } from '@/components/result/plan.types';

/* =========================================================
   TYPES
========================================================= */

type PaymentDetails = {
  accountHolderName?: string;
  bankName?: string;
  sortCode?: string;
  accountNumber?: string;
};

type ConfirmationDetails = {
  applicationReference: string;
  mandateReference: string;
  firstPaymentDate: string;
  collectionDay: string;
};

type NextStep = {
  id: string;
  icon: string;
  iconAlt: string;
  heading: string;
  description: string;
};

/* =========================================================
   STATIC DATA
========================================================= */

const CONFIRMATION_DETAILS: ConfirmationDetails = {
  applicationReference: 'BG-6OH7RC',
  mandateReference: 'DD-BG-6LNO',
  firstPaymentDate: '1 September 2026',
  collectionDay: '1st of each month',
};

const NEXT_STEPS: NextStep[] = [
  {
    id: 'confirmation-email',
    icon: '/images/thanks-mail.png',
    iconAlt: 'Confirmation email',
    heading: 'Confirmation email sent',
    description:
      'A confirmation with your application and DD mandate details has been sent to your email address.',
  },
  {
    id: 'provider-contact',
    icon: '/images/thanks-call.png',
    iconAlt: 'Provider contact',
    heading: 'Octopus Energy will contact you',
    description:
      'Your new provider will reach out within 2 working days to confirm your switch date.',
  },
  {
    id: 'switch-begins',
    icon: '/images/thanks-refresh.png',
    iconAlt: 'Switch begins',
    heading: 'Switch begins',
    description:
      'Your switch will be processed within 5–10 working days. Your current supply continues uninterrupted.',
  },
  {
    id: 'first-direct-debit',
    icon: '/images/thanks-card.png',
    iconAlt: 'First Direct Debit',
    heading: 'First Direct Debit: 1 September 2026',
    description: '£71 will be collected from 3 on this date.',
  },
  {
    id: 'start-saving',
    icon: '/images/thanks-heart.png',
    iconAlt: 'Start saving',
    heading: 'Start saving!',
    description: 'You could save £580 per year compared to the average tariff.',
  },
];

/* =========================================================
   SESSION STORAGE HELPERS
========================================================= */

function getStoredSelectedPlan(): StandardPlan | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = sessionStorage.getItem('journeySelectedPlan');

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as StandardPlan;
  } catch {
    return null;
  }
}

function getStoredPaymentDetails(): PaymentDetails {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = sessionStorage.getItem('journeyPaymentDetails');

    if (!stored) {
      return {};
    }

    return JSON.parse(stored) as PaymentDetails;
  } catch {
    return {};
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function FinalThankYou() {
  const router = useRouter();

  /*
   * Lazy state initialization avoids:
   *
   * "Compilation Skipped: Existing memoization could not
   * be preserved"
   *
   * We only need to read these values once when this screen
   * first appears.
   */
  const [selectedPlan] = useState<StandardPlan | null>(getStoredSelectedPlan);

  const [paymentDetails] = useState<PaymentDetails>(getStoredPaymentDetails);

  const monthlyAmount = selectedPlan?.price ?? '£71.00';

  const accountHolder = paymentDetails.accountHolderName || 'Gustavo Vetrovs';

  const bankName = paymentDetails.bankName || 'Barclays Bank PLC';

  const maskedSortCode = maskSortCode(paymentDetails.sortCode || '12-34-56');

  const maskedAccountNumber = maskAccountNumber(paymentDetails.accountNumber || '12345678');

  return (
    <main
      className="
        min-h-screen
        w-full

        bg-white
      "
    >
      {/* =====================================================
          BACK ROW

          Your existing Header/Navbar is rendered above this
          component from /payment/page.tsx.

          Gradient starts AFTER this row.
      ====================================================== */}
      <div
        className="
    w-full

    border-y
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
          GRADIENT PAGE AREA
      ====================================================== */}
      <div
        className="
          min-h-[calc(100vh-54px)]
          w-full

          bg-[linear-gradient(180deg,rgba(0,137,123,0.1)_0%,rgba(0,137,123,0)_100%)]

          sm:min-h-[calc(100vh-58px)]

          lg:min-h-[calc(100vh-62px)]
        "
      >
        <section
          className="
            mx-auto
            flex
            w-full
            max-w-[980px]
            flex-col
            items-center

            px-4
            pb-12
            pt-8

            sm:px-6
            sm:pb-14
            sm:pt-10

            md:px-8
            md:pt-12

            lg:px-0
            lg:pb-20
            lg:pt-8
          "
        >
          {/* =====================================================
              SUCCESS ICON
          ====================================================== */}
          <div
            className="
              flex
              h-[88px]
              w-[88px]
              items-center
              justify-center

              rounded-full

              border
              border-[#EAECF0]

              bg-[#00897B]

              sm:h-[102px]
              sm:w-[102px]

              md:h-[112px]
              md:w-[112px]

              lg:h-[130px]
              lg:w-[130px]
            "
          >
            <Image
              src="/images/thanks-tick.png"
              alt=""
              width={74}
              height={74}
              aria-hidden="true"
              className="
                h-[50px]
                w-[50px]

                object-contain

                sm:h-[58px]
                sm:w-[58px]

                md:h-[64px]
                md:w-[64px]

                lg:h-[74px]
                lg:w-[74px]
              "
            />
          </div>

          {/* =====================================================
              HEADING
          ====================================================== */}
          <h1
            className="
              mt-4

              text-center

              font-red-hat-display
              text-[26px]
              font-extrabold
              leading-[34px]
              tracking-[0]

              text-[#0C3354]

              sm:text-[28px]
              sm:leading-[38px]

              md:text-[30px]
              md:leading-[44px]

              lg:mt-5
              lg:text-[34px]
              lg:leading-[56px]
            "
          >
            You&apos;re all set! 🎉
          </h1>

          <p
            className="
              mt-1

              max-w-[520px]

              text-center

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
            Your energy switch to Octopus Energy is confirmed and your
            <br className="hidden sm:block" />
            Direct Debit is set up.
          </p>

          {/* =====================================================
              REFERENCE CARDS
          ====================================================== */}
          <div
            className="
              mt-6

              grid
              w-full
              max-w-[510px]
              grid-cols-1
              gap-3

              min-[420px]:grid-cols-2

              lg:mt-7
              lg:max-w-[495px]
            "
          >
            <ReferenceCard
              label="Application ref"
              value={CONFIRMATION_DETAILS.applicationReference}
            />

            <ReferenceCard
              label="DD mandate ref"
              value={CONFIRMATION_DETAILS.mandateReference}
            />
          </div>

          {/* =====================================================
              DIRECT DEBIT CONFIRMED
          ====================================================== */}
          <section
            className="
              mt-8
              w-full
              max-w-[820px]

              overflow-hidden

              rounded-[14px]

              border
              border-[#EAECF0]

              bg-white

              shadow-[0px_1px_2px_rgba(16,24,40,0.03)]

              sm:mt-9
              sm:rounded-[16px]

              lg:mt-10
            "
          >
            {/* Header */}
            <div
              className="
                flex
                min-h-[54px]
                items-center
                gap-2.5

                border-b
                border-[#EAECF0]

                px-4

                sm:min-h-[58px]
                sm:px-5

                lg:min-h-[64px]
                lg:px-6
              "
            >
              <Image
                src="/images/thanks-card-direct.png"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                className="
                  h-[18px]
                  w-[18px]
                  shrink-0

                  object-contain

                  sm:h-5
                  sm:w-5

                  lg:h-6
                  lg:w-6
                "
              />

              <h2
                className="
                  font-red-hat-display
                  text-[16px]
                  font-[645]
                  leading-[21px]
                  tracking-[0]

                  text-[#101828]

                  sm:text-[18px]
                  sm:leading-[22px]

                  lg:text-[20px]
                  lg:leading-6
                "
              >
                Direct Debit Confirmed
              </h2>
            </div>

            {/* Body */}
            <div
              className="
                p-4

                sm:p-5

                lg:p-6
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-3

                  sm:grid-cols-2

                  lg:gap-3.5
                "
              >
                <ConfirmedField
                  label="Account holder"
                  value={accountHolder}
                />

                <ConfirmedField
                  label="Bank"
                  value={bankName}
                />

                <ConfirmedField
                  label="Sort code"
                  value={maskedSortCode}
                />

                <ConfirmedField
                  label="Account number"
                  value={maskedAccountNumber}
                />

                <ConfirmedField
                  label="Monthly amount"
                  value={monthlyAmount}
                />

                <ConfirmedField
                  label="First payment"
                  value={CONFIRMATION_DETAILS.firstPaymentDate}
                />

                <ConfirmedField
                  label="Collection day"
                  value={CONFIRMATION_DETAILS.collectionDay}
                />

                <ConfirmedField
                  label="Mandate ref"
                  value={CONFIRMATION_DETAILS.mandateReference}
                />
              </div>

              {/* Guarantee */}
              <div
                className="
                  mt-4

                  flex
                  min-h-[48px]
                  w-full
                  items-start

                  gap-2.5

                  rounded-[10px]

                  border
                  border-[#2E90FA]

                  bg-[#EFF4FF]

                  px-3
                  py-3

                  sm:items-center
                  sm:rounded-[11px]
                  sm:px-4

                  lg:h-[52px]
                  lg:min-h-[52px]
                  lg:gap-3
                  lg:rounded-[12px]
                  lg:p-4
                "
              >
                <Image
                  src="/images/thanks-span-icon.png"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="
                    mt-[1px]
                    h-4
                    w-4
                    shrink-0

                    object-contain

                    sm:mt-0
                    sm:h-[18px]
                    sm:w-[18px]

                    lg:h-5
                    lg:w-5
                  "
                />

                <p
                  className="
                    font-inter
                    text-[11px]
                    font-semibold
                    leading-[17px]
                    tracking-[0]

                    text-[#026AA2]

                    sm:text-[12px]
                    sm:leading-[18px]

                    lg:text-[14px]
                    lg:leading-5
                  "
                >
                  Protected by the Direct Debit Guarantee. Full refund if any error occurs
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              WHAT HAPPENS NEXT
          ====================================================== */}
          <section
            className="
              mt-7
              w-full
              max-w-[820px]

              overflow-hidden

              rounded-[14px]

              border
              border-[#EAECF0]

              bg-white

              shadow-[0px_1px_2px_rgba(16,24,40,0.03)]

              sm:mt-8
              sm:rounded-[16px]

              lg:mt-9
            "
          >
            {/* Header */}
            <div
              className="
                flex
                min-h-[54px]
                items-center

                border-b
                border-[#EAECF0]

                px-4

                sm:min-h-[58px]
                sm:px-5

                lg:min-h-[64px]
                lg:px-6
              "
            >
              <h2
                className="
                  font-red-hat-display

                  text-[16px]
                  font-[645]
                  leading-[21px]
                  tracking-[0]

                  text-[#101828]

                  sm:text-[18px]
                  sm:leading-[22px]

                  lg:text-[20px]
                  lg:leading-6
                "
              >
                What happens next
              </h2>
            </div>

            {/* Timeline */}
            <div
              className="
                px-4
                py-5

                sm:px-5
                sm:py-6

                lg:px-[34px]
                lg:py-[30px]
              "
            >
              <div>
                {NEXT_STEPS.map((step, index) => {
                  const isLast = index === NEXT_STEPS.length - 1;

                  return (
                    <div
                      key={step.id}
                      className="
                        relative
                        flex
                        gap-3

                        sm:gap-4

                        lg:gap-[18px]
                      "
                    >
                      {/* =========================================
                          ICON / CONNECTOR
                      ========================================== */}
                      <div
                        className="
                          relative
                          flex
                          w-[40px]
                          shrink-0
                          justify-center

                          sm:w-[44px]

                          lg:w-[50px]
                        "
                      >
                        {!isLast && (
                          <span
                            aria-hidden="true"
                            className="
                              absolute
                              bottom-0
                              left-1/2
                              top-[40px]

                              w-px
                              -translate-x-1/2

                              bg-[#8CCAC3]

                              sm:top-[44px]

                              lg:top-[50px]
                            "
                          />
                        )}

                        <div
                          className="
                            relative
                            z-10

                            flex
                            h-[40px]
                            w-[40px]
                            shrink-0

                            items-center
                            justify-center

                            rounded-full

                            border
                            border-[#8CCAC3]

                            bg-white

                            sm:h-[44px]
                            sm:w-[44px]

                            lg:h-[50px]
                            lg:w-[50px]
                            lg:border-[0.5px]
                          "
                        >
                          <Image
                            src={step.icon}
                            alt={step.iconAlt}
                            width={24}
                            height={24}
                            className="
                              h-[18px]
                              w-[18px]

                              object-contain

                              sm:h-5
                              sm:w-5

                              lg:h-6
                              lg:w-6
                            "
                          />
                        </div>
                      </div>

                      {/* =========================================
                          TEXT
                      ========================================== */}
                      <div
                        className={`
                          min-w-0
                          flex-1

                          pt-0.5

                          ${isLast ? 'pb-0' : 'pb-5 sm:pb-6 lg:pb-[26px]'}
                        `}
                      >
                        <h3
                          className="
                            font-red-hat-display

                            text-[12px]
                            font-[550]
                            leading-[150%]
                            tracking-[0]

                            text-[#040E13]

                            sm:text-[13px]

                            lg:text-[14px]
                          "
                        >
                          {step.heading}
                        </h3>

                        <p
                          className="
                            mt-[2px]

                            font-red-hat-display

                            text-[11px]
                            font-[467]
                            leading-[150%]
                            tracking-[0]

                            text-[#70707B]

                            sm:text-[12px]

                            lg:text-[13px]
                          "
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =====================================================
              ACTIONS
          ====================================================== */}
          <div
            className="
              mt-7
              w-full
              max-w-[625px]

              sm:mt-8

              lg:mt-10
            "
          >
            {/* Primary */}
            <button
              type="button"
              className="
                flex
                h-[46px]
                w-full

                items-center
                justify-center
                gap-2

                rounded-full

                bg-[#00897B]

                px-5

                font-red-hat-display
                text-[13px]
                font-[645]
                leading-5
                tracking-[0]

                text-white

                transition-colors

                hover:bg-[#00796D]

                sm:h-[50px]
                sm:text-[14px]

                lg:h-[54px]
                lg:text-[16px]
              "
            >
              <span>View My Account &amp; Saved Deals</span>

              <span
                aria-hidden="true"
                className="
                  text-[18px]
                  leading-none
                "
              >
                →
              </span>
            </button>

            {/* Secondary actions */}
            <div
              className="
                mt-4

                grid
                grid-cols-1
                gap-3

                sm:grid-cols-2
                sm:gap-4
              "
            >
              <button
                type="button"
                className="
                  flex
                  h-[44px]
                  w-full

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-[#D0D5DD]

                  bg-white

                  px-4

                  font-red-hat-display
                  text-[12px]
                  font-[550]
                  leading-5

                  text-[#0C3354]

                  transition-colors

                  hover:bg-[#F9FAFB]

                  sm:h-[48px]
                  sm:text-[13px]

                  lg:h-[50px]
                  lg:text-[14px]
                "
              >
                Compare Another Category
              </button>

              <button
                type="button"
                className="
                  flex
                  h-[44px]
                  w-full

                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  border
                  border-[#D0D5DD]

                  bg-white

                  px-4

                  font-red-hat-display
                  text-[12px]
                  font-[550]
                  leading-5

                  text-[#0C3354]

                  transition-colors

                  hover:bg-[#F9FAFB]

                  sm:h-[48px]
                  sm:text-[13px]

                  lg:h-[50px]
                  lg:text-[14px]
                "
              >
                <Image
                  src="/images/thanks-download-icon.png"
                  alt=""
                  width={18}
                  height={18}
                  aria-hidden="true"
                  className="
                    h-4
                    w-4
                    shrink-0

                    object-contain

                    lg:h-[18px]
                    lg:w-[18px]
                  "
                />

                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* =====================================================
              SUPPORT TEXT
          ====================================================== */}
          <p
            className="
              mt-7

              max-w-[720px]

              text-center

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

              lg:mt-9
              lg:text-[18px]
              lg:leading-[25px]
            "
          >
            Questions? Call 0800 123 4567 · Mon–Fri 8am–8pm, Sat 9am–5pm
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            or email help@billgoose.co.uk
          </p>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   REFERENCE CARD
========================================================= */

type ReferenceCardProps = {
  label: string;
  value: string;
};

function ReferenceCard({ label, value }: ReferenceCardProps) {
  return (
    <div
      className="
        flex
        min-h-[56px]
        flex-col
        items-center
        justify-center

        gap-1

        rounded-[8px]

        border
        border-[#EAECF0]

        bg-white

        px-3
        py-2.5

        text-center

        lg:h-[61px]
        lg:min-h-[61px]
        lg:px-3
        lg:py-[10px]
      "
    >
      <p
        className="
          font-red-hat-display
          text-[11px]
          font-[467]
          leading-4
          tracking-[0]

          text-[#70707B]

          lg:text-[12px]
        "
      >
        {label}
      </p>

      <p
        className="
          font-red-hat-display
          text-[13px]
          font-[550]
          leading-[150%]
          tracking-[0]

          text-[#040E13]

          lg:text-[14px]
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   CONFIRMED FIELD
========================================================= */

type ConfirmedFieldProps = {
  label: string;
  value: string;
};

function ConfirmedField({ label, value }: ConfirmedFieldProps) {
  return (
    <div
      className="
        min-h-[60px]

        rounded-[8px]

        border
        border-[#EAECF0]

        bg-[#FCFCFD]

        px-3
        py-2.5

        sm:min-h-[64px]

        lg:min-h-[66px]
        lg:px-4
        lg:py-3
      "
    >
      <p
        className="
          font-red-hat-display
          text-[11px]
          font-[467]
          leading-[150%]
          tracking-[0]

          text-[#70707B]

          sm:text-[12px]

          lg:text-[13px]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-[2px]

          break-words

          font-red-hat-display
          text-[13px]
          font-[550]
          leading-[150%]
          tracking-[0]

          text-[#040E13]

          lg:text-[14px]
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   MASKING HELPERS
========================================================= */

function maskSortCode(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length < 2) {
    return '••-••-45';
  }

  const visible = digits.slice(-2);

  return `••-••-${visible}`;
}

function maskAccountNumber(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length < 3) {
    return '••••5678';
  }

  const visible = digits.slice(-4);

  return `••••${visible}`;
}
