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
import { Chat } from '../services/chat';

interface ChatCardProps {
  chat: Chat;
  onPress: () => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({
  chat,
  onPress,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const formatDate = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return t('chat.minutesAgo', { minutes: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t('chat.hoursAgo', { hours: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return t('chat.daysAgo', { days: diffInDays });
    }

    return messageDate.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.card },
      ]}
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <Icon
          name="person"
          size={40}
          color={theme.colors.primary}
        />
        {chat.unreadCount > 0 && (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={styles.badgeText}>
              {chat.unreadCount}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {chat.professionalName}
          </Text>
          {chat.lastMessage && (
            <Text style={styles.date}>
              {formatDate(chat.lastMessage.createdAt)}
            </Text>
          )}
        </View>

        {chat.lastMessage && (
          <Text
            style={[
              styles.message,
              chat.unreadCount > 0 && { fontWeight: '500' },
            ]}
            numberOfLines={1}
          >
            {chat.lastMessage.content}
          </Text>
        )}
      </View>
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
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
  message: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 