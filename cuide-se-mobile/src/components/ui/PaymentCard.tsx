import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { Payment } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PaymentCardProps {
  payment: Payment;
  style?: ViewStyle;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  style,
}) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (payment.status) {
      case 'completed':
        return '#2E7D32';
      case 'pending':
        return '#F57C00';
      case 'failed':
        return '#D32F2F';
      case 'refunded':
        return '#1976D2';
      default:
        return '#666';
    }
  };

  const getStatusText = () => {
    switch (payment.status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      case 'refunded':
        return 'Reembolsado';
      default:
        return 'Desconhecido';
    }
  };

  const getMethodIcon = () => {
    switch (payment.method) {
      case 'credit_card':
        return 'credit-card';
      case 'pix':
        return 'qrcode';
      case 'bank_transfer':
        return 'bank';
      default:
        return 'cash';
    }
  };

  return (
    <Card style={[styles.card, style]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.methodContainer}>
            <Icon
              name={getMethodIcon()}
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.method}>
              {payment.method === 'credit_card'
                ? 'Cartão de Crédito'
                : payment.method === 'pix'
                ? 'PIX'
                : 'Transferência Bancária'}
            </Text>
          </View>
          <View style={[styles.status, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Valor:</Text>
            <Text style={styles.value}>
              {formatCurrency(payment.amount)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>
              {formatDateTime(payment.createdAt)}
            </Text>
          </View>
          {payment.transactionId && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>ID da Transação:</Text>
              <Text style={styles.value}>
                {payment.transactionId}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
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
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  method: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 