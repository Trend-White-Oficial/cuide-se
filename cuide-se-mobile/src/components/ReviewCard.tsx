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
import { Review } from '../services/reviews';

interface ReviewCardProps {
  review: Review;
  onPress: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onPress,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const formatDate = (date: string) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return t('reviews.minutesAgo', { minutes: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t('reviews.hoursAgo', { hours: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return t('reviews.daysAgo', { days: diffInDays });
    }

    return reviewDate.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Icon
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={index < rating ? theme.colors.warning : theme.colors.text}
      />
    ));
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.card },
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.ratingContainer}>
          {renderStars(review.rating)}
        </View>
        <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
      </View>

      <Text style={styles.comment}>{review.comment}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 