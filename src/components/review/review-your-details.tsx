'use client';

import { type ReactNode, useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  CalendarDays,
  CreditCard,
  Eye,
  EyeOff,
  Home,
  Info,
  Lock,
  SlidersHorizontal,
  UserRound,
  Wifi,
} from 'lucide-react';

import FinalThankYou from '@/components/payment/final-thank-you';
import type { StandardPlan } from '@/components/result/plan.types';
import { humanizeLabel } from '@/components/result/result-labels';
import { readStoredSelectedPlans, sumPlanPrices } from '@/components/result/selected-plans';
import data from '@/data/content.json';
import { useToast } from '@/hooks/useToast';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { useServiceFields } from '@/lib/service-fields';
import { useJourneyStore } from '@/store/journeyStore';
import { getCurrentRelativeUrl } from '@/utils/helper';

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

export type ReviewState = {
  service: JourneyService;

  personalDetails: PersonalDetails;

  household: HouseholdDetails;

  paymentMethod: string;

  contractDetails: ContractDetails;

  broadbandProvider: string;
  broadbandSpeed: string;
  broadbandContractLength: string;

  selectedPlan: StandardPlan | null;
  selectedPlans: StandardPlan[];
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
  selectedPlans: [],
};

/* =========================================================
   SESSION STORAGE HELPERS
========================================================= */

// function readJson<T>(key: string, fallback: T): T {
//   try {
//     const raw = sessionStorage.getItem(key);

//     if (!raw) {
//       return fallback;
//     }

//     return JSON.parse(raw) as T;
//   } catch {
//     return fallback;
//   }
// }

// /*
//  * useSyncExternalStore requires a stable/cached snapshot.
//  * Returning a primitive string gives us that.
//  */
// function getReviewSnapshot(): string {
//   const { journey } = data;

//   return JSON.stringify({
//     compareFlowDetails: sessionStorage.getItem('compareFlowDetails') ?? '',

//     personalDetails: sessionStorage.getItem('journeyPersonalDetails') ?? '',

//     household: sessionStorage.getItem(journey.household.storageKey) ?? '',

//     paymentMethod: sessionStorage.getItem(journey.paymentMethod.storageKey) ?? '',

//     contractDetails: sessionStorage.getItem(journey.contractDetails.storageKey) ?? '',

//     broadbandProvider: sessionStorage.getItem(journey.broadbandProvider.storageKey) ?? '',

//     broadbandSpeed: sessionStorage.getItem(journey.broadbandSpeed.storageKey) ?? '',

//     broadbandContractLength:
//       sessionStorage.getItem(journey.broadbandContractLength.storageKey) ?? '',

//     selectedPlan: sessionStorage.getItem('journeySelectedPlan') ?? '',
//   });
// }

// function getReviewServerSnapshot(): string {
//   return '';
// }

// function subscribeToReviewData(callback: () => void) {
//   const handleStorage = () => {
//     callback();
//   };

//   const handleReviewUpdated = () => {
//     callback();
//   };

//   window.addEventListener('storage', handleStorage);

//   window.addEventListener('journey-review-updated', handleReviewUpdated);

//   return () => {
//     window.removeEventListener('storage', handleStorage);

//     window.removeEventListener('journey-review-updated', handleReviewUpdated);
//   };
// }

// function buildReviewState(snapshot: string): ReviewState {
//   if (!snapshot) {
//     return EMPTY_STATE;
//   }

//   const { journey } = data;

//   const compareFlow = readJson<{
//     service?: string;
//   }>('compareFlowDetails', {});

//   const service: JourneyService = compareFlow.service === 'broadband' ? 'broadband' : 'energy';

//   return {
//     service,

//     personalDetails: readJson<PersonalDetails>('journeyPersonalDetails', {}),

//     household: readJson<HouseholdDetails>(journey.household.storageKey, {}),

//     paymentMethod: sessionStorage.getItem(journey.paymentMethod.storageKey) ?? '',

//     contractDetails: readJson<ContractDetails>(journey.contractDetails.storageKey, {}),

//     broadbandProvider:
//       readJson<{
//         provider?: string;
//       }>(journey.broadbandProvider.storageKey, {}).provider ?? '',

//     broadbandSpeed:
//       readJson<{
//         broadbandSpeed?: string;
//       }>(journey.broadbandSpeed.storageKey, {}).broadbandSpeed ?? '',

