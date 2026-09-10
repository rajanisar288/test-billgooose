import Image from 'next/image';

import { ChevronDown, ChevronRight, LoaderCircle } from 'lucide-react';

import type { CompareResultService, StandardPlan } from '@/components/result/plan.types';
import data from '@/data/content.json';

type PlanCardProps = {
  plan: StandardPlan;

  service: CompareResultService;

  onViewDetails: (plan: StandardPlan) => void;

  onSelectPlan: (plan: StandardPlan) => void;
  isSelecting?: boolean;
  showSaving?: boolean;
};

const STAR_COUNT = 5;

export default function PlanCard({
  plan,
  service,
  onViewDetails,
  onSelectPlan,
  isSelecting = false,
  showSaving = true,
}: PlanCardProps) {
  const { plans } = data.resultPage;

  const isBroadband = service === 'broadband';
  const isInsurance = service === 'insurance';

  const handleSelectPlan = () => {
    onSelectPlan(plan);
  };

  const description = isBroadband ? `${plan.description} · ${plan.contract}` : plan.description;

  return (
    <>
      {/* =====================================================
          MOBILE CARD
      ====================================================== */}
      <article
        className="
          w-full

          rounded-[16px]

          border
          border-[#EAECF0]

          bg-white

          p-3

          shadow-[0px_1px_3px_rgba(16,24,40,0.04)]

          md:hidden
        "
      >
        <div className="flex items-start gap-3">
          <Image
            src={plan.logo}
            alt={plan.logoAlt}
            width={74}
            height={74}
            className="
              h-[74px]
              w-[74px]
              shrink-0

              rounded-[9px]

              object-contain
            "
          />

          <div className="min-w-0 flex-1 pt-[1px]">
            <h3
              className="
                truncate

                font-red-hat-display

                text-[18px]
                font-extrabold
                leading-[22px]

                text-[#101828]
              "
            >
              {plan.provider}
            </h3>

            <p
              className="
                mt-[1px]

                truncate

                font-red-hat-display

                text-[14px]
                font-medium
                leading-[19px]

                text-[#667085]
              "
            >
              {description}
            </p>

            {!isBroadband && (
              <div
                className="
                  mt-1

                  flex
                  flex-wrap
                  items-center

                  gap-x-[5px]
                  gap-y-1
                "
              >
                <div className="flex items-center gap-[1px]">
                  {Array.from({
                    length: STAR_COUNT,
                  }).map((_, index) => (
                    <Image
                      key={`mobile-star-${index}`}
                      src={plans.starIcon}
                      alt=""
                      width={14}
                      height={14}
                      aria-hidden="true"
                      className="
                        h-[14px]
                        w-[14px]

                        object-contain
                      "
                    />
                  ))}
                </div>

                <span
                  className="
                    font-red-hat-display

                    text-[14px]
                    font-bold

                    text-[#101828]
                  "
                >
                  {plan.rating}
                </span>

                <span className="text-[#98A2B3]">·</span>

                <span
                  className="
                    font-red-hat-display

                    text-[14px]
                    font-medium

                    text-[#667085]
                  "
                >
                  {plan.contract}
                </span>
              </div>
            )}

            {isBroadband && (
              <div
                className="
                  mt-2

                  flex
                  flex-wrap

                  gap-1
                "
              >
                {plan.features.map((feature) => (
                  <span
                    key={feature}
                    className="
                        rounded-[4px]

                        bg-[#EAF2F8]

                        px-1.5
                        py-0.5

                        font-red-hat-display

                        text-[9px]
                        font-[645]

                        text-[#105089]
                      "
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}

            {showSaving && (
              <span
                className="
                mt-1

                inline-flex

                rounded-full

                bg-[#ECFDF3]

                px-[6px]
                py-[1px]

                font-red-hat-display

                text-[12px]
                font-bold

                text-[#027A48]
              "
              >
                {plan.saving}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onViewDetails(plan);
          }}
          className="
            mt-3

            flex
            h-[35px]
            w-full

            items-center
            justify-between

            rounded-[7px]

            border
            border-[#EAECF0]

            bg-white

            px-2

            font-red-hat-display

            text-[13px]
            font-bold

            text-[#101828]
          "
        >
          <span>{plan.viewDetailsButton}</span>

          <ChevronDown
            className="
              h-[15px]
              w-[15px]

              text-[#667085]
            "
          />
        </button>

        <div
          className="
            mt-3

            flex

            items-center
            justify-between

            gap-3

            rounded-[10px]

            border
            border-[#EAECF0]

            bg-[#F9FAFB]

            px-3
            py-2
          "
        >
          <div>
            <p
              className="
                font-red-hat-display

                text-[10px]
                font-extrabold
                uppercase

                text-[#667085]
              "
            >
              {isBroadband ? 'Monthly cost' : plan.priceLabel}
            </p>

            <p
              className="
                font-red-hat-display

                text-[20px]
                font-extrabold

                text-[#101828]
              "
            >
              {plan.price}
            </p>

            {isBroadband && plan.averageSpeed && (
              <p
                className="
                    mt-1

                    font-red-hat-display

                    text-[11px]

                    text-[#667085]
                  "
              >
                {plan.averageSpeed}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSelectPlan}
            disabled={isSelecting}
            className="
              inline-flex
              h-[42px]
              min-w-[155px]

              items-center
              justify-center

              rounded-full

              border
              border-[#00897B]

              bg-[#00897B]

              px-4

              font-red-hat-display

              text-[14px]
              font-bold

              text-white

              hover:bg-[#00796D]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSelecting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : plan.primaryButton}
          </button>
        </div>
      </article>

      {/* =====================================================
          TABLET CARD
      ====================================================== */}
      <article
        className="
          hidden
          w-full

          rounded-[18px]

          border
          border-[#EAECF0]

          bg-white

          p-[14px]

          shadow-[0px_1px_3px_rgba(16,24,40,0.04)]

          md:block
          lg:hidden
        "
      >
        <div className="flex items-start gap-3">
          <Image
            src={plan.logo}
            alt={plan.logoAlt}
            width={74}
            height={74}
            className="
              h-[74px]
              w-[74px]

              shrink-0

              rounded-[9px]

              object-contain
            "
          />

          <div className="min-w-0 flex-1">
            <h3
              className="
                truncate

                font-red-hat-display

                text-[20px]
                font-extrabold

                text-[#101828]
              "
            >
              {plan.provider}
            </h3>

            <p
              className="
                mt-[1px]

                truncate

                font-red-hat-display

                text-[15px]
                font-medium

                text-[#667085]
              "
            >
              {description}
            </p>

            {!isBroadband && (
              <div
                className="
                  mt-[3px]

                  flex
                  items-center

                  gap-[5px]
                "
              >
                {Array.from({
                  length: STAR_COUNT,
                }).map((_, index) => (
                  <Image
                    key={`tablet-star-${index}`}
                    src={plans.starIcon}
                    alt=""
                    width={15}
                    height={15}
                  />
                ))}

                <span className="font-bold">{plan.rating}</span>

                <span>·</span>

                <span>{plan.contract}</span>
              </div>
            )}

            {isBroadband && (
              <div className="mt-2 flex flex-wrap gap-1">
                {plan.features.map((feature) => (
                  <span
                    key={feature}
                    className="
                        rounded-[4px]

                        bg-[#EAF2F8]

                        px-1.5
                        py-0.5

                        font-red-hat-display

                        text-[10px]
                        font-[645]

                        text-[#105089]
                      "
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(plan)}
          className="
            mt-[14px]

            flex
            h-[35px]
            w-full

            items-center
            justify-between

            rounded-[7px]

            border
            border-[#EAECF0]

            bg-white

            px-[9px]

            font-red-hat-display

            text-[13px]
            font-bold

            text-[#101828]
          "
        >
          {plan.viewDetailsButton}

          <ChevronDown
            className="
              h-[15px]
              w-[15px]
            "
          />
        </button>

        <div
          className="
            mt-[13px]

            flex

            items-center
            justify-between

            rounded-[10px]

            border
            border-[#EAECF0]

            bg-[#F9FAFB]

            px-[14px]
            py-[9px]
          "
        >
          <div>
            <p
              className="
                font-red-hat-display

                text-[10px]
                font-extrabold
                uppercase

                text-[#667085]
              "
            >
              {isBroadband ? 'Monthly cost' : plan.priceLabel}
            </p>

            <p
              className="
                font-red-hat-display

                text-[20px]
                font-extrabold

                text-[#101828]
              "
            >
              {plan.price}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSelectPlan}
            disabled={isSelecting}
            className="
              inline-flex
              h-[42px]
              min-w-[175px]

              items-center
              justify-center

              rounded-full

              border
              border-[#00897B]

              bg-[#00897B]

              px-5

              font-red-hat-display

              text-[14px]
              font-bold

              text-white

              hover:bg-[#00796D]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSelecting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : plan.primaryButton}
          </button>
        </div>
      </article>

      {/* =====================================================
          DESKTOP
      ====================================================== */}
      <article
        className="
          hidden
          w-full
          min-w-0

          overflow-hidden

          rounded-[16px]

          border
          border-[#EAECF0]

          bg-white

          lg:block
        "
      >
        <div
          className="
            flex
            w-full
            min-w-0

            items-center
            justify-between

            gap-5

            px-5
            py-5
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-1

              items-start

              gap-4

              xl:gap-5
            "
          >
            {showSaving && (
              <div
                className="
    flex
    h-[72px]
    w-[72px]
    shrink-0

    items-center
    justify-center

    overflow-hidden

    rounded-[11.25px]

    border-[1.13px]
    border-[#EAECF0]

    bg-[#EAF2F8]
  "
              >
                <Image
                  src={plan.logo}
                  alt={plan.logoAlt}
                  width={72}
                  height={72}
                  className="
      h-full
      w-full

      object-contain
    "
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3
                className="
                  truncate

                  font-red-hat-display

                  text-[20px]
                  font-[645]
                  leading-[21.75px]

                  text-[#101828]
                "
              >
                {plan.provider}
              </h3>

              <p
                className="
                  mt-1

                  truncate

                  font-red-hat-display

                  text-[15px]
                  font-[467]
                  leading-[19.5px]

                  text-[#667085]
                "
              >
                {description}
              </p>

              {/* ENERGY RATING
              {!isBroadband && (
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
                  <div className="flex items-center gap-[3px]">
                    {Array.from({
                      length: STAR_COUNT,
                    }).map((_, index) => (
                      <Image
                        key={`desktop-star-${index}`}
                        src={plans.starIcon}
                        alt=""
                        width={16}
                        height={16}
                        aria-hidden="true"
                        className="
                            h-4
                            w-4

                            object-contain
                          "
                      />
                    ))}
                  </div>

                  <span
                    className="
                      font-red-hat-display

                      text-[14px]
                      font-[645]

                      text-[#101828]
                    "
                  >
                    {plan.rating}
                  </span>

                  <span className="text-[#98A2B3]">·</span>

                  <span
                    className="
                      font-red-hat-display

                      text-[14px]
                      font-[467]

                      text-[#667085]
                    "
                  >
                    {plan.contract}
                  </span>
                </div>
              )} */}

              {/* FEATURES */}
              <div
                className="
                  mt-2

                  flex
                  flex-wrap

                  items-center

                  gap-1.5
                "
              >
                {plan.features.map((feature) => (
                  <span
                    key={feature}
                    className="
                        inline-flex
                        min-h-[21px]

                        items-center

                        rounded-[4px]

                        bg-[#EAF2F8]

                        px-[7px]
                        py-0.5

                        font-red-hat-display

                        text-[11.5px]
                        font-[645]

                        text-[#105089]
                      "
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SAVING + ACTIONS */}
          <div
            className="
              flex
              shrink-0

              items-center

              gap-5
            "
          >
            {!['energy', 'bundle-bills']?.includes(plan.service as string) && (
              <div
                className="
                flex
                w-[125px]
                shrink-0

                flex-col
                justify-center

                rounded-[8px]

                border
                border-[#A6F4C5]

                bg-[#F6FEF9]

                px-3
                py-2.5
              "
              >
                <p
                  className="
                  font-red-hat-display

                  text-[20px]
                  font-[645]
                  leading-[30px]

                  text-[#12B76A]
                "
                >
                  {plan.saving}
                </p>

                <p
                  className="
                  mt-[2px]

                  font-red-hat-display

                  text-[12px]
                  font-[467]
                  leading-[14.4px]

                  text-[#054F31]
                "
                >
                  Annual saving at today&apos;s rates
                </p>
              </div>
            )}

            <div
              className="
                flex
                w-[135px]
                shrink-0

                flex-col

                gap-2
              "
            >
              <button
                type="button"
                onClick={handleSelectPlan}
                disabled={isSelecting}
                className="
                  inline-flex
                  h-[40px]
                  w-full

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-[#00897B]

                  bg-[#00897B]

                  px-[14px]

                  font-red-hat-display

                  text-[14px]
                  font-bold

                  text-white

                  hover:bg-[#00796D]

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSelecting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  plan.primaryButton
                )}
              </button>

              <button
                type="button"
                onClick={() => onViewDetails(plan)}
                className="
                  inline-flex
                  h-[40px]
                  w-full

                  items-center
                  justify-center

                  gap-1.5

                  rounded-full

                  border
                  border-[#667085]

                  bg-white

                  px-[14px]

                  font-red-hat-display

                  text-[14px]
                  font-[645]

                  text-[#101828]

                  hover:bg-[#F9FAFB]
                "
              >
                {plan.viewDetailsButton}

                <ChevronRight
                  className="
                    h-[18px]
                    w-[18px]

                    text-[#0D3B66]
                  "
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            METRICS
        ================================================== */}

        {isBroadband ? (
          <div
            className="
              grid
              grid-cols-3

              gap-3

              border-t
              border-[#EAECF0]

              bg-[#FCFCFD]

              px-5
              py-3
            "
          >
            <ResultMetric
              label="Monthly cost"
              value={plan.price}
            />

            <ResultMetric
              label="Average speed"
              value={plan.averageSpeed ?? '—'}
            />

            <ResultMetric
              label="Upfront costs"
              value={plan.upfrontCost ?? '£0.00'}
            />
          </div>
        ) : isInsurance ? (
          <div
            className="
              grid
              grid-cols-4

              gap-3

              border-t
              border-[#EAECF0]

              bg-[#FCFCFD]

              px-5
              py-3
            "
          >
            <ResultMetric
              label="Monthly cost"
              value={plan.price}
            />

            <ResultMetric
              label="Annual cost"
              value={getEstimatedAnnualCost(plan.price)}
            />

            <ResultMetric
              label="Cover"
              value="Buildings & contents"
            />

            <ResultMetric
              label="Excess"
              value="£250"
            />
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-3

              gap-3

              border-t
              border-[#EAECF0]

              bg-[#FCFCFD]

              px-5
              py-3
            "
          >
            <ResultMetric
              label="Monthly cost"
              value={plan.price}
            />

            <ResultMetric
              label="Est. annual cost"
              value={getEstimatedAnnualCost(plan.price)}
            />

            <ResultMetric
              label="Contract"
              value={plan.contract}
            />

            {/*  <ResultMetric
               label="Exit fee"
               value="£190"
             />
              */}
          </div>
        )}
      </article>
    </>
  );
}

/* =========================================================
   RESULT METRIC
========================================================= */

type ResultMetricProps = {
  label: string;

  value: string;
};

function ResultMetric({ label, value }: ResultMetricProps) {
  return (
    <div
      className="
        min-w-0

        rounded-[8px]

        border
        border-[#EAECF0]

        bg-[#F9FAFB]

        px-3
        py-2
      "
    >
      <p
        className="
          truncate

          font-red-hat-display

          text-[13px]
          font-[467]
          leading-[19.5px]

          text-[#667085]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-[2px]

          truncate

          font-red-hat-display

          text-[14px]
          font-[645]
          leading-[21px]

          text-[#101828]
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   ENERGY ANNUAL COST
========================================================= */

function getEstimatedAnnualCost(monthlyPrice: string): string {
  const numericPrice = Number(monthlyPrice.replace(/[^0-9.]/g, ''));

  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    return '—';
  }

  return `£${(numericPrice * 12).toFixed(2)}`;
}
