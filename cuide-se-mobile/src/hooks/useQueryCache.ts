import { useState, useCallback } from 'react';
import { useStorage } from './useStorage';

interface CacheOptions {
  ttl?: number; // Tempo de vida em milissegundos
  staleTime?: number; // Tempo em que os dados são considerados frescos
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

interface CacheState {
  [key: string]: CacheItem<any>;
}

export const useQueryCache = () => {
  const { getItem, setItem, removeItem } = useStorage();
  const [cache, setCache] = useState<CacheState>({});

  // Obtém um item do cache
  const getCacheItem = useCallback(
    async <T>(key: string): Promise<T | null> => {
      try {
        // Tenta obter do estado
        const cachedItem = cache[key];
        if (cachedItem) {
          if (cachedItem.expiresAt && Date.now() > cachedItem.expiresAt) {
            // Item expirado
            removeCacheItem(key);
            return null;
          }
          return cachedItem.data as T;
        }

        // Tenta obter do armazenamento
        const storedItem = await getItem<CacheItem<T>>(`@CuideSe:cache:${key}`);
        if (storedItem) {
          if (storedItem.expiresAt && Date.now() > storedItem.expiresAt) {
            // Item expirado
            removeCacheItem(key);
            return null;
          }
          // Atualiza o estado
          setCache(prev => ({ ...prev, [key]: storedItem }));
          return storedItem.data;
        }

        return null;
      } catch (error) {
        console.error('Erro ao obter item do cache:', error);
        return null;
      }
    },
    [cache, getItem, removeItem]
  );

  // Define um item no cache
  const setCacheItem = useCallback(
    async <T>(key: string, data: T, options?: CacheOptions): Promise<void> => {
      try {
        const now = Date.now();
        const item: CacheItem<T> = {
          data,
          timestamp: now,
          expiresAt: options?.ttl ? now + options.ttl : undefined,
        };

        // Atualiza o estado
        setCache(prev => ({ ...prev, [key]: item }));

        // Salva no armazenamento
        await setItem(`@CuideSe:cache:${key}`, item);
      } catch (error) {
        console.error('Erro ao definir item no cache:', error);
      }
    },
    [setItem]
  );

  // Remove um item do cache
  const removeCacheItem = useCallback(
    async (key: string): Promise<void> => {
      try {
        // Remove do estado
        setCache(prev => {
          const newCache = { ...prev };
          delete newCache[key];
          return newCache;
        });

        // Remove do armazenamento
        await removeItem(`@CuideSe:cache:${key}`);
      } catch (error) {
        console.error('Erro ao remover item do cache:', error);
      }
    },
    [removeItem]
  );

  // Limpa todo o cache
  const clearCache = useCallback(async (): Promise<void> => {
    try {
      // Limpa o estado
      setCache({});

      // Limpa o armazenamento
      const keys = await getItem<string[]>('@CuideSe:cache:keys');
      if (keys) {
        await Promise.all(keys.map(key => removeItem(`@CuideSe:cache:${key}`)));
        await removeItem('@CuideSe:cache:keys');
      }
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }, [getItem, removeItem]);

  // Verifica se um item está no cache
  const hasCacheItem = useCallback(
    async (key: string): Promise<boolean> => {
      try {
        const item = await getCacheItem(key);
        return item !== null;
      } catch (error) {
        console.error('Erro ao verificar item no cache:', error);
        return false;
      }
    },
    [getCacheItem]
  );

  // Verifica se um item está expirado
  const isCacheItemExpired = useCallback(
    async (key: string): Promise<boolean> => {
      try {
        const item = await getCacheItem(key);
        if (!item) return true;

        const cachedItem = cache[key];
        return cachedItem?.expiresAt ? Date.now() > cachedItem.expiresAt : false;
      } catch (error) {
        console.error('Erro ao verificar expiração do item:', error);
        return true;
      }
    },
    [cache, getCacheItem]
  );

  // Verifica se um item está obsoleto
  const isCacheItemStale = useCallback(
    async (key: string, staleTime?: number): Promise<boolean> => {
      try {
        const item = await getCacheItem(key);
        if (!item) return true;

        const cachedItem = cache[key];
        if (!cachedItem) return true;

        const staleTimeMs = staleTime || 0;
        return Date.now() - cachedItem.timestamp > staleTimeMs;
      } catch (error) {
        console.error('Erro ao verificar obsolescência do item:', error);
        return true;
      }
    },
    [cache, getCacheItem]
  );

  return {
    getCacheItem,
    setCacheItem,
    removeCacheItem,
    clearCache,
    hasCacheItem,
    isCacheItemExpired,
    isCacheItemStale,
  };
}; 