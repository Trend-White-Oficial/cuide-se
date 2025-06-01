import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { Card } from './Card';
import { Badge } from './Badge';
import { theme } from '../theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentCardProps {
  id: string;
  serviceName: string;
  professionalName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  onPress?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  serviceName,
  professionalName,
  date,
  time,
  status,
  onPress,
  onCancel,
  onReschedule,
}) => {
  // Formata a data para o padrão brasileiro
  const formattedDate = format(new Date(date), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  // Define as cores e textos do status
  const getStatusConfig = () => {
    switch (status) {
      case 'scheduled':
        return {
          color: theme.colors.warning,
          text: 'Agendado',
        };
      case 'confirmed':
        return {
          color: theme.colors.success,
          text: 'Confirmado',
        };
      case 'completed':
        return {
          color: theme.colors.info,
          text: 'Concluído',
        };
      case 'cancelled':
        return {
          color: theme.colors.error,
          text: 'Cancelado',
        };
      default:
        return {
          color: theme.colors.text,
          text: 'Desconhecido',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{serviceName}</Text>
          <Badge
            text={statusConfig.text}
            color={statusConfig.color}
            style={styles.badge}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Profissional:</Text>
          <Text style={styles.value}>{professionalName}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Data:</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Horário:</Text>
          <Text style={styles.value}>{time}</Text>
        </View>

        {status !== 'cancelled' && status !== 'completed' && (
          <View style={styles.actions}>
            {onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            {onReschedule && (
              <TouchableOpacity
                onPress={onReschedule}
                style={[styles.button, styles.rescheduleButton]}
              >
                <Text style={styles.buttonText}>Reagendar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  content: {
    padding: 16,
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
    color: theme.colors.text,
    flex: 1,
  },
  badge: {
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  rescheduleButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
}); 