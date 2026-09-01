'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { ArrowDownUp, ChevronDown, ChevronRight, ExternalLink, Globe2 } from 'lucide-react';

import BroadbandSwitchModal from '@/components/result/broadband-switch-modal';
import FeaturedBroadbandCard from '@/components/result/featured-broadband-card';
import PlanCard from '@/components/result/plan-card';
import PlanDetailsDrawer from '@/components/result/plan-details-drawer';
import type {
  FeaturedBroadbandPlan,
  ResultPlan,
  SimOnlyPlan,
  StandardPlan,
} from '@/components/result/plan.types';
import ResultFilterSidebar from '@/components/result/result-filter-sidebar';
import data from '@/data/content.json';

type CompareService = 'energy' | 'broadband' | 'sim-only';

type CompareFlowDetails = {
  service?: string;
  flow?: string;

  postcode?: string;
  address?: string;

  serviceType?: string;
  paymentMethod?: string;

  currentProvider?: string;
  stillInContract?: string;
};

/* =========================================================
   TYPE HELPERS
========================================================= */

function isFeaturedBroadbandPlan(plan: ResultPlan): plan is FeaturedBroadbandPlan {
  return plan.type === 'featured-broadband';
}

function isStandardPlan(plan: ResultPlan): plan is StandardPlan {
  return plan.type === 'select-plan' || plan.type === 'view-deal';
}

/* =========================================================
   GET STORED COMPARE SERVICE
========================================================= */

