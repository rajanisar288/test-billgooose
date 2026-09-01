'use client';

import { useMemo, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { ArrowDownUp, ChevronDown } from 'lucide-react';

import BroadbandSwitchModal from '@/components/result/broadband-switch-modal';
import FeaturedBroadbandCard from '@/components/result/featured-broadband-card';
import PlanCard from '@/components/result/plan-card';
import PlanDetailsDrawer from '@/components/result/plan-details-drawer';
import type {
  FeaturedBroadbandPlan,
  ResultPlan,
  StandardPlan,
} from '@/components/result/plan.types';
import ResultFilterSidebar from '@/components/result/result-filter-sidebar';
import data from '@/data/content.json';

type CompareService = 'energy' | 'broadband';

function isFeaturedBroadbandPlan(plan: ResultPlan): plan is FeaturedBroadbandPlan {
  return plan.type === 'featured-broadband';
}

function isStandardPlan(plan: ResultPlan): plan is StandardPlan {
  return plan.type === 'select-plan' || plan.type === 'view-deal';
}

export default function ResultPlans() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { plans, resultsStatus } = data.resultPage;

  /* =========================================================
     SERVICE
  ========================================================= */

  const service: CompareService =
    searchParams.get('service') === 'broadband' ? 'broadband' : 'energy';

  const isBroadband = service === 'broadband';

  /* =========================================================
     SERVICE-SPECIFIC RESULT DATA
  ========================================================= */

  const planItems = (isBroadband ? plans.broadbandItems : plans.items) as ResultPlan[];

  const [selectedPlanTab, setSelectedPlanTab] = useState(resultsStatus.planTabs.defaultValue);

  /* =========================================================
     DETAILS DRAWER
  ========================================================= */

  const [selectedPlan, setSelectedPlan] = useState<StandardPlan | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (plan: StandardPlan) => {
    setSelectedPlan(plan);

    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  /* =========================================================
     BUNDLE MODAL
  ========================================================= */

  const [switchModalPlan, setSwitchModalPlan] = useState<StandardPlan | null>(null);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const handleCloseSwitchModal = () => {
    setIsSwitchModalOpen(false);
  };

  /* =========================================================
     SELECT PLAN
  ========================================================= */

  const handleSelectPlan = (plan: StandardPlan) => {
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

      sessionStorage.setItem('broadbandRedirectUrl', plan.providerUrl);

      sessionStorage.setItem('broadbandRedirectProvider', plan.provider);

      /*
       * Do not accidentally carry Bundle
       * behaviour into Broadband.
       */
      sessionStorage.setItem('billgooseJourneyFlow', 'broadband');

      router.push('/redirecting?service=broadband');

      return;
    }

    /* =====================================================
       ENERGY
    ====================================================== */

    sessionStorage.setItem(
      'journeySelectedPlan',
      JSON.stringify({
        ...plan,
        service: 'energy',
      }),
    );

    sessionStorage.setItem('billgooseJourneyService', 'energy');

    sessionStorage.setItem('billgooseJourneyFlow', 'energy');

    router.push('/steps/personal-details-form?service=energy');
  };

  /* =========================================================
     BUNDLE RECOMMENDATIONS
  ========================================================= */

  const recommendedPlans = useMemo(() => {
    if (!switchModalPlan) {
      return [];
    }

    /*
     * Bundle uses the existing Energy
     * items because that array contains
     * the broadband suggestion card.
     */
    const energyItems = plans.items as ResultPlan[];

    const featuredPlan = energyItems.find(isFeaturedBroadbandPlan);

    const standardRecommendations = energyItems
      .filter(isStandardPlan)
      .filter((plan) => plan.id !== switchModalPlan.id)
      .slice(0, 2);

    return [...(featuredPlan ? [featuredPlan] : []), ...standardRecommendations];
  }, [plans.items, switchModalPlan]);

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
          <div className="space-y-4 sm:space-y-5">
            {planItems.map((plan) => {
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
                    service={service}
                    onViewDetails={handleViewDetails}
                    onSelectPlan={handleSelectPlan}
                  />
                );
              }

              return null;
            })}
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
          <ResultFilterSidebar />

          <div className="min-w-0 w-full">
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

                    text-[#667085]
                  "
                >
                  <span
                    className="
                      font-medium

                      text-[#101828]
                    "
                  >
                    {isBroadband ? planItems.length : resultsStatus.descriptionStart}
                  </span>{' '}
                  <span>
                    {isBroadband
                      ? 'broadband deals available in your area'
                      : resultsStatus.descriptionRest}
                  </span>
                </p>

                {/* =========================================
                    TABS
                ========================================== */}

                {!isBroadband && (
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
                          onClick={() => setSelectedPlanTab(option.value)}
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

              {/* SORT */}
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

                    text-[#667085]
                  "
                >
                  Recommended
                  <ChevronDown
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
              {planItems.map((plan) => {
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
                      service={service}
                      onViewDetails={handleViewDetails}
                      onSelectPlan={handleSelectPlan}
                    />
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS DRAWER */}
      <PlanDetailsDrawer
        plan={selectedPlan}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onSelectPlan={handleSelectPlan}
      />

      {/* BUNDLE ONLY MODAL */}
      <BroadbandSwitchModal
        isOpen={isSwitchModalOpen}
        selectedPlan={switchModalPlan}
        recommendedPlans={recommendedPlans}
        onClose={handleCloseSwitchModal}
        bundleFlow
      />
    </>
  );
}
