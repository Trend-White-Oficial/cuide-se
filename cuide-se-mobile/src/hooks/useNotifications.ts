import { useState, useCallback, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

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
  const { user } = useAuth();
  const [state, setState] = useState<NotificationState>({
    token: null,
    permission: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      const permission = existingStatus === 'granted';

      if (!permission) {
        const { status } = await Notifications.requestPermissionsAsync();
        setState(prev => ({
          ...prev,
          permission: status === 'granted',
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          permission,
          loading: false,
        }));
      }

      if (permission) {
        const token = await registerForPushNotifications();
        setState(prev => ({
          ...prev,
          token,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar permissões',
      }));
    }
  }, []);

  const registerForPushNotifications = useCallback(async () => {
    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      console.error('Erro ao registrar token:', error);
      return null;
    }
  }, []);

  const scheduleNotification = useCallback(async (
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
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
        error: error instanceof Error ? error.message : 'Erro ao agendar notificação',
      }));
    }
  }, []);

  const cancelNotification = useCallback(async (identifier: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await Notifications.cancelScheduledNotificationAsync(identifier);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao cancelar notificação',
      }));
    }
  }, []);

  const cancelAllNotifications = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await Notifications.cancelAllScheduledNotificationsAsync();

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao cancelar todas as notificações',
      }));
    }
  }, []);

  // Busca todas as notificações do usuário
  const getNotifications = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Notification[];
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar notificações',
      }));
      throw error;
    }
  }, [user]);

  // Busca notificações não lidas
  const getUnreadNotifications = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Notification[];
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar notificações não lidas',
      }));
      throw error;
    }
  }, [user]);

  // Cria uma nova notificação
  const createNotification = useCallback(async (data: CreateNotificationData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: user.id,
            ...data,
            read: false,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Envia a notificação push
      if (state.token) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: data.title,
            body: data.body,
            data: data.data,
          },
          trigger: null,
        });
      }

      return notification as Notification;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao criar notificação',
      }));
      throw error;
    }
  }, [user, state.token]);

  // Marca uma notificação como lida
  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: notification, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return notification as Notification;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao marcar notificação como lida',
      }));
      throw error;
    }
  }, [user]);

  // Marca todas as notificações como lidas
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        throw error;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao marcar todas as notificações como lidas',
      }));
      throw error;
    }
  }, [user]);

  // Remove uma notificação
  const deleteNotification = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao remover notificação',
      }));
      throw error;
    }
  }, [user]);

  return {
    ...state,
    getNotifications,
    getUnreadNotifications,
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
  };
};