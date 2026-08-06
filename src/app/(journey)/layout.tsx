import type { ReactNode } from 'react';
import { Suspense } from 'react';

import JourneyShell from '../../components/journey/JourneyShell';

type JourneyLayoutProps = {
  children: ReactNode;
};

export default function JourneyLayout({ children }: JourneyLayoutProps) {
  return (
    <Suspense fallback={null}>
      <JourneyShell>{children}</JourneyShell>
    </Suspense>
  );
}
