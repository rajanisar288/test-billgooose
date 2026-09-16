'use client';

import { useEffect, useState } from 'react';

import ResumeJourneyDialog from '@/components/journey/resume-journey-dialog';
import Header from '@/components/marketing/Header';
import { getResumeJourneyIdFromPath } from '@/lib/journey-storage';

export default function SingleJourneyPage() {
  const [journeyId, setJourneyId] = useState('');

  useEffect(() => {
    setJourneyId(getResumeJourneyIdFromPath(window.location.pathname));
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#E6F4F2_0%,#FFFFFF_65%)]">
      <Header />
      <ResumeJourneyDialog journeyId={journeyId} />
    </main>
  );
}
