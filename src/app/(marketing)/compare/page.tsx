import CompareFlow from '@/components/marketing/Compare-flow';
import Footer2 from '@/components/marketing/Footer2';
import { generateMarketingMetadata } from '@/lib/seo/metadata';
import { Suspense } from 'react';

export const metadata = generateMarketingMetadata({
  title: 'Compare Household Bills',
  description:
    'Compare energy, broadband, mobile, insurance, credit cards and loans with trusted UK providers.',
  canonical: 'https://billgoose.com',
});

function CompareLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading comparison tools...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<CompareLoading />}>
        <CompareFlow />
      </Suspense>

      <Footer2 />
    </>
  );
}
