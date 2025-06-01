import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { Text } from './Text';
import { Icon } from './Icon';
import { Notification } from '../services/notifications';

interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getIconName = () => {
    if (notification.data?.type === 'appointment') return 'calendar';
    if (notification.data?.type === 'payment') return 'credit-card';
    if (notification.data?.type === 'review') return 'star';
    return 'bell';
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return t('notifications.minutesAgo', { minutes: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t('notifications.hoursAgo', { hours: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return t('notifications.daysAgo', { days: diffInDays });
    }

    return notificationDate.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.card },
        !notification.read && styles.unread,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={getIconName()}
          size={24}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.body}>{notification.body}</Text>
        <Text style={styles.date}>{formatDate(notification.createdAt)}</Text>
      </View>

      {!notification.read && (
        <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  unread: {
    opacity: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    alignSelf: 'center',
  },
}); 