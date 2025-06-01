import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BiometricPermission {
  granted: boolean;
  status: LocalAuthentication.AuthenticationType[];
}

export const useBiometrics = () => {
  const [permission, setPermission] = useState<BiometricPermission>({
    granted: false,
    status: [],
  });

  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkAvailability = useCallback(async () => {
    try {
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);

      const available = hasHardware && isEnrolled;
      setIsAvailable(available);

      return available;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade biométrica:', error);
      return false;
    }
  }, []);

  const getSupportedTypes = useCallback(async () => {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setPermission(prev => ({
        ...prev,
        status: types,
      }));
      return types;
    } catch (error) {
      console.error('Erro ao obter tipos de autenticação suportados:', error);
      return [];
    }
  }, []);

  const authenticate = useCallback(async (options: LocalAuthentication.AuthenticationOptions = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para continuar',
        fallbackLabel: 'Usar senha',
        ...options,
      });

      if (result.success) {
        await AsyncStorage.setItem('@CuideSe:biometrics:lastAuth', Date.now().toString());
      }

      return result;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelAuthentication = useCallback(async () => {
    try {
      await LocalAuthentication.cancelAuthenticate();
    } catch (error) {
      console.error('Erro ao cancelar autenticação:', error);
    }
  }, []);

  useEffect(() => {
    const checkBiometrics = async () => {
      const available = await checkAvailability();
      if (available) {
        await getSupportedTypes();
      }
    };

    checkBiometrics();
  }, [checkAvailability, getSupportedTypes]);

  return {
    permission,
    isAvailable,
    error,
    isLoading,
    checkAvailability,
    getSupportedTypes,
    authenticate,
    cancelAuthentication,
  };
}; 