import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';

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

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: () => void;
  onConfirm?: () => void;
  onComplete?: () => void;
}

const STATUS_COLORS = {
  pending: '#FFA000',
  confirmed: '#2196F3',
  completed: '#4CAF50',
  cancelled: '#F44336',
} as const;

const STATUS_TEXTS = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
} as const;

export const AppointmentCard = memo<AppointmentCardProps>(({
  appointment,
  onCancel,
  onConfirm,
  onComplete,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA000';
      case 'confirmed':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const handlePress = () => {
    navigation.navigate('AppointmentDetails', { id: appointment.id });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text style={styles.serviceName}>{appointment.service.name}</Text>
        <Text
          style={[
            styles.status,
            { color: getStatusColor(appointment.status) },
          ]}
        >
          {t(`appointments.status.${appointment.status}`)}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Profissional: {appointment.professional.name}
        </Text>
        <Text style={styles.infoText}>
          Data: {formatDate(appointment.date)}
        </Text>
        <Text style={styles.infoText}>
          Horário: {formatTime(appointment.time)}
        </Text>
        <Text style={styles.infoText}>
          Duração: {appointment.service.duration} minutos
        </Text>
      </View>

      <View style={styles.actions}>
        {appointment.status === 'pending' && onCancel && (
          <Button
            title={t('appointments.actions.cancel')}
            onPress={onCancel}
            variant="outline"
            style={styles.actionButton}
          />
        )}

        {appointment.status === 'pending' && onConfirm && (
          <Button
            title={t('appointments.actions.confirm')}
            onPress={onConfirm}
            style={styles.actionButton}
          />
        )}

        {appointment.status === 'confirmed' && onComplete && (
          <Button
            title={t('appointments.actions.complete')}
            onPress={onComplete}
            style={styles.actionButton}
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  info: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    minWidth: 100,
  },
}); 