import { useState, useEffect, useCallback } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { useDevice } from './useDevice';
import { useNetwork } from './useNetwork';
import { useToast } from './useToast';
import { Platform } from 'react-native';

interface RemoteConfigValue {
  value: string | number | boolean;
  source: 'default' | 'remote' | 'static';
}

interface RemoteConfigState {
  [key: string]: RemoteConfigValue;
}

export const useRemoteConfig = () => {
  const [config, setConfig] = useState<RemoteConfigState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const { deviceState } = useDevice();
  const { networkState } = useNetwork();
  const { showToast } = useToast();

  // Configura o Remote Config
  const setupRemoteConfig = useCallback(async (): Promise<void> => {
    try {
      await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: 3600000, // 1 hora
        fetchTimeoutMillis: 60000, // 1 minuto
      });

      // Define valores padrão
      await remoteConfig().setDefaults({
        app_version: deviceState.appVersion,
        min_os_version: Platform.select({
          ios: '13.0',
          android: '6.0',
          default: '0.0',
        }),
        feature_flags: JSON.stringify({
          dark_mode: true,
          notifications: true,
          location: true,
          camera: true,
          biometrics: true,
        }),
        api_endpoints: JSON.stringify({
          base_url: 'https://api.cuidese.com',
          version: 'v1',
          timeout: 30000,
        }),
        ui_config: JSON.stringify({
          primary_color: '#007AFF',
          secondary_color: '#5856D6',
          font_size: 16,
          spacing: 8,
        }),
        cache_config: JSON.stringify({
          enabled: true,
          ttl: 3600,
          max_size: 100,
        }),
      });
    } catch (error) {
      console.error('Erro ao configurar Remote Config:', error);
    }
  }, [deviceState]);

  // Busca configurações remotas
  const fetchConfig = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Verifica conexão
      if (!networkState.isConnected) {
        showToast({
          type: 'warning',
          message: 'Sem conexão',
          description: 'Usando configurações locais',
        });
        return;
      }

      // Busca configurações
      await remoteConfig().fetchAndActivate();
      const parameters = remoteConfig().getAll();

      // Atualiza o estado
      const newConfig: RemoteConfigState = {};
      Object.entries(parameters).forEach(([key, parameter]) => {
        newConfig[key] = {
          value: parameter.getValue(),
          source: parameter.getSource(),
        };
      });

      setConfig(newConfig);
      setLastFetchTime(new Date());
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      showToast({
        type: 'error',
        message: 'Erro ao buscar configurações',
        description: 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  }, [networkState, showToast]);

  // Obtém um valor de configuração
  const getValue = useCallback(
    <T extends string | number | boolean>(key: string, defaultValue: T): T => {
      try {
        const parameter = remoteConfig().getValue(key);
        return parameter.getValue() as T;
      } catch (error) {
        console.error(`Erro ao obter valor da configuração ${key}:`, error);
        return defaultValue;
      }
    },
    []
  );

  // Obtém um valor JSON
  const getJsonValue = useCallback(
    <T>(key: string, defaultValue: T): T => {
      try {
        const parameter = remoteConfig().getValue(key);
        return JSON.parse(parameter.getValue() as string) as T;
      } catch (error) {
        console.error(`Erro ao obter valor JSON da configuração ${key}:`, error);
        return defaultValue;
      }
    },
    []
  );

  // Verifica se uma feature está habilitada
  const isFeatureEnabled = useCallback(
    (featureKey: string): boolean => {
      try {
        const features = getJsonValue<{ [key: string]: boolean }>('feature_flags', {});
        return features[featureKey] ?? false;
      } catch (error) {
        console.error(`Erro ao verificar feature ${featureKey}:`, error);
        return false;
      }
    },
    [getJsonValue]
  );

  // Obtém configurações da UI
  const getUiConfig = useCallback(
    () => {
      return getJsonValue<{
        primary_color: string;
        secondary_color: string;
        font_size: number;
        spacing: number;
      }>('ui_config', {
        primary_color: '#007AFF',
        secondary_color: '#5856D6',
        font_size: 16,
        spacing: 8,
      });
    },
    [getJsonValue]
  );

  // Obtém configurações da API
  const getApiConfig = useCallback(
    () => {
      return getJsonValue<{
        base_url: string;
        version: string;
        timeout: number;
      }>('api_endpoints', {
        base_url: 'https://api.cuidese.com',
        version: 'v1',
        timeout: 30000,
      });
    },
    [getJsonValue]
  );

  // Obtém configurações de cache
  const getCacheConfig = useCallback(
    () => {
      return getJsonValue<{
        enabled: boolean;
        ttl: number;
        max_size: number;
      }>('cache_config', {
        enabled: true,
        ttl: 3600,
        max_size: 100,
      });
    },
    [getJsonValue]
  );

  // Configura o Remote Config e busca configurações iniciais
  useEffect(() => {
    setupRemoteConfig().then(fetchConfig);
  }, [setupRemoteConfig, fetchConfig]);

  return {
    config,
    isLoading,
    lastFetchTime,
    fetchConfig,
    getValue,
    getJsonValue,
    isFeatureEnabled,
    getUiConfig,
    getApiConfig,
    getCacheConfig,
  };
}; 