import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

interface LocationPermission {
  granted: boolean;
  status: Location.PermissionStatus;
}

export const useLocation = () => {
  const [permission, setPermission] = useState<LocationPermission>({
    granted: false,
    status: 'undetermined',
  });

  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';

      setPermission({
        granted,
        status,
      });

      if (granted) {
        await AsyncStorage.setItem('@CuideSe:location:permission', 'granted');
      }

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      return false;
    }
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      const granted = status === 'granted';

      setPermission({
        granted,
        status,
      });

      return granted;
    } catch (error) {
      console.error('Erro ao verificar permissão de localização:', error);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!permission.granted) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Permissão de localização não concedida');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        altitudeAccuracy: location.coords.altitudeAccuracy,
        heading: location.coords.heading,
        speed: location.coords.speed,
      });

      return location;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [permission.granted, requestPermission]);

  const watchLocation = useCallback(async (
    callback: (location: LocationData) => void,
    options: Location.LocationOptions = {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
    }
  ) => {
    try {
      if (!permission.granted) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Permissão de localização não concedida');
        }
      }

      const subscription = await Location.watchPositionAsync(
        options,
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            altitude: location.coords.altitude,
            altitudeAccuracy: location.coords.altitudeAccuracy,
            heading: location.coords.heading,
            speed: location.coords.speed,
          };

          setLocation(locationData);
          callback(locationData);
        }
      );

      return subscription;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    }
  }, [permission.granted, requestPermission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    permission,
    location,
    error,
    isLoading,
    requestPermission,
    checkPermission,
    getCurrentLocation,
    watchLocation,
  };
};