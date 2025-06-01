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
import { TextInput } from '../../components/TextInput';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Icon } from '../../components/Icon';

export const EditReviewScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { reviewId } = route.params as { reviewId: string };
  const { getReviewById, updateReview } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [review, setReview] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadReview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getReviewById(reviewId);
      setReview(data);
      setRating(data.rating);
      setComment(data.comment);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReview();
  }, [reviewId]);

  const handleSave = async () => {
    if (rating === 0) {
      Alert.alert(
        t('common.error'),
        t('reviews.ratingRequired')
      );
      return;
    }

    if (!comment.trim()) {
      Alert.alert(
        t('common.error'),
        t('reviews.commentRequired')
      );
      return;
    }

    try {
      setIsSaving(true);
      await updateReview(reviewId, {
        rating,
        comment: comment.trim(),
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        t('common.error'),
        t('reviews.updateError')
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Icon
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={32}
        color={theme.colors.primary}
        onPress={() => setRating(index + 1)}
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
        <Text style={styles.title}>{t('reviews.edit')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.ratingContainer}>
          {renderStars()}
        </View>

        <TextInput
          label={t('reviews.comment')}
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          style={styles.commentInput}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title={t('common.save')}
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
        />
        <Button
          title={t('common.cancel')}
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.cancelButton}
          disabled={isSaving}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  commentInput: {
    minHeight: 120,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
}); 