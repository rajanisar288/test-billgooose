'use client';

import { useSearchParams } from 'next/navigation';

import MobileResultsDetails from '../../components/result/mobile-results-details';

export default function MobileResultsDetailsContent() {
  const searchParams = useSearchParams();

  const brand = searchParams.get('brand') ?? '';
  const type = searchParams.get('type');
  const id = searchParams.get('id') ?? '';

  return (
    <MobileResultsDetails
      brand={brand}
      itemType={type === 'featured' ? 'featured' : 'deal'}
      itemId={id}
    />
  );
}
