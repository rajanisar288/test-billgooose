'use client';

import { type FormEvent, useCallback, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Check } from 'lucide-react';

import data from '@/data/content.json';

import GasWarningModal from '../modal/gas-warning-modal';
import ServicesModal from '../modal/services-modal';
import UpdateConsumptionModal, {
  type ConsumptionFormValues,
} from '../modal/update-consumption-modal';

export default function PaymentMethodForm() {
  const router = useRouter();

  const { paymentMethod } = data.journey;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod.defaultValue);

  const [servicesModalOpen, setServicesModalOpen] = useState(false);

  const [gasWarningModalOpen, setGasWarningModalOpen] = useState(false);

  const [updateConsumptionModalOpen, setUpdateConsumptionModalOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedPaymentMethod) {
      return;
    }

    sessionStorage.setItem(paymentMethod.storageKey, selectedPaymentMethod);

    setServicesModalOpen(true);
  }

  function handleServiceSelect(service: string) {
    sessionStorage.setItem('journeySelectedService', service);

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

    router.push('/current-usage');
  }

  return (
    <>
      <div className="w-full">
        {/* Desktop heading only */}
        <header
          className="
            hidden

            lg:mb-9
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

        <form
          id="journey-step-form-4"
          onSubmit={handleSubmit}
          className="
            space-y-3

            sm:space-y-4
          "
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
                    flex min-h-[128px]
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
                {/* Icon and selection */}
                <div
                  className="
                      flex w-full
                      items-start
                      justify-between
                      gap-4
                    "
                >
                  {/* Mobile icon */}
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

                  {/* Desktop icon */}
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

                {/* Card content */}
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

type SelectionCircleProps = {
  selected: boolean;
};

function SelectionCircle({ selected }: SelectionCircleProps) {
  return (
    <span
      aria-hidden="true"
      className={`
        flex h-[18px]
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
