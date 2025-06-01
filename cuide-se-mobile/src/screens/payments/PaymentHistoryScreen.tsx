import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePayments } from '../../hooks/usePayments';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { PaymentCard } from '../../components/PaymentCard';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { FilterModal } from '../../components/FilterModal';
import { SearchBar } from '../../components/SearchBar';

export const PaymentHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { payments, isLoading, error, fetchPayments } = usePayments();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    amountRange: '',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterModalVisible(false);
  };

  const handlePaymentPress = (paymentId: string) => {
    navigation.navigate('PaymentDetails', { paymentId });
  };

  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = payment.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      payment.serviceId
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status ||
      payment.status === filters.status;

    const matchesDateRange = !filters.dateRange ||
      (filters.dateRange === 'week' && isWithinLastWeek(payment.createdAt)) ||
      (filters.dateRange === 'month' && isWithinLastMonth(payment.createdAt)) ||
      (filters.dateRange === 'year' && isWithinLastYear(payment.createdAt));

    const matchesAmountRange = !filters.amountRange ||
      (filters.amountRange === 'low' && payment.amount <= 50) ||
      (filters.amountRange === 'medium' && payment.amount > 50 && payment.amount <= 200) ||
      (filters.amountRange === 'high' && payment.amount > 200);

    return matchesSearch && matchesStatus && matchesDateRange && matchesAmountRange;
  });

  const renderPayment = useCallback(({ item }) => (
    <PaymentCard
      payment={item}
      onPress={() => handlePaymentPress(item.id)}
    />
  ), []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={fetchPayments} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('payments.history')}</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder={t('payments.searchPlaceholder')}
          onFilterPress={() => setIsFilterModalVisible(true)}
        />
      </View>

      {filteredPayments?.length === 0 ? (
        <EmptyState
          icon="credit-card"
          title={t('payments.noPayments')}
          message={t('payments.noPaymentsMessage')}
        />
      ) : (
        <FlatList
          data={filteredPayments}
          renderItem={renderPayment}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchPayments}
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