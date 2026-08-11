'use client';

import { type FormEvent, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Check } from 'lucide-react';

import { JOURNEY_ROUTES } from '@/components/journey/journey-routes';
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

    if (!selectedPropertyType || !selectedOccupants || !selectedBedrooms) {
      return;
    }

    const householdData = {
      propertyType: selectedPropertyType,

      occupants: selectedOccupants,

      bedrooms: selectedBedrooms,
    };

    sessionStorage.setItem(household.storageKey, JSON.stringify(householdData));

    router.push(JOURNEY_ROUTES[4]);
  }

  return (
    <div className="w-full">
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
          {household.heading}
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
          {household.description}
        </p>
      </header>

      <form
        id="journey-step-form-3"
        onSubmit={handleSubmit}
        className="
          space-y-6

          md:space-y-7

          lg:space-y-7
        "
      >
        {/* Property type */}
        <fieldset>
          <legend className="sr-only">Select your property type</legend>

          <div
            className="
              grid
              grid-cols-1
              gap-4

              md:grid-cols-2
              md:gap-4

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
                      relative

                      flex min-h-[78px]
                      w-full
                      items-center
                      gap-4

                      rounded-[16px]

                      bg-white

                      px-5
                      py-3

                      text-left

                      transition-colors

                      md:h-[135px]
                      md:min-h-[135px]
                      md:flex-col
                      md:items-start
                      md:justify-between
                      md:gap-3
                      md:p-5

                      lg:h-[139px]
                      lg:min-h-[139px]
                      lg:flex-col
                      lg:items-start
                      lg:justify-between
                      lg:gap-4
                      lg:rounded-[16px]
                      lg:p-5

                      ${isSelected ? 'border-2 border-[#00897B]' : 'border border-[#D0D5DD]'}
                    `}
                >
                  <Image
                    src={option.icon}
                    alt={option.iconAlt}
                    width={30}
                    height={30}
                    aria-hidden="true"
                    className="
                        h-[30px]
                        w-[30px]
                        shrink-0
                        object-contain

                        md:hidden
                      "
                  />

                  <div
                    className="
                        hidden

                        md:flex
                        md:w-full
                        md:items-start
                        md:justify-between
                        md:gap-4
                      "
                  >
                    <Image
                      src={option.icon}
                      alt={option.iconAlt}
                      width={24}
                      height={24}
                      aria-hidden="true"
                      className="
                          h-6
                          w-6
                          shrink-0
                          object-contain

                          md:h-[22px]
                          md:w-[22px]

                          lg:h-6
                          lg:w-6
                        "
                    />

                    <SelectionCircle selected={isSelected} />
                  </div>

                  <div
                    className="
                        min-w-0
                        flex-1

                        md:flex-none

                        lg:flex-none
                      "
                  >
                    <p
                      className="
                          font-inter
                          text-[20px]
                          font-bold
                          leading-[24px]
                          tracking-[0]

                          text-[#0C3354]

                          md:text-[16px]
                          md:leading-[20px]
                          md:text-[#344054]

                          lg:text-[18px]
                          lg:leading-5
                          lg:text-[#344054]
                        "
                    >
                      {option.label}
                    </p>

                    <p
                      className="
                          mt-1

                          font-inter
                          text-[16px]
                          font-normal
                          leading-[22px]
                          tracking-[0]

                          text-[#667085]

                          md:mt-1
                          md:text-[13px]
                          md:leading-[18px]

                          lg:mt-1.5
                          lg:text-[14px]
                          lg:leading-[14px]
                        "
                    >
                      {option.description}
                    </p>
                  </div>

                  <div
                    className="
                        ml-auto
                        shrink-0

                        md:hidden
                      "
                  >
                    <SelectionCircle selected={isSelected} />
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
              mt-3

              grid
              grid-cols-1
              gap-3

              min-[390px]:grid-cols-3
              min-[390px]:gap-2

              sm:gap-3

              md:grid-cols-3
              md:gap-3

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

        <div
          className="
            h-px
            w-full
            bg-[#D5D7DA]
          "
        />

        {/* Bedrooms */}
        <fieldset>
          <SectionHeading
            icon={bedrooms.icon}
            iconAlt={bedrooms.iconAlt}
            heading={bedrooms.heading}
            description={bedrooms.description}
          />

          <div
            className="
              mt-3
              space-y-3

              lg:mt-4
            "
          >
            <SelectorOption
              label={bedrooms.options[0].label}
              selected={selectedBedrooms === bedrooms.options[0].value}
              onClick={() => {
                setSelectedBedrooms(bedrooms.options[0].value);
              }}
              fullWidth
            />

            <div
              className="
                grid
                grid-cols-1
                gap-3

                min-[390px]:grid-cols-2
                min-[390px]:gap-[14px]

                md:grid-cols-2
                md:gap-[14px]

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
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <Image
          src={icon}
          alt={iconAlt}
          width={15}
          height={15}
          aria-hidden="true"
          className="
            h-[14px]
            w-[14px]
            shrink-0
            object-contain

            md:h-[15px]
            md:w-[15px]

            lg:h-[15px]
            lg:w-[15px]
          "
        />

        <h2
          className="
            font-inter
            text-[18px]
            font-bold
            leading-6
            tracking-[0]
            text-[#344054]

            md:text-[16px]
            md:leading-[22px]

            lg:text-[18px]
            lg:leading-6
          "
        >
          {heading}
        </h2>
      </div>

      <p
        className="
          mt-1

          font-inter
          text-[14px]
          font-normal
          leading-[20px]
          tracking-[0]
          text-[#667085]

          md:text-[13px]
          md:leading-[18px]

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
        flex h-[22px]
        w-[22px]
        shrink-0
        items-center
        justify-center

        rounded-full
        border

        md:h-5
        md:w-5

        lg:h-5
        lg:w-5

        ${selected ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
      `}
    >
      <Check
        aria-hidden="true"
        strokeWidth={3}
        className={`
          h-[13px]
          w-[13px]

          text-white

          transition-opacity

          md:h-[12px]
          md:w-[12px]

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
        flex h-[52px]
        w-full
        items-center
        justify-between
        gap-3

        rounded-[14px]

        border

        bg-white

        px-4

        text-left

        transition-colors

        sm:h-[56px]
        sm:rounded-[16px]
        sm:px-[18px]

        md:h-[54px]
        md:rounded-[14px]
        md:px-4

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
          text-[13px]
          font-bold
          leading-none
          tracking-[0]

          text-[#0D3B66]

          sm:text-[14px]

          md:text-[14px]

          lg:text-[16px]
        "
      >
        {label}
      </span>

      <SelectionCircle selected={selected} />
    </button>
  );
}
