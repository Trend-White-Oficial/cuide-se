import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { usePayments } from '../../hooks/usePayments';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Payment } from '../../services/payments';

export const PaymentDetailsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { getPaymentById, updatePaymentStatus, refundPayment } = usePayments();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentId = route.params?.paymentId;

  useEffect(() => {
    if (!paymentId) {
      setError(t('payments.error.invalidPayment'));
      setLoading(false);
      return;
    }

    loadPayment();
  }, [paymentId]);

  const loadPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPaymentById(paymentId);
      setPayment(data);
    } catch (err) {
      setError(t('payments.error.loadingPayment'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!payment) return;

    try {
      setLoading(true);
      setError(null);
      await updatePaymentStatus(payment.id, 'failed');
      await loadPayment();
    } catch (err) {
      setError(t('payments.error.cancelingPayment'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefundPayment = async () => {
    if (!payment) return;

    try {
      setLoading(true);
      setError(null);
      await refundPayment(payment.id);
      await loadPayment();
    } catch (err) {
      setError(t('payments.error.refundingPayment'));
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !payment) {
    return (
      <ErrorMessage
        message={error || t('payments.error.invalidPayment')}
        onRetry={loadPayment}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('payments.details.title')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{formatAmount(payment.amount)}</Text>
          <View
            style={[
              styles.statusContainer,
              { backgroundColor: `${getStatusColor(payment.status)}15` },
            ]}
          >
            <Text
              style={[styles.status, { color: getStatusColor(payment.status) }]}
            >
              {t(`payments.status.${payment.status}`)}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('payments.details.method')}</Text>
            <View style={styles.methodContainer}>
              <Icon
                name={payment.paymentMethod === 'credit_card' ? 'credit-card' : 'money'}
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.infoValue}>
                {t(`payments.methods.${payment.paymentMethod}`)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('payments.details.date')}</Text>
            <Text style={styles.infoValue}>{formatDate(payment.createdAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('payments.details.id')}</Text>
            <Text style={styles.infoValue}>#{payment.id}</Text>
          </View>

          {payment.transactionId && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {t('payments.details.transactionId')}
              </Text>
              <Text style={styles.infoValue}>{payment.transactionId}</Text>
            </View>
          )}
        </View>

        {payment.status === 'pending' && (
          <Button
            title={t('payments.actions.cancel')}
            onPress={handleCancelPayment}
            variant="outline"
            color="error"
            style={styles.actionButton}
          />
        )}

        {payment.status === 'completed' && (
          <Button
            title={t('payments.actions.refund')}
            onPress={handleRefundPayment}
            variant="outline"
            color="info"
            style={styles.actionButton}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    marginTop: 8,
  },
}); 