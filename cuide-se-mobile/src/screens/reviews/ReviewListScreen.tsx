import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useReviews } from '../../hooks/useReviews';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { ReviewCard } from '../../components/ReviewCard';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { FilterModal } from '../../components/FilterModal';
import { SearchBar } from '../../components/SearchBar';

export const ReviewListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { reviews, isLoading, error, fetchReviews } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    rating: '',
    dateRange: '',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterModalVisible(false);
  };

  const handleReviewPress = (reviewId: string) => {
    navigation.navigate('ReviewDetails', { reviewId });
  };

  const filteredReviews = reviews?.filter(review => {
    const matchesSearch = review.comment
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesRating = !filters.rating ||
      review.rating === parseInt(filters.rating);

    const matchesDateRange = !filters.dateRange ||
      (filters.dateRange === 'week' && isWithinLastWeek(review.createdAt)) ||
      (filters.dateRange === 'month' && isWithinLastMonth(review.createdAt)) ||
      (filters.dateRange === 'year' && isWithinLastYear(review.createdAt));

    return matchesSearch && matchesRating && matchesDateRange;
  });

  const renderReview = useCallback(({ item }) => (
    <ReviewCard
      review={item}
      onPress={() => handleReviewPress(item.id)}
    />
  ), []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={fetchReviews} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('reviews.list')}</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder={t('reviews.searchPlaceholder')}
          onFilterPress={() => setIsFilterModalVisible(true)}
        />
      </View>

      {filteredReviews?.length === 0 ? (
        <EmptyState
          icon="star"
          title={t('reviews.noReviews')}
          message={t('reviews.noReviewsMessage')}
        />
      ) : (
        <FlatList
          data={filteredReviews}
          renderItem={renderReview}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchReviews}
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