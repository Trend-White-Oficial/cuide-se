import { useState, useCallback } from 'react';

export const useError = () => {
  const [error, setError] = useState<Error | null>(null);

  // Define um erro
  const setErrorState = useCallback((error: Error | null) => {
    setError(error);
  }, []);

  // Limpa o erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Executa uma função e trata erros
  const withErrorHandling = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      clearError();
      const result = await fn();
      return result;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      return null;
    }
  }, [clearError]);

  return {
    error,
    setError: setErrorState,
    clearError,
    withErrorHandling,
  };
}; 