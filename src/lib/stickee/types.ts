export interface MinMax {
  min: number | null;
  max: number | null;
}

export interface DateMinMax {
  min: string | null;
  max: string | null;
}

/* =========================================================
   MOBILE & SIM-ONLY TYPES
========================================================= */

export interface StickeeNetwork {
  id: string;
  name: string;
  image: string;
  score?: number;
}

export interface StickeeBrand {
  id: string;
  name: string;
  image?: string;
}

export interface StickeeRetailer {
  id: string;
  name: string;
  image: string;
  is_reseller?: boolean;
}

export interface StickeeModel {
  id?: string;
  name: string;
  release_date?: string;
  brand: {
    id?: string;
    name: string;
  };
}

export interface StickeeTariff {
  network: StickeeNetwork;
  /** Data in MB. -1 = Unlimited. >= 999999 = Unlimited. */
  data: number;
  line_rental: number;
  contract_length: number;
  /** -1 = Unlimited */
  minutes: number;
  /** -1 = Unlimited */
  texts: number;
  data_type: string;
}

export interface StickeeDeal {
  id: string;
  price: number;
  total_cost: number;
  featured_status?: string;
  is_featured: boolean;
  is_exclusive: boolean;
  is_refurbished: boolean;
  is_sim_only: boolean;
  url: string;
  main_model_image: string;
  cashback: number;
  cashback_type?: string;
  discount_line_rental?: number;
  discount_months?: number;
  price_increases?: Array<{ date: string; price: number }>;
  tags?: Array<{ title?: string; type: string }>;
  promos?: unknown;
  gift?: { name: string };
  model: StickeeModel;
  tariff: StickeeTariff;
  retailer: StickeeRetailer;
}

export interface StickeeFacets {
  hardware_types: string[];
  tariff_types: string[];
  release_dates: DateMinMax[];
  resellers: string[];
  cashback_types: string[];
  refurbished: string[];
  price_increases: boolean[];
  contract_lengths_new: number[];
  upfront_prices: MinMax[];
  effective_line_rentals: MinMax[];
  texts: MinMax[];
  data: MinMax[];
  minutes: MinMax[];
  networks: StickeeNetwork[];
  brands: StickeeBrand[];
  families: Array<{ id: string; name: string; brand: { id: string }; image?: string }>;
  models: Array<{ id: string; name: string; release_date?: string; brand: { id: string } }>;
  colours: Array<{ id: string; name: string }>;
  gift_types: Array<{ id: string; name: string }>;
  retailers: StickeeRetailer[];
  internal_memories: number[];
  model_data_types: string[];
  tariff_data_types: string[];
}

export interface StickeeMobileDealsResponse {
  deal_filters: StickeeFacets;
  deals: {
    data: StickeeDeal[];
    paginatorInfo: {
      hasMorePages: boolean;
    };
  };
  feature_flags?: {
    json: unknown;
  };
}

/* =========================================================
   BROADBAND TYPES
========================================================= */

export interface StickeeBroadbandSupplier {
  id: string;
  name: string;
  image: string;
}

export interface StickeeBroadbandDeal {
  id: string;
  name: string;
  sku: string;
  download_speed: number;
  upload_speed: number;
  monthly_price: number;
  initial_price: number;
  headline_price: number;
  discount_price: number;
  discount_months: number;
  min_contract_length: number;
  delivery_price: number;
  connection_price: number;
  equipment_price: number;
  total_first_year_cost: number;
  full_contract_cost: number;
  url: string;
  supplier: StickeeBroadbandSupplier;
  supplier_image: string;
  package_type: string;
  connection_type: string;
  bullet_1?: string;
  bullet_2?: string;
  bullet_3?: string;
  gift?: string;
  openreach?: boolean;
  technology?: string;
  score?: number;
}

export interface StickeeBroadbandFacets {
  suppliers: StickeeBroadbandSupplier[];
  contract_lengths: number[];
  package_types: string[];
  connection_types: string[];
  download_speeds: MinMax[];
  monthly_prices: MinMax[];
  headline_prices: MinMax[];
  includes_home_bb?: boolean[];
  includes_mobile_bb?: boolean[];
  includes_tv?: boolean[];
  includes_phone?: boolean[];
  includes_sim?: boolean[];
  social_tariffs?: boolean[];
}

export interface StickeeBroadbandDealsResponse {
  deal_filters: StickeeBroadbandFacets;
  deals: {
    data: StickeeBroadbandDeal[];
    paginatorInfo: {
      hasMorePages: boolean;
    };
  };
  feature_flags?: {
    json: unknown;
  };
}

/* =========================================================
   UNIFIED TYPES
========================================================= */

export type AnyStickeeDeal = StickeeDeal | StickeeBroadbandDeal;
export type AnyStickeeFacets = StickeeFacets | StickeeBroadbandFacets;

export interface StickeeDealsResponse {
  deal_filters: AnyStickeeFacets;
  deals: {
    data: AnyStickeeDeal[];
    paginatorInfo: {
      hasMorePages: boolean;
    };
  };
  feature_flags?: {
    json: unknown;
  };
}

/** Type guard for Broadband deals */
export function isBroadbandDeal(deal: AnyStickeeDeal): deal is StickeeBroadbandDeal {
  return 'download_speed' in deal && 'supplier' in deal;
}

/** Type guard for Mobile deals */
export function isMobileDeal(deal: AnyStickeeDeal): deal is StickeeDeal {
  return 'tariff' in deal && 'model' in deal;
}

/** Type guard for Broadband facets */
export function isBroadbandFacets(
  facets: AnyStickeeFacets | null,
): facets is StickeeBroadbandFacets {
  return facets !== null && 'suppliers' in facets && 'download_speeds' in facets;
}

/** Type guard for Mobile facets */
export function isMobileFacets(facets: AnyStickeeFacets | null): facets is StickeeFacets {
  return facets !== null && 'networks' in facets && 'brands' in facets;
}
