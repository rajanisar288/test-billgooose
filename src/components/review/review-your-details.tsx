'use client';

import { type ReactNode, useMemo, useState, useSyncExternalStore } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  CalendarDays,
  CreditCard,
  Home,
  Info,
  SlidersHorizontal,
  UserRound,
  Wifi,
} from 'lucide-react';

import type { StandardPlan } from '@/components/result/plan.types';
import data from '@/data/content.json';

import ReviewEditModal, { type EditableSection } from './review-edit-modal';

type JourneyService = 'energy' | 'broadband';

type PersonalDetails = {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
};

type HouseholdDetails = {
  propertyType?: string;
  occupants?: string;
  bedrooms?: string;
};

type ContractDetails = {
  contractDate?: string;
  acknowledged?: boolean;
};

type ReviewState = {
  service: JourneyService;

  personalDetails: PersonalDetails;

  household: HouseholdDetails;

  paymentMethod: string;

  contractDetails: ContractDetails;

  broadbandProvider: string;
  broadbandSpeed: string;
  broadbandContractLength: string;

  selectedPlan: StandardPlan | null;
};

const EMPTY_STATE: ReviewState = {
  service: 'energy',

  personalDetails: {},
  household: {},

  paymentMethod: '',
  contractDetails: {},

  broadbandProvider: '',
  broadbandSpeed: '',
  broadbandContractLength: '',

  selectedPlan: null,
};

/* =========================================================
   SESSION STORAGE HELPERS
========================================================= */

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/*
 * useSyncExternalStore requires a stable/cached snapshot.
 * Returning a primitive string gives us that.
 */
function getReviewSnapshot(): string {
  const { journey } = data;

  return JSON.stringify({
    compareFlowDetails: sessionStorage.getItem('compareFlowDetails') ?? '',

    personalDetails: sessionStorage.getItem('journeyPersonalDetails') ?? '',

    household: sessionStorage.getItem(journey.household.storageKey) ?? '',

    paymentMethod: getStoredPaymentMethod(),

    contractDetails: sessionStorage.getItem(journey.contractDetails.storageKey) ?? '',

    broadbandProvider: sessionStorage.getItem(journey.broadbandProvider.storageKey) ?? '',

    broadbandSpeed: sessionStorage.getItem(journey.broadbandSpeed.storageKey) ?? '',

    broadbandContractLength:
      sessionStorage.getItem(journey.broadbandContractLength.storageKey) ?? '',

    selectedPlan: sessionStorage.getItem('journeySelectedPlan') ?? '',
  });
}

function getReviewServerSnapshot(): string {
  return '';
}

function subscribeToReviewData(callback: () => void) {
  const handleStorage = () => {
    callback();
  };

  const handleReviewUpdated = () => {
    callback();
  };

  window.addEventListener('storage', handleStorage);

  window.addEventListener('journey-review-updated', handleReviewUpdated);

  return () => {
    window.removeEventListener('storage', handleStorage);

    window.removeEventListener('journey-review-updated', handleReviewUpdated);
  };
}

function getStoredPaymentMethod(): string {
  const { journey } = data;

  /*
   * Bundle Bills saves the selected payment method on the
   * Payment Method journey step.
   */
  try {
    const storedJourneyPayment = sessionStorage.getItem(journey.paymentMethod.storageKey);

    if (storedJourneyPayment) {
      return storedJourneyPayment;
    }
  } catch {
    // Fall through to compare-flow storage.
  }

  /*
   * Normal Energy saves the selected payment method directly
   * inside compareFlowDetails on the Compare page.
   */
  const compareFlow = readJson<{
    paymentMethod?: string;
  }>('compareFlowDetails', {});

  return compareFlow.paymentMethod ?? '';
}

