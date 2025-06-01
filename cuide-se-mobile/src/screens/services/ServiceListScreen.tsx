import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServices } from '../../hooks/useServices';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { SearchBar } from '../../components/SearchBar';
import { ServiceCard } from '../../components/ServiceCard';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { FilterModal } from '../../components/FilterModal';

export const ServiceListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { services, isLoading, error, refetch } = useServices();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: '',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterModalVisible(false);
  };

  const handleServicePress = (serviceId: string) => {
    navigation.navigate('ServiceDetails', { serviceId });
  };

  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      service.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory = !filters.category ||
      service.category === filters.category;

    const matchesPriceRange = !filters.priceRange ||
      (filters.priceRange === 'low' && service.price <= 50) ||
      (filters.priceRange === 'medium' && service.price > 50 && service.price <= 100) ||
      (filters.priceRange === 'high' && service.price > 100);

    const matchesRating = !filters.rating ||
      service.rating >= parseInt(filters.rating);

    return matchesSearch && matchesCategory && matchesPriceRange && matchesRating;
  });

  const renderService = useCallback(({ item }) => (
    <ServiceCard
      service={item}
      onPress={() => handleServicePress(item.id)}
    />
  ), []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('services.title')}</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder={t('services.searchPlaceholder')}
          onFilterPress={() => setIsFilterModalVisible(true)}
        />
      </View>

      {filteredServices?.length === 0 ? (
        <EmptyState
          icon="search"
          title={t('services.noResults')}
          message={t('services.tryDifferentSearch')}
        />
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderService}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
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