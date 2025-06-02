import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { supabase } from './supabase';

// Chaves do Stripe (substitua com suas chaves reais)
const STRIPE_PUBLISHABLE_KEY = 'sua_chave_publica';
const STRIPE_SECRET_KEY = 'sua_chave_secreta';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

class StripeService {
  private stripe: any;

  constructor() {
    this.stripe = null;
  }

  async initialize() {
    try {
      // Inicializar o Stripe
      this.stripe = await StripeProvider.init({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
        merchantIdentifier: 'merchant.com.cuidese',
      });
    } catch (error) {
      console.error('Erro ao inicializar Stripe:', error);
      throw error;
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'BRL'): Promise<PaymentIntent> {
    try {
      // Criar PaymentIntent no backend
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Usuário não autenticado');

      const response = await fetch('sua_url_backend/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          amount,
          currency,
        }),
      });

      const paymentIntent = await response.json();
      return paymentIntent;
    } catch (error) {
      console.error('Erro ao criar PaymentIntent:', error);
      throw error;
    }
  }

  async confirmPayment(clientSecret: string, paymentMethodId: string) {
    try {
      const { error, paymentIntent } = await this.stripe.confirmPayment(clientSecret, {
        paymentMethodId,
      });

      if (error) {
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      throw error;
    }
  }

  async createPaymentMethod(cardDetails: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }) {
    try {
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: cardDetails,
      });

      if (error) {
        throw error;
      }

      return paymentMethod;
    } catch (error) {
      console.error('Erro ao criar método de pagamento:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService(); 