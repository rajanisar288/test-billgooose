import type { ReactNode } from 'react';

import Header from '@/components/marketing/Header';
import Seo from '@/components/shared/seo';
import { generateMarketingMetadata } from '@/lib/seo/metadata';
import { generateOrganizationStructuredData } from '@/lib/seo/structured-data';

export const metadata = generateMarketingMetadata({
  title: 'Home',
  description:
    'Compare energy, broadband, mobile, insurance, credit cards and loans with trusted UK providers.',
});

type MarketingLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const structuredData = generateOrganizationStructuredData();

  return (
    <Seo structuredData={structuredData}>
      <Header />
      {children}
      {/* footer import  */}
    </Seo>
  );
}
