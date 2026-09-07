'use client';

import { useSearchParams } from 'next/navigation';

import Footer2 from '@/components/marketing/Footer2';
import MobileResults from '@/components/result/mobile-results';
import ResultDesktopActions from '@/components/result/result-desktop-actions';
import ResultFilters from '@/components/result/result-filters';
import ResultHero from '@/components/result/result-hero';
import ResultPlans from '@/components/result/result-plans';
import ResultsStatus from '@/components/result/results-status';

export default function ResultPageContent() {
  const searchParams = useSearchParams();

  const service = searchParams.get('service');

  if (service === 'mobile') {
    return (
      <main className="min-h-screen bg-[#F8F9FA]">
        <MobileResults />
        <Footer2 />
      </main>
    );
  }

  const isInsurance = service === 'insurance';
  const insuranceDescription = '3 insurance quotes found, starting with the lowest monthly cost.';

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <ResultHero />

      <ResultFilters />

      <ResultDesktopActions />

      <ResultsStatus
        heading={isInsurance ? 'Results summary' : undefined}
        description={isInsurance ? insuranceDescription : undefined}
      />

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
        <div className="mt-5 sm:mt-6 xl:mt-7">
          <ResultPlans
            heading={isInsurance ? 'Results summary' : undefined}
            description={isInsurance ? insuranceDescription : undefined}
          />
        </div>
      </section>

      <Footer2 />
    </main>
  );
}
