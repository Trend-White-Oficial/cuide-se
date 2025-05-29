import { useQuery, UseQueryOptions, QueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

const queryClient = new QueryClient();

interface QueryCacheOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheTime?: number;
  staleTime?: number;
}

export const useQueryCache = <T>(
  key: string[],
  url: string,
  options?: QueryCacheOptions<T>
) => {
  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<T>(url);
      return data;
    },
    cacheTime: options?.cacheTime || 1000 * 60 * 30, // 30 minutos
    staleTime: options?.staleTime || 1000 * 60 * 5, // 5 minutos
    ...options,
  });

  const getCachedData = (key: string) => {
    return queryClient.getQueryData(key);
  };

  const setCachedData = (key: string, data: T, ttl?: number) => {
    queryClient.setQueryData(key, data);
    if (ttl) {
      setTimeout(() => queryClient.removeQueries(key), ttl);
    }
  };

  const clearCache = () => {
    queryClient.clear();
  };

  return {
    ...query,
    getCachedData,
    setCachedData,
    clearCache,
  };
};