import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/services/api';

interface QueryCacheOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheTime?: number;
  staleTime?: number;
}

export const useQueryCache = <T>(
  key: string[],
  url: string,
  options?: QueryCacheOptions<T>
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<T>(url);
      return data;
    },
    cacheTime: options?.cacheTime || 1000 * 60 * 30, // 30 minutos
    staleTime: options?.staleTime || 1000 * 60 * 5, // 5 minutos
    ...options,
  });
}; 