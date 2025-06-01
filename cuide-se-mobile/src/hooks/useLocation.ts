import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';
import { locationService, Address, CreateAddressData } from '../services/location';

export const useLocation = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await locationService.getAddresses();
      setAddresses(data);
      logEvent('load_addresses');
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao carregar endereços',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const location = await locationService.getCurrentLocation();
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      logEvent('get_current_location');
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao obter localização atual',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchAddresses = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await locationService.searchAddresses(query);
      logEvent('search_addresses', { query });
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao buscar endereços',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveAddress = async (data: CreateAddressData) => {
    try {
      setIsLoading(true);
      setError(null);
      const address = await locationService.saveAddress(data);
      setAddresses(prev => [...prev, address]);
      logEvent('save_address');
      return address;
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao salvar endereço',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (id: string, data: Partial<CreateAddressData>) => {
    try {
      setIsLoading(true);
      setError(null);
      const address = await locationService.updateAddress(id, data);
      setAddresses(prev =>
        prev.map(addr => (addr.id === id ? address : addr))
      );
      logEvent('update_address');
      return address;
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao atualizar endereço',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await locationService.deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      logEvent('delete_address');
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao excluir endereço',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const distance = await locationService.calculateDistance(origin, destination);
      logEvent('calculate_distance');
      return distance;
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao calcular distância',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  return {
    addresses,
    currentLocation,
    isLoading,
    error,
    fetchAddresses,
    getCurrentLocation,
    searchAddresses,
    saveAddress,
    updateAddress,
    deleteAddress,
    calculateDistance,
  };
};