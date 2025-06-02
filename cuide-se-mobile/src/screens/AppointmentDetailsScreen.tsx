import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SchedulingService, Appointment } from '../services/scheduling';
import { useRoute } from '@react-navigation/native';

export const AppointmentDetailsScreen: React.FC = () => {
  const route = useRoute();
  const { appointmentId } = route.params as { appointmentId: string };
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);

  const schedulingService = new SchedulingService();

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const data = await schedulingService.getAppointmentById(appointmentId);
      setAppointment(data);
    } catch (error) {
      console.error('Erro ao carregar agendamento:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do agendamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!appointment) return;
    try {
      setLoading(true);
      // Aqui você pode definir o papel (user ou professional) baseado na lógica do seu app
      const confirmerRole = 'user'; // ou 'professional'
      await schedulingService.confirmAppointment(appointment.id, confirmerRole);
      Alert.alert('Sucesso', 'Agendamento confirmado com sucesso!');
      loadAppointment(); // Recarrega os dados
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      Alert.alert('Erro', 'Não foi possível confirmar o agendamento.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text>Agendamento não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Agendamento</Text>
      <Text>ID: {appointment.id}</Text>
      <Text>Data: {appointment.date}</Text>
      <Text>Horário: {appointment.start_time} - {appointment.end_time}</Text>
      <Text>Status: {appointment.status}</Text>
      {appointment.notes && <Text>Observações: {appointment.notes}</Text>}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
        <Text style={styles.buttonText}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 