import { Suspense } from 'react';

import Footer2 from '@/components/marketing/Footer2';
import ResultDesktopActions from '@/components/result/result-desktop-actions';
import ResultFilters from '@/components/result/result-filters';
import ResultHero from '@/components/result/result-hero';
import ResultPlans from '@/components/result/result-plans';
import ResultsStatus from '@/components/result/results-status';

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen bg-[#F8F9FA]">
        <ResultHero />

        {/* =====================================================
          SAME RESULT DETAILS / SIM SUMMARY
          NOW USED ON MOBILE + TABLET + DESKTOP
      ====================================================== */}
        <ResultFilters />

        {/* =====================================================
          DESKTOP ACTIONS

          Existing desktop-only component remains untouched.
      ====================================================== */}
        <ResultDesktopActions />

        {/* =====================================================
          MOBILE + TABLET RESULTS HEADING / FILTER BUTTON
      ====================================================== */}
        <ResultsStatus />

        <section
          className="
          mx-auto
          w-full
          max-w-[1440px]

          px-4
          pb-[10px]

          sm:px-6

          md:pb-[20px]

          lg:px-10
          lg:pb-[40px]
        "
        >
          <div
            className="
            mt-5

            sm:mt-6

            xl:mt-7
          "
          >
            <ResultPlans />
          </div>
        </section>

        <Footer2 />
      </main>
    </Suspense>
  );
}
