import Image from 'next/image';

import { ChevronDown, ChevronRight } from 'lucide-react';

import type { StandardPlan } from '@/components/result/plan.types';
import data from '@/data/content.json';

type PlanCardProps = {
  plan: StandardPlan;
  onViewDetails: (plan: StandardPlan) => void;
};

const STAR_COUNT = 5;

export default function PlanCard({ plan, onViewDetails }: PlanCardProps) {
  const { plans } = data.resultPage;

  const isViewDeal = plan.type === 'view-deal';

  return (
    <>
      {/* =====================================================
          MOBILE CARD ONLY
          UNCHANGED
      ====================================================== */}
      <article
        className="
          w-full
          rounded-[16px]
          border border-[#EAECF0]
          bg-white
          p-3

          shadow-[0px_1px_3px_rgba(16,24,40,0.04)]

          md:hidden
        "
      >
        {/* Provider information */}
        <div className="flex items-start gap-3">
          <Image
            src={plan.logo}
            alt={plan.logoAlt}
            width={74}
            height={74}
            className="
              h-[74px] w-[74px]
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
                text-[18px] font-extrabold
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
                text-[14px] font-medium
                leading-[19px]
                text-[#667085]
              "
            >
              {plan.description}
            </p>

            {/* Stars + rating + contract */}
            <div
              className="
                mt-1
                flex flex-wrap
                items-center
                gap-x-[5px]
                gap-y-1
              "
            >
              <div
                className="
                  flex shrink-0
                  items-center
                  gap-[1px]
                "
                aria-label="5-star rating"
              >
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
                      h-[14px] w-[14px]
                      shrink-0
                      object-contain
                    "
                  />
                ))}
              </div>

              <span
                className="
                  font-red-hat-display
                  text-[14px] font-bold
                  leading-[20px]
                  text-[#101828]
                "
              >
                {plan.rating}
              </span>

              <span
                aria-hidden="true"
                className="
                  text-[14px]
                  font-bold
                  leading-none
                  text-[#98A2B3]
                "
              >
                ·
              </span>

              <span
                className="
                  whitespace-nowrap
                  font-red-hat-display
                  text-[14px] font-medium
                  leading-[20px]
                  text-[#667085]
                "
              >
                {plan.contract}
              </span>
            </div>

            {/* Saving */}
            <span
              className="
                mt-1
                inline-flex min-h-[20px]
                items-center
                gap-1

                rounded-full
                bg-[#ECFDF3]

                px-[6px]
                py-[1px]

                font-red-hat-display
                text-[12px] font-bold
                leading-[18px]
                text-[#027A48]
              "
            >
              <Image
                src={plans.savingIcon}
                alt=""
                width={13}
                height={13}
                aria-hidden="true"
                className="
                  h-[13px] w-[13px]
                  shrink-0
                  object-contain
                "
              />

              {plan.saving}
            </span>
          </div>
        </div>

        {/* View details */}
        <button
          type="button"
          onClick={() => {
            onViewDetails(plan);
          }}
          className="
            mt-3
            flex h-[35px]
            w-full
            items-center
            justify-between

            rounded-[7px]

            border border-[#EAECF0]
            bg-white

            px-2

            font-red-hat-display
            text-[13px] font-bold
            leading-[19px]
            text-[#101828]

            shadow-[0px_1px_2px_rgba(16,24,40,0.03)]

            transition-colors

            hover:bg-[#F9FAFB]
          "
        >
          <span>{plan.viewDetailsButton}</span>

          <ChevronDown
            aria-hidden="true"
            className="
              h-[15px] w-[15px]
              shrink-0
              text-[#667085]
            "
            strokeWidth={1.8}
          />
        </button>

        {/* Price + CTA */}
        <div
          className="
            mt-3
            flex min-h-[68px]
            items-center
            justify-between
            gap-3

            rounded-[10px]

            border border-[#EAECF0]
            bg-[#F9FAFB]

            px-3
            py-2
          "
        >
          <div className="min-w-0">
            <p
              className="
                font-red-hat-display
                text-[10px] font-extrabold
                uppercase
                leading-[14px]
                tracking-[0.5px]
                text-[#667085]
              "
            >
              {plan.priceLabel}
            </p>

            <div className="mt-[2px]">
              <span
                className="
                  block
                  font-red-hat-display
                  text-[20px] font-extrabold
                  leading-[22px]
                  text-[#101828]
                "
              >
                {plan.price}
              </span>

              <span
                className="
                  block
                  font-red-hat-display
                  text-[12px] font-medium
                  leading-[14px]
                  text-[#667085]
                "
              >
                {plan.pricePeriod}
              </span>
            </div>
          </div>

          <button
            type="button"
            className={`
              inline-flex h-[42px]
              min-w-[155px]
              shrink-0
              items-center
              justify-center
              gap-2

              whitespace-nowrap
              rounded-full

              px-4

              font-red-hat-display
              text-[14px] font-bold
              leading-[20px]
              text-white

              shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

              transition-colors

              ${
                isViewDeal
                  ? `
                    border border-[#0D3B66]
                    bg-[#0D3B66]

                    hover:bg-[#082F4F]
                  `
                  : `
                    border border-[#00897B]
                    bg-[#00897B]

                    hover:bg-[#00796D]
                  `
              }
            `}
          >
            {plan.primaryButton}

            {isViewDeal && (
              <Image
                src={plans.viewDealIcon}
                alt=""
                width={12}
                height={12}
                aria-hidden="true"
                className="
                  h-3 w-3
                  shrink-0
                  object-contain
                "
              />
            )}
          </button>
        </div>
      </article>

      {/* =====================================================
          TABLET CARD ONLY
          SCREENSHOT LAYOUT
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
        {/* Provider top row */}
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
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

          <div
            className="
              min-w-0
              flex-1
              pt-[1px]
            "
          >
            {/* Provider */}
            <h3
              className="
                truncate

                font-red-hat-display
                text-[20px]
                font-extrabold
                leading-[24px]
                text-[#101828]
              "
            >
              {plan.provider}
            </h3>

            {/* Description */}
            <p
              className="
                mt-[1px]
                truncate

                font-red-hat-display
                text-[15px]
                font-medium
                leading-[20px]
                text-[#667085]
              "
            >
              {plan.description}
            </p>

            {/* Rating row */}
            <div
              className="
                mt-[3px]

                flex
                flex-wrap
                items-center
                gap-x-[5px]
                gap-y-1
              "
            >
              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-[1px]
                "
                aria-label="5-star rating"
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
                    aria-hidden="true"
                    className="
                      h-[15px]
                      w-[15px]
                      shrink-0
                      object-contain
                    "
                  />
                ))}
              </div>

              <span
                className="
                  font-red-hat-display
                  text-[15px]
                  font-bold
                  leading-5
                  text-[#101828]
                "
              >
                {plan.rating}
              </span>

              <span
                aria-hidden="true"
                className="
                  text-[15px]
                  font-bold
                  leading-none
                  text-[#98A2B3]
                "
              >
                ·
              </span>

              <span
                className="
                  whitespace-nowrap

                  font-red-hat-display
                  text-[15px]
                  font-medium
                  leading-5
                  text-[#667085]
                "
              >
                {plan.contract}
              </span>
            </div>

            {/* Saving */}
            <span
              className="
                mt-[5px]

                inline-flex
                min-h-[21px]
                items-center
                gap-1

                rounded-full

                bg-[#ECFDF3]

                px-[7px]
                py-[1px]

                font-red-hat-display
                text-[12px]
                font-bold
                leading-[18px]
                text-[#027A48]
              "
            >
              <Image
                src={plans.savingIcon}
                alt=""
                width={13}
                height={13}
                aria-hidden="true"
                className="
                  h-[13px]
                  w-[13px]
                  shrink-0
                  object-contain
                "
              />

              {plan.saving}
            </span>
          </div>
        </div>

        {/* Full width View Details */}
        <button
          type="button"
          onClick={() => {
            onViewDetails(plan);
          }}
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
            leading-[19px]
            text-[#101828]

            shadow-[0px_1px_2px_rgba(16,24,40,0.03)]

            transition-colors

            hover:bg-[#F9FAFB]
          "
        >
          <span>{plan.viewDetailsButton}</span>

          <ChevronDown
            aria-hidden="true"
            className="
              h-[15px]
              w-[15px]
              shrink-0
              text-[#667085]
            "
            strokeWidth={1.8}
          />
        </button>

        {/* Price + CTA row */}
        <div
          className="
            mt-[13px]

            flex
            min-h-[66px]
            items-center
            justify-between
            gap-4

            rounded-[10px]

            border
            border-[#EAECF0]

            bg-[#F9FAFB]

            px-[14px]
            py-[9px]
          "
        >
          {/* Price */}
          <div className="min-w-0">
            <p
              className="
                font-red-hat-display
                text-[10px]
                font-extrabold
                uppercase
                leading-[14px]
                tracking-[0.5px]
                text-[#667085]
              "
            >
              {plan.priceLabel}
            </p>

            <div
              className="
                mt-[2px]

                flex
                items-baseline
                gap-[2px]
              "
            >
              <span
                className="
                  font-red-hat-display
                  text-[20px]
                  font-extrabold
                  leading-[22px]
                  text-[#101828]
                "
              >
                {plan.price}
              </span>

              <span
                className="
                  font-red-hat-display
                  text-[12px]
                  font-medium
                  leading-[14px]
                  text-[#667085]
                "
              >
                {plan.pricePeriod}
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            className={`
              inline-flex
              h-[42px]
              min-w-[175px]
              shrink-0
              items-center
              justify-center
              gap-2

              whitespace-nowrap

              rounded-full

              px-5

              font-red-hat-display
              text-[14px]
              font-bold
              leading-5
              text-white

              shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

              transition-colors

              ${
                isViewDeal
                  ? `
                    border border-[#0D3B66]
                    bg-[#0D3B66]

                    hover:bg-[#082F4F]
                  `
                  : `
                    border border-[#00897B]
                    bg-[#00897B]

                    hover:bg-[#00796D]
                  `
              }
            `}
          >
            {plan.primaryButton}

            {isViewDeal && (
              <Image
                src={plans.viewDealIcon}
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
            )}
          </button>
        </div>
      </article>

      {/* =====================================================
          DESKTOP CARD ONLY
          YOUR EXISTING DESKTOP CARD
      ====================================================== */}
      <article
        className="
          hidden w-full
          rounded-[16px]
          border border-[#EAECF0]
          bg-white
          p-5

          lg:block

          xl:min-h-[159.25px]
          xl:w-[1096px]
          xl:px-5
          xl:py-5
        "
      >
        <div
          className="
            flex flex-row
            items-start
            justify-between
            gap-5

            xl:h-full
            xl:gap-5
          "
        >
          {/* Left */}
          <div
            className="
              flex min-w-0 flex-1
              items-start gap-4

              xl:gap-5
            "
          >
            <Image
              src={plan.logo}
              alt={plan.logoAlt}
              width={72}
              height={72}
              className="
                h-16 w-16
                shrink-0
                object-contain

                xl:h-[72px]
                xl:w-[72px]
              "
            />

            <div className="min-w-0 flex-1">
              <h3
                className="
                  font-red-hat-display
                  text-[18px] font-extrabold
                  leading-[21px]
                  text-[#101828]

                  xl:text-[20px]
                  xl:leading-[21.75px]
                "
              >
                {plan.provider}
              </h3>

              <p
                className="
                  mt-1
                  font-red-hat-display
                  text-[14px] font-medium
                  leading-[18px]
                  text-[#667085]

                  xl:text-[15px]
                  xl:leading-[19.5px]
                "
              >
                {plan.description}
              </p>

              <div
                className="
                  mt-2
                  flex flex-wrap
                  items-center
                  gap-x-2
                  gap-y-1
                "
              >
                <div
                  className="
                    flex shrink-0
                    items-center
                    gap-[2px]

                    xl:gap-[3px]
                  "
                  aria-label="5-star rating"
                >
                  {Array.from({
                    length: STAR_COUNT,
                  }).map((_, index) => (
                    <Image
                      key={`star-${index}`}
                      src={plans.starIcon}
                      alt=""
                      width={16}
                      height={16}
                      aria-hidden="true"
                      className="
                        h-[14px] w-[14px]
                        shrink-0
                        object-contain

                        xl:h-4
                        xl:w-4
                      "
                    />
                  ))}
                </div>

                <span
                  className="
                    font-red-hat-display
                    text-[13px] font-bold
                    leading-5
                    text-[#101828]

                    xl:text-[14px]
                    xl:leading-6
                  "
                >
                  {plan.rating}
                </span>

                <span
                  aria-hidden="true"
                  className="
                    font-red-hat-display
                    text-[15px] font-bold
                    leading-5
                    text-[#98A2B3]

                    xl:text-[16px]
                    xl:leading-6
                  "
                >
                  ·
                </span>

                <span
                  className="
                    font-red-hat-display
                    text-[13px] font-bold
                    leading-5
                    text-[#667085]

                    xl:text-[14px]
                    xl:leading-6
                  "
                >
                  {plan.contract}
                </span>
              </div>

              <div
                className="
                  mt-2
                  flex flex-wrap
                  items-center gap-1.5
                "
              >
                {plan.features.map((feature) => (
                  <span
                    key={feature}
                    className="
                      inline-flex min-h-[20px]
                      items-center

                      rounded-[4px]
                      bg-[#EAF2F8]

                      px-2 py-0.5

                      font-red-hat-display
                      text-[11px] font-extrabold
                      leading-4
                      text-[#105089]

                      xl:min-h-[21.25px]
                      xl:px-[7px]
                      xl:text-[11.5px]
                      xl:leading-[17.25px]
                    "
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div
            className="
              flex w-auto
              min-w-[238px]
              flex-col
              items-end
              gap-3

              xl:min-w-[253px]
              xl:justify-between
            "
          >
            <div className="text-right">
              <p
                className="
                  font-red-hat-display
                  text-[10px] font-extrabold
                  uppercase
                  leading-4
                  tracking-[0.55px]
                  text-[#667085]

                  xl:text-[11px]
                  xl:leading-[16.5px]
                "
              >
                {plan.priceLabel}
              </p>

              <div
                className="
                  mt-0.5
                  flex items-baseline
                  justify-end
                  gap-0.5
                "
              >
                <span
                  className="
                    font-red-hat-display
                    text-[20px] font-extrabold
                    leading-6
                    text-black

                    xl:text-[22px]
                    xl:leading-[24.2px]
                  "
                >
                  {plan.price}
                </span>

                <span
                  className="
                    font-red-hat-display
                    text-[12px] font-medium
                    leading-[14px]
                    text-[#667085]

                    xl:text-[13px]
                    xl:leading-[14.3px]
                  "
                >
                  {plan.pricePeriod}
                </span>
              </div>

              <span
                className="
                  mt-1
                  inline-flex min-h-[21px]
                  items-center gap-1

                  rounded-full
                  bg-[#ECFDF3]

                  px-[7px]
                  py-0.5

                  font-red-hat-display
                  text-[10.5px]
                  font-extrabold
                  leading-[17px]
                  text-[#027A48]

                  xl:text-[11.5px]
                  xl:leading-[17.25px]
                "
              >
                <Image
                  src={plans.savingIcon}
                  alt=""
                  width={12}
                  height={12}
                  aria-hidden="true"
                  className="
                    h-3 w-3
                    shrink-0
                    object-contain
                  "
                />

                {plan.saving}
              </span>
            </div>

            <div
              className="
                flex w-auto
                justify-end
                gap-2
              "
            >
              <button
                type="button"
                onClick={() => {
                  onViewDetails(plan);
                }}
                className="
                  inline-flex h-10
                  min-w-[124px]
                  shrink-0
                  items-center
                  justify-center
                  gap-1

                  whitespace-nowrap
                  rounded-full

                  border border-[#D0D5DD]
                  bg-white

                  px-[14px]

                  font-red-hat-display
                  text-[13px]
                  font-extrabold
                  leading-5
                  text-[#344054]

                  shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                  transition-colors

                  hover:bg-[#F9FAFB]

                  xl:h-9
                  xl:w-[131px]
                  xl:text-[14px]
                "
              >
                {plan.viewDetailsButton}

                <ChevronRight
                  aria-hidden="true"
                  className="
    h-[18px]
    w-[18px]
    shrink-0
    text-[#0D3B66]

    xl:h-[18px]
    xl:w-[18px]
  "
                  strokeWidth={3}
                />
              </button>

              <button
                type="button"
                className={`
                  inline-flex h-10
                  shrink-0
                  items-center
                  justify-center
                  gap-2

                  whitespace-nowrap
                  rounded-full

                  px-[14px]

                  font-red-hat-display
                  text-[13px]
                  font-extrabold
                  leading-5
                  text-white

                  shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

                  transition-colors

                  xl:h-9
                  xl:text-[14px]

                  ${
                    isViewDeal
                      ? `
                        min-w-[112px]

                        border border-[#0D3B66]
                        bg-[#0D3B66]

                        hover:bg-[#082F4F]

                        xl:w-[121px]
                      `
                      : `
                        min-w-[102px]

                        border border-[#00897B]
                        bg-[#00897B]

                        hover:bg-[#00796D]

                        xl:w-[102px]
                      `
                  }
                `}
              >
                {plan.primaryButton}

                {isViewDeal && (
                  <Image
                    src={plans.viewDealIcon}
                    alt=""
                    width={12}
                    height={12}
                    aria-hidden="true"
                    className="
                      h-3 w-3
                      shrink-0
                      object-contain
                    "
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
