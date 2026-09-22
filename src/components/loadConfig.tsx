// components/loadConfig.tsx
'use client';

/* eslint-disable no-console, react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import FullPageLoader from '@/components/common/FullPageLoader';
import ResumeJourneyDialog from '@/components/journey/resume-journey-dialog';
import { storeJourney, storePartnerConfig } from '@/constants/shared';
import { type Journey } from '@/interfaces/shared';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { partnerConfigApi } from '@/lib/api/endpoints/partnerConfig';
import { useJourneyStore } from '@/store/journeyStore';
import {
  extractTrackingParams,
  hasTradeDoublerParams,
  saveTrackingParamsToStorage,
} from '@/utils/tradedoubler';
import { generateRequestId } from '@/utils/uuid';

export function LoadConfig() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setJourney, journey } = useJourneyStore();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingResumeJourney, setPendingResumeJourney] = useState<Journey | null>(null);
  const pathname = usePathname();

  async function createNewJourney(overridePayload?: Partial<Journey>) {
    const payload: Journey = {
      ...getDefaultJourney(),
      ...overridePayload,
      uuid: overridePayload?.uuid || generateRequestId(),
    };

    console.log('🆕 Creating new journey with payload:', payload);

    try {
      const createdJourney = await journeyApi.createJourney(payload);

      console.log('✅ Created journey response:', createdJourney);

      const journeyData: Journey = {
        ...payload,
        ...createdJourney?.data,
        source: payload.source,
        sourceType: payload.sourceType,
        sourceName: payload.sourceName,
        utmSource: payload.utmSource,
        utmMedium: payload.utmMedium,
        utmCampaign: payload.utmCampaign,
        utmTerm: payload.utmTerm,
        utmContent: payload.utmContent,
        tduid: payload.tduid,
        tdclidSn: payload.tdclidSn,
        additionalParameters: payload.additionalParameters,
      };

      const journeyId = journeyData?.id || journeyData?.journeyId || payload.uuid;

      if (journeyId) {
        localStorage.setItem(storeJourney, journeyId);
        setJourney(journeyData);

        console.log('💾 New journey saved to store:', journeyData);

        if (journeyData?.lastUrl) {
          router.push(journeyData.lastUrl);
        }
        return journeyData;
      } else {
        console.error('❌ No journeyId in created response');
      }
    } catch (error) {
      console.error('❌ Failed to create journey:', error);
    }
    return undefined;
  }

  useEffect(() => {
    async function initialize() {
      const isBypassPage =
        pathname === '/sign-in' ||
        pathname.startsWith('/sign-in/') ||
        pathname === '/my-info' ||
        pathname.startsWith('/my-info/') ||
        pathname === '/dashboard' ||
        pathname.startsWith('/dashboard/') ||
        pathname === '/journey' ||
        pathname.startsWith('/journey/');

      if (isBypassPage) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // 1. Load partner config
        try {
          const config = await partnerConfigApi.getConfig();
          localStorage.setItem(storePartnerConfig, JSON.stringify(config.data));
          console.log('✅ Config loaded');
        } catch (error) {
          console.error('❌ Failed to fetch config:', error);
        }

        // 2. Check for TradeDoubler / UTM query parameters
        const hasTracking = hasTradeDoublerParams(searchParams);
        const tracking = extractTrackingParams(searchParams);

        if (hasTracking) {
          saveTrackingParamsToStorage(tracking);

          // Reuse existing journey ID if present, otherwise generate a new one
          const existingJourneyId =
            localStorage.getItem(storeJourney) || journey?.id || journey?.journeyId;
          const targetUuid = existingJourneyId || generateRequestId();

          // If existing journey ID is present, retrieve existing journey details for lastUrl & comparison state
          let existingJourneyData: Journey | null = null;
          if (existingJourneyId) {
            try {
              const existingRes = await journeyApi.getJourney(existingJourneyId);
              if (existingRes?.data?.id || existingRes?.data?.journeyId) {
                existingJourneyData = existingRes.data;
              }
            } catch (err) {
              console.warn('⚠️ Could not fetch existing journey details:', err);
            }
          }

          const payload: Partial<Journey> = {
            uuid: targetUuid,
            source: 'tradedoubler',
            sourceName: 'tradedoubler',
            sourceType: 'affiliateNetwork',
            utmSource: tracking.utmSource,
            utmMedium: tracking.utmMedium,
            utmCampaign: tracking.utmCampaign,
            utmTerm: tracking.utmTerm,
            utmContent: tracking.utmContent,
            tduid: tracking.tduid,
            tdclidSn: tracking.tdclidSn,
            additionalParameters: tracking.additionalParameters,
          };

          console.log(
            '🎯 TradeDoubler params detected. Always hitting createJourney with payload:',
            payload,
          );

          try {
            const createdJourney = await journeyApi.createJourney(payload);
            console.log('✅ TradeDoubler createJourney response:', createdJourney);

            const journeyData: Journey = {
              ...(journey || {}),
              ...(existingJourneyData || {}),
              ...payload,
              ...createdJourney?.data,
              source: 'tradedoubler',
              sourceName: 'tradedoubler',
              sourceType: 'affiliateNetwork',
              utmSource: payload.utmSource,
              utmMedium: payload.utmMedium,
              utmCampaign: payload.utmCampaign,
              utmTerm: payload.utmTerm,
              utmContent: payload.utmContent,
              tduid: payload.tduid,
              tdclidSn: payload.tdclidSn,
              additionalParameters: payload.additionalParameters,
            };

            const savedId = journeyData?.id || journeyData?.journeyId || targetUuid;
            localStorage.setItem(storeJourney, savedId);
            setJourney(journeyData);
            console.log('💾 TradeDoubler journey saved to store & localStorage:', journeyData);

            if (journeyData?.lastUrl) {
              console.log('📋 Displaying ResumeJourneyDialog for lastUrl:', journeyData.lastUrl);
              setPendingResumeJourney(journeyData);
            }
          } catch (error) {
            console.error('❌ Failed to hit createJourney with TradeDoubler payload:', error);
            localStorage.setItem(storeJourney, targetUuid);
            const fallbackJourney: Journey = {
              ...(journey || {}),
              ...(existingJourneyData || {}),
              ...payload,
              uuid: targetUuid,
            };
            setJourney(fallbackJourney);

            if (fallbackJourney?.lastUrl) {
              setPendingResumeJourney(fallbackJourney);
            }
          }
        } else {
          // Standard flow without query parameters
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
                  setPendingResumeJourney(journeyRes.data);
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
        }
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  // Debug: Log when journey changes
  useEffect(() => {
    console.log('📊 Current journey in store:', journey);
  }, [journey]);

  if (isLoading) {
    return <FullPageLoader message="Loading configuration..." />;
  }

  if (pendingResumeJourney) {
    return (
      <ResumeJourneyDialog
        deviceJourney={pendingResumeJourney}
        onClose={() => setPendingResumeJourney(null)}
      />
    );
  }

  return null;
}

export function getDefaultJourney(tracking?: Partial<Journey>): Journey {
  return {
    address: null,
    lastUrl: '',
    customer: null,
    uuid: generateRequestId(),
    source: tracking?.source || 'direct',
    sourceType: tracking?.sourceType || 'direct',
    sourceName: tracking?.sourceName || 'direct',
    sourceId: '2',
    networkId: '',
    programmeId: (tracking?.additionalParameters?.progId as string) || '',
    affiliateId: (tracking?.additionalParameters?.affId as string) || '',
    publisherId: '',
    clickId: '',
    referralId: '',
    campaignId: '',
    subAffiliateId: '',
    placementId: '',
    networkSpecificId: '',
    landingUrl: typeof window !== 'undefined' ? window.location.href : '',
    referrerUrl: typeof document !== 'undefined' ? document.referrer : '',
    utmSource: tracking?.utmSource || '',
    utmMedium: tracking?.utmMedium || '',
    utmCampaign: tracking?.utmCampaign || '',
    utmTerm: tracking?.utmTerm || '',
    utmContent: tracking?.utmContent || '',
    tduid: tracking?.tduid || '',
    tdclidSn: tracking?.tdclidSn || '',
    additionalParameters: tracking?.additionalParameters || {},
    ...tracking,
  };
}
