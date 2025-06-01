import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { Text } from './Text';
import { Icon } from './Icon';
import { Message } from '../services/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MessageBubbleProps {
  message: {
    content: string;
    createdAt: string;
    senderId: string;
    type: 'text' | 'image' | 'file';
  };
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const renderStatus = () => {
    if (!isOwnMessage) return null;

    switch (message.status) {
      case 'sent':
        return (
          <Icon
            name="check"
            size={16}
            color={theme.colors.text}
            style={styles.statusIcon}
          />
        );
      case 'delivered':
        return (
          <Icon
            name="check-double"
            size={16}
            color={theme.colors.text}
            style={styles.statusIcon}
          />
        );
      case 'read':
        return (
          <Icon
            name="check-double"
            size={16}
            color={theme.colors.primary}
            style={styles.statusIcon}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text
            style={[
              styles.text,
              isOwnMessage && { color: '#fff' },
            ]}
          >
            {message.content}
          </Text>
        );
      case 'image':
        return (
          <View style={styles.imageContainer}>
            <Icon
              name="image"
              size={24}
              color={isOwnMessage ? '#fff' : theme.colors.text}
            />
            <Text
              style={[
                styles.imageText,
                isOwnMessage && { color: '#fff' },
              ]}
            >
              {t('chat.image')}
            </Text>
          </View>
        );
      case 'file':
        return (
          <View style={styles.fileContainer}>
            <Icon
              name="file"
              size={24}
              color={isOwnMessage ? '#fff' : theme.colors.text}
            />
            <Text
              style={[
                styles.fileText,
                isOwnMessage && { color: '#fff' },
              ]}
            >
              {t('chat.file')}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isOwnMessage
              ? theme.colors.primary
              : theme.colors.background,
          },
        ]}
      >
        {renderContent()}
        <View style={styles.footer}>
          <Text
            style={[
              styles.time,
              {
                color: isOwnMessage
                  ? theme.colors.white
                  : theme.colors.textSecondary,
              },
            ]}
          >
            {formatDate(message.createdAt)}
          </Text>
          {renderStatus()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageText: {
    fontSize: 14,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  statusIcon: {
    marginLeft: 4,
  },
}); 