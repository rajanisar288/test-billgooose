import type { BundleSupplierData } from '@/components/result/bundle-plan-card';
import type { StandardPlan } from '@/components/result/plan.types';
import { resolveFallbackProviderLogo } from '@/components/result/quote.types';

/* =========================================================
   CANONICAL ORDERING & HELPERS
========================================================= */

const SERVICE_CANONICAL_ORDER = ['energy', 'broadband', 'water', 'tv'];

function getServiceOrderIndex(type: string): number {
  const index = SERVICE_CANONICAL_ORDER.findIndex((canonical) =>
    type.toLowerCase().includes(canonical),
  );
  return index === -1 ? 999 : index;
}

function parsePlanPrice(value?: string): number {
  if (!value) return Number.POSITIVE_INFINITY;
  const parsed = Number(value.replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
}

/* =========================================================
   GROUP PLANS INTO BUNDLE SUPPLIERS
========================================================= */

export function groupPlansIntoBundleSuppliers(plans: StandardPlan[]): BundleSupplierData[] {
  const supplierMap = new Map<string, BundleSupplierData>();

  plans.forEach((plan) => {
    const supplierCode = plan.supplierCode || plan.supplierName || 'supplier';
    const supplierName = plan.supplierName || plan.provider || 'Supplier';

    if (!supplierMap.has(supplierCode)) {
      const isUW =
        supplierCode.toLowerCase().includes('uw') ||
        supplierName.toLowerCase().includes('warehouse');

      supplierMap.set(supplierCode, {
        supplierCode,
        supplierName,
        imageUrl:
          plan.logo && !plan.logo.includes('result-logo.png') && !plan.logo.includes('uw-provider')
            ? plan.logo
            : null,
        servicesIncluded: [],
        badges: isUW ? [] : ['24/7 chat support', 'Smart meter required'],
        promoText: isUW ? "By bundling two services you'll get extras discount" : null,
        serviceGroups: [],
      });
    }

    const supplier = supplierMap.get(supplierCode)!;
    const groupType = (plan.groupType || plan.productType || 'energy').toLowerCase();
    const displayName =
      plan.groupDisplayName || groupType.charAt(0).toUpperCase() + groupType.slice(1);

    if (!supplier.servicesIncluded.includes(displayName)) {
      supplier.servicesIncluded.push(displayName);
    }

    let group = supplier.serviceGroups.find((g) => g.groupType.toLowerCase() === groupType);
    if (!group) {
      const isEnergy = groupType.includes('energy');
      const resolvedLogo = resolveFallbackProviderLogo(plan.provider, groupType);

      group = {
        groupType,
        displayName,
        // Only show provider name in header if it's Energy and distinct from supplier name
        providerName:
          isEnergy && plan.provider && plan.provider.toLowerCase() !== supplierName.toLowerCase()
            ? plan.provider
            : undefined,
        providerLogo: isEnergy
          ? plan.logo && !plan.logo.includes('result-logo.png')
            ? plan.logo
            : resolvedLogo
          : undefined,
        products: [],
      };
      supplier.serviceGroups.push(group);
    }

    // Ensure broadband products have logo if known
    if (groupType.includes('broadband') && (!plan.logo || plan.logo.includes('result-logo.png'))) {
      const resolvedLogo = resolveFallbackProviderLogo(plan.provider, groupType);
      if (resolvedLogo) {
        plan.logo = resolvedLogo;
      }
    }

    group.products.push(plan);
  });

  // Sort groups canonically and products by price
  const suppliers = Array.from(supplierMap.values());
  suppliers.forEach((supplier) => {
    supplier.servicesIncluded.sort((a, b) => getServiceOrderIndex(a) - getServiceOrderIndex(b));
    supplier.serviceGroups.sort(
      (a, b) => getServiceOrderIndex(a.groupType) - getServiceOrderIndex(b.groupType),
    );
    supplier.serviceGroups.forEach((group) => {
      group.products.sort((a, b) => parsePlanPrice(a.price) - parsePlanPrice(b.price));
    });
  });

  return suppliers;
}

/* =========================================================
   MOCK BUNDLE SUPPLIERS (MATCHING media_1789714138353.png)
========================================================= */

export function getMockBundleSuppliers(): BundleSupplierData[] {
  return [
    {
      supplierCode: 'huddle',
      supplierName: 'Huddle',
      imageUrl: null,
      servicesIncluded: ['Energy', 'Broadband', 'Water', 'TV'],
      badges: ['24/7 chat support', 'Smart meter required'],
      promoText: null,
      serviceGroups: [
        {
          groupType: 'energy',
          displayName: 'Energy',
          providerName: 'truenergy',
          providerLogo: '/images/card-4-provider.png',
          products: [
            {
              id: 'huddle-energy-variable',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'truenergy',
              supplierName: 'Huddle',
              supplierCode: 'huddle',
              planName: 'Variable',
              description: 'Variable rate Dual Fuel tariff with smart meter support',
              logo: '/images/card-4-provider.png',
              logoAlt: 'truenergy logo',
              rating: '4.5',
              contract: '12 months',
              features: ['Variable rate', 'Dual fuel', 'Smart meter required', '24/7 chat support'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'energy',
              groupDisplayName: 'Energy',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
            {
              id: 'huddle-energy-tracker',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'truenergy',
              supplierName: 'Huddle',
              supplierCode: 'huddle',
              planName: 'Tracker',
              description: 'Tracker rate Dual Fuel tariff aligned with wholesale energy prices',
              logo: '/images/card-4-provider.png',
              logoAlt: 'truenergy logo',
              rating: '4.5',
              contract: '12 months',
              features: ['Tracker rate', 'Dual fuel', 'Wholesale aligned'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'energy',
              groupDisplayName: 'Energy',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
            {
              id: 'huddle-energy-fixed',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'truenergy',
              supplierName: 'Huddle',
              supplierCode: 'huddle',
              planName: 'Fixed',
              description: 'Fixed rate 12 month tariff with full price protection',
              logo: '/images/card-4-provider.png',
              logoAlt: 'truenergy logo',
              rating: '4.5',
              contract: '12 months',
              features: ['Fixed rate for 12 months', 'Dual fuel', 'Price lock protection'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'energy',
              groupDisplayName: 'Energy',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
          ],
        },
        {
          groupType: 'broadband',
          displayName: 'Broadband',
          providerName: 'Virgin Media',
          providerLogo: '/images/broadband-results (6).png',
          products: [
            {
              id: 'huddle-broadband-500',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Virgin Media',
              supplierName: 'Huddle',
              supplierCode: 'huddle',
              planName: 'Virgin Media',
              averageSpeed: '500 Mbps',
              description: 'M500 Ultrafast Fibre Broadband with WiFi Hub',
              logo: '/images/broadband-results (6).png',
              logoAlt: 'Virgin Media logo',
              rating: '4.4',
              contract: '12 months',
              features: ['500 Mbps download speed', 'Unlimited downloads', 'WiFi Hub included'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'broadband',
              groupDisplayName: 'Broadband',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
            {
              id: 'huddle-broadband-1g-1',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Virgin Media',
              supplierName: 'Huddle',
              supplierCode: 'huddle',
              planName: 'Virgin Media',
              averageSpeed: '1 Gbps',
              description: 'Gig1 Fibre Broadband with fastest download speeds',
              logo: '/images/broadband-results (6).png',
              logoAlt: 'Virgin Media logo',
              rating: '4.4',
              contract: '12 months',
              features: ['1 Gbps download speed', 'WiFi 6 Hub included', 'No setup fee'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'broadband',
              groupDisplayName: 'Broadband',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
            {
              id: 'huddle-broadband-1g-2',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Virgin Media',
              supplierName: 'Huddle',
              supplierCode: 'huddle',
              planName: 'Virgin Media',
              averageSpeed: '1 Gbps',
              description: 'Gig1 Fibre Broadband with intelligent WiFi Guarantee',
              logo: '/images/broadband-results (6).png',
              logoAlt: 'Virgin Media logo',
              rating: '4.4',
              contract: '12 months',
              features: ['1 Gbps download speed', 'WiFi pods included', 'Whole home guarantee'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'broadband',
              groupDisplayName: 'Broadband',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
          ],
        },
        {
          groupType: 'water',
          displayName: 'Water',
          providerName: 'Water',
          products: [
            {
              id: 'huddle-water-standard',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Water',
              supplierName: 'Huddle',
              supplierCode: 'huddle',
              planName: 'Water',
              description: 'Standard residential clean and wastewater supply',
              logo: '/images/result-logo.png',
              logoAlt: 'Water logo',
              rating: '4.2',
              contract: '12 months',
              features: ['Standard supply', 'Direct debit management', 'Consolidated billing'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'water',
              groupDisplayName: 'Water',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
          ],
        },
        {
          groupType: 'tv',
          displayName: 'TV',
          providerName: 'BT',
          products: [
            {
              id: 'huddle-tv-standard',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'BT',
              supplierName: 'Huddle',
              supplierCode: 'huddle',
              planName: 'BT',
              description: 'Entertainment TV package with Freeview and premium channels',
              logo: '/images/sim-only-provider.png',
              logoAlt: 'BT logo',
              rating: '4.3',
              contract: '12 months',
              features: ['Entertainment channels', 'Recordable TV Box', 'App integration'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'tv',
              groupDisplayName: 'TV',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
          ],
        },
      ],
    },
    {
      supplierCode: 'uw',
      supplierName: 'Warehouse Utility',
      imageUrl: null,
      servicesIncluded: ['Energy', 'Broadband', 'Water', 'TV'],
      badges: [],
      promoText: "By bundling two services you'll get extras discount",
      serviceGroups: [
        {
          groupType: 'energy',
          displayName: 'Energy',
          providerName: 'Utility Warehouse',
          providerLogo: '/images/uw-provider.png',
          products: [
            {
              id: 'uw-energy-variable',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Utility Warehouse',
              supplierName: 'Warehouse Utility',
              supplierCode: 'uw',
              planName: 'Variable',
              description: 'Variable rate Dual Fuel bundle tariff',
              logo: '/images/uw-provider.png',
              logoAlt: 'Utility Warehouse logo',
              rating: '4.6',
              contract: '12 months',
              features: ['Variable rate', 'Dual fuel', 'Bundle discount eligible'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'energy',
              groupDisplayName: 'Energy',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
            {
              id: 'uw-energy-tracker',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Utility Warehouse',
              supplierName: 'Warehouse Utility',
              supplierCode: 'uw',
              planName: 'Tracker',
              description: 'Tracker rate Dual Fuel bundle tariff',
              logo: '/images/uw-provider.png',
              logoAlt: 'Utility Warehouse logo',
              rating: '4.6',
              contract: '12 months',
              features: ['Tracker rate', 'Dual fuel', 'Wholesale tracking'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'energy',
              groupDisplayName: 'Energy',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
            {
              id: 'uw-energy-fixed',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Utility Warehouse',
              supplierName: 'Warehouse Utility',
              supplierCode: 'uw',
              planName: 'Fixed',
              description: 'Fixed rate 12 month tariff with bundle savings',
              logo: '/images/uw-provider.png',
              logoAlt: 'Utility Warehouse logo',
              rating: '4.6',
              contract: '12 months',
              features: ['Fixed rate for 12 months', 'Dual fuel', 'Price guarantee'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'energy',
              groupDisplayName: 'Energy',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
          ],
        },
        {
          groupType: 'broadband',
          displayName: 'Broadband',
          providerName: 'Virgin Media',
          providerLogo: '/images/broadband-results (6).png',
          products: [
            {
              id: 'uw-broadband-500',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Virgin Media',
              supplierName: 'Warehouse Utility',
              supplierCode: 'uw',
              planName: 'Virgin Media',
              averageSpeed: '500 Mbps',
              description: 'M500 Ultrafast Fibre Broadband with bundle rate',
              logo: '/images/broadband-results (6).png',
              logoAlt: 'Virgin Media logo',
              rating: '4.4',
              contract: '12 months',
              features: ['500 Mbps download speed', 'Unlimited downloads', 'WiFi Hub included'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'broadband',
              groupDisplayName: 'Broadband',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
            {
              id: 'uw-broadband-1g-1',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Virgin Media',
              supplierName: 'Warehouse Utility',
              supplierCode: 'uw',
              planName: 'Virgin Media',
              averageSpeed: '1 Gbps',
              description: 'Gig1 Fibre Broadband with bundle pricing',
              logo: '/images/broadband-results (6).png',
              logoAlt: 'Virgin Media logo',
              rating: '4.4',
              contract: '12 months',
              features: ['1 Gbps download speed', 'WiFi 6 Hub included', 'No setup fee'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'broadband',
              groupDisplayName: 'Broadband',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
            {
              id: 'uw-broadband-1g-2',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Virgin Media',
              supplierName: 'Warehouse Utility',
              supplierCode: 'uw',
              planName: 'Virgin Media',
              averageSpeed: '1 Gbps',
              description: 'Gig1 Fibre Broadband Pro bundle',
              logo: '/images/broadband-results (6).png',
              logoAlt: 'Virgin Media logo',
              rating: '4.4',
              contract: '12 months',
              features: ['1 Gbps download speed', 'WiFi pods included', 'Whole home guarantee'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'broadband',
              groupDisplayName: 'Broadband',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
          ],
        },
        {
          groupType: 'water',
          displayName: 'Water',
          providerName: 'Water',
          products: [
            {
              id: 'uw-water-standard',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'Water',
              supplierName: 'Warehouse Utility',
              supplierCode: 'uw',
              planName: 'Water',
              description: 'Standard residential clean and wastewater supply',
              logo: '/images/result-logo.png',
              logoAlt: 'Water logo',
              rating: '4.2',
              contract: '12 months',
              features: ['Standard supply', 'Consolidated billing'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'water',
              groupDisplayName: 'Water',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
          ],
        },
        {
          groupType: 'tv',
          displayName: 'TV',
          providerName: 'BT',
          products: [
            {
              id: 'uw-tv-standard',
              type: 'select-plan',
              service: 'bundle-bills',
              provider: 'BT',
              supplierName: 'Warehouse Utility',
              supplierCode: 'uw',
              planName: 'BT',
              description: 'Entertainment TV package with BT box and Freeview',
              logo: '/images/sim-only-provider.png',
              logoAlt: 'BT logo',
              rating: '4.3',
              contract: '12 months',
              features: ['Entertainment channels', 'Recordable TV Box'],
              priceLabel: 'Bundle rate',
              price: '£151.46',
              pricePeriod: '/month',
              saving: '',
              groupType: 'tv',
              groupDisplayName: 'TV',
              selectionMode: 'single',
              viewDetailsButton: 'View Details',
              primaryButton: 'Select Bundle',
            },
          ],
        },
      ],
    },
  ];
}
