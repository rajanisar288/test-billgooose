'use client';

import { type FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Check } from 'lucide-react';

import { useJourneyStepStatus } from '@/components/journey/journey-step-status';
import data from '@/data/content.json';

export default function HouseDetailsForm() {
  const router = useRouter();

  const { insuranceHouseDetails } = data.journey;

  const [homeType, setHomeType] = useState(insuranceHouseDetails.homeType.defaultValue);

  const [houseStyle, setHouseStyle] = useState(insuranceHouseDetails.houseStyle.defaultValue);

  const [smokeDetectors, setSmokeDetectors] = useState(
    insuranceHouseDetails.smokeDetectors.defaultValue,
  );

  useJourneyStepStatus('journey-step-form-3', Boolean(homeType && houseStyle && smokeDetectors));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!homeType || !houseStyle || !smokeDetectors) {
      return;
    }

    sessionStorage.setItem(
      insuranceHouseDetails.storageKey,
      JSON.stringify({
        homeType,
        houseStyle,
        smokeDetectors,
      }),
    );

    sessionStorage.setItem('billgooseJourneyService', 'insurance');
    sessionStorage.setItem('billgooseJourneyFlow', 'insurance');

    router.push('/result?service=insurance');
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
          {insuranceHouseDetails.heading}
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
          {insuranceHouseDetails.description}
        </p>
      </header>

      <form
        id="journey-step-form-3"
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        <OptionSection
          label={insuranceHouseDetails.homeType.label}
          options={insuranceHouseDetails.homeType.options}
          value={homeType}
          onChange={setHomeType}
        />

        <div className="h-px w-full bg-[#EAECF0]" />

        <OptionSection
          label={insuranceHouseDetails.houseStyle.label}
          options={insuranceHouseDetails.houseStyle.options}
          value={houseStyle}
          onChange={setHouseStyle}
        />

        <div className="h-px w-full bg-[#EAECF0]" />

        <OptionSection
          label={insuranceHouseDetails.smokeDetectors.label}
          options={insuranceHouseDetails.smokeDetectors.options}
          value={smokeDetectors}
          onChange={setSmokeDetectors}
        />
      </form>
    </div>
  );
}

type Option = {
  id: string;
  label: string;
  value: string;
};

type OptionSectionProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

function OptionSection({ label, options, value, onChange }: OptionSectionProps) {
  return (
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
        {label}
      </legend>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                onChange(option.value);
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
