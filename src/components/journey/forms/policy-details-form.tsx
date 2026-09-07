'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Check, ChevronDown } from 'lucide-react';

import { useJourneyStepStatus } from '@/components/journey/journey-step-status';
import data from '@/data/content.json';

export default function PolicyDetailsForm() {
  const router = useRouter();

  const { insurancePolicyDetails } = data.journey;

  const [ownership, setOwnership] = useState(insurancePolicyDetails.ownership.defaultValue);

  const [coverStart, setCoverStart] = useState(insurancePolicyDetails.coverStart.defaultValue);

  const [paymentFrequency, setPaymentFrequency] = useState(
    insurancePolicyDetails.paymentFrequency.defaultValue,
  );

  const [coverStartOpen, setCoverStartOpen] = useState(false);

  const coverStartRef = useRef<HTMLDivElement>(null);

  useJourneyStepStatus('journey-step-form-2', Boolean(ownership && coverStart && paymentFrequency));

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (coverStartRef.current && !coverStartRef.current.contains(event.target as Node)) {
        setCoverStartOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ownership || !coverStart || !paymentFrequency) {
      return;
    }

    sessionStorage.setItem(
      insurancePolicyDetails.storageKey,
      JSON.stringify({
        ownership,
        coverStart,
        paymentFrequency,
      }),
    );

    router.push('/steps/house-details?service=insurance');
  }

  return (
    <div className="w-full">
      <header className="hidden lg:mb-8 lg:block">
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
          {insurancePolicyDetails.heading}
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
          {insurancePolicyDetails.description}
        </p>
      </header>

      <form
        id="journey-step-form-2"
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        <fieldset>
          <legend
            className="
              mb-3
              font-inter
              text-[13px]
              font-medium
              leading-5
              text-[#344054]

              sm:text-[14px]

              lg:text-[16px]
            "
          >
            {insurancePolicyDetails.ownership.label}
          </legend>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {insurancePolicyDetails.ownership.options.map((option) => {
              const isSelected = ownership === option.value;

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setOwnership(option.value);
                  }}
                  className={`
                    flex min-h-[52px] w-full
                    items-center justify-between
                    rounded-[14px]
                    border
                    bg-white
                    px-4
                    text-left
                    font-inter
                    text-[13px]
                    font-medium
                    leading-5
                    text-[#0C3354]
                    shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                    transition-colors

                    sm:min-h-[56px]
                    sm:text-[14px]

                    lg:min-h-[58px]
                    lg:px-5

                    ${
                      isSelected
                        ? 'border-[#00897B]'
                        : 'border-[#D0D5DD] hover:border-[#73BEB7] hover:bg-[#F9FAFB]'
                    }
                  `}
                >
                  <span>{option.label}</span>

                  <SelectionCircle selected={isSelected} />
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="h-px w-full bg-[#EAECF0]" />

        <div>
          <label
            id="cover-start-label"
            className="
              mb-3
              block
              font-inter
              text-[13px]
              font-medium
              leading-5
              text-[#344054]

              sm:text-[14px]

              lg:text-[16px]
            "
          >
            {insurancePolicyDetails.coverStart.label}
          </label>

          <div
            ref={coverStartRef}
            className="relative"
          >
            <button
              type="button"
              aria-labelledby="cover-start-label"
              aria-expanded={coverStartOpen}
              aria-haspopup="listbox"
              onClick={() => {
                setCoverStartOpen((current) => !current);
              }}
              className={`
                flex h-12 w-full
                items-center justify-between
                gap-2
                rounded-full
                border
                bg-white
                px-[18px]
                text-left
                font-inter
                text-[14px]
                font-normal
                leading-6
                text-[#344054]
                shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                outline-none
                transition

                sm:h-[50px]

                lg:h-[52px]
                lg:text-[16px]

                ${coverStartOpen ? 'border-black ring-4 ring-[#EEFFFB]' : 'border-[#D0D5DD]'}
              `}
            >
              <span>
                {insurancePolicyDetails.coverStart.options.find(
                  (option) => option.value === coverStart,
                )?.label ?? insurancePolicyDetails.coverStart.placeholder}
              </span>

              <ChevronDown
                aria-hidden="true"
                className={`
                  h-5 w-5 shrink-0
                  text-[#354052]
                  transition-transform
                  ${coverStartOpen ? 'rotate-180' : ''}
                `}
                strokeWidth={2}
              />
            </button>

            {coverStartOpen && (
              <div
                role="listbox"
                aria-labelledby="cover-start-label"
                className="
                  absolute
                  left-0
                  top-[calc(100%+8px)]
                  z-50
                  max-h-[220px]
                  w-full
                  overflow-y-auto
                  rounded-[20px]
                  bg-white
                  p-[5px]
                  shadow-[0px_2px_4px_0px_rgba(84,84,84,0.15),0px_7px_7px_0px_rgba(84,84,84,0.13),0px_15px_9px_0px_rgba(84,84,84,0.08),0px_27px_11px_0px_rgba(84,84,84,0.02)]
                "
              >
                {insurancePolicyDetails.coverStart.options.map((option) => {
                  const isSelected = coverStart === option.value;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setCoverStart(option.value);
                        setCoverStartOpen(false);
                      }}
                      className={`
                        flex min-h-10 w-full
                        items-center justify-between
                        rounded-[30px]
                        px-3 py-2
                        text-left
                        font-inter
                        text-[13px]
                        text-[#344054]
                        transition-colors
                        hover:bg-[#F5F5F5]

                        lg:text-[14px]

                        ${isSelected ? 'bg-[#F5F5F5]' : 'bg-white'}
                      `}
                    >
                      <span>{option.label}</span>

                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="h-4 w-4 text-[#00897B]"
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-[#EAECF0]" />

        <fieldset>
          <legend
            className="
              font-inter
              text-[13px]
              font-medium
              leading-5
              text-[#344054]

              sm:text-[14px]

              lg:text-[16px]
            "
          >
            {insurancePolicyDetails.paymentFrequency.label}
          </legend>

          <p
            className="
              mt-1
              max-w-[480px]
              font-inter
              text-[11px]
              font-normal
              leading-4
              text-[#667085]

              sm:text-[12px]
              sm:leading-[18px]

              lg:text-[13px]
              lg:leading-[18px]
            "
          >
            {insurancePolicyDetails.paymentFrequency.description}
          </p>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {insurancePolicyDetails.paymentFrequency.options.map((option) => {
              const isSelected = paymentFrequency === option.value;

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setPaymentFrequency(option.value);
                  }}
                  className={`
                    flex min-h-[52px] w-full
                    items-center justify-between
                    rounded-[14px]
                    border
                    bg-white
                    px-4
                    text-left
                    font-inter
                    text-[13px]
                    font-medium
                    leading-5
                    text-[#0C3354]
                    shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                    transition-colors

                    sm:min-h-[56px]
                    sm:text-[14px]

                    lg:min-h-[58px]
                    lg:px-5

                    ${
                      isSelected
                        ? 'border-[#00897B]'
                        : 'border-[#D0D5DD] hover:border-[#73BEB7] hover:bg-[#F9FAFB]'
                    }
                  `}
                >
                  <span>{option.label}</span>

                  <SelectionCircle selected={isSelected} />
                </button>
              );
            })}
          </div>
        </fieldset>
      </form>
    </div>
  );
}

function SelectionCircle({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`
        flex h-[18px] w-[18px]
        shrink-0 items-center justify-center
        rounded-full border
        transition-colors

        lg:h-5
        lg:w-5

        ${selected ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
      `}
    >
      <Check
        aria-hidden="true"
        strokeWidth={3}
        className={`
          h-3 w-3 shrink-0 text-white
          transition-opacity
          lg:h-[13px]
          lg:w-[13px]
          ${selected ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </span>
  );
}
