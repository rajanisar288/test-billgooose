import Image from 'next/image';

import { ArrowRight, Check } from 'lucide-react';

import type { FeaturedBroadbandPlan } from '@/components/result/plan.types';
import data from '@/data/content.json';

type FeaturedBroadbandCardProps = {
  plan: FeaturedBroadbandPlan;
};

const STAR_COUNT = 5;

export default function FeaturedBroadbandCard({ plan }: FeaturedBroadbandCardProps) {
  const { plans } = data.resultPage;

  return (
    <article
      className="
        w-full overflow-hidden
        rounded-[14px]
        border border-[#EAECF0]
        bg-white

        sm:rounded-[16px]

        xl:min-h-[310.25px]
        xl:w-[1096px]
      "
    >
      {/* Featured banner */}
      <div
        className="
          relative min-h-[128px]
          overflow-hidden
          bg-[linear-gradient(90deg,#105089_0%,#0D3B66_110.03%)]
          px-4 py-5

          sm:min-h-[112px]
          sm:px-5

          xl:h-[112px]
        "
      >
        <Image
          src={plan.featured.backgroundImage}
          alt=""
          fill
          aria-hidden="true"
          className="object-cover"
        />

        <div
          className="
            relative z-10 flex
            items-center gap-4

            xl:gap-5
          "
        >
          <Image
            src={plan.featured.icon}
            alt={plan.featured.iconAlt}
            width={81}
            height={81}
            className="
              h-[64px] w-[64px]
              shrink-0 object-contain

              sm:h-[72px]
              sm:w-[72px]

              xl:h-[81px]
              xl:w-[81px]
            "
          />

          <div className="min-w-0">
            <p
              className="
                font-red-hat-display
                text-[10px] font-medium
                uppercase leading-4
                tracking-[2px]
                text-[#64B5F5]

                sm:text-[11px]

                xl:text-[12px]
                xl:leading-[19.5px]
              "
            >
              {plan.featured.eyebrow}
            </p>

            <h3
              className="
                mt-0.5
                font-red-hat-display
                text-[18px] font-extrabold
                leading-5 text-white

                sm:text-[19px]

                xl:text-[20px]
                xl:leading-[21.75px]
              "
            >
              {plan.featured.heading}
            </h3>

            <p
              className="
                mt-1
                font-red-hat-display
                text-[13px] font-medium
                leading-[18px] text-[#F2F4F7]

                sm:text-[14px]

                xl:text-[15px]
                xl:leading-[19.5px]
              "
            >
              {plan.featured.description}
            </p>
          </div>
        </div>
      </div>

      {/* Broadband plan */}
      <div className="p-4 sm:p-5">
        <div
          className="
            flex flex-col gap-5

            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div
            className="
              flex min-w-0 flex-1
              items-start gap-3

              sm:gap-4

              xl:gap-5
            "
          >
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
                      key={`featured-star-${index}`}
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
                  gap-1.5
                "
              >
                {plan.features.map((feature) => (
                  <span
                    key={feature}
                    className="
                      inline-flex min-h-[20px]
                      items-center gap-1
                      rounded-[4px]
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
                    <Check
                      aria-hidden="true"
                      className="
                        h-[6px] w-[9px]
                        shrink-0 text-[#0D3B66]

                        sm:h-[7px]
                        sm:w-[10px]

                        xl:h-[11px]
                        xl:w-[11px]
                      "
                      strokeWidth={2.2}
                    />

                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className="
              shrink-0 text-left

              sm:min-w-[140px]
              sm:text-right
            "
          >
            <p
              className="
                font-red-hat-display
                text-[10px] font-extrabold
                uppercase leading-4
                tracking-[0.55px]
                text-[#667085]

                xl:text-[11px]
              "
            >
              {plan.priceLabel}
            </p>

            <div
              className="
                flex items-baseline
                gap-0.5 sm:justify-end
              "
            >
              <span
                className="
                  font-red-hat-display
                  text-[20px] font-extrabold
                  leading-6 text-black

                  xl:text-[22px]
                "
              >
                {plan.price}
              </span>

              <span
                className="
                  font-red-hat-display
                  text-[12px] font-medium
                  text-[#667085]

                  xl:text-[13px]
                "
              >
                {plan.pricePeriod}
              </span>
            </div>

            <span
              className="
                mt-1 inline-flex
                items-center gap-1
                rounded-full bg-[#ECFDF3]
                px-[7px] py-0.5

                font-red-hat-display
                text-[10.5px] font-extrabold
                text-[#027A48]

                xl:text-[11.5px]
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
        </div>

        <button
          type="button"
          className="
            mt-5 inline-flex h-10
            w-full items-center
            justify-center gap-2
            rounded-full
            border border-[#EAECF0]
            bg-[#F2F4F7]
            px-[14px]

            font-red-hat-display
            text-[13px] font-extrabold
            leading-5 text-[#0D3B66]

            transition-colors

            hover:bg-[#EAECF0]

            xl:h-9
            xl:w-[1054px]
            xl:text-[14px]
          "
        >
          <Image
            src={plans.wifiIcon}
            alt=""
            width={14}
            height={10}
            aria-hidden="true"
            className="
              h-[10px] w-[14px]
              shrink-0 object-contain
            "
          />

          <span className="whitespace-nowrap">{plan.primaryButton}</span>

          <ArrowRight
            aria-hidden="true"
            className="
              h-4 w-4 shrink-0
              text-[#0D3B66]

              xl:h-5
              xl:w-5
            "
            strokeWidth={2}
          />
        </button>
      </div>
    </article>
  );
}
