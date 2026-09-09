'use client';

import { useRouter } from 'next/navigation';

import { storeJourney } from '@/constants/shared';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { useJourneyStore } from '@/store/journeyStore';
import { getCurrentRelativeUrl } from '@/utils/helper';
import { generateRequestId } from '@/utils/uuid';

export type HomepageService =
  'energy' | 'broadband' | 'mobile' | 'sim-only' | 'insurance' | 'bundle-bills';

function getServiceUrl(service: HomepageService) {
  if (service === 'bundle-bills') {
    return '/compare?service=energy&flow=bundle';
  }

  if (['energy', 'insurance', 'broadband'].includes(service)) {
    return `/compare?service=${service}`;
  }

  return `/result?service=${service}`;
}

export function useServiceJourneyNavigation() {
  const router = useRouter();
  const { journey, setJourney } = useJourneyStore();

  const navigateToService = async (service: HomepageService) => {
    const journeyId =
      journey?.id ||
      journey?.journeyId ||
      localStorage.getItem(storeJourney) ||
      generateRequestId();

    try {
      const response = await journeyApi.createJourney({
        uuid: journeyId,
        serviceType: service === 'bundle-bills' ? 'billPackage' : service,
        lastUrl: getCurrentRelativeUrl(),
      });

      if (!response?.data) {
        throw new Error('No data received from createJourney API');
      }

      const updatedJourneyId = response.data.id || response.data.journeyId;

      if (updatedJourneyId) {
        localStorage.setItem(storeJourney, updatedJourneyId);
      }

      setJourney(response.data);
      router.push(getServiceUrl(service));
    } catch (error) {
      console.error('Failed to create journey for selected service:', error);
    }
  };

  return { navigateToService };
}
