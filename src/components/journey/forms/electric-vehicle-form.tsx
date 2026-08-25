'use client';

import { type FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Check } from 'lucide-react';

import { JOURNEY_ROUTES } from '@/components/journey/journey-routes';
import data from '@/data/content.json';

export default function ElectricVehicleForm() {
  const router = useRouter();

  const { electricVehicle } = data.journey;

  const [selectedOption, setSelectedOption] = useState(electricVehicle.defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedOption) {
      return;
    }

    sessionStorage.setItem(electricVehicle.storageKey, selectedOption);

    /*
     * Energy step 4 → Energy step 5 Payment Method.
     */
    router.push(JOURNEY_ROUTES[5]);
  }

  return (
    <div className="w-full">
      {/* =====================================================
          DESKTOP HEADING

          Mobile/tablet heading comes from
          JourneyMobileStepHeader in the page.
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
            leading-[48px]
            tracking-[0]

            text-[#0C3354]
          "
        >
          {electricVehicle.heading}
        </h1>

        <p
          className="
            mt-1

            font-inter
            text-[14px]
            font-normal
            leading-[20px]
            tracking-[0]

            text-[#667085]
          "
        >
          {electricVehicle.description}
        </p>
      </header>

      {/* =====================================================
          FORM
      ====================================================== */}
      <form
        id="journey-step-form-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <fieldset>
          <legend className="sr-only">{electricVehicle.heading}</legend>

          <div
            className="
              grid
              w-full
              grid-cols-1

              gap-3

              min-[390px]:grid-cols-2
              min-[390px]:gap-3

              sm:gap-4

              lg:grid-cols-2
              lg:gap-[14px]
            "
          >
            {/* =================================================
                YES
            ================================================== */}
            <ElectricVehicleOption
              label={electricVehicle.options[0].label}
              selected={selectedOption === electricVehicle.options[0].value}
              onClick={() => {
                setSelectedOption(electricVehicle.options[0].value);
              }}
            />

            {/* =================================================
                NO
            ================================================== */}
            <ElectricVehicleOption
              label={electricVehicle.options[1].label}
              selected={selectedOption === electricVehicle.options[1].value}
              onClick={() => {
                setSelectedOption(electricVehicle.options[1].value);
              }}
            />

            {/* =================================================
                CONSIDERING ONE
            ================================================== */}
            <div
              className="
                min-[390px]:col-span-2
              "
            >
              <ElectricVehicleOption
                label={electricVehicle.options[2].label}
                selected={selectedOption === electricVehicle.options[2].value}
                onClick={() => {
                  setSelectedOption(electricVehicle.options[2].value);
                }}
                fullWidth
              />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

/* =========================================================
   OPTION
========================================================= */

type ElectricVehicleOptionProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  fullWidth?: boolean;
};

function ElectricVehicleOption({
  label,
  selected,
  onClick,
  fullWidth = false,
}: ElectricVehicleOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`
        flex
        h-[52px]
        w-full

        items-center
        justify-between

        gap-3

        rounded-[14px]

        border

        bg-white

        px-4

        text-left

        shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

        transition-colors
        duration-200

        sm:h-[56px]
        sm:rounded-[16px]
        sm:px-[18px]

        md:h-[56px]
        md:px-5

        lg:h-[61px]
        lg:rounded-[16px]
        lg:px-5

        ${fullWidth ? 'lg:w-[500px]' : 'lg:w-[243px]'}

        ${
          selected
            ? `
              border-[#00897B]
            `
            : `
              border-[#D0D5DD]

              hover:border-[#73BEB7]
              hover:bg-[#F9FAFB]
            `
        }
      `}
    >
      <span
        className="
          min-w-0

          font-inter
          text-[13px]
          font-medium
          leading-[18px]
          tracking-[0]

          text-[#0C3354]

          sm:text-[14px]
          sm:leading-5

          lg:text-[14px]
          lg:leading-5
        "
      >
        {label}
      </span>

      <SelectionCircle selected={selected} />
    </button>
  );
}

/* =========================================================
   SELECTION CIRCLE
========================================================= */

function SelectionCircle({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`
        flex
        h-[18px]
        w-[18px]
        shrink-0

        items-center
        justify-center

        rounded-full

        border

        transition-colors
        duration-200

        sm:h-5
        sm:w-5

        ${
          selected
            ? `
              border-[#00897B]
              bg-[#00897B]
            `
            : `
              border-[#D0D5DD]
              bg-white
            `
        }
      `}
    >
      <Check
        aria-hidden="true"
        strokeWidth={3}
        className={`
          h-[11px]
          w-[11px]

          text-white

          transition-opacity
          duration-150

          sm:h-3
          sm:w-3

          ${selected ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </span>
  );
}
