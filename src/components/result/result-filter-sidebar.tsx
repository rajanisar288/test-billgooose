'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { Check, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';

import { useResultFilters } from '@/components/result/result-filter-context';
import data from '@/data/content.json';
import { isBroadbandFacets, isMobileFacets, type AnyStickeeFacets } from '@/lib/stickee/types';

const FILTER_BANNER_IMAGE = '/images/result-filter-banner.png';

type FilterValues = Record<string, string>;

type FilterField = (typeof data.resultPage.filters.fields)[number];

export type StickeeFilterFormState = {
  suppliers: string[];
  brands: string[];
  models: string[];
  networks: string[];
  retailers: string[];
  contractLengths: number[];
  packageTypes: string[];
  connectionTypes: string[];
  upfrontMax: number | null;
  monthlyMax: number | null;
  dataMin: number | null;
  speedMin: number | null;
  refurbished: string;
  resellers: string;
  excludePriceIncreases: boolean;
  unlimitedMinsTexts: boolean;
  freeGifts: boolean;
  memories: number[];
  colours: string[];
  giftTypes: string[];
  fiveG: string;
};

const INITIAL_STICKEE_FILTER_STATE: StickeeFilterFormState = {
  suppliers: [],
  brands: [],
  models: [],
  networks: [],
  retailers: [],
  contractLengths: [],
  packageTypes: [],
  connectionTypes: [],
  upfrontMax: null,
  monthlyMax: null,
  dataMin: null,
  speedMin: null,
  refurbished: 'ALL',
  resellers: 'ALL',
  excludePriceIncreases: false,
  unlimitedMinsTexts: false,
  freeGifts: false,
  memories: [],
  colours: [],
  giftTypes: [],
  fiveG: 'ALL',
};

type ResultFilterSidebarProps = {
  showBanner?: boolean;
  mobilePanel?: boolean;
  facets?: AnyStickeeFacets | null;
  isBroadband?: boolean;
  isMobile?: boolean;
  isSimOnly?: boolean;
  isLoading?: boolean;
};

