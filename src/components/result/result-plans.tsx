import FeaturedBroadbandCard from '@/components/result/featured-broadband-card';
import PlanCard from '@/components/result/plan-card';
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

  /*
   * Imported JSON widens the "type" property to string.
   * This cast connects the verified JSON structure to our
   * explicit discriminated union.
   */
  const planItems = plans.items as ResultPlan[];

  return (
    <section
      className="
        mx-auto w-full
        max-w-[1096px]
        px-4 pb-16

        sm:px-6

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
              />
            );
          }

          if (isStandardPlan(plan)) {
            return (
              <PlanCard
                key={plan.id}
                plan={plan}
              />
            );
          }

          return null;
        })}
      </div>
    </section>
  );
}
