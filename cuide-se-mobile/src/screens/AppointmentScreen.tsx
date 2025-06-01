import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
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
    price: number;
  };
  professional: {
    name: string;
  };
}

const STATUS_COLORS = {
  pending: '#ffa000',
  confirmed: '#2196f3',
  completed: '#4caf50',
  cancelled: '#f44336',
} as const;

const STATUS_TEXTS = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
} as const;

export const AppointmentScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointment = useCallback(async () => {
    const appointmentId = (route.params as { id: string })?.id;
    if (!appointmentId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(name, duration, price),
          professional:professionals(name)
        `)
        .eq('id', appointmentId)
        .single();

      if (error) throw error;
      setAppointment(data);
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      setError('Não foi possível carregar os detalhes do agendamento.');
    } finally {
      setLoading(false);
    }
  }, [route.params]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  const handleCancelAppointment = useCallback(async () => {
    if (!appointment) return;

    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);

              const { error } = await supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', appointment.id);

              if (error) throw error;

              Alert.alert(
                'Sucesso',
                'Agendamento cancelado com sucesso!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              console.error('Erro ao cancelar agendamento:', error);
              setError('Não foi possível cancelar o agendamento.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }, [appointment, navigation]);

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  const formatPrice = useCallback((price: number) => {
    return `R$ ${price.toFixed(2)}`;
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAppointment} />;
  if (!appointment) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Detalhes do Agendamento</Text>

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>Serviço</Text>
            <Text style={styles.value}>{appointment.service.name}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Duração</Text>
            <Text style={styles.value}>{appointment.service.duration} minutos</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Valor</Text>
            <Text style={styles.value}>{formatPrice(appointment.service.price)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Profissional</Text>
            <Text style={styles.value}>{appointment.professional.name}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>{formatDate(appointment.date)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Horário</Text>
            <Text style={styles.value}>{appointment.time}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.status, { color: STATUS_COLORS[appointment.status] }]}>
              {STATUS_TEXTS[appointment.status]}
            </Text>
          </View>
        </View>

        {appointment.status === 'pending' && (
          <Button
            title="Cancelar Agendamento"
            onPress={handleCancelAppointment}
            variant="outline"
            style={styles.cancelButton}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 24,
  },
});