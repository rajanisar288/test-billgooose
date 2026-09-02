'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronLeft, ChevronRight, Globe2 } from 'lucide-react';

import ResultPlans from '@/components/result/result-plans';
import ResultsStatus from '@/components/result/results-status';
import data from '@/data/content.json';

/* =========================================================
   TYPES
========================================================= */

type MobileBrand = 'apple' | 'samsung' | 'google' | 'motorola' | 'oppo';

type ItemType = 'featured' | 'deal';

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

type BrandContent = {
  id: MobileBrand;

  label: string;

  icon: string;
  iconAlt: string;

  featuredPlans: MobilePhonePlan[];

  deals: MobileDeal[];
};

type Option = {
  id: string;
  label: string;
  value: string;
};

type ColourOption = Option & {
  colour: string;
};

type ExclusivePlan = {
  badge: string;

  provider: string;
  networkDescription: string;

  logo: string;
  logoAlt: string;
  providerUrl: string;

  badges: string[];

  primaryPriceLabel: string;
  primaryPrice: string;

  dataLabel: string;
  data: string;

  secondaryPriceLabel: string;
  secondaryPrice: string;

  roaming: string;

  button: string;
};

type MobileResultsContent = {
  brands: BrandContent[];

  detailsPage: {
    breadcrumb: {
      mobile: string;
      yearSuffix: string;
      dealSuffix: string;
    };

    buyingOption: {
      label: string;
      value: string;
      defaultValue: string;
      options: Option[];
    };

    storage: {
      label: string;
      defaultValue: string;
      options: Option[];
    };

    colour: {
      label: string;
      defaultValue: string;
      options: ColourOption[];
    };

    exclusivePlan: ExclusivePlan;
  };
};

type MobileResultsDetailsProps = {
  brand: string;
  itemType: ItemType;
  itemId: string;
};

