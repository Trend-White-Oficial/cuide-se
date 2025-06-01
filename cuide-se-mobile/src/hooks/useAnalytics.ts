import { useState, useCallback } from 'react';
import analytics from '@react-native-firebase/analytics';
import { useDevice } from './useDevice';
import { useAuth } from './useAuth';

interface EventParams {
  [key: string]: any;
}

interface UserProperty {
  name: string;
  value: string;
}

interface AnalyticsState {
  enabled: boolean;
  loading: boolean;
  error: string | null;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const { deviceState } = useDevice();
  const [state, setState] = useState<AnalyticsState>({
    enabled: false,
    loading: true,
    error: null,
  });

  // Registra um evento
  const logEvent = useCallback(async (
    name: string,
    params?: Record<string, any>,
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const eventParams = {
        ...params,
        device_name: deviceState.brand,
        os_name: deviceState.systemName,
        os_version: deviceState.systemVersion,
        timestamp: new Date().toISOString(),
      };

      await analytics().logEvent(name, eventParams);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao registrar evento',
      }));
    }
  }, [deviceState.brand, deviceState.systemName, deviceState.systemVersion]);

  // Define uma propriedade do usuário
  const setUserProperties = useCallback(async (properties: Record<string, any>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await analytics().setUserProperties(properties);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao definir propriedades do usuário',
      }));
    }
  }, []);

  // Define o ID do usuário
  const setUserId = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await analytics().setUserId(userId);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao definir ID do usuário',
      }));
    }
  }, []);

  // Registra o início de uma tela
  const setCurrentScreen = useCallback(async (screenName: string, screenClass?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass,
      });

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao definir tela atual',
      }));
    }
  }, []);

  // Registra uma exceção
  const logException = useCallback(
    async (exception: Error, fatal: boolean = false): Promise<void> => {
      try {
        await analytics().logEvent('exception', {
          exception_name: exception.name,
          exception_message: exception.message,
          exception_stack: exception.stack,
          fatal,
        });
      } catch (error) {
        console.error('Erro ao registrar exceção:', error);
      }
    },
    []
  );

  // Registra uma métrica de tempo
  const logTiming = useCallback(
    async (name: string, value: number, params?: EventParams): Promise<void> => {
      try {
        await analytics().logEvent('timing', {
          name,
          value,
          ...params,
        });
      } catch (error) {
        console.error('Erro ao registrar métrica de tempo:', error);
      }
    },
    []
  );

  // Registra uma métrica de contagem
  const logCount = useCallback(
    async (name: string, value: number, params?: EventParams): Promise<void> => {
      try {
        await analytics().logEvent('count', {
          name,
          value,
          ...params,
        });
      } catch (error) {
        console.error('Erro ao registrar métrica de contagem:', error);
      }
    },
    []
  );

  // Registra uma métrica de valor
  const logValue = useCallback(
    async (name: string, value: number, params?: EventParams): Promise<void> => {
      try {
        await analytics().logEvent('value', {
          name,
          value,
          ...params,
        });
      } catch (error) {
        console.error('Erro ao registrar métrica de valor:', error);
      }
    },
    []
  );

  // Registra uma métrica de progresso
  const logProgress = useCallback(
    async (name: string, value: number, total: number, params?: EventParams): Promise<void> => {
      try {
        await analytics().logEvent('progress', {
          name,
          value,
          total,
          percentage: (value / total) * 100,
          ...params,
        });
      } catch (error) {
        console.error('Erro ao registrar métrica de progresso:', error);
      }
    },
    []
  );

  // Registra uma métrica de erro
  const logError = useCallback(
    async (name: string, error: Error, params?: EventParams): Promise<void> => {
      try {
        await analytics().logEvent('error', {
          name,
          error_name: error.name,
          error_message: error.message,
          error_stack: error.stack,
          ...params,
        });
      } catch (error) {
        console.error('Erro ao registrar métrica de erro:', error);
      }
    },
    []
  );

  // Registra uma métrica de sucesso
  const logSuccess = useCallback(
    async (name: string, params?: EventParams): Promise<void> => {
      try {
        await analytics().logEvent('success', {
          name,
          ...params,
        });
      } catch (error) {
        console.error('Erro ao registrar métrica de sucesso:', error);
      }
    },
    []
  );

  // Registra uma métrica de falha
  const logFailure = useCallback(
    async (name: string, reason: string, params?: EventParams): Promise<void> => {
      try {
        await analytics().logEvent('failure', {
          name,
          reason,
          ...params,
        });
      } catch (error) {
        console.error('Erro ao registrar métrica de falha:', error);
      }
    },
    []
  );

  const resetAnalyticsData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await analytics().resetAnalyticsData();

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao resetar dados de análise',
      }));
    }
  }, []);

  return {
    ...state,
    logEvent,
    setUserProperties,
    setUserId,
    setCurrentScreen,
    logException,
    logTiming,
    logCount,
    logValue,
    logProgress,
    logError,
    logSuccess,
    logFailure,
    resetAnalyticsData,
  };
}; 