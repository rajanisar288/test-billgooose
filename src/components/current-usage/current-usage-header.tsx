'use client';

import { useState } from 'react';

import data from '@/data/content.json';

export default function CurrentUsageHeader() {
  const { header } = data.currentUsage;

  const [selectedPeriod, setSelectedPeriod] = useState(header.periods.defaultValue);

  return (
    <div
      className="
        flex flex-col gap-4

        sm:flex-row
        sm:items-start
        sm:justify-between
      "
    >
      <div className="min-w-0">
        <h1
          className="
            font-red-hat-display
            text-[27px] font-extrabold
            leading-[36px] tracking-[0]
            text-[#0C3354]

            sm:text-[30px]
            sm:leading-[44px]

            lg:text-[34px]
            lg:leading-[56px]
          "
        >
          {header.heading}
        </h1>

        <p
          className="
            mt-0.5 max-w-[680px]
            font-red-hat-display
            text-[13px] font-medium
            leading-[19px] tracking-[0]
            text-[#667085]

            sm:text-[15px]
            sm:leading-[22px]

            lg:text-[18px]
            lg:leading-[25px]
          "
        >
          {header.description}
        </p>
      </div>

      <div
        className="
          inline-flex h-10 w-fit shrink-0
          items-center rounded-[12px]
          bg-[#F3F4F6] p-1

          lg:h-11
          lg:w-[184px]
          lg:rounded-[14px]
        "
      >
        {header.periods.options.map((period, index) => {
          const isSelected = selectedPeriod === period.value;

          return (
            <button
              key={period.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedPeriod(period.value);
              }}
              className={`
                inline-flex h-8 items-center
                justify-center rounded-[9px]
                px-3

                font-red-hat-display
                text-[13px] leading-5
                transition-all

                lg:h-9
                lg:rounded-[10px]
                lg:px-4
                lg:text-[16px]
                lg:leading-6

                ${index === 0 ? 'lg:w-[94px]' : 'lg:w-[82px]'}

                ${
                  isSelected
                    ? 'bg-white font-extrabold text-[#101828] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]'
                    : 'bg-transparent font-medium text-[#6A7282]'
                }
              `}
            >
              {period.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
