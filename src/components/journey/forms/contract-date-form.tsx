'use client';

import { type FormEvent, type ReactNode, useState, useSyncExternalStore } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { CalendarDays, Check } from 'lucide-react';

import { JOURNEY_ROUTES } from '@/components/journey/journey-routes';
import data from '@/data/content.json';

type JourneyService = 'energy' | 'broadband';

/* =========================================================
   JOURNEY SERVICE
========================================================= */

function getJourneyServiceSnapshot(): JourneyService {
  try {
    const storedCompareFlow = sessionStorage.getItem('compareFlowDetails');

    if (!storedCompareFlow) {
      return 'energy';
    }

    const parsedCompareFlow = JSON.parse(storedCompareFlow) as {
      service?: string;
    };

    return parsedCompareFlow.service === 'broadband' ? 'broadband' : 'energy';
  } catch {
    return 'energy';
  }
}

function getJourneyServiceServerSnapshot(): JourneyService {
  return 'energy';
}

function subscribeToJourneyService(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'compareFlowDetails') {
      callback();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
  };
}

export default function ContractDateForm() {
  const router = useRouter();

  const { contractDetails, broadbandProvider } = data.journey;

  const { fields, information, warning, acknowledgement } = contractDetails;

  const service = useSyncExternalStore(
    subscribeToJourneyService,
    getJourneyServiceSnapshot,
    getJourneyServiceServerSnapshot,
  );

  /*
   * ENERGY
   */
  const [contractDate, setContractDate] = useState('');

  const [acknowledged, setAcknowledged] = useState(acknowledgement.defaultValue);

  /*
   * BROADBAND
   */
  const [selectedProvider, setSelectedProvider] = useState(broadbandProvider.defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /*
     * BROADBAND
     */
    if (service === 'broadband') {
      if (!selectedProvider) {
        return;
      }

      sessionStorage.setItem(
        broadbandProvider.storageKey,
        JSON.stringify({
          provider: selectedProvider,
        }),
      );

      router.push(JOURNEY_ROUTES[3]);

      return;
    }

    /*
     * ENERGY
     */
    if (!contractDate || !acknowledged) {
      return;
    }

    const contractDetailsData = {
      contractDate,
      acknowledged,
    };

    sessionStorage.setItem(contractDetails.storageKey, JSON.stringify(contractDetailsData));

    router.push(JOURNEY_ROUTES[3]);
  }

  /*
   * =========================================================
   * BROADBAND STEP 2
   * =========================================================
   */
  if (service === 'broadband') {
    return (
      <BroadbandProviderForm
        selectedProvider={selectedProvider}
        onSelectProvider={setSelectedProvider}
        onSubmit={handleSubmit}
      />
    );
  }

  /*
   * =========================================================
   * ENERGY STEP 2
   * =========================================================
   */
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
          {contractDetails.heading}
        </h1>

        <p
          className="
            mt-1
            max-w-[500px]

            font-inter
            text-[20px]
            font-[400]
            leading-[25px]
            tracking-[0]

            text-[#667085]
          "
        >
          {contractDetails.description}
        </p>
      </header>

      <form
        id="journey-step-form-2"
        onSubmit={handleSubmit}
        className="space-y-5 lg:space-y-6"
        noValidate
      >
        <FormField label={fields.contractDate.label}>
          <div className="relative">
            <input
              id="contract-start-date"
              type="date"
              value={contractDate}
              onChange={(event) => {
                setContractDate(event.target.value);
              }}
              autoComplete="off"
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
              aria-label="Open contract start date calendar"
              onClick={() => {
                const input = document.getElementById(
                  'contract-start-date',
                ) as HTMLInputElement | null;

                input?.showPicker?.();
                input?.focus();
              }}
              className="
                absolute
                right-[14px]
                top-1/2

                flex
                h-8
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
        </FormField>

        <div className="space-y-3 lg:space-y-4">
          <p
            className="
              font-inter
              text-[14px]
              font-normal
              leading-[20px]
              tracking-[0]
              text-[#535862]

              lg:text-[16px]
              lg:leading-5
            "
          >
            {information.overlapText}
          </p>

          <p
            className="
              font-inter
              text-[14px]
              font-normal
              leading-[20px]
              tracking-[0]
              text-[#535862]

              lg:text-[16px]
              lg:leading-5
            "
          >
            {information.endDateText}
          </p>
        </div>

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

            lg:min-h-[136px]
          "
        >
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

              lg:h-[17px]
              lg:w-[19px]
            "
          />

          <div className="min-w-0">
            <p
              className="
                font-inter
                text-[12px]
                font-bold
                leading-[18px]
                text-[#B54708]

                lg:text-[14px]
                lg:leading-5
              "
            >
              {warning.heading}
            </p>

            <p
              className="
                mt-1

                font-inter
                text-[12px]
                font-normal
                leading-[18px]
                text-[#B54708]

                lg:text-[15px]
                lg:leading-5
              "
            >
              {warning.description}
            </p>
          </div>
        </div>

        <CustomCheckbox
          checked={acknowledged}
          onChange={setAcknowledged}
        >
          {acknowledgement.text}
        </CustomCheckbox>
      </form>
    </div>
  );
}

/* =========================================================
   BROADBAND PROVIDER FORM
========================================================= */

type BroadbandProviderFormProps = {
  selectedProvider: string;
  onSelectProvider: (provider: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function BroadbandProviderForm({
  selectedProvider,
  onSelectProvider,
  onSubmit,
}: BroadbandProviderFormProps) {
  const { broadbandProvider } = data.journey;

  return (
    <div className="w-full">
      <header className="hidden lg:mb-7 lg:block">
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
          {broadbandProvider.heading}
        </h1>

        <p
          className="
            mt-1

            font-inter
            text-[16px]
            font-normal
            leading-[22px]

            text-[#667085]
          "
        >
          {broadbandProvider.description}
        </p>
      </header>

      <form
        id="journey-step-form-2"
        onSubmit={onSubmit}
        noValidate
      >
        <div
          className="
            grid
            grid-cols-1
            gap-2.5

            min-[390px]:gap-3

            sm:grid-cols-2
            sm:gap-3

            lg:grid-cols-2
            lg:gap-x-4
            lg:gap-y-3
          "
        >
          {broadbandProvider.providers.map((provider) => {
            const isSelected = selectedProvider === provider.value;

            return (
              <button
                key={provider.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  onSelectProvider(provider.value);
                }}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between

                  rounded-[12px]

                  border

                  bg-white

                  px-3
                  py-2.5

                  text-left

                  shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                  transition-all
                  duration-200

                  min-[390px]:rounded-[14px]

                  sm:min-h-[55px]
                  sm:px-4

                  lg:h-[61px]
                  lg:w-[243px]
                  lg:rounded-[16px]
                  lg:px-5
                  lg:py-5

                  ${
                    isSelected
                      ? `
                        border-[#00897B]
                        bg-[#E6F4F2]
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
                    flex
                    min-w-0
                    items-center
                    gap-2.5

                    lg:gap-4
                  "
                >
                  <Image
                    src={provider.icon}
                    alt={provider.iconAlt}
                    width={60}
                    height={60}
                    className="
                      h-[24px]
                      w-[24px]
                      shrink-0

                      object-contain

                      sm:h-[26px]
                      sm:w-[26px]

                      lg:h-[30px]
                      lg:w-[30px]
                    "
                  />

                  <span
                    className="
                      truncate

                      font-inter
                      text-[12px]
                      font-medium
                      leading-[18px]

                      text-[#0C3354]

                      sm:text-[13px]

                      lg:text-[14px]
                      lg:leading-5
                    "
                  >
                    {provider.label}
                  </span>
                </span>

                <span
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

                    lg:h-5
                    lg:w-5

                    ${
                      isSelected
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
                  {isSelected && (
                    <Check
                      aria-hidden="true"
                      className="
                        h-[11px]
                        w-[11px]

                        text-white

                        lg:h-3
                        lg:w-3
                      "
                      strokeWidth={3}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   ENERGY HELPERS
========================================================= */

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="block">
      <label
        className="
          mb-1.5
          block

          font-inter
          text-[12px]
          font-medium
          leading-[18px]

          text-[#344054]

          sm:text-[13px]

          lg:mb-2
          lg:text-[14px]
          lg:leading-6
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
        flex
        w-full
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

            flex
            h-full
            w-full
            items-center
            justify-center

            overflow-hidden

            rounded-[4px]

            border

            transition-colors
            duration-150

            ${checked ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
          `}
        >
          <Check
            aria-hidden="true"
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
            strokeWidth={3}
          />
        </span>
      </span>

      <span
        className="
          min-w-0
          flex-1

          font-inter
          text-[14px]
          font-normal
          leading-[20px]

          text-[#535862]

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
