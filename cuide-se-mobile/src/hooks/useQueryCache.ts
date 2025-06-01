import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  key: string;
  ttl?: number; // Time to live in milliseconds
}

export const useQueryCache = <T>({ key, ttl = 5 * 60 * 1000 }: CacheConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCacheKey = useCallback(() => {
    return `@CuideSe:cache:${key}`;
  }, [key]);

  const getCachedData = useCallback(async (): Promise<T | null> => {
    try {
      const cachedData = await AsyncStorage.getItem(getCacheKey());
      if (!cachedData) return null;

      const { data, timestamp }: CacheItem<T> = JSON.parse(cachedData);
      const now = Date.now();

      if (ttl && now - timestamp > ttl) {
        await AsyncStorage.removeItem(getCacheKey());
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao recuperar cache:', error);
      return null;
    }
  }, [getCacheKey, ttl]);

  const setCachedData = useCallback(async (newData: T) => {
    try {
      const cacheItem: CacheItem<T> = {
        data: newData,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(getCacheKey(), JSON.stringify(cacheItem));
      setData(newData);
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }, [getCacheKey]);

  const clearCache = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(getCacheKey());
      setData(null);
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }, [getCacheKey]);

  const fetchData = useCallback(async (fetcher: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Tenta recuperar do cache primeiro
      const cachedData = await getCachedData();
      if (cachedData) {
        setData(cachedData);
        setIsLoading(false);
        return;
      }

      // Se não houver cache, faz a requisição
      const newData = await fetcher();
      await setCachedData(newData);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  }, [getCachedData, setCachedData]);

  useEffect(() => {
    // Limpa o cache quando o componente é desmontado
    return () => {
      clearCache();
    };
  }, [clearCache]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    clearCache,
  };
}; 