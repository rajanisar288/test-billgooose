import Image from 'next/image';

import { ArrowRight, Check, ChevronDown } from 'lucide-react';

import type { FeaturedBroadbandPlan, StandardPlan } from '@/components/result/plan.types';
import data from '@/data/content.json';

type FeaturedBroadbandCardProps = {
  plan: FeaturedBroadbandPlan;
  onViewDetails: (plan: StandardPlan) => void;
};

const STAR_COUNT = 5;

export default function FeaturedBroadbandCard({ plan, onViewDetails }: FeaturedBroadbandCardProps) {
  const { plans } = data.resultPage;

  const drawerPlan: StandardPlan = {
    id: plan.id,
    type: 'select-plan',
    provider: plan.provider,
    description: plan.description,
    logo: plan.logo,
    logoAlt: plan.logoAlt,
    rating: plan.rating,
    contract: plan.contract,
    features: plan.features,
    priceLabel: plan.priceLabel,
    price: plan.price,
    pricePeriod: plan.pricePeriod,
    saving: plan.saving,
    viewDetailsButton: 'View Details',
    primaryButton: 'Select Plan',
  };

  const handleOpenDetails = () => {
    onViewDetails(drawerPlan);
  };

  return (
    <>
      {/* =====================================================
          MOBILE FEATURED BROADBAND CARD
          UNCHANGED
      ====================================================== */}
      <article
        className="
          w-full
          overflow-hidden
          rounded-[16px]
          border border-[#EAECF0]
          bg-white

          shadow-[0px_1px_3px_rgba(16,24,40,0.04)]

          md:hidden
        "
      >
        {/* Featured banner */}
        <div
          className="
            relative
            h-[89px]
            overflow-hidden
            px-3
            py-3
          "
        >
          <Image
            src={plan.featured.backgroundImage}
            alt=""
            fill
            aria-hidden="true"
            className="
              object-cover
              object-center
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute inset-0

              bg-[linear-gradient(90deg,rgba(16,80,137,0.62)_0%,rgba(13,59,102,0.68)_110.03%),linear-gradient(0deg,rgba(0,0,0,0.18),rgba(0,0,0,0.20))]
            "
          />

          <div
            className="
              relative z-10
              flex h-full
              items-center
              gap-3
            "
          >
            <div
              className="
                flex h-[58px]
                w-[58px]
                shrink-0
                items-center
                justify-center

                rounded-[8px]
                bg-white/20
              "
            >
              <Image
                src={plan.featured.icon}
                alt={plan.featured.iconAlt}
                width={52}
                height={52}
                className="
                  h-[52px]
                  w-[52px]
                  object-contain
                "
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  font-red-hat-display
                  text-[11px]
                  font-medium
                  uppercase
                  leading-[15px]
                  tracking-[2px]
                  text-[#64B5F5]
                "
              >
                {plan.featured.eyebrow}
              </p>

              <h3
                className="
                  mt-[2px]

                  font-red-hat-display
                  text-[17px]
                  font-extrabold
                  leading-[21px]
                  text-white
                "
              >
                {plan.featured.heading}
              </h3>

              <p
                className="
                  mt-[2px]

                  font-red-hat-display
                  text-[12px]
                  font-medium
                  leading-[17px]
                  text-white
                "
              >
                {plan.featured.description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile body */}
        <div className="p-3">
          {/* Provider */}
          <div className="flex items-start gap-3">
            <div
              className="
                flex h-[74px]
                w-[74px]
                shrink-0
                items-center
                justify-center

                rounded-[9px]

                border border-[#EAECF0]
                bg-white
              "
            >
              <Image
                src={plan.logo}
                alt={plan.logoAlt}
                width={66}
                height={66}
                className="
                  h-[66px]
                  w-[66px]
                  object-contain
                "
              />
            </div>

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
                {plan.description}
              </p>

              <div
                className="
                  mt-[2px]
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
                      key={`featured-mobile-star-${index}`}
                      src={plans.starIcon}
                      alt=""
                      width={14}
                      height={14}
                      aria-hidden="true"
                      className="
                        h-[14px]
                        w-[14px]
                        shrink-0
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
                    text-[14px]
                    font-medium
                    leading-[20px]
                    text-[#667085]
                  "
                >
                  {plan.contract}
                </span>
              </div>

              <span
                className="
                  mt-[3px]
                  inline-flex min-h-[20px]
                  items-center
                  gap-1

                  rounded-full
                  bg-[#ECFDF3]

                  px-[6px]
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

          {/* View Details */}
          <button
            type="button"
            onClick={handleOpenDetails}
            className="
              mt-4
              flex h-[35px]
              w-full
              items-center
              justify-between

              rounded-[7px]

              border border-[#EAECF0]
              bg-white

              px-2

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
            <span>View Details</span>

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

          {/* Price */}
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
                  flex items-baseline
                  gap-[1px]
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

            <button
              type="button"
              className="
                inline-flex h-[42px]
                min-w-[155px]
                shrink-0
                items-center
                justify-center

                rounded-full

                border border-[#00897B]
                bg-[#00897B]

                px-4

                font-red-hat-display
                text-[14px]
                font-bold
                leading-[20px]
                text-white

                shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

                transition-colors

                hover:bg-[#00796D]
              "
            >
              Select Plan
            </button>
          </div>

          {/* Compare All Broadband */}
          <button
            type="button"
            onClick={handleOpenDetails}
            className="
              mt-3
              inline-flex h-[39px]
              w-full
              items-center
              justify-center
              gap-3

              rounded-full

              border border-[#EAECF0]
              bg-[#F2F4F7]

              px-4

              font-red-hat-display
              text-[14px]
              font-extrabold
              leading-[20px]
              text-[#0D3B66]

              transition-colors

              hover:bg-[#EAECF0]
            "
          >
            <Image
              src={plans.wifiIcon}
              alt=""
              width={15}
              height={12}
              aria-hidden="true"
              className="
                h-[12px]
                w-[15px]
                shrink-0
                object-contain
              "
            />

            <span className="whitespace-nowrap">{plan.primaryButton}</span>

            <ArrowRight
              aria-hidden="true"
              className="
                h-[18px]
                w-[18px]
                shrink-0
                text-[#0D3B66]
              "
              strokeWidth={2}
            />
          </button>
        </div>
      </article>

      {/* =====================================================
          TABLET FEATURED BROADBAND CARD ONLY
          768px - 1023px
      ====================================================== */}
      <article
        className="
          hidden
          w-full
          overflow-hidden

          rounded-[18px]

          border border-[#EAECF0]

          bg-white

          shadow-[0px_1px_3px_rgba(16,24,40,0.04)]

          md:block
          lg:hidden
        "
      >
        {/* Tablet featured banner */}
        <div
          className="
            relative
            h-[92px]
            overflow-hidden

            px-[14px]
            py-[12px]
          "
        >
          <Image
            src={plan.featured.backgroundImage}
            alt=""
            fill
            aria-hidden="true"
            className="
              object-cover
              object-center
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute inset-0

              bg-[linear-gradient(90deg,rgba(3,17,42,0.88)_0%,rgba(2,20,58,0.72)_50%,rgba(6,51,95,0.38)_100%)]
            "
          />

          <div
            className="
              relative z-10

              flex h-full
              items-center
              gap-[14px]
            "
          >
            {/* Featured icon */}
            <div
              className="
                flex h-[60px]
                w-[60px]
                shrink-0
                items-center
                justify-center

                rounded-[8px]

                bg-white/20
              "
            >
              <Image
                src={plan.featured.icon}
                alt={plan.featured.iconAlt}
                width={54}
                height={54}
                className="
                  h-[54px]
                  w-[54px]
                  object-contain
                "
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  font-red-hat-display
                  text-[12px]
                  font-medium
                  uppercase
                  leading-[16px]
                  tracking-[2px]
                  text-[#64B5F5]
                "
              >
                {plan.featured.eyebrow}
              </p>

              <h3
                className="
                  mt-[2px]

                  font-red-hat-display
                  text-[18px]
                  font-extrabold
                  leading-[22px]
                  text-white
                "
              >
                {plan.featured.heading}
              </h3>

              <p
                className="
                  mt-[2px]

                  font-red-hat-display
                  text-[13px]
                  font-medium
                  leading-[18px]
                  text-white
                "
              >
                {plan.featured.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tablet body */}
        <div
          className="
            p-[14px]
          "
        >
          {/* Provider */}
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                flex h-[74px]
                w-[74px]
                shrink-0
                items-center
                justify-center

                rounded-[9px]

                border border-[#EAECF0]

                bg-white
              "
            >
              <Image
                src={plan.logo}
                alt={plan.logoAlt}
                width={66}
                height={66}
                className="
                  h-[66px]
                  w-[66px]
                  object-contain
                "
              />
            </div>

            <div
              className="
                min-w-0
                flex-1
                pt-[1px]
              "
            >
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
                      key={`featured-tablet-star-${index}`}
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

          {/* TABLET VIEW DETAILS -> DRAWER */}
          <button
            type="button"
            onClick={handleOpenDetails}
            className="
              mt-[14px]

              flex h-[35px]
              w-full
              items-center
              justify-between

              rounded-[7px]

              border border-[#EAECF0]

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
            <span>View Details</span>

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

          {/* Price + Select plan */}
          <div
            className="
              mt-[13px]

              flex min-h-[66px]
              items-center
              justify-between
              gap-4

              rounded-[10px]

              border border-[#EAECF0]

              bg-[#F9FAFB]

              px-[14px]
              py-[9px]
            "
          >
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

            <button
              type="button"
              className="
                inline-flex h-[42px]
                min-w-[175px]
                shrink-0
                items-center
                justify-center

                rounded-full

                border border-[#00897B]

                bg-[#00897B]

                px-5

                font-red-hat-display
                text-[14px]
                font-bold
                leading-5
                text-white

                shadow-[0px_1px_2px_rgba(16,24,40,0.05)]

                transition-colors

                hover:bg-[#00796D]
              "
            >
              Select Plan
            </button>
          </div>

          {/* TABLET COMPARE ALL BROADBAND -> SAME DRAWER */}
          <button
            type="button"
            onClick={handleOpenDetails}
            className="
              mt-[13px]

              inline-flex h-[39px]
              w-full
              items-center
              justify-center
              gap-3

              rounded-full

              border border-[#EAECF0]

              bg-[#F2F4F7]

              px-4

              font-red-hat-display
              text-[14px]
              font-extrabold
              leading-5
              text-[#0D3B66]

              transition-colors

              hover:bg-[#EAECF0]
            "
          >
            <Image
              src={plans.wifiIcon}
              alt=""
              width={15}
              height={12}
              aria-hidden="true"
              className="
                h-[12px]
                w-[15px]
                shrink-0
                object-contain
              "
            />

            <span className="whitespace-nowrap">{plan.primaryButton}</span>

            <ArrowRight
              aria-hidden="true"
              className="
                h-[18px]
                w-[18px]
                shrink-0
                text-[#0D3B66]
              "
              strokeWidth={2}
            />
          </button>
        </div>
      </article>

      {/* =====================================================
          DESKTOP ONLY
          ORIGINAL DESKTOP CARD
      ====================================================== */}
      <article
        className="
    hidden
    w-full
    min-w-0

    overflow-hidden

    rounded-[12px]

    border
    border-[#EAECF0]

    bg-white

    lg:block
  "
      >
        {/* Featured banner */}
        <div
          className="
            relative min-h-[112px]
            overflow-hidden
            px-5 py-5

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
            aria-hidden="true"
            className="
              absolute inset-0

              bg-[linear-gradient(90deg,rgba(16,80,137,0.68)_0%,rgba(13,59,102,0.64)_55%,rgba(11,43,67,0.60)_100%)]

              xl:bg-[linear-gradient(90deg,rgba(16,80,137,0.4)_0%,rgba(13,59,102,0.0)_99.03%),linear-gradient(0deg,rgba(0,0,0,0.18),rgba(0,0,0,0.8))]
            "
          />

          <div
            className="
              relative z-10
              flex items-center
              gap-4

              xl:gap-5
            "
          >
            <Image
              src={plan.featured.icon}
              alt={plan.featured.iconAlt}
              width={81}
              height={81}
              className="
                h-[72px]
                w-[72px]
                shrink-0
                object-contain

                xl:h-[81px]
                xl:w-[81px]
              "
            />

            <div className="min-w-0">
              <p
                className="
                  font-red-hat-display
                  text-[11px]
                  font-medium
                  uppercase
                  leading-4
                  tracking-[2px]
                  text-[#64B5F5]

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
                  text-[19px]
                  font-extrabold
                  leading-5
                  text-white

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
                  text-[14px]
                  font-medium
                  leading-[18px]
                  text-[#F2F4F7]

                  xl:text-[15px]
                  xl:leading-[19.5px]
                "
              >
                {plan.featured.description}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop broadband plan */}
        <div className="p-5">
          <div
            className="
              flex flex-row
              items-start
              justify-between
              gap-5
            "
          >
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
                  h-16
                  w-16
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
                    text-[18px]
                    font-extrabold
                    leading-5
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
                    text-[14px]
                    font-medium
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
                          h-[14px]
                          w-[14px]
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
                      text-[13px]
                      font-bold
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
                      text-[15px]
                      font-bold
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
                      text-[13px]
                      font-bold
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
                    gap-1.5
                  "
                >
                  {plan.features.map((feature) => (
                    <span
                      key={feature}
                      className="
                        inline-flex min-h-[20px]
                        items-center
                        gap-1

                        rounded-[4px]
                        bg-[#EAF2F8]

                        px-2
                        py-0.5

                        font-red-hat-display
                        text-[11px]
                        font-extrabold
                        leading-4
                        text-[#105089]

                        xl:min-h-[21.25px]
                        xl:px-[7px]
                        xl:text-[11.5px]
                        xl:leading-[17.25px]
                      "
                    >
                      <Check
                        aria-hidden="true"
                        className="
                          h-[7px]
                          w-[10px]
                          shrink-0
                          text-[#0D3B66]

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
                min-w-[140px]
                shrink-0
                text-right
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

                  xl:text-[11px]
                "
              >
                {plan.priceLabel}
              </p>

              <div
                className="
                  flex items-baseline
                  justify-end
                  gap-0.5
                "
              >
                <span
                  className="
                    font-red-hat-display
                    text-[20px]
                    font-extrabold
                    leading-6
                    text-black

                    xl:text-[22px]
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

                    xl:text-[13px]
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

          {/* Desktop Compare Broadband */}
          <button
            type="button"
            onClick={handleOpenDetails}
            className="
              mt-5
              inline-flex h-10
              w-full
              items-center
              justify-center
              gap-2

              rounded-full

              border border-[#EAECF0]
              bg-[#F2F4F7]

              px-[14px]

              font-red-hat-display
              text-[13px]
              font-extrabold
              leading-5
              text-[#0D3B66]

              transition-colors

              hover:bg-[#EAECF0]

              xl:h-9
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
                h-[10px]
                w-[14px]
                shrink-0
                object-contain
              "
            />

            <span className="whitespace-nowrap">{plan.primaryButton}</span>

            <ArrowRight
              aria-hidden="true"
              className="
                h-4
                w-4
                shrink-0
                text-[#0D3B66]

                xl:h-5
                xl:w-5
              "
              strokeWidth={2}
            />
          </button>
        </div>
      </article>
    </>
  );
}
