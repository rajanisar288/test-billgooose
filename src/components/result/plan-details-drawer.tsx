'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { X } from 'lucide-react';

import type { StandardPlan } from '@/components/result/plan.types';
import data from '@/data/content.json';

type PlanDetailsDrawerProps = {
  plan: StandardPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: StandardPlan) => void;
};

type DrawerTab = 'details' | 'comparison' | 'supplier';

const STAR_COUNT = 5;

export default function PlanDetailsDrawer({
  plan,
  isOpen,
  onClose,
  onSelectPlan,
}: PlanDetailsDrawerProps) {
  const { plans, planDetailsDrawer } = data.resultPage;

  const defaultTab = planDetailsDrawer.tabs.defaultValue as DrawerTab;

  const [activeTab, setActiveTab] = useState<DrawerTab>(defaultTab);

  const handleClose = useCallback(() => {
    setActiveTab(defaultTab);

    onClose();
  }, [defaultTab, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  const annualCost = useMemo(() => {
    if (!plan) {
      return '';
    }

    const numericPrice = Number(plan.price.replace(/[£,\s]/g, ''));

    if (Number.isNaN(numericPrice)) {
      return '';
    }

    const total = numericPrice * planDetailsDrawer.annualMultiplier;

    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(total);
  }, [plan, planDetailsDrawer.annualMultiplier]);

  if (!plan) {
    return null;
  }

  return (
    <div
      className={`
        fixed
        inset-0
        z-[100]

        transition-visibility
        duration-300

        ${isOpen ? 'visible' : 'invisible pointer-events-none'}
      `}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={planDetailsDrawer.closeButtonLabel}
        onClick={handleClose}
        className={`
          absolute
          inset-0

          bg-black/35

          transition-opacity
          duration-300

          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-details-title"
        className={`
          absolute
          right-0
          top-0

          flex
          h-dvh
          w-full

          flex-col

          overflow-hidden

          bg-white

          shadow-[-16px_0px_40px_rgba(16,24,40,0.16)]

          transition-transform
          duration-300

          sm:w-[min(92vw,783px)]
          sm:rounded-l-[16px]

          xl:w-[783px]

          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Heading */}
        <header
          className="
            flex
            min-h-[56px]
            shrink-0

            items-center
            justify-between

            border-b
            border-[#EAECF0]

            px-4

            sm:min-h-[72px]
            sm:px-5
          "
        >
          <h2
            id="plan-details-title"
            className="
              font-inter

              text-[15px]
              font-bold
              leading-5

              text-[#181D27]

              sm:text-[16px]
            "
          >
            {planDetailsDrawer.heading}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label={planDetailsDrawer.closeButtonLabel}
            className="
              flex
              h-9
              w-9
              shrink-0

              items-center
              justify-center

              rounded-full

              text-[#717680]

              transition-colors

              hover:bg-[#F2F4F7]
              hover:text-[#344054]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#EAECF0]
            "
          >
            <X
              aria-hidden="true"
              className="
                h-4
                w-4

                sm:h-5
                sm:w-5
              "
              strokeWidth={1.67}
            />
          </button>
        </header>

        {/* Scrollable */}
        <div
          className="
            min-h-0
            flex-1

            overflow-y-auto
          "
        >
          {/* Plan */}
          <section
            className="
              px-4
              py-4

              sm:px-5
              sm:py-5
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4

                min-[480px]:flex-row
                min-[480px]:items-start
                min-[480px]:justify-between
              "
            >
              {/* Provider */}
              <div
                className="
                  flex
                  min-w-0

                  items-start
                  gap-3

                  sm:gap-5
                "
              >
                <Image
                  src={plan.logo}
                  alt={plan.logoAlt}
                  width={72}
                  height={72}
                  className="
                    h-[56px]
                    w-[56px]
                    shrink-0

                    object-contain

                    sm:h-[72px]
                    sm:w-[72px]
                  "
                />

                <div className="min-w-0">
                  <h3
                    className="
                      font-red-hat-display

                      text-[18px]
                      font-extrabold
                      leading-[22px]

                      text-[#101828]

                      sm:text-[20px]
                      sm:leading-[24px]
                    "
                  >
                    {plan.provider}
                  </h3>

                  <p
                    className="
                      mt-1

                      font-red-hat-display

                      text-[13px]
                      font-medium
                      leading-[18px]

                      text-[#667085]

                      sm:text-[15px]
                      sm:leading-[19.5px]
                    "
                  >
                    {plan.description}
                  </p>

                  <div
                    className="
                      mt-2

                      flex
                      flex-wrap
                      items-center

                      gap-x-2
                      gap-y-1
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-[2px]

                        sm:gap-[3px]
                      "
                      aria-label="5-star rating"
                    >
                      {Array.from({
                        length: STAR_COUNT,
                      }).map((_, index) => (
                        <Image
                          key={`drawer-star-${index}`}
                          src={plans.starIcon}
                          alt=""
                          width={16}
                          height={16}
                          aria-hidden="true"
                          className="
                              h-[13px]
                              w-[13px]
                              shrink-0

                              object-contain

                              sm:h-4
                              sm:w-4
                            "
                        />
                      ))}
                    </div>

                    <span
                      className="
                        font-red-hat-display

                        text-[13px]
                        font-bold
                        leading-5

                        text-[#101828]

                        sm:text-[14px]
                        sm:leading-6
                      "
                    >
                      {plan.rating}
                    </span>

                    <span
                      aria-hidden="true"
                      className="
                        font-red-hat-display

                        text-[15px]
                        font-bold
                        leading-5

                        text-[#98A2B3]

                        sm:text-[16px]
                        sm:leading-6
                      "
                    >
                      ·
                    </span>

                    <span
                      className="
                        font-red-hat-display

                        text-[13px]
                        font-bold
                        leading-5

                        text-[#667085]

                        sm:text-[14px]
                        sm:leading-6
                      "
                    >
                      {plan.contract}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div
                className="
                  shrink-0
                  text-left

                  min-[480px]:text-right
                "
              >
                <p
                  className="
                    font-red-hat-display

                    text-[10px]
                    font-extrabold
                    uppercase
                    leading-4
                    tracking-[0.55px]

                    text-[#667085]

                    sm:text-[11px]
                  "
                >
                  {plan.priceLabel}
                </p>

                <div
                  className="
                    flex
                    items-baseline
                    gap-0.5

                    min-[480px]:justify-end
                  "
                >
                  <span
                    className="
                      font-red-hat-display

                      text-[23px]
                      font-extrabold
                      leading-7

                      text-black

                      sm:text-[26px]
                      sm:leading-8
                    "
                  >
                    {plan.price}
                  </span>

                  <span
                    className="
                      font-red-hat-display

                      text-[12px]
                      font-medium

                      text-[#667085]

                      sm:text-[13px]
                    "
                  >
                    {plan.pricePeriod}
                  </span>
                </div>

                <span
                  className="
                    mt-1

                    inline-flex

                    items-center
                    gap-1

                    rounded-full

                    bg-[#ECFDF3]

                    px-[7px]
                    py-0.5

                    font-red-hat-display

                    text-[10.5px]
                    font-extrabold

                    text-[#027A48]

                    sm:text-[11.5px]
                  "
                >
                  <Image
                    src={plans.savingIcon}
                    alt=""
                    width={12}
                    height={12}
                    aria-hidden="true"
                    className="
                      h-3
                      w-3
                      shrink-0

                      object-contain
                    "
                  />

                  {plan.saving}
                </span>
              </div>
            </div>

            {/* Cost cards */}
            <div
              className="
                mt-5

                grid
                grid-cols-1
                gap-3

                sm:grid-cols-2
                sm:gap-[17px]
              "
            >
              <CostSummary
                label={planDetailsDrawer.monthlyCostLabel}
                value={plan.price}
                variant="monthly"
              />

              <CostSummary
                label={planDetailsDrawer.annualCostLabel}
                value={annualCost}
                variant="annual"
              />
            </div>
          </section>

          {/* Tabs */}
          <div
            className="
              flex
              min-h-[45px]

              items-end
              gap-6

              overflow-x-auto

              border-b
              border-[#EAECF0]

              bg-white

              px-4

              sm:gap-8
              sm:px-5
            "
          >
            {planDetailsDrawer.tabs.options.map((tab) => {
              const isSelected = activeTab === tab.value;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.value as DrawerTab);
                  }}
                  className={`
                      flex
                      h-[45px]
                      shrink-0

                      items-center

                      border-b-2

                      px-0

                      font-red-hat-display

                      text-[14px]
                      leading-7

                      transition-colors

                      sm:text-[16px]

                      ${
                        isSelected
                          ? 'border-[#00897B] font-extrabold text-black'
                          : 'border-transparent font-medium text-[#667085] hover:text-[#344054]'
                      }
                    `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div
            className="
              bg-[#F8F9FA]

              px-4
              py-5

              sm:px-5
              sm:py-6
            "
          >
            {activeTab === 'details' && <DetailsTable />}

            {activeTab === 'comparison' && <ComparisonTable plan={plan} />}

            {activeTab === 'supplier' && <SupplierTable plan={plan} />}

            <h3
              className="
                mt-5

                font-red-hat-display

                text-[16px]
                font-bold
                leading-6

                text-[#101828]

                sm:text-[18px]
              "
            >
              {planDetailsDrawer.extraInformationHeading}
            </h3>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer
          className="
            flex
            min-h-[76px]
            shrink-0

            items-center
            justify-end
            gap-2

            border-t
            border-[#EAECF0]

            bg-white

            p-4

            sm:px-[18px]
            sm:py-[18px]
          "
        >
          <button
            type="button"
            onClick={() => {
              handleClose();

              onSelectPlan(plan);
            }}
            className="
              inline-flex
              h-10
              w-full

              items-center
              justify-center
              gap-2

              whitespace-nowrap

              rounded-full

              border
              border-[#00897B]

              bg-[#00897B]

              px-4
              py-2.5

              font-inter

              text-[14px]
              font-bold
              leading-5

              text-white

              shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]

              transition-colors

              hover:border-[#00796D]
              hover:bg-[#00796D]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#B7E6DF]

              min-[390px]:w-[108px]
            "
          >
            {planDetailsDrawer.selectPlanButton}
          </button>
        </footer>
      </aside>
    </div>
  );
}

/* =========================================================
   COST CARD
========================================================= */

type CostSummaryProps = {
  label: string;
  value: string;
  variant: 'monthly' | 'annual';
};

function CostSummary({ label, value, variant }: CostSummaryProps) {
  return (
    <div
      className={`
        flex
        min-h-[92px]

        flex-col
        items-center
        justify-center
        gap-1.5

        rounded-[8px]

        px-3
        py-[14px]

        sm:h-[103px]
        sm:gap-3

        ${variant === 'monthly' ? 'bg-[#D9F0ED]' : 'bg-[#E1E7ED]'}
      `}
    >
      <p
        className="
          text-center

          font-red-hat-display

          text-[14px]
          font-medium
          leading-[150%]

          text-[#1D2939]

          sm:text-[16px]
        "
      >
        {label}
      </p>

      <p
        className="
          text-center

          font-red-hat-display

          text-[28px]
          font-extrabold
          leading-[130%]

          text-[#101828]

          sm:text-[34px]
          sm:leading-[150%]
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   DETAILS TABLE
========================================================= */

function DetailsTable() {
  const { details } = data.resultPage.planDetailsDrawer;

  return (
    <ThreeColumnTable
      firstHeading={details.columns.first}
      secondHeading={details.columns.electricity}
      thirdHeading={details.columns.gas}
      rows={details.rows.map((row) => ({
        id: row.id,
        label: row.label,
        second: row.electricity,
        third: row.gas,
      }))}
    />
  );
}

/* =========================================================
   COMPARISON
========================================================= */

type ComparisonTableProps = {
  plan: StandardPlan;
};

function ComparisonTable({ plan }: ComparisonTableProps) {
  const { comparison } = data.resultPage.planDetailsDrawer;

  const rows = comparison.rows.map((row) => {
    if (row.id === 'monthly-cost') {
      return {
        id: row.id,
        label: row.label,
        second: row.current,
        third: plan.price,
      };
    }

    return {
      id: row.id,
      label: row.label,
      second: row.current,
      third: row.selected,
    };
  });

  return (
    <ThreeColumnTable
      firstHeading={comparison.columns.first}
      secondHeading={comparison.columns.current}
      thirdHeading={comparison.columns.selected}
      rows={rows}
    />
  );
}

/* =========================================================
   SUPPLIER
========================================================= */

type SupplierTableProps = {
  plan: StandardPlan;
};

function SupplierTable({ plan }: SupplierTableProps) {
  const { supplier } = data.resultPage.planDetailsDrawer;

  const rows = supplier.rows.map((row) => ({
    id: row.id,
    label: row.label,
    second: row.id === 'supplier-name' ? plan.provider : row.value,
    third: '',
  }));

  return (
    <ThreeColumnTable
      firstHeading={supplier.columns.first}
      secondHeading={supplier.columns.label}
      thirdHeading={supplier.columns.value}
      rows={rows}
      hideThirdColumn
    />
  );
}

/* =========================================================
   GENERIC TABLE
========================================================= */

type TableRow = {
  id: string;
  label: string;
  second: string;
  third: string;
};

type ThreeColumnTableProps = {
  firstHeading: string;
  secondHeading: string;
  thirdHeading: string;
  rows: TableRow[];
  hideThirdColumn?: boolean;
};

function ThreeColumnTable({
  firstHeading,
  secondHeading,
  thirdHeading,
  rows,
  hideThirdColumn = false,
}: ThreeColumnTableProps) {
  return (
    <div
      className="
        overflow-hidden

        rounded-[8px]

        border
        border-[#EAECF0]

        bg-white

        p-3

        sm:p-5
      "
    >
      <div
        className={`
          grid
          min-h-[36px]

          items-center

          rounded-full

          border
          border-[#E4E7EC]

          bg-[#F9FAFB]

          px-3

          font-inter

          text-[11px]
          font-medium
          leading-4

          text-[#101828]

          sm:text-[13px]

          ${
            hideThirdColumn
              ? 'grid-cols-[minmax(120px,1fr)_minmax(0,2fr)]'
              : 'grid-cols-[minmax(110px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)]'
          }
        `}
      >
        <span>{firstHeading}</span>

        <span>{secondHeading}</span>

        {!hideThirdColumn && <span>{thirdHeading}</span>}
      </div>

      <div>
        {rows.map((row) => (
          <div
            key={row.id}
            className={`
              grid
              min-h-[46px]

              items-center
              gap-3

              border-b
              border-[#EAECF0]

              px-3
              py-2

              font-inter

              text-[11px]
              leading-5

              last:border-b-0

              sm:min-h-[51px]
              sm:text-[13px]

              ${
                hideThirdColumn
                  ? 'grid-cols-[minmax(120px,1fr)_minmax(0,2fr)]'
                  : 'grid-cols-[minmax(110px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)]'
              }
            `}
          >
            <span
              className="
                font-inter

                text-[12px]
                font-normal
                leading-[120%]
                tracking-[0]

                text-[#475467]

                sm:text-[13px]
              "
            >
              {row.label}
            </span>

            <span
              className="
                font-inter

                text-[12px]
                font-normal
                leading-[120%]
                tracking-[0]

                text-black

                sm:text-[13px]
              "
            >
              {row.second}
            </span>

            {!hideThirdColumn && (
              <span
                className="
                  font-inter

                  text-[12px]
                  font-normal
                  leading-[120%]
                  tracking-[0]

                  text-black

                  sm:text-[13px]
                "
              >
                {row.third}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
