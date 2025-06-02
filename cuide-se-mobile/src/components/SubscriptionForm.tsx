import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, SegmentedButtons, Text } from 'react-native-paper';
import { mercadoPagoService } from '../services/mercadoPago';

interface SubscriptionFormProps {
  onSuccess: (subscription: any) => void;
  onError: (error: Error) => void;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [subscriptionData, setSubscriptionData] = useState({
    reason: '',
    amount: '',
    frequency: '1',
    frequencyType: 'months',
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvc: '',
  });

  const handleCreateSubscription = async () => {
    try {
      setLoading(true);

      if (paymentMethod === 'card') {
        const [expiryMonth, expiryYear] = subscriptionData.expiry.split('/');
        
        const subscription = await mercadoPagoService.createSubscription({
          reason: subscriptionData.reason,
          external_reference: `sub_${Date.now()}`,
          payer_email: 'cliente@email.com', // Substituir pelo email do usuário logado
          payment_method_id: 'credit_card',
          transaction_amount: parseFloat(subscriptionData.amount),
          frequency: parseInt(subscriptionData.frequency),
          frequency_type: subscriptionData.frequencyType as 'days' | 'months' | 'years',
        });

        onSuccess(subscription);
      } else {
        // Implementar assinatura via PIX se necessário
        Alert.alert('Aviso', 'Assinaturas via PIX ainda não estão disponíveis');
      }
    } catch (error) {
      onError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Assinatura</Text>

      <TextInput
        label="Motivo da Assinatura"
        value={subscriptionData.reason}
        onChangeText={text => setSubscriptionData({ ...subscriptionData, reason: text })}
        style={styles.input}
      />

      <TextInput
        label="Valor Mensal (R$)"
        value={subscriptionData.amount}
        onChangeText={text => setSubscriptionData({ ...subscriptionData, amount: text })}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.row}>
        <TextInput
          label="Frequência"
          value={subscriptionData.frequency}
          onChangeText={text => setSubscriptionData({ ...subscriptionData, frequency: text })}
          keyboardType="numeric"
          style={[styles.input, styles.halfInput]}
        />
        <SegmentedButtons
          value={subscriptionData.frequencyType}
          onValueChange={value => setSubscriptionData({ ...subscriptionData, frequencyType: value })}
          buttons={[
            { value: 'days', label: 'Dias' },
            { value: 'months', label: 'Meses' },
            { value: 'years', label: 'Anos' },
          ]}
          style={[styles.input, styles.halfInput]}
        />
      </View>

      <SegmentedButtons
        value={paymentMethod}
        onValueChange={value => setPaymentMethod(value as 'card' | 'pix')}
        buttons={[
          { value: 'card', label: 'Cartão' },
          { value: 'pix', label: 'PIX' },
        ]}
        style={styles.segmentedButtons}
      />

      {paymentMethod === 'card' && (
        <>
          <TextInput
            label="Número do Cartão"
            value={subscriptionData.cardNumber}
            onChangeText={text => setSubscriptionData({ ...subscriptionData, cardNumber: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Nome no Cartão"
            value={subscriptionData.cardholderName}
            onChangeText={text => setSubscriptionData({ ...subscriptionData, cardholderName: text })}
            style={styles.input}
          />
          <View style={styles.row}>
            <TextInput
              label="Validade (MM/AA)"
              value={subscriptionData.expiry}
              onChangeText={text => setSubscriptionData({ ...subscriptionData, expiry: text })}
              style={[styles.input, styles.halfInput]}
            />
            <TextInput
              label="CVC"
              value={subscriptionData.cvc}
              onChangeText={text => setSubscriptionData({ ...subscriptionData, cvc: text })}
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
            />
          </View>
        </>
      )}

      <Button
        mode="contained"
        onPress={handleCreateSubscription}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Criar Assinatura
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
}); 