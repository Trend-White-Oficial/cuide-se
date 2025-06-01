import { useState, useCallback, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

interface BiometricsState {
  isAvailable: boolean;
  isEnrolled: boolean;
  type: LocalAuthentication.AuthenticationType[];
  loading: boolean;
  error: string | null;
}

export const useBiometrics = () => {
  const [state, setState] = useState<BiometricsState>({
    isAvailable: false,
    isEnrolled: false,
    type: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [isAvailable, isEnrolled, type] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);

      setState({
        isAvailable,
        isEnrolled,
        type,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar biometria',
      }));
    }
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para continuar',
        fallbackLabel: 'Usar senha',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));

      return result.success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro na autenticação biométrica',
      }));

      return false;
    }
  }, []);

  return {
    ...state,
    authenticate,
  };
}; 