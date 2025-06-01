import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface AppointmentCardProps {
  appointment: {
    id: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    services: {
      name: string;
      price: number;
      duration: number;
    };
    professionals: {
      name: string;
      avatar_url?: string;
    };
  };
  onCancel: (id: string) => void;
  onConfirm: (id: string) => void;
  onComplete: (id: string) => void;
  onPress: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onConfirm,
  onComplete,
  onPress,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'confirmed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'cancelled':
        return 'Cancelado';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => onCancel(appointment.id),
          style: 'destructive',
        },
      ]
    );
  };

  const handleConfirm = () => {
    Alert.alert(
      'Confirmar Agendamento',
      'Deseja confirmar este agendamento?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => onConfirm(appointment.id),
        },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      'Concluir Agendamento',
      'Deseja marcar este agendamento como concluído?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => onComplete(appointment.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.serviceName}>{appointment.services.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusText(appointment.status)}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>
          Profissional: {appointment.professionals.name}
        </Text>
        <Text style={styles.detailText}>
          Data: {new Date(appointment.date).toLocaleDateString()}
        </Text>
        <Text style={styles.detailText}>Horário: {appointment.time}</Text>
        <Text style={styles.detailText}>
          Duração: {appointment.services.duration} minutos
        </Text>
        <Text style={styles.detailText}>
          Valor: R$ {appointment.services.price.toFixed(2)}
        </Text>
      </View>

      <View style={styles.actions}>
        {appointment.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
        {appointment.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={handleComplete}
          >
            <Text style={styles.buttonText}>Concluir</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  completeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 