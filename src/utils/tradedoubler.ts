import { type AdditionalParameters, type Journey } from '@/interfaces/shared';

export interface TrackingParams {
  source?: string;
  sourceName?: string;
  sourceType?: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  tduid: string;
  tdclidSn: string;
  additionalParameters: AdditionalParameters;
}

const PRIMARY_TRACKING_KEYS = new Set([
  'utmsource',
  'utmmedium',
  'utmcampaign',
  'utmterm',
  'utmcontent',
  'tduid',
  'tdclidsn',
]);

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[_-]/g, '');
}

/**
 * Checks whether the search parameters contain any TradeDoubler or tracking indicators.
 */
export function hasTradeDoublerParams(
  searchParams: { get: (name: string) => string | null } | null | undefined,
): boolean {
  if (!searchParams) return false;

  const checkKeys = [
    'tduid',
    'tdclid_sn',
    'tdclidSn',
    'td_consent',
    'progId',
    'affId',
    'utm_source',
    'utmSource',
  ];

  return checkKeys.some((k) => {
    const val = searchParams.get(k);
    return val !== null && val !== undefined && val !== '';
  });
}

/**
 * Extracts TradeDoubler & UTM tracking parameters from Next.js ReadonlyURLSearchParams or URLSearchParams.
 */
export function extractTrackingParams(
  searchParams:
    | {
        get: (name: string) => string | null;
        forEach?: (callback: (val: string, key: string) => void) => void;
        entries?: () => IterableIterator<[string, string]>;
      }
    | null
    | undefined,
): TrackingParams {
  const result: TrackingParams = {
    source: undefined,
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    tduid: '',
    tdclidSn: '',
    additionalParameters: {},
  };

  if (!searchParams) {
    return result;
  }

  // Helper to extract first matching key
  const getValue = (...keys: string[]): string => {
    for (const key of keys) {
      const val = searchParams.get(key);
      if (val !== null && val !== undefined && val !== '') {
        return val;
      }
    }
    return '';
  };

  result.utmSource = getValue('utm_source', 'utmSource');
  result.utmMedium = getValue('utm_medium', 'utmMedium');
  result.utmCampaign = getValue('utm_campaign', 'utmCampaign');
  result.utmTerm = getValue('utm_term', 'utmTerm');
  result.utmContent = getValue('utm_content', 'utmContent');
  result.tduid = getValue('tduid', 'tdUid');
  result.tdclidSn = getValue('tdclid_sn', 'tdclidSn', 'tdclidsn');

  // Collect leftover parameters into additionalParameters
  const additional: AdditionalParameters = {};

  if (typeof searchParams.forEach === 'function') {
    searchParams.forEach((val, key) => {
      const normalized = normalizeKey(key);
      if (!PRIMARY_TRACKING_KEYS.has(normalized)) {
        additional[key] = val;
      }
    });
  } else if (typeof searchParams.entries === 'function') {
    for (const [key, val] of searchParams.entries()) {
      const normalized = normalizeKey(key);
      if (!PRIMARY_TRACKING_KEYS.has(normalized)) {
        additional[key] = val;
      }
    }
  }

  result.additionalParameters = additional;

  const isTradeDoubler =
    result.utmSource.toLowerCase() === 'tradedoubler' ||
    Boolean(result.tduid) ||
    Boolean(result.tdclidSn) ||
    Boolean(additional['progId']) ||
    Boolean(additional['affId']) ||
    Boolean(additional['td_consent']);

  if (isTradeDoubler) {
    result.source = 'tradedoubler';
    result.sourceName = 'tradedoubler';
    result.sourceType = 'affiliate';
  }

  return result;
}

const TRACKING_STORAGE_KEY = 'billgoose_tracking_params';

/**
 * Persists tracking parameters to localStorage for session durability.
 */
export function saveTrackingParamsToStorage(params: TrackingParams): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(params));
  } catch {
    // Ignore storage write errors (e.g. private mode quota)
  }
}

/**
 * Retrieves stored tracking parameters from localStorage.
 */
export function getStoredTrackingParams(): TrackingParams | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TRACKING_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TrackingParams;
  } catch {
    return null;
  }
}

/**
 * Merges tracking parameters into an existing Journey payload.
 */
export function enrichJourneyWithTracking(payload: Journey, tracking: TrackingParams): Journey {
  return {
    ...payload,
    source: tracking.source || payload.source,
    utmSource: tracking.utmSource || payload.utmSource || '',
    utmMedium: tracking.utmMedium || payload.utmMedium || '',
    utmCampaign: tracking.utmCampaign || payload.utmCampaign || '',
    utmTerm: tracking.utmTerm || payload.utmTerm || '',
    utmContent: tracking.utmContent || payload.utmContent || '',
    tduid: tracking.tduid || payload.tduid || '',
    tdclidSn: tracking.tdclidSn || payload.tdclidSn || '',
    additionalParameters: {
      ...(payload.additionalParameters || {}),
      ...(tracking.additionalParameters || {}),
    },
  };
}
