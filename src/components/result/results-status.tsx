'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Check, ChevronDown } from 'lucide-react';

import data from '@/data/content.json';

type PlanTabValue = string;
type PeriodTabValue = string;
type SortValue = string;

export default function ResultsStatus() {
  const { resultsStatus } = data.resultPage;

  const [selectedPlanTab, setSelectedPlanTab] = useState<PlanTabValue>(
    resultsStatus.planTabs.defaultValue,
  );

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodTabValue>(
    resultsStatus.periodTabs.defaultValue,
  );

  const [selectedSort, setSelectedSort] = useState<SortValue>(resultsStatus.sort.defaultValue);

  return (
    <section
      className="
        relative z-10
        mx-auto mt-4
        w-full max-w-[1096px]
        px-4

        min-[390px]:px-5

        sm:mt-2
        sm:px-6

        xl:-mt-[28px]
        xl:px-0
      "
    >
      <div
        className="
          flex flex-col gap-5

          md:flex-row
          md:items-end
          md:justify-between

          xl:gap-8
        "
      >
        {/* Heading and tabs */}
        <div className="min-w-0">
          <h2
            className="
              font-red-hat-display
              text-[17px] font-bold
              leading-none tracking-[0]
              text-[#101828]

              min-[390px]:text-[18px]

              sm:text-[19px]

              xl:text-[20px]
            "
          >
            {resultsStatus.heading}
          </h2>

          <p
            className="
              mt-2
              font-inter text-[12px]
              font-medium leading-[18px]
              tracking-[0]
              text-[#667085]

              min-[390px]:text-[13px]

              xl:text-[14px]
              xl:leading-none
            "
          >
            <strong className="font-extrabold text-[#101828]">
              {resultsStatus.descriptionStart}
            </strong>{' '}
            {resultsStatus.descriptionRest}
          </p>

          <div
            className="
              mt-4 flex flex-wrap
              items-center gap-2

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
                      items-center justify-center
                      whitespace-nowrap
                      rounded-[8px]
                      px-3

                      font-red-hat-display
                      text-[12px] leading-5
                      text-center

                      transition-colors

                      min-[390px]:px-[14px]
                      min-[390px]:text-[13px]

                      xl:h-[33px]

                      ${
                        isSelected
                          ? 'border border-[#00897B] bg-[#00897B] font-extrabold text-white'
                          : 'border border-[#EAECF0] bg-white font-medium text-[#101828] hover:bg-[#F9FAFB]'
                      }
                    `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort and period controls */}
        <div
          className="
            flex w-full flex-col gap-3

            sm:flex-row
            sm:items-center
            sm:justify-between

            md:w-auto
            md:shrink-0
            md:justify-end
          "
        >
          <div
            className="
              flex min-w-0
              items-center gap-2
            "
          >
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
                shrink-0
                font-inter text-[12px]
                font-medium leading-[120%]
                text-[#1D2939]

                min-[390px]:text-[13px]
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
  );
}

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
          min-w-0 items-center
          justify-between gap-[6px]
          rounded-[8px]
          border border-[#E0DFE5]
          bg-white
          px-3 py-2

          font-inter text-[12px]
          font-medium leading-[120%]
          text-[#667085]

          shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
          transition-colors

          hover:border-[#98A2B3]

          focus-visible:border-[#00897B]
          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-[#D5F2EE]

          min-[390px]:w-[142px]
          min-[390px]:text-[13px]
        "
      >
        <span className="min-w-0 truncate">{selectedOption?.label}</span>

        <ChevronDown
          aria-hidden="true"
          className={`
            h-[9px] w-[9px]
            shrink-0 text-[#8C939B]
            transition-transform duration-200

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
            z-50 w-[210px]
            overflow-hidden
            rounded-[12px]
            border border-[#EAECF0]
            bg-white p-1.5

            shadow-[0px_12px_24px_rgba(16,24,40,0.12)]

            min-[390px]:w-[220px]
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
                  flex min-h-10 w-full
                  items-center justify-between
                  gap-3 rounded-[8px]
                  px-3 py-2
                  text-left

                  font-inter text-[12px]
                  font-medium leading-5

                  transition-colors

                  min-[390px]:text-[13px]

                  ${
                    isSelected ? 'bg-[#E6F4F2] text-[#0C3354]' : 'text-[#667085] hover:bg-[#F9FAFB]'
                  }
                `}
              >
                <span>{option.label}</span>

                {isSelected && (
                  <Check
                    aria-hidden="true"
                    className="
                      h-4 w-4 shrink-0
                      text-[#00897B]
                    "
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
        w-fit shrink-0 items-center
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
              items-center justify-center
              whitespace-nowrap
              rounded-[7px]
              px-3

              font-red-hat-display
              text-[12px] leading-5
              transition-all

              min-[390px]:px-4
              min-[390px]:text-[13px]

              ${
                isSelected
                  ? 'bg-white font-extrabold text-[#101828] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]'
                  : 'font-medium text-[#6A7282]'
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
