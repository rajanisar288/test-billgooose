import { storeJourney } from '@/constants/shared';

const LOCAL_JOURNEY_KEYS = [
  'journeyId',
  storeJourney,
  'journey-storage',
  'energyUsage',
  'billgooseJourneyService',
] as const;

const SESSION_JOURNEY_KEYS = [
  'compareFlowDetails',
  'billgooseJourneyService',
  'billgooseJourneyFlow',
  'journeySelectedPlans',
  'billgooseJourneyProgress',
  'journeySelectedPlan',
  'journeyPaymentDetails',
] as const;

export function clearJourneyStorage() {
  LOCAL_JOURNEY_KEYS.forEach((key) => localStorage.removeItem(key));
  SESSION_JOURNEY_KEYS.forEach((key) => sessionStorage.removeItem(key));

  window.dispatchEvent(new Event('billgoose-compare-flow-changed'));
  window.dispatchEvent(new Event('billgoose-journey-service-changed'));
  window.dispatchEvent(new Event('billgoose-journey-progress-changed'));
}

export function getJourneyId(journey: unknown): string | null {
  if (!journey || typeof journey !== 'object') return null;

  const value = journey as { id?: unknown; journeyId?: unknown; uuid?: unknown };
  const id = value.id ?? value.journeyId ?? value.uuid;

  return typeof id === 'string' && id.trim() ? id : null;
}

export function getSafeJourneyUrl(lastUrl: unknown): string {
  if (typeof lastUrl !== 'string' || !lastUrl.startsWith('/') || lastUrl.startsWith('//')) {
    return '/';
  }

  return lastUrl;
}

export function getResumeJourneyIdFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] !== 'journey' || !segments[1]) {
    return '';
  }

  try {
    return decodeURIComponent(segments[1]);
  } catch {
    return segments[1];
  }
}
