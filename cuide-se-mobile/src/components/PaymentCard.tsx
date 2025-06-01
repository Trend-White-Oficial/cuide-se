import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { Text } from './Text';
import { Icon } from './Icon';
import { Payment } from '../services/payments';

interface PaymentCardProps {
  payment: Payment;
  onPress: () => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onPress,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'failed':
        return theme.colors.error;
      case 'refunded':
        return theme.colors.info;
      default:
        return theme.colors.text;
    }
  };

  const getPaymentMethodIcon = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'credit_card':
        return 'credit-card';
      case 'debit_card':
        return 'credit-card';
      case 'pix':
        return 'qrcode';
      case 'bank_transfer':
        return 'bank';
      default:
        return 'money';
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const paymentDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - paymentDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return t('payments.minutesAgo', { minutes: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t('payments.hoursAgo', { hours: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return t('payments.daysAgo', { days: diffInDays });
    }

    return paymentDate.toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.card },
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.methodContainer}>
          <Icon
            name={getPaymentMethodIcon(payment.paymentMethod)}
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.method}>
            {t(`payments.methods.${payment.paymentMethod}`)}
          </Text>
        </View>
        <Text style={[styles.status, { color: getStatusColor(payment.status) }]}>
          {t(`payments.status.${payment.status}`)}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.amount}>{formatAmount(payment.amount)}</Text>
        <Text style={styles.date}>{formatDate(payment.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  method: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    gap: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
}); 