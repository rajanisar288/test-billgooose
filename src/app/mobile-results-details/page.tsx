import { Suspense } from 'react';

import Header from '@/components/marketing/Header';
import MobileResultsDetailsContent from '@/components/result/mobile-results-details-content';

function CompareLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />

        <p className="mt-4 text-gray-600">Loading comparison tools...</p>
      </div>
    </div>
  );
}

export default function MobileResultsDetailsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <Suspense fallback={<CompareLoading />}>
        <MobileResultsDetailsContent />
      </Suspense>
    </main>
  );
}
