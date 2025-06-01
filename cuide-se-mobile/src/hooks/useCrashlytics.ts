import { useState, useCallback, useEffect } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDevice } from './useDevice';
import { useAuth } from './useAuth';

interface CrashlyticsState {
  enabled: boolean;
  loading: boolean;
  error: string | null;
}

interface UserInfo {
  id: string;
  email?: string;
  name?: string;
}

interface CustomKey {
  key: string;
  value: string | number | boolean;
}

export const useCrashlytics = () => {
  const { user } = useAuth();
  const { deviceState } = useDevice();
  const [state, setState] = useState<CrashlyticsState>({
    enabled: false,
    loading: true,
    error: null,
  });

  // Registra um erro
  const recordError = useCallback(async (error: Error, context?: Record<string, any>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await crashlytics().recordError(error, {
        ...context,
        device_name: deviceState.brand,
        os_name: deviceState.systemName,
        os_version: deviceState.systemVersion,
        timestamp: new Date().toISOString(),
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
        error: error instanceof Error ? error.message : 'Erro ao registrar erro',
      }));
    }
  }, [deviceState.brand, deviceState.systemName, deviceState.systemVersion]);

  // Registra uma mensagem de log
  const log = useCallback(async (message: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await crashlytics().log(message);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao registrar log',
      }));
    }
  }, []);

  // Define um atributo personalizado
  const setAttribute = useCallback(async (key: string, value: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await crashlytics().setAttribute(key, value);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao definir atributo',
      }));
    }
  }, []);

  // Define múltiplos atributos personalizados
  const setAttributes = useCallback(async (attributes: Record<string, string>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await Promise.all(
        Object.entries(attributes).map(([key, value]) =>
          crashlytics().setAttribute(key, value)
        )
      );

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao definir atributos',
      }));
    }
  }, []);

  // Define o ID do usuário
  const setUserId = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await crashlytics().setUserId(userId);

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

  // Força um crash para teste
  const forceCrash = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await crashlytics().crash();

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao forçar crash',
      }));
    }
  }, []);

  // Atualiza o ID do usuário quando o usuário muda
  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user, setUserId]);

  // Define informações do usuário
  const setUserInfo = useCallback(
    async (userInfo: UserInfo): Promise<void> => {
      try {
        await crashlytics().setUserId(userInfo.id);
        if (userInfo.email) {
          await crashlytics().setAttribute('email', userInfo.email);
        }
        if (userInfo.name) {
          await crashlytics().setAttribute('name', userInfo.name);
        }
      } catch (error) {
        console.error('Erro ao definir informações do usuário:', error);
      }
    },
    []
  );

  // Define uma chave personalizada
  const setCustomKey = useCallback(
    async (customKey: CustomKey): Promise<void> => {
      try {
        await crashlytics().setAttribute(customKey.key, customKey.value);
      } catch (error) {
        console.error('Erro ao definir chave personalizada:', error);
      }
    },
    []
  );

  // Define múltiplas chaves personalizadas
  const setCustomKeys = useCallback(
    async (customKeys: CustomKey[]): Promise<void> => {
      try {
        await Promise.all(
          customKeys.map(key => crashlytics().setAttribute(key.key, key.value))
        );
      } catch (error) {
        console.error('Erro ao definir chaves personalizadas:', error);
      }
    },
    []
  );

  // Registra uma exceção não fatal
  const recordNonFatalError = useCallback(
    async (error: Error, context?: string): Promise<void> => {
      try {
        await crashlytics().recordError(error, context);
      } catch (error) {
        console.error('Erro ao registrar exceção não fatal:', error);
      }
    },
    []
  );

  // Registra uma exceção fatal
  const recordFatalError = useCallback(
    async (error: Error, context?: string): Promise<void> => {
      try {
        await crashlytics().recordError(error, context);
        // Força o envio do relatório
        await crashlytics().sendUnsentReports();
      } catch (error) {
        console.error('Erro ao registrar exceção fatal:', error);
      }
    },
    []
  );

  // Registra informações do dispositivo
  const recordDeviceInfo = useCallback(async (): Promise<void> => {
    try {
      await Promise.all([
        crashlytics().setAttribute('device_brand', deviceState.brand),
        crashlytics().setAttribute('device_model', deviceState.model),
        crashlytics().setAttribute('os_version', deviceState.systemVersion),
        crashlytics().setAttribute('app_version', deviceState.appVersion),
        crashlytics().setAttribute('is_tablet', deviceState.isTablet),
        crashlytics().setAttribute('is_emulator', deviceState.isEmulator),
        crashlytics().setAttribute('has_notch', deviceState.hasNotch),
        crashlytics().setAttribute('screen_width', deviceState.screenWidth),
        crashlytics().setAttribute('screen_height', deviceState.screenHeight),
        crashlytics().setAttribute('battery_level', deviceState.batteryLevel),
        crashlytics().setAttribute('is_charging', deviceState.isCharging),
        crashlytics().setAttribute('is_power_save_mode', deviceState.isPowerSaveMode),
      ]);
    } catch (error) {
      console.error('Erro ao registrar informações do dispositivo:', error);
    }
  }, [deviceState]);

  // Envia relatórios não enviados
  const sendUnsentReports = useCallback(async (): Promise<void> => {
    try {
      await crashlytics().sendUnsentReports();
    } catch (error) {
      console.error('Erro ao enviar relatórios não enviados:', error);
    }
  }, []);

  // Limpa todos os relatórios não enviados
  const deleteUnsentReports = useCallback(async (): Promise<void> => {
    try {
      await crashlytics().deleteUnsentReports();
    } catch (error) {
      console.error('Erro ao limpar relatórios não enviados:', error);
    }
  }, []);

  // Verifica se o Crashlytics está habilitado
  const isCrashlyticsEnabled = useCallback(async (): Promise<boolean> => {
    try {
      return await crashlytics().isCrashlyticsCollectionEnabled();
    } catch (error) {
      console.error('Erro ao verificar status do Crashlytics:', error);
      return false;
    }
  }, []);

  // Habilita/desabilita o Crashlytics
  const setCrashlyticsEnabled = useCallback(
    async (enabled: boolean): Promise<void> => {
      try {
        await crashlytics().setCrashlyticsCollectionEnabled(enabled);
      } catch (error) {
        console.error('Erro ao configurar Crashlytics:', error);
      }
    },
    []
  );

  return {
    ...state,
    recordError,
    log,
    setAttribute,
    setAttributes,
    setUserId,
    forceCrash,
    setUserInfo,
    setCustomKey,
    setCustomKeys,
    recordNonFatalError,
    recordFatalError,
    recordDeviceInfo,
    sendUnsentReports,
    deleteUnsentReports,
    isCrashlyticsEnabled,
    setCrashlyticsEnabled,
  };
}; 