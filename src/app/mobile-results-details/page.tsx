import Header from '@/components/marketing/Header';

import MobileResultsDetails from '../../components/result/mobile-results-details';

type MobileResultsDetailsPageProps = {
  searchParams: Promise<{
    brand?: string;
    type?: string;
    id?: string;
  }>;
};

export default async function MobileResultsDetailsPage({
  searchParams,
}: MobileResultsDetailsPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-white">
      {/* Existing white navbar */}
      <Header />

      <MobileResultsDetails
        brand={params.brand ?? ''}
        itemType={params.type === 'featured' ? 'featured' : 'deal'}
        itemId={params.id ?? ''}
      />
    </main>
  );
}
