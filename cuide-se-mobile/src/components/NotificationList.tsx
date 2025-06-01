import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { NotificationCard } from './NotificationCard';
import { EmptyState } from './EmptyState';
import { theme } from '../theme';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'payment' | 'system' | 'promotion';
  date: Date;
  read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onNotificationPress?: (notification: Notification) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  style?: any;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationPress,
  onRefresh,
  refreshing = false,
  style,
}) => {
  const renderEmptyState = () => (
    <EmptyState
      icon="bell-off"
      title="Nenhuma notificação"
      message="Você não tem notificações no momento"
    />
  );

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationCard
      id={item.id}
      title={item.title}
      message={item.message}
      type={item.type}
      date={item.date}
      read={item.read}
      onPress={() => onNotificationPress?.(item)}
    />
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
}); 