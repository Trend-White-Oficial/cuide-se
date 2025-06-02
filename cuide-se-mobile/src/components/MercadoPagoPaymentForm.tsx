import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { mercadoPagoService } from '../services/mercadoPago';

interface MercadoPagoPaymentFormProps {
  amount: number;
  description: string;
  onSuccess: (payment: any) => void;
  onError: (error: Error) => void;
}

export const MercadoPagoPaymentForm: React.FC<MercadoPagoPaymentFormProps> = ({
  amount,
  description,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });

  const handleCardPayment = async () => {
    try {
      setLoading(true);
      const [expiryMonth, expiryYear] = cardData.expiry.split('/');
      
      const payment = await mercadoPagoService.createCardPayment({
        amount,
        description,
        email: 'cliente@email.com', // Substituir pelo email do usuário logado
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardholderName: cardData.name,
        expirationMonth: parseInt(expiryMonth),
        expirationYear: parseInt(expiryYear),
        securityCode: cardData.cvc,
      });

      onSuccess(payment);
    } catch (error) {
      onError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handlePixPayment = async () => {
    try {
      setLoading(true);
      const { qr_code, qr_code_base64 } = await mercadoPagoService.createPixPayment({
        amount,
        description,
        email: 'cliente@email.com', // Substituir pelo email do usuário logado
      });

      // Aqui você pode mostrar o QR Code para o usuário
      Alert.alert(
        'Pagamento PIX',
        'Escaneie o QR Code para pagar',
        [
          {
            text: 'Copiar Código PIX',
            onPress: () => {
              // Implementar cópia do código PIX
            },
          },
          {
            text: 'OK',
            onPress: () => {
              // Implementar verificação do status do pagamento
            },
          },
        ]
      );
    } catch (error) {
      onError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={paymentMethod}
        onValueChange={value => setPaymentMethod(value as 'card' | 'pix')}
        buttons={[
          { value: 'card', label: 'Cartão' },
          { value: 'pix', label: 'PIX' },
        ]}
        style={styles.segmentedButtons}
      />

      {paymentMethod === 'card' ? (
        <>
          <TextInput
            label="Número do Cartão"
            value={cardData.number}
            onChangeText={text => setCardData({ ...cardData, number: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Nome no Cartão"
            value={cardData.name}
            onChangeText={text => setCardData({ ...cardData, name: text })}
            style={styles.input}
          />
          <View style={styles.row}>
            <TextInput
              label="Validade (MM/AA)"
              value={cardData.expiry}
              onChangeText={text => setCardData({ ...cardData, expiry: text })}
              style={[styles.input, styles.halfInput]}
            />
            <TextInput
              label="CVC"
              value={cardData.cvc}
              onChangeText={text => setCardData({ ...cardData, cvc: text })}
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
            />
          </View>
          <Button
            mode="contained"
            onPress={handleCardPayment}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Pagar com Cartão
          </Button>
        </>
      ) : (
        <Button
          mode="contained"
          onPress={handlePixPayment}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Gerar PIX
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  segmentedButtons: {
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
  button: {
    marginTop: 16,
  },
}); 