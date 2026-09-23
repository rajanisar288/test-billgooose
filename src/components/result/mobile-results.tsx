'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ArrowDownUp, ChevronDown, LoaderCircle, Plus, SlidersHorizontal, X } from 'lucide-react';

import Loading from '@/app/loading';
import PlanDetailsDrawer from '@/components/result/plan-details-drawer';
import type { StandardPlan } from '@/components/result/plan.types';
import { useResultFilters } from '@/components/result/result-filter-context';
import ResultFilterSidebar from '@/components/result/result-filter-sidebar';
import ResultFilters from '@/components/result/result-filters';
import ResultHero from '@/components/result/result-hero';
import data from '@/data/content.json';
import { trackSelectPlan } from '@/lib/gtm';
import { isMobileDeal, type StickeeDeal } from '@/lib/stickee/types';
import { useStickeeDeals } from '@/lib/stickee/useStickeeDeals';
import { MOBILE_SORTS, VERTICALS } from '@/lib/stickee/verticals';

/* =========================================================
   TYPES
========================================================= */

type MobileResultsContent = {
  labels: {
    resultsSummary: string;
    phonesFoundSuffix: string;
    sort: string;
    sortDefault: string;
    viewDetails: string;
    seeAllDeals: string;
    loadMore: string;
    noMoreData: string;
    perMonth: string;
    data: string;
    startingPrice: string;
    priceRises: string;
    upfrontCost: string;
  };
  brands: Array<{
    id: string;
    label: string;
    icon: string;
    iconAlt: string;
  }>;
};

/* =========================================================
   STATIC CONTENT & HELPERS
========================================================= */

const mobileResultsStatic = data.resultPage.mobileResults as unknown as MobileResultsContent;

function formatData(mb: number): string {
  if (mb === -1 || mb >= 999999) return 'Unlimited';
  if (mb >= 1000) return `${(mb / 1000).toFixed(0)}GB`;
  return `${mb}MB`;
}

function formatPriceIncreaseDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'long' });
  const year = d.getFullYear();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';
  return `${day}${suffix} ${month} ${year}`;
}

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
  if (typeof promos === 'object') {
    return Object.values(promos as Record<string, unknown>)
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
  return [];
}

