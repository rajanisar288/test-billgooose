'use client';

import { useSearchParams } from 'next/navigation';

import MobileResultsDetails from '@/components/result/mobile-results-details';
import { ResultFilterProvider } from '@/components/result/result-filter-context';

export default function MobileResultsDetailsContent() {
  const searchParams = useSearchParams();

  const brand = searchParams.get('brand') ?? '';
  const type = searchParams.get('type');
  const id = searchParams.get('id') ?? '';

  return (
    <ResultFilterProvider>
      <MobileResultsDetails
        brand={brand}
        itemType={type === 'featured' ? 'featured' : 'deal'}
        itemId={id}
      />
    </ResultFilterProvider>
  );
}
