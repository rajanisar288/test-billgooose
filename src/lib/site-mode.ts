export type SiteMode = 'UAT' | 'PRODUCTION';

export const SITE_MODE: SiteMode =
  process.env.NEXT_PUBLIC_SITE_MODE === 'PRODUCTION' ? 'PRODUCTION' : 'UAT';

export const IS_UAT_MODE = SITE_MODE === 'UAT';

export const IS_PRODUCTION_MODE = SITE_MODE === 'PRODUCTION';
