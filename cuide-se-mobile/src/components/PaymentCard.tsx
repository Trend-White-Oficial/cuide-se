import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { Icon } from './Icon';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PaymentCardProps {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  date: Date;
  serviceName: string;
  onPress?: () => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  id,
  amount,
  status,
  paymentMethod,
  date,
  serviceName,
  onPress,
}) => {
  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatAmount = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const getStatusColor = (status: PaymentCardProps['status']) => {
    switch (status) {
      case 'completed':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      case 'failed':
        return '#FF3B30';
      case 'refunded':
        return '#007AFF';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: PaymentCardProps['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit_card':
        return 'credit-card';
      case 'debit_card':
        return 'credit-card';
      case 'pix':
        return 'qrcode';
      default:
        return 'money';
    }
  };

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <Icon name="scissors" size={16} color="#666" />
          <Text style={styles.serviceName}>{serviceName}</Text>
        </View>
        <View
          style={[
            styles.statusContainer,
            { backgroundColor: `${getStatusColor(status)}15` },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(status) }]}
          >
            {getStatusText(status)}
          </Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{formatAmount(amount)}</Text>
        <View style={styles.paymentMethodContainer}>
          <Icon
            name={getPaymentMethodIcon(paymentMethod)}
            size={16}
            color="#666"
          />
          <Text style={styles.paymentMethod}>{paymentMethod}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(date)}</Text>
        <Text style={styles.id}>#{id}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  id: {
    fontSize: 12,
    color: '#999',
  },
}); 