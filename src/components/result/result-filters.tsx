'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Check, ChevronDown } from 'lucide-react';

import data from '@/data/content.json';

type FilterValues = Record<string, string>;

type FilterField = (typeof data.resultPage.filters.fields)[number];

type FilterOption = FilterField['options'][number];

export default function ResultFilters() {
  const { filters } = data.resultPage;

  const defaultValues = useMemo<FilterValues>(() => {
    return filters.fields.reduce<FilterValues>((values, field) => {
      values[field.id] = field.defaultValue;

      return values;
    }, {});
  }, [filters.fields]);

  const [selectedValues, setSelectedValues] = useState<FilterValues>(defaultValues);

  const handleValueChange = (fieldId: string, value: string) => {
    setSelectedValues((previousValues) => ({
      ...previousValues,
      [fieldId]: value,
    }));
  };

  const handleReset = () => {
    setSelectedValues(defaultValues);
  };

  const handleApply = () => {
    console.log('Applied result filters:', selectedValues);
  };

  return (
    <section
      className="
        relative
        z-20

        mx-auto

        hidden
        max-w-[1320px]

        lg:block
        lg:w-[calc(100%-80px)]
        lg:-translate-y-12

        xl:h-[148px]
        xl:w-[calc(100%-120px)]
        xl:-translate-y-[78px]
      "
    >
      <div
        className="
          w-full

          rounded-[16px]

          border
          border-[#ECECEC]

          bg-white

          p-4

          shadow-[6px_4px_16px_0px_rgba(158,158,158,0.10),23px_17px_28px_0px_rgba(158,158,158,0.09),52px_38px_38px_0px_rgba(158,158,158,0.05),92px_67px_46px_0px_rgba(158,158,158,0.01)]

          min-[390px]:p-5

          xl:h-[148px]
          xl:rounded-[20px]
          xl:px-6
          xl:py-5
        "
      >
        <h2
          className="
            font-red-hat-display
            text-[15px]
            font-extrabold
            leading-[16.5px]
            text-[#101828]

            xl:text-[16px]
          "
        >
          {filters.heading}
        </h2>

        {/* Laptop / desktop filters */}
        <div
          className="
            mt-4

            grid
            grid-cols-1
            gap-4

            lg:grid-cols-3

            xl:hidden
          "
        >
          {filters.fields.map((field) => (
            <ResultFilterSelect
              key={field.id}
              field={field}
              value={selectedValues[field.id]}
              dropdownAriaLabel={filters.dropdownAriaLabel}
              onChange={(value) => {
                handleValueChange(field.id, value);
              }}
            />
          ))}

          <div
            className="
              flex
              flex-col
              gap-2

              lg:col-span-3
              lg:flex-row
            "
          >
            <ActionButtons
              applyLabel={filters.applyButton}
              resetLabel={filters.resetButton}
              onApply={handleApply}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Large desktop filters */}
        <div
          className="
            hidden

            xl:mt-3
            xl:grid
            xl:h-[80px]
            xl:grid-cols-[repeat(5,minmax(0,1fr))_1px_141px]
            xl:items-end
            xl:gap-4
          "
        >
          {filters.fields.map((field) => (
            <ResultFilterSelect
              key={field.id}
              field={field}
              value={selectedValues[field.id]}
              dropdownAriaLabel={filters.dropdownAriaLabel}
              onChange={(value) => {
                handleValueChange(field.id, value);
              }}
            />
          ))}

          <div
            aria-hidden="true"
            className="
              h-[80px]
              w-px
              bg-[#EAECF0]
            "
          />

          <div
            className="
              flex
              h-[80px]
              flex-col
              gap-2
            "
          >
            <ActionButtons
              applyLabel={filters.applyButton}
              resetLabel={filters.resetButton}
              onApply={handleApply}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type ActionButtonsProps = {
  applyLabel: string;
  resetLabel: string;
  onApply: () => void;
  onReset: () => void;
};

function ActionButtons({ applyLabel, resetLabel, onApply, onReset }: ActionButtonsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onApply}
        className="
          inline-flex
          h-10
          w-full
          items-center
          justify-center

          rounded-full

          border
          border-[#00897B]

          bg-[#00897B]

          px-[14px]

          font-red-hat-display
          text-[13px]
          font-extrabold
          text-white

          lg:flex-1

          xl:h-9
          xl:w-[141px]
          xl:flex-none
        "
      >
        {applyLabel}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="
          inline-flex
          h-10
          w-full
          items-center
          justify-center

          rounded-full

          border
          border-[#D0D5DD]

          bg-white

          px-[14px]

          font-red-hat-display
          text-[13px]
          font-extrabold
          text-[#344054]

          lg:flex-1

          xl:h-9
          xl:w-[141px]
          xl:flex-none
        "
      >
        {resetLabel}
      </button>
    </>
  );
}

type ResultFilterSelectProps = {
  field: FilterField;
  value: string;
  dropdownAriaLabel: string;
  onChange: (value: string) => void;
};

function ResultFilterSelect({
  field,
  value,
  dropdownAriaLabel,
  onChange,
}: ResultFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = field.options.find((option) => option.value === value);

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

  const handleOptionSelect = (option: FilterOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="
        relative
        min-w-0
      "
    >
      <label
        htmlFor={`result-filter-${field.id}`}
        className="
          mb-1.5
          block

          font-inter
          text-[12px]
          font-medium
          leading-5
          text-[#344054]

          xl:mb-2
          xl:text-[14px]
        "
      >
        {field.label}
      </label>

      <button
        id={`result-filter-${field.id}`}
        type="button"
        onClick={() => {
          setIsOpen((previous) => !previous);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${dropdownAriaLabel}: ${field.label}`}
        className="
          flex
          h-10
          w-full
          items-center
          justify-between
          gap-2

          rounded-full

          border
          border-[#EAECF0]

          bg-white

          px-3

          font-inter
          text-[13px]
          text-[#667085]

          xl:text-[16px]
        "
      >
        <span className="truncate">{selectedOption?.label || field.placeholder}</span>

        <ChevronDown
          aria-hidden="true"
          className={`
    h-[16px]
    w-[16px]
    shrink-0

    text-[#344054]

    transition-transform
    duration-200

    xl:h-[18px]
    xl:w-[18px]

    ${isOpen ? 'rotate-180' : ''}
  `}
          strokeWidth={2.5}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="
            absolute
            left-0
            right-0
            top-[calc(100%+8px)]
            z-50

            max-h-[220px]
            overflow-y-auto

            rounded-[14px]

            border
            border-[#EAECF0]

            bg-white

            p-1.5

            shadow-xl
          "
        >
          {field.options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  handleOptionSelect(option);
                }}
                className={`
                  flex
                  min-h-10
                  w-full
                  items-center
                  justify-between

                  rounded-[10px]

                  px-3
                  py-2

                  text-left

                  font-inter
                  text-[13px]

                  ${
                    isSelected
                      ? `
                        bg-[#E6F4F2]
                        text-[#0C3354]
                      `
                      : `
                        text-[#667085]

                        hover:bg-[#F9FAFB]
                      `
                  }
                `}
              >
                {option.label}

                {isSelected && (
                  <Check
                    aria-hidden="true"
                    className="
                      h-4
                      w-4
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
