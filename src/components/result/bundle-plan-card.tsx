'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { Check, ChevronRight, Droplet, Lightbulb, Percent, Tv, Wifi } from 'lucide-react';

import type { StandardPlan } from '@/components/result/plan.types';
import { sumPlanPrices } from '@/components/result/selected-plans';

/* =========================================================
   TYPES
========================================================= */

export type BundleServiceGroup = {
  groupType: string;
  displayName: string;
  providerLogo?: string;
  providerName?: string;
  products: StandardPlan[];
};

export type BundleSupplierData = {
  supplierId?: string | number;
  supplierCode: string;
  supplierName: string;
  imageUrl?: string | null;
  servicesIncluded: string[];
  badges?: string[];
  promoText?: string | null;
  serviceGroups: BundleServiceGroup[];
};

type BundlePlanCardProps = {
  supplier: BundleSupplierData;
  onViewDetails: (plan: StandardPlan) => void;
  onSelectBundle: (supplier: BundleSupplierData, selectedPlans: StandardPlan[]) => void;
  isSelecting?: boolean;
};

/* =========================================================
   SERVICE ICON HELPER
========================================================= */

function getServiceIcon(groupType: string) {
  const normalized = groupType.toLowerCase();
  if (
    normalized.includes('energy') ||
    normalized.includes('electric') ||
    normalized.includes('gas')
  ) {
    return <Lightbulb className="h-4 w-4 text-[#475467]" />;
  }
  if (
    normalized.includes('broadband') ||
    normalized.includes('wifi') ||
    normalized.includes('internet')
  ) {
    return <Wifi className="h-4 w-4 text-[#475467]" />;
  }
  if (normalized.includes('water')) {
    return <Droplet className="h-4 w-4 text-[#0BA5EC]" />;
  }
  if (normalized.includes('tv')) {
    return <Tv className="h-4 w-4 text-[#7F56D9]" />;
  }
  return <Lightbulb className="h-4 w-4 text-[#475467]" />;
}

/* =========================================================
   SPEED BADGE EXTRACTOR
========================================================= */

function extractSpeedBadge(plan: StandardPlan): string | null {
  if (plan.averageSpeed) return plan.averageSpeed;
  const match = plan.planName?.match(/(\d+\s*(?:Mbps|Gbps|MB|GB))/i);
  if (match) return match[1];
  const featureMatch = plan.features?.find((f) => /(\d+\s*(?:Mbps|Gbps))/i.test(f));
  if (featureMatch) {
    const m = featureMatch.match(/(\d+\s*(?:Mbps|Gbps))/i);
    if (m) return m[1];
  }
  return null;
}

function formatPlanDisplayName(plan: StandardPlan, speed: string | null): string {
  const baseName = plan.planName || plan.provider || 'Standard';
  if (!speed) return baseName;
  const regex = new RegExp(`\\s*${speed.replace(/\s+/g, '\\s*')}`, 'i');
  const cleaned = baseName.replace(regex, '').trim();
  return cleaned || baseName;
}

function getSupplierInitials(supplier: BundleSupplierData): string {
  const code = (supplier.supplierCode || '').toLowerCase();
  const name = (supplier.supplierName || '').trim().toLowerCase();

  if (code === 'uw' || name.includes('warehouse')) {
    return 'uw';
  }
  if (code.includes('urban') || name.includes('urban')) {
    return 'ub';
  }
  const words = supplier.supplierName.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toLowerCase();
  }
  return supplier.supplierName.slice(0, 2).toLowerCase();
}

/* =========================================================
   BUNDLE PLAN CARD COMPONENT
========================================================= */

