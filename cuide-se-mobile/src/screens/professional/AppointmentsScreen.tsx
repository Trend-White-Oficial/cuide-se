import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  client: {
    id: string;
    name: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
}

export const ProfessionalAppointmentsScreen: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  const fetchAppointments = async () => {
    try {
      setError(null);
      let query = supabase
        .from('appointments')
        .select(`
          *,
          client:clients(*),
          service:services(*)
        `)
        .eq('professional_id', user?.id)
        .order('date', { ascending: true });

      if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        query = query
          .gte('date', today)
          .lt('date', new Date(Date.now() + 86400000).toISOString().split('T')[0]);
      } else if (filter === 'week') {
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        query = query.gte('date', weekStart.toISOString().split('T')[0]);
      }

      const { data, error: err } = await query;

      if (err) throw err;
      setAppointments(data || []);
    } catch (err) {
      setError('Erro ao carregar agendamentos.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      const { error: err } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (err) throw err;
      fetchAppointments();
    } catch (err) {
      setError('Erro ao atualizar status do agendamento.');
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando agendamentos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAppointments} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Agendamentos" />
      <View style={styles.filterContainer}>
        <Button
          title="Todos"
          onPress={() => setFilter('all')}
          variant={filter === 'all' ? 'primary' : 'secondary'}
        />
        <Button
          title="Hoje"
          onPress={() => setFilter('today')}
          variant={filter === 'today' ? 'primary' : 'secondary'}
        />
        <Button
          title="Esta Semana"
          onPress={() => setFilter('week')}
          variant={filter === 'week' ? 'primary' : 'secondary'}
        />
      </View>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {appointments.length ? (
          appointments.map(appointment => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <Header
                title={appointment.client.name}
                subtitle={appointment.client.phone}
                showBackButton={false}
              />
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
              {appointment.status === 'scheduled' && (
                <View style={styles.actionsContainer}>
                  <Button
                    title="Concluir"
                    onPress={() => handleUpdateStatus(appointment.id, 'completed')}
                    variant="primary"
                  />
                  <Button
                    title="Cancelar"
                    onPress={() => handleUpdateStatus(appointment.id, 'cancelled')}
                    variant="secondary"
                  />
                </View>
              )}
            </View>
          ))
        ) : (
          <EmptyState
            icon="calendar"
            title="Nenhum agendamento"
            message="Não há agendamentos para o período selecionado."
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  content: {
    flex: 1,
  },
  appointmentCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
}); 