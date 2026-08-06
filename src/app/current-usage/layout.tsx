import type { ReactNode } from 'react';

import Header from '@/components/marketing/Header';

type CurrentUsageLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function CurrentUsageLayout({ children }: CurrentUsageLayoutProps) {
  return (
    <>
      <div className="border-b border-[#EAECF0] bg-white">
        <Header />
      </div>

      {children}
    </>
  );
}
