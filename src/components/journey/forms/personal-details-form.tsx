'use client';
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { CalendarDays, Check, ChevronDown } from 'lucide-react';

import { getNextJourneyRoute, type JourneyService } from '@/components/journey/journey-routes';
import {
  notifyJourneyStepFailed,
  useJourneyStepStatus,
} from '@/components/journey/journey-step-status';
import { storeJourney } from '@/constants/shared';
import data from '@/data/content.json';
import { useToast } from '@/hooks/useToast';
import { type CustomerDetails } from '@/interfaces/shared';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { useServiceFields } from '@/lib/service-fields';
import { useJourneyStore } from '@/store/journeyStore';
import { getCurrentRelativeUrl } from '@/utils/helper';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+(?:\.[A-Za-z]{2,10})+$/;
const UK_MOBILE_REGEX = /^(?:07\d{9}|\+447\d{9})$/;
const MIN_AGE = 18;

export function normalizeUkMobile(value: string): string {
  const compact = value.replace(/[\s()-]/g, '');

  if (compact.startsWith('0044')) {
    return `+${compact.slice(2)}`;
  }

  if (compact.startsWith('447')) {
    return `+${compact}`;
  }

  return compact;
}

export function isValidUkMobile(value: string): boolean {
  return UK_MOBILE_REGEX.test(normalizeUkMobile(value));
}

function calculateAge(dob: string): number | null {
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hadBirthdayThisYear) age -= 1;
  return age;
}

export function useUpdateJourney() {
  const { journey, setJourney } = useJourneyStore();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const updateJourney = async (
    payload: Record<string, any>,
    nextRoute: string,
    lastUrl: string,
  ) => {
    try {
      const journeyId = journey?.id || journey?.journeyId || localStorage.getItem(storeJourney);

      if (!journeyId) {
        showError('Journey ID is required');
        notifyJourneyStepFailed();
        return false;
      }

      const updatedJourney = await journeyApi.createJourney({
        uuid: journeyId,
        ...payload,
        lastUrl,
      });

      if (!updatedJourney?.data) {
        throw new Error('No data received from API');
      }

      setJourney(updatedJourney.data);
      showSuccess('🎉 Great!');
      localStorage.setItem('journey-storage', JSON.stringify(updatedJourney.data));
      router.push(nextRoute);
      return true;
    } catch (error: any) {
      console.error('Failed to update journey:', error);
      showError(error?.message);
      notifyJourneyStepFailed();
      return false;
    }
  };

  return { updateJourney };
}

