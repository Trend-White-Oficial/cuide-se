import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_PREFIX } from '@env';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheOptions {
  ttl?: number; // Tempo de vida em segundos
  prefix?: string;
}

const defaultOptions: CacheOptions = {
  ttl: 3600, // 1 hora
  prefix: STORAGE_PREFIX || 'cuide-se',
};

export const cacheService = {
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    try {
      const mergedOptions = { ...defaultOptions, ...options };
      const prefixedKey = `${mergedOptions.prefix}:${key}`;
      const timestamp = Date.now();
      const expiresAt = timestamp + (mergedOptions.ttl! * 1000);

      const item: CacheItem<T> = {
        data,
        timestamp,
        expiresAt,
      };

      await AsyncStorage.setItem(prefixedKey, JSON.stringify(item));
    } catch (error) {
      console.error('Erro ao salvar no cache:', error);
      throw error;
    }
  },

  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      const mergedOptions = { ...defaultOptions, ...options };
      const prefixedKey = `${mergedOptions.prefix}:${key}`;

      const item = await AsyncStorage.getItem(prefixedKey);
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);

      // Verificar se o item expirou
      if (Date.now() > cacheItem.expiresAt) {
        await this.remove(key, options);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Erro ao ler do cache:', error);
      return null;
    }
  },

  async remove(key: string, options: CacheOptions = {}): Promise<void> {
    try {
      const mergedOptions = { ...defaultOptions, ...options };
      const prefixedKey = `${mergedOptions.prefix}:${key}`;

      await AsyncStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Erro ao remover do cache:', error);
      throw error;
    }
  },

  async clear(options: CacheOptions = {}): Promise<void> {
    try {
      const mergedOptions = { ...defaultOptions, ...options };
      const prefix = `${mergedOptions.prefix}:`;

      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => key.startsWith(prefix));

      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      throw error;
    }
  },

  async getKeys(options: CacheOptions = {}): Promise<string[]> {
    try {
      const mergedOptions = { ...defaultOptions, ...options };
      const prefix = `${mergedOptions.prefix}:`;

      const keys = await AsyncStorage.getAllKeys();
      return keys.filter(key => key.startsWith(prefix));
    } catch (error) {
      console.error('Erro ao listar chaves do cache:', error);
      return [];
    }
  },

  async getSize(options: CacheOptions = {}): Promise<number> {
    try {
      const mergedOptions = { ...defaultOptions, ...options };
      const prefix = `${mergedOptions.prefix}:`;

      const keys = await AsyncStorage.getAllKeys();
      const keysToCheck = keys.filter(key => key.startsWith(prefix));

      let totalSize = 0;
      for (const key of keysToCheck) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Erro ao calcular tamanho do cache:', error);
      return 0;
    }
  },
}; 