import ResultFilters from '@/components/result/result-filters';
import ResultHero from '@/components/result/result-hero';
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
        {/* Result cards will be added here */}
      </section>
    </main>
  );
}
