export type QuoteResponse = {
  quoteId: string;
  journeyId: string;
  serviceType: number | string;
  status: number | string;
  generatedAtUtc: string;
  totalSuppliers: number;
  totalProducts: number;
  suppliers: QuoteSupplier[];
};

export type QuoteSupplier = {
  supplierId: number | string;
  supplierCode: string;
  supplierName: string;
  imageUrl?: string | null;
  displayOrder: number;
  requiresSupplierAccountPassword: boolean;
  status: number | string;
  eligibilityCode: string | null;
  message: string | null;
  bundlePricing?: unknown | null;
  products?: QuoteProduct[];
  productGroups?: QuoteProductGroup[];
};

export type QuoteProductGroup = {
  groupType: string;
  displayName: string;
  providerName?: string | null;
  providerImageUrl?: string | null;
  selectionMode: 'single' | 'multiple' | string;
  totalProducts: number;
  products: QuoteProduct[];
};

export type FuelPricingDetails = {
  pricingUsageKwh?: number | null;
  unitRatePencePerKwh?: number | null;
  secondaryUnitRatePencePerKwh?: number | null;
  dayRatePencePerKwh?: number | null;
  nightRatePencePerKwh?: number | null;
  standingChargePencePerDay?: number | null;
  annualCost?: number | null;
  fees?: QuoteFee[];
  priceIncreases?: QuotePriceIncrease[];
};

export type QuoteEnergy = {
  isEconomy7?: boolean;
  electricity?: FuelPricingDetails | null;
  gas?: FuelPricingDetails | null;
};

export type QuoteBroadband = {
  downloadSpeedMbps?: number | null;
  uploadSpeedMbps?: number | null;
  speedUnit?: string | null;
  [key: string]: unknown;
};

export type QuoteProduct = {
  productReference: string;
  action: number | string;
  productType: string;
  providerName: string | null;
  providerImageUrl: string | null;
  planName: string;
  variantName: string | null;
  description: string | null;
  rateType: string | null;
  paymentMethod: string | null;
  contractLengthMonths: number;
  weeklyCost: number;
  monthlyCost: number;
  annualCost: number;
  currency: string;
  features: string[];
  warnings: string[];
  fees: QuoteFee[];
  priceIncreases: QuotePriceIncrease[];
  energy: QuoteEnergy | null;
  broadband: QuoteBroadband | null;
};

export type QuoteFee = {
  name: string;
  type: string;
  description: string;
  amount: number;
  currency: string;
  isUpfrontCost: boolean;
};

export type QuotePriceIncrease = {
  description: string;
  effectiveFromUtc: string;
  amountIncrease: number;
  percentageIncrease: number;
  currency: string;
};

export function resolveFallbackProviderLogo(
  providerName?: string | null,
  _groupType?: string,
): string | undefined {
  const name = (providerName || '').toLowerCase();
  if (name.includes('truenergy') || name.includes('tru energy')) {
    return '/images/card-4-provider.png';
  }
  if (name.includes('virgin')) {
    return '/images/broadband-results (6).png';
  }
  if (name.includes('utility warehouse') || name.includes('uw')) {
    return '/images/card-8-9-10-provider.png';
  }
  if (name.includes('bt')) {
    return '/images/sim-only-provider.png';
  }
  return undefined;
}

export function mapQuoteResponseToPlans(
  response: QuoteResponse,
  service: 'energy' | 'bundle-bills' = 'energy',
) {
  const plans = response.suppliers.flatMap((supplier) => {
    const groupedProducts = supplier.productGroups?.flatMap((group) =>
      group.products.map((product) => ({ product, group })),
    );
    const products =
      groupedProducts ??
      (supplier.products ?? []).map((product) => ({ product, group: undefined }));

    return products.map(({ product, group }) => {
      const monthlyPrice = formatCurrency(product.monthlyCost, product.currency);
      const annualPrice = formatCurrency(product.annualCost, product.currency);
      const contract = formatContractLength(product.contractLengthMonths);
      const provider = product.providerName || supplier.supplierName;
      const planName =
        [product.planName, product.variantName].filter(Boolean).join(' - ') ||
        product.planName ||
        provider;
      const groupProviderImageUrl = group?.providerImageUrl || null;
      const groupProviderName = group?.providerName || null;
      const supplierImageUrl = supplier.imageUrl || null;
      const productLogo = product.providerImageUrl || '';
      const fallbackLogo = resolveFallbackProviderLogo(
        product.providerName,
        group?.groupType ?? product.productType,
      );
      const supplierLogo =
        service === 'bundle-bills'
          ? productLogo
          : supplier.imageUrl ||
            product.providerImageUrl ||
            fallbackLogo ||
            '/images/result-logo.png';
      const broadbandObj = product.broadband as QuoteBroadband | null;
      const averageSpeed = broadbandObj?.downloadSpeedMbps
        ? `${broadbandObj.downloadSpeedMbps} Mbps`
        : undefined;

      return {
        id: `${supplier.supplierCode || supplier.supplierId}-${product.productReference}`,
        type: 'select-plan' as const,
        service,
        quoteId: response.quoteId,
        provider,
        supplierName: supplier.supplierName,
        planName,
        description: product.description || '',
        logo: supplierLogo,
        logoAlt: `${provider} logo`,
        rating: '',
        contract,
        features: [...product.features, ...product.warnings],
        priceLabel: 'From',
        price: monthlyPrice,
        pricePeriod: '/month',
        saving: '',
        averageSpeed,
        broadband: product.broadband,
        providerUrl: undefined,
        viewDetailsButton: 'View details',
        primaryButton: service === 'bundle-bills' ? 'Select bundle' : 'Select plan',
        annualPrice,
        paymentMethod: product.paymentMethod ?? product.rateType,
        rateType: product.rateType ?? undefined,
        action: String(product.action),
        supplierCode: supplier.supplierCode,
        productReference: product.productReference,
        productReferences: [product.productReference],
        groupType: group?.groupType ?? product.productType,
        groupDisplayName: group?.displayName ?? product.productType,
        groupProviderName,
        groupProviderImageUrl,
        supplierImageUrl,
        selectionMode: group?.selectionMode ?? 'single',
        productType: product.productType,
        feeDetails: product.fees,
        priceIncreaseDetails: product.priceIncreases,
        energy: product.energy,
      };
    });
  });

  if (service === 'bundle-bills') {
    return plans;
  }

  return plans.sort(
    (firstPlan, secondPlan) => parsePrice(firstPlan.price) - parsePrice(secondPlan.price),
  );
}

function formatCurrency(value: number, currency: string): string {
  if (!Number.isFinite(value)) {
    return '-';
  }

  const symbol =
    currency.toUpperCase() === 'GBP' || currency.toUpperCase() === '£' ? '£' : currency;

  return `${symbol}${value.toFixed(2)}`;
}

function formatContractLength(months: number): string {
  if (!months || months < 1) {
    return 'No contract';
  }

  return `${months} month${months === 1 ? '' : 's'}`;
}

function parsePrice(value: string): number {
  const parsed = Number(value.replace(/[^\d.-]/g, ''));

  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
}
