import Footer2 from '@/components/marketing/Footer2';
import ResultDesktopActions from '@/components/result/result-desktop-actions';
import ResultFilters from '@/components/result/result-filters';
import ResultHero from '@/components/result/result-hero';
import ResultMobileActions from '@/components/result/result-mobile-actions';
import ResultPlans from '@/components/result/result-plans';
import ResultTabletActions from '@/components/result/result-tablet-actions';
import ResultsStatus from '@/components/result/results-status';

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <ResultHero />

      <ResultFilters />

      <ResultMobileActions />

      <ResultTabletActions />

      <ResultDesktopActions />

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
  );
}