function buildReviewState(snapshot: string): ReviewState {
  if (!snapshot) {
    return EMPTY_STATE;
  }

  const { journey } = data;

  const compareFlow = readJson<{
    service?: string;
    flow?: string;
    paymentMethod?: string;
  }>('compareFlowDetails', {});

  const service: JourneyService = compareFlow.service === 'broadband' ? 'broadband' : 'energy';

  return {
    service,

    personalDetails: readJson<PersonalDetails>('journeyPersonalDetails', {}),

    household: readJson<HouseholdDetails>(journey.household.storageKey, {}),

    paymentMethod: getStoredPaymentMethod(),

    contractDetails: readJson<ContractDetails>(journey.contractDetails.storageKey, {}),

    broadbandProvider:
      readJson<{
        provider?: string;
      }>(journey.broadbandProvider.storageKey, {}).provider ?? '',

    broadbandSpeed:
      readJson<{
        broadbandSpeed?: string;
      }>(journey.broadbandSpeed.storageKey, {}).broadbandSpeed ?? '',

    broadbandContractLength:
      sessionStorage.getItem(journey.broadbandContractLength.storageKey) ?? '',

    selectedPlan: readJson<StandardPlan | null>('journeySelectedPlan', null),
  };
}

export default function ReviewYourDetails() {
  const router = useRouter();

  const { journey } = data;

  const review = journey.reviewDetails;

  const reviewSnapshot = useSyncExternalStore(
    subscribeToReviewData,
    getReviewSnapshot,
    getReviewServerSnapshot,
  );

  const details = useMemo(() => buildReviewState(reviewSnapshot), [reviewSnapshot]);

  const [editingSection, setEditingSection] = useState<EditableSection | null>(null);

  /* =========================================================
     LABEL HELPERS
  ========================================================= */

  const propertyLabel = useMemo(() => {
    const option = journey.household.propertyType.options.find(
      (item) => item.value === details.household.propertyType,
    );

    return option?.label ?? details.household.propertyType ?? '—';
  }, [details.household.propertyType, journey.household.propertyType.options]);

  const occupantsLabel = useMemo(() => {
    return (
      journey.household.occupants.options.find((item) => item.value === details.household.occupants)
        ?.label ??
      details.household.occupants ??
      '—'
    );
  }, [details.household.occupants, journey.household.occupants.options]);

  const bedroomsLabel = useMemo(() => {
    return (
      journey.household.bedrooms.options.find((item) => item.value === details.household.bedrooms)
        ?.label ??
      details.household.bedrooms ??
      '—'
    );
  }, [details.household.bedrooms, journey.household.bedrooms.options]);

  const paymentMethodLabel = useMemo(() => {
    return (
      journey.paymentMethod.options.find((item) => item.value === details.paymentMethod)?.label ??
      details.paymentMethod ??
      '—'
    );
  }, [details.paymentMethod, journey.paymentMethod.options]);

  const providerLabel = useMemo(() => {
    return (
      journey.broadbandProvider.providers.find((item) => item.value === details.broadbandProvider)
        ?.label ??
      details.broadbandProvider ??
      '—'
    );
  }, [details.broadbandProvider, journey.broadbandProvider.providers]);

  const speedLabel = useMemo(() => {
    return (
      journey.broadbandSpeed.options.find((item) => item.value === details.broadbandSpeed)?.label ??
      details.broadbandSpeed ??
      '—'
    );
  }, [details.broadbandSpeed, journey.broadbandSpeed.options]);

  const contractLengthLabel = useMemo(() => {
    return (
      journey.broadbandContractLength.options.find(
        (item) => item.value === details.broadbandContractLength,
      )?.label ??
      details.broadbandContractLength ??
      '—'
    );
  }, [details.broadbandContractLength, journey.broadbandContractLength.options]);

  const handleEditSaved = () => {
    setEditingSection(null);
  };

  const handleConfirm = () => {
    router.push('/payment');
  };

  return (
    <>
      <section
        className="
          w-full
          bg-[#F9F9F9]

          px-4
          pb-10
          pt-6

          sm:px-6
          sm:pt-7

          md:px-8
          md:pb-12
          md:pt-8

          lg:px-10
          lg:pb-14
          lg:pt-9
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1320px]
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
              {review.heading}
            </h1>

            <p
              className="
                mt-1
                max-w-[760px]

                font-red-hat-display
                text-[13px]
                font-[467]
                leading-[19px]
                tracking-[0]
                text-[#667085]

                sm:text-[14px]
                sm:leading-[20px]

                md:text-[16px]
                md:leading-[23px]

                lg:text-[18px]
                lg:leading-[25px]
              "
            >
              {review.description}
            </p>
          </header>

          {/* =================================================
              GRID
          ================================================== */}
          <div
            className="
              mt-7

              grid
              grid-cols-1
              gap-5

              lg:grid-cols-[minmax(0,1fr)_360px]
              lg:items-start

              xl:grid-cols-[minmax(0,1fr)_390px]
              xl:gap-6
            "
          >
            {/* ===============================================
                LEFT
            ================================================ */}
            <div className="space-y-4">
              {/* Personal details */}
              <ReviewSection
                title={review.sections.personalDetails.title}
                icon={<UserRound />}
                onEdit={() => setEditingSection('personalDetails')}
              >
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-2

                    sm:grid-cols-2

                    lg:grid-cols-3
                  "
                >
                  <ReviewField
                    label="Title"
                    value={details.personalDetails.title}
                  />

                  <ReviewField
                    label="Firstname"
                    value={details.personalDetails.firstName}
                  />

                  <ReviewField
                    label="Lastname"
                    value={details.personalDetails.lastName}
                  />

                  <ReviewField
                    label="Email address"
                    value={details.personalDetails.email}
                  />

                  <ReviewField
                    label="Mobile number"
                    value={details.personalDetails.mobileNumber}
                  />

                  <ReviewField
                    label="Date of birth"
                    value={details.personalDetails.dateOfBirth}
                  />
                </div>
              </ReviewSection>

              {/* =================================================
                  ENERGY
              ================================================== */}
              {details.service === 'energy' && (
                <>
                  <ReviewSection
                    title={review.sections.household.title}
                    icon={<Home />}
                    onEdit={() => setEditingSection('household')}
                  >
                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-2

                        sm:grid-cols-3
                      "
                    >
                      <ReviewField
                        label="House type"
                        value={propertyLabel}
                      />

                      <ReviewField
                        label="House size"
                        value={occupantsLabel}
                      />

                      <ReviewField
                        label="No. of bedrooms"
                        value={bedroomsLabel}
                      />
                    </div>
                  </ReviewSection>

                  <ReviewSection
                    title={review.sections.paymentMethod.title}
                    icon={<CreditCard />}
                    onEdit={() => setEditingSection('paymentMethod')}
                  >
                    <ReviewField
                      label="Payment method"
                      value={paymentMethodLabel}
                    />
                  </ReviewSection>

                  {/* ===============================================
                      CONTRACT DATES
                  ================================================ */}
                  <ReviewSection
                    title={review.sections.contractDates.title}
                    icon={<CalendarDays />}
                    onEdit={() => setEditingSection('contractDates')}
                  >
                    <ReviewField
                      label="Contract start date"
                      value={details.contractDetails.contractDate}
                    />

                    <ContractInformation />
                  </ReviewSection>
                </>
              )}

              {/* =================================================
                  BROADBAND
              ================================================== */}
              {details.service === 'broadband' && (
                <>
                  <ReviewSection
                    title={review.sections.provider.title}
                    icon={<Wifi />}
                    onEdit={() => setEditingSection('provider')}
                  >
                    <ReviewField
                      label="Current broadband provider"
                      value={providerLabel}
                    />
                  </ReviewSection>

                  <ReviewSection
                    title={review.sections.broadbandSpeed.title}
                    icon={<SlidersHorizontal />}
                    onEdit={() => setEditingSection('broadbandSpeed')}
                  >
                    <ReviewField
                      label="Broadband speed"
                      value={speedLabel}
                    />
                  </ReviewSection>

                  {/* ===============================================
                      CONTRACT LENGTH
                  ================================================ */}
                  <ReviewSection
                    title={review.sections.contractLength.title}
                    icon={<CalendarDays />}
                    onEdit={() => setEditingSection('contractLength')}
                  >
                    <ReviewField
                      label="Preferred contract length"
                      value={contractLengthLabel}
                    />

                    <ContractInformation />
                  </ReviewSection>
                </>
              )}
            </div>

            {/* ===============================================
                RIGHT
            ================================================ */}
            <aside className="space-y-4">
              <SelectedPlanCard plan={details.selectedPlan} />

              <SummaryCard
                plan={details.selectedPlan}
                onConfirm={handleConfirm}
              />
            </aside>
          </div>
        </div>
      </section>

      <ReviewEditModal
        section={editingSection}
        service={details.service}
        currentData={details}
        onClose={() => setEditingSection(null)}
        onSaved={handleEditSaved}
      />
    </>
  );
}

/* =========================================================
   REVIEW SECTION
========================================================= */

type ReviewSectionProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  onEdit: () => void;
};

