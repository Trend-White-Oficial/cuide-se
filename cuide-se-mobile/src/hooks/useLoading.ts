import { useState, useCallback } from 'react';

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  // Define o estado de carregamento
  const setLoadingState = useCallback((state: boolean) => {
    setLoading(state);
  }, []);

  // Executa uma função com estado de carregamento
  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      const result = await fn();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  // Executa múltiplas funções com estado de carregamento
  const withLoadingAll = useCallback(async <T>(fns: (() => Promise<T>)[]): Promise<T[]> => {
    try {
      setLoading(true);
      const results = await Promise.all(fns.map(fn => fn()));
      return results;
    } finally {
      setLoading(false);
    }
  }, []);

  // Executa uma função com estado de carregamento e retorna um valor padrão em caso de erro
  const withLoadingFallback = useCallback(async <T>(
    fn: () => Promise<T>,
    fallback: T
  ): Promise<T> => {
    try {
      setLoading(true);
      const result = await fn();
      return result;
    } catch (error) {
      console.error('Erro durante operação:', error);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, []);

  // Executa uma função com estado de carregamento e retorna um valor padrão em caso de erro
  const withLoadingRetry = useCallback(async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        setLoading(true);
        const result = await fn();
        return result;
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      } finally {
        setLoading(false);
      }
    }

    throw new Error('Número máximo de tentativas excedido');
  }, []);

  return {
    loading,
    setLoading: setLoadingState,
    withLoading,
    withLoadingAll,
    withLoadingFallback,
    withLoadingRetry,
  };
}; 