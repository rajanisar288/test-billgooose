import {
  cleanFilters,
  FILTER_KEYS_BROADBAND,
  FILTER_KEYS_MOBILE,
  sanitizeDealFilters,
  TRACKING_KEYS,
} from './filters';
import { BROADBAND_DEALS_QUERY, MOBILE_DEALS_QUERY } from './queries';

import type { StickeeDealsResponse } from './types';
import type { EndpointKey } from './verticals';

export { FILTER_KEYS_BROADBAND, FILTER_KEYS_MOBILE, TRACKING_KEYS };
export type { EndpointKey };

/* =========================================================
   ENDPOINTS
========================================================= */

const DEV_ENDPOINTS: Record<EndpointKey, string> = {
  mobile: '/stickee/mobile',
  broadband: '/stickee/broadband',
};

const PROD_ENDPOINTS: Record<EndpointKey, string> = {
  // mobile: process.env.NEXT_PUBLIC_STICKEE_MOBILE_URL ?? '/stickee/mobile',
  // broadband: process.env.NEXT_PUBLIC_STICKEE_BROADBAND_URL ?? '/stickee/broadband',
    mobile: 'https://bill-goose.stickeemobiles.co.uk/graphql',
  broadband: 'https://bill-goose.stickeebroadband.co.uk/graphql'
};

const ENDPOINTS = process.env.NODE_ENV === 'production' ? PROD_ENDPOINTS : DEV_ENDPOINTS;

/* =========================================================
   AFFILIATE TRACKING
========================================================= */

export function getTracking(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of TRACKING_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}

/* =========================================================
   FETCH PARAMS
========================================================= */

export interface FetchDealsParams {
  vertical: EndpointKey;
  filters?: Record<string, unknown>;
  fixed?: Record<string, unknown>;
  page?: number;
  first?: number;
  sort?: string;
  reverse?: boolean;
  postcode?: string;
  uprn?: string;
  signal?: AbortSignal;
}

/* =========================================================
   CLIENT
========================================================= */

export async function fetchStickeeDeals({
  vertical,
  filters = {},
  fixed = {},
  page = 1,
  first = 20,
  sort = 'RECOMMENDED',
  reverse = false,
  postcode,
  uprn,
  signal,
}: FetchDealsParams): Promise<StickeeDealsResponse> {
  const endpoint = ENDPOINTS[vertical];
  if (!endpoint) {
    throw new Error(`Unknown Stickee vertical: ${vertical}`);
  }

  const query = vertical === 'broadband' ? BROADBAND_DEALS_QUERY : MOBILE_DEALS_QUERY;
  const mergedFilters = sanitizeDealFilters({ ...filters, ...getTracking() }, vertical);

  const variables: Record<string, unknown> = {
    first,
    page,
    sort,
    reverse,
    filters: mergedFilters,
    fixed_filters: cleanFilters(fixed),
  };

  if (vertical === 'broadband') {
    if (postcode) variables.postcode = postcode;
    if (uprn) variables.uprn = uprn;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 250)}`);
  }

  const json = (await res.json()) as {
    data?: StickeeDealsResponse;
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  if (!json.data) {
    throw new Error('No data returned from Stickee API');
  }

  return json.data;
}
