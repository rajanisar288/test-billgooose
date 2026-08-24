'use client';

import { useMemo, useState } from 'react';

import BroadbandSwitchModal from '@/components/result/broadband-switch-modal';
import FeaturedBroadbandCard from '@/components/result/featured-broadband-card';
import PlanCard from '@/components/result/plan-card';
import PlanDetailsDrawer from '@/components/result/plan-details-drawer';
import type {
  FeaturedBroadbandPlan,
  ResultPlan,
  StandardPlan,
} from '@/components/result/plan.types';
import data from '@/data/content.json';

function isFeaturedBroadbandPlan(plan: ResultPlan): plan is FeaturedBroadbandPlan {
  return plan.type === 'featured-broadband';
}

function isStandardPlan(plan: ResultPlan): plan is StandardPlan {
  return plan.type === 'select-plan' || plan.type === 'view-deal';
}

export default function ResultPlans() {
  const { plans } = data.resultPage;

  const planItems = plans.items as ResultPlan[];

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
     BEFORE YOU SWITCH MODAL
  ========================================================= */

  const [switchModalPlan, setSwitchModalPlan] = useState<StandardPlan | null>(null);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const handleSelectPlan = (plan: StandardPlan) => {
    setSwitchModalPlan(plan);

    setIsSwitchModalOpen(true);
  };

  const handleCloseSwitchModal = () => {
    setIsSwitchModalOpen(false);
  };

  /*
   * Temporary recommendations.
   *
   * Right now we take any 3 standard plans
   * except the clicked plan.
   *
   * Later you can replace this with actual
   * broadband results from the broadband API.
   */
  const recommendedPlans = useMemo(() => {
    if (!switchModalPlan) {
      return [];
    }

    /*
     * Always show the featured broadband plan first.
     */
    const featuredPlan = planItems.find(isFeaturedBroadbandPlan);

    /*
     * Then take 2 standard plans,
     * excluding the selected energy plan.
     */
    const standardRecommendations = planItems
      .filter(isStandardPlan)
      .filter((plan) => plan.id !== switchModalPlan.id)
      .slice(0, 2);

    return [...(featuredPlan ? [featuredPlan] : []), ...standardRecommendations];
  }, [planItems, switchModalPlan]);

  return (
    <>
      <section
        className="
          mx-auto
          w-full
          max-w-[1096px]

          px-4
          pb-[10px]

          sm:px-6

          md:pb-[20px]

          lg:pb-[40px]

          xl:px-0
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            sm:gap-5
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
                  onViewDetails={handleViewDetails}
                  onSelectPlan={handleSelectPlan}
                />
              );
            }

            return null;
          })}
        </div>
      </section>

      {/* Existing details drawer */}
      <PlanDetailsDrawer
        plan={selectedPlan}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onSelectPlan={handleSelectPlan}
      />

      {/* New broadband recommendation modal */}
      <BroadbandSwitchModal
        isOpen={isSwitchModalOpen}
        selectedPlan={switchModalPlan}
        recommendedPlans={recommendedPlans}
        onClose={handleCloseSwitchModal}
      />
    </>
  );
}
