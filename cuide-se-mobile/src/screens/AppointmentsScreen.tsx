import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../components/ui/Header';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { Appointment } from '../types';

export const AppointmentsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          professional:professionals(*),
          service:services(*)
        `)
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;
      setAppointments(data || []);
    } catch (err) {
      setError('Erro ao carregar agendamentos.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      setError(null);
      const { error: cancelError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (cancelError) throw cancelError;
      await fetchAppointments();
    } catch (err) {
      setError('Erro ao cancelar agendamento.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  if (loading) {
    return <LoadingSpinner message="Carregando agendamentos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAppointments} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Meus Agendamentos" />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentInfo}>
                <Header
                  title={appointment.service.name}
                  showBackButton={false}
                />
                <View style={styles.details}>
                  <View style={styles.detailRow}>
                    <Header
                      title={`Profissional: ${appointment.professional.name}`}
                      showBackButton={false}
                    />
                  </View>
                  <View style={styles.detailRow}>
                    <Header
                      title={`Data: ${new Date(appointment.date).toLocaleDateString()}`}
                      showBackButton={false}
                    />
                  </View>
                  <View style={styles.detailRow}>
                    <Header
                      title={`Horário: ${new Date(appointment.time).toLocaleTimeString()}`}
                      showBackButton={false}
                    />
                  </View>
                </View>
                {new Date(appointment.date) > new Date() && (
                  <Button
                    title="Cancelar Agendamento"
                    onPress={() => handleCancel(appointment.id)}
                    variant="outline"
                    style={styles.cancelButton}
                  />
                )}
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="calendar"
            title="Nenhum agendamento"
            message="Você ainda não tem agendamentos."
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
  content: {
    flex: 1,
  },
  appointmentCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  appointmentInfo: {
    gap: 8,
  },
  details: {
    marginTop: 8,
  },
  detailRow: {
    marginBottom: 4,
  },
  cancelButton: {
    marginTop: 16,
  },
}); 