import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationConfig {
  title: string;
  body: string;
  data?: Record<string, any>;
}

interface NotificationPermission {
  granted: boolean;
  status: Notifications.PermissionStatus;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    status: 'undetermined',
  });

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';

      setPermission({
        granted,
        status,
      });

      if (granted) {
        await AsyncStorage.setItem('@CuideSe:notifications:permission', 'granted');
      }

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificações:', error);
      return false;
    }
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const granted = status === 'granted';

      setPermission({
        granted,
        status,
      });

      return granted;
    } catch (error) {
      console.error('Erro ao verificar permissão de notificações:', error);
      return false;
    }
  }, []);

  const scheduleNotification = useCallback(async ({
    title,
    body,
    data,
  }: NotificationConfig) => {
    try {
      if (!permission.granted) {
        const granted = await requestPermission();
        if (!granted) return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Notificação imediata
      });
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  }, [permission.granted, requestPermission]);

  const scheduleLocalNotification = useCallback(async ({
    title,
    body,
    data,
    trigger,
  }: NotificationConfig & {
    trigger: Notifications.NotificationTriggerInput;
  }) => {
    try {
      if (!permission.granted) {
        const granted = await requestPermission();
        if (!granted) return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger,
      });
    } catch (error) {
      console.error('Erro ao agendar notificação local:', error);
    }
  }, [permission.granted, requestPermission]);

  const cancelAllNotifications = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
    }
  }, []);

  useEffect(() => {
    checkPermission();

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notificação recebida:', notification);
      }
    );

    return () => {
      subscription.remove();
    };
  }, [checkPermission]);

  return {
    permission,
    requestPermission,
    checkPermission,
    scheduleNotification,
    scheduleLocalNotification,
    cancelAllNotifications,
  };
};