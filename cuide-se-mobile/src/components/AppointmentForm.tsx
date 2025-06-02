import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SchedulingService, Appointment, TimeSlot } from '../services/scheduling';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentFormProps {
  userId: string;
  professionalId: string;
  serviceId: string;
  selectedDate: string;
  selectedTimeSlot?: TimeSlot;
  onSuccess?: (appointment: Appointment) => void;
  onCancel?: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  userId,
  professionalId,
  serviceId,
  selectedDate,
  selectedTimeSlot,
  onSuccess,
  onCancel,
}) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schedulingService = new SchedulingService();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedTimeSlot) {
        setError('Por favor, selecione um horário disponível');
        return;
      }

      const appointment = await schedulingService.createAppointment({
        user_id: userId,
        professional_id: professionalId,
        service_id: serviceId,
        date: selectedDate,
        start_time: selectedTimeSlot.start_time,
        end_time: selectedTimeSlot.end_time,
        notes: notes.trim(),
      });

      Alert.alert(
        'Sucesso',
        'Agendamento realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => onSuccess?.(appointment),
          },
        ]
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao realizar agendamento. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar o agendamento?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: onCancel,
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Novo Agendamento</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Data:</Text>
          <Text style={styles.value}>
            {format(parseISO(selectedDate), "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </Text>
        </View>

        {selectedTimeSlot && (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Horário:</Text>
            <Text style={styles.value}>
              {format(parseISO(selectedTimeSlot.start_time), 'HH:mm')} -{' '}
              {format(parseISO(selectedTimeSlot.end_time), 'HH:mm')}
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Observações:</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Adicione observações sobre o agendamento (opcional)"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 24,
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
}); 