const mobileResults = data.resultPage.mobileResults as MobileResultsContent;

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MobileResultsDetails({
  brand,
  itemType,
  itemId,
}: MobileResultsDetailsProps) {
  const router = useRouter();
  const details = mobileResults.detailsPage;

  const selectedBrand = useMemo(
    () => mobileResults.brands.find((item) => item.id === brand) ?? mobileResults.brands[0],
    [brand],
  );

  const selectedItem = useMemo(() => {
    if (!selectedBrand) {
      return null;
    }

    if (itemType === 'featured') {
      return (
        selectedBrand.featuredPlans.find((item) => item.id === itemId) ??
        selectedBrand.featuredPlans[0] ??
        null
      );
    }

    return selectedBrand.deals.find((item) => item.id === itemId) ?? selectedBrand.deals[0] ?? null;
  }, [itemId, itemType, selectedBrand]);

  const [selectedBuyingOption, setSelectedBuyingOption] = useState(
    details.buyingOption.defaultValue,
  );

  const [selectedStorage, setSelectedStorage] = useState(details.storage.defaultValue);

  const [selectedColour, setSelectedColour] = useState(details.colour.defaultValue);

  if (!selectedBrand || !selectedItem) {
    return null;
  }

  const phoneName = selectedItem.name;

  const relatedDealsHeading = `List of ${phoneName} deals`;

  const relatedDealsDescription = 'Deals not available as upgrades for existing customers';

  const handleMobileDetailsProviderRedirect = (plan: ExclusivePlan) => {
    if (!plan.providerUrl) {
      return;
    }

    sessionStorage.setItem('externalRedirectUrl', plan.providerUrl);
    sessionStorage.setItem('externalRedirectProvider', plan.provider);
    sessionStorage.setItem('externalRedirectService', 'sim-only');
    sessionStorage.setItem('externalRedirectOrigin', 'mobile-details');

    sessionStorage.setItem(
      'journeySelectedPlan',
      JSON.stringify({
        ...plan,
        service: 'sim-only',
      }),
    );

    sessionStorage.setItem('billgooseJourneyService', 'sim-only');
    sessionStorage.setItem('billgooseJourneyFlow', 'sim-only');

    router.push('/redirecting?service=sim-only');
  };

  return (
    <>
      {/* =====================================================
          BREADCRUMB
      ====================================================== */}
      <nav
        aria-label="Breadcrumb"
        className="
          w-full
          border-b
          border-t
          border-[#EAECF0]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[46px]
            w-full
            max-w-[1440px]
            items-center
            gap-2
            overflow-x-auto
            px-4
            font-inter
            text-[12px]
            font-normal
            leading-4
            text-[#667085]

            min-[390px]:px-5

            sm:px-8

            lg:px-10

            xl:px-[45px]
          "
        >
          <Link
            href="/result?service=mobile"
            className="
              shrink-0
              transition-colors
              hover:text-[#00897B]
            "
          >
            {details.breadcrumb.mobile}
          </Link>

          <ChevronRight
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={1.8}
          />

          <span className="shrink-0">
            {selectedBrand.label} {details.breadcrumb.yearSuffix}
          </span>

          <ChevronRight
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={1.8}
          />

          <span className="truncate text-[#475467]">
            {phoneName} {details.breadcrumb.dealSuffix}
          </span>
        </div>
      </nav>

      {/* =====================================================
          PHONE DETAILS
      ====================================================== */}
      <section
        className="
          mx-auto
          w-full
          max-w-[1440px]

          px-4
          pb-12
          pt-7

          min-[390px]:px-5

          sm:px-8
          sm:pt-9

          lg:px-10
          lg:pt-10

          xl:px-[45px]
        "
      >
        <div
          className="
            grid
            grid-cols-1

            gap-8

            md:grid-cols-2
            md:items-start

            lg:grid-cols-[minmax(300px,424px)_minmax(300px,1fr)]

            xl:grid-cols-[424px_minmax(330px,1fr)_353px]
            xl:gap-[38px]
          "
        >
          {/* PHONE IMAGE */}
          <div
            className="
              flex
              min-h-[330px]
              w-full

              items-center
              justify-center

              overflow-hidden

              rounded-[14px]

              border
              border-[#EAECF0]

              bg-[#FCFCFD]

              p-5

              sm:min-h-[390px]

              lg:h-[445px]
              lg:min-h-[445px]
              lg:rounded-[16px]

              xl:w-[424px]
            "
          >
            <Image
              src={selectedItem.image}
              alt={selectedItem.imageAlt}
              width={302}
              height={374}
              priority
              className="
                h-[280px]
                w-[230px]

                object-contain

                sm:h-[330px]
                sm:w-[270px]

                lg:h-[374px]
                lg:w-[302px]
              "
            />
          </div>

          {/* CONFIGURATION */}
          <div
            className="
              flex
              min-w-0
              flex-col
              justify-center

              md:min-h-[390px]

              lg:min-h-[445px]
            "
          >
            <div className="flex items-center gap-1.5">
              <Image
                src={selectedBrand.icon}
                alt={selectedBrand.iconAlt}
                width={15}
                height={15}
                className="
                  h-[15px]
                  w-[15px]
                  shrink-0
                  rounded-[54.74px]
                  object-contain
                "
              />

              <span
                className="
                  font-inter
                  text-[16px]
                  font-normal
                  leading-4
                  text-[#667085]
                "
              >
                {selectedBrand.label}
              </span>
            </div>

            <h1
              className="
                mt-3
                font-red-hat-display
                text-[28px]
                font-[645]
                leading-[30px]
                text-black

                sm:text-[30px]
                sm:leading-[32px]

                lg:text-[34px]
                lg:leading-[34px]
              "
            >
              {phoneName} deals
            </h1>

            {/* BUYING OPTION */}
            <div className="mt-7">
              <p className="font-inter text-[14px] leading-[14px]">
                <span className="font-medium text-[#101828]">{details.buyingOption.label}</span>{' '}
                <span className="font-normal text-[#475467]">{details.buyingOption.value}</span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {details.buyingOption.options.map((option) => {
                  const isActive = selectedBuyingOption === option.value;

                  return (
                    <ConfigOption
                      key={option.id}
                      label={option.label}
                      active={isActive}
                      onClick={() => {
                        setSelectedBuyingOption(option.value);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* STORAGE */}
            <div className="mt-7">
              <p className="font-inter text-[14px] leading-[14px]">
                <span className="font-medium text-[#101828]">{details.storage.label}</span>{' '}
                <span className="font-normal text-[#475467]">{selectedStorage}</span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {details.storage.options.map((option) => (
                  <ConfigOption
                    key={option.id}
                    label={option.label}
                    active={selectedStorage === option.value}
                    onClick={() => {
                      setSelectedStorage(option.value);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* COLOUR */}
            <div className="mt-7">
              <p className="font-inter text-[14px] leading-[14px]">
                <span className="font-medium text-[#101828]">{details.colour.label}</span>{' '}
                <span className="font-normal text-[#475467]">
                  {details.colour.options.find((option) => option.value === selectedColour)?.label}
                </span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {details.colour.options.map((option) => {
                  const isActive = selectedColour === option.value;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedColour(option.value);
                      }}
                      className={`
                        inline-flex
                        min-h-[38px]
                        items-center
                        justify-center
                        gap-2
                        rounded-[7px]
                        border
                        px-3
                        font-red-hat-display
                        text-[14px]
                        font-medium
                        leading-5

                        ${
                          isActive
                            ? `
                              border-[#00897B]
                              bg-[#F2FAF9]
                              text-[#00897B]
                            `
                            : `
                              border-[#EAECF0]
                              bg-white
                              text-[#101828]
                            `
                        }
                      `}
                    >
                      <span
                        aria-hidden="true"
                        className="
                          h-[16px]
                          w-[16px]
                          rounded-[3px]
                          border
                          border-[#D0D5DD]
                        "
                        style={{
                          backgroundColor: option.colour,
                        }}
                      />

                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <ExclusiveMobilePlan
            plan={details.exclusivePlan}
            onBuyNow={() => {
              handleMobileDetailsProviderRedirect(details.exclusivePlan);
            }}
          />
        </div>
      </section>

      {/* =====================================================
          SPONSORED SLIDER
      ====================================================== */}
      <SponsoredPlansSlider
        plan={details.exclusivePlan}
        onBuyNow={(plan) => {
          handleMobileDetailsProviderRedirect(plan);
        }}
      />

      {/* =====================================================
          RELATED SIM-ONLY RESULTS

          Reuses your EXISTING:
          - ResultsStatus
          - ResultFilterSidebar
          - ResultPlans
          - SimOnlyCard
          - More Info drawer
          - View Deal redirect

          Only the heading and description change.
      ====================================================== */}
      <section
        className="
          w-full
          bg-[#F8F9FA]

          pt-1
          pb-8

          sm:pt-2

          lg:pt-6
          lg:pb-12
        "
      >
        {/* MOBILE + TABLET */}
        <ResultsStatus
          heading={relatedDealsHeading}
          description={relatedDealsDescription}
        />

        {/* MOBILE + TABLET CARDS / DESKTOP FULL FILTER + CARDS */}
        <ResultPlans
          serviceOverride="sim-only"
          redirectOrigin="mobile-details"
          heading={relatedDealsHeading}
          description={relatedDealsDescription}
        />
      </section>
    </>
  );
}

/* =========================================================
   CONFIG OPTION
========================================================= */

type ConfigOptionProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function ConfigOption({ label, active, onClick }: ConfigOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        min-h-[38px]

        items-center
        justify-center

        rounded-[7px]

        border

        px-4

        font-red-hat-display

        text-[14px]
        font-medium
        leading-5

        ${
          active
            ? `
              border-[#00897B]
              bg-[#F2FAF9]
              text-[#00897B]
            `
            : `
              border-[#EAECF0]
              bg-white
              text-[#101828]
            `
        }
      `}
    >
      {label}
    </button>
  );
}

/* =========================================================
   EXCLUSIVE PLAN
========================================================= */

type ExclusivePlanProps = {
  plan: ExclusivePlan;
  onBuyNow: () => void;
};

function ExclusiveMobilePlan({ plan, onBuyNow }: ExclusivePlanProps) {
  return (
    <aside
      className="
        relative
        w-full
        overflow-visible
        rounded-[16px]
        border
        border-[#EAECF0]
        bg-white
        shadow-[0px_4px_30px_0px_#0000000F]

        md:col-span-2

        xl:col-span-1
        xl:h-[394px]
        xl:w-[353px]
      "
    >
      <span
        className="
          absolute
          left-5
          top-[-23px]
          inline-flex
          h-[23px]
          items-center
          rounded-t-[7px]
          bg-[#105089]
          px-2
          font-red-hat-display
          text-[10px]
          font-bold
          leading-4
          text-white
        "
      >
        ★ {plan.badge}
      </span>

      <div
        className="
          flex
          min-h-[91px]
          items-center
          gap-3
          border-b
          border-[#EAECF0]
          p-4
        "
      >
        <Image
          src={plan.logo}
          alt={plan.logoAlt}
          width={56}
          height={56}
          className="
            h-[56px]
            w-[56px]
            shrink-0
            object-contain
          "
        />

        <div>
          <h2
            className="
              font-red-hat-display
              text-[20px]
              font-bold
              leading-[21.75px]
              text-[#101828]
            "
          >
            {plan.provider}
          </h2>

          <p
            className="
              mt-[2px]
              font-red-hat-display
              text-[15px]
              font-medium
              leading-[19.5px]
              text-[#667085]
            "
          >
            {plan.networkDescription}
          </p>
        </div>
      </div>

      <div className="p-4">
        <SimBadges badges={plan.badges} />

        <div
          className="
            mt-3
            rounded-[7px]
            border
            border-[#105089]
            bg-[#FCFCFD]
            px-3
            py-[10px]
          "
        >
          <PlanLabel>{plan.primaryPriceLabel}</PlanLabel>

          <PlanValue>{plan.primaryPrice}</PlanValue>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <PlanMetric
            label={plan.dataLabel}
            value={plan.data}
          />

          <PlanMetric
            label={plan.secondaryPriceLabel}
            value={plan.secondaryPrice}
          />
        </div>

        <RoamingRow text={plan.roaming} />

        <button
          type="button"
          onClick={onBuyNow}
          className="
            mt-3
            inline-flex
            h-[36px]
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
            leading-5
            text-white
            transition-colors
            hover:bg-[#00796D]
          "
        >
          {plan.button}
        </button>
      </div>
    </aside>
  );
}

/* =========================================================
   SPONSORED SLIDER
========================================================= */

type SponsoredPlansSliderProps = {
  plan: ExclusivePlan;
  onBuyNow: (plan: ExclusivePlan) => void;
};

function SponsoredPlansSlider({ plan, onBuyNow }: SponsoredPlansSliderProps) {
  const CARD_GAP = 30;

  const firstCardRef = useRef<HTMLElement | null>(null);

  const [cardStep, setCardStep] = useState(742);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [enableTransition, setEnableTransition] = useState(true);

  const [isHovered, setIsHovered] = useState(false);

  const sponsoredPlans = useMemo(
    () => [
      {
        id: 'sponsored-1',
        plan,
      },
      {
        id: 'sponsored-2',
        plan,
      },
      {
        id: 'sponsored-3',
        plan,
      },
    ],
    [plan],
  );

  const infinitePlans = useMemo(
    () => [
      ...sponsoredPlans,

      ...sponsoredPlans.map((item) => ({
        ...item,
        id: `${item.id}-duplicate`,
      })),
    ],
    [sponsoredPlans],
  );

  useEffect(() => {
    const card = firstCardRef.current;

    if (!card) {
      return;
    }

    const updateSize = () => {
      const width = card.getBoundingClientRect().width;

      setCardStep(width + CARD_GAP);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, []);

  const goNext = () => {
    setEnableTransition(true);
    setCurrentIndex((current) => current + 1);
  };

  const goPrevious = () => {
    if (currentIndex === 0) {
      setEnableTransition(false);

      setCurrentIndex(sponsoredPlans.length);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setEnableTransition(true);
          setCurrentIndex(sponsoredPlans.length - 1);
        });
      });

      return;
    }

    setEnableTransition(true);
    setCurrentIndex((current) => current - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex === sponsoredPlans.length) {
      setEnableTransition(false);

      setCurrentIndex(0);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });
    }
  };

  useEffect(() => {
    if (isHovered) {
      return;
    }

    const timer = window.setInterval(() => {
      setEnableTransition(true);
      setCurrentIndex((current) => current + 1);
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isHovered]);

  return (
    <section
      className="
        mx-auto
        w-full
        max-w-[1440px]

        px-4
        pb-14

        min-[390px]:px-5

        sm:px-8

        lg:px-10
        lg:pb-20

        xl:px-[60px]
      "
    >
      <div
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        className="
          relative
          w-full
          overflow-hidden
          rounded-[16px]
          bg-[#0B2B43]
          px-3
          pb-4
          pt-3

          shadow-[6px_4px_16px_0px_#9E9E9E1A,23px_17px_28px_0px_#9E9E9E17,52px_38px_38px_0px_#9E9E9E0D,92px_67px_46px_0px_#9E9E9E03]

          sm:rounded-[18px]
          sm:px-5
          sm:pb-5
          sm:pt-4

          lg:h-[365px]
          lg:rounded-[20px]
          lg:px-[30px]
          lg:pb-[30px]
          lg:pt-[18px]

          xl:max-w-[1320px]
        "
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            className="
              font-red-hat-display
              text-[20px]
              font-[645]
              leading-8
              text-white

              sm:text-[24px]
              sm:leading-10

              lg:text-[28px]
              lg:leading-[56px]
            "
          >
            Sponsored
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous sponsored plan"
              onClick={goPrevious}
              className="
                inline-flex
                h-[32px]
                w-[32px]
                items-center
                justify-center
                rounded-full
                bg-[#FFFFFF1A]
                text-white
                shadow-[0px_1px_2px_0px_#1018280D]
                transition-colors
                hover:bg-[#FFFFFF2B]

                lg:h-[36px]
                lg:w-[36px]
              "
            >
              <ChevronLeft
                aria-hidden="true"
                className="h-[18px] w-[18px]"
                strokeWidth={1.7}
              />
            </button>

            <button
              type="button"
              aria-label="Next sponsored plan"
              onClick={goNext}
              className="
                inline-flex
                h-[32px]
                w-[32px]
                items-center
                justify-center
                rounded-full
                border
                border-white
                bg-transparent
                text-white
                shadow-[0px_1px_2px_0px_#1018280D]
                transition-colors
                hover:bg-[#FFFFFF1A]

                lg:h-[36px]
                lg:w-[36px]
              "
            >
              <ChevronRight
                aria-hidden="true"
                className="h-[18px] w-[18px]"
                strokeWidth={1.7}
              />
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-hidden sm:mt-4 lg:mt-0">
          <div
            onTransitionEnd={handleTransitionEnd}
            className="
              flex
              gap-[30px]
              ease-in-out
            "
            style={{
              transform: `translate3d(-${currentIndex * cardStep}px, 0, 0)`,
              transitionProperty: 'transform',
              transitionDuration: enableTransition ? '700ms' : '0ms',
            }}
          >
            {infinitePlans.map((item, index) => (
              <SponsoredPlanCard
                key={item.id}
                ref={index === 0 ? firstCardRef : undefined}
                plan={item.plan}
                onBuyNow={() => {
                  onBuyNow(item.plan);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SPONSORED PLAN CARD
========================================================= */

type SponsoredPlanCardProps = {
  plan: ExclusivePlan;
  onBuyNow: () => void;
  ref?: React.Ref<HTMLElement>;
};

function SponsoredPlanCard({ plan, onBuyNow, ref }: SponsoredPlanCardProps) {
  return (
    <article
      ref={ref}
      className="
        w-[calc(100vw-94px)]
        max-w-[712px]
        shrink-0
        overflow-hidden
        rounded-[14px]
        border
        border-[#EAECF0]
        bg-white

        sm:rounded-[16px]

        lg:h-[243px]
        lg:w-[712px]
      "
    >
      <div
        className="
          flex
          flex-col

          sm:flex-row

          lg:h-[111px]
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-3
            p-3

            sm:p-4
          "
        >
          <Image
            src={plan.logo}
            alt={plan.logoAlt}
            width={56}
            height={56}
            className="
              h-[50px]
              w-[50px]
              shrink-0
              object-contain

              sm:h-[56px]
              sm:w-[56px]
            "
          />

          <div className="min-w-0 flex-1">
            <h3
              className="
                font-red-hat-display
                text-[18px]
                font-bold
                leading-[21.75px]
                text-[#101828]

                sm:text-[20px]
              "
            >
              {plan.provider}
            </h3>

            <p
              className="
                mt-[2px]
                font-red-hat-display
                text-[13px]
                font-medium
                leading-[19.5px]
                text-[#667085]

                sm:text-[15px]
              "
            >
              {plan.networkDescription}
            </p>

            <SimBadges badges={plan.badges} />
          </div>
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            justify-center
            gap-2
            border-t
            border-[#EAECF0]
            p-3

            sm:w-[145px]
            sm:flex-col
            sm:border-l
            sm:border-t-0
          "
        >
          <button
            type="button"
            onClick={onBuyNow}
            className="
              inline-flex
              h-[36px]
              w-[120px]
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
              leading-5
              text-white
              transition-colors
              hover:bg-[#00796D]
            "
          >
            Buy Now
          </button>

          <button
            type="button"
            className="
              inline-flex
              h-[36px]
              w-[120px]
              items-center
              justify-center
              gap-1
              rounded-full
              border
              border-[#667085]
              bg-[#F2F4F7]
              px-[14px]
              font-red-hat-display
              text-[14px]
              font-bold
              leading-5
              text-[#101828]
              shadow-[0px_1px_2px_0px_#1018280D]
              transition-colors
              hover:bg-[#EAECF0]
            "
          >
            More Info
            <ChevronRight
              aria-hidden="true"
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-2
          border-t
          border-[#EAECF0]
          p-3

          sm:grid-cols-3
          sm:p-4
        "
      >
        <PlanMetric
          label={plan.dataLabel}
          value={plan.data}
        />

        <PlanMetric
          label={plan.primaryPriceLabel}
          value={plan.primaryPrice}
        />

        <PlanMetric
          label={plan.secondaryPriceLabel}
          value={plan.secondaryPrice}
        />
      </div>

      <div className="flex items-center gap-2 px-4 pb-4">
        <Globe2
          aria-hidden="true"
          className="
            h-[18px]
            w-[16px]
            shrink-0
            text-[#101828]
          "
          strokeWidth={1.7}
        />

        <p
          className="
            font-red-hat-display
            text-[13px]
            font-medium
            leading-[19.5px]
            text-[#101828]
          "
        >
          {plan.roaming}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   SIM BADGES
========================================================= */

function SimBadges({ badges }: { badges: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge}
          className="
            rounded-[4px]
            bg-[#EEF4FA]
            px-2
            py-[3px]
            font-red-hat-display
            text-[11.5px]
            font-bold
            leading-[17.25px]
            text-[#105089]
          "
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

/* =========================================================
   ROAMING
========================================================= */

function RoamingRow({ text }: { text: string }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <Globe2
        aria-hidden="true"
        className="
          h-[18px]
          w-[16px]
          shrink-0
          text-[#101828]
        "
        strokeWidth={1.7}
      />

      <p
        className="
          font-red-hat-display
          text-[13px]
          font-medium
          leading-[19.5px]
          text-[#101828]
        "
      >
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   PLAN LABEL
========================================================= */

function PlanLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="
        font-red-hat-display
        text-[13px]
        font-medium
        leading-[19.5px]
        text-[#667085]
      "
    >
      {children}
    </p>
  );
}

/* =========================================================
   PLAN VALUE
========================================================= */

function PlanValue({ children }: { children: ReactNode }) {
  return (
    <p
      className="
        mt-[2px]
        font-red-hat-display
        text-[14px]
        font-bold
        leading-[21px]
        tracking-[-0.01em]
        text-[#101828]
      "
    >
      {children}
    </p>
  );
}

/* =========================================================
   PLAN METRIC
========================================================= */

function PlanMetric({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
        rounded-[7px]
        border
        border-[#EAECF0]
        bg-[#F9FAFB]
        px-3
        py-[10px]
      "
    >
      <PlanLabel>{label}</PlanLabel>

      <PlanValue>{value}</PlanValue>
    </div>
  );
}
