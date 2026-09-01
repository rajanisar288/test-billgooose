'use client';

import { useState } from 'react';

import { ChevronDown, SlidersHorizontal } from 'lucide-react';

import data from '@/data/content.json';

export default function ResultsStatus() {
  const { resultsStatus } = data.resultPage;

  const [selectedPlanTab, setSelectedPlanTab] = useState(resultsStatus.planTabs.defaultValue);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      {/* =====================================================
          MOBILE + TABLET ONLY

          Desktop Results Summary now lives in ResultPlans.
      ====================================================== */}
      <section
        className="
          mx-auto
          w-full
          max-w-[1096px]

          px-4
          pb-4
          pt-5

          min-[390px]:px-5

          sm:px-6
          sm:pb-5
          sm:pt-6

          md:px-8

          lg:hidden
        "
      >
        {/* =================================================
            HEADING
        ================================================== */}
        <div
          className="
            flex
            items-start
            justify-between

            gap-4
          "
        >
          <div className="min-w-0">
            <h2
              className="
                font-red-hat-display
                text-[18px]
                font-extrabold
                leading-6
                text-[#101828]

                sm:text-[20px]
                sm:leading-7
              "
            >
              {resultsStatus.heading}
            </h2>

            <p
              className="
                mt-1

                font-inter
                text-[11px]
                font-normal
                leading-[17px]
                text-[#667085]

                sm:text-[12px]
                sm:leading-[18px]
              "
            >
              <strong className="font-normal">{resultsStatus.descriptionStart}</strong>{' '}
              {resultsStatus.descriptionRest}
            </p>
          </div>

          {/* FILTER BUTTON */}
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen((current) => !current);
            }}
            className="
              inline-flex
              h-[38px]
              shrink-0

              items-center
              justify-center

              gap-1.5

              rounded-full

              border
              border-[#D0D5DD]

              bg-white

              px-3

              font-red-hat-display
              text-[11px]
              font-semibold
              text-[#344054]

              sm:h-[40px]
              sm:px-4
              sm:text-[12px]
            "
          >
            <SlidersHorizontal
              aria-hidden="true"
              className="
                h-4
                w-4
              "
              strokeWidth={1.8}
            />
            Filters
          </button>
        </div>

        {/* =================================================
            TABS + SORT
        ================================================== */}
        <div
          className="
            mt-4

            flex
            flex-wrap

            items-center
            justify-between

            gap-3
          "
        >
          {/* TABS */}
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            {resultsStatus.planTabs.options.map((option) => {
              const isSelected = selectedPlanTab === option.value;

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedPlanTab(option.value);
                  }}
                  className={`
                      inline-flex
                      h-[30px]

                      items-center
                      justify-center

                      rounded-[6px]

                      border

                      px-3

                      font-red-hat-display
                      text-[10px]

                      sm:text-[11px]

                      ${
                        isSelected
                          ? `
                            border-[#00897B]
                            bg-[#00897B]

                            font-extrabold
                            text-white
                          `
                          : `
                            border-[#EAECF0]
                            bg-white

                            font-medium
                            text-[#344054]
                          `
                      }
                    `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* SORT */}
          <button
            type="button"
            className="
              inline-flex
              h-[32px]

              items-center
              justify-between

              gap-2

              rounded-[6px]

              border
              border-[#D0D5DD]

              bg-white

              px-3

              font-inter
              text-[10px]
              font-normal

              text-[#667085]

              sm:text-[11px]
            "
          >
            Recommended
            <ChevronDown
              aria-hidden="true"
              className="
                h-3
                w-3
              "
            />
          </button>
        </div>

        {/* =================================================
            TEMPORARY MOBILE/TABLET FILTER AREA

            Keep your existing modal/drawer here if you
            already have one connected.
        ================================================== */}
        {isFilterOpen && (
          <div
            className="
              mt-4

              rounded-[12px]

              border
              border-[#EAECF0]

              bg-white

              p-4
            "
          >
            <p
              className="
                font-inter
                text-[12px]
                text-[#535862]
              "
            >
              Filter options
            </p>
          </div>
        )}
      </section>
    </>
  );
}
