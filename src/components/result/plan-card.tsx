import Image from 'next/image';

import { ChevronRight } from 'lucide-react';

import type { StandardPlan } from '@/components/result/plan.types';
import data from '@/data/content.json';

type PlanCardProps = {
  plan: StandardPlan;
};

const STAR_COUNT = 5;

export default function PlanCard({ plan }: PlanCardProps) {
  const { plans } = data.resultPage;

  const isViewDeal = plan.type === 'view-deal';

  return (
    <article
      className="
        w-full rounded-[14px]
        border border-[#EAECF0]
        bg-white p-4

        sm:rounded-[16px]
        sm:p-5

        xl:min-h-[159.25px]
        xl:w-[1096px]
        xl:px-5
        xl:py-5
      "
    >
      <div
        className="
          flex flex-col gap-5

          sm:flex-row
          sm:items-start
          sm:justify-between

          xl:h-full
          xl:gap-5
        "
      >
        {/* Provider information */}
        <div
          className="
            flex min-w-0 flex-1
            items-start gap-3

            sm:gap-4

            xl:gap-5
          "
        >
          {/* Provider image without background wrapper */}
          <Image
            src={plan.logo}
            alt={plan.logoAlt}
            width={72}
            height={72}
            className="
              h-[56px] w-[56px]
              shrink-0 object-contain

              sm:h-16
              sm:w-16

              xl:h-[72px]
              xl:w-[72px]
            "
          />

          <div className="min-w-0 flex-1">
            <h3
              className="
                font-red-hat-display
                text-[17px] font-extrabold
                leading-5 text-[#101828]

                sm:text-[18px]
                sm:leading-[21px]

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
                text-[13px] font-medium
                leading-[18px] text-[#667085]

                sm:text-[14px]

                xl:text-[15px]
                xl:leading-[19.5px]
              "
            >
              {plan.description}
            </p>

            <div
              className="
                mt-2 flex flex-wrap
                items-center gap-x-2
                gap-y-1
              "
            >
              {/* Five individual stars */}
              <div
                className="
                  flex shrink-0
                  items-center gap-[2px]

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
                      h-[13px] w-[13px]
                      shrink-0 object-contain

                      sm:h-[14px]
                      sm:w-[14px]

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
                  leading-5 text-[#101828]

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
                  leading-5 text-[#98A2B3]

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
                  leading-5 text-[#667085]

                  xl:text-[14px]
                  xl:leading-6
                "
              >
                {plan.contract}
              </span>
            </div>

            <div
              className="
                mt-2 flex flex-wrap
                items-center gap-1.5
              "
            >
              {plan.features.map((feature) => (
                <span
                  key={feature}
                  className="
                    inline-flex min-h-[20px]
                    items-center rounded-[4px]
                    bg-[#EAF2F8]
                    px-2 py-0.5

                    font-red-hat-display
                    text-[10px] font-extrabold
                    leading-4 text-[#105089]

                    sm:text-[11px]

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

        {/* Price and actions */}
        <div
          className="
            flex w-full flex-col
            gap-3

            sm:w-auto
            sm:min-w-[238px]
            sm:items-end

            xl:min-w-[253px]
            xl:justify-between
          "
        >
          <div className="text-left sm:text-right">
            <p
              className="
                font-red-hat-display
                text-[10px] font-extrabold
                uppercase leading-4
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
                mt-0.5 flex items-baseline
                gap-0.5 sm:justify-end
              "
            >
              <span
                className="
                  font-red-hat-display
                  text-[20px] font-extrabold
                  leading-6 text-black

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
                  leading-[14px] text-[#667085]

                  xl:text-[13px]
                  xl:leading-[14.3px]
                "
              >
                {plan.pricePeriod}
              </span>
            </div>

            <span
              className="
                mt-1 inline-flex min-h-[21px]
                items-center gap-1
                rounded-full bg-[#ECFDF3]
                px-[7px] py-0.5

                font-red-hat-display
                text-[10.5px] font-extrabold
                leading-[17px] text-[#027A48]

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
                  h-3 w-3 shrink-0
                  object-contain
                "
              />

              {plan.saving}
            </span>
          </div>

          <div
            className="
              flex w-full flex-col gap-2

              min-[390px]:flex-row

              sm:w-auto
              sm:justify-end
            "
          >
            <button
              type="button"
              className="
                inline-flex h-10 w-full
                shrink-0 items-center
                justify-center gap-2
                whitespace-nowrap
                rounded-full
                border border-[#D0D5DD]
                bg-white px-[14px]

                font-red-hat-display
                text-[13px] font-extrabold
                leading-5 text-[#344054]

                shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                transition-colors

                hover:bg-[#F9FAFB]

                min-[390px]:w-auto
                min-[390px]:min-w-[124px]

                xl:h-9
                xl:w-[131px]
                xl:text-[14px]
              "
            >
              {plan.viewDetailsButton}

              <ChevronRight
                aria-hidden="true"
                className="
                  h-5 w-2 shrink-0
                  text-[#0D3B66]

                  xl:h-[15px]
                  xl:w-[15px]
                "
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
              className={`
                inline-flex h-10 w-full
                shrink-0 items-center
                justify-center gap-2
                whitespace-nowrap
                rounded-full px-[14px]

                font-red-hat-display
                text-[13px] font-extrabold
                leading-5 text-white

                shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                transition-colors

                min-[390px]:w-auto

                xl:h-9
                xl:text-[14px]

                ${
                  isViewDeal
                    ? 'border border-[#0D3B66] bg-[#0D3B66] hover:bg-[#082F4F] min-[390px]:min-w-[112px] xl:w-[121px]'
                    : 'border border-[#00897B] bg-[#00897B] hover:bg-[#00796D] min-[390px]:min-w-[102px] xl:w-[102px]'
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
                    h-3 w-3 shrink-0
                    object-contain
                  "
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
