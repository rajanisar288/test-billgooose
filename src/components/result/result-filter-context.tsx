'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { ResultFilterState } from '@/components/result/result-filter.types';

const EMPTY_FILTERS: ResultFilterState = {
  values: {},
  onlyBillGoose: false,
  includeSupplier: false,
  networks: [],
  simValues: {},
};

type ResultFilterContextValue = {
  filters: ResultFilterState;
  setFilters: (filters: ResultFilterState) => void;
  resetFilters: () => void;
};

const ResultFilterContext = createContext<ResultFilterContextValue | null>(null);

export function ResultFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ResultFilterState>(EMPTY_FILTERS);
  const value = useMemo(
    () => ({ filters, setFilters, resetFilters: () => setFilters(EMPTY_FILTERS) }),
    [filters],
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
