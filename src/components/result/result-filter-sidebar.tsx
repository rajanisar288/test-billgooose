'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { Check, ChevronUp, Minus, Plus } from 'lucide-react';

import { useResultFilters } from '@/components/result/result-filter-context';
import data from '@/data/content.json';

const FILTER_BANNER_IMAGE = '/images/result-filter-banner.png';

type FilterValues = Record<string, string>;

type FilterField = (typeof data.resultPage.filters.fields)[number];

type ResultFilterSidebarProps = {
  showBanner?: boolean;
  mobilePanel?: boolean;
};

const SIM_FILTERS = [
  {
    id: 'monthly-cost',
    label: 'Monthly cost',
    options: [
      {
        id: '0-10',
        label: '£0 - £10',
        value: '0-10',
      },
      {
        id: '10-20',
        label: '£10 - £20',
        value: '10-20',
      },
      {
        id: '20-40',
        label: '£20 - £40',
        value: '20-40',
      },
      {
        id: '40-plus',
        label: '£40+',
        value: '40-plus',
      },
    ],
  },

  {
    id: 'data',
    label: 'Data',
    options: [
      {
        id: '0-3gb',
        label: '0 - 3GB',
        value: '0-3gb',
      },
      {
        id: '3-10gb',
        label: '3 - 10GB',
        value: '3-10gb',
      },
      {
        id: '10-20gb',
        label: '10 - 20GB',
        value: '10-20gb',
      },
      {
        id: '20-40gb',
        label: '20 - 40GB',
        value: '20-40gb',
      },
      {
        id: '40-50gb',
        label: '40 - 50GB',
        value: '40-50gb',
      },
      {
        id: '50-100gb',
        label: '50 - 100GB',
        value: '50-100gb',
      },
      {
        id: '100gb-plus',
        label: '100GB+',
        value: '100gb-plus',
      },
      {
        id: 'unlimited',
        label: 'Unlimited',
        value: 'unlimited',
      },
    ],
  },

  {
    id: 'roaming-destinations',
    label: 'Roaming destinations',
    options: [
      {
        id: 'europe',
        label: 'Roaming in Europe',
        value: 'europe',
      },
      {
        id: 'usa',
        label: 'USA',
        value: 'usa',
      },
      {
        id: 'india',
        label: 'India',
        value: 'india',
      },
      {
        id: 'cyprus',
        label: 'Cyprus',
        value: 'cyprus',
      },
      {
        id: 'malta',
        label: 'Malta',
        value: 'malta',
      },
    ],
  },

  {
    id: 'contract-length',
    label: 'Contract Length',
    options: [
      {
        id: 'no-contract',
        label: 'No contract',
        value: 'no-contract',
      },
      {
        id: '1-month',
        label: '1 month',
        value: '1-month',
      },
      {
        id: '12-months',
        label: '12 months',
        value: '12-months',
      },
      {
        id: '18-months',
        label: '18 months',
        value: '18-months',
      },
      {
        id: '24-months',
        label: '24 months',
        value: '24-months',
      },
    ],
  },

  {
    id: 'other-plan-details',
    label: 'Other plan details',
    options: [
      {
        id: '5g-data',
        label: '5G data',
        value: '5g-data',
      },
      {
        id: 'unlimited-texts',
        label: 'Unlimited texts',
        value: 'unlimited-texts',
      },
      {
        id: 'unlimited-minutes',
        label: 'Unlimited minutes',
        value: 'unlimited-minutes',
      },
      {
        id: 'esim-compatible',
        label: 'eSIM compatible',
        value: 'esim-compatible',
      },
    ],
  },
];

const SIM_NETWORKS = [
  'EE',
  'BT Mobile',
  'Three',
  'Smarty',
  'Virgin Mobile',
  'O2',
  'Giffgaff',
  'Vodafone',
  'Sky Mobile',
];

