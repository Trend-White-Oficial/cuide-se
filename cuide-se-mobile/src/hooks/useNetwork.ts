import { useState, useCallback, useEffect } from 'react';
import * as Network from 'expo-network';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';

interface NetworkState {
  isConnected: boolean;
  type: Network.NetworkStateType;
  isInternetReachable: boolean | null;
  details: Network.NetworkState | null;
  loading: boolean;
  error: string | null;
}

export const useNetwork = () => {
  const [state, setState] = useState<NetworkState>({
    isConnected: false,
    type: Network.NetworkStateType.UNKNOWN,
    isInternetReachable: null,
    details: null,
    loading: true,
    error: null,
  });

  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();

  // Verifica o estado da rede
  const checkNetworkState = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [networkState, isInternetReachable] = await Promise.all([
        Network.getNetworkStateAsync(),
        Network.getNetworkStateAsync(),
      ]);

      setState(prev => ({
        ...prev,
        isConnected: networkState.isConnected,
        type: networkState.type,
        isInternetReachable: isInternetReachable.isConnected,
        details: networkState,
        loading: false,
        error: null,
      }));

      // Registra o evento
      await logEvent('network_state_changed', {
        is_connected: networkState.isConnected,
        type: networkState.type,
        is_internet_reachable: isInternetReachable.isConnected,
      });

      return networkState;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar estado da rede';
      recordError(error instanceof Error ? error : new Error(errorMessage));

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao verificar rede',
        description: errorMessage,
      });

      return null;
    }
  }, [logEvent, recordError, showToast]);

  // Verifica se a rede está disponível
  const isNetworkAvailable = useCallback(async () => {
    try {
      const networkState = await checkNetworkState();
      return networkState?.isConnected || false;
    } catch (error) {
      recordError(error instanceof Error ? error : new Error('Erro ao verificar disponibilidade da rede'));
      return false;
    }
  }, [checkNetworkState, recordError]);

  // Verifica se a internet está acessível
  const isInternetReachable = useCallback(async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      return networkState.isConnected;
    } catch (error) {
      recordError(error instanceof Error ? error : new Error('Erro ao verificar acessibilidade da internet'));
      return false;
    }
  }, [recordError]);

  // Verifica o tipo de conexão
  const getConnectionType = useCallback(async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      return networkState.type;
    } catch (error) {
      recordError(error instanceof Error ? error : new Error('Erro ao verificar tipo de conexão'));
      return Network.NetworkStateType.UNKNOWN;
    }
  }, [recordError]);

  // Verifica a qualidade da conexão
  const getConnectionQuality = useCallback(async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const type = networkState.type;

      switch (type) {
        case Network.NetworkStateType.WIFI:
          return 'excelente';
        case Network.NetworkStateType.CELLULAR:
          return 'bom';
        case Network.NetworkStateType.NONE:
          return 'sem conexão';
        default:
          return 'desconhecido';
      }
    } catch (error) {
      recordError(error instanceof Error ? error : new Error('Erro ao verificar qualidade da conexão'));
      return 'desconhecido';
    }
  }, [recordError]);

  // Monitora mudanças na rede
  useEffect(() => {
    const subscription = Network.addNetworkStateChangeListener(({ isConnected, type }) => {
      setState(prev => ({
        ...prev,
        isConnected,
        type,
      }));

      // Registra o evento
      logEvent('network_state_changed', {
        is_connected: isConnected,
        type,
      });

      // Mostra toast quando a conexão muda
      if (isConnected) {
        showToast({
          type: 'success',
          message: 'Conexão restaurada',
          description: 'Sua conexão com a internet foi restaurada',
        });
      } else {
        showToast({
          type: 'error',
          message: 'Sem conexão',
          description: 'Verifique sua conexão com a internet',
        });
      }
    });

    // Verifica o estado inicial
    checkNetworkState();

    return () => {
      subscription.remove();
    };
  }, [checkNetworkState, logEvent, showToast]);

  return {
    ...state,
    checkNetworkState,
    isNetworkAvailable,
    isInternetReachable,
    getConnectionType,
    getConnectionQuality,
  };
}; 