'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ArrowDownUp, ChevronDown, ChevronRight, Plus } from 'lucide-react';

import ResultFilters from '@/components/result/result-filters';
import ResultHero from '@/components/result/result-hero';
import data from '@/data/content.json';

/* =========================================================
   TYPES
========================================================= */

type MobileBrand = 'apple' | 'samsung' | 'google' | 'motorola' | 'oppo';

type MobilePhonePlan = {
  id: string;
  name: string;
  provider: string;

  image: string;
  imageAlt: string;

  badges: string[];

  saving: string;
  savingDescription: string;

  data: string;
  startingPrice: string;
  priceRise: string;
  upfrontCost: string;
};

type MobileDeal = {
  id: string;

  name: string;
  provider: string;

  image: string;
  imageAlt: string;

  description: string;

  price: string;
};

type MobileBrandContent = {
  id: MobileBrand;

  label: string;

  icon: string;
  iconAlt: string;

  featuredPlans: MobilePhonePlan[];

  deals: MobileDeal[];
};

type MobileResultsContent = {
  labels: {
    resultsSummary: string;
    phonesFoundSuffix: string;

    sort: string;
    sortDefault: string;

    viewDetails: string;
    seeAllDeals: string;

    loadMore: string;
    noMoreData: string;

    perMonth: string;

    data: string;
    startingPrice: string;
    priceRises: string;
    upfrontCost: string;
  };

  brands: MobileBrandContent[];
};

/* =========================================================
   CONTENT
========================================================= */

const mobileResults = data.resultPage.mobileResults as MobileResultsContent;

/* =========================================================
   COMPONENT
========================================================= */

