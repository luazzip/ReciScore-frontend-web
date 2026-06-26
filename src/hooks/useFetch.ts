import { useEffect, useState, useCallback, useReducer } from 'react';
import type { ApiError } from '../types/api.types';

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

type Action<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: ApiError };

function fetchReducer<T>(state: UseFetchState<T>, action: Action<T>): UseFetchState<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, isLoading: false, error: null };
    case 'FETCH_ERROR':
      return { data: null, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = []
) {
  const [state, dispatch] = useReducer(fetchReducer<T>, {
    data: null,
    isLoading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'FETCH_START' });
    fetcher(controller.signal)
      .then((data) => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch((error: ApiError) => {
        if (controller.signal.aborted) return;
        dispatch({ type: 'FETCH_ERROR', payload: error });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  return { ...state, refetch };
}
