import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { Icon } from './Icon';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'payment' | 'system' | 'promotion';
  date: Date;
  read: boolean;
  onPress?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  message,
  type,
  date,
  read,
  onPress,
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    }

    if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    }

    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getTypeIcon = (type: NotificationCardProps['type']) => {
    switch (type) {
      case 'appointment':
        return 'calendar';
      case 'payment':
        return 'credit-card';
      case 'promotion':
        return 'gift';
      default:
        return 'bell';
    }
  };

  const getTypeColor = (type: NotificationCardProps['type']) => {
    switch (type) {
      case 'appointment':
        return '#007AFF';
      case 'payment':
        return '#34C759';
      case 'promotion':
        return '#FF9500';
      default:
        return '#666';
    }
  };

  return (
    <Card
      onPress={onPress}
      style={[
        styles.container,
        !read && styles.unreadContainer,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Icon
            name={getTypeIcon(type)}
            size={20}
            color={getTypeColor(type)}
          />
          {!read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>

      <Text style={[styles.title, !read && styles.unreadText]}>
        {title}
      </Text>

      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    padding: 16,
  },
  unreadContainer: {
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 