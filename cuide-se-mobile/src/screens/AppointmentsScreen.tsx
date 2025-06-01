import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { AppointmentCard } from '../components/AppointmentCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  service: {
    name: string;
    duration: number;
  };
  professional: {
    name: string;
  };
}

export const AppointmentsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(name, duration),
          professional:professionals(name)
        `)
        .eq('client_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setError('Não foi possível carregar seus agendamentos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelAppointment = useCallback(async (appointmentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      await fetchAppointments();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      setError('Não foi possível cancelar o agendamento.');
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments]);

  const handleConfirmAppointment = useCallback(async (appointmentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId);

      if (error) throw error;

      await fetchAppointments();
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      setError('Não foi possível confirmar o agendamento.');
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments]);

  const handleCompleteAppointment = useCallback(async (appointmentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', appointmentId);

      if (error) throw error;

      await fetchAppointments();
    } catch (error) {
      console.error('Erro ao concluir agendamento:', error);
      setError('Não foi possível concluir o agendamento.');
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments]);

  const renderItem = useCallback(({ item }: { item: Appointment }) => (
    <AppointmentCard
      appointment={item}
      onCancel={() => handleCancelAppointment(item.id)}
      onConfirm={() => handleConfirmAppointment(item.id)}
      onComplete={() => handleCompleteAppointment(item.id)}
    />
  ), [handleCancelAppointment, handleConfirmAppointment, handleCompleteAppointment]);

  const keyExtractor = useCallback((item: Appointment) => item.id, []);

  if (loading && !refreshing) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAppointments} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Agendamentos</Text>
        <Button
          title="Novo Agendamento"
          onPress={() => navigation.navigate('CreateAppointment' as never)}
          style={styles.newButton}
        />
      </View>

      <FlatList
        data={appointments}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Você não tem agendamentos.
          </Text>
        }
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  newButton: {
    minWidth: 160,
  },
  list: {
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
}); 