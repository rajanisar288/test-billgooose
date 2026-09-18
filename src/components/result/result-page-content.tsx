'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import Footer2 from '@/components/marketing/Footer2';
import MobileResults from '@/components/result/mobile-results';
import type { ResultPlan } from '@/components/result/plan.types';
import { mapQuoteResponseToPlans, type QuoteResponse } from '@/components/result/quote.types';
import ResultDesktopActions from '@/components/result/result-desktop-actions';
import { ResultFilterProvider } from '@/components/result/result-filter-context';
import ResultFilters from '@/components/result/result-filters';
import ResultHero from '@/components/result/result-hero';
import ResultPlans from '@/components/result/result-plans';
import ResultsStatus from '@/components/result/results-status';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { useJourneyStore } from '@/store/journeyStore';

export default function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { journey } = useJourneyStore();
  const [quotePlans, setQuotePlans] = useState<ResultPlan[]>([]);
  const [quoteProductCount, setQuoteProductCount] = useState<number | undefined>();
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const quoteRequestKeyRef = useRef<string | null>(null);

  const service = searchParams.get('service');
  const flow = searchParams.get('flow');

  const isBundleFlow = flow === 'bundle' || service === 'bundle-bills';
  const isQuoteService = service === 'energy' || isBundleFlow;
  const journeyId = journey?.id || journey?.journeyId || journey?.uuid;

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    let hasLegacyFilters = false;

    [...nextParams.keys()].forEach((key) => {
      if (key.startsWith('filter-') || key.startsWith('sim-filter-')) {
        nextParams.delete(key);
        hasLegacyFilters = true;
      }
    });

    if (hasLegacyFilters) {
      router.replace(
        nextParams.toString() ? `?${nextParams.toString()}` : window.location.pathname,
      );
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!isQuoteService) {
      return;
    }

    if (!journeyId) {
      return;
    }

    const quoteRequestKey = `${service ?? ''}:${flow ?? ''}:${journeyId}`;

    if (quoteRequestKeyRef.current === quoteRequestKey) {
      return;
    }

    quoteRequestKeyRef.current = quoteRequestKey;

    // let isActive = true;

    const loadQuote = async () => {
      setQuoteLoading(true);
      setQuoteError('');

      try {
        const response = await journeyApi.getQuote(journeyId, {});
        const mappedPlans = mapQuoteResponseToPlans(
          response.data as QuoteResponse,
          isBundleFlow ? 'bundle-bills' : 'energy',
        ) as ResultPlan[];

        setQuotePlans(mappedPlans);
        setQuoteProductCount(response.data.totalProducts ?? mappedPlans.length);
      } catch (error) {
        setQuoteError(
          error &&
            typeof error === 'object' &&
            'message' in error &&
            typeof error.message === 'string'
            ? error.message
            : 'We could not load your latest quotes. Please try again.',
        );
      } finally {
        setQuoteLoading(false);
      }
    };

    void loadQuote();
  }, [flow, isQuoteService, journeyId, service]);

  if (service === 'mobile') {
    return (
      <ResultFilterProvider>
        <main className="min-h-screen bg-[#F8F9FA]">
          <MobileResults />
          <Footer2 />
        </main>
      </ResultFilterProvider>
    );
  }

  const isInsurance = service === 'insurance';
  const insuranceDescription = '3 insurance quotes found, starting with the lowest monthly cost.';

  return (
    <ResultFilterProvider>
      <main className="min-h-screen bg-[#F8F9FA]">
        <ResultHero />

        <ResultFilters />

        <ResultDesktopActions />

        <ResultsStatus
          heading={isInsurance ? 'Results summary' : undefined}
          description={isInsurance ? insuranceDescription : undefined}
          resultCount={isQuoteService ? quoteProductCount : undefined}
          isLoading={isQuoteService && quoteLoading}
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
              quotePlans={isQuoteService ? quotePlans : undefined}
              quoteLoading={isQuoteService && quoteLoading}
              quoteError={
                isQuoteService
                  ? quoteError ||
                    (!journeyId ? 'We could not find your journey. Please start again.' : '')
                  : undefined
              }
              resultCount={isQuoteService ? quoteProductCount : undefined}
            />
          </div>
        </section>

        <Footer2 />
      </main>
    </ResultFilterProvider>
  );
}