export default function BundlePlanCard({
  supplier,
  onViewDetails,
  onSelectBundle,
  isSelecting = false,
}: BundlePlanCardProps) {
  // Pre-select the first product of Energy and Broadband (matching default UI),
  // while allowing user to deselect or switch any service.
  const [selectedProductIds, setSelectedProductIds] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    supplier.serviceGroups.forEach((group) => {
      const type = group.groupType.toLowerCase();
      if (group.products.length > 0 && (type.includes('energy') || type.includes('broadband'))) {
        initial[group.groupType] = group.products[0].id;
      }
    });
    return initial;
  });

  // Synchronize selections if the supplier or its products update dynamically
  useEffect(() => {
    // Hydrate browser-only usage data after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedProductIds((prev) => {
      const next: Record<string, string> = {};
      let hasChange = false;
      supplier.serviceGroups.forEach((group) => {
        const type = group.groupType.toLowerCase();
        const existingSelected = group.products.find((p) => p.id === prev[group.groupType]);
        if (existingSelected) {
          next[group.groupType] = existingSelected.id;
        } else if (
          group.products.length > 0 &&
          (type.includes('energy') || type.includes('broadband'))
        ) {
          next[group.groupType] = group.products[0].id;
          hasChange = true;
        }
      });
      return hasChange || Object.keys(next).length !== Object.keys(prev).length ? next : prev;
    });
  }, [supplier]);

  // Calculate selected plans
  const selectedPlans = supplier.serviceGroups.flatMap((group) => {
    const selectedId = selectedProductIds[group.groupType];
    const plan = group.products.find((p) => p.id === selectedId);
    return plan ? [plan] : [];
  });

  // Recalculate bundle monthly total dynamically
  const bundleTotal = sumPlanPrices(selectedPlans, 'price');

  // Select Bundle button disabled when 0 products are selected
  const isSelectDisabled = selectedPlans.length === 0 || isSelecting;

  // Toggle selection: clicking unselected selects it; clicking already-selected deselects it
  const handleToggleProduct = (groupType: string, plan: StandardPlan) => {
    setSelectedProductIds((previous) => {
      const next = { ...previous };
      if (next[groupType] === plan.id) {
        delete next[groupType];
      } else {
        next[groupType] = plan.id;
      }
      return next;
    });
  };

  // Group columns: Energy is Col 1, Broadband is Col 2, Water & TV (and others) are stacked in Col 3
  const energyGroup = supplier.serviceGroups.find((g) =>
    g.groupType.toLowerCase().includes('energy'),
  );
  const broadbandGroup = supplier.serviceGroups.find((g) =>
    g.groupType.toLowerCase().includes('broadband'),
  );
  const otherGroups = supplier.serviceGroups.filter(
    (g) => g !== energyGroup && g !== broadbandGroup,
  );

  return (
    <article
      className="
        w-full
        rounded-[20px]
        border
        border-[#EAECF0]
        bg-white
        p-5
        shadow-[0px_1px_3px_rgba(16,24,40,0.06)]
        sm:p-6
        lg:p-7
      "
    >
      {/* =====================================================
          SUPPLIER HEADER
      ====================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Supplier Logo + Name + Included Services + Badges */}
        <div className="flex items-start gap-4">
          {supplier.imageUrl ? (
            <div
              className="
                relative
                flex
                h-[56px]
                w-[56px]
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-[14px]
                border
                border-[#EAECF0]
                bg-white
                p-1
              "
            >
              <Image
                src={supplier.imageUrl}
                alt={supplier.supplierName}
                width={56}
                height={56}
                unoptimized
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div
              className="
                flex
                h-[56px]
                w-[56px]
                shrink-0
                items-center
                justify-center
                rounded-[14px]
                bg-[#6938EF]
                font-red-hat-display
                text-[22px]
                font-extrabold
                text-white
                shadow-sm
              "
            >
              {getSupplierInitials(supplier)}
            </div>
          )}

          <div className="min-w-0">
            <h3
              className="
                font-red-hat-display
                text-[20px]
                font-extrabold
                leading-tight
                text-[#101828]
                sm:text-[22px]
              "
            >
              {supplier.supplierName}
            </h3>

            <p
              className="
                mt-0.5
                font-inter
                text-[13px]
                font-medium
                text-[#475467]
              "
            >
              {supplier.servicesIncluded.join(', ')}
            </p>

            {/* Badges */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {supplier.badges?.map((badge) => (
                <span
                  key={badge}
                  className="
                    inline-flex
                    items-center
                    rounded-md
                    bg-[#EFF8FF]
                    px-2.5
                    py-1
                    font-inter
                    text-[11px]
                    font-semibold
                    text-[#175CD3]
                  "
                >
                  {badge}
                </span>
              ))}

              {supplier.promoText && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-md
                    bg-[#ECFDF3]
                    px-2.5
                    py-1
                    font-inter
                    text-[11px]
                    font-semibold
                    text-[#027A48]
                  "
                >
                  <Percent className="h-3 w-3 stroke-[2.5]" />
                  {supplier.promoText}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Dynamic Bundle Total + Select Bundle Button */}
        <div className="flex shrink-0 items-center justify-between gap-5 border-t border-[#F2F4F7] pt-4 sm:border-t-0 sm:pt-0">
          <div className="text-right">
            <div
              className="
                font-red-hat-display
                text-[24px]
                font-extrabold
                leading-tight
                text-[#00897B]
                sm:text-[26px]
              "
            >
              {bundleTotal}/m
            </div>
            <p className="font-inter text-[12px] font-medium text-[#667085]">Bundle total</p>
          </div>

          <button
            type="button"
            disabled={isSelectDisabled}
            onClick={() => onSelectBundle(supplier, selectedPlans)}
            className="
              inline-flex
              h-[42px]
              items-center
              justify-center
              rounded-full
              bg-[#00897B]
              px-6
              font-red-hat-display
              text-[14px]
              font-bold
              text-white
              shadow-sm
              transition-colors
              hover:bg-[#00796D]
              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#00897B]/20
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {isSelecting ? 'Selecting...' : 'Select Bundle'}
          </button>
        </div>
      </div>

      {/* =====================================================
          SERVICE PANELS GRID
      ====================================================== */}
      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
          lg:grid-cols-3
        "
      >
        {/* Column 1: Energy */}
        {energyGroup && (
          <ServicePanel
            group={energyGroup}
            selectedId={selectedProductIds[energyGroup.groupType]}
            onToggleProduct={(plan) => handleToggleProduct(energyGroup.groupType, plan)}
            onViewDetails={onViewDetails}
          />
        )}

        {/* Column 2: Broadband */}
        {broadbandGroup && (
          <ServicePanel
            group={broadbandGroup}
            selectedId={selectedProductIds[broadbandGroup.groupType]}
            onToggleProduct={(plan) => handleToggleProduct(broadbandGroup.groupType, plan)}
            onViewDetails={onViewDetails}
          />
        )}

        {/* Column 3: Stacked Cards for Water & TV (or any extra groups) */}
        {otherGroups.length > 0 && (
          <div className="flex flex-col gap-3">
            {otherGroups.map((group) => (
              <ServicePanel
                key={group.groupType}
                group={group}
                selectedId={selectedProductIds[group.groupType]}
                onToggleProduct={(plan) => handleToggleProduct(group.groupType, plan)}
                onViewDetails={onViewDetails}
                isCompact={otherGroups.length > 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          BOTTOM PROMO BANNER (IF SPECIFIED)
      ====================================================== */}
      {supplier.promoText && (
        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            border-t
            border-[#F2F4F7]
            pt-3
            font-inter
            text-[13px]
            font-semibold
            text-[#027A48]
          "
        >
          <span
            className="
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              bg-[#ECFDF3]
              text-[#027A48]
            "
          >
            <Percent className="h-3 w-3 stroke-[2.5]" />
          </span>
          <span>{supplier.promoText}</span>
        </div>
      )}
    </article>
  );
}

/* =========================================================
   INDIVIDUAL SERVICE PANEL
========================================================= */

type ServicePanelProps = {
  group: BundleServiceGroup;
  selectedId?: string;
  onToggleProduct: (plan: StandardPlan) => void;
  onViewDetails: (plan: StandardPlan) => void;
  isCompact?: boolean;
};

function ServicePanel({
  group,
  selectedId,
  onToggleProduct,
  onViewDetails,
  isCompact = false,
}: ServicePanelProps) {
  return (
    <div
      className={`
        flex
        flex-col
        justify-start
        rounded-[14px]
        border
        border-[#EAECF0]
        bg-white
        p-3.5
        ${isCompact ? 'flex-1' : ''}
      `}
    >
      {/* Panel Header: Icon + Service Title + Optional Provider Logo */}
      <div className="mb-2 flex items-center justify-between border-b border-[#F2F4F7] pb-2.5">
        <div className="flex items-center gap-2">
          <span
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-[#F2F4F7]
            "
          >
            {getServiceIcon(group.groupType)}
          </span>

          <span
            className="
              font-red-hat-display
              text-[13px]
              font-bold
              text-[#344054]
            "
          >
            {group.displayName}
          </span>
        </div>

        {group.providerLogo ? (
          <div className="relative h-5 w-16">
            <Image
              src={group.providerLogo}
              alt={group.providerName || group.displayName}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        ) : group.providerName ? (
          <span className="font-red-hat-display text-[12px] font-bold text-[#6938EF]">
            {group.providerName}
          </span>
        ) : null}
      </div>

      {/* Product Rows */}
      <div className="flex flex-col divide-y divide-[#F2F4F7]">
        {group.products.map((plan) => {
          const isSelected = selectedId === plan.id;
          const speed = extractSpeedBadge(plan);

          return (
            <div
              key={plan.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => onToggleProduct(plan)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleProduct(plan);
                }
              }}
              className="
                group
                flex
                cursor-pointer
                items-center
                justify-between
                rounded-lg
                p-2
                transition-colors
                hover:bg-[#F9FAFB]
              "
            >
              {/* Product Info: Name + Speed Badge */}
              <div className="flex min-w-0 items-center gap-2 pr-2">
                {group.groupType.toLowerCase().includes('broadband') &&
                  (plan.logo && !plan.logo.includes('result-logo.png') ? (
                    <div className="relative h-4 w-4 shrink-0 overflow-hidden">
                      <Image
                        src={plan.logo}
                        alt={plan.provider}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#F2F4F7] text-[#475467]">
                      <Wifi className="h-2.5 w-2.5" />
                    </span>
                  ))}

                {group.groupType.toLowerCase().includes('water') && (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0BA5EC] text-white">
                    <Droplet className="h-2.5 w-2.5" />
                  </span>
                )}

                {group.groupType.toLowerCase().includes('tv') &&
                  (plan.logo && !plan.logo.includes('result-logo.png') ? (
                    <div className="relative h-4 w-4 shrink-0 overflow-hidden">
                      <Image
                        src={plan.logo}
                        alt={plan.provider}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#7F56D9] text-white">
                      <Tv className="h-2.5 w-2.5" />
                    </span>
                  ))}

                <span
                  className="
                    truncate
                    font-red-hat-display
                    text-[13px]
                    font-semibold
                    text-[#101828]
                  "
                >
                  {formatPlanDisplayName(plan, speed)}
                </span>

                {speed && (
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded
                      bg-[#0B2B43]
                      px-1.5
                      py-0.5
                      font-inter
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {speed}
                  </span>
                )}
              </div>

              {/* Price + View Details Link + Radio Check Circle */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <span
                  className="
                    font-red-hat-display
                    text-[13px]
                    font-bold
                    text-[#101828]
                  "
                >
                  {plan.price}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(plan);
                  }}
                  className="
                    inline-flex
                    items-center
                    font-inter
                    text-[11px]
                    font-semibold
                    text-[#00897B]
                    transition-colors
                    hover:text-[#00796D]
                    hover:underline
                  "
                >
                  <span>View Details</span>
                  <ChevronRight className="ml-0.5 h-3 w-3" />
                </button>

                {/* Radio selection circle */}
                <div
                  className={`
                    flex
                    h-[18px]
                    w-[18px]
                    items-center
                    justify-center
                    rounded-full
                    transition-all
                    ${
                      isSelected
                        ? 'bg-[#00897B] text-white shadow-xs'
                        : 'border border-[#D0D5DD] bg-white group-hover:border-[#98A2B3]'
                    }
                  `}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
