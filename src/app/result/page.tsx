import Footer2 from '@/components/marketing/Footer2';
import ResultFilters from '@/components/result/result-filters';
import ResultHero from '@/components/result/result-hero';
import ResultPlans from '@/components/result/result-plans';
import ResultsStatus from '@/components/result/results-status';

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <ResultHero />

      <ResultFilters />
      <ResultsStatus />

      <section
        className="
          mx-auto w-full max-w-[1440px]
          px-4 pb-16

          sm:px-6

          lg:px-10
        "
      >
        <div className="mt-5 sm:mt-6 xl:mt-7">
          <ResultPlans />
        </div>
      </section>
      <Footer2 />
    </main>
  );
}