function ReviewSection({ title, icon, children, onEdit }: ReviewSectionProps) {
  return (
    <section
      className="
        overflow-hidden

        rounded-[12px]

        border
        border-[#EAECF0]

        bg-white

        shadow-[0px_1px_2px_rgba(16,24,40,0.03)]
      "
    >
      <div
        className="
          flex
          min-h-[52px]

          items-center
          justify-between
          gap-3

          border-b
          border-[#F2F4F7]

          px-4

          sm:min-h-[56px]

          lg:min-h-[60px]
          lg:px-5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center

            gap-2

            md:gap-2.5

            lg:gap-3
          "
        >
          <span
            className="
              flex
              h-[18px]
              w-[18px]
              shrink-0

              items-center
              justify-center

              text-[#344054]

              [&>svg]:h-[18px]
              [&>svg]:w-[18px]

              md:h-5
              md:w-5

              md:[&>svg]:h-5
              md:[&>svg]:w-5

              lg:h-6
              lg:w-6

              lg:[&>svg]:h-6
              lg:[&>svg]:w-6
            "
          >
            {icon}
          </span>

          <h2
            className="
              font-red-hat-display

              text-[15px]
              font-[645]
              leading-[20px]
              tracking-[0]

              text-[#101828]

              sm:text-[16px]

              md:text-[18px]
              md:leading-[22px]

              lg:text-[20px]
              lg:leading-6
            "
          >
            {title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="
            flex
            h-8
            w-8

            items-center
            justify-center

            rounded-full

            text-[#00897B]

            transition-colors

            hover:bg-[#E6F4F2]
          "
        >
          <Image
            src="/images/edit-icon.png"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className="
              h-4
              w-4
              object-contain

              md:h-[18px]
              md:w-[18px]

              lg:h-5
              lg:w-5
            "
          />
        </button>
      </div>

      <div className="p-4 lg:p-5">{children}</div>
    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

type ReviewFieldProps = {
  label: string;
  value?: string;
};

function ReviewField({ label, value }: ReviewFieldProps) {
  return (
    <div
      className="
        min-h-[54px]

        rounded-[7px]

        border
        border-[#F2F4F7]

        bg-[#FCFCFD]

        px-3
        py-2
      "
    >
      <p
        className="
          font-inter
          text-[13px]
          font-normal
          leading-[13px]
          text-[#667085]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-[2px]

          break-words

          font-inter
          text-[15px]
          font-[660]
          font-medium
          leading-[16px]
          text-[#101828]

          sm:text-[12px]
        "
      >
        {value || '—'}
      </p>
    </div>
  );
}

/* =========================================================
   CONTRACT INFORMATION
========================================================= */

function ContractInformation() {
  const { contractDetails } = data.journey;

  return (
    <div
      className="
        mt-4
        space-y-4
      "
    >
      {/* =====================================================
          DESCRIPTION 1
      ====================================================== */}
      <p
        className="
    font-inter
    text-[14px]
    font-normal
    leading-[20px]
    tracking-[0]

    text-[#535862]

    lg:max-w-[720px]
  "
      >
        {contractDetails.information.overlapText}
      </p>

      {/* =====================================================
          DESCRIPTION 2
      ====================================================== */}
      <p
        className="
          font-inter
          text-[14px]
          font-normal
          leading-[20px]
          tracking-[0]

          text-[#535862]
        "
      >
        {contractDetails.information.endDateText}
      </p>

      {/* =====================================================
          WARNING
      ====================================================== */}
      <div
        className="
          flex
          w-full
          items-start

          gap-2.5

          rounded-[10px]

          border
          border-[#FEC84B]

          bg-[#FFFCF5]

          p-3.5

          sm:gap-3
          sm:rounded-[12px]
          sm:p-4
        "
      >
        {/* Warning icon */}
        <Image
          src="/images/warning-icon.png"
          alt=""
          width={18}
          height={16}
          aria-hidden="true"
          className="
            mt-[2px]

            h-[15px]
            w-[17px]
            shrink-0

            object-contain

            sm:h-[17px]
            sm:w-[19px]
          "
        />

        <div className="min-w-0">
          {/* Warning heading */}
          <p
            className="
              font-inter
              text-[12px]
              font-bold
              leading-[18px]
              tracking-[0]

              text-[#B54708]

              sm:text-[14px]
              sm:leading-[20px]
            "
          >
            {contractDetails.warning.heading}
          </p>

          {/* Warning description */}
          <p
            className="
              mt-1

              font-inter
              text-[12px]
              font-normal
              leading-[18px]
              tracking-[0]

              text-[#B54708]

              sm:text-[14px]
              sm:leading-[20px]
            "
          >
            {contractDetails.warning.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SELECTED PLAN
========================================================= */

function SelectedPlanCard({ plan }: { plan: StandardPlan | null }) {
  const { plans } = data.resultPage;
  const { reviewDetails } = data.journey;

  return (
    <section
      className="
        overflow-hidden

        rounded-[12px]

        border
        border-[#EAECF0]

        bg-white
      "
    >
      <div
        className="
          flex
          h-[48px]

          items-center
          gap-2

          border-y
          border-[#EAECF0]

          px-4
        "
      >
        <SlidersHorizontal
          className="
            h-[16px]
            w-[16px]

            text-[#344054]

            lg:h-[18px]
            lg:w-[18px]
          "
        />

        <h2
          className="
            font-red-hat-display
            text-[14px]
            font-extrabold
            text-[#101828]

            lg:text-[16px]
          "
        >
          {reviewDetails.selectedPlan.heading}
        </h2>
      </div>

      <div className="p-3">
        {!plan ? (
          <p className="font-inter text-[12px] text-[#667085]">No plan selected.</p>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="
    flex
    h-[72px]
    w-[72px]
    shrink-0

    items-center
    justify-center

    overflow-hidden

    rounded-[11.25px]

    border-[1.13px]
    border-[#EAECF0]

    bg-[#EAF2F8]
  "
            >
              <Image
                src={plan.logo}
                alt={plan.logoAlt}
                width={72}
                height={72}
                className="
      h-full
      w-full

      object-contain
    "
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate

                  font-red-hat-display
                  text-[13px]
                  font-extrabold
                  text-[#101828]
                "
              >
                {plan.provider}
              </p>

              <p
                className="
                  mt-[2px]
                  truncate

                  font-inter
                  font-[660]
                  text-[14px]
                  leading-[14px]
                  text-[#667085]
                "
              >
                {plan.description}
              </p>

              <span
                className="
                  mt-1

                  inline-flex
                  items-center
                  gap-1

                  rounded-full

                  bg-[#ECFDF3]

                  px-[6px]

                  font-red-hat-display
                  text-[9px]
                  font-bold
                  text-[#027A48]
                "
              >
                <Image
                  src={plans.savingIcon}
                  alt=""
                  width={10}
                  height={10}
                  aria-hidden="true"
                  className="
                    h-[10px]
                    w-[10px]
                    object-contain
                  "
                />

                {plan.saving}
              </span>
            </div>

            <div className="shrink-0 text-right">
              <p
                className="
                  font-red-hat-display
                  text-[15px]
                  font-extrabold
                  text-[#101828]
                "
              >
                {plan.price}
              </p>

              <span
                className="
                  mt-1

                  inline-flex

                  rounded-full

                  border
                  border-[#73BEB7]

                  px-3
                  py-1

                  font-inter
                  text-[10px]
                  font-semibold
                  text-[#00897B]
                "
              >
                ✓ {reviewDetails.selectedPlan.selectedLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function SummaryCard({ plan, onConfirm }: { plan: StandardPlan | null; onConfirm: () => void }) {
  const { summary } = data.journey.reviewDetails;

  return (
    <section
      className="
        overflow-hidden

        rounded-[12px]

        border
        border-[#EAECF0]

        bg-white
      "
    >
      <div
        className="
          flex
          h-[48px]

          items-center
          gap-2

          border-b
          border-[#EAECF0]

          px-4
        "
      >
        <CreditCard
          className="
            h-[16px]
            w-[16px]

            text-[#344054]

            lg:h-[18px]
            lg:w-[18px]
          "
        />

        <h2
          className="
            font-red-hat-display
            text-[14px]
            font-extrabold
            text-[#101828]

            lg:text-[16px]
          "
        >
          {summary.heading}
        </h2>
      </div>

      <div className="p-4">
        <SummaryRow
          label={plan?.provider ?? '-'}
          value={plan?.price ?? '—'}
        />

        {/* <SummaryRow
          label="Broadband"
          value="£25.90"
        />

        <SummaryRow
          label="Mobile"
          value="£15.90"
        />

        <SummaryRow
          label="Platform fee"
          value="£1.90"
        /> */}

        <div
          className="
            mt-3

            flex
            items-end
            justify-between
            gap-3
          "
        >
          <div>
            <p
              className="
                font-inter
                text-[13px]
                font-[660]
                text-[#667085]
              "
            >
              {summary.totalLabel}
            </p>

            <p
              className="
                mt-1

                font-red-hat-display
                text-[24px]
                font-extrabold
                text-[#0C3354]
              "
            >
              {plan?.price ?? '—'}
            </p>
          </div>

          <div
            className="
              rounded-[6px]

              border
              border-[#73E2A3]

              bg-[#ECFDF3]

              px-3
              py-2

              text-center
            "
          >
            <p
              className="
                font-red-hat-display
                text-[17px]
                font-extrabold
                text-[#027A48]
              "
            >
              £580
            </p>

            <p
              className="
                font-inter
                text-[8px]
                text-[#027A48]
              "
            >
              {summary.annualSavingLabel}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="
            mt-3

            flex
            h-[46px]
            w-full

            items-center
            justify-center

            rounded-full

            bg-[#00897B]

            px-4

            font-red-hat-display
            text-[13px]
            font-bold
            text-white

            transition-colors

            hover:bg-[#00796D]

            md:text-[14px]
          "
        >
          {summary.confirmButton} →
        </button>

        {/* =================================================
            CONFIRMATION INFORMATION
        ================================================== */}
        <div
          className="
            mt-5

            flex
            items-start
            gap-3

            rounded-[12px]

            border
            border-[#D0D5DD]

            bg-[#FCFCFD]

            px-3
            py-3

            sm:px-4
            sm:py-4

            md:gap-[14px]

            lg:gap-4
            lg:rounded-[16px]
            lg:px-5
            lg:py-5
          "
        >
          <span
            className="
              flex
              h-5
              w-5
              shrink-0

              items-center
              justify-center

              text-[#475467]

              md:h-[22px]
              md:w-[22px]

              lg:h-6
              lg:w-6
            "
          >
            <Info
              aria-hidden="true"
              className="
                h-5
                w-5

                md:h-[22px]
                md:w-[22px]

                lg:h-6
                lg:w-6
              "
              strokeWidth={1.7}
            />
          </span>

          <p
            className="
              font-red-hat-display

              text-[11px]
              font-[467]
              leading-[17px]
              tracking-[0]

              text-[#475467]

              sm:text-[12px]
              sm:leading-[18px]

              md:text-[13px]
              md:leading-[20px]

              lg:text-[14px]
              lg:leading-[21px]
            "
          >
            {summary.confirmationNotice}
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
        flex
        min-h-[35px]

        items-center
        justify-between
        gap-3

        border-b
        border-[#F2F4F7]

        font-inter
        text-[10px]

        md:text-[13px]
        font-[660]
      "
    >
      <span className="text-[#667085] font-[660]">{label}</span>

      <span
        className="
          shrink-0
          font-medium
          text-[#101828]
        "
      >
        {value}
      </span>
    </div>
  );
}

export type { ReviewState };
