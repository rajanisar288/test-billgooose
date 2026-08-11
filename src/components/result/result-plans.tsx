'use client';

import { useState } from 'react';

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

  const [selectedPlan, setSelectedPlan] = useState<StandardPlan | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (plan: StandardPlan) => {
    setSelectedPlan(plan);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

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
            flex flex-col gap-4

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
                />
              );
            }

            return null;
          })}
        </div>
      </section>

      <PlanDetailsDrawer
        plan={selectedPlan}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </>
  );
}
