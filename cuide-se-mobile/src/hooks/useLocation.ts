import { useState, useCallback, useEffect } from 'react';
import * as Location from 'expo-location';
import { usePermissions } from './usePermissions';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';

interface LocationState {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  loading: boolean;
  watching: boolean;
}

interface LocationOptions {
  accuracy?: Location.Accuracy;
  timeInterval?: number;
  distanceInterval?: number;
  mayShowUserSettingsDialog?: boolean;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    location: null,
    errorMsg: null,
    loading: false,
    watching: false,
  });

  const { requestPermission } = usePermissions();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();

  // Solicita permissão de localização
  const requestLocationPermission = useCallback(async () => {
    try {
      const status = await requestPermission('location');
      return status === 'granted';
    } catch (error) {
      recordError(error instanceof Error ? error : new Error('Erro ao solicitar permissão de localização'));
      return false;
    }
  }, [requestPermission, recordError]);

  // Obtém a localização atual
  const getCurrentLocation = useCallback(async (options?: LocationOptions) => {
    try {
      setState(prev => ({ ...prev, loading: true, errorMsg: null }));

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Permissão de localização negada');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: options?.accuracy || Location.Accuracy.Balanced,
      });

      setState(prev => ({
        ...prev,
        location,
        loading: false,
        errorMsg: null,
      }));

      // Registra o evento
      await logEvent('location_updated', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      });

      return location;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao obter localização';
      recordError(error instanceof Error ? error : new Error(errorMessage));

      setState(prev => ({
        ...prev,
        loading: false,
        errorMsg: errorMessage,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao obter localização',
        description: errorMessage,
      });

      return null;
    }
  }, [requestLocationPermission, logEvent, recordError, showToast]);

  // Inicia o monitoramento da localização
  const startWatchingLocation = useCallback(async (options?: LocationOptions) => {
    try {
      setState(prev => ({ ...prev, loading: true, errorMsg: null }));

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Permissão de localização negada');
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || Location.Accuracy.Balanced,
          timeInterval: options?.timeInterval || 1000,
          distanceInterval: options?.distanceInterval || 10,
          mayShowUserSettingsDialog: options?.mayShowUserSettingsDialog || true,
        },
        (location) => {
          setState(prev => ({
            ...prev,
            location,
            watching: true,
            errorMsg: null,
          }));

          // Registra o evento
          logEvent('location_updated', {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          });
        }
      );

      setState(prev => ({
        ...prev,
        loading: false,
        watching: true,
        errorMsg: null,
      }));

      return subscription;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao iniciar monitoramento de localização';
      recordError(error instanceof Error ? error : new Error(errorMessage));

      setState(prev => ({
        ...prev,
        loading: false,
        watching: false,
        errorMsg: errorMessage,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao iniciar monitoramento',
        description: errorMessage,
      });

      return null;
    }
  }, [requestLocationPermission, logEvent, recordError, showToast]);

  // Para o monitoramento da localização
  const stopWatchingLocation = useCallback(async (subscription: Location.LocationSubscription) => {
    try {
      setState(prev => ({ ...prev, loading: true, errorMsg: null }));

      subscription.remove();

      setState(prev => ({
        ...prev,
        loading: false,
        watching: false,
        errorMsg: null,
      }));

      // Registra o evento
      await logEvent('location_watching_stopped', {
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao parar monitoramento de localização';
      recordError(error instanceof Error ? error : new Error(errorMessage));

      setState(prev => ({
        ...prev,
        loading: false,
        errorMsg: errorMessage,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao parar monitoramento',
        description: errorMessage,
      });
    }
  }, [logEvent, recordError, showToast]);

  // Obtém o endereço a partir das coordenadas
  const getAddressFromCoordinates = useCallback(async (latitude: number, longitude: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, errorMsg: null }));

      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setState(prev => ({
        ...prev,
        loading: false,
        errorMsg: null,
      }));

      return addresses[0];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao obter endereço';
      recordError(error instanceof Error ? error : new Error(errorMessage));

      setState(prev => ({
        ...prev,
        loading: false,
        errorMsg: errorMessage,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao obter endereço',
        description: errorMessage,
      });

      return null;
    }
  }, [recordError, showToast]);

  // Obtém as coordenadas a partir do endereço
  const getCoordinatesFromAddress = useCallback(async (address: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, errorMsg: null }));

      const locations = await Location.geocodeAsync(address);

      setState(prev => ({
        ...prev,
        loading: false,
        errorMsg: null,
      }));

      return locations[0];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao obter coordenadas';
      recordError(error instanceof Error ? error : new Error(errorMessage));

      setState(prev => ({
        ...prev,
        loading: false,
        errorMsg: errorMessage,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao obter coordenadas',
        description: errorMessage,
      });

      return null;
    }
  }, [recordError, showToast]);

  // Calcula a distância entre duas coordenadas
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Raio da Terra em km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  return {
    ...state,
    getCurrentLocation,
    startWatchingLocation,
    stopWatchingLocation,
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
    calculateDistance,
  };
};