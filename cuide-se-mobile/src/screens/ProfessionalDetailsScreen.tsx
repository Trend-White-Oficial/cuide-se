import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '../components/ui/Header';
import { ServiceCard } from '../components/ui/ServiceCard';
import { ReviewCard } from '../components/ui/ReviewCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { Professional, Service, Review } from '../types';

interface RouteParams {
  professional: Professional;
}

export const ProfessionalDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { professional } = route.params as RouteParams;
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setError(null);
      setLoading(true);
      const [servicesRes, reviewsRes] = await Promise.all([
        supabase.from('services').select('*').eq('professional_id', professional.id),
        supabase.from('reviews').select('*').eq('professional_id', professional.id),
      ]);
      if (servicesRes.error) throw servicesRes.error;
      if (reviewsRes.error) throw reviewsRes.error;
      setServices(servicesRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      setError('Erro ao carregar detalhes do profissional.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingSpinner message="Carregando detalhes..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDetails} />;
  }

  return (
    <View style={styles.container}>
      <Header title={professional.name} />
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          {/* Aqui você pode usar um componente Avatar customizado se desejar */}
          {/* <Avatar source={professional.avatar} name={professional.name} size={80} /> */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Button
                title="Agendar com este profissional"
                onPress={() => navigation.navigate('Schedule', { professional })}
                style={styles.button}
              />
            </View>
            <View style={styles.infoRow}>
              <Button
                title="Ver avaliações"
                onPress={() => {}}
                variant="outline"
                style={styles.button}
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Header title="Serviços oferecidos" showBackButton={false} />
          {services.length > 0 ? (
            services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => navigation.navigate('ServiceDetails', { service })}
              />
            ))
          ) : (
            <EmptyState
              icon="spa"
              title="Nenhum serviço encontrado"
              message="Este profissional ainda não cadastrou serviços."
            />
          )}
        </View>
        <View style={styles.section}>
          <Header title="Avaliações" showBackButton={false} />
          {reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                clientName={review.client_name}
                clientAvatar={review.client_avatar}
              />
            ))
          ) : (
            <EmptyState
              icon="star-outline"
              title="Nenhuma avaliação ainda"
              message="Este profissional ainda não recebeu avaliações."
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
  },
  infoBox: {
    width: '100%',
    marginTop: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  button: {
    width: '100%',
  },
  section: {
    padding: 16,
  },
}); 