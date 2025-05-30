import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { Notification } from '../../types';
import { formatDateTime } from '../../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
  style?: ViewStyle;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  style,
}) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (notification.type) {
      case 'appointment':
        return 'calendar';
      case 'message':
        return 'message';
      case 'payment':
        return 'credit-card';
      case 'system':
        return 'information';
      default:
        return 'bell';
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'appointment':
        return '#1976D2';
      case 'message':
        return '#2E7D32';
      case 'payment':
        return '#F57C00';
      case 'system':
        return '#666';
      default:
        return '#666';
    }
  };

  return (
    <Card
      style={[
        styles.card,
        !notification.read && styles.unread,
        style,
      ]}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon
              name={getIcon()}
              size={24}
              color={getIconColor()}
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.message}>{notification.message}</Text>
            <Text style={styles.time}>
              {formatDateTime(notification.createdAt)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    elevation: 1,
  },
  unread: {
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
}); 