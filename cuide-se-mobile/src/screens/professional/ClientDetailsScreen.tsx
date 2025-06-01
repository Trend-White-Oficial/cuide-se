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

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  appointments: {
    id: string;
    date: string;
    time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    service: {
      id: string;
      name: string;
      duration: number;
      price: number;
    };
  }[];
}

export const ProfessionalClientDetailsScreen: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientId = (route.params as { clientId: string }).clientId;

  const fetchClientDetails = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('clients')
        .select(`
          *,
          appointments:appointments(
            id,
            date,
            time,
            status,
            service:services(*)
          )
        `)
        .eq('id', clientId)
        .eq('professional_id', user?.id)
        .single();

      if (err) throw err;
      setClient(data);
    } catch (err) {
      setError('Erro ao carregar detalhes do cliente.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClientDetails();
  };

  const handleScheduleAppointment = () => {
    // TODO: Implementar navegação para agendamento
    console.log('Agendar para cliente:', clientId);
  };

  const handleSendMessage = () => {
    // TODO: Implementar navegação para chat
    console.log('Enviar mensagem para cliente:', clientId);
  };

  if (loading) {
    return <LoadingSpinner message="Carregando detalhes do cliente..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchClientDetails} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Detalhes do Cliente" />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Header title="Informações Pessoais" showBackButton={false} />
          <View style={styles.infoContainer}>
            <Header title="Nome" subtitle={client?.name} showBackButton={false} />
            <Header title="Email" subtitle={client?.email} showBackButton={false} />
            <Header title="Telefone" subtitle={client?.phone} showBackButton={false} />
            <Header
              title="Cliente desde"
              subtitle={new Date(client?.created_at || '').toLocaleDateString()}
              showBackButton={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header title="Histórico de Agendamentos" showBackButton={false} />
          {client?.appointments.length ? (
            client.appointments.map(appointment => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <Header
                  title={appointment.service.name}
                  subtitle={`${appointment.service.duration}min - R$ ${appointment.service.price.toFixed(2)}`}
                  showBackButton={false}
                />
                <Header
                  title={`${new Date(appointment.date).toLocaleDateString()} ${new Date(
                    appointment.time
                  ).toLocaleTimeString()}`}
                  subtitle={`Status: ${
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
              message="Este cliente ainda não possui agendamentos."
            />
          )}
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Agendar"
            onPress={handleScheduleAppointment}
            variant="primary"
          />
          <Button
            title="Enviar Mensagem"
            onPress={handleSendMessage}
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