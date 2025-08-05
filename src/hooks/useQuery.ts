// src/hooks/useQuery.ts (Alternativa ligera a React Query)
import { useState, useEffect, useCallback } from 'react';
import { cacheService } from '../services/CacheService';

interface QueryOptions<T> {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface QueryResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

export function useQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: QueryOptions<T> = {}
): QueryResult<T> {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const {
    enabled = true,
    refetchOnMount = true,
    staleTime = 5 * 60 * 1000, // 5 minutos
    onSuccess,
    onError
  } = options;

  const isStale = Date.now() - lastFetch > staleTime;

  const refetch = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Intentar obtener del caché primero
      const cachedData = await cacheService.get<T>(key);
      if (cachedData && !isStale) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Obtener datos frescos
      const result = await queryFn();
      setData(result);
      setLastFetch(Date.now());
      
      // Guardar en caché
      await cacheService.set(key, result, staleTime);
      
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [key, queryFn, enabled, isStale, staleTime, onSuccess, onError]);

  useEffect(() => {
    if (enabled && (refetchOnMount || !data)) {
      refetch();
    }
  }, [enabled, refetchOnMount, refetch]);

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
  };
}