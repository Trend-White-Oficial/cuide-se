import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Title, Text, Button, useTheme } from 'react-native-paper';
import { Appointment, Service, Professional } from '../../types';
import { formatDateTime, formatCurrency } from '../../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppointmentCardProps {
  appointment: Appointment;
  service: Service;
  professional: Professional;
  onPress: () => void;
  onCancel?: () => void;
  style?: ViewStyle;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  service,
  professional,
  onPress,
  onCancel,
  style,
}) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (appointment.status) {
      case 'confirmed':
        return '#2E7D32';
      case 'pending':
        return '#F57C00';
      case 'completed':
        return '#1976D2';
      case 'cancelled':
        return '#D32F2F';
      default:
        return '#666';
    }
  };

  const getStatusText = () => {
    switch (appointment.status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Card
      style={[styles.card, style]}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>{service.name}</Title>
          <View style={[styles.status, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color="#666" />
            <Text style={styles.infoText}>{professional.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.infoText}>
              {formatDateTime(`${appointment.date}T${appointment.time}`)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="currency-usd" size={20} color="#666" />
            <Text style={styles.infoText}>
              {formatCurrency(service.price)}
            </Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        {appointment.status === 'pending' && onCancel && (
          <Button
            mode="outlined"
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
            textColor={theme.colors.error}
          >
            Cancelar
          </Button>
        )}
        <Button
          mode="contained"
          onPress={onPress}
          style={styles.button}
        >
          Ver Detalhes
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  info: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 8,
    borderColor: '#D32F2F',
  },
}); 