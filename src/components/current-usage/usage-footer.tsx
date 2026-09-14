'use client';

import { useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';

import {
  formatKwhValue,
  kwhForPeriod,
  periodUnitLabel,
} from '@/components/current-usage/current-usage-header';
import data from '@/data/content.json';

type UsageFooterProps = {
  period: 'monthly' | 'annual';
  energyUsage: {
    gas?: { isAvailable?: boolean; annualConsumptionKwh?: number };
    electricity?: { isAvailable?: boolean; annualConsumptionKwh?: number };
  } | null;
  onCompare: () => void;
  isComparing: boolean;
};

export default function UsageFooter({
  period,
  energyUsage,
  onCompare,
  isComparing,
}: UsageFooterProps) {
  const router = useRouter();

  const { footer } = data.currentUsage;

  const { amountLabel, periodLabel } = useMemo(() => {
    const electricityAnnual = energyUsage?.electricity?.isAvailable
      ? energyUsage.electricity.annualConsumptionKwh
      : 0;
    const gasAnnual = energyUsage?.gas?.isAvailable ? energyUsage.gas.annualConsumptionKwh : 0;

    const totalKwh = kwhForPeriod(electricityAnnual, period) + kwhForPeriod(gasAnnual, period);

    return {
      amountLabel: formatKwhValue(totalKwh, true),
      periodLabel: periodUnitLabel(period),
    };
  }, [energyUsage, period]);

  return (
    <footer
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50

        w-full

        border-t
        border-[#EAECF0]

        bg-white
      "
    >
      {/* =====================================================
          MOBILE ONLY
      ====================================================== */}
      <div className="w-full px-5 md:hidden">
        {/* Estimated cost row */}
        <div
          className="
            flex h-[54px]
            w-full
            items-center
            justify-between

            border-b
            border-[#EAECF0]
          "
        >
          <p
            className="
              font-inter
              text-[14px]
              font-normal
              leading-5
              text-[#667085]
            "
          >
            {footer.estimatedCostLabel}
          </p>

          <p
            className="
              font-red-hat-display
              text-[16px]
              font-extrabold
              leading-6
              text-[#101828]
            "
          >
            {amountLabel} {periodLabel}
          </p>
        </div>

        {/* Buttons row */}
        <div
          className="
            flex h-[72px]
            w-full
            items-center
            justify-between
            gap-3
          "
        >
          {/* Circular Back button */}
          <button
            type="button"
            onClick={() => {
              router.back();
            }}
            aria-label={footer.backButton}
            className="
              inline-flex h-[48px]
              w-[48px]
              shrink-0
              items-center
              justify-center

              rounded-full

              border
              border-[#D0D5DD]

              bg-white

              text-[#0C3354]

              shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

              transition-colors

              hover:bg-[#F9FAFB]
            "
          >
            <ChevronLeft
              aria-hidden="true"
              className="
                h-[18px]
                w-[18px]
                shrink-0
              "
              strokeWidth={1.8}
            />
          </button>

          {/* Compare */}
          <button
            type="button"
            onClick={onCompare}
            disabled={isComparing}
            aria-busy={isComparing}
            className="
              ml-auto
              inline-flex h-11
              shrink-0
              items-center
              justify-center
              gap-2

              whitespace-nowrap

              rounded-[100px]

              bg-[#00897B]

              px-3

              font-red-hat-display
              text-[16px]
              font-bold
              leading-none
              text-white

              shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]

              transition-colors

              hover:bg-[#00796D]

              disabled:cursor-not-allowed
              disabled:opacity-60

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#B7E6DF]

              min-[390px]:px-4
            "
          >
            {footer.compareButton}

            {isComparing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  shrink-0
                "
                strokeWidth={2}
              />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          TABLET / DESKTOP
      ====================================================== */}
      <div
        className="
          mx-auto
          hidden
          h-[64px]
          w-full
          max-w-[1440px]
          items-center
          gap-3

          px-6

          md:flex

          lg:h-[78px]
          lg:px-8
          lg:py-0
        "
      >
        {/* Back */}
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className="
            inline-flex h-11
            min-w-[92px]
            shrink-0
            items-center
            justify-center
            gap-1

            rounded-[100px]

            border
            border-[#D0D5DD]

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
            lg:w-[106px]
            lg:px-5
            lg:text-[16px]
            lg:font-extrabold
            lg:leading-[26px]
          "
        >
          <ChevronLeft
            aria-hidden="true"
            className="
              h-[13px]
              w-[15px]
              shrink-0
            "
            strokeWidth={1.5}
          />

          {footer.backButton}
        </button>

        {/* Estimated cost */}
        <div
          className="
            ml-auto
            text-right
          "
        >
          <p
            className="
              font-inter
              text-[10px]
              font-normal
              leading-4
              text-[#667085]

              lg:text-[12px]
            "
          >
            {footer.estimatedCostLabel}
          </p>

          <p
            className="
              font-red-hat-display
              text-[14px]
              font-extrabold
              leading-5
              text-[#101828]

              lg:text-[16px]
              lg:leading-6
            "
          >
            {amountLabel} {periodLabel}
          </p>
        </div>

        {/* Compare */}
        <button
          type="button"
          onClick={onCompare}
          disabled={isComparing}
          aria-busy={isComparing}
          className="
            ml-3
            inline-flex h-12
            min-w-[210px]
            shrink-0
            items-center
            justify-center
            gap-2

            whitespace-nowrap

            rounded-[100px]

            bg-[#00897B]

            px-5

            font-red-hat-display
            text-[16px]
            font-bold
            leading-none
            text-white

            shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]

            transition-colors

            hover:bg-[#00796D]

            disabled:cursor-not-allowed
            disabled:opacity-60

            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-[#B7E6DF]

            lg:h-[50px]
            lg:w-[247px]
            lg:px-6
            lg:text-[16px]
            lg:font-extrabold
          "
        >
          {footer.compareButton}

          {isComparing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight
              aria-hidden="true"
              className="
                h-4
                w-4
                shrink-0

                lg:h-[18px]
                lg:w-[18px]
              "
              strokeWidth={2}
            />
          )}
        </button>
      </div>
    </footer>
  );
}
