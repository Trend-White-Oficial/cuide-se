import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useReviews } from '../../hooks/useReviews';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Icon } from '../../components/Icon';

export const ReviewDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { reviewId } = route.params as { reviewId: string };
  const { getReviewById, updateReview, deleteReview } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [review, setReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getReviewById(reviewId);
      setReview(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReview();
  }, [reviewId]);

  const handleEdit = () => {
    navigation.navigate('EditReview', { reviewId });
  };

  const handleDelete = async () => {
    Alert.alert(
      t('reviews.deleteConfirmTitle'),
      t('reviews.deleteConfirmMessage'),
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
              await deleteReview(reviewId);
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                t('common.error'),
                t('reviews.deleteError')
              );
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.text;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Icon
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={24}
        color={theme.colors.primary}
      />
    ));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={loadReview} />;
  }

  if (!review) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.ratingContainer}>
          {renderStars(review.rating)}
        </View>
        <Text style={styles.date}>
          {formatDate(review.createdAt)}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.comment}>{review.comment}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('reviews.status')}</Text>
          <Text
            style={[
              styles.value,
              { color: getStatusColor(review.status) },
            ]}
          >
            {t(`reviews.status.${review.status}`)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('reviews.service')}</Text>
          <Text style={styles.value}>{review.serviceName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('reviews.professional')}</Text>
          <Text style={styles.value}>{review.professionalName}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title={t('common.edit')}
          onPress={handleEdit}
          style={styles.editButton}
        />
        <Button
          title={t('common.delete')}
          onPress={handleDelete}
          variant="secondary"
          style={styles.deleteButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  date: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  comment: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  editButton: {
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
}); 