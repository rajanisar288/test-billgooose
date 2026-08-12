import type { ReactNode } from 'react';

import CurrentUsageMobileHeader from '@/components/current-usage/current-usage-mobile-header';
import Header from '@/components/marketing/Header';

type CurrentUsageLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function CurrentUsageLayout({ children }: CurrentUsageLayoutProps) {
  return (
    <>
      {/* Current Usage mobile header */}
      <CurrentUsageMobileHeader />

      {/* Existing header for tablet + desktop only */}
      <div
        className="
    hidden
    border-b
    border-[#EAECF0]

    md:block
  "
      >
        <Header />
      </div>

      {children}
    </>
  );
}
