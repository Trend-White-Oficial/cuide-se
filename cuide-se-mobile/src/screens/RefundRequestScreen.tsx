import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { refundService, RefundRequest } from '../services/refunds';
import { formatCurrency } from '../utils/format';

interface RefundRequestScreenProps {
  paymentId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RefundRequestScreen: React.FC<RefundRequestScreenProps> = ({
  paymentId,
  amount,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      if (!reason.trim()) {
        setError('Por favor, informe o motivo do reembolso');
        return;
      }

      setLoading(true);
      setError('');

      const request: RefundRequest = {
        payment_id: paymentId,
        amount,
        reason: reason.trim(),
        notes: notes.trim(),
      };

      await refundService.createRefundRequest(request);
      Alert.alert(
        'Sucesso',
        'Sua solicitação de reembolso foi enviada com sucesso!',
        [{ text: 'OK', onPress: onSuccess }]
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao solicitar reembolso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Solicitar Reembolso</Text>
        
        <View style={styles.amountContainer}>
          <Text style={styles.label}>Valor do Reembolso</Text>
          <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        </View>

        <TextInput
          label="Motivo do Reembolso"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
          style={styles.input}
          error={!!error}
        />
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>

        <TextInput
          label="Observações (opcional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.button, styles.submitButton]}
            loading={loading}
            disabled={loading}
          >
            Solicitar Reembolso
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  amountContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: '#757575',
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
}); 