// components/loadConfig.tsx
'use client';

/* eslint-disable no-console, react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { storeJourney, storePartnerConfig } from '@/constants/shared';
import { type Journey } from '@/interfaces/shared';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { partnerConfigApi } from '@/lib/api/endpoints/partnerConfig';
import { useJourneyStore } from '@/store/journeyStore';
import { generateRequestId } from '@/utils/uuid';

export function LoadConfig() {
  const { setJourney, journey } = useJourneyStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function createNewJourney() {
    const payload = getDefaultJourney();

    console.log('🆕 Creating new journey with payload:', payload);

    try {
      const createdJourney = await journeyApi.createJourney(payload);

      console.log('✅ Created journey response:', createdJourney);

      if (createdJourney?.data?.journeyId) {
        localStorage.setItem(storeJourney, createdJourney.data.journeyId);
        setJourney(createdJourney.data);

        console.log('💾 New journey saved to store:', createdJourney.data);
      } else {
        console.error('❌ No journeyId in created response');
      }
    } catch (error) {
      console.error('❌ Failed to create journey:', error);
    }
  }

  useEffect(() => {
    async function initialize() {
      setIsLoading(true);

      try {
        // Load config
        try {
          const config = await partnerConfigApi.getConfig();

          localStorage.setItem(storePartnerConfig, JSON.stringify(config.data));

          console.log('✅ Config loaded');
        } catch (error) {
          console.error('❌ Failed to fetch config:', error);
        }

        // Load or create journey
        const journeyId = localStorage.getItem(storeJourney);
        console.log('📦 Stored journey ID:', journeyId);

        if (journeyId) {
          try {
            const journeyRes = await journeyApi.getJourney(journeyId);

            console.log('📥 Fetched journey response:', journeyRes);

            if (journeyRes?.data?.id) {
              setJourney(journeyRes.data);

              console.log('✅ Journey set in store:', journeyRes.data);

              if (journeyRes.data.lastUrl) {
                router.push(journeyRes.data.lastUrl);
              }
            } else {
              console.warn('⚠️ No journey data in response');
              await createNewJourney();
            }
          } catch (error) {
            console.error('❌ Failed to fetch journey:', error);
            await createNewJourney();
          }
        } else {
          await createNewJourney();
        }
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, [router, setJourney]);

  // Debug: Log when journey changes
  useEffect(() => {
    console.log('📊 Current journey in store:', journey);
  }, [journey]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
}

export function getDefaultJourney(): Journey {
  return {
    address: null,
    lastUrl: '',
    customer: null,
    uuid: generateRequestId(),
    sourceType: 'direct',
    sourceName: 'direct',
    sourceId: '2',
    networkId: '',
    programmeId: '',
    affiliateId: '',
    publisherId: '',
    clickId: '',
    referralId: '',
    campaignId: '',
    subAffiliateId: '',
    placementId: '',
    networkSpecificId: '',
    landingUrl: '',
    referrerUrl: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    additionalParameters: {
      additionalProp1: '',
      additionalProp2: '',
      additionalProp3: '',
    },
  };
}
