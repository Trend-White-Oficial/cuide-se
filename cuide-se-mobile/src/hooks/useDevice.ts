import { useState, useEffect, useCallback } from 'react';
import { Platform, Dimensions, PixelRatio, StatusBar, NativeModules, DeviceEventEmitter } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import * as Battery from 'expo-battery';
import * as Brightness from 'expo-brightness';
import * as Haptics from 'expo-haptics';
import * as Sensors from 'expo-sensors';
import * as ScreenOrientation from 'expo-screen-orientation';
import DeviceInfo from 'react-native-device-info';
import { useToast } from './useToast';
import * as Network from 'expo-network';

interface DeviceInfo {
  brand: string | null;
  manufacturer: string | null;
  modelName: string | null;
  osName: string;
  osVersion: string;
  platformApiLevel: number | null;
  deviceType: string;
  isDevice: boolean;
  isEmulator: boolean;
  isTablet: boolean;
  isPhone: boolean;
  isDesktop: boolean;
  isTV: boolean;
  isWeb: boolean;
  appVersion: string;
  buildVersion: string;
  deviceId: string;
  deviceName: string;
  deviceYearClass: number | null;
  totalMemory: number | null;
  batteryLevel: number | null;
  isCharging: boolean | null;
  isLowPowerMode: boolean | null;
  brightness: number | null;
  screenWidth: number;
  screenHeight: number;
  screenScale: number;
  screenDensity: number;
  statusBarHeight: number;
  hasNotch: boolean;
  orientation: string;
  isLandscape: boolean;
  isPortrait: boolean;
}

interface DeviceState {
  brand: string | null;
  manufacturer: string | null;
  modelName: string | null;
  osName: string;
  osVersion: string;
  deviceName: string | null;
  totalMemory: number | null;
  isConnected: boolean;
  connectionType: Network.NetworkStateType | null;
  appVersion: string;
  buildNumber: string;
  loading: boolean;
  error: string | null;
}

