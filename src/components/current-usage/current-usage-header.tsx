'use client';

import data from '@/data/content.json';

export type UsagePeriod = 'monthly' | 'annual';

export function kwhForPeriod(annualKwh: number | null | undefined, period: UsagePeriod): number {
  if (!annualKwh || Number.isNaN(annualKwh)) return 0;

  return period === 'monthly' ? annualKwh / 12 : annualKwh;
}

const numberFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 0,
});

export function formatKwhValue(value: number, displayUnit?: boolean): string {
  return `${numberFormatter.format(Math.round(value))} ${displayUnit ? 'kWh' : ''}`;
}

export function formatKwh(value: number): string {
  return `${formatKwhValue(value, true)}`;
}

export function periodUnitLabel(period: UsagePeriod): string {
  return period === 'monthly' ? '/ month' : '/ year';
}

type CurrentUsageHeaderProps = {
  period: UsagePeriod;
  onPeriodChange: (period: UsagePeriod) => void;
};

export default function CurrentUsageHeader({ period, onPeriodChange }: CurrentUsageHeaderProps) {
  const { header } = data.currentUsage;

  return (
    <div
      className="
        flex
        flex-col
        gap-4

        lg:flex-row
        lg:items-start
        lg:justify-between
      "
    >
      <div className="min-w-0">
        <h1
          className="
            font-red-hat-display
            text-[20px]
            font-extrabold
            leading-[28px]
            tracking-[0]
            text-[#0C3354]

            md:text-[34px]
            md:leading-[44px]

            lg:text-[34px]
            lg:leading-[56px]
          "
        >
          {header.heading}
        </h1>

        <p
          className="
            mt-0.5
            max-w-[680px]

            font-red-hat-display
            text-[14px]
            font-medium
            leading-[20px]
            tracking-[0]
            text-[#667085]

            md:text-[15px]
            md:leading-[22px]

            lg:text-[18px]
            lg:leading-[25px]
          "
        >
          {header.description}
        </p>
      </div>

      {/* Monthly / Annual */}
      <div
        className="
          inline-flex
          h-10
          w-fit
          shrink-0
          items-center

          rounded-[12px]

          bg-[#F3F4F6]

          p-1

          md:mt-1

          lg:mt-0
          lg:h-11
          lg:w-[184px]
          lg:rounded-[14px]
        "
      >
        {header.periods.options.map((periodOption, index) => {
          const isSelected = period === periodOption.value;

          return (
            <button
              key={periodOption.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                onPeriodChange(periodOption.value as UsagePeriod);
              }}
              className={`
                  inline-flex
                  h-8
                  items-center
                  justify-center

                  rounded-[9px]

                  px-3

                  font-red-hat-display
                  text-[13px]
                  font-bold
                  leading-5

                  transition-all

                  md:text-[14px]

                  lg:h-9
                  lg:rounded-[10px]
                  lg:px-4
                  lg:text-[16px]
                  lg:leading-6

                  ${index === 0 ? 'lg:w-[94px]' : 'lg:w-[82px]'}

                  ${
                    isSelected
                      ? 'bg-white font-extrabold text-[#101828] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]'
                      : 'bg-transparent font-bold text-[#6A7282] lg:font-medium'
                  }
                `}
            >
              {periodOption.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
