'use client';

import { useEffect, useState } from 'react';

import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';

import data from '@/data/content.json';

type PlanTabValue = string;
type PeriodTabValue = string;

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
            MOBILE
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
            Screenshot layout
        ====================================================== */}
        <div
          className="
            hidden

            md:block
            lg:hidden
          "
        >
          {/* Comparing */}
          <p
            className="
              mb-[10px]

              font-red-hat-display
              text-[14px]
              font-medium
              leading-5
              tracking-[0]
              text-[#667085]
            "
          >
            Comparing:{' '}
            <span
              className="
                font-semibold
                text-[#0C3354]
              "
            >
              Energy
            </span>
          </p>

          {/* Heading */}
          <h2
            className="
              font-red-hat-display
              text-[30px]
              font-extrabold
              leading-[36px]
              tracking-[0]
              text-[#0C3354]
            "
          >
            {resultsStatus.heading}
          </h2>

          {/* Description */}
          <p
            className="
              mt-1

              font-inter
              text-[14px]
              font-normal
              leading-[20px]
              tracking-[0]
              text-[#667085]
            "
          >
            <strong
              className="
                font-semibold
                text-[#101828]
              "
            >
              {resultsStatus.descriptionStart}
            </strong>{' '}
            {resultsStatus.descriptionRest}
          </p>

          {/* Bottom controls */}
          <div
            className="
              mt-6

              flex
              w-full
              items-center
              justify-between
              gap-5
            "
          >
            {/* All / Fixed / Variable */}
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
                      h-[34px]
                      shrink-0
                      items-center
                      justify-center

                      whitespace-nowrap

                      rounded-[7px]

                      px-4

                      font-red-hat-display
                      text-[13px]
                      leading-[20px]

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

            {/* Monthly / Annual + Filters */}
            <div
              className="
                ml-auto
                flex
                shrink-0
                items-center
                gap-4
              "
            >
              <PeriodToggle
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                tablet
              />

              <button
                type="button"
                onClick={() => {
                  setIsFilterModalOpen(true);
                }}
                className="
                  inline-flex
                  h-[34px]
                  shrink-0
                  items-center
                  justify-center
                  gap-[6px]

                  rounded-[7px]

                  border border-[#D0D5DD]
                  bg-white

                  px-3

                  font-red-hat-display
                  text-[13px]
                  font-semibold
                  leading-5
                  text-[#344054]

                  shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
                "
              >
                <SlidersHorizontal
                  aria-hidden="true"
                  className="
                    h-[15px]
                    w-[15px]
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
            DESKTOP - KEEP CURRENT DESKTOP LAYOUT
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
                text-[19px]
                font-bold
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
                text-[13px]
                font-normal
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
                flex
                flex-wrap
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
                      text-center

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

          {/* Existing desktop period toggle only */}
          <div
            className="
              flex
              shrink-0
              items-center
              justify-end
            "
          >
            <PeriodToggle
              value={selectedPeriod}
              onChange={setSelectedPeriod}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTER MODAL
          Mobile + Tablet only
      ====================================================== */}
      {isFilterModalOpen && (
        <div
          className="
            fixed inset-0 z-[100]

            flex
            items-end
            justify-center

            bg-black/25

            px-[14px]
            pb-[8px]

            md:items-center
            md:px-6
            md:py-6

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
              max-h-[calc(100dvh-24px)]
              w-full
              overflow-y-auto

              rounded-[14px]

              bg-white

              px-[18px]
              pb-4
              pt-[14px]

              shadow-[0px_20px_50px_rgba(16,24,40,0.18)]

              md:max-w-[620px]
              md:rounded-[18px]
              md:px-7
              md:pb-6
              md:pt-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <h2
                className="
                  font-red-hat-display
                  text-[14px]
                  font-extrabold
                  leading-5
                  text-[#0C3354]

                  md:text-[18px]
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
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center

                  rounded-full

                  bg-[#F2F4F7]

                  text-[#344054]

                  md:h-8
                  md:w-8
                "
              >
                <X
                  aria-hidden="true"
                  className="
                    h-3.5
                    w-3.5

                    md:h-4
                    md:w-4
                  "
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Your plans */}
            <div className="mt-4 md:mt-6">
              <h3
                className="
                  font-red-hat-display
                  text-[12px]
                  font-semibold
                  leading-5
                  text-[#344054]

                  md:text-[15px]
                "
              >
                Your plans
              </h3>

              <div className="mt-2 space-y-2 md:space-y-3">
                <RadioOption
                  label="Only show plans BillGoose can help me switch to"
                  checked={mobileFilters.yourPlans === 'billgoose'}
                  onClick={() => {
                    setMobileFilters((previous) => ({
                      ...previous,
                      yourPlans: previous.yourPlans === 'billgoose' ? '' : 'billgoose',
                    }));
                  }}
                />

                <RadioOption
                  label="Include plans that require switching directly through the supplier"
                  checked={mobileFilters.yourPlans === 'supplier'}
                  onClick={() => {
                    setMobileFilters((previous) => ({
                      ...previous,
                      yourPlans: previous.yourPlans === 'supplier' ? '' : 'supplier',
                    }));
                  }}
                />
              </div>
            </div>

            <div className="my-4 h-px bg-[#EAECF0] md:my-5" />

            <MobileFilterSelect
              label="Plan type"
              value={mobileFilters.planType}
              options={['Dual Fuel', 'Electricity', 'Gas']}
              onChange={(value) => {
                setMobileFilters((previous) => ({
                  ...previous,
                  planType: value,
                }));
              }}
            />

            <div className="mt-4">
              <MobileFilterSelect
                label="Payment method"
                value={mobileFilters.paymentMethod}
                options={[
                  'Monthly direct debit',
                  'Quarterly direct debit',
                  'Pay on receipt',
                  'Prepayment',
                ]}
                onChange={(value) => {
                  setMobileFilters((previous) => ({
                    ...previous,
                    paymentMethod: value,
                  }));
                }}
              />
            </div>

            <div className="mt-4">
              <MobileFilterSelect
                label="Rate type"
                value={mobileFilters.rateType}
                options={['Monthly direct debit', 'Fixed', 'Variable']}
                onChange={(value) => {
                  setMobileFilters((previous) => ({
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
                  text-[12px]
                  font-semibold
                  leading-5
                  text-[#344054]

                  md:text-[15px]
                "
              >
                Plan features
              </h3>

              <div className="mt-2 space-y-2">
                {featureOptions.map((feature, index) => {
                  const featureKey = `${feature}-${index}`;
                  const checked = mobileFilters.features.includes(featureKey);

                  return (
                    <label
                      key={featureKey}
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2

                        md:gap-3
                      "
                    >
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => {
                          toggleFeature(featureKey);
                        }}
                        className={`
                          flex h-3.5 w-3.5
                          shrink-0
                          items-center
                          justify-center

                          rounded-[3px]

                          border

                          md:h-4
                          md:w-4

                          ${checked ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'}
                        `}
                      >
                        {checked && (
                          <Check
                            aria-hidden="true"
                            className="
                              h-2.5
                              w-2.5
                              text-white
                            "
                            strokeWidth={2.5}
                          />
                        )}
                      </button>

                      <span
                        className="
                          font-inter
                          text-[11px]
                          font-normal
                          leading-[16px]
                          text-[#667085]

                          md:text-[14px]
                        "
                      >
                        {feature}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div
              className="
                mt-4

                flex
                items-center
                gap-3

                md:mt-6
              "
            >
              <button
                type="button"
                onClick={handleResetMobileFilters}
                className="
                  inline-flex
                  h-[32px]
                  flex-1
                  items-center
                  justify-center

                  rounded-full

                  border border-[#D0D5DD]
                  bg-white

                  font-red-hat-display
                  text-[12px]
                  font-extrabold
                  leading-[18px]
                  text-[#0C3354]

                  md:h-[42px]
                  md:text-[15px]
                "
              >
                Reset all
              </button>

              <button
                type="button"
                onClick={handleApplyMobileFilters}
                className="
                  inline-flex
                  h-[32px]
                  flex-1
                  items-center
                  justify-center

                  rounded-full

                  border border-[#00897B]
                  bg-[#00897B]

                  font-red-hat-display
                  text-[12px]
                  font-extrabold
                  leading-[18px]
                  text-white

                  md:h-[42px]
                  md:text-[15px]
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
        flex
        w-full
        items-start
        gap-2
        text-left

        md:gap-3
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

          md:h-4
          md:w-4

          ${checked ? 'border-[#00897B]' : 'border-[#D0D5DD]'}
        `}
      >
        {checked && (
          <span
            className="
              h-1.5
              w-1.5

              rounded-full

              bg-[#00897B]
            "
          />
        )}
      </span>

      <span
        className="
          font-inter
          text-[10px]
          font-normal
          leading-[15px]
          text-[#667085]

          md:text-[14px]
          md:leading-5
        "
      >
        {label}
      </span>
    </button>
  );
}

type MobileFilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function MobileFilterSelect({ label, value, options, onChange }: MobileFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label
        className="
          mb-1.5
          block

          font-red-hat-display
          text-[12px]
          font-semibold
          leading-[18px]
          text-[#344054]

          md:text-[15px]
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
          flex
          h-[33px]
          w-full
          items-center
          justify-between

          rounded-full

          border border-[#D0D5DD]

          bg-white

          px-3

          font-inter
          text-[11px]
          font-normal
          leading-4
          text-[#667085]

          md:h-[42px]
          md:px-4
          md:text-[14px]
        "
      >
        <span>{value}</span>

        <ChevronDown
          aria-hidden="true"
          className={`
            h-3.5
            w-3.5

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
            absolute
            left-0
            right-0
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
                flex
                min-h-[34px]
                w-full
                items-center
                justify-between

                rounded-[8px]

                px-3

                text-left

                font-inter
                text-[11px]
                leading-4

                md:min-h-[40px]
                md:text-[14px]

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
                  className="
                    h-3.5
                    w-3.5
                    text-[#00897B]
                  "
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

type PeriodToggleProps = {
  value: string;
  onChange: (value: string) => void;
  tablet?: boolean;
};

function PeriodToggle({ value, onChange, tablet = false }: PeriodToggleProps) {
  const { periodTabs } = data.resultPage.resultsStatus;

  return (
    <div
      className={`
        inline-flex
        w-fit
        shrink-0
        items-center

        bg-[#F3F4F6]

        ${
          tablet
            ? `
              h-[34px]
              rounded-[8px]
              p-[2px]
            `
            : `
              h-[34px]
              rounded-[9px]
              p-[2px]
            `
        }
      `}
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
              inline-flex
              items-center
              justify-center
              whitespace-nowrap

              font-red-hat-display

              ${
                tablet
                  ? `
                    h-[30px]
                    rounded-[6px]
                    px-4
                    text-[12px]
                    leading-5
                  `
                  : `
                    h-[30px]
                    rounded-[7px]
                    px-3
                    text-[12px]
                    leading-5
                  `
              }

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
