import { useEffect, useMemo, useState } from 'react';

import { journeyApi } from '@/lib/api/endpoints/journey.api';

export type ServiceField = {
  id: number;
  name: string;
  fieldKey: string;
  isVisible: boolean;
  isRequired: boolean;
  requiresQuoteRefreshOnChange: boolean;
  isActive: boolean;
};

export type ServiceFormGroup = {
  id: number;
  name: string;
  isActive: boolean;
  fields: ServiceField[];
};

export type ServiceTypeConfiguration = {
  id: number;
  name: string;
  formGroups?: ServiceFormGroup[];
};

export const SERVICE_TYPE_IDS: Record<string, number> = {
  energy: 1,
  broadband: 2,
  'sim-only': 3,
  simOnly: 3,
  mobile: 4,
  billPackage: 5,
  'bundle-bills': 5,
  insurance: 6,
};

const cache = new Map<number, ServiceTypeConfiguration | null>();
const pending = new Map<number, Promise<ServiceTypeConfiguration | null>>();

async function loadServiceFields(id: number) {
  if (cache.has(id)) return cache.get(id) ?? null;
  if (pending.has(id)) return pending.get(id)!;

  const request = journeyApi
    .getServiceTypeFields(id)
    .then((response) => (response.data?.serviceTypes?.[0] as ServiceTypeConfiguration) ?? null)
    .then((configuration) => {
      cache.set(id, configuration);
      pending.delete(id);
      return configuration;
    })
    .catch((error) => {
      pending.delete(id);
      throw error;
    });

  pending.set(id, request);
  return request;
}

export function useServiceFields(serviceType?: string | null) {
  const id = serviceType ? SERVICE_TYPE_IDS[serviceType] : undefined;
  const [configuration, setConfiguration] = useState<ServiceTypeConfiguration | null>(
    id ? (cache.get(id) ?? null) : null,
  );

  useEffect(() => {
    let active = true;
    if (!id) return;
    loadServiceFields(id)
      .then((value) => active && setConfiguration(value))
      .catch((error) => console.error('Failed to load service field configuration:', error));
    return () => {
      active = false;
    };
  }, [id]);

  const fields = useMemo(
    () =>
      new Map(
        (configuration?.formGroups ?? [])
          .filter((group) => group.isActive)
          .flatMap((group) => group.fields)
          .filter((field) => field.isActive)
          .map((field) => [field.fieldKey, field]),
      ),
    [configuration],
  );

  return {
    configuration,
    field: (fieldKey: string) => fields.get(fieldKey),
    isVisible: (fieldKey: string, fallback = true) => fields.get(fieldKey)?.isVisible ?? fallback,
    isRequired: (fieldKey: string, fallback = true) => {
      const configuredField = fields.get(fieldKey);
      return configuredField ? configuredField.isVisible && configuredField.isRequired : fallback;
    },
    requiresQuoteRefresh: (fieldKeys: string[]) =>
      configuration === null ||
      fieldKeys.some((key) => fields.get(key)?.requiresQuoteRefreshOnChange),
  };
}

export function serviceRequiresConsumption(config: any, serviceType: 'energy' | 'billPackage') {
  const suppliers = Array.isArray(config?.enabledSuppliers) ? config.enabledSuppliers : [];
  const matchingSuppliers = suppliers.filter((supplier: any) =>
    supplier?.supportedServices?.includes(serviceType),
  );

  if (matchingSuppliers.length > 0) {
    return matchingSuppliers.some((supplier: any) => supplier.requiresConsumption === true);
  }

  return config?.requiresConsumption === true;
}
