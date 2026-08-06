import type { ReactNode } from 'react';

import ResultHeader from '@/components/result/result-header';

type ResultLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function ResultLayout({ children }: ResultLayoutProps) {
  return (
    <>
      <ResultHeader />

      {children}
    </>
  );
}
