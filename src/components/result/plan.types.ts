export type CompareResultService = 'energy' | 'broadband';

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

  viewDetailsButton: string;

  primaryButton: string;

  /* =========================================================
     BROADBAND-ONLY DATA
  ========================================================= */

  averageSpeed?: string;

  upfrontCost?: string;

  providerUrl?: string;
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

  viewDetailsButton: string;

  primaryButton: string;

  /* =========================================================
     BROADBAND-ONLY DATA
  ========================================================= */

  averageSpeed?: string;

  upfrontCost?: string;

  providerUrl?: string;
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

export type StandardPlan = SelectPlan | ViewDealPlan;

export type ResultPlan = StandardPlan | FeaturedBroadbandPlan;