function getStoredCompareService(): 'energy' | 'broadband' | null {
  try {
    const storedDetails = sessionStorage.getItem('compareFlowDetails');

    if (!storedDetails) {
      return null;
    }

    const details = JSON.parse(storedDetails) as CompareFlowDetails;

    if (details.service === 'energy' || details.service === 'broadband') {
      return details.service;
    }

    return null;
  } catch {
    return null;
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ResultPlans() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { plans, resultsStatus } = data.resultPage;

  /* =========================================================
     CURRENT RESULT SERVICE
  ========================================================= */

  const queryService = searchParams.get('service');

  const service: CompareService =
    queryService === 'broadband'
      ? 'broadband'
      : queryService === 'sim-only'
        ? 'sim-only'
        : 'energy';

  const isSimOnly = service === 'sim-only';

  /* =========================================================
     PLAN DATA
  ========================================================= */

  const energyPlanItems = plans.items as ResultPlan[];

  const broadbandPlanItems = (plans.broadbandItems ?? []) as StandardPlan[];

  const simOnlyPlanItems = (plans.simOnlyItems ?? []) as SimOnlyPlan[];

  const [selectedPlanTab, setSelectedPlanTab] = useState(resultsStatus.planTabs.defaultValue);

  /* =========================================================
     DETAILS DRAWER

     Used by:
     - Energy
     - Broadband
     - SIM Only More Info
  ========================================================= */

  const [selectedPlan, setSelectedPlan] = useState<StandardPlan | null>(null);

  const [selectedSimOnlyPlan, setSelectedSimOnlyPlan] = useState<SimOnlyPlan | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (plan: StandardPlan) => {
    setSelectedSimOnlyPlan(null);
    setSelectedPlan(plan);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedSimOnlyPlan(null);
  };

  /* =========================================================
     BEFORE YOU SWITCH / BUNDLE MODAL
  ========================================================= */

  const [switchModalPlan, setSwitchModalPlan] = useState<StandardPlan | null>(null);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const handleCloseSwitchModal = () => {
    setIsSwitchModalOpen(false);
  };

  /* =========================================================
     ENERGY / BROADBAND SELECT PLAN
  ========================================================= */

  const handleSelectPlan = (plan: StandardPlan) => {
    /*
     * Detect Bundle at click time.
     *
     * This keeps the completed Bundle flow unchanged.
     */
    const queryFlow = searchParams.get('flow');

    const storedFlow = sessionStorage.getItem('billgooseJourneyFlow');

    const isBundleFlow = queryFlow === 'bundle' || storedFlow === 'bundle';

    /* =====================================================
       BUNDLE
    ====================================================== */

    if (service === 'energy' && isBundleFlow) {
      sessionStorage.setItem(
        'journeySelectedPlan',
        JSON.stringify({
          ...plan,
          service: 'energy',
        }),
      );

      sessionStorage.setItem('billgooseJourneyService', 'energy');

      sessionStorage.setItem('billgooseJourneyFlow', 'bundle');

      setSwitchModalPlan(plan);
      setIsSwitchModalOpen(true);

      return;
    }

    /* =====================================================
       BROADBAND
    ====================================================== */

    if (service === 'broadband') {
      if (!plan.providerUrl) {
        return;
      }

      sessionStorage.setItem(
        'journeySelectedPlan',
        JSON.stringify({
          ...plan,
          service: 'broadband',
        }),
      );

      sessionStorage.setItem('billgooseJourneyService', 'broadband');

      sessionStorage.setItem('billgooseJourneyFlow', 'broadband');

      sessionStorage.setItem('broadbandRedirectUrl', plan.providerUrl);

      sessionStorage.setItem('broadbandRedirectProvider', plan.provider);

      router.push('/redirecting?service=broadband');

      return;
    }

    /* =====================================================
       NORMAL ENERGY
    ====================================================== */

    const storedService = getStoredCompareService();

    const resolvedService = storedService ?? 'energy';

    sessionStorage.setItem(
      'journeySelectedPlan',
      JSON.stringify({
        ...plan,
        service: resolvedService,
      }),
    );

    sessionStorage.setItem('billgooseJourneyService', resolvedService);

    sessionStorage.setItem('billgooseJourneyFlow', 'energy');

    router.push('/steps/personal-details-form?service=energy');
  };

  /* =========================================================
     SIM ONLY VIEW DEAL
  ========================================================= */

  const handleSimOnlyViewDeal = (plan: SimOnlyPlan) => {
    if (!plan.providerUrl) {
      return;
    }

    /*
     * Close More Info drawer if View Deal
     * was clicked from inside the drawer.
     */
    setIsDetailsOpen(false);

    sessionStorage.setItem('journeySelectedPlan', JSON.stringify(plan));

    sessionStorage.setItem('externalRedirectUrl', plan.providerUrl);

    sessionStorage.setItem('externalRedirectProvider', plan.provider);

    sessionStorage.setItem('externalRedirectService', 'sim-only');

    sessionStorage.setItem('billgooseJourneyService', 'sim-only');

    sessionStorage.setItem('billgooseJourneyFlow', 'sim-only');

    /*
     * Same tab:
     * BillGoose redirect loader.
     *
     * Redirecting page opens provider
     * website in another tab.
     */
    router.push('/redirecting?service=sim-only');
  };

  /* =========================================================
     SIM ONLY MORE INFO

     Convert SIM-only data into the same StandardPlan
     shape expected by the existing PlanDetailsDrawer.
  ========================================================= */

  const handleSimOnlyMoreInfo = (plan: SimOnlyPlan) => {
    const normalizedPrice = plan.price.includes('/') ? plan.price.split('/')[0] : plan.price;

    const drawerPlan: StandardPlan = {
      id: plan.id,

      type: 'view-deal',

      service: 'sim-only',

      provider: plan.provider,

      description: plan.networkDescription,

      logo: plan.logo,
      logoAlt: plan.logoAlt,

      rating: '',

      contract: plan.badges[0] ?? 'SIM Only',

      features: [
        ...plan.badges,
        plan.roamingText,
        `Data: ${plan.data}`,
        `${plan.upfrontLabel}: ${plan.upfrontCost}`,
      ],

      priceLabel: plan.priceLabel,

      price: normalizedPrice,

      pricePeriod: '/month',

      saving: '',

      providerUrl: plan.providerUrl,

      viewDetailsButton: plan.secondaryButton,

      primaryButton: plan.primaryButton,
    };

    setSelectedSimOnlyPlan(plan);

    setSelectedPlan(drawerPlan);

    setIsDetailsOpen(true);
  };

  /* =========================================================
     DRAWER MAIN ACTION

     Energy / Broadband:
     existing Select Plan logic.

     SIM Only:
     View Deal -> redirect loader.
  ========================================================= */

  const handleDrawerPrimaryAction = (plan: StandardPlan) => {
    if (selectedSimOnlyPlan && plan.service === 'sim-only') {
      handleSimOnlyViewDeal(selectedSimOnlyPlan);

      return;
    }

    handleSelectPlan(plan);
  };

  /* =========================================================
     BUNDLE RECOMMENDATIONS

     ALWAYS based on Energy items.
  ========================================================= */

  const recommendedPlans = useMemo(() => {
    if (!switchModalPlan) {
      return [];
    }

    const featuredPlan = energyPlanItems.find(isFeaturedBroadbandPlan);

    const standardRecommendations = energyPlanItems
      .filter(isStandardPlan)
      .filter((plan) => plan.id !== switchModalPlan.id)
      .slice(0, 2);

    return [...(featuredPlan ? [featuredPlan] : []), ...standardRecommendations];
  }, [energyPlanItems, switchModalPlan]);

  /* =========================================================
     NORMAL RESULT CARDS
  ========================================================= */

  const renderNormalCards = () => {
    if (service === 'broadband') {
      return broadbandPlanItems.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onViewDetails={handleViewDetails}
          onSelectPlan={handleSelectPlan}
          service="broadband"
        />
      ));
    }

    return energyPlanItems.map((plan) => {
      if (isFeaturedBroadbandPlan(plan)) {
        return (
          <FeaturedBroadbandCard
            key={plan.id}
            plan={plan}
            onViewDetails={handleViewDetails}
          />
        );
      }

      if (isStandardPlan(plan)) {
        return (
          <PlanCard
            key={plan.id}
            plan={plan}
            onViewDetails={handleViewDetails}
            onSelectPlan={handleSelectPlan}
            service="energy"
          />
        );
      }

      return null;
    });
  };

  /* =========================================================
     CARD LIST
  ========================================================= */

  const renderCards = () => {
    if (isSimOnly) {
      return simOnlyPlanItems.map((plan) => (
        <SimOnlyCard
          key={plan.id}
          plan={plan}
          onViewDeal={() => {
            handleSimOnlyViewDeal(plan);
          }}
          onMoreInfo={() => {
            handleSimOnlyMoreInfo(plan);
          }}
        />
      ));
    }

    return renderNormalCards();
  };

  return (
    <>
      <section
        className="
          mx-auto
          w-full
          max-w-[1440px]

          overflow-visible

          px-4
          pb-12

          min-[390px]:px-5

          sm:px-6

          md:px-8

          lg:px-8
          lg:pb-16

          xl:px-10

          2xl:px-0
        "
      >
        {/* =====================================================
            MOBILE + TABLET
        ====================================================== */}
        <div className="lg:hidden">
          <div
            className="
              space-y-4

              sm:space-y-5
            "
          >
            {renderCards()}
          </div>
        </div>

        {/* =====================================================
            DESKTOP
        ====================================================== */}
        <div
          className="
            hidden

            lg:grid
            lg:grid-cols-[326px_minmax(0,1fr)]
            lg:items-start
            lg:gap-5

            xl:gap-6
          "
        >
          {/* =================================================
              FILTERS
          ================================================== */}
          <ResultFilterSidebar />

          {/* =================================================
              RESULTS
          ================================================== */}
          <div
            className="
              min-w-0
              w-full
            "
          >
            {/* ===============================================
                RESULTS SUMMARY
            ================================================ */}
            <div
              className="
                flex

                items-end
                justify-between

                gap-5

                pb-3
              "
            >
              <div className="min-w-0">
                <h2
                  className="
                    font-red-hat-display

                    text-[16px]
                    font-extrabold
                    leading-5

                    text-[#101828]

                    xl:text-[18px]
                  "
                >
                  {resultsStatus.heading}
                </h2>

                <p
                  className="
                    mt-1

                    font-inter

                    text-[14px]
                    font-normal
                    leading-5

                    text-[#667085]
                  "
                >
                  {isSimOnly ? (
                    <>
                      <strong
                        className="
                          font-normal
                        "
                      >
                        {simOnlyPlanItems.length} deals
                      </strong>{' '}
                      available, starting with the lowest monthly cost.
                    </>
                  ) : (
                    <>
                      <strong
                        className="
                          font-normal
                        "
                      >
                        {resultsStatus.descriptionStart}
                      </strong>{' '}
                      {resultsStatus.descriptionRest}
                    </>
                  )}
                </p>

                {/* =============================================
                    ENERGY / BROADBAND TABS ONLY
                ============================================== */}
                {!isSimOnly && (
                  <div
                    className="
                      mt-3

                      flex
                      items-center

                      gap-2
                    "
                  >
                    {resultsStatus.planTabs.options.map((option) => {
                      const isSelected = selectedPlanTab === option.value;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedPlanTab(option.value);
                          }}
                          className={`
                              inline-flex
                              h-[28px]

                              items-center
                              justify-center

                              rounded-[6px]

                              border

                              px-3

                              font-red-hat-display

                              text-[10px]

                              ${
                                isSelected
                                  ? `
                                    border-[#00897B]
                                    bg-[#00897B]

                                    font-extrabold
                                    text-white
                                  `
                                  : `
                                    border-[#EAECF0]
                                    bg-white

                                    font-medium
                                    text-[#344054]
                                  `
                              }
                            `}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ===============================================
                  SORT
              ================================================ */}
              <div
                className="
                  flex
                  shrink-0

                  items-center

                  gap-2
                "
              >
                <div
                  className="
                    flex
                    items-center

                    gap-1.5
                  "
                >
                  <ArrowDownUp
                    aria-hidden="true"
                    className="
                      h-[18px]
                      w-[18px]

                      text-[#344054]
                    "
                    strokeWidth={1.7}
                  />

                  <span
                    className="
                      font-inter

                      text-[13px]
                      font-medium
                      leading-5

                      text-[#344054]
                    "
                  >
                    Sort:
                  </span>
                </div>

                <button
                  type="button"
                  className="
                    inline-flex
                    h-[34px]
                    min-w-[135px]

                    items-center
                    justify-between

                    gap-2

                    rounded-[6px]

                    border
                    border-[#D0D5DD]

                    bg-white

                    px-3

                    font-inter

                    text-[13px]
                    font-normal
                    leading-5

                    text-[#667085]
                  "
                >
                  Recommended
                  <ChevronDown
                    aria-hidden="true"
                    className="
                      h-4
                      w-4
                    "
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </div>

            {/* ===============================================
                PLAN CARDS
            ================================================ */}
            <div
              className="
                min-w-0
                space-y-3
              "
            >
              {renderCards()}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DETAILS DRAWER

          Reused for SIM-only More Info.
      ====================================================== */}
      <PlanDetailsDrawer
        plan={selectedPlan}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onSelectPlan={handleDrawerPrimaryAction}
      />

      {/* =====================================================
          BUNDLE MODAL

          Unchanged.
      ====================================================== */}
      {!isSimOnly && (
        <BroadbandSwitchModal
          isOpen={isSwitchModalOpen}
          selectedPlan={switchModalPlan}
          recommendedPlans={recommendedPlans}
          onClose={handleCloseSwitchModal}
          bundleFlow
        />
      )}
    </>
  );
}

/* =========================================================
   SIM ONLY CARD

   Kept inside ResultPlans.tsx.
   No separate SIM card component.
========================================================= */

type SimOnlyCardProps = {
  plan: SimOnlyPlan;
  onViewDeal: () => void;
  onMoreInfo: () => void;
};

function SimOnlyCard({ plan, onViewDeal, onMoreInfo }: SimOnlyCardProps) {
  return (
    <article
      className="
        w-full

        overflow-hidden

        rounded-[14px]

        border
        border-[#EAECF0]

        bg-white

        shadow-[0px_1px_3px_rgba(16,24,40,0.03)]
      "
    >
      {/* =====================================================
          TOP
      ====================================================== */}
      <div
        className="
          flex

          border-b
          border-[#EAECF0]
        "
      >
        {/* =================================================
            PROVIDER
        ================================================== */}
        <div
          className="
            flex
            min-w-0
            flex-1

            items-center

            gap-3

            p-3

            sm:gap-4
            sm:p-4
          "
        >
          {/* =================================================
              LOGO

              No background here because your image
              already contains its background.
          ================================================== */}
          <div
            className="
              flex
              h-[54px]
              w-[54px]
              shrink-0

              items-center
              justify-center

              overflow-hidden

              rounded-[8px]

              sm:h-[60px]
              sm:w-[60px]
            "
          >
            <Image
              src={plan.logo}
              alt={plan.logoAlt}
              width={60}
              height={60}
              className="
                h-full
                w-full

                object-contain
              "
            />
          </div>

          {/* =================================================
              PROVIDER CONTENT
          ================================================== */}
          <div
            className="
              min-w-0
              flex-1
            "
          >
            {/* Provider heading */}
            <h3
              className="
                font-red-hat-display

                text-[20px]
                font-bold
                leading-[21.75px]
                tracking-[0]

                text-[#101828]
              "
            >
              {plan.provider}
            </h3>

            {/* Description */}
            <p
              className="
                mt-[2px]

                font-red-hat-display

                text-[15px]
                font-medium
                leading-[19.5px]
                tracking-[0]

                text-[#667085]
              "
            >
              {plan.networkDescription}
            </p>

            {/* ===============================================
                BADGES
            ================================================ */}
            <div
              className="
                mt-2

                flex
                flex-wrap

                gap-1.5
              "
            >
              {plan.badges.map((badge) => (
                <span
                  key={badge}
                  className="
                      inline-flex

                      items-center

                      rounded-[4px]

                      bg-[#EEF4FA]

                      px-2
                      py-[3px]

                      font-red-hat-display

                      text-[11.5px]
                      font-bold
                      leading-[17.25px]
                      tracking-[0]

                      text-[#105089]
                    "
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================
            ACTIONS
        ================================================== */}
        <div
          className="
            flex
            w-[138px]
            shrink-0

            flex-col

            items-center
            justify-center

            gap-2

            border-l
            border-[#EAECF0]

            px-[9px]

            sm:w-[148px]
            sm:px-[14px]
          "
        >
          {/* ===============================================
              VIEW DEAL
          ================================================ */}
          <button
            type="button"
            onClick={onViewDeal}
            className="
              inline-flex
              h-[36px]
              w-[120px]

              items-center
              justify-center

              gap-2

              rounded-full

              border
              border-[#105089]

              bg-[#105089]

              px-[14px]
              py-2

              font-red-hat-display

              text-[14px]
              font-bold
              leading-5
              tracking-[0]

              text-white

              transition-colors

              hover:border-[#0D3B66]
              hover:bg-[#0D3B66]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#D1E9FF]
            "
          >
            {plan.primaryButton}

            <ExternalLink
              aria-hidden="true"
              className="
                h-4
                w-4
                shrink-0
              "
              strokeWidth={2}
            />
          </button>

          {/* ===============================================
              MORE INFO

              Opens same PlanDetailsDrawer used by
              Energy / Broadband.
          ================================================ */}
          <button
            type="button"
            onClick={onMoreInfo}
            className="
              inline-flex
              h-[36px]
              w-[120px]

              items-center
              justify-center

              gap-0.5

              rounded-full

              border
              border-[#667085]

              bg-[#F2F4F7]

              px-[14px]
              py-2

              font-red-hat-display

              text-[14px]
              font-bold
              leading-5
              tracking-[0]

              text-[#101828]

              shadow-[0px_1px_2px_0px_#1018280D]

              transition-colors

              hover:bg-[#EAECF0]

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#EAECF0]
            "
          >
            {plan.secondaryButton}

            <ChevronRight
              aria-hidden="true"
              className="
                h-5
                w-5
                shrink-0
              "
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* =====================================================
          METRICS
      ====================================================== */}
      <div
        className="
          grid
          grid-cols-1

          gap-2

          p-3

          sm:grid-cols-3

          sm:gap-3
          sm:p-4
        "
      >
        <SimMetric
          label="Data"
          value={plan.data}
        />

        <SimMetric
          label={plan.priceLabel}
          value={plan.price}
        />

        <SimMetric
          label={plan.upfrontLabel}
          value={plan.upfrontCost}
        />
      </div>

      {/* =====================================================
          BOTTOM INFORMATION
      ====================================================== */}
      <div
        className="
          flex

          items-center

          gap-2

          px-3
          pb-3

          sm:px-4
          sm:pb-4
        "
      >
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
            tracking-[0]

            text-[#101828]
          "
        >
          {plan.roamingText}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   SIM METRIC CARD
========================================================= */

type SimMetricProps = {
  label: string;
  value: string;
};

function SimMetric({ label, value }: SimMetricProps) {
  return (
    <div
      className="
        min-h-[58px]

        rounded-[7px]

        border
        border-[#EAECF0]

        bg-[#F9FAFB]

        px-3
        py-2.5
      "
    >
      {/* HEADING */}
      <p
        className="
          font-red-hat-display

          text-[13px]
          font-medium
          leading-[19.5px]
          tracking-[0]

          text-[#667085]
        "
      >
        {label}
      </p>

      {/* VALUE */}
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
        {value}
      </p>
    </div>
  );
}
