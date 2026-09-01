'use client';

import { type FormEvent, useCallback, useState, useSyncExternalStore } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Check } from 'lucide-react';

import data from '@/data/content.json';

import GasWarningModal from '../modal/gas-warning-modal';
import ServicesModal from '../modal/services-modal';
import UpdateConsumptionModal, {
  type ConsumptionFormValues,
} from '../modal/update-consumption-modal';

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

  window.addEventListener('billgoose-compare-flow-changed', callback);

  return () => {
    window.removeEventListener('storage', handleStorage);

    window.removeEventListener('billgoose-compare-flow-changed', callback);
  };
}

export default function PaymentMethodForm() {
  const router = useRouter();

  const { paymentMethod, broadbandContractLength } = data.journey;

  const service = useSyncExternalStore(
    subscribeToJourneyService,
    getJourneyServiceSnapshot,
    getJourneyServiceServerSnapshot,
  );

  /* =========================================================
     ENERGY STATE
  ========================================================= */

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod.defaultValue);

  const [servicesModalOpen, setServicesModalOpen] = useState(false);

  const [gasWarningModalOpen, setGasWarningModalOpen] = useState(false);

  const [updateConsumptionModalOpen, setUpdateConsumptionModalOpen] = useState(false);

  /* =========================================================
     BROADBAND STATE
  ========================================================= */

  const [selectedContractLength, setSelectedContractLength] = useState(
    broadbandContractLength.defaultValue,
  );

  /* =========================================================
     SUBMIT
  ========================================================= */

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /* =====================================================
       BROADBAND — STEP 4
    ====================================================== */

    if (service === 'broadband') {
      if (!selectedContractLength) {
        return;
      }

      sessionStorage.setItem(broadbandContractLength.storageKey, selectedContractLength);

      router.push('/result?service=broadband');

      return;
    }

    /* =====================================================
       ENERGY — STEP 5
    ====================================================== */

    if (!selectedPaymentMethod) {
      return;
    }

    sessionStorage.setItem(paymentMethod.storageKey, selectedPaymentMethod);

    /*
     * Energy does NOT go directly to result.
     * Open the existing modal journey first.
     */
    setServicesModalOpen(true);
  }

  /* =========================================================
     ENERGY MODAL FLOW
  ========================================================= */

  function handleServiceSelect(selectedService: string) {
    sessionStorage.setItem('journeySelectedService', selectedService);

    setServicesModalOpen(false);

    setGasWarningModalOpen(true);
  }

  const handleCloseServicesModal = useCallback(() => {
    setServicesModalOpen(false);
  }, []);

  const handleCloseGasWarningModal = useCallback(() => {
    setGasWarningModalOpen(false);
  }, []);

  const handleCloseUpdateConsumptionModal = useCallback(() => {
    setUpdateConsumptionModalOpen(false);
  }, []);

  function openUpdateConsumptionModal() {
    setGasWarningModalOpen(false);

    setUpdateConsumptionModalOpen(true);
  }

  function handleUpdateGasConsumption() {
    openUpdateConsumptionModal();
  }

  function handleElectricityOnly() {
    sessionStorage.setItem('journeySelectedService', 'electricity-only');

    openUpdateConsumptionModal();
  }

  function handleConsumptionSubmit(values: ConsumptionFormValues) {
    sessionStorage.setItem('journeyConsumptionDetails', JSON.stringify(values));

    setUpdateConsumptionModalOpen(false);

    const journeyFlow = sessionStorage.getItem('billgooseJourneyFlow');

    /*
     * Preserve Bundle Bills context.
     */
    if (journeyFlow === 'bundle') {
      router.push('/current-usage?service=energy&flow=bundle');

      return;
    }

    router.push('/current-usage?service=energy');
  }

  /* =========================================================
     BROADBAND STEP 4
  ========================================================= */

  if (service === 'broadband') {
    return (
      <div className="w-full">
        {/* Desktop heading only */}
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
            {broadbandContractLength.heading}
          </h1>

          <p
            className="
              mt-1

              font-inter
              text-[16px]
              font-normal
              leading-[22px]
              tracking-[0]

              text-[#667085]
            "
          >
            {broadbandContractLength.description}
          </p>
        </header>

        <form
          id="journey-step-form-4"
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4"
        >
          <fieldset>
            <legend className="sr-only">{broadbandContractLength.heading}</legend>

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
              {broadbandContractLength.options.map((option) => {
                const isSelected = selectedContractLength === option.value;

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedContractLength(option.value);
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
     ENERGY — STEP 5 PAYMENT METHOD
  ========================================================= */

  return (
    <>
      <div className="w-full">
        <header className="hidden lg:mb-9 lg:block">
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
            {paymentMethod.heading}
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
            {paymentMethod.description}
          </p>
        </header>

        {/*
         * IMPORTANT:
         *
         * Energy is STEP 5.
         *
         * JourneyShell/footer submits:
         * journey-step-form-5
         *
         * Previously this incorrectly used:
         * journey-step-form-4
         */}
        <form
          id="journey-step-form-5"
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4"
        >
          {paymentMethod.options.map((option, index) => {
            const isSelected = selectedPaymentMethod === option.value;

            const mobileIcon = index === 0 ? '/images/step-4-1.png' : '/images/step-4-2.png';

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedPaymentMethod(option.value);
                }}
                className={`
                  flex
                  min-h-[128px]
                  w-full

                  flex-col
                  items-start
                  justify-between

                  gap-3

                  rounded-[14px]

                  bg-white

                  p-4

                  text-left

                  transition-colors
                  duration-200

                  sm:min-h-[140px]
                  sm:rounded-[16px]
                  sm:p-[18px]

                  lg:h-[157px]
                  lg:min-h-[157px]
                  lg:gap-4
                  lg:rounded-[16px]
                  lg:p-5

                  ${isSelected ? 'border-2 border-[#00897B]' : 'border border-[#D0D5DD]'}
                `}
              >
                <div
                  className="
                    flex
                    w-full

                    items-start
                    justify-between

                    gap-4
                  "
                >
                  <Image
                    src={mobileIcon}
                    alt={option.iconAlt}
                    width={22}
                    height={22}
                    aria-hidden="true"
                    className="
                      h-[22px]
                      w-[22px]
                      shrink-0

                      object-contain

                      lg:hidden
                    "
                  />

                  <Image
                    src={option.icon}
                    alt={option.iconAlt}
                    width={24}
                    height={24}
                    aria-hidden="true"
                    className="
                      hidden

                      lg:block
                      lg:h-6
                      lg:w-6
                      lg:shrink-0
                      lg:object-contain
                    "
                  />

                  <SelectionCircle selected={isSelected} />
                </div>

                <div className="min-w-0">
                  <h2
                    className="
                      font-red-hat-display

                      text-[18px]
                      font-bold
                      leading-[22px]
                      tracking-[0]

                      text-[#0D3B66]

                      sm:text-[18px]

                      lg:text-[18px]
                      lg:leading-none
                    "
                  >
                    {option.label}
                  </h2>

                  <p
                    className="
                      mt-2

                      font-inter
                      text-[15px]
                      font-normal
                      leading-[20px]
                      tracking-[0]

                      text-[#667085]

                      sm:text-[15px]
                      sm:leading-[20px]

                      lg:text-[14px]
                      lg:leading-[18px]
                    "
                  >
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </form>
      </div>

      {/* =====================================================
          ENERGY MODALS
      ====================================================== */}

      <ServicesModal
        isOpen={servicesModalOpen}
        onClose={handleCloseServicesModal}
        onSelect={handleServiceSelect}
      />

      <GasWarningModal
        isOpen={gasWarningModalOpen}
        onClose={handleCloseGasWarningModal}
        onUpdateGasConsumption={handleUpdateGasConsumption}
        onElectricityOnly={handleElectricityOnly}
      />

      <UpdateConsumptionModal
        isOpen={updateConsumptionModalOpen}
        onClose={handleCloseUpdateConsumptionModal}
        onSubmit={handleConsumptionSubmit}
      />
    </>
  );
}

/* =========================================================
   SHARED SELECTION CIRCLE
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

        ${selected ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
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
