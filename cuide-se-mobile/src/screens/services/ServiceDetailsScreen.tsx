import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useServices } from '../../hooks/useServices';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ReviewCard } from '../../components/ReviewCard';
import { Icon } from '../../components/Icon';
import { Divider } from '../../components/Divider';
import { useReviews } from '../../hooks/useReviews';

export const ServiceDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId } = route.params as { serviceId: string };
  const { getServiceById, isLoading, error } = useServices();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { getServiceReviews } = useReviews();
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const service = getServiceById(serviceId);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const data = await getServiceReviews(serviceId);
        setReviews(data);
      } catch (error) {
        // erro tratado pelo hook
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [serviceId]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  const handleSchedule = () => {
    navigation.navigate('ScheduleService', { serviceId });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !service) {
    return <ErrorMessage message={error?.message || t('services.notFound')} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: service.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{service.name}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>
                  {service.rating.toFixed(1)}
                </Text>
                <Text style={styles.reviews}>
                  ({service.reviews.length} {t('services.reviews')})
                </Text>
              </View>
            </View>
            <Text style={styles.price}>
              R$ {service.price.toFixed(2)}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Icon name="clock" size={20} />
              <Text style={styles.infoText}>
                {service.duration} {t('services.minutes')}
              </Text>
            </View>
            <View style={styles.info}>
              <Icon name="map-pin" size={20} />
              <Text style={styles.infoText}>
                {service.location}
              </Text>
            </View>
          </View>

          <Divider />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('services.description')}
            </Text>
            <Text
              style={styles.description}
              numberOfLines={showFullDescription ? undefined : 3}
            >
              {service.description}
            </Text>
            {service.description.length > 150 && (
              <TouchableOpacity
                onPress={() => setShowFullDescription(!showFullDescription)}
              >
                <Text style={styles.readMore}>
                  {showFullDescription
                    ? t('services.showLess')
                    : t('services.readMore')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Divider />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('services.reviews')}
            </Text>
            {isLoadingReviews ? (
              <Loading />
            ) : (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Icon name="star" size={20} color={theme.colors.primary} />
                  <Text style={{ fontSize: 16, marginLeft: 4 }}>
                    {averageRating ? `${averageRating} / 5` : t('service.noReviews')}
                  </Text>
                  <Text style={{ fontSize: 14, marginLeft: 8, color: theme.colors.textSecondary }}>
                    {reviews.length > 0 ? `(${reviews.length} ${t('service.reviewsCount')})` : ''}
                  </Text>
                </View>
                {reviews.length === 0 ? (
                  <Text style={{ opacity: 0.7 }}>{t('service.noReviewsMessage')}</Text>
                ) : (
                  reviews.slice(0, 3).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                )}
                <TouchableOpacity
                  style={{ marginTop: 12 }}
                  onPress={() => navigation.navigate('ReviewList', { serviceId })}
                >
                  <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    {t('service.seeAllReviews')}
                  </Text>
                </TouchableOpacity>
                <Button
                  title={t('service.addReview')}
                  onPress={() => navigation.navigate('ReviewForm', { serviceId })}
                  style={{ marginTop: 8 }}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('services.schedule')}
          onPress={handleSchedule}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviews: {
    fontSize: 14,
    opacity: 0.6,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  readMore: {
    color: '#007AFF',
    marginTop: 8,
  },
  review: {
    marginBottom: 16,
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