import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
  details: any;
  lastConnected: number;
}

export const useNetwork = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
    details: null,
    lastConnected: Date.now(),
  });

  const handleNetworkChange = useCallback(async (state: NetInfoState) => {
    const now = Date.now();

    if (state.isConnected) {
      setNetworkState({
        isConnected: true,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details,
        lastConnected: now,
      });

      await AsyncStorage.setItem('@CuideSe:network:lastConnected', now.toString());
    } else {
      setNetworkState(prev => ({
        ...prev,
        isConnected: false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details,
      }));
    }
  }, []);

  const getLastConnected = useCallback(async () => {
    try {
      const lastConnected = await AsyncStorage.getItem('@CuideSe:network:lastConnected');
      if (lastConnected) {
        setNetworkState(prev => ({
          ...prev,
          lastConnected: parseInt(lastConnected, 10),
        }));
      }
    } catch (error) {
      console.error('Erro ao recuperar último estado de conexão:', error);
    }
  }, []);

  const getOfflineTime = useCallback(() => {
    if (networkState.isConnected) return 0;
    return Date.now() - networkState.lastConnected;
  }, [networkState.isConnected, networkState.lastConnected]);

  const checkConnection = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      handleNetworkChange(state);
      return state.isConnected;
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      return false;
    }
  }, [handleNetworkChange]);

  useEffect(() => {
    getLastConnected();

    const subscription: NetInfoSubscription = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      subscription();
    };
  }, [getLastConnected, handleNetworkChange]);

  return {
    networkState,
    getOfflineTime,
    checkConnection,
  };
}; 