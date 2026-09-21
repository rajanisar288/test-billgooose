/**
 * Allowed top-level keys for the Stickee Mobile FilterDeal input.
 */
export const FILTER_KEYS_MOBILE = [
  'brands',
  'networks',
  'retailers',
  'models',
  'families',
  'colours',
  'gift_types',
  'internal_memories',
  'contract_lengths_new',
  'price_increases',
  'resellers',
  'refurbished',
  'cashback_types',
  'model_data_types',
  'tariff_data_types',
  'upfront_max',
  'monthly_max',
  'data_min',
  'minutes_min',
  'release_date_from',
  'release_date_to',
] as const;

/**
 * Allowed top-level keys for the Stickee Broadband FilterDeal input.
 * Strictly adheres to STICKEE_INTEGRATION_CONTEXT.md Section 6.2.
 */
export const FILTER_KEYS_BROADBAND = [
  'suppliers',
  'contract_lengths',
  'package_types',
  'connection_types',
  'download_speed',
  'monthly_price',
  'headline_price',
  'includes_home_bb',
  'includes_tv',
  'includes_phone',
  'includes_sim',
  'social_tariff',
] as const;

/**
 * Affiliate tracking keys supported inside $filters for commission attribution.
 */
export const TRACKING_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'AFFCLIE',
  'affclie',
  'sskey',
  'affcamp',
  'affkey',
  'clickref',
  'afftrack',
] as const;

/** Backward-compatible alias */
export const FILTER_KEYS = FILTER_KEYS_MOBILE;

/**
 * Strips `null`, `undefined`, empty strings, empty arrays, and empty objects
 * so that the resulting object is a valid Stickee `FilterDeal` input.
 */
export function cleanFilters(input: Record<string, unknown> = {}): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    if (typeof v === 'object' && !Array.isArray(v)) {
      const cleanedSub = cleanFilters(v as Record<string, unknown>);
      if (Object.keys(cleanedSub).length === 0) continue;
      out[k] = cleanedSub;
      continue;
    }
    out[k] = v;
  }
  return out;
}

/**
 * Whitelists only the valid FilterDeal keys for the specific vertical,
 * preserving affiliate tracking parameters, and strips empty/null values.
 */
export function sanitizeDealFilters(
  filters: Record<string, unknown> = {},
  vertical: 'mobile' | 'broadband',
): Record<string, unknown> {
  const allowedKeys: readonly string[] =
    vertical === 'broadband' ? FILTER_KEYS_BROADBAND : FILTER_KEYS_MOBILE;
  const trackingSet = new Set<string>(TRACKING_KEYS);

  const sanitized: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(filters)) {
    if (allowedKeys.includes(k) || trackingSet.has(k)) {
      sanitized[k] = v;
    }
  }
  return cleanFilters(sanitized);
}
