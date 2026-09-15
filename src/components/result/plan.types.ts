export type CompareResultService =
  'energy' | 'bundle-bills' | 'broadband' | 'sim-only' | 'insurance';

export type SelectPlan = {
  id: string;
  type: 'select-plan';
  service?: CompareResultService;
  provider: string;
  description: string;
  logo: string;
  logoAlt: string;
  rating: string;
  contract: string;
  features: string[];
  priceLabel: string;
  price: string;
  pricePeriod: string;
  saving: string;
  averageSpeed?: string;
  upfrontCost?: string;
  providerUrl?: string;
  quoteId?: string;
  productReference?: string;
  productReferences?: string[];
  groupType?: string;
  groupDisplayName?: string;
  selectionMode?: 'single' | 'multiple' | string;
  supplierCode?: string;
  paymentMethod?: string;
  annualPrice?: string;
  productType?: string;
  feeDetails?: unknown[];
  priceIncreaseDetails?: unknown[];
  viewDetailsButton: string;
  primaryButton: string;
};

export type ViewDealPlan = {
  id: string;
  type: 'view-deal';
  service?: CompareResultService;
  provider: string;
  description: string;
  logo: string;
  logoAlt: string;
  rating: string;
  contract: string;
  features: string[];
  priceLabel: string;
  price: string;
  pricePeriod: string;
  saving: string;
  averageSpeed?: string;
  upfrontCost?: string;
  providerUrl?: string;
  quoteId?: string;
  productReference?: string;
  productReferences?: string[];
  groupType?: string;
  groupDisplayName?: string;
  selectionMode?: 'single' | 'multiple' | string;
  paymentMethod?: string;
  annualPrice?: string;
  productType?: string;
  feeDetails?: unknown[];
  priceIncreaseDetails?: unknown[];
  viewDetailsButton: string;
  primaryButton: string;
};

export type FeaturedBroadbandPlan = {
  id: string;
  type: 'featured-broadband';
  featured: {
    eyebrow: string;
    heading: string;
    description: string;
    icon: string;
    iconAlt: string;
    backgroundImage: string;
  };
  provider: string;
  description: string;
  logo: string;
  logoAlt: string;
  rating: string;
  contract: string;
  features: string[];
  priceLabel: string;
  price: string;
  pricePeriod: string;
  saving: string;
  primaryButton: string;
};

export type SimOnlyPlan = {
  id: string;
  type: 'sim-only';
  service: 'sim-only';
  provider: string;
  networkDescription: string;
  logo: string;
  logoAlt: string;
  badges: string[];
  data: string;
  priceLabel: string;
  price: string;
  upfrontLabel: string;
  upfrontCost: string;
  roamingText: string;
  providerUrl: string;
  primaryButton: string;
  secondaryButton: string;
};

export type StandardPlan = SelectPlan | ViewDealPlan;
export type ResultPlan = StandardPlan | FeaturedBroadbandPlan;