//     broadbandContractLength:
//       sessionStorage.getItem(journey.broadbandContractLength.storageKey) ?? '',

//     selectedPlan: readJson<StandardPlan | null>('journeySelectedPlan', null),
//   };
// }

// Password Regex: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,8}$/;

export default function ReviewYourDetails() {
  const router = useRouter();
  const { journey, setJourney } = useJourneyStore();
  const { showError } = useToast();
  const { journey: journeyData } = data;
  const searchParams = useSearchParams();

  const requestedService = searchParams.get('service');
  const requestedFlow = searchParams.get('flow');
  const isBundle =
    requestedFlow === 'bundle' ||
    requestedService === 'bundle-bills' ||
    journey?.serviceType === 'billPackage';
  const serviceFields = useServiceFields(isBundle ? 'billPackage' : journey?.serviceType);

  const [isConfirming, setIsConfirming] = useState(false);
  const [updatedCustomerFields, setUpdatedCustomerFields] = useState<Record<string, unknown>>({});
  const [storedSelectedPlans] = useState<StandardPlan[]>(readStoredSelectedPlans);
  const [isPrepaymentComplete, setIsPrepaymentComplete] = useState(false);

  // Password state fields
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const review = journeyData.reviewDetails;

  const details = useMemo<ReviewState>(() => {
    if (!journey) {
      return EMPTY_STATE;
    }

    return {
      service: journey.serviceType,

      personalDetails: {
        title: journey.customer?.title ?? '',
        firstName: journey.customer?.firstName ?? '',
        lastName: journey.customer?.surname ?? '',
        email: journey.customer?.emailAddress ?? '',
        mobileNumber: journey.customer?.phoneNumber ?? '',
        dateOfBirth: journey.customer?.dateOfBirth ?? '',
      },

      household: {
        propertyType: journey.customer?.propertyType ?? '',
        occupants:
          journey.customer?.occupants !== null && journey.customer?.occupants !== undefined
            ? String(journey.customer.occupants)
            : '',
        bedrooms:
          journey.customer?.bedrooms !== null && journey.customer?.bedrooms !== undefined
            ? String(journey.customer.bedrooms)
            : '',
      },

      paymentMethod: journey.customer?.paymentPreference ?? '',

      contractDetails: {
        contractDate: journey.customer?.preferredStartDate ?? '',
        acknowledged: false,
      },

      broadbandProvider: '',
      broadbandSpeed: '',
      broadbandContractLength: '',

      selectedPlan: journey?.cart?.[0] ?? storedSelectedPlans[0] ?? null,
      selectedPlans: journey?.cart?.length ? journey.cart : storedSelectedPlans,
    };
  }, [journey, storedSelectedPlans]);

  const showPasswordSection = Boolean(journey?.cartRequirements?.requiresSupplierAccountPassword);

  const handleConfirm = async () => {
    if (!journey || isConfirming) {
      return;
    }

    setPasswordError('');

    // Password validation when service is energy and flow is bundle
    if (showPasswordSection) {
      if (!password) {
        setPasswordError('Password is required.');
        return;
      }
      if (!PASSWORD_REGEX.test(password)) {
        setPasswordError(
          'Password must be 7-8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        );
        return;
      }
    }

    try {
      setIsConfirming(true);

      const journeyId = journey.id || journey.journeyId || localStorage.getItem('journey-storage');

      if (!journeyId) {
        throw new Error('Journey ID is required');
      }

      const response = await journeyApi.createJourney({
        uuid: journeyId,
        ...(Object.keys(updatedCustomerFields).length > 0 && { customer: updatedCustomerFields }),
        lastUrl: getCurrentRelativeUrl(),
      });

      if (!response?.data) {
        throw new Error('No data received from API');
      }

      const selectedPlan = readStoredSelectedPlan();
      const quoteId = selectedPlan?.quoteId;
      const productReferences =
        selectedPlan?.productReferences ??
        (selectedPlan?.productReference ? [selectedPlan.productReference] : []);

      if (!quoteId || productReferences.length === 0) {
        throw new Error('Selected quote details are missing. Please select a plan again.');
      }

      // Include password in order creation payload
      const orderResponse = await journeyApi.createJourneyOrder(journeyId, {
        quoteId,
        productReferences,
        ...(showPasswordSection && { supplierAccountPassword: password }),
      });
      const orderId = orderResponse?.data?.orderId;

      if (!orderId) {
        throw new Error('No order ID received from API');
      }

      setJourney(response.data);
      sessionStorage.setItem('journeyOrderId', orderId);
      sessionStorage.setItem('journeyOrder', JSON.stringify(orderResponse.data));

      const normalizedPaymentMethod = String(
        updatedCustomerFields.paymentPreference ?? journey.customer?.paymentPreference ?? '',
      )
        .toLowerCase()
        .replace(/[-_\s]/g, '');

      if (normalizedPaymentMethod === 'prepayment') {
        setIsPrepaymentComplete(true);
      } else {
        router.push('/payment');
      }
    } catch (error) {
      console.error('Failed to confirm journey:', error);
      showError(
        error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof error.message === 'string'
          ? error.message
          : 'We could not create your order. Please try again.',
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const [editingSection, setEditingSection] = useState<EditableSection | null>(null);

  const editSection = (section: EditableSection, fieldKeys: string[], route: string) => {
    if (serviceFields.requiresQuoteRefresh(fieldKeys)) {
      const separator = route.includes('?') ? '&' : '?';
      router.push(isBundle ? `${route}${separator}flow=bundle` : route);
    } else {
      setEditingSection(section);
    }
  };

  const propertyLabel = humanizeLabel(details.household.propertyType, '—');
  const occupantsLabel = details.household.occupants ?? '—';
  const bedroomsLabel = details.household.bedrooms ?? '—';

  const providerLabel = useMemo(
    () => details.broadbandProvider ?? '—',
    [details.broadbandProvider],
  );
  const speedLabel = useMemo(() => details.broadbandSpeed ?? '—', [details.broadbandSpeed]);
  const contractLengthLabel = useMemo(
    () => details.broadbandContractLength ?? '—',
    [details.broadbandContractLength],
  );

  if (isPrepaymentComplete) {
    return <FinalThankYou />;
  }

  const handleEditSaved = (updatedData: ReviewState) => {
    if (!journey) {
      return;
    }

    const updatedJourney = {
      ...journey,
      customer: {
        ...journey.customer,
        title: updatedData.personalDetails.title ?? '',
        firstName: updatedData.personalDetails.firstName ?? '',
        surname: updatedData.personalDetails.lastName ?? '',
        emailAddress: updatedData.personalDetails.email ?? '',
        phoneNumber: updatedData.personalDetails.mobileNumber ?? '',
        dateOfBirth: updatedData.personalDetails.dateOfBirth ?? '',
        propertyType: updatedData.household.propertyType ?? '',
        occupants:
          updatedData.household.occupants !== '' ? Number(updatedData.household.occupants) : 0,
        bedrooms:
          updatedData.household.bedrooms !== '' ? Number(updatedData.household.bedrooms) : 0,
        paymentPreference: updatedData.paymentMethod ?? '',
        preferredStartDate: updatedData.contractDetails.contractDate ?? '',
      },
    };

    setJourney(updatedJourney);
    const customerUpdatesBySection: Partial<Record<EditableSection, Record<string, unknown>>> = {
      personalDetails: {
        title: updatedData.personalDetails.title ?? '',
        firstName: updatedData.personalDetails.firstName ?? '',
        surname: updatedData.personalDetails.lastName ?? '',
        emailAddress: updatedData.personalDetails.email ?? '',
        phoneNumber: updatedData.personalDetails.mobileNumber ?? '',
        dateOfBirth: updatedData.personalDetails.dateOfBirth ?? '',
      },
      household: {
        propertyType: updatedData.household.propertyType ?? '',
        occupants: updatedData.household.occupants ? Number(updatedData.household.occupants) : 0,
        bedrooms: updatedData.household.bedrooms ? Number(updatedData.household.bedrooms) : 0,
      },
      paymentMethod: { paymentPreference: updatedData.paymentMethod ?? '' },
      contractDates: { preferredStartDate: updatedData.contractDetails.contractDate ?? '' },
    };

    if (editingSection && customerUpdatesBySection[editingSection]) {
      setUpdatedCustomerFields((current) => ({
        ...current,
        ...customerUpdatesBySection[editingSection],
      }));
    }
    setEditingSection(null);
  };

  return (
    <>
      <section className="w-full bg-[#F9F9F9] px-4 pb-10 pt-6 sm:px-6 sm:pt-7 md:px-8 md:pb-12 md:pt-8 lg:px-10 lg:pb-14 lg:pt-9">
        <div className="mx-auto w-full max-w-[1320px]">
          <header>
            <h1 className="font-red-hat-display text-[26px] font-[645] leading-[34px] tracking-[0] text-[#0C3354] sm:text-[28px] sm:leading-[38px] md:text-[30px] md:leading-[44px] lg:text-[34px] lg:leading-[56px]">
              {review.heading}
            </h1>
            <p className="mt-1 max-w-[760px] font-red-hat-display text-[13px] font-[467] leading-[19px] tracking-[0] text-[#667085] sm:text-[14px] sm:leading-[20px] md:text-[16px] md:leading-[23px] lg:text-[18px] lg:leading-[25px]">
              {review.description}
            </p>
          </header>

          <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-6">
            <div className="space-y-4">
              <ReviewSection
                title={review.sections.personalDetails.title}
                icon={<UserRound />}
                onEdit={() =>
                  editSection(
                    'personalDetails',
                    ['title', 'firstName', 'surname', 'emailAddress', 'phoneNumber', 'dateOfBirth'],
                    `/steps/personal-details-form?service=${requestedService}`,
                  )
                }
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {serviceFields.isVisible('title') && (
                    <ReviewField
                      label="Title"
                      value={details.personalDetails.title}
                    />
                  )}
                  {serviceFields.isVisible('firstName') && (
                    <ReviewField
                      label="Firstname"
                      value={details.personalDetails.firstName}
                    />
                  )}
                  {serviceFields.isVisible('surname') && (
                    <ReviewField
                      label="Lastname"
                      value={details.personalDetails.lastName}
                    />
                  )}
                  {serviceFields.isVisible('emailAddress') && (
                    <ReviewField
                      label="Email address"
                      value={details.personalDetails.email}
                    />
                  )}
                  {serviceFields.isVisible('phoneNumber') && (
                    <ReviewField
                      label="Mobile number"
                      value={details.personalDetails.mobileNumber}
                    />
                  )}
                  {serviceFields.isVisible('dateOfBirth') && (
                    <ReviewField
                      label="Date of birth"
                      value={details.personalDetails.dateOfBirth}
                    />
                  )}
                </div>
              </ReviewSection>

              <>
                <ReviewSection
                  title={review.sections.household.title}
                  icon={<Home />}
                  onEdit={() =>
                    editSection(
                      'household',
                      ['propertyType', 'occupants', 'bedrooms'],
                      '/steps/household-form',
                    )
                  }
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {serviceFields.isVisible('propertyType') && (
                      <ReviewField
                        label="House type"
                        value={propertyLabel}
                      />
                    )}
                    {serviceFields.isVisible('occupants') && (
                      <ReviewField
                        label="House size"
                        value={occupantsLabel}
                      />
                    )}
                    {serviceFields.isVisible('bedrooms') && (
                      <ReviewField
                        label="No. of bedrooms"
                        value={bedroomsLabel}
                      />
                    )}
                  </div>
                </ReviewSection>

                <ReviewSection
                  title={review.sections.paymentMethod.title}
                  icon={<CreditCard />}
                  onEdit={() =>
                    editSection(
                      'paymentMethod',
                      ['paymentPreference'],
                      requestedService === 'bundle-bills'
                        ? `/steps/payment-details-form?service=${requestedService}`
                        : `/compare?service=${requestedService}`,
                    )
                  }
                >
                  <ReviewField
                    label="Payment method"
                    value={humanizeLabel(details.paymentMethod, '—')}
                  />
                </ReviewSection>

                <ReviewSection
                  title={review.sections.contractDates.title}
                  icon={<CalendarDays />}
                  onEdit={() =>
                    editSection(
                      'contractDates',
                      ['preferredStartDate', 'coolingOffPeriodWaiverAccepted'],
                      '/steps/contract-date-form',
                    )
                  }
                >
                  <ReviewField
                    label="Contract start date"
                    value={details.contractDetails.contractDate}
                  />
                  <ContractInformation />
                </ReviewSection>

                {/* Password Section (Energy service & Bundle flow) */}
                {showPasswordSection && (
                  <section className="overflow-hidden rounded-[12px] border border-[#EAECF0] bg-white shadow-[0px_1px_2px_rgba(16,24,40,0.03)]">
                    <div className="flex min-h-[52px] items-center gap-3 border-b border-[#F2F4F7] px-4 sm:min-h-[56px] lg:min-h-[60px] lg:px-5">
                      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[#344054] md:h-5 md:w-5 lg:h-6 lg:w-6">
                        <Lock />
                      </span>
                      <h2 className="font-red-hat-display text-[15px] font-[645] leading-[20px] text-[#101828] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                        Account Password
                      </h2>
                    </div>
                    <div className="p-4 lg:p-5 space-y-2">
                      <label className="block font-inter text-[13px] font-medium text-[#344054]">
                        Create Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative max-w-md">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          maxLength={32}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError('');
                          }}
                          placeholder="Enter account password"
                          className="w-full rounded-[7px] border border-[#D0D5DD] px-3 py-2 pr-10 font-inter text-[14px] text-[#101828] focus:border-[#00897B] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828]"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="font-inter text-[11px] text-[#667085]">
                        7-8 characters, must include uppercase, lowercase, number, and special
                        character.
                      </p>
                      {passwordError && (
                        <p className="font-inter text-[12px] font-medium text-red-600">
                          {passwordError}
                        </p>
                      )}
                    </div>
                  </section>
                )}
              </>

              {details.service === 'broadband' && (
                <>
                  <ReviewSection
                    title={review.sections.provider.title}
                    icon={<Wifi />}
                    onEdit={() => router.push(`/compare?service=${requestedService}`)}
                  >
                    <ReviewField
                      label="Current broadband provider"
                      value={providerLabel}
                    />
                  </ReviewSection>

                  <ReviewSection
                    title={review.sections.broadbandSpeed.title}
                    icon={<SlidersHorizontal />}
                    onEdit={() => router.push(`/compare?service=${requestedService}`)}
                  >
                    <ReviewField
                      label="Broadband speed"
                      value={speedLabel}
                    />
                  </ReviewSection>

                  <ReviewSection
                    title={review.sections.contractLength.title}
                    icon={<CalendarDays />}
                    onEdit={() => router.push(`/compare?service=${requestedService}`)}
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

            <aside className="space-y-4">
              <SelectedPlanCard selectedPlans={details.selectedPlans} />
              <SummaryCard
                paymentMethod={humanizeLabel(details.paymentMethod, '—')}
                plans={details.selectedPlans}
                onConfirm={handleConfirm}
                isConfirming={isConfirming}
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

function readStoredSelectedPlan(): StandardPlan | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedPlan = sessionStorage.getItem('journeySelectedPlan');
    return storedPlan ? (JSON.parse(storedPlan) as StandardPlan) : null;
  } catch {
    return null;
  }
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
          text-[14px]
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

function SelectedPlanCard({ selectedPlans }: { selectedPlans: StandardPlan[] }) {
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
        {selectedPlans.length === 0 ? (
          <p className="font-inter text-[12px] text-[#667085]">No plan selected.</p>
        ) : (
          <div className="space-y-3">
            {selectedPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center gap-3"
              >
                <Image
                  src={plan.logo}
                  alt={plan.logoAlt}
                  width={54}
                  height={54}
                  className="
                h-[54px]
                w-[54px]
                shrink-0

                rounded-[7px]

                object-contain
              "
                />

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
                  text-[10px]
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
                    {plan?.annualPrice ?? plan?.price}
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function SummaryCard({
  paymentMethod,
  plans,
  onConfirm,
  isConfirming,
}: {
  paymentMethod?: string;
  plans: StandardPlan[];
  onConfirm: () => void;
  isConfirming: boolean;
}) {
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
        {plans.map((plan) => (
          <SummaryRow
            key={plan.id}
            label={plan.groupDisplayName ?? plan.provider}
            value={plan.annualPrice ?? plan.price}
          />
        ))}

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
                text-[10px]
                text-[#667085]
              "
            >
              {summary.totalLabel} {paymentMethod}
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
              {sumPlanPrices(plans, 'price')}
            </p>
          </div>

          {/* <div
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
          </div> */}
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isConfirming}
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

            disabled:cursor-not-allowed
            disabled:opacity-60

            md:text-[14px]
          "
        >
          {isConfirming
            ? 'Confirming...'
            : paymentMethod == 'prepayment'
              ? `Confirm`
              : `${summary.confirmButton} →`}
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

        md:text-[11px]
      "
    >
      <span className="text-[#667085]">{label}</span>

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
