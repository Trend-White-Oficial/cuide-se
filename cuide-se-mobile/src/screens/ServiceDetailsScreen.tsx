import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '../components/ui/Header';
import { ProfessionalCard } from '../components/ui/ProfessionalCard';
import { ReviewCard } from '../components/ui/ReviewCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { Service, Professional, Review } from '../types';

interface RouteParams {
  service: Service;
}

export const ServiceDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service } = route.params as RouteParams;
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setError(null);
      setLoading(true);
      const [professionalsRes, reviewsRes] = await Promise.all([
        supabase.from('professionals').select('*').eq('service_id', service.id),
        supabase.from('reviews').select('*').eq('service_id', service.id),
      ]);
      if (professionalsRes.error) throw professionalsRes.error;
      if (reviewsRes.error) throw reviewsRes.error;
      setProfessionals(professionalsRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      setError('Erro ao carregar detalhes do serviço.');
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
      <Header title={service.name} />
      <ScrollView style={styles.content}>
        <View style={styles.serviceSection}>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Button
                title="Agendar este serviço"
                onPress={() => navigation.navigate('Schedule', { service })}
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
          <Header title="Profissionais que oferecem este serviço" showBackButton={false} />
          {professionals.length > 0 ? (
            professionals.map(professional => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                onPress={() => navigation.navigate('ProfessionalDetails', { professional })}
              />
            ))
          ) : (
            <EmptyState
              icon="account-group"
              title="Nenhum profissional encontrado"
              message="Nenhum profissional oferece este serviço no momento."
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
              message="Este serviço ainda não recebeu avaliações."
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
  serviceSection: {
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