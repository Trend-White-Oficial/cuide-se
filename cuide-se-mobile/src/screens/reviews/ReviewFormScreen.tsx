import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useReviews } from '../../hooks/useReviews';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Icon } from '../../components/Icon';
import { Divider } from '../../components/Divider';

export const ReviewFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId } = route.params as { appointmentId: string };
  const { createReview, isLoading, error } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    try {
      if (rating === 0) {
        throw new Error(t('reviews.selectRating'));
      }

      await createReview({
        appointmentId,
        rating,
        comment,
      });

      navigation.goBack();
    } catch (error) {
      setError(error instanceof Error ? error.message : t('reviews.error'));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('reviews.writeReview')}</Text>
        </View>

        <View style={styles.content}>
          {error && <ErrorMessage message={error} />}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('reviews.rating')}
            </Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(value => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleRatingPress(value)}
                  style={styles.ratingButton}
                >
                  <Icon
                    name="star"
                    size={32}
                    color={value <= rating ? '#FFD700' : '#E1E1E1'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('reviews.comment')}
            </Text>
            <Input
              value={comment}
              onChangeText={setComment}
              placeholder={t('reviews.commentPlaceholder')}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={styles.commentInput}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('reviews.submit')}
          onPress={handleSubmit}
          disabled={rating === 0}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  ratingButton: {
    padding: 8,
  },
  commentInput: {
    height: 120,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    backgroundColor: '#FFF',
  },
  button: {
    width: '100%',
  },
}); 