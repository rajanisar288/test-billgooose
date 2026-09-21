/**
 * Vertical definitions and sort options for the Stickee comparison engine.
 */

export const VERTICALS = {
  mobile_paym: {
    label: 'Mobile — PAYM (Handsets)',
    endpointKey: 'mobile' as const,
    fixed: {
      hardware_types: ['HANDSET'],
      tariff_types: ['PAY_MONTHLY'],
    },
  },
  mobile_simo: {
    label: 'Mobile — SIM Only',
    endpointKey: 'mobile' as const,
    fixed: {
      hardware_types: ['SIM_ONLY'],
      tariff_types: ['PAY_MONTHLY'],
    },
  },
  mobile_payg: {
    label: 'Mobile — PAYG',
    endpointKey: 'mobile' as const,
    fixed: {
      hardware_types: ['HANDSET'],
      tariff_types: ['PAY_AS_YOU_GO'],
    },
  },
  broadband: {
    label: 'Broadband',
    endpointKey: 'broadband' as const,
    fixed: {} as Record<string, unknown>,
  },
} as const;

/**
 * Supported sort options for Mobile & SIM-Only deals.
 */
export const MOBILE_SORTS = {
  RECOMMENDED: { sort: 'RECOMMENDED', reverse: false, label: 'Recommended' },
  PRICE_ASC: { sort: 'PRICE', reverse: false, label: 'Cheapest first' },
  PRICE_DESC: { sort: 'PRICE', reverse: true, label: 'Most expensive' },
  DATA_DESC: { sort: 'DATA', reverse: true, label: 'Most data' },
  TOTAL_ASC: { sort: 'TOTAL_COST', reverse: false, label: 'Lowest total cost' },
} as const;

/**
 * Supported sort options for Broadband deals.
 */
export const BROADBAND_SORTS = {
  RECOMMENDED: { sort: 'RECOMMENDED', reverse: false, label: 'Recommended' },
  PRICE_ASC: { sort: 'MONTHLY_PRICE', reverse: false, label: 'Cheapest monthly' },
  SPEED_DESC: { sort: 'DOWNLOAD_SPEED', reverse: true, label: 'Fastest download speed' },
  TOTAL_ASC: { sort: 'TOTAL_PRICE', reverse: false, label: 'Lowest total cost' },
  CONTRACT_ASC: { sort: 'CONTRACT_LENGTH', reverse: false, label: 'Shortest contract' },
} as const;

/** Backward-compatible alias */
export const SORTS = MOBILE_SORTS;

export type MobileSortKey = keyof typeof MOBILE_SORTS;
export type BroadbandSortKey = keyof typeof BROADBAND_SORTS;
export type SortKey = MobileSortKey | BroadbandSortKey;
export type VerticalKey = keyof typeof VERTICALS;
export type EndpointKey = 'mobile' | 'broadband';
