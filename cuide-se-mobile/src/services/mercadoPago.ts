import { supabase } from './supabase';

// Credenciais de produção do Mercado Pago
const MERCADO_PAGO_PUBLIC_KEY = 'APP_USR-a41aa369-d387-409f-8096-2e301682605e';
const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-7734106620460643-042612-bd8043870828206336fbffc5255d4291-273629982';
const APPLICATION_ID = '7734106620460643';
const CLIENT_SECRET = 'JrnyhnBS08vZvAL3TsqFtAVWrPd4v6rr';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method_id: string;
  installments: number;
  description: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export interface Subscription {
  id: string;
  status: string;
  application_id: string;
  reason: string;
  external_reference: string;
  payer: {
    id: string;
    email: string;
  };
  payment_method_id: string;
  recurring_payment: {
    frequency: number;
    frequency_type: string;
    transaction_amount: number;
    currency_id: string;
  };
}

class MercadoPagoService {
  async createSubscription(data: {
    reason: string;
    external_reference: string;
    payer_email: string;
    payment_method_id: string;
    transaction_amount: number;
    frequency: number;
    frequency_type: 'days' | 'months' | 'years';
  }): Promise<Subscription> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Usuário não autenticado');

      const response = await fetch('https://api.mercadopago.com/preapproval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          reason: data.reason,
          external_reference: data.external_reference,
          payer_email: data.payer_email,
          payment_method_id: data.payment_method_id,
          application_id: APPLICATION_ID,
          recurring_payment: {
            frequency: data.frequency,
            frequency_type: data.frequency_type,
            transaction_amount: data.transaction_amount,
            currency_id: 'BRL',
          },
        }),
      });

      const subscription = await response.json();
      return subscription;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  }

  async createPayment(data: {
    amount: number;
    description: string;
    email: string;
    installments?: number;
    payment_method_id?: string;
  }): Promise<Payment> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Usuário não autenticado');

      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          transaction_amount: data.amount,
          description: data.description,
          payment_method_id: data.payment_method_id || 'pix',
          payer: {
            email: data.email,
          },
          installments: data.installments || 1,
          application_id: APPLICATION_ID,
        }),
      });

      const payment = await response.json();
      return payment;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      });

      const payment = await response.json();
      return payment.status;
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      throw error;
    }
  }

  async createPixPayment(data: {
    amount: number;
    description: string;
    email: string;
  }): Promise<{ qr_code: string; qr_code_base64: string }> {
    try {
      const payment = await this.createPayment({
        ...data,
        payment_method_id: 'pix',
      });

      const response = await fetch(`https://api.mercadopago.com/v1/payments/${payment.id}/qr_code`, {
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      });

      const qrCode = await response.json();
      return {
        qr_code: qrCode.qr_code,
        qr_code_base64: qrCode.qr_code_base64,
      };
    } catch (error) {
      console.error('Erro ao gerar QR Code PIX:', error);
      throw error;
    }
  }

  async createCardPayment(data: {
    amount: number;
    description: string;
    email: string;
    cardNumber: string;
    cardholderName: string;
    expirationMonth: number;
    expirationYear: number;
    securityCode: string;
    installments?: number;
  }): Promise<Payment> {
    try {
      // Primeiro, criar o token do cartão
      const tokenResponse = await fetch('https://api.mercadopago.com/v1/card_tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MERCADO_PAGO_PUBLIC_KEY}`,
        },
        body: JSON.stringify({
          card_number: data.cardNumber,
          cardholder: {
            name: data.cardholderName,
          },
          expiration_month: data.expirationMonth,
          expiration_year: data.expirationYear,
          security_code: data.securityCode,
        }),
      });

      const { id: cardToken } = await tokenResponse.json();

      // Agora, criar o pagamento com o token
      const payment = await this.createPayment({
        amount: data.amount,
        description: data.description,
        email: data.email,
        installments: data.installments,
        payment_method_id: 'credit_card',
      });

      return payment;
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error);
      throw error;
    }
  }

  // Método para testar a integração
  async testIntegration(): Promise<boolean> {
    try {
      const response = await fetch('https://api.mercadopago.com/users/me', {
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      });

      const data = await response.json();
      return data.id === '273629982'; // Seu User ID
    } catch (error) {
      console.error('Erro ao testar integração:', error);
      return false;
    }
  }
}

export const mercadoPagoService = new MercadoPagoService(); 