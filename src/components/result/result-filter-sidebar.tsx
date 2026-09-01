'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { Check, ChevronUp, Minus, Plus } from 'lucide-react';

import data from '@/data/content.json';

const FILTER_BANNER_IMAGE = '/images/result-filter-banner.png';

type FilterValues = Record<string, string>;

type FilterField = (typeof data.resultPage.filters.fields)[number];

export default function ResultFilterSidebar() {
  const { filters } = data.resultPage;

  const defaultValues = useMemo<FilterValues>(() => {
    return filters.fields.reduce<FilterValues>((values, field) => {
      values[field.id] = field.defaultValue;

      return values;
    }, {});
  }, [filters.fields]);

  const [selectedValues, setSelectedValues] = useState<FilterValues>(defaultValues);

  const [onlyBillGoose, setOnlyBillGoose] = useState(false);

  const [includeSupplier, setIncludeSupplier] = useState(false);

  const handleReset = () => {
    setSelectedValues(defaultValues);

    setOnlyBillGoose(false);
    setIncludeSupplier(false);
  };

  const handleApply = () => {
    console.log('Applied result filters:', {
      ...selectedValues,
      onlyBillGoose,
      includeSupplier,
    });
  };

  return (
    <aside
      className="
    relative
    z-20

    w-full
    min-w-0

    lg:-mt-6
    lg:w-[326px]
    lg:shrink-0
  "
    >
      {/* =====================================================
          FILTER CARD
      ====================================================== */}
      <div
        className="
    relative

    w-full

    overflow-visible

    rounded-[20px]

    border
    border-[#EAECF0]

    bg-white

    px-4
    pb-4
    pt-6

    shadow-[0px_4px_14px_rgba(16,24,40,0.06)]

    lg:w-[326px]
  "
      >
        {/* =================================================
            FILTER TITLE
        ================================================== */}
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
              text-[#101828]

              lg:text-[16px]
              lg:leading-6
            "
          >
            Filters
          </h2>

          <ChevronUp
            aria-hidden="true"
            className="
              h-4
              w-4
              text-[#475467]
            "
            strokeWidth={1.8}
          />
        </div>

        {/* =================================================
            YOUR PLANS
        ================================================== */}
        <div
          className="
            mt-3

            flex
            h-[34px]

            items-center
            justify-between

            rounded-[7px]

            bg-[#F9FAFB]

            px-2.5

            lg:h-[38px]
          "
        >
          <span
            className="
              font-red-hat-display
              text-[12px]
              font-semibold
              leading-[18px]
              text-[#252B37]

              lg:text-[14px]
              lg:leading-5
            "
          >
            Your plans
          </span>

          <Minus
            aria-hidden="true"
            className="
              h-3.5
              w-3.5
              text-[#667085]
            "
            strokeWidth={1.8}
          />
        </div>

        {/* =================================================
            PLAN OPTIONS
        ================================================== */}
        <div
          className="
            mt-3
            space-y-2.5
          "
        >
          <FilterCheckbox
            label="Only show plans BillGoose can help me switch to"
            checked={onlyBillGoose}
            onClick={() => {
              setOnlyBillGoose((current) => !current);
            }}
          />

          <FilterCheckbox
            label="Include plans that require switching directly through the supplier"
            checked={includeSupplier}
            onClick={() => {
              setIncludeSupplier((current) => !current);
            }}
          />
        </div>

        {/* =================================================
            FILTER ACCORDIONS
        ================================================== */}
        <div
          className="
            mt-4
            space-y-2
          "
        >
          {filters.fields.map((field) => (
            <FilterAccordion
              key={field.id}
              field={field}
              value={selectedValues[field.id]}
              onChange={(value) => {
                setSelectedValues((previous) => ({
                  ...previous,
                  [field.id]: value,
                }));
              }}
            />
          ))}
        </div>

        {/* =================================================
            ACTIONS
        ================================================== */}
        <div
          className="
            mt-4
            space-y-2
          "
        >
          <button
            type="button"
            onClick={handleApply}
            className="
              flex
              h-[38px]
              w-full

              items-center
              justify-center

              rounded-full

              border
              border-[#00897B]

              bg-[#00897B]

              px-4

              font-red-hat-display
              text-[12px]
              font-extrabold
              leading-5

              text-white

              transition-colors

              hover:bg-[#00796D]

              lg:text-[13px]
            "
          >
            {filters.applyButton}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="
              flex
              h-[38px]
              w-full

              items-center
              justify-center

              rounded-full

              border
              border-[#D0D5DD]

              bg-white

              px-4

              font-red-hat-display
              text-[12px]
              font-extrabold
              leading-5

              text-[#344054]

              transition-colors

              hover:bg-[#F9FAFB]

              lg:text-[13px]
            "
          >
            {filters.resetButton}
          </button>
        </div>
      </div>

      {/* =====================================================
          IMAGE BELOW FILTERS
      ====================================================== */}
      {/* =====================================================
    IMAGE BELOW FILTERS
====================================================== */}
      <div
        className="
    mt-4
    w-full
  "
      >
        <Image
          src={FILTER_BANNER_IMAGE}
          alt=""
          width={326}
          height={430}
          sizes="326px"
          className="
      h-auto
      w-full
      object-contain
    "
        />
      </div>
    </aside>
  );
}

/* =========================================================
   CHECKBOX
========================================================= */

type FilterCheckboxProps = {
  label: string;
  checked: boolean;
  onClick: () => void;
};

function FilterCheckbox({ label, checked, onClick }: FilterCheckboxProps) {
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
      "
    >
      <span
        className={`
          mt-[2px]

          flex
          h-[14px]
          w-[14px]
          shrink-0

          items-center
          justify-center

          rounded-full

          border

          ${checked ? 'border-[#00897B]' : 'border-[#D0D5DD]'}
        `}
      >
        {checked && (
          <span
            className="
              h-[6px]
              w-[6px]

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
          text-[#535862]

          lg:text-[11px]
          lg:leading-[16px]
        "
      >
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   FILTER ACCORDION
========================================================= */

type FilterAccordionProps = {
  field: FilterField;
  value: string;
  onChange: (value: string) => void;
};

function FilterAccordion({ field, value, onChange }: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="
        overflow-hidden

        rounded-[7px]

        bg-[#F9FAFB]
      "
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
        }}
        aria-expanded={isOpen}
        className="
          flex
          min-h-[36px]
          w-full

          items-center
          justify-between

          gap-2

          px-2.5
          py-2

          text-left

          lg:min-h-[40px]
        "
      >
        <span
          className="
            truncate

            font-red-hat-display
            text-[12px]
            font-semibold
            leading-[18px]
            text-[#252B37]

            lg:text-[14px]
            lg:leading-5
          "
        >
          {field.label}
        </span>

        {isOpen ? (
          <Minus
            aria-hidden="true"
            className="
              h-3.5
              w-3.5
              shrink-0
              text-[#667085]
            "
            strokeWidth={1.8}
          />
        ) : (
          <Plus
            aria-hidden="true"
            className="
              h-3.5
              w-3.5
              shrink-0
              text-[#667085]
            "
            strokeWidth={1.8}
          />
        )}
      </button>

      {/* Options */}
      {isOpen && (
        <div
          className="
            border-t
            border-[#EAECF0]

            bg-white

            p-2
          "
        >
          <div className="space-y-1">
            {field.options.map((option) => {
              const selected = option.value === value;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                  }}
                  className={`
                    flex
                    min-h-[32px]
                    w-full

                    items-center
                    justify-between

                    gap-2

                    rounded-[6px]

                    px-2.5
                    py-1.5

                    text-left

                    font-inter
                    text-[11px]
                    font-normal
                    leading-[17px]

                    lg:text-[12px]
                    lg:leading-[18px]

                    ${
                      selected
                        ? `
                          bg-[#E6F4F2]
                          text-[#535862]
                        `
                        : `
                          text-[#535862]
                          hover:bg-[#F9FAFB]
                        `
                    }
                  `}
                >
                  <span>{option.label}</span>

                  {selected && (
                    <Check
                      aria-hidden="true"
                      className="
                        h-3.5
                        w-3.5
                        shrink-0

                        text-[#00897B]
                      "
                      strokeWidth={2}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