export default function ResultFilterSidebar({
  showBanner = true,
  mobilePanel = false,
  facets: propFacets = null,
  isBroadband: propIsBroadband = false,
  isMobile: propIsMobile = false,
  isSimOnly: propIsSimOnly = false,
  isLoading = false,
}: ResultFilterSidebarProps) {
  const searchParams = useSearchParams();
  const {
    filters: appliedFilters,
    setFilters,
    resetFilters,
    stickeeFacets: contextFacets,
  } = useResultFilters();

  const currentService = searchParams.get('service');
  const isBroadband = propIsBroadband || currentService === 'broadband';
  const isMobile = propIsMobile || currentService === 'mobile';
  const isSimOnly = propIsSimOnly || (!isBroadband && !isMobile && currentService === 'sim-only');
  const isStickeeService = isBroadband || isMobile || isSimOnly;

  const activeFacets = propFacets || contextFacets;

  const { filters } = data.resultPage;

  /* =========================================================
     CONSOLIDATED STICKEE FILTER OBJECT STATE
  ========================================================= */

  const [stickeeForm, setStickeeForm] = useState<StickeeFilterFormState>(
    INITIAL_STICKEE_FILTER_STATE,
  );
  const [showAllMobileFilters, setShowAllMobileFilters] = useState(false);

  /* =========================================================
     ENERGY/INSURANCE STATIC FILTER STATE
  ========================================================= */

  const defaultValues = useMemo<FilterValues>(() => {
    return filters.fields.reduce<FilterValues>((values, field) => {
      values[field.id] = field.defaultValue;
      return values;
    }, {});
  }, [filters.fields]);

  const [selectedValues, setSelectedValues] = useState<FilterValues>(defaultValues);
  const [onlyBillGoose, setOnlyBillGoose] = useState(false);
  const [includeSupplier, setIncludeSupplier] = useState(false);
  const [isYourPlansOpen, setIsYourPlansOpen] = useState(true);

  // Sync state from context when filters change externally
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setSelectedValues((cur) => ({ ...cur, ...appliedFilters.values }));
    setOnlyBillGoose(appliedFilters.onlyBillGoose);
    setIncludeSupplier(appliedFilters.includeSupplier);

    const sf = appliedFilters.stickeeFilters || {};

    setStickeeForm({
      suppliers: Array.isArray(sf.suppliers) ? (sf.suppliers as string[]) : [],
      brands: Array.isArray(sf.brands) ? (sf.brands as string[]) : [],
      models: Array.isArray(sf.models) ? (sf.models as string[]) : [],
      networks: Array.isArray(sf.networks) ? (sf.networks as string[]) : [],
      retailers: Array.isArray(sf.retailers) ? (sf.retailers as string[]) : [],
      contractLengths: Array.isArray(sf.contract_lengths)
        ? (sf.contract_lengths as number[])
        : Array.isArray(sf.contract_lengths_new)
          ? (sf.contract_lengths_new as number[])
          : [],
      packageTypes: Array.isArray(sf.package_types) ? (sf.package_types as string[]) : [],
      connectionTypes: Array.isArray(sf.connection_types) ? (sf.connection_types as string[]) : [],
      upfrontMax: typeof sf.upfront_max === 'number' ? sf.upfront_max : null,
      monthlyMax:
        typeof sf.monthly_max === 'number'
          ? sf.monthly_max
          : sf.monthly_price && typeof (sf.monthly_price as { max?: number }).max === 'number'
            ? (sf.monthly_price as { max?: number }).max!
            : null,
      dataMin: typeof sf.data_min === 'number' ? sf.data_min : null,
      speedMin:
        sf.download_speed && typeof (sf.download_speed as { min?: number }).min === 'number'
          ? (sf.download_speed as { min?: number }).min!
          : null,
      refurbished:
        Array.isArray(sf.refurbished) && sf.refurbished[0] ? (sf.refurbished[0] as string) : 'ALL',
      resellers:
        Array.isArray(sf.resellers) && sf.resellers[0] ? (sf.resellers[0] as string) : 'ALL',
      excludePriceIncreases: Array.isArray(sf.price_increases)
        ? sf.price_increases.includes(false)
        : sf.contract_price_increases === false,
      unlimitedMinsTexts: Boolean(sf.unlimited_mins_texts),
      freeGifts: Boolean(sf.free_gifts || sf.gift),
      memories: Array.isArray(sf.internal_memories) ? (sf.internal_memories as number[]) : [],
      colours: Array.isArray(sf.colours) ? (sf.colours as string[]) : [],
      giftTypes: Array.isArray(sf.gift_types) ? (sf.gift_types as string[]) : [],
      fiveG:
        Array.isArray(sf.model_data_types) && sf.model_data_types[0]
          ? (sf.model_data_types[0] as string)
          : 'ALL',
    });
  }, [appliedFilters]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* =========================================================
     STATE UPDATE HELPERS
  ========================================================= */

  const updateFilter = <K extends keyof StickeeFilterFormState>(
    key: K,
    value: StickeeFilterFormState[K],
  ) => {
    setStickeeForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = <K extends keyof StickeeFilterFormState, T>(key: K, item: T) => {
    setStickeeForm((prev) => {
      const list = (prev[key] as unknown as T[]) || [];
      const next = list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
      return { ...prev, [key]: next };
    });
  };

  /* =========================================================
     APPLY & RESET
  ========================================================= */

  const handleReset = () => {
    setStickeeForm(INITIAL_STICKEE_FILTER_STATE);
    setSelectedValues(defaultValues);
    setOnlyBillGoose(false);
    setIncludeSupplier(false);
    resetFilters();
  };

  const handleApply = () => {
    if (isStickeeService) {
      const stickeeFilters: Record<string, unknown> = {};

      if (isBroadband) {
        if (stickeeForm.suppliers.length > 0) stickeeFilters.suppliers = stickeeForm.suppliers;
        if (stickeeForm.contractLengths.length > 0)
          stickeeFilters.contract_lengths = stickeeForm.contractLengths;
        if (stickeeForm.packageTypes.length > 0)
          stickeeFilters.package_types = stickeeForm.packageTypes;
        if (stickeeForm.connectionTypes.length > 0)
          stickeeFilters.connection_types = stickeeForm.connectionTypes;
        if (stickeeForm.speedMin != null)
          stickeeFilters.download_speed = { min: stickeeForm.speedMin };
        if (stickeeForm.monthlyMax != null)
          stickeeFilters.monthly_price = { max: stickeeForm.monthlyMax };
        if (stickeeForm.freeGifts) stickeeFilters.gift = true;
      } else {
        // Mobile or SIM-Only
        if (stickeeForm.brands.length > 0) stickeeFilters.brands = stickeeForm.brands;
        if (stickeeForm.models.length > 0) stickeeFilters.models = stickeeForm.models;
        if (stickeeForm.networks.length > 0) stickeeFilters.networks = stickeeForm.networks;
        if (stickeeForm.retailers.length > 0) stickeeFilters.retailers = stickeeForm.retailers;
        if (stickeeForm.contractLengths.length > 0)
          stickeeFilters.contract_lengths_new = stickeeForm.contractLengths;
        if (stickeeForm.upfrontMax != null) stickeeFilters.upfront_max = stickeeForm.upfrontMax;
        if (stickeeForm.monthlyMax != null) stickeeFilters.monthly_max = stickeeForm.monthlyMax;
        if (stickeeForm.dataMin != null) stickeeFilters.data_min = stickeeForm.dataMin;
        if (stickeeForm.refurbished !== 'ALL')
          stickeeFilters.refurbished = [stickeeForm.refurbished];
        if (stickeeForm.resellers !== 'ALL') stickeeFilters.resellers = [stickeeForm.resellers];
        if (stickeeForm.excludePriceIncreases) stickeeFilters.price_increases = [false];
        if (stickeeForm.unlimitedMinsTexts) {
          stickeeFilters.unlimited_mins_texts = true;
          stickeeFilters.minutes_min = -1;
          stickeeFilters.texts_min = -1;
        }
        if (stickeeForm.memories.length > 0)
          stickeeFilters.internal_memories = stickeeForm.memories;
        if (stickeeForm.colours.length > 0) stickeeFilters.colours = stickeeForm.colours;
        if (stickeeForm.giftTypes.length > 0) stickeeFilters.gift_types = stickeeForm.giftTypes;
        if (stickeeForm.fiveG !== 'ALL') {
          stickeeFilters.model_data_types = [stickeeForm.fiveG];
          stickeeFilters.tariff_data_types = [stickeeForm.fiveG];
        }
      }

      setFilters({
        values: {},
        onlyBillGoose: false,
        includeSupplier: false,
        networks: stickeeForm.networks,
        simValues: {},
        stickeeFilters,
      });
      return;
    }

    setFilters({
      values: selectedValues,
      onlyBillGoose,
      includeSupplier,
      networks: [],
      simValues: {},
      stickeeFilters: {},
    });
  };

  /* =========================================================
     DYNAMIC OPTIONS GENERATION FROM API FACETS
  ========================================================= */

  const broadbandFacets = isBroadbandFacets(activeFacets) ? activeFacets : null;
  const mobileFacets = isMobileFacets(activeFacets) ? activeFacets : null;

  // Dynamic broadband speed tiers from API download_speeds min/max
  const dynamicSpeedTiers = useMemo(() => {
    if (!broadbandFacets) return [];
    const maxSpeed = broadbandFacets.download_speeds?.[0]?.max ?? 1000;
    return [
      { label: 'Any speed', value: null },
      { label: '30 Mbps+', value: 30 },
      { label: '60 Mbps+', value: 60 },
      { label: '100 Mbps+', value: 100 },
      { label: '300 Mbps+', value: 300 },
      { label: '500 Mbps+', value: 500 },
      { label: 'Gigabit (900 Mbps+)', value: 900 },
    ].filter((t) => t.value === null || t.value <= maxSpeed);
  }, [broadbandFacets]);

  // Dynamic broadband monthly price tiers from API monthly_prices min/max
  const dynamicBroadbandPriceTiers = useMemo(() => {
    if (!broadbandFacets) return [];
    const minPrice = broadbandFacets.monthly_prices?.[0]?.min ?? 0;
    return [
      { label: 'Any price', value: null },
      { label: 'Up to £25/mo', value: 25 },
      { label: 'Up to £35/mo', value: 35 },
      { label: 'Up to £50/mo', value: 50 },
      { label: 'Up to £75/mo', value: 75 },
    ].filter((t) => t.value === null || t.value >= minPrice);
  }, [broadbandFacets]);

  // Dynamic mobile data tiers from API data min/max
  const dynamicDataTiers = useMemo(() => {
    if (!mobileFacets) return [];
    return [
      { label: 'Any data', value: null },
      { label: '5GB+', value: 5000 },
      { label: '20GB+', value: 20000 },
      { label: '50GB+', value: 50000 },
      { label: '100GB+', value: 100000 },
      { label: 'Unlimited data', value: 999999 },
    ];
  }, [mobileFacets]);

  // Dynamic mobile monthly cost tiers from API effective_line_rentals
  const dynamicMobileMonthlyTiers = useMemo(() => {
    if (!mobileFacets) return [];
    const minRental = mobileFacets.effective_line_rentals?.[0]?.min ?? 0;
    return [
      { label: 'Any monthly cost', value: null },
      { label: 'Up to £20/mo', value: 20 },
      { label: 'Up to £35/mo', value: 35 },
      { label: 'Up to £50/mo', value: 50 },
      { label: 'Up to £70/mo', value: 70 },
    ].filter((t) => t.value === null || t.value >= minRental);
  }, [mobileFacets]);

  // Dynamic upfront cost tiers from API upfront_prices
  const dynamicUpfrontTiers = useMemo(() => {
    if (!mobileFacets) return [];
    const maxUpfront = mobileFacets.upfront_prices?.[0]?.max ?? 500;
    return [
      { label: 'Any upfront cost', value: null },
      { label: 'Free upfront', value: 0 },
      { label: 'Up to £50', value: 50 },
      { label: 'Up to £100', value: 100 },
      { label: 'Up to £200', value: 200 },
    ].filter((t) => t.value === null || t.value <= maxUpfront);
  }, [mobileFacets]);

  return (
    <aside
      className={
        mobilePanel
          ? 'relative z-20 w-full min-w-0'
          : 'relative z-20 w-full min-w-0 lg:-mt-6 lg:w-[326px] lg:shrink-0'
      }
    >
      <div className="relative w-full overflow-visible rounded-[20px] border border-[#EAECF0] bg-white px-4 pb-4 pt-6 shadow-[0px_4px_14px_rgba(16,24,40,0.06)] lg:w-[326px]">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="font-red-hat-display text-[14px] font-extrabold leading-5 text-[#101828] lg:text-[16px]">
            Filters
          </h2>
          <ChevronUp
            aria-hidden="true"
            className="h-4 w-4 text-[#475467]"
            strokeWidth={1.8}
          />
        </div>

        {/* Loading skeleton while fetching API facets */}
        {isStickeeService && !activeFacets && isLoading && (
          <div className="space-y-4 py-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-4/5" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-1/3 mt-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-4 bg-gray-100 rounded w-3/5" />
            </div>
          </div>
        )}

        {/* =========================================================
            BROADBAND DYNAMIC FILTERS (Directly from API facets)
        ========================================================= */}
        {isBroadband && broadbandFacets && (
          <>
            {/* Suppliers */}
            {broadbandFacets.suppliers?.length > 0 && (
              <SimFilterSection
                label="Broadband Providers"
                defaultOpen
              >
                {broadbandFacets.suppliers.map((s) => (
                  <SimCheckbox
                    key={s.id}
                    label={s.name}
                    checked={stickeeForm.suppliers.includes(s.id)}
                    onClick={() => toggleArrayFilter('suppliers', s.id)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Download Speed */}
            {dynamicSpeedTiers.length > 0 && (
              <SimFilterSection
                label="Download Speed"
                defaultOpen
              >
                {dynamicSpeedTiers.map((tier) => (
                  <SimRadio
                    key={tier.label}
                    label={tier.label}
                    checked={stickeeForm.speedMin === tier.value}
                    onClick={() => updateFilter('speedMin', tier.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Monthly Cost */}
            {dynamicBroadbandPriceTiers.length > 0 && (
              <SimFilterSection label="Monthly Cost">
                {dynamicBroadbandPriceTiers.map((tier) => (
                  <SimRadio
                    key={tier.label}
                    label={tier.label}
                    checked={stickeeForm.monthlyMax === tier.value}
                    onClick={() => updateFilter('monthlyMax', tier.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Contract Length */}
            {broadbandFacets.contract_lengths?.length > 0 && (
              <SimFilterSection label="Contract Length">
                {broadbandFacets.contract_lengths.map((months) => (
                  <SimCheckbox
                    key={months}
                    label={`${months} months`}
                    checked={stickeeForm.contractLengths.includes(months)}
                    onClick={() => toggleArrayFilter('contractLengths', months)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Connection Types */}
            {broadbandFacets.connection_types?.length > 0 && (
              <SimFilterSection label="Connection Type">
                {broadbandFacets.connection_types.map((conn) => (
                  <SimCheckbox
                    key={conn}
                    label={conn
                      .replace(/_/g, ' ')
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    checked={stickeeForm.connectionTypes.includes(conn)}
                    onClick={() => toggleArrayFilter('connectionTypes', conn)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Package Types */}
            {broadbandFacets.package_types?.length > 0 && (
              <SimFilterSection label="Package Type">
                {broadbandFacets.package_types.map((pkg) => (
                  <SimCheckbox
                    key={pkg}
                    label={pkg
                      .replace(/_/g, ' ')
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    checked={stickeeForm.packageTypes.includes(pkg)}
                    onClick={() => toggleArrayFilter('packageTypes', pkg)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Free Gifts / Rewards */}
            <SimFilterSection label="Free Gifts & Rewards">
              <SimCheckbox
                label="Deals with free gifts / vouchers only"
                checked={stickeeForm.freeGifts}
                onClick={() => updateFilter('freeGifts', !stickeeForm.freeGifts)}
              />
            </SimFilterSection>
          </>
        )}

        {/* =========================================================
            MOBILE HANDSET DYNAMIC FILTERS (10 Initial + View All)
        ========================================================= */}
        {isMobile && mobileFacets && (
          <>
            {/* 1. Brands */}
            {mobileFacets.brands?.length > 0 && (
              <SimFilterSection
                label="Brands"
                defaultOpen
              >
                {mobileFacets.brands.map((b) => (
                  <SimCheckbox
                    key={b.id}
                    label={b.name}
                    checked={stickeeForm.brands.includes(b.id)}
                    onClick={() => toggleArrayFilter('brands', b.id)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* 2. Models */}
            {mobileFacets.models?.length > 0 && (
              <SimFilterSection label="Models">
                {mobileFacets.models
                  .filter((m) =>
                    stickeeForm.brands.length === 0
                      ? true
                      : stickeeForm.brands.includes(m.brand?.id),
                  )
                  .slice(0, 15)
                  .map((m) => (
                    <SimCheckbox
                      key={m.id}
                      label={m.name}
                      checked={stickeeForm.models.includes(m.id)}
                      onClick={() => toggleArrayFilter('models', m.id)}
                    />
                  ))}
              </SimFilterSection>
            )}

            {/* 3. Networks */}
            {mobileFacets.networks?.length > 0 && (
              <SimFilterSection
                label="Networks"
                defaultOpen
              >
                {mobileFacets.networks.map((n) => (
                  <SimCheckbox
                    key={n.id}
                    label={n.name}
                    checked={stickeeForm.networks.includes(n.id)}
                    onClick={() => toggleArrayFilter('networks', n.id)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* 4. Upfront Cost */}
            {dynamicUpfrontTiers.length > 0 && (
              <SimFilterSection label="Upfront Cost">
                {dynamicUpfrontTiers.map((tier) => (
                  <SimRadio
                    key={tier.label}
                    label={tier.label}
                    checked={stickeeForm.upfrontMax === tier.value}
                    onClick={() => updateFilter('upfrontMax', tier.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* 5. Monthly Cost */}
            {dynamicMobileMonthlyTiers.length > 0 && (
              <SimFilterSection label="Monthly Cost">
                {dynamicMobileMonthlyTiers.map((tier) => (
                  <SimRadio
                    key={tier.label}
                    label={tier.label}
                    checked={stickeeForm.monthlyMax === tier.value}
                    onClick={() => updateFilter('monthlyMax', tier.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* 6. Data Allowance */}
            {dynamicDataTiers.length > 0 && (
              <SimFilterSection label="Data Allowance">
                {dynamicDataTiers.map((tier) => (
                  <SimRadio
                    key={tier.label}
                    label={tier.label}
                    checked={stickeeForm.dataMin === tier.value}
                    onClick={() => updateFilter('dataMin', tier.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* 7. Contract Length */}
            {mobileFacets.contract_lengths_new?.length > 0 && (
              <SimFilterSection label="Contract Length">
                {mobileFacets.contract_lengths_new.map((months) => (
                  <SimCheckbox
                    key={months}
                    label={`${months} months`}
                    checked={stickeeForm.contractLengths.includes(months)}
                    onClick={() => toggleArrayFilter('contractLengths', months)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* 8. Condition (from API facet refurbished) */}
            {mobileFacets.refurbished?.length > 0 && (
              <SimFilterSection label="Condition">
                {[
                  { label: 'All conditions', value: 'ALL' },
                  ...(mobileFacets.refurbished.includes('EXCLUDE_REFURB')
                    ? [{ label: 'Brand new only', value: 'EXCLUDE_REFURB' }]
                    : []),
                  ...(mobileFacets.refurbished.includes('ONLY_REFURB')
                    ? [{ label: 'Refurbished only', value: 'ONLY_REFURB' }]
                    : []),
                ].map((cond) => (
                  <SimRadio
                    key={cond.label}
                    label={cond.label}
                    checked={stickeeForm.refurbished === cond.value}
                    onClick={() => updateFilter('refurbished', cond.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* 9. Buy Through (Retailers) */}
            {mobileFacets.retailers?.length > 0 && (
              <SimFilterSection label="Buy Through">
                {mobileFacets.retailers.map((r) => (
                  <SimCheckbox
                    key={r.id}
                    label={r.name}
                    checked={stickeeForm.retailers.includes(r.id)}
                    onClick={() => toggleArrayFilter('retailers', r.id)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* 10. Resellers (from API facet resellers) */}
            {mobileFacets.resellers?.length > 0 && (
              <SimFilterSection label="Resellers">
                {[
                  { label: 'All deals', value: 'ALL' },
                  ...(mobileFacets.resellers.includes('EXCLUDE_RESELLERS')
                    ? [{ label: 'Direct from network only', value: 'EXCLUDE_RESELLERS' }]
                    : []),
                  ...(mobileFacets.resellers.includes('ONLY_RESELLERS')
                    ? [{ label: 'Resellers only', value: 'ONLY_RESELLERS' }]
                    : []),
                ].map((opt) => (
                  <SimRadio
                    key={opt.value}
                    label={opt.label}
                    checked={stickeeForm.resellers === opt.value}
                    onClick={() => updateFilter('resellers', opt.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Toggle Button for All Filters */}
            <button
              type="button"
              onClick={() => setShowAllMobileFilters((prev) => !prev)}
              className="my-3 flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-[#D0D5DD] bg-white py-2 font-red-hat-display text-[12px] font-semibold text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
            >
              {showAllMobileFilters ? (
                <>
                  Show fewer filters <ChevronUp className="h-4 w-4 text-[#475467]" />
                </>
              ) : (
                <>
                  View all filters <ChevronDown className="h-4 w-4 text-[#475467]" />
                </>
              )}
            </button>

            {/* Extended Mobile Filters (Shown when showAllMobileFilters is true) */}
            {showAllMobileFilters && (
              <>
                {/* 11. Exclude Price Increases (from API facet price_increases) */}
                {mobileFacets.price_increases?.includes(false) && (
                  <SimFilterSection label="Price Increases">
                    <SimCheckbox
                      label="Exclude price increases"
                      checked={stickeeForm.excludePriceIncreases}
                      onClick={() =>
                        updateFilter('excludePriceIncreases', !stickeeForm.excludePriceIncreases)
                      }
                    />
                  </SimFilterSection>
                )}

                {/* 12. Storage / Internal Memory */}
                {mobileFacets.internal_memories?.length > 0 && (
                  <SimFilterSection label="Internal Memory">
                    {mobileFacets.internal_memories.map((mem) => (
                      <SimCheckbox
                        key={mem}
                        label={`${mem}GB`}
                        checked={stickeeForm.memories.includes(mem)}
                        onClick={() => toggleArrayFilter('memories', mem)}
                      />
                    ))}
                  </SimFilterSection>
                )}

                {/* 13. Colours */}
                {mobileFacets.colours?.length > 0 && (
                  <SimFilterSection label="Colours">
                    {mobileFacets.colours.map((col) => (
                      <SimCheckbox
                        key={col.id}
                        label={col.name}
                        checked={stickeeForm.colours.includes(col.id)}
                        onClick={() => toggleArrayFilter('colours', col.id)}
                      />
                    ))}
                  </SimFilterSection>
                )}

                {/* 14. Gift Types */}
                {mobileFacets.gift_types?.length > 0 && (
                  <SimFilterSection label="Gift Types">
                    {mobileFacets.gift_types.map((gift) => (
                      <SimCheckbox
                        key={gift.id}
                        label={gift.name}
                        checked={stickeeForm.giftTypes.includes(gift.id)}
                        onClick={() => toggleArrayFilter('giftTypes', gift.id)}
                      />
                    ))}
                  </SimFilterSection>
                )}

                {/* 15. 5G / 4G Network Capability */}
                {mobileFacets.model_data_types?.length > 0 && (
                  <SimFilterSection label="Mobile Network Generation">
                    {[
                      { label: 'All speeds (4G & 5G)', value: 'ALL' },
                      ...(mobileFacets.model_data_types.includes('FIVE_G')
                        ? [{ label: '5G enabled only', value: 'FIVE_G' }]
                        : []),
                      ...(mobileFacets.model_data_types.includes('FOUR_G')
                        ? [{ label: '4G only', value: 'FOUR_G' }]
                        : []),
                    ].map((opt) => (
                      <SimRadio
                        key={opt.value}
                        label={opt.label}
                        checked={stickeeForm.fiveG === opt.value}
                        onClick={() => updateFilter('fiveG', opt.value)}
                      />
                    ))}
                  </SimFilterSection>
                )}
              </>
            )}
          </>
        )}

        {/* =========================================================
            SIM-ONLY DYNAMIC FILTERS (Directly from API facets)
        ========================================================= */}
        {isSimOnly && mobileFacets && (
          <>
            {/* Networks */}
            {mobileFacets.networks?.length > 0 && (
              <SimFilterSection
                label="Networks"
                defaultOpen
              >
                {mobileFacets.networks.map((n) => (
                  <SimCheckbox
                    key={n.id}
                    label={n.name}
                    checked={stickeeForm.networks.includes(n.id)}
                    onClick={() => toggleArrayFilter('networks', n.id)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Data Allowance */}
            {dynamicDataTiers.length > 0 && (
              <SimFilterSection
                label="Data Allowance"
                defaultOpen
              >
                {dynamicDataTiers.map((tier) => (
                  <SimRadio
                    key={tier.label}
                    label={tier.label}
                    checked={stickeeForm.dataMin === tier.value}
                    onClick={() => updateFilter('dataMin', tier.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Monthly Cost */}
            {dynamicMobileMonthlyTiers.length > 0 && (
              <SimFilterSection label="Monthly Cost">
                {dynamicMobileMonthlyTiers.map((tier) => (
                  <SimRadio
                    key={tier.label}
                    label={tier.label}
                    checked={stickeeForm.monthlyMax === tier.value}
                    onClick={() => updateFilter('monthlyMax', tier.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Contract Length */}
            {mobileFacets.contract_lengths_new?.length > 0 && (
              <SimFilterSection label="Contract Length">
                {mobileFacets.contract_lengths_new.map((months) => (
                  <SimCheckbox
                    key={months}
                    label={months === 1 ? '1 month (No contract)' : `${months} months`}
                    checked={stickeeForm.contractLengths.includes(months)}
                    onClick={() => toggleArrayFilter('contractLengths', months)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Exclude Price Increases */}
            {mobileFacets.price_increases?.includes(false) && (
              <SimFilterSection label="Price Increases">
                <SimCheckbox
                  label="Exclude price increases"
                  checked={stickeeForm.excludePriceIncreases}
                  onClick={() =>
                    updateFilter('excludePriceIncreases', !stickeeForm.excludePriceIncreases)
                  }
                />
              </SimFilterSection>
            )}

            {/* Unlimited Mins & Texts */}
            <SimFilterSection label="Minutes & Texts">
              <SimCheckbox
                label="Unlimited mins & texts only"
                checked={stickeeForm.unlimitedMinsTexts}
                onClick={() => updateFilter('unlimitedMinsTexts', !stickeeForm.unlimitedMinsTexts)}
              />
            </SimFilterSection>

            {/* Resellers */}
            {mobileFacets.resellers?.length > 0 && (
              <SimFilterSection label="Resellers">
                {[
                  { label: 'All deals', value: 'ALL' },
                  ...(mobileFacets.resellers.includes('EXCLUDE_RESELLERS')
                    ? [{ label: 'Direct from network only', value: 'EXCLUDE_RESELLERS' }]
                    : []),
                  ...(mobileFacets.resellers.includes('ONLY_RESELLERS')
                    ? [{ label: 'Resellers only', value: 'ONLY_RESELLERS' }]
                    : []),
                ].map((opt) => (
                  <SimRadio
                    key={opt.value}
                    label={opt.label}
                    checked={stickeeForm.resellers === opt.value}
                    onClick={() => updateFilter('resellers', opt.value)}
                  />
                ))}
              </SimFilterSection>
            )}

            {/* Buy Through (Retailers) */}
            {mobileFacets.retailers?.length > 0 && (
              <SimFilterSection label="Buy Through">
                {mobileFacets.retailers.map((r) => (
                  <SimCheckbox
                    key={r.id}
                    label={r.name}
                    checked={stickeeForm.retailers.includes(r.id)}
                    onClick={() => toggleArrayFilter('retailers', r.id)}
                  />
                ))}
              </SimFilterSection>
            )}
          </>
        )}

        {/* =========================================================
            ENERGY/INSURANCE STATIC FILTERS
        ========================================================= */}
        {!isStickeeService && (
          <>
            <button
              type="button"
              onClick={() => setIsYourPlansOpen((prev) => !prev)}
              aria-expanded={isYourPlansOpen}
              className="mt-3 flex h-[34px] w-full items-center justify-between rounded-[7px] bg-[#F9FAFB] px-2.5 text-left transition-colors hover:bg-[#F2F4F7] lg:h-[38px]"
            >
              <span className="font-red-hat-display text-[12px] font-semibold text-[#252B37] lg:text-[14px]">
                Your plans
              </span>
              {isYourPlansOpen ? (
                <Minus className="h-3.5 w-3.5 text-[#667085]" />
              ) : (
                <Plus className="h-3.5 w-3.5 text-[#667085]" />
              )}
            </button>

            {isYourPlansOpen && (
              <div className="space-y-3 px-1 pb-1 pt-3">
                <FilterCheckbox
                  id="only-billgoose"
                  label="Only BillGoose"
                  checked={onlyBillGoose}
                  onChange={setOnlyBillGoose}
                />
                <FilterCheckbox
                  id="include-supplier"
                  label="Include Supplier"
                  checked={includeSupplier}
                  onChange={setIncludeSupplier}
                />
              </div>
            )}

            {filters.fields.map((field) => (
              <FilterAccordion
                key={field.id}
                field={field}
                selectedValues={selectedValues}
                onChange={(value) => {
                  setSelectedValues((previous) => ({
                    ...previous,
                    [field.id]: value,
                  }));
                }}
              />
            ))}
          </>
        )}

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleApply}
            className="flex h-10 w-full items-center justify-center rounded-[8px] bg-[#00897B] font-red-hat-display text-[13px] font-extrabold text-white transition-opacity hover:opacity-95"
          >
            Apply filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex h-9 w-full items-center justify-center rounded-[8px] border border-[#D0D5DD] bg-white font-red-hat-display text-[12px] font-bold text-[#344054] transition-colors hover:bg-[#F9FAFB]"
          >
            Reset
          </button>
        </div>
      </div>

      {showBanner && (
        <div className="mt-4 hidden w-full overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white shadow-[0px_4px_14px_rgba(16,24,40,0.06)] lg:block lg:w-[326px]">
          <div className="relative h-[200px] w-full">
            <Image
              src={FILTER_BANNER_IMAGE}
              alt="BillGoose promotion"
              fill
              sizes="326px"
              className="object-cover"
            />
          </div>
        </div>
      )}
    </aside>
  );
}

/* =========================================================
   STICKEE ACCORDION SECTION
========================================================= */

function SimFilterSection({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#EAECF0] py-3">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-1 text-left font-red-hat-display text-[13px] font-bold text-[#101828]"
      >
        <span>{label}</span>
        {isOpen ? (
          <Minus className="h-3.5 w-3.5 text-[#667085]" />
        ) : (
          <Plus className="h-3.5 w-3.5 text-[#667085]" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2.5 max-h-[220px] space-y-2 overflow-y-auto pr-1">{children}</div>
      )}
    </div>
  );
}

/* =========================================================
   STICKEE CHECKBOX
========================================================= */

function SimCheckbox({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="checkbox"
      aria-checked={checked}
      className="flex w-full cursor-pointer items-center gap-2 text-left"
    >
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked ? 'border-[#00897B] bg-[#00897B]' : 'border-[#D0D5DD] bg-white'
        }`}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </div>
      <span className="font-red-hat-display text-[13px] text-[#344054]">{label}</span>
    </button>
  );
}

/* =========================================================
   STICKEE RADIO
========================================================= */

function SimRadio({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="radio"
      aria-checked={checked}
      className="flex w-full cursor-pointer items-center gap-2 text-left"
    >
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
          checked ? 'border-[#00897B]' : 'border-[#D0D5DD]'
        }`}
      >
        {checked && <div className="h-2 w-2 rounded-full bg-[#00897B]" />}
      </div>
      <span className="font-red-hat-display text-[13px] text-[#344054]">{label}</span>
    </button>
  );
}

/* =========================================================
   ENERGY / INSURANCE STATIC FILTER HELPERS
========================================================= */

type FilterAccordionProps = {
  field: FilterField;
  selectedValues: FilterValues;
  onChange: (value: string) => void;
};

function FilterAccordion({ field, selectedValues, onChange }: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#EAECF0] py-3">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-red-hat-display text-[13px] font-bold text-[#101828]">
          {field.label}
        </span>
        {isOpen ? (
          <Minus className="h-3.5 w-3.5 text-[#667085]" />
        ) : (
          <Plus className="h-3.5 w-3.5 text-[#667085]" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2.5 space-y-2">
          {field.options.map((option) => {
            const isSelected = selectedValues[field.id] === option.value;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange(option.value)}
                className="flex w-full cursor-pointer items-center gap-2 text-left"
              >
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected ? 'border-[#00897B]' : 'border-[#D0D5DD]'
                  }`}
                >
                  {isSelected && <div className="h-2 w-2 rounded-full bg-[#00897B]" />}
                </div>
                <span className="font-red-hat-display text-[13px] text-[#344054]">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

type FilterCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function FilterCheckbox({ id, label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-[#D0D5DD] text-[#00897B] focus:ring-0"
      />
      <span className="font-red-hat-display text-[13px] text-[#344054]">{label}</span>
    </label>
  );
}
