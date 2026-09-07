'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { formatKwhValue, kwhForPeriod } from '@/components/current-usage/current-usage-header';
import UpdateConsumptionModal, {
  type ConsumptionFormValues,
} from '@/components/journey/modal/update-consumption-modal';

type UsageCardProps = {
  title: string;
  address: string;
  unit: string;

  /**
   * Price is not currently returned by the API. Kept as a prop so the
   * caller/content.json shape doesn't need to change, but it is not
   * rendered right now - see the commented-out block below.
   */
  price: string;

  buttonLabel: string;
  icon: string;
  iconAlt: string;
  borderColor: string;
  period: UsagePeriod;

  /**
   * Keeps the existing behavior for buttons such as
   * "Compare energy prices".
   */
  onButtonClick?: () => void;
};

export default function UsageCard({
  title,
  address,
  unit,
  buttonLabel,
  icon,
  iconAlt,
  period,
  onButtonClick,
}: UsageCardProps) {
  const [isUpdateConsumptionOpen, setIsUpdateConsumptionOpen] = useState(false);
  const energyUsage = localStorage.getItem('energyUsage')
    ? JSON.parse(localStorage.getItem('energyUsage') || '{}')
    : null;

  const isGas = title.toLowerCase().includes('gas');

  const isUpdateConsumptionButton = buttonLabel.toLowerCase().includes('update');

  // Pick the matching fuel out of the energyUsage response cached in
  // localStorage, and derive the figure for the selected Monthly/Annual
  // period. This card only ever renders when the parent has confirmed
  // this fuel is available, so there's no static fallback here.
  const displayedUsage = useMemo(() => {
    const fuel = isGas ? energyUsage?.gas : energyUsage?.electricity;

    return formatKwhValue(kwhForPeriod(fuel?.annualConsumptionKwh, period), false);
  }, [energyUsage, isGas, period]);

  const cardBackground = isGas
    ? `
      linear-gradient(
        180deg,
        rgba(220, 104, 3, 0.2) -150.63%,
        rgba(220, 104, 3, 0) 100%
      ) padding-box,
      linear-gradient(
        0deg,
        #FFFFFF,
        #FFFFFF
      ) padding-box,
      linear-gradient(
        180deg,
        #DC6803 -91.56%,
        rgba(220, 104, 3, 0) 162.3%
      ) border-box
    `
    : `
      linear-gradient(
        180deg,
        rgba(4, 92, 158, 0.2) -150.63%,
        rgba(4, 92, 158, 0) 100%
      ) padding-box,
      linear-gradient(
        0deg,
        #FFFFFF,
        #FFFFFF
      ) padding-box,
      linear-gradient(
        180deg,
        #105089 -91.56%,
        rgba(16, 80, 137, 0) 162.3%
      ) border-box
    `;

  const handleButtonClick = () => {
    /**
     * Gas/Electricity "Update consumption" button:
     * open the existing UpdateConsumptionModal.
     */
    if (isUpdateConsumptionButton) {
      setIsUpdateConsumptionOpen(true);

      return;
    }

    /**
     * IMPORTANT:
     * Do not change existing behavior for
     * "Compare energy prices" or any other button.
     */
    onButtonClick?.();
  };

  const handleCloseUpdateConsumption = () => {
    setIsUpdateConsumptionOpen(false);
  };

  const handleConsumptionSubmit = (values: ConsumptionFormValues) => {
    /**
     * Store the newly entered consumption details.
     *
     * We DO NOT navigate anywhere here because the
     * user is already on the Current Usage/Summary page.
     */
    sessionStorage.setItem('journeyConsumptionDetails', JSON.stringify(values));

    setIsUpdateConsumptionOpen(false);
  };

  return (
    <>
      <section
        style={{
          background: cardBackground,
          border: '1px solid transparent',
        }}
        className="
          flex min-h-[194px]
          w-full flex-col
          rounded-[16px]
          p-4

          sm:min-h-[204px]
          sm:p-5

          lg:h-[212px]
          lg:min-h-[212px]
          lg:w-[424px]
          lg:max-w-full
          lg:p-5
        "
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Image
            src={icon}
            alt={iconAlt}
            width={40}
            height={40}
            aria-hidden={!iconAlt}
            className="
              h-9 w-9
              shrink-0
              object-contain

              sm:h-10
              sm:w-10
            "
          />

          <div className="min-w-0 flex-1">
            <h2
              className="
                font-red-hat-display
                text-[14px]
                font-extrabold
                leading-none
                text-[#101828]

                sm:text-[15px]

                lg:text-[16px]
              "
            >
              {title}
            </h2>

            {/* <p
              className="
                mt-1.5
                truncate

                font-red-hat-display
                text-[11px]
                font-medium
                leading-none
                text-[#667085]

                sm:text-[12px]

                lg:text-[14px]
              "
            >
              {address}
            </p> */}
          </div>
        </div>

        {/* Usage / Price */}
        <div
          className="
            mt-4
            flex items-end
            justify-between
            gap-3

            lg:mt-[14px]
          "
        >
          <div className="flex items-baseline gap-1">
            <span
              className="
                font-red-hat-display
                text-[32px]
                font-[800]
                leading-[38px]
                text-[#0C3354]

                sm:text-[32px]
                sm:leading-[38px]

                lg:text-[32px]
                lg:leading-[38px]
              "
            >
              {displayedUsage}
            </span>

            <span
              className="
                font-red-hat-display
                text-[12px]
                font-medium
                leading-5
                text-[#667085]

                lg:text-[16px]
                lg:leading-6
              "
            >
              {unit}
            </span>
          </div>

          {/*
            Price is not currently returned by the API - hidden until
            pricing data is wired up.

            <span
              className="
                shrink-0

                font-red-hat-display
                text-[20px]
                font-medium
                leading-[30px]
                text-[#667085]

                sm:text-[20px]

                lg:text-[20px]
                lg:leading-[30px]
              "
            >
              {price}
            </span>
          */}
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="
            mt-auto
            inline-flex h-11
            w-full
            shrink-0
            items-center
            justify-center

            whitespace-nowrap
            rounded-[100px]

            border border-[#D0D5DD]
            bg-white

            px-4

            font-red-hat-display
            text-[16px]
            font-bold
            leading-6
            text-[#0C3354]

            transition-colors

            hover:bg-[#F9FAFB]

            lg:h-[52px]
            lg:w-[382px]
            lg:max-w-full
            lg:px-6
            lg:text-[16px]
            lg:font-extrabold
            lg:leading-[26px]
          "
        >
          {buttonLabel}
        </button>
      </section>

      {/* Existing Update Consumption modal */}
      <UpdateConsumptionModal
        isOpen={isUpdateConsumptionOpen}
        onClose={handleCloseUpdateConsumption}
        onSubmit={handleConsumptionSubmit}
      />
    </>
  );
}
