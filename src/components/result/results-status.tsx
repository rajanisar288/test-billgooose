import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

import { useResultFilters } from '@/components/result/result-filter-context';
import ResultFilterSidebar from '@/components/result/result-filter-sidebar';
import data from '@/data/content.json';
import { BROADBAND_SORTS, MOBILE_SORTS } from '@/lib/stickee/verticals';

type ResultsStatusProps = {
  heading?: string;
  description?: string;
  resultCount?: number;
  isLoading?: boolean;
};

export default function ResultsStatus({
  heading,
  description,
  resultCount,
  isLoading = false,
}: ResultsStatusProps) {
  const { resultsStatus } = data.resultPage;
  const searchParams = useSearchParams();
  const service = searchParams.get('service');
  const isBroadband = service === 'broadband';
  const { stickeeFacets, sortKey, setSortKey } = useResultFilters();
  const sortOptions = isBroadband ? BROADBAND_SORTS : MOBILE_SORTS;

  const [selectedPlanTab, setSelectedPlanTab] = useState(resultsStatus.planTabs.defaultValue);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* =========================================================
     LOCK PAGE SCROLL WHILE FILTER DRAWER IS OPEN
  ========================================================= */

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterOpen]);

  return (
    <>
      {/* =====================================================
          MOBILE + TABLET ONLY

          Desktop Results Summary lives in ResultPlans.
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
              {heading ?? resultsStatus.heading}
            </h2>

            {!isLoading && (
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
                {description ? (
                  description
                ) : (
                  <>
                    <strong className="font-normal">
                      {resultCount ?? resultsStatus.descriptionStart}
                    </strong>{' '}
                    {resultsStatus.descriptionRest}
                  </>
                )}
              </p>
            )}
          </div>

          {/* =================================================
              FILTER BUTTON
          ================================================== */}
          <button
            type="button"
            aria-expanded={isFilterOpen}
            aria-controls="result-mobile-filters"
            onClick={() => {
              setIsFilterOpen(true);
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

              shadow-[0px_1px_2px_rgba(16,24,40,0.04)]

              sm:h-[40px]
              sm:px-4
              sm:text-[12px]
            "
          >
            <SlidersHorizontal
              aria-hidden="true"
              className="h-4 w-4"
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
          <div className="flex items-center gap-2">
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
          <div className="relative inline-flex items-center">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              aria-label="Sort deals"
              className="
                h-[32px]
                cursor-pointer
                appearance-none
                rounded-[6px]
                border
                border-[#D0D5DD]
                bg-white
                pl-3
                pr-7
                font-inter
                text-[10px]
                font-normal
                text-[#667085]
                outline-none
                focus:border-[#00897B]
                sm:text-[11px]
              "
            >
              {Object.entries(sortOptions).map(([key, cfg]) => (
                <option
                  key={key}
                  value={key}
                >
                  {cfg.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 h-3 w-3 text-[#667085]"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE + TABLET FILTER DRAWER
      ====================================================== */}
      {isFilterOpen && (
        <div
          id="result-mobile-filters"
          className="
            fixed
            inset-0
            z-[100]

            bg-[rgba(16,24,40,0.35)]

            lg:hidden
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsFilterOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="
              absolute
              bottom-0
              left-0
              right-0

              flex
              max-h-[88dvh]
              w-full
              flex-col

              overflow-hidden

              rounded-t-[20px]

              bg-white

              shadow-[0px_-8px_30px_rgba(16,24,40,0.12)]

              md:bottom-0
              md:left-auto
              md:right-0
              md:top-0

              md:h-full
              md:max-h-none
              md:w-[420px]

              md:rounded-none
              md:rounded-l-[20px]

              md:shadow-[-12px_0px_32px_rgba(16,24,40,0.12)]
            "
          >
            {/* DRAWER HEADER */}
            <div
              className="
                flex
                h-[58px]
                shrink-0

                items-center
                justify-between

                border-b
                border-[#EAECF0]

                bg-white

                px-4

                min-[390px]:px-5

                md:h-[64px]
                md:px-6
              "
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  aria-hidden="true"
                  className="
                    h-[18px]
                    w-[18px]

                    text-[#344054]
                  "
                  strokeWidth={1.8}
                />

                <h2
                  className="
                    font-red-hat-display

                    text-[16px]
                    font-extrabold
                    leading-6

                    text-[#101828]

                    md:text-[18px]
                  "
                >
                  Filters
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close filters"
                onClick={() => {
                  setIsFilterOpen(false);
                }}
                className="
                  flex
                  h-9
                  w-9

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-[#EAECF0]

                  bg-white

                  text-[#475467]

                  transition-colors

                  hover:bg-[#F9FAFB]
                "
              >
                <X
                  aria-hidden="true"
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {/* ACTUAL FILTERS */}
            <div
              className="
                min-h-0
                flex-1

                overflow-x-hidden
                overflow-y-auto

                bg-[#F9FAFB]

                p-4

                min-[390px]:p-5

                md:p-6
              "
            >
              <ResultFilterSidebar
                showBanner={false}
                mobilePanel
                facets={stickeeFacets}
                isBroadband={isBroadband}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
