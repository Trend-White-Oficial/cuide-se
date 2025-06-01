import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useChat } from '../../hooks/useChat';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { ChatCard } from '../../components/ChatCard';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { SearchBar } from '../../components/SearchBar';

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { chats, isLoading, error, fetchChats } = useChat();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleChatPress = (chatId: string) => {
    navigation.navigate('Chat', { chatId });
  };

  const filteredChats = chats?.filter(chat =>
    chat.professionalName
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const renderChat = useCallback(({ item }) => (
    <ChatCard
      chat={item}
      onPress={() => handleChatPress(item.id)}
    />
  ), []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={fetchChats} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('chat.list')}</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder={t('chat.searchPlaceholder')}
        />
      </View>

      {filteredChats?.length === 0 ? (
        <EmptyState
          icon="chat"
          title={t('chat.noChats')}
          message={t('chat.noChatsMessage')}
        />
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChat}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchChats}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
    gap: 16,
  },
}); 