'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import SingleJourneyPage from '@/components/journey/journeyId/singleJourneyPage';
import { getResumeJourneyIdFromPath } from '@/lib/journey-storage';

export default function JourneyAwareNotFound() {
  const [resumeJourneyId, setResumeJourneyId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResumeJourneyId(getResumeJourneyIdFromPath(window.location.pathname) || null);
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  if (resumeJourneyId) {
    return <SingleJourneyPage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or
          deleted.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
