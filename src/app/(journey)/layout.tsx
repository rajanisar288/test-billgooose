import type { ReactNode } from 'react';

import JourneyShell from '../../components/journey/JourneyShell';

type JourneyLayoutProps = {
  children: ReactNode;
};

export default function JourneyLayout({ children }: JourneyLayoutProps) {
  return <JourneyShell>{children}</JourneyShell>;
}
