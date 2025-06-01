import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { NotificationCard } from '../../components/NotificationCard';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { FilterModal } from '../../components/FilterModal';
import { SearchBar } from '../../components/SearchBar';
import { Icon } from '../../components/Icon';

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { notifications, isLoading, error, fetchNotifications, markAsRead } = useNotifications();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    read: '',
    dateRange: '',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterModalVisible(false);
  };

  const handleNotificationPress = async (notificationId: string) => {
    await markAsRead(notificationId);
    // Navegar para a tela apropriada baseada no tipo de notificação
    // navigation.navigate(...);
  };

  const filteredNotifications = notifications?.filter(notification => {
    const matchesSearch = notification.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      notification.body
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesRead = filters.read === '' ||
      (filters.read === 'read' && notification.read) ||
      (filters.read === 'unread' && !notification.read);

    const matchesDateRange = !filters.dateRange ||
      (filters.dateRange === 'week' && isWithinLastWeek(notification.createdAt)) ||
      (filters.dateRange === 'month' && isWithinLastMonth(notification.createdAt)) ||
      (filters.dateRange === 'year' && isWithinLastYear(notification.createdAt));

    return matchesSearch && matchesRead && matchesDateRange;
  });

  const renderNotification = useCallback(({ item }) => (
    <NotificationCard
      notification={item}
      onPress={() => handleNotificationPress(item.id)}
    />
  ), []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={fetchNotifications} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('notifications.title')}</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder={t('notifications.searchPlaceholder')}
          onFilterPress={() => setIsFilterModalVisible(true)}
        />
      </View>

      {filteredNotifications?.length === 0 ? (
        <EmptyState
          icon="bell"
          title={t('notifications.noNotifications')}
          message={t('notifications.noNotificationsMessage')}
        />
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchNotifications}
            />
          }
        />
      )}

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleFilter}
        initialFilters={filters}
      />
    </View>
  );
};

const isWithinLastWeek = (date: string) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return new Date(date) >= weekAgo;
};

const isWithinLastMonth = (date: string) => {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  return new Date(date) >= monthAgo;
};

const isWithinLastYear = (date: string) => {
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  return new Date(date) >= yearAgo;
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