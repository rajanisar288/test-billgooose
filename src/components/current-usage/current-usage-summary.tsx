'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import UpdateConsumptionModal, {
  type ConsumptionFormValues,
} from '@/components/journey/modal/update-consumption-modal';
import data from '@/data/content.json';

export default function CurrentUsageSummary() {
  const { summary } = data.currentUsage;

  const [isUpdateConsumptionOpen, setIsUpdateConsumptionOpen] = useState(false);

  const handleCloseUpdateConsumption = () => {
    setIsUpdateConsumptionOpen(false);
  };

  const handleConsumptionSubmit = (values: ConsumptionFormValues) => {
    sessionStorage.setItem('journeyConsumptionDetails', JSON.stringify(values));

    setIsUpdateConsumptionOpen(false);
  };

  return (
    <>
      <section
        className="
          relative
          min-h-[250px]
          overflow-hidden
          rounded-[16px]
          border
          border-[#EAECF0]
          bg-white
          p-5

          sm:min-h-[280px]
          sm:p-6

          md:h-[216px]
          md:min-h-[216px]
          md:w-full
          md:px-[26px]
          md:py-[19px]

          lg:h-[238px]
          lg:min-h-[248px]
          lg:w-[872px]
          lg:px-7
          lg:py-6
        "
      >
        {/* =====================================================
            CONTENT
        ====================================================== */}
        <div
          className="
            relative
            z-10
            max-w-[590px]

            md:max-w-[500px]

            lg:max-w-[590px]
          "
        >
          {/* Amount */}
          <div
            className="
              flex
              flex-wrap
              items-baseline
              gap-x-2
            "
          >
            <span
              className="
                font-red-hat-display
                text-[35px]
                font-[800]
                leading-[44px]
                tracking-[0]
                text-[#1D2939]

                sm:text-[40px]
                sm:leading-[54px]

                md:text-[42px]
                md:leading-[48px]

                lg:text-[46px]
                lg:leading-[66.94px]
              "
            >
              {summary.amount}
            </span>

            <span
              className="
                font-red-hat-display
                text-[13px]
                font-medium
                leading-5
                text-[#667085]

                sm:text-[14px]

                md:text-[14px]
                md:leading-[20px]

                lg:text-[16px]
                lg:leading-[29.89px]
              "
            >
              {summary.period}
            </span>
          </div>

          {/* Description */}
          <p
            className="
              font-red-hat-display
              text-[18px]
              font-medium
              leading-[24px]
              tracking-[0]
              text-[#1D2939]

              sm:text-[18px]
              sm:leading-[24px]

              md:text-[18px]
              md:leading-[24px]

              lg:text-[20px]
              lg:leading-[29.89px]
            "
          >
            {summary.description}
          </p>

          {/* Badges */}
          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-2

              md:mt-[10px]
            "
          >
            <span
              className="
                inline-flex
                h-5
                min-w-[95px]
                items-center
                justify-center

                rounded-[100px]

                bg-[#F5F5F4]

                px-2
                py-0.5

                font-red-hat-display
                text-[12px]
                font-extrabold
                leading-4
                text-[#0B4A6F]
              "
            >
              {summary.totalUsage}
            </span>

            <span
              className="
                inline-flex
                h-5
                min-w-[118px]
                items-center
                justify-center
                gap-0.5

                rounded-[100px]

                bg-[#FFF7ED]

                py-0.5
                pl-[3px]
                pr-[5px]

                font-red-hat-display
                text-[12px]
                font-extrabold
                leading-4
                text-[#DC6803]
              "
            >
              <Image
                src={summary.serviceIcon}
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  shrink-0
                  rounded-full
                  object-contain
                "
              />

              {summary.serviceLabel}
            </span>
          </div>

          {/* =====================================================
              BUTTONS
          ====================================================== */}
          <div
            className="
              mt-5
              flex
              flex-col
              gap-3

              sm:flex-row
              sm:flex-nowrap

              md:mt-[18px]
              md:gap-[10px]

              lg:mt-6
              lg:gap-3
            "
          >
            {/* Compare - unchanged */}
            <Link
              href="/result"
              className="
                inline-flex
                h-12
                w-full
                shrink-0
                items-center
                justify-center
                gap-2

                whitespace-nowrap

                rounded-[100px]

                bg-[#00897B]

                px-5
                py-3

                font-red-hat-display
                text-[14px]
                font-bold
                leading-none
                text-white

                shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]

                transition-colors

                hover:bg-[#00796D]

                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-[#B7E6DF]

                sm:w-[225px]
                sm:min-w-[225px]

                md:h-[46px]
                md:w-[224px]
                md:min-w-[224px]
                md:px-5
                md:text-[15px]

                lg:h-[50px]
                lg:w-[247px]
                lg:min-w-[247px]
                lg:px-6
                lg:text-[16px]
                lg:font-extrabold
              "
            >
              {summary.compareButton}

              <ArrowRight
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  shrink-0

                  md:h-[17px]
                  md:w-[17px]

                  lg:h-[18px]
                  lg:w-[18px]
                "
                strokeWidth={2}
              />
            </Link>

            {/* Update consumption */}
            <button
              type="button"
              onClick={() => {
                setIsUpdateConsumptionOpen(true);
              }}
              className="
                inline-flex
                h-12
                w-full
                shrink-0
                items-center
                justify-center

                whitespace-nowrap

                rounded-[100px]

                border
                border-[#D0D5DD]

                bg-white

                px-4
                py-3

                font-red-hat-display
                text-[13px]
                font-bold
                leading-6
                text-[#0C3354]

                transition-colors

                hover:bg-[#F9FAFB]

                sm:w-[225px]
                sm:min-w-[225px]

                md:h-[46px]
                md:w-[218px]
                md:min-w-[218px]
                md:px-4
                md:text-[15px]
                md:leading-[22px]

                lg:h-[52px]
                lg:w-[243px]
                lg:min-w-[243px]
                lg:px-5
                lg:text-[16px]
                lg:font-extrabold
                lg:leading-[26px]
              "
            >
              {summary.updateButton}
            </button>
          </div>
        </div>

        {/* =====================================================
            TABLET MASCOT ONLY
        ====================================================== */}
        <div
          className="
            pointer-events-none

            absolute
            bottom-0
            right-0
            top-0

            hidden

            w-[205px]

            overflow-hidden

            md:block
            lg:hidden
          "
        >
          <Image
            src={summary.mascot.src}
            alt={summary.mascot.alt}
            fill
            priority
            sizes="205px"
            className="
              object-cover
              object-center
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              bottom-0
              left-0
              top-0

              w-[82px]

              bg-[linear-gradient(90deg,#FFFFFF_0%,rgba(255,255,255,0.82)_28%,rgba(255,255,255,0.38)_62%,rgba(255,255,255,0)_100%)]
            "
          />
        </div>

        {/* =====================================================
            DESKTOP MASCOT
        ====================================================== */}
        <div
          className="
            pointer-events-none

            absolute
            bottom-0
            right-0
            top-0

            hidden

            w-[286.042px]

            overflow-hidden

            lg:block
          "
        >
          <Image
            src={summary.mascot.src}
            alt={summary.mascot.alt}
            fill
            priority
            className="
              object-cover
              object-center
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              bottom-0
              left-0
              top-0

              h-[238px]
              w-[115.984px]

              bg-[linear-gradient(90deg,#FFFFFF_0%,rgba(255,255,255,0.8)_21.15%,rgba(255,255,255,0)_100%)]
            "
          />
        </div>
      </section>

      {/* Same existing Update Consumption modal */}
      <UpdateConsumptionModal
        isOpen={isUpdateConsumptionOpen}
        onClose={handleCloseUpdateConsumption}
        onSubmit={handleConsumptionSubmit}
      />
    </>
  );
}
