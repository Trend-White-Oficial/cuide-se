import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { useRoute, useNavigation } from '@react-navigation/native';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  created_at: string;
  appointments: {
    id: string;
    date: string;
    time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    client: {
      id: string;
      name: string;
    };
  }[];
}

export const ProfessionalServiceDetailsScreen: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceId = (route.params as { serviceId: string }).serviceId;

  const fetchServiceDetails = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('services')
        .select(`
          *,
          appointments:appointments(
            id,
            date,
            time,
            status,
            client:clients(id, name)
          )
        `)
        .eq('id', serviceId)
        .eq('professional_id', user?.id)
        .single();

      if (err) throw err;
      setService(data);
    } catch (err) {
      setError('Erro ao carregar detalhes do serviço.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServiceDetails();
  };

  const handleEditService = () => {
    // TODO: Implementar navegação para edição do serviço
    console.log('Editar serviço:', serviceId);
  };

  const handleDeleteService = async () => {
    try {
      const { error: err } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (err) throw err;
      navigation.goBack();
    } catch (err) {
      setError('Erro ao excluir serviço.');
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando detalhes do serviço..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchServiceDetails} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Detalhes do Serviço" />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Header title="Informações do Serviço" showBackButton={false} />
          <View style={styles.infoContainer}>
            <Header title="Nome" subtitle={service?.name} showBackButton={false} />
            <Header title="Descrição" subtitle={service?.description} showBackButton={false} />
            <Header
              title="Duração"
              subtitle={`${service?.duration} minutos`}
              showBackButton={false}
            />
            <Header
              title="Preço"
              subtitle={`R$ ${service?.price.toFixed(2)}`}
              showBackButton={false}
            />
            <Header
              title="Criado em"
              subtitle={new Date(service?.created_at || '').toLocaleDateString()}
              showBackButton={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header title="Histórico de Agendamentos" showBackButton={false} />
          {service?.appointments.length ? (
            service.appointments.map(appointment => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <Header
                  title={appointment.client.name}
                  subtitle={`${new Date(appointment.date).toLocaleDateString()} ${new Date(
                    appointment.time
                  ).toLocaleTimeString()}`}
                  showBackButton={false}
                />
                <Header
                  title={`Status: ${
                    appointment.status === 'scheduled'
                      ? 'Agendado'
                      : appointment.status === 'completed'
                      ? 'Concluído'
                      : 'Cancelado'
                  }`}
                  showBackButton={false}
                />
              </View>
            ))
          ) : (
            <EmptyState
              icon="calendar"
              title="Nenhum agendamento"
              message="Este serviço ainda não possui agendamentos."
            />
          )}
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Editar Serviço"
            onPress={handleEditService}
            variant="primary"
          />
          <Button
            title="Excluir Serviço"
            onPress={handleDeleteService}
            variant="secondary"
          />
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
  section: {
    padding: 16,
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  appointmentCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  actionsContainer: {
    padding: 16,
    gap: 8,
  },
}); 