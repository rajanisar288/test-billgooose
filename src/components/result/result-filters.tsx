'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';

import data from '@/data/content.json';

type PlanTabValue = string;
type PeriodTabValue = string;
type SortValue = string;

type MobileFilterValues = {
  yourPlans: string;
  planType: string;
  paymentMethod: string;
  rateType: string;
  features: string[];
};

const defaultMobileFilters: MobileFilterValues = {
  yourPlans: '',
  planType: 'Dual Fuel',
  paymentMethod: 'Monthly direct debit',
  rateType: 'Monthly direct debit',
  features: [],
};

const featureOptions = [
  'Green plans',
  'Points, rewards and extras',
  'Paper billing available',
  'Paper billing available',
  'Paper billing available',
];

export default function ResultsStatus() {
  const { resultsStatus } = data.resultPage;

  const [selectedPlanTab, setSelectedPlanTab] = useState<PlanTabValue>(
    resultsStatus.planTabs.defaultValue,
  );

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodTabValue>(
    resultsStatus.periodTabs.defaultValue,
  );

  const [selectedSort, setSelectedSort] = useState<SortValue>(resultsStatus.sort.defaultValue);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [mobileFilters, setMobileFilters] = useState<MobileFilterValues>(defaultMobileFilters);

  useEffect(() => {
    if (!isFilterModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFilterModalOpen]);

  const toggleFeature = (feature: string) => {
    setMobileFilters((previous) => {
      const alreadySelected = previous.features.includes(feature);

      return {
        ...previous,
        features: alreadySelected
          ? previous.features.filter((item) => item !== feature)
          : [...previous.features, feature],
      };
    });
  };

  const handleResetMobileFilters = () => {
    setMobileFilters(defaultMobileFilters);
  };

  const handleApplyMobileFilters = () => {
    console.log('Applied result filters:', mobileFilters);
    setIsFilterModalOpen(false);
  };

  return (
    <>
      <section
        className="
          relative z-10
          mx-auto mt-4
          w-full max-w-[1096px]
          px-4

          min-[390px]:px-5

          sm:mt-2
          sm:px-6

          md:mt-5
          md:px-8

          lg:mt-4
          lg:px-10

          xl:-mt-[28px]
          xl:px-0
        "
      >
        {/* =====================================================
            MOBILE ONLY
        ====================================================== */}
        <div className="md:hidden">
          <p
            className="
              mb-3

              font-red-hat-display
              text-[13px] font-medium
              leading-[19.5px]
              tracking-[0]
              text-[#667085]
            "
          >
            Comparing: <span className="font-semibold text-[#0C3354]">Energy</span>
          </p>

          <h2
            className="
              font-red-hat-display
              text-[18px] font-bold
              leading-[24px]
              tracking-[0]
              text-[#0C3354]

              sm:text-[19px]
            "
          >
            {resultsStatus.heading}
          </h2>

          <p
            className="
              mt-1.5
              max-w-[345px]

              font-inter
              text-[13px] font-normal
              leading-[18px]
              tracking-[0]
              text-[#667085]
            "
          >
            <strong className="font-normal text-[#667085]">{resultsStatus.descriptionStart}</strong>{' '}
            {resultsStatus.descriptionRest}
          </p>

          <div
            className="
              mt-4
              flex w-full
              items-center
              justify-between
              gap-3
            "
          >
            <div className="flex min-w-0 items-center gap-2">
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
                      inline-flex h-[30px]
                      shrink-0
                      items-center
                      justify-center

                      whitespace-nowrap
                      rounded-[6px]
                      px-3

                      font-red-hat-display
                      text-[12px]
                      leading-[18px]

                      transition-colors

                      ${
                        isSelected
                          ? `
                            border border-[#00897B]
                            bg-[#00897B]
                            font-bold
                            text-white
                          `
                          : `
                            border border-[#EAECF0]
                            bg-white
                            font-medium
                            text-[#101828]

                            hover:bg-[#F9FAFB]
                          `
                      }
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsFilterModalOpen(true);
              }}
              className="
                ml-auto
                inline-flex h-[30px]
                shrink-0
                items-center
                justify-center
                gap-[5px]

                rounded-[7px]

                border border-[#E0E2E6]
                bg-white

                px-2

                font-red-hat-display
                text-[12px] font-semibold
                leading-[18px]
                text-[#344054]

                shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]

                transition-colors

                hover:bg-[#F9FAFB]
              "
            >
              <SlidersHorizontal
                aria-hidden="true"
                className="
                  h-[14px] w-[14px]
                  shrink-0
                  text-[#667085]
                "
                strokeWidth={1.7}
              />
              Filters
            </button>
          </div>
        </div>

        {/* =====================================================
            TABLET ONLY
        ====================================================== */}
        <div
          className="
            hidden

            md:block
            lg:hidden
          "
        >
          <p
            className="
              mb-[10px]

              font-red-hat-display
              text-[14px] font-medium
              leading-5
              text-[#667085]
            "
          >
            Comparing: <span className="font-semibold text-[#0C3354]">Energy</span>
          </p>

          <h2
            className="
              font-red-hat-display
              text-[30px] font-extrabold
              leading-[36px]
              text-[#0C3354]
            "
          >
            {resultsStatus.heading}
          </h2>

          <p
            className="
              mt-1

              font-inter
              text-[14px] font-normal
              leading-5
              text-[#667085]
            "
          >
            <strong className="font-semibold text-[#101828]">
              {resultsStatus.descriptionStart}
            </strong>{' '}
            {resultsStatus.descriptionRest}
          </p>

          {/* Tablet controls row */}
          <div
            className="
              mt-6

              flex w-full
              items-center
              justify-between
              gap-5
            "
          >
            {/* All / Fixed / Variable */}
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
                      inline-flex h-[34px]
                      shrink-0
                      items-center
                      justify-center

                      whitespace-nowrap
                      rounded-[7px]
                      px-4

                      font-red-hat-display
                      text-[13px]
                      leading-5

                      transition-colors

                      ${
                        isSelected
                          ? `
                            border border-[#00897B]
                            bg-[#00897B]
                            font-bold
                            text-white
                          `
                          : `
                            border border-[#EAECF0]
                            bg-white
                            font-medium
                            text-[#101828]
                          `
                      }
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {/* Monthly / Annual / Filters */}
            <div
              className="
                ml-auto
                flex shrink-0
                items-center
                gap-4
              "
            >
              <PeriodToggle
                value={selectedPeriod}
                onChange={setSelectedPeriod}
              />

              <button
                type="button"
                onClick={() => {
                  setIsFilterModalOpen(true);
                }}
                className="
                  inline-flex h-[34px]
                  shrink-0
                  items-center
                  justify-center
                  gap-[6px]

                  rounded-[7px]

                  border border-[#D0D5DD]
                  bg-white

                  px-3

                  font-red-hat-display
                  text-[13px] font-semibold
                  leading-5
                  text-[#344054]

                  shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
                "
              >
                <SlidersHorizontal
                  aria-hidden="true"
                  className="
                    h-[15px] w-[15px]
                    shrink-0
                    text-[#667085]
                  "
                  strokeWidth={1.7}
                />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            DESKTOP ONLY
            Existing desktop layout
        ====================================================== */}
        <div
          className="
            hidden

            lg:flex
            lg:items-end
            lg:justify-between
            lg:gap-8
          "
        >
          <div className="min-w-0 flex-1">
            <h2
              className="
                font-red-hat-display
                text-[19px] font-bold
                leading-[24px]
                text-[#0C3354]

                xl:text-[20px]
                xl:leading-none
                xl:text-[#101828]
              "
            >
              {resultsStatus.heading}
            </h2>

            <p
              className="
                mt-1.5
                max-w-none

                font-inter
                text-[13px] font-normal
                leading-[18px]
                text-[#667085]

                xl:mt-2
                xl:text-[14px]
                xl:font-medium
                xl:leading-none
              "
            >
              <strong
                className="
                  font-normal
                  text-[#667085]

                  xl:font-extrabold
                  xl:text-[#101828]
                "
              >
                {resultsStatus.descriptionStart}
              </strong>{' '}
              {resultsStatus.descriptionRest}
            </p>

            <div
              className="
                mt-4
                flex flex-wrap
                items-center
                gap-2

                xl:mt-5
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
                      inline-flex h-[32px]
                      items-center
                      justify-center

                      whitespace-nowrap
                      rounded-[8px]
                      px-3

                      font-red-hat-display
                      text-[12px]
                      leading-5

                      transition-colors

                      xl:h-[33px]

                      ${
                        isSelected
                          ? 'border border-[#00897B] bg-[#00897B] font-extrabold text-white'
                          : 'border border-[#EAECF0] bg-white font-medium text-[#101828]'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Existing desktop sort + period */}
          <div
            className="
              flex shrink-0
              items-center
              gap-3
            "
          >
            <div className="flex items-center gap-2">
              <Image
                src={resultsStatus.sort.icon}
                alt={resultsStatus.sort.iconAlt}
                width={14}
                height={10}
                aria-hidden={!resultsStatus.sort.iconAlt}
                className="
                  h-[10px] w-[14px]
                  shrink-0 object-contain
                "
              />

              <span
                className="
                  font-inter
                  text-[12px] font-medium
                  text-[#1D2939]
                "
              >
                {resultsStatus.sort.label}
              </span>

              <SortDropdown
                value={selectedSort}
                onChange={setSelectedSort}
              />
            </div>

            <PeriodToggle
              value={selectedPeriod}
              onChange={setSelectedPeriod}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE FILTER MODAL
          UNCHANGED MOBILE STYLE
      ====================================================== */}
      {isFilterModalOpen && (
        <div
          className="
            fixed inset-0 z-[100]

            flex items-end
            justify-center

            bg-black/25

            px-[14px]
            pb-[8px]

            md:hidden
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsFilterModalOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="
              max-h-[calc(100dvh-24px)]
              w-full
              overflow-y-auto

              rounded-[14px]
              bg-white

              px-[18px]
              pb-4
              pt-[14px]

              shadow-[0px_20px_50px_rgba(16,24,40,0.18)]
            "
          >
            <FilterHeader
              onClose={() => {
                setIsFilterModalOpen(false);
              }}
            />

            <FilterBody
              filters={mobileFilters}
              setFilters={setMobileFilters}
              toggleFeature={toggleFeature}
            />

            <FilterActions
              onReset={handleResetMobileFilters}
              onApply={handleApplyMobileFilters}
            />
          </div>
        </div>
      )}

      {/* =====================================================
          TABLET FILTER MODAL
          Fixed header + fixed footer
      ====================================================== */}
      {isFilterModalOpen && (
        <div
          className="
            fixed inset-0 z-[100]

            hidden
            items-center
            justify-center

            bg-black/25

            p-5

            md:flex
            lg:hidden
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsFilterModalOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="
              flex
              h-[min(700px,calc(100dvh-40px))]
              w-full
              max-w-[620px]
              flex-col

              overflow-hidden

              rounded-[18px]

              bg-white

              shadow-[0px_24px_60px_rgba(16,24,40,0.22)]
            "
          >
            {/* Fixed tablet header */}
            <div
              className="
                flex h-[66px]
                shrink-0
                items-center
                justify-between

                border-b border-[#F2F4F7]

                bg-white

                px-7
              "
            >
              <h2
                className="
                  font-red-hat-display
                  text-[18px] font-extrabold
                  leading-6
                  text-[#0C3354]
                "
              >
                Filters
              </h2>

              <button
                type="button"
                onClick={() => {
                  setIsFilterModalOpen(false);
                }}
                aria-label="Close filters"
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  bg-[#F2F4F7]

                  text-[#667085]

                  transition-colors

                  hover:bg-[#EAECF0]
                "
              >
                <X
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Only this area scrolls */}
            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto

                px-7
                py-5
              "
            >
              <TabletFilterBody
                filters={mobileFilters}
                setFilters={setMobileFilters}
                toggleFeature={toggleFeature}
              />
            </div>

            {/* Fixed tablet footer */}
            <div
              className="
                flex h-[72px]
                shrink-0
                items-center
                gap-4

                border-t border-[#EAECF0]

                bg-white

                px-7
              "
            >
              <button
                type="button"
                onClick={handleResetMobileFilters}
                className="
                  inline-flex h-[42px]
                  flex-1
                  items-center
                  justify-center

                  rounded-full

                  border border-[#D0D5DD]
                  bg-white

                  font-red-hat-display
                  text-[14px] font-extrabold
                  leading-5
                  text-[#0C3354]

                  shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

                  transition-colors

                  hover:bg-[#F9FAFB]
                "
              >
                Reset all
              </button>

              <button
                type="button"
                onClick={handleApplyMobileFilters}
                className="
                  inline-flex h-[42px]
                  flex-1
                  items-center
                  justify-center

                  rounded-full

                  border border-[#00897B]
                  bg-[#00897B]

                  font-red-hat-display
                  text-[14px] font-extrabold
                  leading-5
                  text-white

                  transition-colors

                  hover:bg-[#00796D]
                "
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   MOBILE FILTER CONTENT
========================================================= */

type FilterBodyProps = {
  filters: MobileFilterValues;
  setFilters: React.Dispatch<React.SetStateAction<MobileFilterValues>>;
  toggleFeature: (feature: string) => void;
};

function FilterHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h2
        className="
          font-red-hat-display
          text-[14px] font-extrabold
          leading-5
          text-[#0C3354]
        "
      >
        Filters
      </h2>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close filters"
        className="
          flex h-6 w-6
          items-center
          justify-center

          rounded-full

          bg-[#F2F4F7]

          text-[#344054]
        "
      >
        <X
          aria-hidden="true"
          className="h-3.5 w-3.5"
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

function FilterBody({ filters, setFilters, toggleFeature }: FilterBodyProps) {
  return (
    <>
      <div className="mt-4">
        <h3
          className="
            font-red-hat-display
            text-[12px] font-semibold
            leading-5
            text-[#344054]
          "
        >
          Your plans
        </h3>

        <div className="mt-2 space-y-2">
          <RadioOption
            label="Only show plans BillGoose can help me switch to"
            checked={filters.yourPlans === 'billgoose'}
            onClick={() => {
              setFilters((previous) => ({
                ...previous,
                yourPlans: previous.yourPlans === 'billgoose' ? '' : 'billgoose',
              }));
            }}
          />

          <RadioOption
            label="Include plans that require switching directly through the supplier"
            checked={filters.yourPlans === 'supplier'}
            onClick={() => {
              setFilters((previous) => ({
                ...previous,
                yourPlans: previous.yourPlans === 'supplier' ? '' : 'supplier',
              }));
            }}
          />
        </div>
      </div>

      <div className="my-4 h-px bg-[#EAECF0]" />

      <MobileFilterSelect
        label="Plan type"
        value={filters.planType}
        options={['Dual Fuel', 'Electricity', 'Gas']}
        onChange={(value) => {
          setFilters((previous) => ({
            ...previous,
            planType: value,
          }));
        }}
      />

      <div className="mt-4">
        <MobileFilterSelect
          label="Payment method"
          value={filters.paymentMethod}
          options={[
            'Monthly direct debit',
            'Quarterly direct debit',
            'Pay on receipt',
            'Prepayment',
          ]}
          onChange={(value) => {
            setFilters((previous) => ({
              ...previous,
              paymentMethod: value,
            }));
          }}
        />
      </div>

      <div className="mt-4">
        <MobileFilterSelect
          label="Rate type"
          value={filters.rateType}
          options={['Monthly direct debit', 'Fixed', 'Variable']}
          onChange={(value) => {
            setFilters((previous) => ({
              ...previous,
              rateType: value,
            }));
          }}
        />
      </div>

      <div className="my-4 h-px bg-[#EAECF0]" />

      <div>
        <h3
          className="
            font-red-hat-display
            text-[12px] font-semibold
            leading-5
            text-[#344054]
          "
        >
          Plan features
        </h3>

        <div className="mt-2 space-y-2">
          {featureOptions.map((feature, index) => {
            const featureKey = `${feature}-${index}`;
            const checked = filters.features.includes(featureKey);

            return (
              <FeatureOption
                key={featureKey}
                label={feature}
                checked={checked}
                onClick={() => {
                  toggleFeature(featureKey);
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function FilterActions({ onReset, onApply }: { onReset: () => void; onApply: () => void }) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <button
        type="button"
        onClick={onReset}
        className="
          inline-flex h-[32px]
          flex-1
          items-center
          justify-center

          rounded-full

          border border-[#D0D5DD]
          bg-white

          font-red-hat-display
          text-[12px] font-extrabold
          leading-[18px]
          text-[#0C3354]
        "
      >
        Reset all
      </button>

      <button
        type="button"
        onClick={onApply}
        className="
          inline-flex h-[32px]
          flex-1
          items-center
          justify-center

          rounded-full

          border border-[#00897B]
          bg-[#00897B]

          font-red-hat-display
          text-[12px] font-extrabold
          leading-[18px]
          text-white
        "
      >
        Apply filters
      </button>
    </div>
  );
}

/* =========================================================
   TABLET FILTER CONTENT
========================================================= */

function TabletFilterBody({ filters, setFilters, toggleFeature }: FilterBodyProps) {
  return (
    <>
      {/* Your plans */}
      <div>
        <h3
          className="
            font-red-hat-display
            text-[14px] font-semibold
            leading-5
            text-[#344054]
          "
        >
          Your plans
        </h3>

        <div className="mt-3 space-y-3">
          <TabletRadioOption
            label="Only show plans BillGoose can help me switch to"
            checked={filters.yourPlans === 'billgoose'}
            onClick={() => {
              setFilters((previous) => ({
                ...previous,
                yourPlans: previous.yourPlans === 'billgoose' ? '' : 'billgoose',
              }));
            }}
          />

          <TabletRadioOption
            label="Include plans that require switching directly through the supplier"
            checked={filters.yourPlans === 'supplier'}
            onClick={() => {
              setFilters((previous) => ({
                ...previous,
                yourPlans: previous.yourPlans === 'supplier' ? '' : 'supplier',
              }));
            }}
          />
        </div>
      </div>

      <div className="my-5 h-px bg-[#EAECF0]" />

      <TabletFilterSelect
        label="Plan type"
        value={filters.planType}
        options={['Dual Fuel', 'Electricity', 'Gas']}
        onChange={(value) => {
          setFilters((previous) => ({
            ...previous,
            planType: value,
          }));
        }}
      />

      <div className="mt-4">
        <TabletFilterSelect
          label="Payment method"
          value={filters.paymentMethod}
          options={[
            'Monthly direct debit',
            'Quarterly direct debit',
            'Pay on receipt',
            'Prepayment',
          ]}
          onChange={(value) => {
            setFilters((previous) => ({
              ...previous,
              paymentMethod: value,
            }));
          }}
        />
      </div>

      <div className="mt-4">
        <TabletFilterSelect
          label="Rate type"
          value={filters.rateType}
          options={['Monthly direct debit', 'Fixed', 'Variable']}
          onChange={(value) => {
            setFilters((previous) => ({
              ...previous,
              rateType: value,
            }));
          }}
        />
      </div>

      <div className="my-5 h-px bg-[#EAECF0]" />

      {/* Features */}
      <div>
        <h3
          className="
            font-red-hat-display
            text-[14px] font-semibold
            leading-5
            text-[#344054]
          "
        >
          Plan features
        </h3>

        <div className="mt-3 space-y-3">
          {featureOptions.map((feature, index) => {
            const featureKey = `${feature}-${index}`;
            const checked = filters.features.includes(featureKey);

            return (
              <TabletFeatureOption
                key={featureKey}
                label={feature}
                checked={checked}
                onClick={() => {
                  toggleFeature(featureKey);
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

/* =========================================================
   RADIO OPTIONS
========================================================= */

type RadioOptionProps = {
  label: string;
  checked: boolean;
  onClick: () => void;
};

function RadioOption({ label, checked, onClick }: RadioOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full
        items-start
        gap-2
        text-left
      "
    >
      <span
        className={`
          mt-[2px]

          flex h-3.5 w-3.5
          shrink-0
          items-center
          justify-center

          rounded-full
          border

          ${checked ? 'border-[#00897B]' : 'border-[#D0D5DD]'}
        `}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-[#00897B]" />}
      </span>

      <span
        className="
          font-inter
          text-[10px] font-normal
          leading-[15px]
          text-[#667085]
        "
      >
        {label}
      </span>
    </button>
  );
}

function TabletRadioOption({ label, checked, onClick }: RadioOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full
        items-start
        gap-2.5
        text-left
      "
    >
      <span
        className={`
          mt-[2px]

          flex h-4 w-4
          shrink-0
          items-center
          justify-center

          rounded-full
          border

          ${checked ? 'border-[#00897B]' : 'border-[#D0D5DD]'}
        `}
      >
        {checked && <span className="h-[7px] w-[7px] rounded-full bg-[#00897B]" />}
      </span>

      <span
        className="
          font-inter
          text-[13px] font-normal
          leading-5
          text-[#667085]
        "
      >
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   FEATURE OPTIONS
========================================================= */

function FeatureOption({ label, checked, onClick }: RadioOptionProps) {
  return (
    <label
      className="
        flex cursor-pointer
        items-center
        gap-2
      "
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onClick}
        className={`
          flex h-3.5 w-3.5
          shrink-0
          items-center
          justify-center

          rounded-[3px]
          border

          ${checked ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
        `}
      >
        {checked && (
          <Check
            aria-hidden="true"
            className="h-2.5 w-2.5 text-white"
            strokeWidth={2.5}
          />
        )}
      </button>

      <span
        className="
          font-inter
          text-[11px] font-normal
          leading-4
          text-[#667085]
        "
      >
        {label}
      </span>
    </label>
  );
}

function TabletFeatureOption({ label, checked, onClick }: RadioOptionProps) {
  return (
    <label
      className="
        flex cursor-pointer
        items-center
        gap-2.5
      "
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onClick}
        className={`
          flex h-4 w-4
          shrink-0
          items-center
          justify-center

          rounded-[3px]
          border

          ${checked ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
        `}
      >
        {checked && (
          <Check
            aria-hidden="true"
            className="h-[11px] w-[11px] text-white"
            strokeWidth={2.5}
          />
        )}
      </button>

      <span
        className="
          font-inter
          text-[13px] font-normal
          leading-5
          text-[#667085]
        "
      >
        {label}
      </span>
    </label>
  );
}

/* =========================================================
   MOBILE SELECT
========================================================= */

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function MobileFilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label
        className="
          mb-1.5 block

          font-red-hat-display
          text-[12px] font-semibold
          leading-[18px]
          text-[#344054]
        "
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() => {
          setIsOpen((previous) => !previous);
        }}
        aria-expanded={isOpen}
        className="
          flex h-[33px]
          w-full
          items-center
          justify-between

          rounded-full

          border border-[#D0D5DD]
          bg-white

          px-3

          font-inter
          text-[11px] font-normal
          leading-4
          text-[#667085]
        "
      >
        <span>{value}</span>

        <ChevronDown
          aria-hidden="true"
          className={`
            h-3.5 w-3.5
            text-[#344054]

            transition-transform

            ${isOpen ? 'rotate-180' : ''}
          `}
          strokeWidth={1.8}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute left-0 right-0
            top-[calc(100%+6px)]
            z-30

            overflow-hidden

            rounded-[12px]

            border border-[#EAECF0]
            bg-white

            p-1

            shadow-[0px_10px_24px_rgba(16,24,40,0.14)]
          "
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`
                flex min-h-[34px]
                w-full
                items-center
                justify-between

                rounded-[8px]

                px-3

                text-left

                font-inter
                text-[11px]
                leading-4

                ${
                  option === value
                    ? 'bg-[#E6F4F2] font-medium text-[#0C3354]'
                    : 'font-normal text-[#667085] hover:bg-[#F9FAFB]'
                }
              `}
            >
              {option}

              {option === value && (
                <Check
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[#00897B]"
                  strokeWidth={2}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TABLET SELECT
========================================================= */

function TabletFilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label
        className="
          mb-2 block

          font-red-hat-display
          text-[14px] font-semibold
          leading-5
          text-[#344054]
        "
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() => {
          setIsOpen((previous) => !previous);
        }}
        aria-expanded={isOpen}
        className="
          flex h-[44px]
          w-full
          items-center
          justify-between

          rounded-full

          border border-[#D0D5DD]
          bg-white

          px-4

          font-inter
          text-[13px] font-normal
          leading-5
          text-[#667085]

          transition-colors

          hover:border-[#98A2B3]
        "
      >
        <span>{value}</span>

        <ChevronDown
          aria-hidden="true"
          className={`
            h-4 w-4
            text-[#344054]

            transition-transform

            ${isOpen ? 'rotate-180' : ''}
          `}
          strokeWidth={1.8}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute left-0 right-0
            top-[calc(100%+7px)]
            z-30

            overflow-hidden

            rounded-[12px]

            border border-[#EAECF0]
            bg-white

            p-1.5

            shadow-[0px_10px_24px_rgba(16,24,40,0.14)]
          "
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`
                flex min-h-[40px]
                w-full
                items-center
                justify-between

                rounded-[8px]

                px-3

                text-left

                font-inter
                text-[13px]
                leading-5

                ${
                  option === value
                    ? 'bg-[#E6F4F2] font-medium text-[#0C3354]'
                    : 'font-normal text-[#667085] hover:bg-[#F9FAFB]'
                }
              `}
            >
              {option}

              {option === value && (
                <Check
                  aria-hidden="true"
                  className="h-4 w-4 text-[#00897B]"
                  strokeWidth={2}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DESKTOP SORT
========================================================= */

type SortDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { sort } = data.resultPage.resultsStatus;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = sort.options.find((option) => option.value === value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative min-w-0"
    >
      <button
        type="button"
        onClick={() => {
          setIsOpen((previous) => !previous);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="
          inline-flex h-[34px]
          w-[132px]
          min-w-0
          items-center
          justify-between
          gap-[6px]

          rounded-[8px]

          border border-[#E0DFE5]
          bg-white

          px-3 py-2

          font-inter
          text-[12px] font-medium
          leading-[120%]
          text-[#667085]

          shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
        "
      >
        <span className="min-w-0 truncate">{selectedOption?.label}</span>

        <ChevronDown
          aria-hidden="true"
          className={`
            h-[9px] w-[9px]
            shrink-0
            text-[#8C939B]

            transition-transform

            ${isOpen ? 'rotate-180' : ''}
          `}
          strokeWidth={1.67}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="
            absolute right-0
            top-[calc(100%+8px)]
            z-50

            w-[210px]

            overflow-hidden

            rounded-[12px]

            border border-[#EAECF0]
            bg-white

            p-1.5

            shadow-[0px_12px_24px_rgba(16,24,40,0.12)]
          "
        >
          {sort.options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  flex min-h-10
                  w-full
                  items-center
                  justify-between

                  rounded-[8px]

                  px-3 py-2

                  text-left

                  font-inter
                  text-[12px] font-medium
                  leading-5

                  ${
                    isSelected ? 'bg-[#E6F4F2] text-[#0C3354]' : 'text-[#667085] hover:bg-[#F9FAFB]'
                  }
                `}
              >
                <span>{option.label}</span>

                {isSelected && (
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4 text-[#00897B]"
                    strokeWidth={2}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PERIOD TOGGLE
========================================================= */

type PeriodToggleProps = {
  value: string;
  onChange: (value: string) => void;
};

function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  const { periodTabs } = data.resultPage.resultsStatus;

  return (
    <div
      className="
        inline-flex h-[34px]
        w-fit shrink-0
        items-center

        rounded-[9px]

        bg-[#F3F4F6]

        p-[2px]
      "
    >
      {periodTabs.options.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => {
              onChange(option.value);
            }}
            className={`
              inline-flex h-[30px]
              items-center
              justify-center

              whitespace-nowrap

              rounded-[7px]

              px-3

              font-red-hat-display
              text-[12px]
              leading-5

              ${
                isSelected
                  ? `
                    bg-white
                    font-extrabold
                    text-[#101828]

                    shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]
                  `
                  : `
                    font-medium
                    text-[#6A7282]
                  `
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
