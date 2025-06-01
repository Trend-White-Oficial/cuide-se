import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from './supabase';

const NOTIFICATION_TOKEN_KEY = '@notifications:token';

export interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  async requestPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificações:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      await this.saveToken(token);
      return token;
    } catch (error) {
      console.error('Erro ao obter token de notificação:', error);
      return null;
    }
  }

  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);
      await this.updateTokenOnServer(token);
    } catch (error) {
      console.error('Erro ao salvar token de notificação:', error);
    }
  }

  private async updateTokenOnServer(token: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_tokens')
          .upsert({
            user_id: user.id,
            token,
            platform: Platform.OS,
            updated_at: new Date().toISOString(),
          });
      }
    } catch (error) {
      console.error('Erro ao atualizar token no servidor:', error);
    }
  }

  async onMessage(callback: (notification: Notification) => void): Promise<void> {
    messaging().onMessage(async remoteMessage => {
      const notification: Notification = {
        id: remoteMessage.messageId || Date.now().toString(),
        title: remoteMessage.notification?.title || '',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        read: false,
        createdAt: new Date().toISOString(),
      };

      callback(notification);
    });
  }

  async onNotificationOpenedApp(callback: (notification: Notification) => void): Promise<void> {
    messaging().onNotificationOpenedApp(remoteMessage => {
      const notification: Notification = {
        id: remoteMessage.messageId || Date.now().toString(),
        title: remoteMessage.notification?.title || '',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        read: false,
        createdAt: new Date().toISOString(),
      };

      callback(notification);
    });
  }

  async getInitialNotification(): Promise<Notification | null> {
    try {
      const remoteMessage = await messaging().getInitialNotification();
      if (remoteMessage) {
        return {
          id: remoteMessage.messageId || Date.now().toString(),
          title: remoteMessage.notification?.title || '',
          body: remoteMessage.notification?.body || '',
          data: remoteMessage.data,
          read: false,
          createdAt: new Date().toISOString(),
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter notificação inicial:', error);
      return null;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter notificações:', error);
      return [];
    }
  }
}

export const notificationService = new NotificationService(); 