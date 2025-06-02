import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { Button, TextInput } from 'react-native-paper';
import { stripeService } from '../services/stripe';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: Error) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { confirmPayment } = useStripe();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Criar PaymentIntent
      const paymentIntent = await stripeService.createPaymentIntent(amount);

      // Confirmar pagamento
      const { error, paymentIntent: confirmedPaymentIntent } = await confirmPayment(
        paymentIntent.client_secret,
        {
          paymentMethodType: 'Card',
        }
      );

      if (error) {
        onError(error);
      } else if (confirmedPaymentIntent) {
        onSuccess(confirmedPaymentIntent);
      }
    } catch (error) {
      onError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => {
          setCardComplete(cardDetails.complete);
        }}
      />
      <Button
        mode="contained"
        onPress={handlePayment}
        disabled={!cardComplete || loading}
        loading={loading}
        style={styles.button}
      >
        {loading ? 'Processando...' : `Pagar R$ ${(amount / 100).toFixed(2)}`}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  cardContainer: {
    height: 50,
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
  button: {
    marginTop: 16,
  },
}); 