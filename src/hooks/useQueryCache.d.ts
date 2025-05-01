import { UseQueryOptions } from '@tanstack/react-query';
interface QueryCacheOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
    cacheTime?: number;
    staleTime?: number;
}
export declare const useQueryCache: <T>(key: string[], url: string, options?: QueryCacheOptions<T>) => import("@tanstack/react-query").UseQueryResult<T, Error>;
export {};