function convertDealToPlan(deal: StickeeDeal): StandardPlan {
  const promos = extractPromos(deal.promos);
  const dataStr =
    deal.tariff.data === -1 || deal.tariff.data >= 999999
      ? 'Unlimited data'
      : `${formatData(deal.tariff.data)} data`;
  const upfrontStr =
    deal.discount_line_rental != null && deal.discount_line_rental > 0
      ? `£${deal.discount_line_rental.toFixed(2)} upfront`
      : 'Free upfront';

  return {
    id: deal.id,
    type: 'view-deal',
    service: 'mobile',
    provider: deal.retailer.name,
    planName: deal.model.name,
    description: `${deal.tariff.network.name} Network · ${deal.tariff.contract_length || 24} ${deal.tariff.contract_length > 1 ? 'Months' : 'Month'} contract`,
    logo: deal.tariff.network.image || deal.retailer.image || '/images/brand-placeholder.png',
    logoAlt: deal.tariff.network.name,
    rating: deal.tariff.network.score ? `${deal.tariff.network.score}` : '',
    contract: `${deal.tariff.contract_length || 24} ${deal.tariff.contract_length > 1 ? 'Months' : 'Month'} contract`,
    features: [dataStr, upfrontStr, ...promos].filter(Boolean),
    priceLabel: 'Monthly cost',
    price: `£${deal.price.toFixed(2)}`,
    pricePeriod: '/month',
    saving: deal.cashback > 0 ? `£${deal.cashback.toFixed(0)} Cashback` : '',
    upfrontCost:
      deal.discount_line_rental != null && deal.discount_line_rental > 0
        ? `£${deal.discount_line_rental.toFixed(2)}`
        : '£0.00',
    mobile: deal,
    providerUrl: deal.url,
    viewDetailsButton: 'View Details',
    primaryButton: 'Buy Now',
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MobileResults() {
  const router = useRouter();
  const {
    filters: appliedFilters,
    sortKey,
    setSortKey,
    setIsDealsLoading,
    setDealsCount,
  } = useResultFilters();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Drawer state
  const [selectedPlan, setSelectedPlan] = useState<StandardPlan | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<StickeeDeal | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const activeSortConfig = useMemo(() => {
    const found = MOBILE_SORTS[sortKey as keyof typeof MOBILE_SORTS];
    return found
      ? { sort: found.sort, reverse: found.reverse }
      : { sort: 'RECOMMENDED', reverse: false };
  }, [sortKey]);

  const {
    deals: rawDeals,
    facets: stickeeFacets,
    loading: stickeeLoading,
    isFetchingMore,
    hasMorePages,
    loadMore,
  } = useStickeeDeals({
    vertical: 'mobile',
    fixed: VERTICALS.mobile_paym.fixed as Record<string, unknown>,
    filters: appliedFilters.stickeeFilters,
    sort: activeSortConfig.sort,
    reverse: activeSortConfig.reverse,
    enabled: true,
  });

  const stickeeDeals: StickeeDeal[] = useMemo(() => {
    return rawDeals.filter(isMobileDeal);
  }, [rawDeals]);

  const displayedDeals = stickeeDeals;

  useEffect(() => {
    setIsDealsLoading(stickeeLoading);
    if (!stickeeLoading) {
      setDealsCount(displayedDeals.length);
    }
  }, [stickeeLoading, displayedDeals.length, setIsDealsLoading, setDealsCount]);

  /* =========================================================
     ACTIONS
  ========================================================= */

  const handleViewDetails = (deal: StickeeDeal) => {
    const plan = convertDealToPlan(deal);
    setSelectedDeal(deal);
    setSelectedPlan(plan);
    setIsDetailsOpen(true);
  };

  const handleBuyNow = (deal: StickeeDeal) => {
    if (!deal.url) return;

    const plan = convertDealToPlan(deal);
    trackSelectPlan({
      planName: plan.planName || plan.provider,
      provider: plan.provider,
      service: 'mobile',
      price: plan.price,
      planId: plan.id,
    });

    sessionStorage.setItem('journeySelectedPlan', JSON.stringify(deal));
    sessionStorage.setItem('externalRedirectUrl', deal.url);
    sessionStorage.setItem('externalRedirectProvider', deal.retailer.name);
    sessionStorage.setItem('externalRedirectService', 'mobile');
    sessionStorage.setItem('externalRedirectOrigin', 'mobile');
    sessionStorage.setItem('billgooseJourneyService', 'mobile');
    sessionStorage.setItem('billgooseJourneyFlow', 'mobile');

    router.push('/redirecting?service=mobile');
  };

  return (
    <>
      <ResultHero variant="mobile" />

      <ResultFilters />

      <section
        className="
          mx-auto
          w-full
          max-w-[1440px]
          px-4
          pb-14
          pt-5
          min-[390px]:px-5
          sm:px-6
          sm:pt-6
          md:px-8
          lg:px-8
          lg:pb-20
          xl:px-10
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[326px_minmax(0,1fr)]
            lg:items-start
            lg:gap-5
            xl:gap-6
          "
        >
          {/* DESKTOP FILTER SIDEBAR */}
          <div className="hidden lg:block">
            <ResultFilterSidebar
              isMobile
              facets={stickeeFacets}
              isLoading={stickeeLoading}
            />
          </div>

          <div className="min-w-0 w-full">
            {/* RESULT SUMMARY */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="
                    font-red-hat-display
                    text-[18px]
                    font-extrabold
                    leading-6
                    text-[#101828]
                    md:text-[20px]
                    md:leading-7
                  "
                >
                  {mobileResultsStatic.labels?.resultsSummary ?? 'Results summary'}
                </h2>

                <p
                  className="
                    mt-1
                    font-inter
                    text-[12px]
                    font-normal
                    leading-[18px]
                    text-[#667085]
                    md:text-[13px]
                    md:leading-5
                  "
                >
                  {stickeeLoading
                    ? 'Loading mobile deals...'
                    : `${stickeeDeals.length} ${mobileResultsStatic.labels?.phonesFoundSuffix ?? 'deals found'}`}
                </p>
              </div>

              {/* MOBILE FILTER BUTTON */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="
                  inline-flex
                  h-[36px]
                  shrink-0
                  items-center
                  justify-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#D0D5DD]
                  bg-white
                  px-3
                  font-red-hat-display
                  text-[12px]
                  font-semibold
                  text-[#344054]
                  shadow-sm
                  lg:hidden
                "
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>

            {/* TABS + SORT */}
            <div
              className="
                mt-5
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-center
                md:justify-end
              "
            >
              {/* BRAND TABS */}
              {/* <div
                className="
                  flex
                  max-w-full
                  items-center
                  gap-2
                  overflow-x-auto
                  pb-1
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {brandTabs.map((brand) => {
                  const isActive = activeBrandId === brand.id;

                  return (
                    <button
                      key={brand.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        handleBrandSelect(brand.id);
                      }}
                      className={`
                        inline-flex
                        h-[32px]
                        shrink-0
                        items-center
                        justify-center
                        gap-1.5
                        rounded-[6px]
                        border
                        px-[8px]
                        ${isActive ? 'border-[#00897B] bg-[#E6F4F2]' : 'border-[#EAECF0] bg-white'}
                      `}
                    >
                      <Image
                        src={brand.icon}
                        alt={brand.iconAlt}
                        width={20}
                        height={20}
                        className="h-[20px] w-[20px] shrink-0 object-contain"
                      />

                      <span
                        className="
                          font-red-hat-display
                          text-[13px]
                          font-[500]
                          leading-5
                          text-[#101828]
                        "
                      >
                        {brand.label}
                      </span>
                    </button>
                  );
                })}
              </div> */}
              {/* DYNAMIC SORT */}
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <ArrowDownUp
                    aria-hidden="true"
                    className="h-4 w-4 text-[#344054]"
                    strokeWidth={1.7}
                  />

                  <span
                    className="
                      font-red-hat-display
                      text-[12px]
                      font-medium
                      leading-5
                      text-[#344054]
                    "
                  >
                    {mobileResultsStatic.labels?.sort ?? 'Sort:'}
                  </span>
                </div>

                <div className="relative inline-flex items-center">
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                    aria-label="Sort mobile deals"
                    className="
                      h-[34px]
                      min-w-[140px]
                      cursor-pointer
                      appearance-none
                      rounded-[6px]
                      border
                      border-[#D0D5DD]
                      bg-white
                      pl-3
                      pr-8
                      font-red-hat-display
                      text-[12px]
                      font-normal
                      text-[#344054]
                      outline-none
                      focus:border-[#00897B]
                      shadow-[0px_1px_2px_0px_#1018280D]
                    "
                  >
                    {Object.entries(MOBILE_SORTS).map(([key, cfg]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2.5 h-4 w-4 text-[#667085]"
                  />
                </div>
              </div>
            </div>

            {/* CONTENT AREA: LOADER / EMPTY / CARDS */}
            {stickeeLoading ? (
              <div className="my-7 overflow-hidden rounded-[16px] border border-[#EAECF0]">
                <Loading />
              </div>
            ) : displayedDeals.length === 0 ? (
              <div className="flex bg-white justify-center items-center h-[200px] w-full rounded-[16px] my-7 border border-[#EAECF0]">
                <p className="font-inter text-[14px] text-[#667085]">
                  No mobile deals match your current filters.
                </p>
              </div>
            ) : (
              <>
                {/* DEALS LIST */}
                <div className="mt-7 space-y-4">
                  {displayedDeals.map((deal) => (
                    <MobilePhoneCard
                      key={deal.id}
                      deal={deal}
                      onViewDetails={() => handleViewDetails(deal)}
                      onBuyNow={() => handleBuyNow(deal)}
                    />
                  ))}
                </div>

                {/* LOAD MORE / PAGINATION */}
                <div
                  className="
                    relative
                    mt-10
                    flex
                    w-full
                    items-center
                    justify-center
                    sm:mt-12
                    lg:mt-14
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      left-0
                      right-[calc(50%+90px)]
                      top-1/2
                      h-px
                      bg-[#EAECF0]
                    "
                  />

                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      left-[calc(50%+90px)]
                      right-0
                      top-1/2
                      h-px
                      bg-[#EAECF0]
                    "
                  />

                  {hasMorePages ? (
                    <button
                      type="button"
                      disabled={isFetchingMore}
                      onClick={() => loadMore()}
                      className="btn-load-more inline-flex items-center gap-2"
                    >
                      {isFetchingMore ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin text-[#00897B]" />
                          Loading deals...
                        </>
                      ) : (
                        <>
                          <Plus
                            aria-hidden="true"
                            strokeWidth={2}
                          />
                          {mobileResultsStatic.labels?.loadMore ?? 'Load More Deals'}
                        </>
                      )}
                    </button>
                  ) : (
                    <div
                      className="
                        relative
                        z-10
                        rounded-full
                        border
                        border-[#EAECF0]
                        bg-white
                        px-5
                        py-2
                        font-red-hat-display
                        text-[13px]
                        font-medium
                        text-[#667085]
                        shadow-sm
                      "
                    >
                      {mobileResultsStatic.labels?.noMoreData ?? 'All deals shown'}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PLAN DETAILS DRAWER */}
      <PlanDetailsDrawer
        plan={selectedPlan}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedDeal(null);
          setSelectedPlan(null);
        }}
        onSelectPlan={() => {
          if (selectedDeal) {
            handleBuyNow(selectedDeal);
          }
        }}
      />

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[rgba(16,24,40,0.35)] lg:hidden"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsMobileFilterOpen(false);
          }}
        >
          <div className="absolute inset-y-0 right-0 w-[min(92vw,360px)] bg-white shadow-xl flex flex-col">
            <div className="flex h-14 items-center justify-between border-b border-[#EAECF0] px-4">
              <h3 className="font-red-hat-display text-base font-bold text-[#101828]">Filters</h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ResultFilterSidebar
                mobilePanel
                isMobile
                facets={stickeeFacets}
                isLoading={stickeeLoading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   MOBILE PHONE CARD (LAYOUT MATCHING REFERENCE IMAGE)
========================================================= */

type MobilePhoneCardProps = {
  deal: StickeeDeal;
  onViewDetails: () => void;
  onBuyNow: () => void;
};

function MobilePhoneCard({ deal, onViewDetails, onBuyNow }: MobilePhoneCardProps) {
  // const promos = extractPromos(deal.promos);

  return (
    <article className="w-full rounded-[16px] border border-[#EAECF0] bg-white p-4 sm:p-5 md:p-6 shadow-sm hover:border-[#00897B] transition-colors">
      {/* Title & Badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="font-red-hat-display text-[17px] sm:text-[18px] font-bold text-[#101828]">
          {deal.model.name}
        </h3>
        {deal.is_refurbished ? (
          <span className="shrink-0 rounded-full bg-[#00897B] px-3.5 py-1 text-[12px] font-bold text-white">
            Refurbished
          </span>
        ) : deal.is_exclusive ? (
          <span className="shrink-0 rounded-full bg-[#00897B] px-3.5 py-1 text-[12px] font-bold text-white">
            Exclusive
          </span>
        ) : deal.cashback > 0 ? (
          <span className="shrink-0 rounded-full bg-[#00897B] px-3.5 py-1 text-[12px] font-bold text-white">
            £{deal.cashback.toFixed(0)} Cashback
          </span>
        ) : null}
      </div>

      {/* Main Image & Metric Boxes */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Device Image */}
        <div className="flex h-[130px] w-[90px] shrink-0 items-center justify-center">
          <Image
            src={deal.main_model_image || '/images/phone-placeholder.png'}
            alt={deal.model.name}
            width={90}
            height={130}
            className="max-h-[130px] w-auto object-contain"
          />
        </div>

        {/* 4 Metric Boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1 w-full">
          {/* Box 1: Data */}
          <div className="flex flex-col justify-start rounded-[8px] bg-[#F2F4F7] p-3 min-h-[90px]">
            <span className="font-red-hat-display text-[16px] sm:text-[18px] font-bold text-[#00897B]">
              {formatData(deal.tariff.data)}
            </span>
            <span className="mt-1 font-inter text-[12px] sm:text-[13px] font-medium text-[#667085]">
              Data
            </span>
          </div>

          {/* Box 2: Monthly Contract */}
          <div className="flex flex-col justify-start rounded-[8px] bg-[#F2F4F7] p-3 min-h-[90px]">
            <span className="font-red-hat-display text-[16px] sm:text-[18px] font-bold text-[#00897B]">
              {deal.tariff.contract_length || 24}
            </span>
            <span className="mt-1 font-inter text-[12px] sm:text-[13px] font-medium text-[#667085]">
              Months contract
            </span>
          </div>

          {/* Box 3: Upfront Cost */}
          <div className="flex flex-col justify-start rounded-[8px] bg-[#F2F4F7] p-3 min-h-[90px]">
            <span className="font-red-hat-display text-[16px] sm:text-[18px] font-bold text-[#00897B]">
              {deal.discount_line_rental != null && deal.discount_line_rental > 0
                ? `£${deal.discount_line_rental.toFixed(2)}`
                : '£0.00'}
            </span>
            <span className="mt-1 font-inter text-[12px] sm:text-[13px] font-medium text-[#667085]">
              upfront cost
            </span>
          </div>

          {/* Box 4: Price Per Month with Price Increases */}
          <div className="flex flex-col justify-start rounded-[8px] bg-[#F2F4F7] p-3 min-h-[90px]">
            <span className="font-red-hat-display text-[16px] sm:text-[18px] font-bold text-[#00897B]">
              £{deal.price.toFixed(2)}
            </span>
            <span className="mt-1 font-inter text-[12px] sm:text-[13px] font-medium text-[#667085]">
              per month
            </span>

            {deal.price_increases && deal.price_increases.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#D0D5DD]/40 text-[11px] text-[#475467] leading-tight space-y-0.5">
                <span className="font-medium text-[#344054] block">Increasing to:</span>
                {deal.price_increases.map((inc, i) => (
                  <div key={i}>
                    £{inc.price.toFixed(2)} from {formatPriceIncreaseDate(inc.date)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Network & Sold By */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <div className="flex items-center justify-center gap-2 rounded-[8px] border border-[#EAECF0] py-2 px-3 text-[13px] text-[#475467]">
          <span>Network:</span>
          {deal.tariff.network.image ? (
            <Image
              src={deal.tariff.network.image}
              alt={deal.tariff.network.name}
              width={70}
              height={20}
              className="h-5 w-auto object-contain"
            />
          ) : (
            <span className="font-semibold text-[#101828]">{deal.tariff.network.name}</span>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 rounded-[8px] border border-[#EAECF0] py-2 px-3 text-[13px] text-[#475467]">
          <span>Sold by:</span>
          {deal.retailer.image ? (
            <Image
              src={deal.retailer.image}
              alt={deal.retailer.name}
              width={70}
              height={20}
              className="h-5 w-auto object-contain"
            />
          ) : (
            <span className="font-semibold text-[#101828]">{deal.retailer.name}</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          type="button"
          onClick={onViewDetails}
          className="flex h-11 w-full sm:flex-1 items-center justify-center rounded-[8px] bg-[#F2F4F7] font-inter text-[14px] font-semibold text-[#101828] transition hover:bg-[#EAECF0]"
        >
          View details
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          className="flex h-11 w-full sm:flex-1 items-center justify-center rounded-[8px] bg-[#00897B] font-inter text-[14px] font-bold text-white transition hover:bg-[#007A6C]"
        >
          Buy Now
        </button>
      </div>

      {/* Promos Footer (only if promos exist) */}
      {/* {promos.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#475467]">
          {promos.map((promo, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 font-medium text-[#00897B]"
            >
              <span>•</span>
              <span>{promo}</span>
            </div>
          ))}
        </div>
      )} */}
    </article>
  );
}
