'use client';

import { type FormEvent, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { Check } from 'lucide-react';

import { useUpdateJourney } from '@/components/journey/forms/personal-details-form';
import { JOURNEY_ROUTES } from '@/components/journey/journey-routes';
import {
  notifyJourneyStepFailed,
  useJourneyStepStatus,
} from '@/components/journey/journey-step-status';
import data from '@/data/content.json';
import { useJourneyStore } from '@/store/journeyStore';

const EV_VALUE_MAP: Record<string, number> = {
  yes: 1,
  no: 2,
  considering: 3,
};

export default function ElectricVehicleForm() {
  const { updateJourney } = useUpdateJourney();
  const { journey } = useJourneyStore();
  const searchParams = useSearchParams();

  const { electricVehicle } = data.journey;

  const [selectedOption, setSelectedOption] = useState(
    journey?.customer ? journey?.customer?.hasEvCar : electricVehicle.defaultValue,
  );

  useJourneyStepStatus(
    'journey-step-form-4',
    Boolean(
      selectedOption && electricVehicle.options.some((option) => option.value === selectedOption),
    ),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValidOption = electricVehicle.options.some((option) => option.value === selectedOption);
    if (!selectedOption || !isValidOption) {
      notifyJourneyStepFailed();
      return;
    }

    const hasEvCar = EV_VALUE_MAP[selectedOption.toLowerCase()];

    sessionStorage.setItem(electricVehicle.storageKey, selectedOption);
    const requestedFlow = searchParams.get('flow');
    const requestedService = searchParams.get('service');
    const storedFlow = sessionStorage.getItem('billgooseJourneyFlow');
    const isBundle =
      requestedFlow === 'bundle' || storedFlow === 'bundle' || requestedService === 'bundle-bills';

    const targetRoute = isBundle
      ? `${JOURNEY_ROUTES[5]}?service=energy&flow=bundle`
      : '/review-your-details?service=energy';

    const success = await updateJourney({ customer: { hasEvCar } }, targetRoute, journey?.lastUrl);
    if (!success) {
      notifyJourneyStepFailed();
    }
  }

  return (
    <div className="w-full">
      {/* =====================================================
          DESKTOP HEADING
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
          {electricVehicle.heading}
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
          {electricVehicle.description}
        </p>
      </header>

      {/* =====================================================
          STEP 4 FORM

          Both Energy and Bundle use form-4 here.
      ====================================================== */}
      <form
        id="journey-step-form-4"
        onSubmit={handleSubmit}
        className="
          space-y-3

          sm:space-y-4
        "
      >
        <fieldset>
          <legend className="sr-only">{electricVehicle.heading}</legend>

          <div
            className="
              flex
              w-full
              flex-col

              gap-3

              sm:gap-3

              md:gap-3

              lg:gap-[14px]
            "
          >
            {electricVehicle.options.map((option) => {
              const isSelected = selectedOption === option.value;

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedOption(option.value);
                  }}
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
                      lg:w-[500px]
                      lg:rounded-[16px]
                      lg:px-5

                      ${
                        isSelected
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

                        text-[#0C3354]

                        sm:text-[14px]
                        sm:leading-5

                        md:text-[14px]

                        lg:text-[14px]
                        lg:leading-5
                      "
                  >
                    {option.label}
                  </span>

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

/* =========================================================
   SELECTION CIRCLE
========================================================= */

type SelectionCircleProps = {
  selected: boolean;
};

function SelectionCircle({ selected }: SelectionCircleProps) {
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

        lg:h-5
        lg:w-5

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
          h-3
          w-3
          shrink-0

          text-white

          transition-opacity
          duration-150

          lg:h-[13px]
          lg:w-[13px]

          ${selected ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </span>
  );
}
