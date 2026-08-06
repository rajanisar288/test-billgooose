import CompareFlow from '@/components/marketing/Compare-flow';
import Footer2 from '@/components/marketing/Footer2';
import { generateMarketingMetadata } from '@/lib/seo/metadata';

export const metadata = generateMarketingMetadata({
  title: 'Compare Household Bills',
  description:
    'Compare energy, broadband, mobile, insurance, credit cards and loans with trusted UK providers.',
  canonical: 'https://billgoose.com',
});
export default function HomePage() {
  return (
    <>
      <CompareFlow />
      <Footer2 />
    </>
  );
}