export default function ResultFilterSidebar({
  showBanner = true,
  mobilePanel = false,
}: ResultFilterSidebarProps) {
  const searchParams = useSearchParams();
  const { filters: appliedFilters, setFilters, resetFilters } = useResultFilters();

  const isSimOnly = searchParams.get('service') === 'sim-only';

  const { filters } = data.resultPage;

  /* =========================================================
     NORMAL ENERGY/BROADBAND FILTER STATE
  ========================================================= */

  const defaultValues = useMemo<FilterValues>(() => {
    return filters.fields.reduce<FilterValues>((values, field) => {
      values[field.id] = field.defaultValue;

      return values;
    }, {});
  }, [filters.fields]);

  const [selectedValues, setSelectedValues] = useState<FilterValues>(defaultValues);

  const [onlyBillGoose, setOnlyBillGoose] = useState(false);

  const [includeSupplier, setIncludeSupplier] = useState(false);

  const [isYourPlansOpen, setIsYourPlansOpen] = useState(true);

  /* =========================================================
     SIM FILTER STATE
  ========================================================= */

  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);

  const [selectedSimValues, setSelectedSimValues] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      setSelectedValues((current) => ({ ...current, ...appliedFilters.values }));
      setOnlyBillGoose(appliedFilters.onlyBillGoose);
      setIncludeSupplier(appliedFilters.includeSupplier);
      setSelectedNetworks(appliedFilters.networks);
      setSelectedSimValues(appliedFilters.simValues);
    }, 0);

    return () => window.clearTimeout(syncTimer);
  }, [appliedFilters]);

  function toggleNetwork(network: string) {
    setSelectedNetworks((previous) =>
      previous.includes(network)
        ? previous.filter((item) => item !== network)
        : [...previous, network],
    );
  }

  function toggleSimValue(fieldId: string, value: string) {
    setSelectedSimValues((previous) => {
      const current = previous[fieldId] ?? [];

      return {
        ...previous,

        [fieldId]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  }

  /* =========================================================
     NORMAL RESET/APPLY
  ========================================================= */

  const handleReset = () => {
    if (isSimOnly) {
      setSelectedNetworks([]);
      setSelectedSimValues({});
      resetFilters();

      return;
    }

    setSelectedValues(defaultValues);

    setOnlyBillGoose(false);
    setIncludeSupplier(false);
    setFilters({
      values: defaultValues,
      onlyBillGoose: false,
      includeSupplier: false,
      networks: [],
      simValues: {},
    });
  };

  const handleApply = () => {
    if (isSimOnly) {
      setFilters({
        values: {},
        onlyBillGoose: false,
        includeSupplier: false,
        networks: selectedNetworks,
        simValues: selectedSimValues,
      });

      return;
    }

    setFilters({
      values: selectedValues,
      onlyBillGoose,
      includeSupplier,
      networks: [],
      simValues: {},
    });
  };

  return (
    <aside
      className={
        mobilePanel
          ? `
            relative
            z-20

            w-full
            min-w-0
          `
          : `
            relative
            z-20

            w-full
            min-w-0

            lg:-mt-6
            lg:w-[326px]
            lg:shrink-0
          `
      }
    >
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
            TITLE
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
            SIM ONLY
        ================================================== */}
        {isSimOnly ? (
          <>
            <SimFilterSection
              label="Networks"
              defaultOpen
            >
              {SIM_NETWORKS.map((network) => (
                <SimCheckbox
                  key={network}
                  label={network}
                  checked={selectedNetworks.includes(network)}
                  onClick={() => {
                    toggleNetwork(network);
                  }}
                />
              ))}
            </SimFilterSection>

            {SIM_FILTERS.map((field) => (
              <SimFilterSection
                key={field.id}
                label={field.label}
              >
                {field.options.map((option) => (
                  <SimCheckbox
                    key={option.id}
                    label={option.label}
                    checked={selectedSimValues[field.id]?.includes(option.value) ?? false}
                    onClick={() => {
                      toggleSimValue(field.id, option.value);
                    }}
                  />
                ))}
              </SimFilterSection>
            ))}
          </>
        ) : (
          <>
            {/* ===============================================
                EXISTING ENERGY/BROADBAND FILTERS
            ================================================ */}

            <button
              type="button"
              onClick={() => setIsYourPlansOpen((prev) => !prev)}
              aria-expanded={isYourPlansOpen}
              className="
                mt-3

                flex
                h-[34px]
                w-full

                items-center
                justify-between

                rounded-[7px]

                bg-[#F9FAFB]

                px-2.5

                text-left

                transition-colors

                hover:bg-[#F2F4F7]

                lg:h-[38px]
              "
            >
              <span
                className="
                  font-red-hat-display

                  text-[12px]
                  font-semibold

                  text-[#252B37]

                  lg:text-[14px]
                "
              >
                Your plans
              </span>

              {isYourPlansOpen ? (
                <Minus
                  aria-hidden="true"
                  className="
                    h-3.5
                    w-3.5

                    text-[#667085]
                  "
                />
              ) : (
                <Plus
                  aria-hidden="true"
                  className="
                    h-3.5
                    w-3.5

                    text-[#667085]
                  "
                />
              )}
            </button>

            {isYourPlansOpen && (
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
            )}

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
          </>
        )}

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

              text-[#344054]

              hover:bg-[#F9FAFB]

              lg:text-[13px]
            "
          >
            {isSimOnly ? 'Reset' : filters.resetButton}
          </button>
        </div>
      </div>

      {showBanner && !isSimOnly && (
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
      )}
    </aside>
  );
}

/* =========================================================
   EXISTING CHECKBOX
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
          font-[660]
          leading-[15px]

          text-[#535862]

          lg:text-[12px]
        "
      >
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   EXISTING ACCORDION
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

            text-[#252B37]

            lg:text-[14px]
          "
        >
          {field.label}
        </span>

        {isOpen ? (
          <Minus
            className="
              h-3.5
              w-3.5

              text-[#667085]
            "
          />
        ) : (
          <Plus
            className="
              h-3.5
              w-3.5

              text-[#667085]
            "
          />
        )}
      </button>

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

                      rounded-[6px]

                      px-2.5
                      py-1.5

                      text-left

                      font-inter

                      font-[660]
                      text-[12px]

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
                      className="
                          h-3.5
                          w-3.5

                          text-[#00897B]
                        "
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

/* =========================================================
   SIM SECTION
========================================================= */

function SimFilterSection({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
        }}
        className="
          flex
          min-h-[38px]
          w-full

          items-center
          justify-between

          rounded-[7px]

          bg-[#F9FAFB]

          px-2.5

          text-left
        "
      >
        <span
          className="
            font-red-hat-display

            text-[12px]
            font-semibold

            text-[#252B37]

            lg:text-[14px]
          "
        >
          {label}
        </span>

        {isOpen ? (
          <Minus
            className="
              h-3.5
              w-3.5

              text-[#667085]
            "
          />
        ) : (
          <Plus
            className="
              h-3.5
              w-3.5

              text-[#667085]
            "
          />
        )}
      </button>

      {isOpen && (
        <div
          className="
            space-y-2.5

            px-1
            pb-1
            pt-3
          "
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SIM CHECKBOX
========================================================= */

function SimCheckbox({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        w-full

        items-center

        gap-2

        text-left
      "
    >
      <span
        className={`
          flex
          h-[14px]
          w-[14px]
          shrink-0

          items-center
          justify-center

          rounded-[3px]

          border

          ${
            checked
              ? `
                border-[#00897B]
                bg-[#00897B]
              `
              : `
                border-[#D0D5DD]
                bg-white
              `
          }
        `}
      >
        {checked && (
          <Check
            className="
              h-[10px]
              w-[10px]

              text-white
            "
            strokeWidth={3}
          />
        )}
      </span>

      <span
        className="
          font-inter

          text-[10px]
          leading-[15px]

          text-[#535862]

          lg:text-[11px]
        "
      >
        {label}
      </span>
    </button>
  );
}
