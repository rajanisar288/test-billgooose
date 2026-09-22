'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  ArrowDownUp,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LoaderCircle,
  Plus,
  X,
} from 'lucide-react';

import Loading from '@/app/loading';
import BackendErrorAlert from '@/components/common/BackendErrorAlert';
import { groupPlansIntoBundleSuppliers } from '@/components/result/bundle-mock-data';
import BundlePlanCard, { type BundleSupplierData } from '@/components/result/bundle-plan-card';
import FeaturedBroadbandCard from '@/components/result/featured-broadband-card';
import PlanCard from '@/components/result/plan-card';
import PlanDetailsDrawer from '@/components/result/plan-details-drawer';
import type {
  FeaturedBroadbandPlan,
  ResultPlan,
  SimOnlyPlan,
  StandardPlan,
} from '@/components/result/plan.types';
import { useResultFilters } from '@/components/result/result-filter-context';
import ResultFilterSidebar from '@/components/result/result-filter-sidebar';
import type { ResultFilterState } from '@/components/result/result-filter.types';
import { readStoredSelectedPlans } from '@/components/result/selected-plans';
import data from '@/data/content.json';
import { journeyApi } from '@/lib/api/endpoints/journey.api';
import { isBroadbandDeal, isMobileDeal } from '@/lib/stickee/types';
import { useStickeeDeals } from '@/lib/stickee/useStickeeDeals';
import { BROADBAND_SORTS, MOBILE_SORTS, VERTICALS } from '@/lib/stickee/verticals';
import { useJourneyStore } from '@/store/journeyStore';
import { getCurrentRelativeUrl } from '@/utils/helper';

function extractPromos(promos: unknown): string[] {
  if (!promos) return [];
  if (Array.isArray(promos)) {
    return promos
      .map((p) => {
        if (typeof p === 'string') return p;
        if (typeof p === 'object' && p !== null) {
          const obj = p as Record<string, unknown>;
          return (obj.title || obj.text || obj.name || obj.description || '') as string;
        }
        return String(p);
      })
      .filter(Boolean);
  }
  if (typeof promos === 'string') {
    try {
      const parsed = JSON.parse(promos);
      return extractPromos(parsed);
    } catch {
      return [promos];
    }
  }
  if (typeof promos === 'object' && promos !== null) {
    return Object.values(promos as Record<string, unknown>)
      .map((v) => (typeof v === 'string' ? v : JSON.stringify(v)))
      .filter(Boolean);
  }
  return [];
}

type CompareService = 'energy' | 'bundle-bills' | 'broadband' | 'sim-only' | 'insurance';

type RedirectOrigin = 'sim-only' | 'mobile-details';

type ResultPlansProps = {
  heading?: string;
  description?: string;
  serviceOverride?: CompareService;
  redirectOrigin?: RedirectOrigin;
  quotePlans?: ResultPlan[];
  quoteLoading?: boolean;
  quoteError?: string;
  resultCount?: number;
};

type CompareFlowDetails = {
  service?: string;
  flow?: string;

  postcode?: string;
  address?: string;

  serviceType?: string;
  paymentMethod?: string;

  currentProvider?: string;
  stillInContract?: string;
};

type InsurancePlan = StandardPlan & {
  totalCost: string;
  monthlyPayment: string;
  deposit: string;
  savingDescription: string;
};

/* =========================================================
   TYPE HELPERS
========================================================= */

function isFeaturedBroadbandPlan(plan: ResultPlan): plan is FeaturedBroadbandPlan {
  return plan.type === 'featured-broadband';
}

function isStandardPlan(plan: ResultPlan): plan is StandardPlan {
  return plan.type === 'select-plan' || plan.type === 'view-deal';
}

