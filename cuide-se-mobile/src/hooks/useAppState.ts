import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppStateData {
  status: AppStateStatus;
  lastActive: number;
  isActive: boolean;
}

export const useAppState = () => {
  const [appState, setAppState] = useState<AppStateData>({
    status: AppState.currentState,
    lastActive: Date.now(),
    isActive: AppState.currentState === 'active',
  });

  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    const now = Date.now();

    if (nextAppState === 'active') {
      // Aplicação voltou ao primeiro plano
      setAppState({
        status: nextAppState,
        lastActive: now,
        isActive: true,
      });

      await AsyncStorage.setItem('@CuideSe:appState:lastActive', now.toString());
    } else {
      // Aplicação foi para segundo plano
      setAppState({
        status: nextAppState,
        lastActive: appState.lastActive,
        isActive: false,
      });
    }
  }, [appState.lastActive]);

  const getLastActive = useCallback(async () => {
    try {
      const lastActive = await AsyncStorage.getItem('@CuideSe:appState:lastActive');
      if (lastActive) {
        setAppState(prev => ({
          ...prev,
          lastActive: parseInt(lastActive, 10),
        }));
      }
    } catch (error) {
      console.error('Erro ao recuperar último estado ativo:', error);
    }
  }, []);

  const getInactiveTime = useCallback(() => {
    if (appState.isActive) return 0;
    return Date.now() - appState.lastActive;
  }, [appState.isActive, appState.lastActive]);

  useEffect(() => {
    getLastActive();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [getLastActive, handleAppStateChange]);

  return {
    appState,
    getInactiveTime,
  };
}; 