export default function MobileResults() {
  const router = useRouter();

  const [selectedBrand, setSelectedBrand] = useState<MobileBrand>('apple');

  const [loadMoreClicked, setLoadMoreClicked] = useState(false);

  const selectedBrandContent =
    mobileResults.brands.find((brand) => brand.id === selectedBrand) ?? mobileResults.brands[0];

  if (!selectedBrandContent) {
    return null;
  }

  const featuredPlans = selectedBrandContent.featuredPlans;

  const deals = selectedBrandContent.deals;

  const phoneCount = featuredPlans.length + deals.length;

  const handleBrandSelect = (brand: MobileBrand) => {
    setSelectedBrand(brand);
    setLoadMoreClicked(false);
  };

  /* =========================================================
     DETAILS ROUTING
  ========================================================= */

  const openMobileDetails = (id: string, type: 'featured' | 'deal') => {
    router.push(
      `/mobile-results-details?service=sim-only&brand=${selectedBrand}&type=${type}&id=${encodeURIComponent(
        id,
      )}`,
    );
  };

  return (
    <>
      <ResultHero variant="mobile" />

      <ResultFilters />

      <section
        className="
          mx-auto
          w-full
          max-w-[1440px]

          px-4
          pb-14
          pt-5

          min-[390px]:px-5

          sm:px-6
          sm:pt-6

          md:px-8

          lg:px-[80px]
          lg:pb-20

          xl:px-[112px]
        "
      >
        <div className="mx-auto w-full max-w-none">
          {/* =================================================
              RESULT SUMMARY
          ================================================== */}

          <div>
            <h2
              className="
                font-red-hat-display

                text-[18px]
                font-extrabold
                leading-6

                text-[#101828]

                md:text-[20px]
                md:leading-7
              "
            >
              {mobileResults.labels.resultsSummary}
            </h2>

            <p
              className="
                mt-1

                font-inter
                text-[12px]
                font-normal
                leading-[18px]

                text-[#667085]

                md:text-[13px]
                md:leading-5
              "
            >
              {phoneCount} {mobileResults.labels.phonesFoundSuffix}
            </p>
          </div>

          {/* =================================================
              TABS + SORT
          ================================================== */}

          <div
            className="
              mt-5

              flex
              flex-col

              gap-4

              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div
              className="
                flex
                max-w-full

                items-center

                gap-2

                overflow-x-auto

                pb-1

                [scrollbar-width:none]

                [&::-webkit-scrollbar]:hidden
              "
            >
              {mobileResults.brands.map((brand) => {
                const isActive = selectedBrand === brand.id;

                return (
                  <button
                    key={brand.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      handleBrandSelect(brand.id);
                    }}
                    className={`
                      inline-flex
                      h-[32px]
                      shrink-0

                      items-center
                      justify-center

                      gap-1.5

                      rounded-[6px]

                      border

                      px-[6px]

                      ${
                        isActive
                          ? `
                            border-[#00897B]
                            bg-[#E6F4F2]
                          `
                          : `
                            border-[#EAECF0]
                            bg-white
                          `
                      }
                    `}
                  >
                    <Image
                      src={brand.icon}
                      alt={brand.iconAlt}
                      width={23}
                      height={23}
                      className="
                        h-[23px]
                        w-[23px]
                        shrink-0

                        object-contain
                      "
                    />

                    <span
                      className="
                        font-red-hat-display

                        text-[13px]
                        font-[467]
                        leading-5

                        text-[#101828]
                      "
                    >
                      {brand.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5">
                <ArrowDownUp
                  aria-hidden="true"
                  className="h-4 w-4 text-[#344054]"
                  strokeWidth={1.7}
                />

                <span
                  className="
                    font-red-hat-display
                    text-[12px]
                    font-medium
                    leading-5
                    text-[#344054]
                  "
                >
                  {mobileResults.labels.sort}
                </span>
              </div>

              <button
                type="button"
                className="
                  inline-flex
                  h-[34px]
                  min-w-[130px]

                  items-center
                  justify-between

                  gap-2

                  rounded-[6px]

                  border
                  border-[#D0D5DD]

                  bg-white

                  px-3

                  font-red-hat-display
                  text-[12px]
                  font-normal
                  leading-5

                  text-[#667085]

                  shadow-[0px_1px_2px_0px_#1018280D]
                "
              >
                {mobileResults.labels.sortDefault}

                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </button>
            </div>
          </div>

          {/* =================================================
              FEATURED TWO
          ================================================== */}

          <div className="mt-7 space-y-4">
            {featuredPlans.map((plan) => (
              <MobilePhoneCard
                key={plan.id}
                plan={plan}
                labels={mobileResults.labels}
                onViewDetails={() => {
                  openMobileDetails(plan.id, 'featured');
                }}
              />
            ))}
          </div>

          {/* =================================================
              SMALL DEALS
          ================================================== */}

          <div
            className="
              mt-8

              grid
              grid-cols-1

              gap-4

              sm:grid-cols-2
              sm:gap-5

              lg:mt-10
              lg:grid-cols-3
              lg:gap-5

              xl:gap-6
            "
          >
            {deals.map((deal) => (
              <MobileDealCard
                key={deal.id}
                deal={deal}
                labels={mobileResults.labels}
                onSeeDeals={() => {
                  openMobileDetails(deal.id, 'deal');
                }}
              />
            ))}
          </div>

          {/* =================================================
              LOAD MORE
          ================================================== */}

          <div
            className="
              relative

              mt-10

              flex
              w-full

              items-center
              justify-center

              sm:mt-12

              lg:mt-14
            "
          >
            <span
              aria-hidden="true"
              className="
                absolute
                left-0
                right-[calc(50%+90px)]
                top-1/2

                h-px

                bg-[#EAECF0]
              "
            />

            <span
              aria-hidden="true"
              className="
                absolute
                left-[calc(50%+90px)]
                right-0
                top-1/2

                h-px

                bg-[#EAECF0]
              "
            />

            {!loadMoreClicked ? (
              <button
                type="button"
                onClick={() => {
                  setLoadMoreClicked(true);
                }}
                className="btn-load-more"
              >
                <Plus
                  aria-hidden="true"
                  strokeWidth={2}
                />

                {mobileResults.labels.loadMore}
              </button>
            ) : (
              <div
                className="
                  relative
                  z-10

                  rounded-full

                  bg-[#F8F9FA]

                  px-5
                  py-2

                  font-red-hat-display

                  text-[13px]
                  font-medium

                  text-[#667085]
                "
              >
                {mobileResults.labels.noMoreData}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   FEATURED PHONE CARD
========================================================= */

type MobilePhoneCardProps = {
  plan: MobilePhonePlan;
  labels: MobileResultsContent['labels'];
  onViewDetails: () => void;
};

function MobilePhoneCard({ plan, labels, onViewDetails }: MobilePhoneCardProps) {
  return (
    <article
      className="
        w-full
        overflow-hidden
        rounded-[14px]
        border
        border-[#EAECF0]
        bg-white
        shadow-[0px_1px_2px_0px_#1018280D]
      "
    >
      <div
        className="
          flex
          flex-col

          lg:h-[207px]
          lg:flex-row
        "
      >
        <div
          className="
            flex
            min-h-[180px]
            w-full
            shrink-0

            items-center
            justify-center

            border-b
            border-[#EAECF0]

            bg-white

            p-4

            sm:min-h-[200px]

            lg:h-[207px]
            lg:min-h-0
            lg:w-[217px]

            lg:border-b-0
            lg:border-r

            lg:p-0
          "
        >
          <Image
            src={plan.image}
            alt={plan.imageAlt}
            width={166}
            height={166}
            className="
              h-[150px]
              w-[150px]

              object-contain

              sm:h-[166px]
              sm:w-[166px]
            "
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className="
              flex
              min-h-[113px]
              flex-col

              md:flex-row
            "
          >
            <div
              className="
                min-w-0
                flex-1

                p-4

                sm:p-5

                lg:px-4
                lg:py-4
              "
            >
              <h3
                className="
                  font-red-hat-display

                  text-[20px]
                  font-[645]
                  leading-[21.75px]

                  text-[#101828]
                "
              >
                {plan.name}
              </h3>

              <p
                className="
                  mt-1

                  font-red-hat-display

                  text-[13px]
                  font-[467]
                  leading-[19.5px]

                  text-[#667085]
                "
              >
                {plan.provider}
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {plan.badges.map((badge) => (
                  <span
                    key={badge}
                    className="
                      inline-flex
                      min-h-[21px]
                      items-center
                      justify-center
                      rounded-[3px]
                      bg-[#EEF4FA]
                      px-1.5
                      font-red-hat-display
                      text-[10px]
                      font-bold
                      leading-[15px]
                      text-[#105089]
                    "
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="
                flex
                shrink-0
                items-center
                px-4
                pb-4

                md:w-[145px]
                md:px-3
                md:py-3
              "
            >
              <div
                className="
                  flex
                  min-h-[75px]
                  w-full
                  flex-col
                  justify-center
                  rounded-[8px]
                  border
                  border-[#6CE9A6]
                  bg-[#F6FEF9]
                  px-3
                  py-2
                "
              >
                <p
                  className="
                    font-red-hat-display
                    text-[20px]
                    font-bold
                    leading-6
                    text-[#039855]
                  "
                >
                  {plan.saving}
                </p>

                <p
                  className="
                    mt-[2px]
                    font-red-hat-display
                    text-[9px]
                    font-medium
                    leading-[12px]
                    text-[#027A48]
                  "
                >
                  {plan.savingDescription}
                </p>
              </div>
            </div>

            <div
              className="
                flex
                min-h-[76px]
                shrink-0
                items-center
                justify-center
                border-t
                border-[#EAECF0]
                px-4

                md:w-[160px]
                md:border-l
                md:border-t-0
              "
            >
              <button
                type="button"
                onClick={onViewDetails}
                className="btn-view-details"
              >
                {labels.viewDetails}

                <ChevronRight
                  aria-hidden="true"
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-3
              border-t
              border-[#EAECF0]
              p-4

              sm:grid-cols-2

              lg:h-[93px]
              lg:grid-cols-4
            "
          >
            <MobileMetricCard
              label={labels.data}
              value={plan.data}
            />

            <MobileMetricCard
              label={labels.startingPrice}
              value={plan.startingPrice}
            />

            <MobileMetricCard
              label={labels.priceRises}
              value={plan.priceRise}
            />

            <MobileMetricCard
              label={labels.upfrontCost}
              value={plan.upfrontCost}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   METRIC
========================================================= */

function MobileMetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
        flex
        min-h-[61px]
        flex-col
        justify-center
        rounded-[8px]
        border
        border-[#EAECF0]
        bg-[#F9FAFB]
        px-3
        py-[10px]
      "
    >
      <p
        className="
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
          mt-[1px]
          font-red-hat-display
          text-[14px]
          font-[645]
          leading-[21px]
          tracking-[-0.01em]
          text-[#101828]
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SMALL DEAL CARD
========================================================= */

type MobileDealCardProps = {
  deal: MobileDeal;
  labels: MobileResultsContent['labels'];
  onSeeDeals: () => void;
};

function MobileDealCard({ deal, labels, onSeeDeals }: MobileDealCardProps) {
  return (
    <article
      className="
        flex
        w-full
        flex-col
        overflow-hidden
        rounded-[14px]
        border
        border-[#EAECF0]
        bg-white
        shadow-[0px_1px_2px_0px_#10182808]

        sm:rounded-[16px]

        lg:min-h-[459px]
      "
    >
      <div
        className="
          flex
          min-h-[230px]
          w-full
          flex-1
          items-center
          justify-center
          bg-white
          px-5
          py-5

          min-[390px]:min-h-[250px]

          sm:min-h-[270px]

          md:min-h-[285px]

          lg:h-[322px]
          lg:min-h-[322px]
          lg:flex-none
        "
      >
        <Image
          src={deal.image}
          alt={deal.imageAlt}
          width={211}
          height={260}
          className="
            h-[190px]
            w-[160px]
            object-contain

            min-[390px]:h-[210px]
            min-[390px]:w-[175px]

            sm:h-[225px]
            sm:w-[185px]

            lg:h-[260px]
            lg:w-[211px]
          "
        />
      </div>

      <div
        className="
          min-h-[136px]
          border-t
          border-[#EAECF0]
          bg-[#F9FAFB]
          px-3
          pb-3
          pt-[10px]

          sm:px-[14px]
          sm:pb-[14px]
        "
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="
                truncate
                font-red-hat-display
                text-[16px]
                font-[645]
                leading-[18px]
                text-[#101828]

                sm:text-[17px]

                lg:text-[18px]
              "
            >
              {deal.name}
            </h3>

            <p
              className="
                mt-1
                truncate
                font-inter
                text-[12px]
                font-normal
                leading-4
                text-[#475467]

                sm:text-[13px]

                lg:text-[14px]
              "
            >
              {deal.description}
            </p>
          </div>

          <Image
            src="/images/green-mobile.png"
            alt=""
            width={34}
            height={34}
            aria-hidden="true"
            className="
              h-[34px]
              w-[34px]
              shrink-0
              object-contain
            "
          />
        </div>

        <div
          className="
            mt-[10px]
            flex
            min-h-[59px]
            w-full
            items-center
            justify-between
            gap-2
            rounded-[10px]
            border
            border-[#EAECF0]
            bg-white
            px-2.5
            py-2

            sm:px-3
            sm:py-[10px]
          "
        >
          <div className="min-w-0 flex-1">
            <p
              className="
                font-inter
                text-[14px]
                font-semibold
                leading-5
                tracking-[-0.15px]
                text-[#00897B]

                lg:text-[16px]
              "
            >
              {deal.price}
            </p>

            <p
              className="
                font-inter
                text-[10px]
                font-normal
                leading-4
                text-[#475467]

                sm:text-[11px]

                lg:text-[12px]
              "
            >
              {labels.perMonth}
            </p>
          </div>

          <button
            type="button"
            onClick={onSeeDeals}
            className="btn-see-all-deals"
          >
            {labels.seeAllDeals}

            <ChevronRight
              aria-hidden="true"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
