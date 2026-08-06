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
        {/* Heading */}
        <header className="mb-7 sm:mb-8 lg:mb-9">
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
            {paymentMethod.heading}
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
            {paymentMethod.description}
          </p>
        </header>

        <form
          id="journey-step-form-4"
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4"
        >
          {paymentMethod.options.map((option) => {
            const isSelected = selectedPaymentMethod === option.value;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedPaymentMethod(option.value);
                }}
                className={`
                  flex min-h-[128px] w-full
                  flex-col items-start
                  justify-between gap-3
                  rounded-[14px]
                  bg-white p-4
                  text-left
                  transition-colors duration-200

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
                {/* Icon and selection indicator */}
                <div className="flex w-full items-start justify-between gap-4">
                  <Image
                    src={option.icon}
                    alt={option.iconAlt}
                    width={24}
                    height={24}
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

                {/* Card content */}
                <div className="min-w-0">
                  <h2
                    className="
                      font-red-hat-display
                      text-[15px] font-[550]
                      leading-none tracking-[0]
                      text-[#0D3B66]

                      sm:text-[16px]

                      lg:text-[18px]
                    "
                  >
                    {option.label}
                  </h2>

                  <p
                    className="
                      mt-2
                      font-inter text-[11px]
                      font-normal leading-[15px]
                      tracking-[0] text-[#667085]

                      sm:text-[12px]
                      sm:leading-4

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
        flex h-[18px] w-[18px]
        shrink-0 items-center justify-center
        rounded-full border
        transition-colors duration-200

        lg:h-5
        lg:w-5

        ${selected ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
      `}
    >
      <Check
        aria-hidden="true"
        strokeWidth={3}
        className={`
          h-3 w-3 shrink-0
          text-white
          transition-opacity duration-150

          lg:h-[13px]
          lg:w-[13px]

          ${selected ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </span>
  );
}
