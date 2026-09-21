'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { ResultFilterState } from '@/components/result/result-filter.types';
import type { AnyStickeeFacets } from '@/lib/stickee/types';

const EMPTY_FILTERS: ResultFilterState = {
  values: {},
  onlyBillGoose: false,
  includeSupplier: false,
  networks: [],
  simValues: {},
  stickeeFilters: {},
};

type ResultFilterContextValue = {
  filters: ResultFilterState;
  setFilters: (filters: ResultFilterState) => void;
  resetFilters: () => void;
  stickeeFacets: AnyStickeeFacets | null;
  setStickeeFacets: (facets: AnyStickeeFacets | null) => void;
  sortKey: string;
  setSortKey: (sort: string) => void;
};

const ResultFilterContext = createContext<ResultFilterContextValue | null>(null);

export function ResultFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ResultFilterState>(EMPTY_FILTERS);
  const [stickeeFacets, setStickeeFacets] = useState<AnyStickeeFacets | null>(null);
  const [sortKey, setSortKey] = useState<string>('RECOMMENDED');

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters: () => setFilters(EMPTY_FILTERS),
      stickeeFacets,
      setStickeeFacets,
      sortKey,
      setSortKey,
    }),
    [filters, stickeeFacets, sortKey],
  );

  return <ResultFilterContext.Provider value={value}>{children}</ResultFilterContext.Provider>;
}

export function useResultFilters(): ResultFilterContextValue {
  const context = useContext(ResultFilterContext);

  if (!context) {
    throw new Error('useResultFilters must be used inside ResultFilterProvider');
  }

  return context;
}
