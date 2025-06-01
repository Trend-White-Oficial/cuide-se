import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useChat } from '../../hooks/useChat';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { MessageBubble } from '../../components/MessageBubble';
import { Icon } from '../../components/Icon';

export const ChatScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { chatId } = route.params as { chatId: string };
  const {
    messages,
    isLoading,
    error,
    fetchMessages,
    sendMessage,
    markMessagesAsRead,
    deleteChat,
  } = useChat();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = async () => {
    try {
      await fetchMessages(chatId);
      await markMessagesAsRead(chatId);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setIsSending(true);
      await sendMessage({
        chatId,
        content: message.trim(),
        type: 'text',
      });
      setMessage('');
    } catch (err) {
      Alert.alert(
        t('common.error'),
        t('chat.sendError')
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('chat.deleteConfirmTitle'),
      t('chat.deleteConfirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChat(chatId);
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                t('common.error'),
                t('chat.deleteError')
              );
            }
          },
        },
      ]
    );
  };

  const renderMessage = useCallback(({ item }) => (
    <MessageBubble
      message={item}
      isOwnMessage={item.senderId === user?.id}
    />
  ), [user]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={loadMessages} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Button
          icon="arrow-back"
          onPress={() => navigation.goBack()}
          variant="ghost"
        />
        <Text style={styles.title}>{t('chat.title')}</Text>
        <Button
          icon="delete"
          onPress={handleDelete}
          variant="ghost"
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={t('chat.messagePlaceholder')}
          multiline
          style={styles.input}
        />
        <Button
          icon="send"
          onPress={handleSend}
          loading={isSending}
          disabled={!message.trim() || isSending}
          style={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  messages: {
    padding: 16,
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
}); 