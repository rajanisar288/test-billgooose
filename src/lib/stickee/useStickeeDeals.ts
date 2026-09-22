'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchStickeeDeals, type FetchDealsParams } from './client';

import type { AnyStickeeDeal, AnyStickeeFacets, StickeeDealsResponse } from './types';

/* =========================================================
   TYPES
========================================================= */

export interface UseStickeeDealsOptions {
  vertical: FetchDealsParams['vertical'];
  filters?: Record<string, unknown>;
  fixed?: Record<string, unknown>;
  sort?: string;
  reverse?: boolean;
  page?: number;
  postcode?: string;
  uprn?: string;
  enabled?: boolean;
}

export interface UseStickeeDealsState {
  data: StickeeDealsResponse | null;
  deals: AnyStickeeDeal[];
  facets: AnyStickeeFacets | null;
  loading: boolean;
  isFetchingMore: boolean;
  error: string | null;
  hasMorePages: boolean;
  page: number;
  loadMore: () => void;
  resetPage: () => void;
}

/* =========================================================
   HOOK
========================================================= */

/**
 * Fetches Stickee deals for a given vertical, managing deal accumulation
 * for pagination (load more) and resetting when filters or sort change.
 */
export function useStickeeDeals({
  vertical,
  filters = {},
  fixed = {},
  sort = 'RECOMMENDED',
  reverse = false,
  page: controlledPage,
  postcode,
  uprn,
  enabled = true,
}: UseStickeeDealsOptions): UseStickeeDealsState {
  const [internalPage, setInternalPage] = useState(1);
  const activePage = controlledPage ?? internalPage;

  const [deals, setDeals] = useState<AnyStickeeDeal[]>([]);
  const [facets, setFacets] = useState<AnyStickeeFacets | null>(null);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [rawResponse, setRawResponse] = useState<StickeeDealsResponse | null>(null);

  const [loading, setLoading] = useState(enabled);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // Stable JSON strings as effect dependencies to avoid object-reference churn.
  const filtersKey = JSON.stringify(filters);
  const fixedKey = JSON.stringify(fixed);

  // Reset page to 1 whenever filters, sort, or vertical change
  const prevParamsRef = useRef({ vertical, filtersKey, fixedKey, sort, reverse, postcode, uprn });

  useEffect(() => {
    const prev = prevParamsRef.current;
    if (
      prev.vertical !== vertical ||
      prev.filtersKey !== filtersKey ||
      prev.fixedKey !== fixedKey ||
      prev.sort !== sort ||
      prev.reverse !== reverse ||
      prev.postcode !== postcode ||
      prev.uprn !== uprn
    ) {
      setInternalPage(1);
      prevParamsRef.current = { vertical, filtersKey, fixedKey, sort, reverse, postcode, uprn };
    }
  }, [vertical, filtersKey, fixedKey, sort, reverse, postcode, uprn]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!enabled || !vertical) {
      setLoading(false);
      return;
    }

    // Cancel any pending in-flight request
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const isFirstPage = activePage === 1;

    if (isFirstPage) {
      setLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    setError(null);

    fetchStickeeDeals({
      vertical,
      filters,
      fixed,
      sort,
      reverse,
      page: activePage,
      postcode,
      uprn,
      signal: ctrl.signal,
    })
      .then((data) => {
        setRawResponse(data);
        const incomingDeals = (data?.deals?.data as AnyStickeeDeal[]) || [];
        const incomingHasMore = Boolean(data?.deals?.paginatorInfo?.hasMorePages);

        if (isFirstPage) {
          setDeals(incomingDeals);
        } else {
          setDeals((prev) => [...prev, ...incomingDeals]);
        }

        if (data?.deal_filters) {
          setFacets(data.deal_filters);
        }

        setHasMorePages(incomingHasMore);
        setLoading(false);
        setIsFetchingMore(false);
        setError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Failed to fetch deals';
        setError(message);
        setLoading(false);
        setIsFetchingMore(false);
      });

    return () => {
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, vertical, filtersKey, fixedKey, sort, reverse, activePage, postcode, uprn]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const loadMore = useCallback(() => {
    if (!loading && !isFetchingMore && hasMorePages) {
      setInternalPage((p) => p + 1);
    }
  }, [loading, isFetchingMore, hasMorePages]);

  const resetPage = useCallback(() => {
    setInternalPage(1);
  }, []);

  return {
    data: rawResponse,
    deals,
    facets,
    loading,
    isFetchingMore,
    error,
    hasMorePages,
    page: activePage,
    loadMore,
    resetPage,
  };
}
