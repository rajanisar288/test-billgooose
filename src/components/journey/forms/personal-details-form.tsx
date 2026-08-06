'use client';

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { CalendarDays, Check, ChevronDown } from 'lucide-react';

import data from '@/data/content.json';

export default function PersonalDetailsForm() {
  const router = useRouter();

  const { personalDetails } = data.journey;
  const { fields, terms } = personalDetails;

  const [title, setTitle] = useState(fields.title.defaultValue);

  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);

  const [firstName, setFirstName] = useState(fields.firstName.defaultValue);

  const [lastName, setLastName] = useState(fields.lastName.defaultValue);

  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const [acceptedTerms, setAcceptedTerms] = useState(terms.acceptedTermsDefault);

  const [marketingConsent, setMarketingConsent] = useState(terms.marketingConsentDefault);

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

    if (
      !title ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !mobileNumber.trim() ||
      !dateOfBirth ||
      !acceptedTerms
    ) {
      return;
    }

    const personalDetailsData = {
      title,
      firstName,
      lastName,
      email,
      mobileNumber,
      dateOfBirth,
      acceptedTerms,
      marketingConsent,
    };

    sessionStorage.setItem(personalDetails.storageKey, JSON.stringify(personalDetailsData));

    router.push('/steps?step=2');
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <header className="mb-6 sm:mb-7 lg:mb-8">
        <h1
          className="
            font-red-hat-display
            text-[30px] font-extrabold
            leading-[38px] tracking-[0]
            text-[#0C3354]

            sm:text-[34px]
            sm:leading-[44px]

            lg:text-[40px]
            lg:leading-[56px]
          "
        >
          {personalDetails.heading}
        </h1>

        <p
          className="
            mt-1
            font-inter text-[14px] font-normal
            leading-[21px] tracking-[0]
            text-[#667085]

            sm:text-[16px]
            sm:leading-6

            lg:text-[18px]
            lg:leading-[25px]
          "
        >
          {personalDetails.description}
        </p>
      </header>

      <form
        id="journey-step-form-1"
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
      >
        {/* Title dropdown */}
        <FormField label={fields.title.label}>
          <div
            ref={titleDropdownRef}
            className="relative"
          >
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={titleDropdownOpen}
              onClick={() => {
                setTitleDropdownOpen((currentValue) => !currentValue);
              }}
              className={`
                flex h-11 w-full
                items-center justify-between
                gap-2 rounded-[100px]
                border bg-white
                px-4 py-3
                text-left

                font-inter text-[13px]
                font-normal leading-5
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
                  h-5 w-5 shrink-0
                  text-[#354052]
                  transition-transform duration-200

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
                  absolute left-0 top-[calc(100%+8px)]
                  z-50 w-full
                  overflow-hidden
                  rounded-[20px]
                  bg-white p-[5px]
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
                        flex min-h-9 w-full
                        items-center justify-between
                        rounded-[30px]
                        px-3 py-2
                        text-left

                        font-inter text-[13px]
                        leading-5 text-[#344054]
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
                          className="h-4 w-4 shrink-0 text-[#00897B]"
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

        {/* First and last name */}
        <div
          className="
            grid grid-cols-1 gap-4

            sm:grid-cols-2
            sm:gap-[18px]

            lg:grid-cols-[241px_241px]
          "
        >
          <FormField label={fields.firstName.label}>
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

          <FormField label={fields.lastName.label}>
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

        {/* Email */}
        <FormField label={fields.email.label}>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            placeholder={fields.email.placeholder}
            autoComplete="email"
            className={inputClasses}
          />
        </FormField>

        {/* Mobile */}
        <FormField label={fields.mobileNumber.label}>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(event) => {
              setMobileNumber(event.target.value);
            }}
            placeholder={fields.mobileNumber.placeholder}
            autoComplete="tel"
            className={inputClasses}
          />
        </FormField>

        {/* Date of birth */}
        <FormField label={fields.dateOfBirth.label}>
          <div className="relative">
            <input
              id="date-of-birth"
              type="date"
              value={dateOfBirth}
              onChange={(event) => {
                setDateOfBirth(event.target.value);
              }}
              autoComplete="bday"
              className={`
        ${inputClasses}
        pr-11 lg:pr-[50px]

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
        absolute right-[14px] top-1/2
        flex h-8 w-8 -translate-y-1/2
        items-center justify-center
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
          h-4 w-4

          lg:h-[18px]
          lg:w-[18px]
        "
                strokeWidth={1.6}
              />
            </button>
          </div>
        </FormField>
        {/* Terms */}
        <div className="space-y-3 pt-1">
          <CustomCheckbox
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
          >
            {terms.acceptedTermsText}
          </CustomCheckbox>

          <CustomCheckbox
            checked={marketingConsent}
            onChange={setMarketingConsent}
          >
            {terms.marketingConsentText}
          </CustomCheckbox>
        </div>
      </form>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="block">
      <label
        className="
          mb-1.5 block
          font-inter text-[11px]
          font-medium leading-4
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
        flex w-full cursor-pointer
        items-start gap-2.5

        lg:gap-3
      "
    >
      <span className="relative mt-[2px] h-4 w-4 shrink-0 lg:h-[18px] lg:w-[18px]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            onChange(event.target.checked);
          }}
          className="
            absolute inset-0 z-10
            h-full w-full cursor-pointer
            appearance-none opacity-0
          "
        />

        <span
          aria-hidden="true"
          className={`
            pointer-events-none
            flex h-full w-full
            items-center justify-center
            overflow-hidden rounded-[4px]
            border leading-none
            transition-colors duration-150

            ${checked ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
          `}
        >
          <Check
            aria-hidden="true"
            strokeWidth={3}
            className={`
              h-3 w-3 shrink-0
              text-white
              transition-opacity duration-150

              lg:h-[14px]
              lg:w-[14px]

              ${checked ? 'opacity-100' : 'opacity-0'}
            `}
          />
        </span>
      </span>

      <span
        className="
          min-w-0 flex-1
          font-inter text-[11px]
          font-normal leading-[16px]
          tracking-[0] text-[#535862]

          sm:text-[12px]
          sm:leading-[18px]

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
  h-11 w-full
  rounded-[100px]
  border border-[#D0D5DD]
  bg-white
  px-4 py-3

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
