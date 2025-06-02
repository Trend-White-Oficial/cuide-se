import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Button, Chip, TextInput, Portal, Dialog } from 'react-native-paper';
import { refundService, Refund } from '../services/refunds';
import { formatCurrency } from '../utils/format';

export const RefundManagementScreen: React.FC = () => {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = async () => {
    try {
      setLoading(true);
      const data = await refundService.getPendingRefunds();
      setRefunds(data);
    } catch (error) {
      console.error('Erro ao carregar reembolsos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os reembolsos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadRefunds();
  };

  const handleProcessRefund = async (approved: boolean) => {
    if (!selectedRefund) return;

    try {
      setProcessing(true);
      await refundService.processRefund(
        selectedRefund.id,
        approved,
        'admin_id', // Substituir pelo ID do admin logado
        notes
      );
      setDialogVisible(false);
      loadRefunds();
      Alert.alert(
        'Sucesso',
        `Reembolso ${approved ? 'aprovado' : 'rejeitado'} com sucesso!`
      );
    } catch (error) {
      console.error('Erro ao processar reembolso:', error);
      Alert.alert('Erro', 'Não foi possível processar o reembolso');
    } finally {
      setProcessing(false);
      setNotes('');
      setSelectedRefund(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'rejected':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {refunds.map((refund) => (
          <Card key={refund.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.amount}>
                  {formatCurrency(refund.amount)}
                </Text>
                <Chip
                  mode="outlined"
                  style={[styles.status, { borderColor: getStatusColor(refund.status) }]}
                  textStyle={{ color: getStatusColor(refund.status) }}
                >
                  {refund.status}
                </Chip>
              </View>

              <Text style={styles.label}>Motivo:</Text>
              <Text style={styles.reason}>{refund.reason}</Text>

              {refund.notes && (
                <>
                  <Text style={styles.label}>Observações:</Text>
                  <Text style={styles.notes}>{refund.notes}</Text>
                </>
              )}

              <View style={styles.cardFooter}>
                <Text style={styles.date}>
                  {new Date(refund.created_at).toLocaleDateString()}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => {
                    setSelectedRefund(refund);
                    setDialogVisible(true);
                  }}
                >
                  Processar
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Processar Reembolso</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Observações"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDialogVisible(false)}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              onPress={() => handleProcessRefund(false)}
              loading={processing}
              disabled={processing}
              style={styles.rejectButton}
            >
              Rejeitar
            </Button>
            <Button
              onPress={() => handleProcessRefund(true)}
              loading={processing}
              disabled={processing}
              style={styles.approveButton}
            >
              Aprovar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  status: {
    height: 24,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
  },
  reason: {
    fontSize: 16,
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  date: {
    color: '#757575',
  },
  input: {
    marginBottom: 16,
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
}); 