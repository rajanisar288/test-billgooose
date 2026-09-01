// components/loadConfig.tsx
'use client';
import { storeJourney, storePartnerConfig } from '@/constants/shared';
import { Journey } from '@/interfaces/shared';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { partnerConfigApi } from '@/lib/api/endpoints/partnerConfig';
import { useJourneyStore } from '@/store/journeyStore';
import { generateRequestId } from '@/utils/uuid';
import { useEffect, useState } from 'react';

export function LoadConfig() {
  const { setJourney, journey } = useJourneyStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getConfig() {
      try {
        const data = await partnerConfigApi.getConfig();
        localStorage.setItem(storePartnerConfig, JSON.stringify(data.data));
        console.log('✅ Config loaded');
      } catch (error) {
        console.log('Failed to fetch config:', error);
      }
    }

    async function loadJourney() {
      console.log('🔄 Loading journey...');
      const journeyId = localStorage.getItem(storeJourney);
      console.log('📦 Stored journey ID:', journeyId);

      if (journeyId) {
        try {
          const journeyRes = await journeyApi.getJourney(journeyId);
          console.log('📥 Fetched journey response:', journeyRes);

          if (journeyRes?.data?.id) {
            setJourney(journeyRes.data);
            console.log('✅ Journey set in store:', journeyRes.data);
          } else {
            console.warn('⚠️ No journey data in response');
          }
        } catch (error) {
          console.error('❌ Failed to fetch journey:', error);
          // Optionally create new journey if fetch fails
          await createNewJourney();
        }
      } else {
        await createNewJourney();
      }
      setIsLoading(false);
    }

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

    getConfig();
    loadJourney();
  }, []);

  // Debug: Log when journey changes
  useEffect(() => {
    console.log('📊 Current journey in store:', journey);
  }, [journey]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return null;
}

function getDefaultJourney(): Journey {
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
