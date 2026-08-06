'use client';

import { type FormEvent, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Check } from 'lucide-react';

import data from '@/data/content.json';

export default function HouseholdForm() {
  const router = useRouter();

  const { household } = data.journey;
  const { propertyType, occupants, bedrooms } = household;

  const [selectedPropertyType, setSelectedPropertyType] = useState(propertyType.options[0].value);

  const [selectedOccupants, setSelectedOccupants] = useState(occupants.defaultValue);

  const [selectedBedrooms, setSelectedBedrooms] = useState(bedrooms.defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const householdData = {
      propertyType: selectedPropertyType,
      occupants: selectedOccupants,
      bedrooms: selectedBedrooms,
    };

    sessionStorage.setItem(household.storageKey, JSON.stringify(householdData));

    router.push('/steps?step=4');
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
          {household.heading}
        </h1>

        <p
          className="
            mt-1
            font-inter text-[14px]
            font-normal leading-[21px]
            tracking-[0] text-[#667085]

            sm:text-[16px]
            sm:leading-6

            lg:text-[18px]
            lg:leading-[25px]
          "
        >
          {household.description}
        </p>
      </header>

      <form
        id="journey-step-form-3"
        onSubmit={handleSubmit}
        className="space-y-6 lg:space-y-7"
      >
        {/* Property type */}
        <fieldset>
          <legend className="sr-only">Select your property type</legend>

          <div
            className="
              grid grid-cols-1 gap-3

              min-[420px]:grid-cols-2
              min-[420px]:gap-[14px]

              lg:grid-cols-[243px_243px]
              lg:gap-[14px]
            "
          >
            {propertyType.options.map((option) => {
              const isSelected = selectedPropertyType === option.value;

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedPropertyType(option.value);
                  }}
                  className={`
                    relative flex min-h-[112px]
                    w-full flex-col items-start
                    justify-between gap-3
                    rounded-[14px]
                    bg-white p-4 text-left
                    transition-colors

                    sm:min-h-[124px]
                    sm:rounded-[16px]
                    sm:p-[18px]

                    lg:h-[139px]
                    lg:min-h-[139px]
                    lg:gap-4
                    lg:p-5

                    ${isSelected ? 'border-2 border-[#00897B]' : 'border border-[#D0D5DD]'}
                  `}
                >
                  <div className="flex w-full items-start justify-between gap-4">
                    <Image
                      src={option.icon}
                      alt={option.iconAlt}
                      width={24}
                      height={24}
                      aria-hidden="true"
                      className="
                        h-5 w-5 shrink-0
                        object-contain

                        sm:h-[22px]
                        sm:w-[22px]

                        lg:h-6
                        lg:w-6
                      "
                    />

                    <SelectionCircle selected={isSelected} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        font-inter text-[15px]
                       leading-5 font-[550] font-bold
                        tracking-[0] text-[#344054]

                        sm:text-[16px]

                        lg:text-[18px]
                      "
                    >
                      {option.label}
                    </p>

                    <p
                      className="
                        mt-1.5 font-inter
                        text-[11px] font-normal
                        leading-[15px]
                        tracking-[0] text-[#667085]

                        sm:text-[12px]
                        sm:leading-4

                        lg:text-[14px]
                        lg:leading-[14px]
                      "
                    >
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Occupants */}
        <fieldset>
          <SectionHeading
            icon={occupants.icon}
            iconAlt={occupants.iconAlt}
            heading={occupants.heading}
            description={occupants.description}
          />

          <div
            className="
              mt-3 grid grid-cols-1 gap-3

              min-[390px]:grid-cols-3
              min-[390px]:gap-2

              sm:gap-3

              lg:mt-4
              lg:grid-cols-[157.33px_157.33px_157.33px]
              lg:gap-[14px]
            "
          >
            {occupants.options.map((option) => (
              <SelectorOption
                key={option.id}
                label={option.label}
                selected={selectedOccupants === option.value}
                onClick={() => {
                  setSelectedOccupants(option.value);
                }}
              />
            ))}
          </div>
        </fieldset>

        {/* Separator */}
        <div className="h-px w-full bg-[#D5D7DA]" />

        {/* Bedrooms */}
        <fieldset>
          <SectionHeading
            icon={bedrooms.icon}
            iconAlt={bedrooms.iconAlt}
            heading={bedrooms.heading}
            description={bedrooms.description}
          />

          <div className="mt-3 space-y-3 lg:mt-4">
            {/* Full-width first option */}
            <SelectorOption
              label={bedrooms.options[0].label}
              selected={selectedBedrooms === bedrooms.options[0].value}
              onClick={() => {
                setSelectedBedrooms(bedrooms.options[0].value);
              }}
              fullWidth
            />

            {/* Bottom two options */}
            <div
              className="
                grid grid-cols-1 gap-3

                min-[390px]:grid-cols-2
                min-[390px]:gap-[14px]

                lg:grid-cols-[243px_243px]
              "
            >
              {bedrooms.options.slice(1).map((option) => (
                <SelectorOption
                  key={option.id}
                  label={option.label}
                  selected={selectedBedrooms === option.value}
                  onClick={() => {
                    setSelectedBedrooms(option.value);
                  }}
                />
              ))}
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

type SectionHeadingProps = {
  icon: string;
  iconAlt: string;
  heading: string;
  description: string;
};

function SectionHeading({ icon, iconAlt, heading, description }: SectionHeadingProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Image
          src={icon}
          alt={iconAlt}
          width={15}
          height={15}
          aria-hidden="true"
          className="
            h-[14px] w-[14px]
            shrink-0 object-contain

            lg:h-[15px]
            lg:w-[15px]
          "
        />

        <h2
          className="
            font-inter text-[14px]
            font-[500] font-bold leading-5
            tracking-[0] text-[#344054]

            sm:text-[16px]

            lg:text-[18px]
          "
        >
          {heading}
        </h2>
      </div>

      <p
        className="
          mt-1 font-inter
          text-[11px] font-normal
          leading-[15px] tracking-[0]
          text-[#667085]

          sm:text-[12px]
          sm:leading-4

          lg:text-[14px]
          lg:leading-[14px]
        "
      >
        {description}
      </p>
    </div>
  );
}

type SelectionCircleProps = {
  selected: boolean;
};

function SelectionCircle({ selected }: SelectionCircleProps) {
  return (
    <span
      aria-hidden="true"
      className={`
        flex h-[18px] w-[18px]
        shrink-0 items-center justify-center
        rounded-full border

        lg:h-5
        lg:w-5

        ${selected ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
      `}
    >
      <Check
        strokeWidth={3}
        className={`
          h-3 w-3 text-white
          transition-opacity

          lg:h-[13px]
          lg:w-[13px]

          ${selected ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </span>
  );
}

type SelectorOptionProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  fullWidth?: boolean;
};

function SelectorOption({ label, selected, onClick, fullWidth = false }: SelectorOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`
        flex h-[52px] w-full
        items-center justify-between
        gap-3 rounded-[14px]
        border bg-white
        px-4 text-left
        transition-colors

        sm:h-[56px]
        sm:rounded-[16px]
        sm:px-[18px]

        lg:h-[61px]
        lg:gap-4
        lg:rounded-[16px]
        lg:px-5

        ${fullWidth ? 'lg:w-[500px]' : ''}

        ${selected ? 'border-[#00897B]' : 'border-[#D0D5DD]'}
      `}
    >
      <span
        className="
          min-w-0
          font-red-hat-display
          text-[13px] font-[550] font-bold
          leading-none tracking-[0]
          text-[#0D3B66]

          sm:text-[14px]

          lg:text-[16px]
        "
      >
        {label}
      </span>

      <SelectionCircle selected={selected} />
    </button>
  );
}
