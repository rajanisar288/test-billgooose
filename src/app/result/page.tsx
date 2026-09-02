import { Suspense } from 'react';

import ResultPageContent from '@/components/result/result-page-content';

function ResultLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#00897B]" />

        <p className="mt-4 text-gray-600">Loading results...</p>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultLoading />}>
      <ResultPageContent />
    </Suspense>
  );
}