export default function PersonalDetailsForm() {
  const { personalDetails } = data.journey;
  const { journey } = useJourneyStore();
  const searchParams = useSearchParams();

  const requestedService = searchParams.get('service');
  const requestedFlow = searchParams.get('flow');
  const serviceFields = useServiceFields(
    requestedFlow === 'bundle' ? 'billPackage' : requestedService || journey?.serviceType,
  );

  const { fields, terms } = personalDetails;

  const [title, setTitle] = useState<string>(
    journey?.customer?.title ? journey?.customer?.title : fields.title.defaultValue,
  );
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const [firstName, setFirstName] = useState(
    journey?.customer?.firstName ? journey?.customer?.firstName : fields.firstName.defaultValue,
  );
  const [lastName, setLastName] = useState(
    journey?.customer?.surname ? journey?.customer?.surname : fields.lastName.defaultValue,
  );
  const [email, setEmail] = useState(
    journey?.customer?.emailAddress ? journey?.customer?.emailAddress : '',
  );
  const [mobileNumber, setMobileNumber] = useState(
    journey?.customer?.phoneNumber ? journey?.customer?.phoneNumber : '',
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    journey?.customer?.dateOfBirth ? journey?.customer?.dateOfBirth : '',
  );
  const [acceptedTerms, setAcceptedTerms] = useState(
    journey?.customer?.privacyConsentAccepted
      ? journey?.customer?.privacyConsentAccepted
      : terms.acceptedTermsDefault,
  );
  const [marketingConsent, setMarketingConsent] = useState(
    journey?.customer?.marketingConsent
      ? journey?.customer?.marketingConsent
      : terms.marketingConsentDefault,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateJourney } = useUpdateJourney();

  useJourneyStepStatus(
    'journey-step-form-1',
    Boolean(
      (!serviceFields.isRequired('title') || title) &&
      (!serviceFields.isRequired('firstName') || firstName.trim()) &&
      (!serviceFields.isRequired('surname') || lastName.trim()) &&
      (!serviceFields.isRequired('emailAddress') || email.trim()) &&
      (!serviceFields.isRequired('phoneNumber') || mobileNumber.trim()) &&
      (!serviceFields.isRequired('dateOfBirth') || dateOfBirth) &&
      (!serviceFields.isRequired('supplierDataSharingConsentAccepted') || acceptedTerms),
    ),
  );

  const titleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (titleDropdownRef.current && !titleDropdownRef.current.contains(event.target as Node)) {
        setTitleDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};

    if (serviceFields.isRequired('title') && !title) nextErrors.title = 'Please select a title.';
    if (serviceFields.isRequired('firstName') && !firstName.trim())
      nextErrors.firstName = 'First name is required.';
    if (serviceFields.isRequired('surname') && !lastName.trim())
      nextErrors.lastName = 'Last name is required.';

    if (
      serviceFields.isRequired('emailAddress') &&
      (!email.trim() || !EMAIL_REGEX.test(email.trim()))
    ) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (
      serviceFields.isRequired('phoneNumber') &&
      (!mobileNumber.trim() || !isValidUkMobile(mobileNumber.trim()))
    ) {
      nextErrors.mobileNumber = 'Enter a valid UK mobile number.';
    }

    const age = dateOfBirth ? calculateAge(dateOfBirth) : null;
    if (serviceFields.isRequired('dateOfBirth') && !dateOfBirth) {
      nextErrors.dateOfBirth = 'Enter your date of birth.';
    } else if (dateOfBirth && (age === null || age > 120)) {
      nextErrors.dateOfBirth = 'Enter a valid date of birth.';
    } else if (age !== null && age < MIN_AGE) {
      nextErrors.dateOfBirth = `You must be at least ${MIN_AGE} years old.`;
    }

    if (serviceFields.isRequired('supplierDataSharingConsentAccepted') && !acceptedTerms)
      nextErrors.acceptedTerms = 'You must accept the terms to continue.';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      notifyJourneyStepFailed();
      return;
    }

    const userDetailObject: CustomerDetails = {
      title: title || null,
      firstName: firstName.trim() || null,
      surname: lastName.trim() || null,
      emailAddress: email.trim() || null,
      phoneNumber: mobileNumber.trim() || null,
      dateOfBirth: dateOfBirth || null,
      privacyConsentAccepted: acceptedTerms || false,
      marketingConsent: marketingConsent || false,
    };

    const isBundle = requestedFlow === 'bundle' || requestedService === 'bundle-bills';
    const resolvedService: JourneyService =
      requestedService === 'insurance'
        ? 'insurance'
        : requestedService === 'broadband'
          ? 'broadband'
          : isBundle
            ? 'bundle-bills'
            : 'energy';

    const nextRoute = getNextJourneyRoute(1, resolvedService, isBundle ? 'bundle' : undefined);

    updateJourney({ customer: userDetailObject }, nextRoute, getCurrentRelativeUrl());
  }

  return (
    <div className="w-full">
      {/* =====================================================
          DESKTOP HEADING ONLY

          Mobile + tablet heading comes from
          JourneyMobileStepHeader.
      ====================================================== */}
      <header
        className="
          hidden

          lg:mb-8
          lg:block
        "
      >
        <h1
          className="
            font-red-hat-display
            text-[40px]
            font-extrabold
            leading-[56px]
            tracking-[0]
            text-[#0C3354]
          "
        >
          {personalDetails.heading}
        </h1>

        <p
          className="
            mt-1

            font-inter
            text-[18px]
            font-normal
            leading-[25px]
            tracking-[0]
            text-[#667085]
          "
        >
          {personalDetails.description}
        </p>
      </header>

      <form
        id="journey-step-form-1"
        onSubmit={handleSubmit}
        className="
          w-full
          space-y-4
        "
        noValidate
      >
        {/* Title */}
        <FormField
          label={fields.title.label}
          visible={serviceFields.isVisible('title')}
        >
          <div
            ref={titleDropdownRef}
            className="relative w-full"
          >
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={titleDropdownOpen}
              onClick={() => {
                setTitleDropdownOpen((currentValue) => !currentValue);
              }}
              className={`
                flex h-11
                w-full
                items-center
                justify-between
                gap-2

                rounded-[100px]

                border

                bg-white

                px-4
                py-3

                text-left

                font-inter
                text-[13px]
                font-normal
                leading-5
                text-[#344054]

                shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                outline-none

                transition

                sm:h-12
                sm:px-[18px]
                sm:py-[13px]
                sm:text-[14px]

                lg:h-[52px]
                lg:px-[18px]
                lg:py-[14px]
                lg:text-[16px]
                lg:leading-6

                ${titleDropdownOpen ? 'border-black ring-4 ring-[#EEFFFB]' : 'border-[#D0D5DD]'}
              `}
            >
              <span>{title}</span>

              <ChevronDown
                aria-hidden="true"
                className={`
                  h-5
                  w-5
                  shrink-0
                  text-[#354052]

                  transition-transform
                  duration-200

                  ${titleDropdownOpen ? 'rotate-180' : ''}
                `}
                strokeWidth={2}
              />
            </button>

            {titleDropdownOpen && (
              <div
                role="listbox"
                aria-label={fields.title.label}
                className="
                  absolute
                  left-0
                  top-[calc(100%+8px)]
                  z-50

                  w-full

                  overflow-hidden

                  rounded-[20px]

                  bg-white

                  p-[5px]

                  shadow-[0px_2px_4px_0px_rgba(84,84,84,0.15),0px_7px_7px_0px_rgba(84,84,84,0.13),0px_15px_9px_0px_rgba(84,84,84,0.08),0px_27px_11px_0px_rgba(84,84,84,0.02)]
                "
              >
                {fields.title.options.map((option) => {
                  const isSelected = title === option.value;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setTitle(option.value);
                        setTitleDropdownOpen(false);
                      }}
                      className={`
                        flex min-h-9
                        w-full
                        items-center
                        justify-between

                        rounded-[30px]

                        px-3
                        py-2

                        text-left

                        font-inter
                        text-[13px]
                        leading-5
                        text-[#344054]

                        transition-colors

                        hover:bg-[#F5F5F5]

                        sm:text-[14px]

                        ${isSelected ? 'bg-[#F5F5F5]' : 'bg-white'}
                      `}
                    >
                      <span>{option.label}</span>

                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="
                            h-4
                            w-4
                            shrink-0
                            text-[#00897B]
                          "
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </FormField>

        {/* =====================================================
            FIRST / LAST NAME
        ====================================================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-4

            sm:grid-cols-2
            sm:gap-[18px]

            lg:grid-cols-[241px_241px]
          "
        >
          <FormField
            label={fields.firstName.label}
            visible={serviceFields.isVisible('firstName')}
          >
            <input
              type="text"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
              placeholder={fields.firstName.placeholder}
              autoComplete="given-name"
              className={inputClasses}
            />
          </FormField>

          <FormField
            label={fields.lastName.label}
            visible={serviceFields.isVisible('surname')}
          >
            <input
              type="text"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
              placeholder={fields.lastName.placeholder}
              autoComplete="family-name"
              className={inputClasses}
            />
          </FormField>
        </div>

        <FormField
          label={fields.email.label}
          visible={serviceFields.isVisible('emailAddress')}
        >
          <input
            type="email"
            value={email}
            onChange={(event) => {
              let value = event.target.value;

              // Remove spaces and invalid characters
              value = value.replace(/\s/g, '').replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, '');

              // Allow only one @
              const atIndex = value.indexOf('@');

              if (atIndex !== -1) {
                const localPart = value.slice(0, atIndex);
                let domain = value.slice(atIndex + 1);

                // Prevent another @
                domain = domain.replace(/@/g, '');

                // Restrict TLD to maximum 10 characters
                const lastDotIndex = domain.lastIndexOf('.');

                if (lastDotIndex !== -1) {
                  const domainName = domain.slice(0, lastDotIndex + 1);
                  const tld = domain.slice(lastDotIndex + 1, lastDotIndex + 11);

                  domain = domainName + tld;
                }

                value = `${localPart}@${domain}`;
              }

              setEmail(value);
            }}
            placeholder={fields.email.placeholder}
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={inputClasses}
          />
          {errors.email && <p className="mt-1.5 text-[12px] text-[#D92D20]">{errors.email}</p>}
        </FormField>

        <FormField
          label={fields.mobileNumber.label}
          visible={serviceFields.isVisible('phoneNumber')}
        >
          <input
            type="tel"
            value={mobileNumber}
            onChange={(event) => {
              let value = event.target.value;

              // Allow only digits and +
              value = value.replace(/[^\d+]/g, '');

              // + can only appear at the beginning
              if (value.includes('+')) {
                value = `+${value.replace(/\+/g, '')}`;
              }

              value = value.slice(0, 14);

              setMobileNumber(value);

              // Clear error once the value becomes valid
              if (isValidUkMobile(value)) {
                setErrors((current) => ({
                  ...current,
                  mobileNumber: '',
                }));
              }
            }}
            placeholder={fields.mobileNumber.placeholder}
            autoComplete="tel"
            aria-invalid={!!errors.mobileNumber}
            className={inputClasses}
          />
          {errors.mobileNumber && (
            <p className="mt-1.5 text-[12px] text-[#D92D20]">{errors.mobileNumber}</p>
          )}
        </FormField>

        <FormField
          label={fields.dateOfBirth.label}
          visible={serviceFields.isVisible('dateOfBirth')}
        >
          <div className="relative w-full">
            <input
              id="date-of-birth"
              type="date"
              value={dateOfBirth}
              onChange={(event) => {
                setDateOfBirth(event.target.value);
              }}
              autoComplete="bday"
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - MIN_AGE))
                  .toISOString()
                  .split('T')[0]
              }
              aria-invalid={!!errors.dateOfBirth}
              className={`
                ${inputClasses}

                pr-11

                lg:pr-[50px]

                [&::-webkit-calendar-picker-indicator]:absolute
                [&::-webkit-calendar-picker-indicator]:right-[18px]
                [&::-webkit-calendar-picker-indicator]:h-[18px]
                [&::-webkit-calendar-picker-indicator]:w-[18px]
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                [&::-webkit-calendar-picker-indicator]:opacity-0
              `}
            />

            <button
              type="button"
              aria-label="Open date of birth calendar"
              onClick={() => {
                const input = document.getElementById('date-of-birth') as HTMLInputElement | null;

                input?.showPicker?.();
                input?.focus();
              }}
              className="
                absolute
                right-[14px]
                top-1/2

                flex h-8
                w-8
                -translate-y-1/2
                items-center
                justify-center

                rounded-full

                text-[#667085]

                hover:bg-[#F2F4F7]

                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-[#EEFFFB]
              "
            >
              <CalendarDays
                aria-hidden="true"
                className="
                  h-4
                  w-4

                  lg:h-[18px]
                  lg:w-[18px]
                "
                strokeWidth={1.6}
              />
            </button>
          </div>
          {errors.dateOfBirth && (
            <p className="mt-1.5 text-[12px] text-[#D92D20]">{errors.dateOfBirth}</p>
          )}
        </FormField>

        {/* =====================================================
            TERMS
        ====================================================== */}
        <div
          className="
            space-y-3
            pt-1
          "
        >
          {serviceFields.isVisible('supplierDataSharingConsentAccepted') && (
            <CustomCheckbox
              checked={acceptedTerms}
              onChange={setAcceptedTerms}
            >
              {terms.acceptedTermsText}
            </CustomCheckbox>
          )}

          {serviceFields.isVisible('marketingConsent') && (
            <CustomCheckbox
              checked={marketingConsent}
              onChange={setMarketingConsent}
            >
              {terms.marketingConsentText}
            </CustomCheckbox>
          )}
        </div>
      </form>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  children: ReactNode;
  visible?: boolean;
};

function FormField({ label, children, visible = true }: FormFieldProps) {
  if (!visible) return null;
  return (
    <div className="block w-full">
      <label
        className="
          mb-1.5
          block

          font-inter
          text-[11px]
          font-medium
          leading-4
          text-[#344054]

          sm:text-[12px]

          lg:mb-2
          lg:text-[14px]
          lg:leading-5
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
}

type CustomCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
};

function CustomCheckbox({ checked, onChange, children }: CustomCheckboxProps) {
  return (
    <label
      className="
        flex w-full
        cursor-pointer
        items-start
        gap-2.5

        lg:gap-3
      "
    >
      <span
        className="
          relative
          mt-[2px]

          h-4
          w-4
          shrink-0

          lg:h-[18px]
          lg:w-[18px]
        "
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            onChange(event.target.checked);
          }}
          className="
            absolute
            inset-0
            z-10

            h-full
            w-full

            cursor-pointer
            appearance-none
            opacity-0
          "
        />

        <span
          aria-hidden="true"
          className={`
            pointer-events-none

            flex h-full
            w-full
            items-center
            justify-center

            overflow-hidden

            rounded-[4px]

            border

            leading-none

            transition-colors
            duration-150

            ${checked ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
          `}
        >
          <Check
            aria-hidden="true"
            strokeWidth={3}
            className={`
              h-3
              w-3
              shrink-0
              text-white

              transition-opacity
              duration-150

              lg:h-[14px]
              lg:w-[14px]

              ${checked ? 'opacity-100' : 'opacity-0'}
            `}
          />
        </span>
      </span>

      <span
        className="
          min-w-0
          flex-1

          font-inter
          text-[11px]
          font-normal
          leading-[16px]
          tracking-[0]
          text-[#535862]

          sm:text-[12px]
          sm:leading-[18px]

          md:text-[14px]
          md:leading-[20px]

          lg:max-w-[464px]
          lg:text-[14px]
          lg:leading-5
        "
      >
        {children}
      </span>
    </label>
  );
}

const inputClasses = `
  h-11
  w-full

  rounded-[100px]

  border
  border-[#D0D5DD]

  bg-white

  px-4
  py-3

  font-inter
  text-[13px]
  font-normal
  leading-5

  text-[#101828]

  shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

  outline-none

  transition

  placeholder:text-[#667085]

  focus:border-black
  focus:ring-4
  focus:ring-[#EEFFFB]

  sm:h-12
  sm:px-[18px]
  sm:py-[13px]
  sm:text-[14px]

  lg:h-[52px]
  lg:px-[18px]
  lg:py-[14px]
  lg:text-[16px]
  lg:leading-6
`;