export const useDevice = () => {
  const [state, setState] = useState<DeviceState>({
    isDevice: false,
    brand: null,
    manufacturer: null,
    modelName: null,
    osName: Platform.OS,
    osVersion: Platform.Version.toString(),
    deviceName: null,
    totalMemory: null,
    isConnected: false,
    connectionType: null,
    appVersion: Application.nativeApplicationVersion || '',
    buildNumber: Application.nativeBuildVersion || '',
    loading: true,
    error: null,
  });

  const { showToast } = useToast();

  useEffect(() => {
    checkDeviceInfo();
    checkNetworkInfo();

    const networkSubscription = Network.addNetworkStateChangeListener(({ isConnected, type }) => {
      setState(prev => ({
        ...prev,
        isConnected,
        connectionType: type,
      }));
    });

    return () => {
      networkSubscription.remove();
    };
  }, []);

  const checkDeviceInfo = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [isDevice, brand, manufacturer, modelName, deviceName, totalMemory] = await Promise.all([
        Device.isDevice,
        Device.brand,
        Device.manufacturer,
        Device.modelName,
        Device.deviceName,
        Device.totalMemory,
      ]);

      setState(prev => ({
        ...prev,
        isDevice,
        brand,
        manufacturer,
        modelName,
        deviceName,
        totalMemory,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao obter informações do dispositivo',
      }));
    }
  }, []);

  const checkNetworkInfo = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [isConnected, type] = await Promise.all([
        Network.getNetworkStateAsync(),
        Network.getNetworkStateAsync(),
      ]);

      setState(prev => ({
        ...prev,
        isConnected: isConnected.isConnected,
        connectionType: type.type,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao obter informações de rede',
      }));
    }
  }, []);

  // Vibra o dispositivo
  const vibrate = useCallback(async (type: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> => {
    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    } catch (error) {
      console.error('Erro ao vibrar dispositivo:', error);
    }
  }, []);

  // Verifica se o dispositivo suporta um recurso
  const hasFeature = useCallback(
    async (feature: string): Promise<boolean> => {
      try {
        switch (feature) {
          case 'haptics':
            return await Haptics.isAvailableAsync();
          case 'gyroscope':
            return await Sensors.Gyroscope.isAvailableAsync();
          case 'accelerometer':
            return await Sensors.Accelerometer.isAvailableAsync();
          case 'magnetometer':
            return await Sensors.Magnetometer.isAvailableAsync();
          case 'barometer':
            return await Sensors.Barometer.isAvailableAsync();
          case 'pedometer':
            return await Sensors.Pedometer.isAvailableAsync();
          case 'motion':
            return await Sensors.DeviceMotion.isAvailableAsync();
          default:
            return false;
        }
      } catch (error) {
        console.error(`Erro ao verificar recurso ${feature}:`, error);
        return false;
      }
    },
    []
  );

  // Verifica se há atualizações disponíveis
  const checkForUpdates = useCallback(async (): Promise<boolean> => {
    try {
      const update = await Updates.checkForUpdateAsync();
      return update.isAvailable;
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
      return false;
    }
  }, []);

  // Instala atualizações disponíveis
  const installUpdate = useCallback(async (): Promise<void> => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Erro ao instalar atualização:', error);
    }
  }, []);

  // Atualiza o estado do dispositivo
  const updateDeviceState = async () => {
    try {
      const [
        brand,
        manufacturer,
        model,
        deviceId,
        systemName,
        systemVersion,
        uniqueId,
        appVersion,
        buildNumber,
        bundleId,
        isTablet,
        isEmulator,
        hasNotch,
        totalMemory,
        usedMemory,
        batteryLevel,
        isCharging,
        isPowerSaveMode,
      ] = await Promise.all([
        DeviceInfo.getBrand(),
        DeviceInfo.getManufacturer(),
        DeviceInfo.getModel(),
        DeviceInfo.getDeviceId(),
        DeviceInfo.getSystemName(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getUniqueId(),
        DeviceInfo.getVersion(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getBundleId(),
        DeviceInfo.isTablet(),
        DeviceInfo.isEmulator(),
        DeviceInfo.hasNotch(),
        DeviceInfo.getTotalMemory(),
        DeviceInfo.getUsedMemory(),
        DeviceInfo.getBatteryLevel(),
        DeviceInfo.isPowerSaveMode(),
        DeviceInfo.isPowerSaveMode(),
      ]);

      setState(prev => ({
        ...prev,
        brand,
        manufacturer,
        model,
        deviceId,
        systemName,
        systemVersion,
        uniqueId,
        appVersion,
        buildNumber,
        bundleId,
        isTablet,
        isEmulator,
        hasNotch,
        totalMemory,
        usedMemory,
        batteryLevel,
        isCharging,
        isPowerSaveMode,
        deviceName: systemName,
      }));
    } catch (error) {
      console.error('Erro ao atualizar estado do dispositivo:', error);
    }
  };

  // Monitora mudanças na bateria
  useEffect(() => {
    const batteryListener = DeviceEventEmitter.addListener(
      'RNDeviceInfo_batteryLevelDidChange',
      (batteryLevel: number) => {
        setState(prev => ({ ...prev, batteryLevel }));

        // Notifica quando a bateria estiver baixa
        if (batteryLevel <= 0.2) {
          showToast({
            type: 'warning',
            message: 'Bateria baixa',
            description: 'Conecte seu dispositivo a uma fonte de energia',
          });
        }
      }
    );

    const chargingListener = DeviceEventEmitter.addListener(
      'RNDeviceInfo_powerStateDidChange',
      (state: { isCharging: boolean }) => {
        setState(prev => ({ ...prev, isCharging: state.isCharging }));
      }
    );

    return () => {
      batteryListener.remove();
      chargingListener.remove();
    };
  }, [showToast]);

  // Monitora mudanças no modo de economia de energia
  useEffect(() => {
    const powerSaveListener = DeviceEventEmitter.addListener(
      'RNDeviceInfo_powerStateDidChange',
      (state: { isPowerSaveMode: boolean }) => {
        setState(prev => ({ ...prev, isPowerSaveMode: state.isPowerSaveMode }));

        if (state.isPowerSaveMode) {
          showToast({
            type: 'info',
            message: 'Modo de economia de energia ativado',
            description: 'Algumas funcionalidades podem ser limitadas',
          });
        }
      }
    );

    return () => {
      powerSaveListener.remove();
    };
  }, [showToast]);

  // Atualiza o estado inicial
  useEffect(() => {
    updateDeviceState();
  }, []);

  // Verifica se o dispositivo é compatível
  const isDeviceCompatible = useCallback(async (): Promise<boolean> => {
    try {
      const [
        systemVersion,
        totalMemory,
        isEmulator,
      ] = await Promise.all([
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getTotalMemory(),
        DeviceInfo.isEmulator(),
      ]);

      // Verifica versão mínima do sistema
      const minVersion = Platform.select({
        ios: '13.0',
        android: '6.0',
        default: '0.0',
      });

      if (parseFloat(systemVersion) < parseFloat(minVersion)) {
        showToast({
          type: 'error',
          message: 'Sistema incompatível',
          description: `Seu dispositivo precisa ter pelo menos ${minVersion}`,
        });
        return false;
      }

      // Verifica memória mínima
      const minMemory = 2 * 1024 * 1024 * 1024; // 2GB
      if (totalMemory < minMemory) {
        showToast({
          type: 'error',
          message: 'Memória insuficiente',
          description: 'Seu dispositivo precisa ter pelo menos 2GB de RAM',
        });
        return false;
      }

      // Verifica se é emulador
      if (isEmulator) {
        showToast({
          type: 'warning',
          message: 'Emulador detectado',
          description: 'Algumas funcionalidades podem não funcionar corretamente',
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar compatibilidade:', error);
      return false;
    }
  }, [showToast]);

  return {
    ...state,
    vibrate,
    hasFeature,
    checkForUpdates,
    installUpdate,
    isDeviceCompatible,
    updateDeviceState,
  };
}; 