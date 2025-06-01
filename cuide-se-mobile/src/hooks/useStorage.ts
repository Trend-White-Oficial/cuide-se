import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDevice } from './useDevice';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';

interface StorageOptions {
  encrypt?: boolean;
  compress?: boolean;
  ttl?: number; // Tempo de vida em milissegundos
}

interface StorageItem<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

interface StorageState {
  loading: boolean;
  error: string | null;
}

export const useStorage = () => {
  const { deviceState } = useDevice();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();
  const [state, setState] = useState<StorageState>({
    loading: false,
    error: null,
  });

  // Obtém um item do armazenamento
  const getItem = useCallback(
    async <T>(key: string, options?: StorageOptions): Promise<T | null> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const item = await AsyncStorage.getItem(`@CuideSe:${key}`);
        if (!item) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: null,
          }));
          return null;
        }

        const storageItem: StorageItem<T> = JSON.parse(item);

        // Verifica se o item expirou
        if (storageItem.expiresAt && Date.now() > storageItem.expiresAt) {
          await AsyncStorage.removeItem(`@CuideSe:${key}`);
          setState(prev => ({
            ...prev,
            loading: false,
            error: null,
          }));
          return null;
        }

        // Registra o evento
        await logEvent('storage_read', {
          key,
          size: item.length,
          has_encryption: options?.encrypt || false,
          has_compression: options?.compress || false,
          has_ttl: !!storageItem.expiresAt,
        });

        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
        }));

        return storageItem.data;
      } catch (error) {
        console.error(`Erro ao obter item ${key}:`, error);
        recordError(error instanceof Error ? error : new Error(`Erro ao obter item ${key}`));
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao obter item',
        }));
        return null;
      }
    },
    [logEvent, recordError]
  );

  // Define um item no armazenamento
  const setItem = useCallback(
    async <T>(key: string, value: T, options?: StorageOptions): Promise<void> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const item: StorageItem<T> = {
          data: value,
          timestamp: Date.now(),
          expiresAt: options?.ttl ? Date.now() + options.ttl : undefined,
        };

        await AsyncStorage.setItem(`@CuideSe:${key}`, JSON.stringify(item));

        // Registra o evento
        await logEvent('storage_write', {
          key,
          size: JSON.stringify(item).length,
          has_encryption: options?.encrypt || false,
          has_compression: options?.compress || false,
          has_ttl: !!item.expiresAt,
        });

        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
        }));
      } catch (error) {
        console.error(`Erro ao definir item ${key}:`, error);
        recordError(error instanceof Error ? error : new Error(`Erro ao definir item ${key}`));
        showToast({
          type: 'error',
          message: 'Erro ao salvar dados',
          description: 'Tente novamente mais tarde',
        });
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao salvar item',
        }));
      }
    },
    [logEvent, recordError, showToast]
  );

  // Remove um item do armazenamento
  const removeItem = useCallback(
    async (key: string): Promise<void> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        await AsyncStorage.removeItem(`@CuideSe:${key}`);

        // Registra o evento
        await logEvent('storage_delete', {
          key,
        });

        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
        }));
      } catch (error) {
        console.error(`Erro ao remover item ${key}:`, error);
        recordError(error instanceof Error ? error : new Error(`Erro ao remover item ${key}`));
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao remover item',
        }));
      }
    },
    [logEvent, recordError]
  );

  // Limpa todo o armazenamento
  const clear = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('@CuideSe:'));
      await AsyncStorage.multiRemove(appKeys);

      // Registra o evento
      await logEvent('storage_clear', {
        keys_removed: appKeys.length,
      });

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Erro ao limpar armazenamento:', error);
      recordError(error instanceof Error ? error : new Error('Erro ao limpar armazenamento'));
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao limpar armazenamento',
      }));
    }
  }, [logEvent, recordError]);

  // Obtém o tamanho do armazenamento
  const getSize = useCallback(async (): Promise<number> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('@CuideSe:'));
      let totalSize = 0;

      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Erro ao obter tamanho do armazenamento:', error);
      recordError(error instanceof Error ? error : new Error('Erro ao obter tamanho do armazenamento'));
      return 0;
    }
  }, [recordError]);

  // Verifica se um item existe
  const hasItem = useCallback(
    async (key: string): Promise<boolean> => {
      try {
        const item = await AsyncStorage.getItem(`@CuideSe:${key}`);
        return item !== null;
      } catch (error) {
        console.error(`Erro ao verificar item ${key}:`, error);
        recordError(error instanceof Error ? error : new Error(`Erro ao verificar item ${key}`));
        return false;
      }
    },
    [recordError]
  );

  // Obtém todas as chaves
  const getAllKeys = useCallback(async (): Promise<string[]> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const keys = await AsyncStorage.getAllKeys();

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));

      return keys;
    } catch (error) {
      console.error('Erro ao obter chaves:', error);
      recordError(error instanceof Error ? error : new Error('Erro ao obter chaves'));
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao obter chaves',
      }));
      return [];
    }
  }, [recordError]);

  // Obtém múltiplos itens
  const multiGet = useCallback(
    async <T>(keys: string[]): Promise<[string, T | null][]> => {
      try {
        const prefixedKeys = keys.map(key => `@CuideSe:${key}`);
        const items = await AsyncStorage.multiGet(prefixedKeys);
        return items.map(([key, value]) => [
          key.replace('@CuideSe:', ''),
          value ? JSON.parse(value).data : null,
        ]);
      } catch (error) {
        console.error('Erro ao obter múltiplos itens:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao obter múltiplos itens'));
        return keys.map(key => [key, null]);
      }
    },
    [recordError]
  );

  // Define múltiplos itens
  const multiSet = useCallback(
    async <T>(items: [string, T][], options?: StorageOptions): Promise<void> => {
      try {
        const storageItems = items.map(([key, value]) => [
          `@CuideSe:${key}`,
          JSON.stringify({
            data: value,
            timestamp: Date.now(),
            expiresAt: options?.ttl ? Date.now() + options.ttl : undefined,
          }),
        ]);

        await AsyncStorage.multiSet(storageItems);

        // Registra o evento
        await logEvent('storage_multi_write', {
          items_count: items.length,
          has_encryption: options?.encrypt || false,
          has_compression: options?.compress || false,
          has_ttl: !!options?.ttl,
        });
      } catch (error) {
        console.error('Erro ao definir múltiplos itens:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao definir múltiplos itens'));
        showToast({
          type: 'error',
          message: 'Erro ao salvar dados',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [logEvent, recordError, showToast]
  );

  // Remove múltiplos itens
  const multiRemove = useCallback(
    async (keys: string[]): Promise<void> => {
      try {
        const prefixedKeys = keys.map(key => `@CuideSe:${key}`);
        await AsyncStorage.multiRemove(prefixedKeys);

        // Registra o evento
        await logEvent('storage_multi_delete', {
          keys_count: keys.length,
        });
      } catch (error) {
        console.error('Erro ao remover múltiplos itens:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao remover múltiplos itens'));
      }
    },
    [logEvent, recordError]
  );

  return {
    ...state,
    getItem,
    setItem,
    removeItem,
    clear,
    getSize,
    hasItem,
    getAllKeys,
    multiGet,
    multiSet,
    multiRemove,
  };
}; 