function filterStandardPlans<T extends StandardPlan>(plans: T[], filters: ResultFilterState): T[] {
  return plans.filter((plan) => {
    const searchableText = [
      plan.provider,
      plan.description,
      plan.contract,
      ...plan.features,
      plan.price,
      plan.saving,
      (plan as StandardPlan & { paymentMethod?: string }).paymentMethod,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (filters.onlyBillGoose && !searchableText.includes('billgoose')) {
      return false;
    }

    return Object.entries(filters.values).every(([field, value]) => {
      if (!value || value === 'all') {
        return true;
      }

      const normalizedValue = value.replace(/-/g, ' ').toLowerCase();

      if (field === 'plan-type' && value === 'dual-fuel') {
        return (
          searchableText.includes('dual') ||
          searchableText.includes('gas') ||
          searchableText.includes('electric')
        );
      }

      if (field === 'contract-length') {
        return (
          searchableText.includes(normalizedValue) ||
          searchableText.includes(value.replace('-months', ' months'))
        );
      }

      return searchableText.includes(normalizedValue);
    });
  });
}

function filterSimOnlyPlans(plans: SimOnlyPlan[], filters: ResultFilterState): SimOnlyPlan[] {
  return plans.filter((plan) => {
    const searchableText = [
      plan.provider,
      plan.networkDescription,
      plan.data,
      plan.roamingText,
      ...plan.badges,
    ]
      .join(' ')
      .toLowerCase();
    const price = Number(plan.price.replace(/[^\d.-]/g, ''));

    if (
      filters.networks.length &&
      !filters.networks.some((network) => searchableText.includes(network.toLowerCase()))
    ) {
      return false;
    }

    return Object.entries(filters.simValues).every(([field, values]) =>
      values.some((value) => {
        if (field === 'monthly-cost') {
          if (value === '40-plus') return price >= 40;
          const [minimum, maximum] = value.split('-').map(Number);
          return price >= minimum && price <= maximum;
        }

        if (field === 'data' && value === 'unlimited') {
          return searchableText.includes('unlimited');
        }

        return searchableText.includes(value.replace(/-/g, ' ').toLowerCase());
      }),
    );
  });
}

/* =========================================================
   GET STORED COMPARE SERVICE
========================================================= */

function getStoredCompareService(): 'energy' | 'broadband' | 'insurance' | null {
  try {
    const storedDetails = sessionStorage.getItem('compareFlowDetails');

    if (!storedDetails) {
      return null;
    }

    const details = JSON.parse(storedDetails) as CompareFlowDetails;

    if (
      details.service === 'energy' ||
      details.service === 'broadband' ||
      details.service === 'insurance'
    ) {
      return details.service;
    }

    return null;
  } catch {
    return null;
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ResultPlans({
  heading,
  description,
  serviceOverride,
  redirectOrigin = 'sim-only',
  quotePlans,
  quoteLoading = false,
  quoteError = '',
  resultCount,
}: ResultPlansProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { journey, setJourney } = useJourneyStore();
  const {
    filters: appliedFilters,
    sortKey,
    setSortKey,
    setIsDealsLoading,
    setDealsCount,
  } = useResultFilters();
  const [actionError, setActionError] = useState<string>('');
  const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null);
  const [isContinuingBundle, setIsContinuingBundle] = useState(false);

  const { plans, resultsStatus } = data.resultPage;

  /* =========================================================
     CURRENT RESULT SERVICE
  ========================================================= */

  const queryService = searchParams.get('service');
  const queryFlow = searchParams.get('flow');

  const service: CompareService =
    serviceOverride ??
    (queryService === 'broadband'
      ? 'broadband'
      : queryService === 'sim-only'
        ? 'sim-only'
        : queryService === 'insurance'
          ? 'insurance'
          : queryService === 'bundle-bills' || queryFlow === 'bundle'
            ? 'bundle-bills'
            : 'energy');

  const isBundleService = service === 'bundle-bills';
  const [selectedBundlePlans, setSelectedBundlePlans] = useState<Record<string, StandardPlan>>({});

  const isSimOnly = service === 'sim-only';
  const isInsurance = service === 'insurance';

  const bundleSuppliers: BundleSupplierData[] = useMemo(() => {
    if (!isBundleService) return [];

    if (quotePlans && quotePlans.length > 0) {
      const standardPlans = quotePlans.filter(isStandardPlan);
      const liveSuppliers = groupPlansIntoBundleSuppliers(standardPlans);
      if (liveSuppliers.length > 0) {
        return liveSuppliers;
      }
    }

    return [];
  }, [isBundleService, quotePlans]);

  /* =========================================================
     PLAN DATA
  ========================================================= */

  const energyPlanItems = (quotePlans ?? plans.items) as ResultPlan[];

  useEffect(() => {
    if (!isBundleService || quoteLoading || !quotePlans) return;

    const currentPlans = quotePlans.filter(isStandardPlan);
    const currentQuoteId = currentPlans[0]?.quoteId;
    const currentPlanIds = new Set(currentPlans.map((plan) => plan.id));
    const validStoredPlans = readStoredSelectedPlans().filter(
      (plan) => plan.quoteId === currentQuoteId && currentPlanIds.has(plan.id),
    );
    const nextSelections = validStoredPlans.reduce<Record<string, StandardPlan>>(
      (selections, plan) => {
        selections[plan.groupType ?? plan.productType ?? plan.id] = plan;
        return selections;
      },
      {},
    );

    // Reconcile persisted selections only after the current quote has loaded.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedBundlePlans(nextSelections);
    sessionStorage.setItem('journeySelectedPlans', JSON.stringify(validStoredPlans));
    if (validStoredPlans.length === 0) sessionStorage.removeItem('journeySelectedPlan');
  }, [isBundleService, quoteLoading, quotePlans]);

  const broadbandPlanItemsStatic = (plans.broadbandItems ?? []) as StandardPlan[];

  const simOnlyPlanItemsStatic = (plans.simOnlyItems ?? []) as SimOnlyPlan[];

  const activeSortConfig = useMemo(() => {
    if (service === 'broadband') {
      const found = BROADBAND_SORTS[sortKey as keyof typeof BROADBAND_SORTS];
      return found
        ? { sort: found.sort, reverse: found.reverse }
        : { sort: 'RECOMMENDED', reverse: false };
    }
    const found = MOBILE_SORTS[sortKey as keyof typeof MOBILE_SORTS];
    return found
      ? { sort: found.sort, reverse: found.reverse }
      : { sort: 'RECOMMENDED', reverse: false };
  }, [service, sortKey]);

  const {
    deals: simDeals,
    facets: simFacets,
    loading: simLoading,
    isFetchingMore: simIsFetchingMore,
    hasMorePages: simHasMore,
    loadMore: simLoadMore,
    error: simError,
  } = useStickeeDeals({
    vertical: 'mobile',
    fixed: VERTICALS.mobile_simo.fixed as Record<string, unknown>,
    filters: appliedFilters.stickeeFilters,
    sort: activeSortConfig.sort,
    reverse: activeSortConfig.reverse,
    enabled: isSimOnly,
  });

  const stickeeSimPlans: SimOnlyPlan[] = useMemo(() => {
    if (!simDeals?.length) return [];
    return simDeals
      .map((rawDeal): SimOnlyPlan | null => {
        if (!isMobileDeal(rawDeal)) return null;
        const deal = rawDeal;
        const dataValue =
          deal.tariff.data === -1 || deal.tariff.data >= 999999
            ? 'Unlimited'
            : `${(deal.tariff.data / 1000).toFixed(0)}GB`;

        const badges: string[] = [];
        if (deal.is_exclusive) badges.push('Exclusive');
        else if (deal.cashback > 0) badges.push(`£${deal.cashback.toFixed(0)} Cashback`);

        const contract =
          deal.tariff.contract_length > 1
            ? `${deal.tariff.contract_length} Months contract`
            : '1 Month contract';
        const totalCost =
          deal.total_cost != null && deal.total_cost > 0
            ? `£${deal.total_cost.toFixed(2)}`
            : `£${(deal.price * (deal.tariff.contract_length || 1)).toFixed(2)}`;
        const promos = extractPromos(deal.promos);

        return {
          id: deal.id,
          type: 'sim-only' as const,
          service: 'sim-only' as const,
          provider: deal.tariff.network.name,
          networkDescription: `${deal.tariff.network.name} Network`,
          logo: deal.tariff.network.image,
          logoAlt: deal.tariff.network.name,
          badges,
          data: dataValue,
          priceLabel: 'Monthly cost',
          price: `£${deal.price.toFixed(2)}/month`,
          upfrontLabel: 'Upfront cost',
          upfrontCost: deal.is_sim_only ? '£0' : `£${(deal.discount_line_rental ?? 0).toFixed(2)}`,
          contract,
          contractLength: deal.tariff.contract_length,
          totalCost,
          promos,
          roamingText: 'EU Roaming included',
          providerUrl: deal.url,
          primaryButton: 'View Deal',
          secondaryButton: 'More Info',
        } satisfies SimOnlyPlan;
      })
      .filter((plan): plan is SimOnlyPlan => plan !== null);
  }, [simDeals]);

  const {
    deals: bbDeals,
    facets: bbFacets,
    loading: bbLoading,
    isFetchingMore: bbIsFetchingMore,
    hasMorePages: bbHasMore,
    loadMore: bbLoadMore,
    error: bbError,
  } = useStickeeDeals({
    vertical: 'broadband',
    fixed: VERTICALS.broadband.fixed as Record<string, unknown>,
    filters: appliedFilters.stickeeFilters,
    sort: activeSortConfig.sort,
    reverse: activeSortConfig.reverse,
    enabled: service === 'broadband',
  });

  const stickeeBroadbandPlans: StandardPlan[] = useMemo(() => {
    if (!bbDeals?.length) return [];
    const filterGifts = Boolean(appliedFilters.stickeeFilters?.gift);
    return bbDeals
      .map((rawDeal): StandardPlan | null => {
        if (!isBroadbandDeal(rawDeal)) return null;
        if (filterGifts && !rawDeal.gift) return null;
        const deal = rawDeal;
        const speed = deal.download_speed ? `${deal.download_speed} Mbps` : '';
        const contract = `${deal.min_contract_length || 24} months`;
        const setupCost =
          (deal.delivery_price || 0) + (deal.connection_price || 0) + (deal.equipment_price || 0);
        const setupStr = setupCost > 0 ? `£${setupCost.toFixed(2)} setup` : 'Free setup';
        const connLabel = deal.connection_type
          ? deal.connection_type
              .replace(/_/g, ' ')
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase())
          : '';

        const features = [
          contract,
          speed ? `${speed} avg. download` : '',
          deal.upload_speed ? `${deal.upload_speed} Mbps upload` : '',
          connLabel,
          deal.bullet_1 || '',
          deal.bullet_2 || '',
          setupStr,
        ].filter(Boolean);

        const supplierName = deal.supplier?.name || 'Broadband Provider';
        const supplierLogo = deal.supplier?.image || deal.supplier_image || '';

        return {
          id: deal.id,
          type: 'view-deal' as const,
          service: 'broadband' as const,
          provider: supplierName,
          supplierName: supplierName,
          planName: deal.name || `${supplierName} Broadband`,
          description: deal.name || `${speed} avg download · ${contract} contract`,
          logo: supplierLogo,
          logoAlt: supplierName,
          rating: '',
          contract,
          averageSpeed: speed,
          upfrontCost: setupStr,
          features,
          priceLabel: 'Monthly cost',
          price: `£${deal.monthly_price.toFixed(2)}`,
          pricePeriod: '/month',
          saving: deal.gift || '',
          claimText:
            deal.gift ||
            (deal.discount_price
              ? `Save £${(deal.monthly_price - deal.discount_price).toFixed(2)}/mo`
              : '') ||
            'No setup fee',
          providerUrl: deal.url,
          broadband: deal,
          viewDetailsButton: 'View Details',
          primaryButton: 'View Deal',
        } satisfies StandardPlan;
      })
      .filter((plan): plan is StandardPlan => plan !== null);
  }, [bbDeals]);

  const broadbandPlanItems: StandardPlan[] =
    service === 'broadband' ? stickeeBroadbandPlans : broadbandPlanItemsStatic;

  const simOnlyPlanItems: SimOnlyPlan[] = isSimOnly ? stickeeSimPlans : simOnlyPlanItemsStatic;

  const stickeeFacets = isSimOnly ? simFacets : service === 'broadband' ? bbFacets : null;

  const insurancePlanItems = (plans.insuranceItems ?? []) as InsurancePlan[];

  const filteredEnergyPlanItems = energyPlanItems.filter(
    (plan) =>
      isFeaturedBroadbandPlan(plan) || filterStandardPlans([plan], appliedFilters).length > 0,
  );
  const filteredBroadbandPlanItems = filterStandardPlans(broadbandPlanItems, appliedFilters);
  const filteredSimOnlyPlanItems = filterSimOnlyPlans(simOnlyPlanItems, appliedFilters);
  const filteredInsurancePlanItems = filterStandardPlans(insurancePlanItems, appliedFilters);

  const stickeeLoading = (isSimOnly && simLoading) || (service === 'broadband' && bbLoading);
  const stickeeError = (isSimOnly && simError) || (service === 'broadband' && bbError);

  useEffect(() => {
    const isLoading = isSimOnly ? simLoading : service === 'broadband' ? bbLoading : quoteLoading;
    setIsDealsLoading(isLoading);
    if (!isLoading) {
      const count = isSimOnly
        ? simOnlyPlanItems.length
        : service === 'broadband'
          ? broadbandPlanItems.length
          : (resultCount ?? quotePlans?.length ?? null);
      setDealsCount(count);
    }
  }, [
    isSimOnly,
    service,
    simLoading,
    bbLoading,
    quoteLoading,
    simOnlyPlanItems.length,
    broadbandPlanItems.length,
    resultCount,
    quotePlans?.length,
    setIsDealsLoading,
    setDealsCount,
  ]);

  const [selectedPlanTab, setSelectedPlanTab] = useState(
    isInsurance ? 'monthly' : resultsStatus.planTabs.defaultValue,
  );

  /* =========================================================
     DETAILS DRAWER
  ========================================================= */

  const [selectedPlan, setSelectedPlan] = useState<StandardPlan | null>(null);

  const [selectedSimOnlyPlan, setSelectedSimOnlyPlan] = useState<SimOnlyPlan | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (plan: StandardPlan) => {
    setSelectedSimOnlyPlan(null);
    setSelectedPlan(plan);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedSimOnlyPlan(null);
  };

  /* =========================================================
     ENERGY / BROADBAND SELECT PLAN
  ========================================================= */

  const handleSelectPlan = async (plan: StandardPlan) => {
    const queryFlow = searchParams.get('flow');

    const storedFlow = sessionStorage.getItem('billgooseJourneyFlow');

    const isBundleFlow = queryFlow === 'bundle' || storedFlow === 'bundle';

    const isJourneyPlan = service === 'energy' || service === 'bundle-bills';

    const groupKey = plan.groupType ?? plan.productType ?? plan.id;
    const nextBundleSelections = { ...selectedBundlePlans };

    if (isBundleFlow || isBundleService) {
      if (nextBundleSelections[groupKey]?.id === plan.id) {
        delete nextBundleSelections[groupKey];
      } else {
        nextBundleSelections[groupKey] = plan;
      }
    }

    const bundlePlans = Object.values(nextBundleSelections);

    if (isBundleFlow || isBundleService) {
      setSelectedBundlePlans(nextBundleSelections);
      sessionStorage.setItem('journeySelectedPlans', JSON.stringify(bundlePlans));

      if (bundlePlans.length === 0) {
        sessionStorage.removeItem('journeySelectedPlan');
      } else {
        const primaryPlan = bundlePlans[0];
        sessionStorage.setItem(
          'journeySelectedPlan',
          JSON.stringify({
            ...primaryPlan,
            service: 'bundle-bills',
            productReferences: bundlePlans.flatMap(
              (item) =>
                item.productReferences ?? (item.productReference ? [item.productReference] : []),
            ),
          }),
        );
      }
      return;
    }

    if (isJourneyPlan) {
      if (selectingPlanId) {
        return;
      }

      const journeyId = journey?.id || journey?.journeyId || journey?.uuid;

      setActionError('');

      if (!journeyId) {
        setActionError('Journey ID is required. Please try again.');
        return;
      }

      setSelectingPlanId(plan.id);

      try {
        const response = await journeyApi.createJourney({
          // ...journey,
          journeyId,
          uuid: journeyId,
          lastUrl: getCurrentRelativeUrl(),
          cart: [{ ...plan }],
        });

        if (!response?.data) {
          throw new Error('We could not save your selected plan. Please try again.');
        }

        setJourney(response.data);
      } catch (error: any) {
        setActionError(error?.message || 'We could not save your selected plan. Please try again.');
        setSelectingPlanId(null);
        return;
      }
    }

    /* =====================================================
       INSURANCE
    ====================================================== */

    if (service === 'insurance') {
      if (!plan.providerUrl) {
        return;
      }

      sessionStorage.removeItem('journeySelectedPlans');
      sessionStorage.setItem(
        'journeySelectedPlan',
        JSON.stringify({
          ...plan,
          service: 'insurance',
        }),
      );

      sessionStorage.setItem('billgooseJourneyService', 'insurance');
      sessionStorage.setItem('billgooseJourneyFlow', 'insurance');

      sessionStorage.setItem('insuranceRedirectUrl', plan.providerUrl);
      sessionStorage.setItem('insuranceRedirectProvider', plan.provider);

      router.push('/redirecting?service=insurance');

      return;
    }

    /* =====================================================
       BUNDLE
    ====================================================== */

    /* =====================================================
       BROADBAND

       UNCHANGED
    ====================================================== */

    if (service === 'broadband') {
      if (!plan.providerUrl) {
        return;
      }

      sessionStorage.removeItem('journeySelectedPlans');
      sessionStorage.setItem(
        'journeySelectedPlan',
        JSON.stringify({
          ...plan,
          service: 'broadband',
        }),
      );

      sessionStorage.setItem('billgooseJourneyService', 'broadband');

      sessionStorage.setItem('billgooseJourneyFlow', 'broadband');

      sessionStorage.setItem('broadbandRedirectUrl', plan.providerUrl);

      sessionStorage.setItem('broadbandRedirectProvider', plan.provider);

      router.push('/redirecting?service=broadband');

      return;
    }

    /* =====================================================
       NORMAL ENERGY
    ====================================================== */

    const storedService = getStoredCompareService();

    const resolvedService = storedService ?? 'energy';

    sessionStorage.removeItem('journeySelectedPlans');
    sessionStorage.setItem(
      'journeySelectedPlan',
      JSON.stringify({
        ...plan,
        service: resolvedService,
      }),
    );

    sessionStorage.setItem('billgooseJourneyService', resolvedService);

    sessionStorage.setItem('billgooseJourneyFlow', 'energy');

    router.push('/steps/personal-details-form?service=energy');
  };

  const handleSelectBundle = async (
    supplier: BundleSupplierData,
    selectedPlans: StandardPlan[],
  ) => {
    if (selectedPlans.length === 0 || isContinuingBundle) return;

    setActionError('');
    setIsContinuingBundle(true);

    const journeyId = journey?.id || journey?.journeyId || journey?.uuid;

    if (journeyId) {
      try {
        const response = await journeyApi.createJourney({
          journeyId,
          uuid: journeyId,
          lastUrl: getCurrentRelativeUrl(),
          cart: selectedPlans,
        });

        if (response?.data) {
          setJourney(response.data);
        }
      } catch (error: any) {
        setActionError(
          error?.message || 'We could not save your selected bundle. Please try again.',
        );
        setIsContinuingBundle(false);
        return;
      }
    }

    sessionStorage.setItem('journeySelectedPlans', JSON.stringify(selectedPlans));
    const primaryPlan = selectedPlans[0];
    sessionStorage.setItem(
      'journeySelectedPlan',
      JSON.stringify({
        ...primaryPlan,
        service: 'bundle-bills',
        supplierName: supplier.supplierName,
        supplierCode: supplier.supplierCode,
        productReferences: selectedPlans.flatMap(
          (item) =>
            item.productReferences ?? (item.productReference ? [item.productReference] : []),
        ),
      }),
    );

    sessionStorage.setItem('billgooseJourneyService', 'energy');
    sessionStorage.setItem('billgooseJourneyFlow', 'bundle');

    router.push('/review-your-details?service=energy&flow=bundle');
  };

  /* =========================================================
     SIM ONLY VIEW DEAL
  ========================================================= */

  const handleSimOnlyViewDeal = (plan: SimOnlyPlan) => {
    if (!plan.providerUrl) {
      return;
    }

    setIsDetailsOpen(false);

    sessionStorage.setItem('journeySelectedPlan', JSON.stringify(plan));

    sessionStorage.setItem('externalRedirectUrl', plan.providerUrl);

    sessionStorage.setItem('externalRedirectProvider', plan.provider);

    sessionStorage.setItem('externalRedirectService', 'sim-only');

    /*
     * NEW:
     *
     * Normal SIM page:
     *   sim-only
     *
     * Mobile details page:
     *   mobile-details
     */
    sessionStorage.setItem('externalRedirectOrigin', redirectOrigin);

    sessionStorage.setItem('billgooseJourneyService', 'sim-only');

    sessionStorage.setItem('billgooseJourneyFlow', 'sim-only');

    router.push('/redirecting?service=sim-only');
  };

  /* =========================================================
     SIM ONLY MORE INFO
  ========================================================= */

  const handleSimOnlyMoreInfo = (plan: SimOnlyPlan) => {
    const normalizedPrice = plan.price.includes('/') ? plan.price.split('/')[0] : plan.price;

    const drawerPlan: StandardPlan = {
      id: plan.id,

      type: 'view-deal',

      service: 'sim-only',

      provider: plan.provider,

      description: plan.networkDescription,

      logo: plan.logo,
      logoAlt: plan.logoAlt,

      rating: '',

      contract: plan.badges[0] ?? 'SIM Only',

      features: [
        ...plan.badges,
        plan.roamingText,
        `Data: ${plan.data}`,
        `${plan.upfrontLabel}: ${plan.upfrontCost}`,
      ],

      priceLabel: plan.priceLabel,

      price: normalizedPrice,

      pricePeriod: '/month',

      saving: '',

      providerUrl: plan.providerUrl,

      viewDetailsButton: plan.secondaryButton,

      primaryButton: plan.primaryButton,
    };

    setSelectedSimOnlyPlan(plan);

    setSelectedPlan(drawerPlan);

    setIsDetailsOpen(true);
  };

  /* =========================================================
     DRAWER MAIN ACTION
  ========================================================= */

  const handleDrawerPrimaryAction = (plan: StandardPlan) => {
    if (selectedSimOnlyPlan && plan.service === 'sim-only') {
      handleSimOnlyViewDeal(selectedSimOnlyPlan);

      return;
    }

    handleSelectPlan(plan);
  };

  /* =========================================================
     NORMAL CARDS
  ========================================================= */

  const renderNormalCards = () => {
    if (isBundleService) {
      return bundleSuppliers.map((supplier) => (
        <BundlePlanCard
          key={supplier.supplierCode}
          supplier={supplier}
          onViewDetails={handleViewDetails}
          onSelectBundle={handleSelectBundle}
          isSelecting={isContinuingBundle}
        />
      ));
    }

    if (service === 'insurance') {
      return filteredInsurancePlanItems.map((plan) => (
        <InsurancePlanCard
          key={plan.id}
          plan={plan}
          onViewDetails={handleViewDetails}
          onSelectPlan={handleSelectPlan}
        />
      ));
    }

    if (service === 'broadband') {
      return filteredBroadbandPlanItems.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onViewDetails={handleViewDetails}
          onSelectPlan={handleSelectPlan}
          isSelecting={selectingPlanId === plan.id}
          service="broadband"
        />
      ));
    }

    return filteredEnergyPlanItems.map((plan) => {
      if (isFeaturedBroadbandPlan(plan)) {
        return (
          <FeaturedBroadbandCard
            key={plan.id}
            plan={plan}
            onViewDetails={handleViewDetails}
          />
        );
      }

      if (isStandardPlan(plan)) {
        return (
          <PlanCard
            key={plan.id}
            plan={plan}
            onViewDetails={handleViewDetails}
            onSelectPlan={handleSelectPlan}
            isSelecting={selectingPlanId === plan.id}
            isSelected={false}
            showSaving={!quotePlans}
            service="energy"
          />
        );
      }

      return null;
    });
  };

  /* =========================================================
     CARD LIST
  ========================================================= */

  const renderCards = () => {
    if (isSimOnly) {
      if (stickeeLoading) {
        return (
          <div className="my-4 w-full overflow-hidden rounded-[16px] border border-[#EAECF0]">
            <Loading />
          </div>
        );
      }

      if (stickeeError) {
        return (
          <div className="flex bg-white justify-center items-center h-[200px] w-full">
            <p className="rounded-[16px] bg-white p-6 text-[#D92D20]">
              {typeof stickeeError === 'string'
                ? stickeeError
                : 'Unable to load deals at this time. Please try again.'}
            </p>
          </div>
        );
      }

      if (filteredSimOnlyPlanItems.length === 0) {
        return (
          <div className="flex bg-white justify-center items-center h-[200px] w-full">
            <p className="rounded-[16px] bg-white p-6 text-[#667085]">
              No plans match your filters.
            </p>
            <p className="rounded-[16px] bg-white p-6 text-[#667085]">
              No plans match your filters.
            </p>
          </div>
        );
      }

      return filteredSimOnlyPlanItems.map((plan) => (
        <SimOnlyCard
          key={plan.id}
          plan={plan}
          onViewDeal={() => {
            handleSimOnlyViewDeal(plan);
          }}
          onMoreInfo={() => {
            handleSimOnlyMoreInfo(plan);
          }}
        />
      ));
    }

    if (service === 'broadband' && stickeeLoading) {
      return (
        <div className="my-4 w-full overflow-hidden rounded-[16px] border border-[#EAECF0]">
          <Loading />
        </div>
      );
    }

    if (service === 'broadband' && stickeeError) {
      return (
        <div className="flex bg-white justify-center items-center h-[200px] w-full">
          <p className="rounded-[16px] bg-white p-6 text-[#D92D20]">
            {typeof stickeeError === 'string'
              ? stickeeError
              : 'Unable to load broadband deals at this time. Please try again.'}
          </p>
        </div>
      );
    }

    if (quoteLoading) {
      return (
        <div className="my-4 w-full overflow-hidden rounded-[16px] border border-[#EAECF0]">
          <Loading />
        </div>
      );
    }

    if (quoteError) {
      return (
        <div className="flex bg-white justify-center items-center h-[200px] w-full">
          <p className="rounded-[16px] bg-white p-6 text-[#D92D20]">{quoteError}</p>
        </div>
      );
    }

    const cards = renderNormalCards();

    return cards.length > 0 ? (
      cards
    ) : (
      <div className="flex bg-white justify-center items-center h-[200px] w-full">
        <p className="rounded-[16px] bg-white p-6 text-[#667085]">No plans match your filters.</p>
      </div>
    );
  };

  const renderLoadMoreButton = () => {
    const hasMore = (service === 'broadband' && bbHasMore) || (isSimOnly && simHasMore);
    const isFetching = isSimOnly ? simIsFetchingMore : bbIsFetchingMore;

    if (!hasMore) return null;

    return (
      <div className="mt-8 flex w-full justify-center">
        <button
          type="button"
          disabled={isFetching}
          onClick={() => {
            if (isSimOnly) simLoadMore();
            else bbLoadMore();
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#D0D5DD] bg-white px-6 font-inter text-[14px] font-semibold text-[#344054] shadow-sm hover:bg-[#F9FAFB] disabled:opacity-60 transition-colors"
        >
          {isFetching ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin text-[#00897B]" />
              Loading deals...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 text-[#344054]" />
              Load More Deals
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      <section
        className="
          mx-auto
          w-full
          max-w-[1440px]

          overflow-visible

          px-4
          pb-12

          min-[390px]:px-5

          sm:px-6

          md:px-8

          lg:px-8
          lg:pb-16

          xl:px-10

          2xl:px-0
        "
      >
        {actionError && (
          <BackendErrorAlert
            error={actionError}
            className="mb-5"
          />
        )}

        {/* =====================================================
            MOBILE + TABLET
        ====================================================== */}

        <div className="lg:hidden">
          <div
            className="
              space-y-4
              sm:space-y-5
            "
          >
            {renderCards()}
            {renderLoadMoreButton()}
          </div>
        </div>

        {/* =====================================================
            DESKTOP
        ====================================================== */}

        <div
          className="
            hidden

            lg:grid
            lg:grid-cols-[326px_minmax(0,1fr)]
            lg:items-start
            lg:gap-5

            xl:gap-6
          "
        >
          <ResultFilterSidebar
            facets={stickeeFacets}
            isBroadband={service === 'broadband'}
            isSimOnly={isSimOnly}
            isLoading={stickeeLoading}
          />

          <div className="min-w-0 w-full">
            {/* ===============================================
                RESULTS SUMMARY
            ================================================ */}

            <div
              className="
                flex
                items-end
                justify-between
                gap-5
                pb-3
              "
            >
              <div className="min-w-0">
                <h2
                  className="
                    font-red-hat-display

                    text-[18px]
                    font-extrabold
                    leading-5

                    text-[#101828]

                    xl:text-[18px]
                  "
                >
                  {heading ?? resultsStatus.heading}
                </h2>

                {quoteLoading || stickeeLoading ? (
                  <p className="mt-1 font-inter text-[15px] font-normal leading-5 text-[#667085]">
                    <strong className="font-normal animate-pulse">Loading deals...</strong>
                  </p>
                ) : (
                  <p
                    className="
                    mt-1

                    font-inter

                    text-[15px]
                    font-normal
                    leading-5

                    text-[#667085]
                  "
                  >
                    {description ? (
                      description
                    ) : isSimOnly ? (
                      <>
                        <strong className="font-normal">{simOnlyPlanItems.length} deals</strong>{' '}
                        available, starting with the lowest monthly cost.
                      </>
                    ) : service === 'insurance' ? (
                      <>
                        <strong className="font-normal">{insurancePlanItems.length} quotes</strong>{' '}
                        found, starting with the lowest monthly cost.
                      </>
                    ) : isInsurance ? (
                      <>
                        <strong className="font-normal">{insurancePlanItems.length} quotes</strong>{' '}
                        sorted with lowest first.
                      </>
                    ) : service === 'broadband' ? (
                      <>
                        <strong className="font-normal">{broadbandPlanItems.length} plans</strong>{' '}
                        found based on your preferences.
                      </>
                    ) : (
                      <>
                        <strong className="font-normal">
                          {resultCount ?? quotePlans?.length ?? resultsStatus.descriptionStart}
                        </strong>{' '}
                        {resultsStatus.descriptionRest}
                      </>
                    )}
                  </p>
                )}

                {!isSimOnly && (
                  <div className="mt-3 flex items-center gap-2">
                    {(isInsurance
                      ? [
                          { id: 'monthly', label: 'Monthly', value: 'monthly' },
                          { id: 'annual', label: 'Annual', value: 'annual' },
                        ]
                      : // : resultsStatus.planTabs.options
                        []
                    ).map((option) => {
                      const isSelected = selectedPlanTab === option.value;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedPlanTab(option.value);
                          }}
                          className={`
                            inline-flex
                            h-[28px]
                            items-center
                            justify-center
                            rounded-[6px]
                            border
                            px-3
                            font-[660]
                            font-red-hat-display
                            text-[13px]

                            ${
                              isSelected
                                ? `
                                  border-[#00897B]
                                  bg-[#00897B]
                                  font-extrabold
                                  text-white
                                `
                                : `
                                  border-[#EAECF0]
                                  bg-white
                                  font-medium
                                  text-[#344054]
                                `
                            }
                          `}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SORT */}
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <ArrowDownUp
                    aria-hidden="true"
                    className="h-[18px] w-[18px] text-[#344054]"
                    strokeWidth={1.7}
                  />

                  <span
                    className="
                      font-inter
                      text-[13px]
                      font-medium
                      leading-5
                      text-[#344054]
                    "
                  >
                    Sort:
                  </span>
                </div>

                <div className="relative inline-flex items-center">
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                    aria-label="Sort deals"
                    className="
                      h-[34px]
                      min-w-[150px]
                      cursor-pointer
                      appearance-none
                      rounded-[6px]
                      border
                      border-[#D0D5DD]
                      bg-white
                      pl-3
                      pr-8
                      font-inter
                      text-[13px]
                      font-[600]
                      text-[#344054]
                      outline-none
                      focus:border-[#00897B]
                      shadow-[0px_1px_2px_rgba(16,24,40,0.05)]
                    "
                  >
                    {Object.entries(service === 'broadband' ? BROADBAND_SORTS : MOBILE_SORTS).map(
                      ([key, cfg]) => (
                        <option
                          key={key}
                          value={key}
                        >
                          {cfg.label}
                        </option>
                      ),
                    )}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2.5 h-4 w-4 text-[#667085]"
                  />
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-3">
              {renderCards()}
              {renderLoadMoreButton()}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DETAILS DRAWER
      ====================================================== */}

      <PlanDetailsDrawer
        plan={selectedPlan}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onSelectPlan={handleDrawerPrimaryAction}
      />
    </>
  );
}

/* =========================================================
   INSURANCE CARD

   Desktop / laptop target:
   954px × 317px
   radius 16px
   1px #EAECF0 border
========================================================= */

type InsurancePlanCardProps = {
  plan: InsurancePlan;
  onViewDetails: (plan: StandardPlan) => void;
  onSelectPlan: (plan: StandardPlan) => void;
};

function InsurancePlanCard({ plan, onViewDetails, onSelectPlan }: InsurancePlanCardProps) {
  const leftFeatures = plan.features.slice(0, 4);
  const rightFeatures = plan.features.slice(4);

  return (
    <article
      className="
        w-full
        overflow-hidden

        rounded-[16px]

        border
        border-[#EAECF0]

        bg-white

        shadow-[0px_1px_3px_rgba(16,24,40,0.03)]

        lg:h-[317px]
        lg:max-w-full
        lg:w-[954px]
      "
    >
      {/* =====================================================
          TOP ROW
      ====================================================== */}
      <div
        className="
          flex
          w-full
          flex-col

          md:flex-row
          md:items-stretch

          lg:h-[103px]
        "
      >
        {/* IMAGE + TITLE */}
        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-3

            px-4
            py-4

            lg:gap-4
            lg:px-4
            lg:py-[15px]
          "
        >
          <div
            className="
              flex
              h-[68px]
              w-[68px]
              shrink-0
              items-center
              justify-center
              overflow-hidden

              rounded-[10px]

              border
              border-[#EAECF0]

              bg-white

              lg:h-[72px]
              lg:w-[72px]
              lg:rounded-[11.25px]
            "
          >
            <Image
              src={plan.logo}
              alt={plan.logoAlt}
              width={72}
              height={72}
              className="
                h-full
                w-full
                object-contain
              "
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="
                truncate

                font-red-hat-display

                text-[18px]
                font-[645]
                leading-[22px]

                text-[#101828]

                lg:text-[20px]
                lg:leading-[21.75px]
              "
            >
              {plan.provider}
            </h3>

            <p
              className="
                mt-1
                truncate

                font-red-hat-display

                text-[13px]
                font-[467]
                leading-[19px]

                text-[#667085]

                lg:text-[15px]
                lg:leading-[19.5px]
              "
            >
              {plan.description}
            </p>
          </div>
        </div>

        {/* SAVE — intentionally no divider between title and saving box */}
        <div
          className="
            flex
            shrink-0
            items-center

            px-4
            py-3

            md:w-[164px]

            lg:w-[166px]
            lg:px-3
          "
        >
          <div
            className="
              w-full

              rounded-[8px]

              border
              border-[#A6F4C5]

              bg-[#F6FEF9]

              px-3
              py-2.5
            "
          >
            <p
              className="
                font-red-hat-display

                text-[20px]
                font-[645]
                leading-[28px]

                text-[#12B76A]
              "
            >
              {plan.saving}
            </p>

            <p
              className="
                mt-[2px]

                font-red-hat-display

                text-[11px]
                font-[467]
                leading-[14px]

                text-[#054F31]
              "
            >
              {plan.savingDescription}
            </p>
          </div>
        </div>

        {/* ACTIONS — divider only between saving box and buttons */}
        <div
          className="
            flex
            shrink-0
            flex-row
            items-center
            gap-2

            border-t
            border-[#EAECF0]

            px-4
            py-3

            md:w-[168px]
            md:flex-col
            md:justify-center
            md:border-l
            md:border-t-0

            lg:w-[172px]
            lg:px-4
          "
        >
          <button
            type="button"
            onClick={() => {
              onSelectPlan(plan);
            }}
            className="
              inline-flex
              h-[38px]
              flex-1
              items-center
              justify-center

              rounded-full

              border
              border-[#00897B]

              bg-[#00897B]

              px-4

              font-red-hat-display

              text-[13px]
              font-bold

              text-white

              transition-colors

              hover:bg-[#00796D]

              md:w-full
              md:flex-none

              lg:h-[40px]
              lg:text-[14px]
            "
          >
            {plan.primaryButton}
          </button>

          <button
            type="button"
            onClick={() => {
              onViewDetails(plan);
            }}
            className="
              inline-flex
              h-[38px]
              flex-1
              items-center
              justify-center
              gap-1.5

              rounded-full

              border
              border-[#667085]

              bg-white

              px-4

              font-red-hat-display

              text-[13px]
              font-[645]

              text-[#101828]

              transition-colors

              hover:bg-[#F9FAFB]

              md:w-full
              md:flex-none

              lg:h-[40px]
              lg:text-[14px]
            "
          >
            {plan.viewDetailsButton}

            <ChevronRight
              aria-hidden="true"
              className="
                h-[18px]
                w-[18px]

                text-[#0D3B66]
              "
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>

      {/* =====================================================
          BOTTOM ROW

          Desktop:
          3 columns, ~298.67px each with 12px gaps.
      ====================================================== */}
      <div
        className="
          grid
          grid-cols-1
          gap-3

          border-t
          border-[#EAECF0]

          px-4
          py-4

          md:grid-cols-2

          lg:h-[214px]
          lg:grid-cols-3
          lg:gap-3
          lg:px-4
          lg:py-4
        "
      >
        <InsuranceFeatureBlock
          title="Buildings cover"
          features={leftFeatures}
        />

        <InsuranceFeatureBlock
          title="Buildings cover"
          features={rightFeatures}
          mutedLast
        />

        <div
          className="
            space-y-3

            md:col-span-2

            lg:col-span-1
          "
        >
          <InsuranceMetric
            label="Total cost"
            value={plan.totalCost}
            highlighted
          />

          <InsuranceMetric
            label="Monthly x 11"
            value={plan.monthlyPayment}
          />

          <InsuranceMetric
            label="Deposit"
            value={plan.deposit}
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   INSURANCE FEATURE BLOCK
========================================================= */

function InsuranceFeatureBlock({
  title,
  features,
  mutedLast = false,
}: {
  title: string;
  features: string[];
  mutedLast?: boolean;
}) {
  return (
    <div
      className="
        min-w-0

        rounded-[8px]

        border
        border-[#EAECF0]

        bg-[#F9FAFB]

        px-4
        py-3
      "
    >
      <p
        className="
          font-red-hat-display

          text-[13px]
          font-[550]
          leading-[19.5px]
          tracking-[-0.01em]

          text-[#667085]
        "
      >
        {title}
      </p>

      <div className="mt-2 space-y-[6px]">
        {features.map((feature, index) => {
          const isMuted = mutedLast && index === features.length - 1;

          return (
            <div
              key={feature}
              className="
                flex
                min-w-0
                items-start
                gap-2
              "
            >
              {isMuted ? (
                <X
                  aria-hidden="true"
                  className="
                    mt-[3px]

                    h-[13px]
                    w-[13px]
                    shrink-0

                    text-[#98A2B3]
                  "
                  strokeWidth={2}
                />
              ) : (
                <Check
                  aria-hidden="true"
                  className="
                    mt-[3px]

                    h-[13px]
                    w-[13px]
                    shrink-0

                    text-[#00897B]
                  "
                  strokeWidth={2.3}
                />
              )}

              <span
                className={`
                  min-w-0

                  font-red-hat-display

                  text-[13px]
                  font-[467]
                  leading-[19.5px]

                  ${isMuted ? 'text-[#667085]' : 'text-[#101828]'}
                `}
              >
                {feature}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   INSURANCE COST CARD
========================================================= */

function InsuranceMetric({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`
        flex
        h-[50.333px]
        w-full

        items-center
        justify-between

        gap-3

        rounded-[8px]

        border

        px-3
        py-2.5

        ${
          highlighted
            ? `
              border-[#00897B]
              bg-[linear-gradient(0deg,rgba(0,137,123,0.05),rgba(0,137,123,0.05)),linear-gradient(0deg,rgba(255,255,255,0.95),rgba(255,255,255,0.95))]
            `
            : `
              border-[#EAECF0]
              bg-[#F9FAFB]
            `
        }
      `}
    >
      <span
        className={`
          font-red-hat-display

          text-[14px]
          font-[467]
          leading-[21px]

          ${highlighted ? 'text-[#101828]' : 'text-[#667085]'}
        `}
      >
        {label}
      </span>

      <strong
        className="
          font-red-hat-display

          text-[16px]
          font-[645]
          leading-6
          tracking-[-0.01em]

          text-right

          text-[#101828]
        "
      >
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   SIM ONLY CARD
========================================================= */

type SimOnlyCardProps = {
  plan: SimOnlyPlan;
  onViewDeal: () => void;
  onMoreInfo: () => void;
};

function SimOnlyCard({ plan, onViewDeal, onMoreInfo }: SimOnlyCardProps) {
  return (
    <article
      className="
        w-full

        overflow-hidden

        rounded-[14px]

        border
        border-[#EAECF0]

        bg-white

        shadow-[0px_1px_3px_rgba(16,24,40,0.03)]
      "
    >
      <div className="flex border-b border-[#EAECF0]">
        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-3
            p-3

            sm:gap-4
            sm:p-4
          "
        >
          <div
            className="
              flex
              h-[54px]
              w-[54px]
              shrink-0

              items-center
              justify-center

              overflow-hidden

              rounded-[8px]

              sm:h-[60px]
              sm:w-[60px]
            "
          >
            <Image
              src={plan.logo}
              alt={plan.logoAlt}
              width={60}
              height={60}
              className="
                h-full
                w-full
                object-contain
              "
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="
                font-red-hat-display
                text-[20px]
                font-bold
                leading-[21.75px]
                text-[#101828]
              "
            >
              {plan.provider}
            </h3>

            <p
              className="
                mt-[2px]
                font-red-hat-display
                text-[15px]
                font-medium
                leading-[19.5px]
                text-[#667085]
              "
            >
              {plan.networkDescription}
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {plan.badges.map((badge) => (
                <span
                  key={badge}
                  className="
                      inline-flex
                      items-center
                      rounded-[4px]
                      bg-[#EEF4FA]
                      px-2
                      py-[3px]
                      font-red-hat-display
                      text-[11.5px]
                      font-bold
                      leading-[17.25px]
                      text-[#105089]
                    "
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="
            flex
            w-[138px]
            shrink-0
            flex-col
            items-center
            justify-center
            gap-2
            border-l
            border-[#EAECF0]
            px-[9px]

            sm:w-[148px]
            sm:px-[14px]
          "
        >
          <button
            type="button"
            onClick={onViewDeal}
            className="
              inline-flex
              h-[36px]
              w-[120px]

              items-center
              justify-center

              gap-2

              rounded-full

              border
              border-[#105089]

              bg-[#105089]

              px-[14px]
              py-2

              font-red-hat-display

              text-[14px]
              font-bold
              leading-5

              text-white

              transition-colors

              hover:border-[#0D3B66]
              hover:bg-[#0D3B66]
            "
          >
            {plan.primaryButton}

            <ExternalLink
              aria-hidden="true"
              className="
                h-4
                w-4
                shrink-0
              "
              strokeWidth={2}
            />
          </button>

          <button
            type="button"
            onClick={onMoreInfo}
            className="
              inline-flex
              h-[36px]
              w-[120px]

              items-center
              justify-center

              gap-0.5

              rounded-full

              border
              border-[#667085]

              bg-[#F2F4F7]

              px-[14px]
              py-2

              font-red-hat-display

              text-[14px]
              font-bold
              leading-5

              text-[#101828]

              shadow-[0px_1px_2px_0px_#1018280D]

              transition-colors

              hover:bg-[#EAECF0]
            "
          >
            {plan.secondaryButton}

            <ChevronRight
              aria-hidden="true"
              className="
                h-5
                w-5
                shrink-0
              "
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-2
          p-3

          sm:grid-cols-3
          sm:gap-3
          sm:p-4
        "
      >
        <SimMetric
          label="Data"
          value={plan.data}
        />

        <SimMetric
          label="Monthly Contract"
          value={
            plan?.contract ||
            `${plan?.contractLength || 12} ${plan?.contractLength && plan?.contractLength > 1 ? 'Months' : 'Month'} contract`
          }
        />

        <SimMetric
          label="Cost"
          value={plan.totalCost || plan.price}
        />
      </div>

      {plan.promos && plan.promos.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 pb-3 sm:px-4 sm:pb-4">
          {plan.promos.map((promo, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-[4px] border border-[#FECDCA] bg-[#FEF3F2] px-2 py-0.5 font-red-hat-display text-[11px] font-semibold text-[#B42318]"
            >
              ★ {promo}
            </span>
          ))}
        </div>
      )}

      {/* <div className="flex items-center gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
        <Globe2
          aria-hidden="true"
          className="
            h-[18px]
            w-[16px]
            shrink-0
            text-[#101828]
          "
          strokeWidth={1.7}
        />

        <p
          className="
            font-red-hat-display
            text-[13px]
            font-medium
            leading-[19.5px]
            text-[#101828]
          "
        >
          {plan.roamingText}
        </p>
      </div> */}
    </article>
  );
}

/* =========================================================
   SIM METRIC
========================================================= */

type SimMetricProps = {
  label: string;
  value: string;
};

function SimMetric({ label, value }: SimMetricProps) {
  return (
    <div
      className="
        min-h-[58px]

        rounded-[7px]

        border
        border-[#EAECF0]

        bg-[#F9FAFB]

        px-3
        py-2.5
      "
    >
      <p
        className="
          font-red-hat-display
          text-[13px]
          font-medium
          leading-[19.5px]
          text-[#667085]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-[2px]
          font-red-hat-display
          text-[14px]
          font-bold
          leading-[21px]
          tracking-[-0.01em]
          text-[#101828]
        "
      >
        {value}
      </p>
    </div>
  );
}
