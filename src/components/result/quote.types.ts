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
  displayOrder: number;
  requiresSupplierAccountPassword: boolean;
  status: number | string;
  eligibilityCode: string | null;
  message: string | null;
  products?: QuoteProduct[];
  productGroups?: QuoteProductGroup[];
};

export type QuoteProductGroup = {
  groupType: string;
  displayName: string;
  selectionMode: 'single' | 'multiple' | string;
  totalProducts: number;
  products: QuoteProduct[];
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
  energy: unknown | null;
  broadband: unknown | null;
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

export function mapQuoteResponseToPlans(
  response: QuoteResponse,
  service: 'energy' | 'bundle-bills' = 'energy',
) {
  return response.suppliers
    .flatMap((supplier) => {
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
        const planName = [product.planName, product.variantName].filter(Boolean).join(' - ');

        return {
          id: `${supplier.supplierCode || supplier.supplierId}-${product.productReference}`,
          type: 'select-plan' as const,
          service,
          quoteId: response.quoteId,
          provider,
          description: product.description || planName || supplier.supplierName,
          logo: product.providerImageUrl || '/images/result-logo.png',
          logoAlt: `${provider} logo`,
          rating: '',
          contract,
          features: [...product.features, ...product.warnings],
          priceLabel: 'From',
          price: monthlyPrice,
          pricePeriod: '/month',
          saving: '',
          providerUrl: undefined,
          viewDetailsButton: 'View details',
          primaryButton: service === 'bundle-bills' ? 'Select bundle' : 'Select plan',
          annualPrice,
          paymentMethod: product.paymentMethod ?? product.rateType,
          supplierCode: supplier.supplierCode,
          productReference: product.productReference,
          productReferences: [product.productReference],
          groupType: group?.groupType ?? product.productType,
          groupDisplayName: group?.displayName ?? product.productType,
          selectionMode: group?.selectionMode ?? 'single',
          productType: product.productType,
          feeDetails: product.fees,
          priceIncreaseDetails: product.priceIncreases,
        };
      });
    })
    .sort((firstPlan, secondPlan) => parsePrice(firstPlan.price) - parsePrice(secondPlan.price));
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
