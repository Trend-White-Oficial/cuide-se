import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../components/ui/Header';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  type: 'appointment' | 'system' | 'promotion';
}

export const NotificationsScreen: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setNotifications(data || []);
    } catch (err) {
      setError('Erro ao carregar notificações.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (updateError) throw updateError;
      await fetchNotifications();
    } catch (err) {
      setError('Erro ao marcar notificação como lida.');
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (updateError) throw updateError;
      await fetchNotifications();
    } catch (err) {
      setError('Erro ao marcar todas as notificações como lidas.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  if (loading) {
    return <LoadingSpinner message="Carregando notificações..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchNotifications} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Notificações" />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length > 0 ? (
          <>
            <View style={styles.header}>
              <Button
                title="Marcar todas como lidas"
                onPress={handleMarkAllAsRead}
                variant="outline"
                style={styles.button}
              />
            </View>
            {notifications.map(notification => (
              <View
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadCard,
                ]}
              >
                <View style={styles.notificationInfo}>
                  <Header
                    title={notification.title}
                    showBackButton={false}
                  />
                  <Header
                    title={notification.message}
                    showBackButton={false}
                  />
                  <Header
                    title={new Date(notification.created_at).toLocaleString()}
                    showBackButton={false}
                  />
                </View>
                {!notification.read && (
                  <Button
                    title="Marcar como lida"
                    onPress={() => handleMarkAsRead(notification.id)}
                    variant="outline"
                    style={styles.button}
                  />
                )}
              </View>
            ))}
          </>
        ) : (
          <EmptyState
            icon="bell-off"
            title="Nenhuma notificação"
            message="Você não tem notificações no momento."
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  notificationCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  unreadCard: {
    backgroundColor: '#e3f2fd',
  },
  notificationInfo: {
    gap: 8,
  },
  button: {
    marginTop: 8,
  },
}); 