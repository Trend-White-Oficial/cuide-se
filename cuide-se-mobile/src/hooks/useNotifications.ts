import { useState, useCallback, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { notificationService, Notification } from '../services/notifications';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  data?: any;
  read: boolean;
  created_at: string;
}

interface CreateNotificationData {
  title: string;
  body: string;
  data?: any;
}

interface NotificationState {
  token: string | null;
  permission: boolean;
  loading: boolean;
  error: string | null;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar notificações'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao marcar notificação como lida'));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const hasPermission = await notificationService.requestPermission();
      if (hasPermission) {
        await notificationService.getToken();
      }
      return hasPermission;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao solicitar permissão de notificações'));
      return false;
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();

      const unsubscribe = notificationService.onMessage(notification => {
        setNotifications(prev => [notification, ...prev]);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, fetchNotifications]);

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    requestPermission,
  };
};