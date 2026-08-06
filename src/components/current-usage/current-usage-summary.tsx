import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import data from '@/data/content.json';

export default function CurrentUsageSummary() {
  const { summary } = data.currentUsage;

  return (
    <section
      className="
        relative min-h-[250px]
        overflow-hidden rounded-[16px]
        border border-[#EAECF0]
        bg-white p-5

        sm:min-h-[280px]
        sm:p-6

        lg:min-h-[298px]
        lg:px-7
        lg:py-6
      "
    >
      <div className="relative z-10 max-w-[590px]">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span
            className="
              font-red-hat-display
              text-[35px] font-[800]
              leading-[44px] tracking-[0]
              text-[#1D2939]

              sm:text-[40px]
              sm:leading-[54px]

              lg:text-[46px]
              lg:leading-[66.94px]
            "
          >
            {summary.amount}
          </span>

          <span
            className="
              font-red-hat-display
              text-[13px] font-medium
              leading-5 text-[#667085]

              sm:text-[14px]

              lg:text-[16px]
              lg:leading-[29.89px]
            "
          >
            {summary.period}
          </span>
        </div>

        <p
          className="
            font-red-hat-display
            text-[15px] font-medium
            leading-[22px] tracking-[0]
            text-[#1D2939]

            sm:text-[17px]
            sm:leading-[25px]

            lg:text-[20px]
            lg:leading-[29.89px]
          "
        >
          {summary.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="
              inline-flex h-5 min-w-[95px]
              items-center justify-center
              rounded-[100px]
              bg-[#F5F5F4]
              px-2 py-0.5

              font-red-hat-display
              text-[10px] font-extrabold
              leading-4 text-[#0B4A6F]

              sm:text-[11px]
              lg:text-[12px]
            "
          >
            {summary.totalUsage}
          </span>

          <span
            className="
              inline-flex h-5 min-w-[118px]
              items-center justify-center
              gap-0.5 rounded-[100px]
              bg-[#FFF7ED]
              py-0.5 pl-[3px] pr-[5px]

              font-red-hat-display
              text-[10px] font-extrabold
              leading-4 text-[#DC6803]

              sm:text-[11px]
              lg:text-[12px]
            "
          >
            <Image
              src={summary.serviceIcon}
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="
                h-4 w-4 shrink-0
                rounded-full object-contain
              "
            />

            {summary.serviceLabel}
          </span>
        </div>

        <div
          className="
            mt-5 flex flex-col gap-3

            sm:flex-row
            sm:flex-nowrap

            lg:mt-6
          "
        >
          <Link
            href="/result"
            className="
    inline-flex h-12 w-full
    shrink-0 items-center
    justify-center gap-2
    whitespace-nowrap
    rounded-[100px]
    bg-[#00897B]
    px-5 py-3

    font-red-hat-display
    text-[14px] font-extrabold
    leading-none text-white

    shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
    transition-colors

    hover:bg-[#00796D]

    focus-visible:outline-none
    focus-visible:ring-4
    focus-visible:ring-[#B7E6DF]

    sm:w-[225px]
    sm:min-w-[225px]

    lg:h-[50px]
    lg:w-[247px]
    lg:min-w-[247px]
    lg:px-6
    lg:text-[16px]
  "
          >
            <span className="whitespace-nowrap">{summary.compareButton}</span>

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

          <button
            type="button"
            className="
              inline-flex h-12 w-full
              shrink-0 items-center
              justify-center
              whitespace-nowrap
              rounded-[100px]
              border border-[#D0D5DD]
              bg-white px-4 py-3

              font-red-hat-display
              text-[13px] font-extrabold
              leading-6 text-[#0C3354]

              transition-colors

              hover:bg-[#F9FAFB]

              sm:w-[225px]
              sm:min-w-[225px]

              lg:h-[52px]
              lg:w-[243px]
              lg:min-w-[243px]
              lg:px-5
              lg:text-[16px]
              lg:leading-[26px]
            "
          >
            {summary.updateButton}
          </button>
        </div>
      </div>

      <Image
        src={summary.mascot.src}
        alt={summary.mascot.alt}
        width={280}
        height={360}
        priority
        className="
          pointer-events-none
          absolute right-[-10px] top-3
          hidden h-[330px] w-[255px]
          object-contain object-top

          md:block

          lg:top-[20px]
          lg:right-[-12px]
          lg:h-[360px]
          lg:w-[280px]
        "
      />
    </section>
  );
}
