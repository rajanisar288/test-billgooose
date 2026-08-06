'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowRight, ChevronLeft } from 'lucide-react';

import data from '@/data/content.json';

export default function UsageFooter() {
  const router = useRouter();
  const { footer } = data.currentUsage;

  return (
    <footer
      className="
        fixed inset-x-0 bottom-0
        z-40 border-t border-[#EAECF0]
        bg-white
      "
    >
      <div
        className="
          mx-auto flex min-h-[78px]
          w-full max-w-[1440px]
          items-center gap-2
          px-4 py-3

          sm:gap-3
          sm:px-6

          lg:px-8
        "
      >
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className="
            inline-flex h-11 min-w-[82px]
            shrink-0 items-center
            justify-center gap-1
            rounded-[100px]
            border border-[#D0D5DD]
            bg-white px-4

            font-red-hat-display
            text-[14px] font-extrabold
            leading-6 text-[#0C3354]

            transition-colors

            hover:bg-[#F9FAFB]

            sm:min-w-[92px]

            lg:h-[52px]
            lg:w-[106px]
            lg:px-5
            lg:text-[16px]
            lg:leading-[26px]
          "
        >
          <ChevronLeft
            aria-hidden="true"
            className="
              h-[10px] w-[5px]
              shrink-0
            "
            strokeWidth={1.5}
          />

          {footer.backButton}
        </button>

        <div className="ml-auto hidden text-right sm:block">
          <p
            className="
              font-inter text-[10px]
              font-normal leading-4
              text-[#667085]

              lg:text-[12px]
            "
          >
            {footer.estimatedCostLabel}
          </p>

          <p
            className="
              font-red-hat-display
              text-[14px] font-extrabold
              leading-5 text-[#101828]

              lg:text-[16px]
              lg:leading-6
            "
          >
            {footer.estimatedCost}
          </p>
        </div>

        <Link
          href="/result"
          className="
    ml-auto inline-flex h-11
    shrink-0 items-center
    justify-center gap-2
    whitespace-nowrap
    rounded-[100px]
    bg-[#00897B]
    px-3

    font-red-hat-display
    text-[11px] font-extrabold
    leading-none text-white

    shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
    transition-colors

    hover:bg-[#00796D]

    focus-visible:outline-none
    focus-visible:ring-4
    focus-visible:ring-[#B7E6DF]

    min-[390px]:px-4
    min-[390px]:text-[12px]

    sm:ml-3
    sm:h-12
    sm:min-w-[210px]
    sm:px-5
    sm:text-[14px]

    lg:h-[50px]
    lg:w-[247px]
    lg:px-6
    lg:text-[16px]
  "
        >
          <span className="whitespace-nowrap">{footer.compareButton}</span>

          <ArrowRight
            aria-hidden="true"
            className="
      h-4 w-4 shrink-0

      lg:h-[18px]
      lg:w-[18px]
    "
            strokeWidth={2}
          />
        </Link>
      </div>
    </footer>
  );
}
