import { useState, useCallback, useEffect } from 'react';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';

type PermissionType = 
  | 'camera'
  | 'microphone'
  | 'location'
  | 'notifications'
  | 'contacts'
  | 'calendar'
  | 'mediaLibrary'
  | 'photos'
  | 'cameraRoll'
  | 'audioRecording'
  | 'systemBrightness'
  | 'sensors'
  | 'motion'
  | 'networkState'
  | 'bluetooth'
  | 'bluetoothScan'
  | 'bluetoothConnect'
  | 'bluetoothAdvertise'
  | 'bluetoothAdmin'
  | 'locationForeground'
  | 'locationBackground'
  | 'locationAlways'
  | 'locationWhenInUse';

interface PermissionState {
  status: Permissions.PermissionStatus;
  loading: boolean;
  error: string | null;
}

interface PermissionsState {
  [key: string]: PermissionState;
}

export const usePermissions = () => {
  const [state, setState] = useState<PermissionsState>({});
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();

  // Verifica uma permissão específica
  const checkPermission = useCallback(async (permission: PermissionType) => {
    try {
      setState(prev => ({
        ...prev,
        [permission]: { ...prev[permission], loading: true, error: null },
      }));

      const { status } = await Permissions.getAsync(permission);

      setState(prev => ({
        ...prev,
        [permission]: {
          status,
          loading: false,
          error: null,
        },
      }));

      // Registra o evento
      await logEvent('permission_checked', {
        permission,
        status,
        platform: Platform.OS,
      });

      return status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar permissão';
      recordError(error instanceof Error ? error : new Error(errorMessage));

      setState(prev => ({
        ...prev,
        [permission]: {
          status: 'undetermined',
          loading: false,
          error: errorMessage,
        },
      }));

      return 'undetermined';
    }
  }, [logEvent, recordError]);

  // Solicita uma permissão específica
  const requestPermission = useCallback(async (permission: PermissionType) => {
    try {
      setState(prev => ({
        ...prev,
        [permission]: { ...prev[permission], loading: true, error: null },
      }));

      const { status } = await Permissions.requestAsync(permission);

      setState(prev => ({
        ...prev,
        [permission]: {
          status,
          loading: false,
          error: null,
        },
      }));

      // Registra o evento
      await logEvent('permission_requested', {
        permission,
        status,
        platform: Platform.OS,
      });

      // Mostra toast com o resultado
      if (status === 'granted') {
        showToast({
          type: 'success',
          message: 'Permissão concedida',
          description: `Acesso ${permission} foi permitido`,
        });
      } else if (status === 'denied') {
        showToast({
          type: 'error',
          message: 'Permissão negada',
          description: `Acesso ${permission} foi negado`,
        });
      }

      return status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao solicitar permissão';
      recordError(error instanceof Error ? error : new Error(errorMessage));

      setState(prev => ({
        ...prev,
        [permission]: {
          status: 'undetermined',
          loading: false,
          error: errorMessage,
        },
      }));

      showToast({
        type: 'error',
        message: 'Erro ao solicitar permissão',
        description: errorMessage,
      });

      return 'undetermined';
    }
  }, [logEvent, recordError, showToast]);

  // Verifica múltiplas permissões
  const checkMultiplePermissions = useCallback(async (permissions: PermissionType[]) => {
    try {
      const results = await Promise.all(
        permissions.map(permission => checkPermission(permission))
      );

      return permissions.reduce((acc, permission, index) => {
        acc[permission] = results[index];
        return acc;
      }, {} as Record<PermissionType, Permissions.PermissionStatus>);
    } catch (error) {
      recordError(error instanceof Error ? error : new Error('Erro ao verificar múltiplas permissões'));
      return {};
    }
  }, [checkPermission, recordError]);

  // Solicita múltiplas permissões
  const requestMultiplePermissions = useCallback(async (permissions: PermissionType[]) => {
    try {
      const results = await Promise.all(
        permissions.map(permission => requestPermission(permission))
      );

      return permissions.reduce((acc, permission, index) => {
        acc[permission] = results[index];
        return acc;
      }, {} as Record<PermissionType, Permissions.PermissionStatus>);
    } catch (error) {
      recordError(error instanceof Error ? error : new Error('Erro ao solicitar múltiplas permissões'));
      return {};
    }
  }, [requestPermission, recordError]);

  // Verifica se todas as permissões foram concedidas
  const areAllPermissionsGranted = useCallback((permissions: PermissionType[]) => {
    return permissions.every(
      permission => state[permission]?.status === 'granted'
    );
  }, [state]);

  // Verifica se alguma permissão foi negada
  const areAnyPermissionsDenied = useCallback((permissions: PermissionType[]) => {
    return permissions.some(
      permission => state[permission]?.status === 'denied'
    );
  }, [state]);

  // Verifica se alguma permissão está pendente
  const areAnyPermissionsPending = useCallback((permissions: PermissionType[]) => {
    return permissions.some(
      permission => state[permission]?.status === 'undetermined'
    );
  }, [state]);

  return {
    state,
    checkPermission,
    requestPermission,
    checkMultiplePermissions,
    requestMultiplePermissions,
    areAllPermissionsGranted,
    areAnyPermissionsDenied,
    areAnyPermissionsPending,
  };
}; 