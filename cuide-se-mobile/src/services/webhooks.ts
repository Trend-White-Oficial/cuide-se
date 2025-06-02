import { supabase } from './supabase';
import { CLIENT_SECRET } from './mercadoPago';
import crypto from 'crypto';

// Chave secreta do webhook
const WEBHOOK_SECRET = '132b873ba514b7e6cf35c4d7f113abb5239c35907fca5dc3c8b8c6326ab987ce';

export interface WebhookEvent {
  action: string;
  api_version: string;
  data: {
    id: string;
    [key: string]: any;
  };
  date_created: string;
  live_mode: boolean;
  type: string;
  user_id: string;
}

class WebhookService {
  async handleWebhookEvent(event: WebhookEvent, signature: string) {
    try {
      // Verificar a assinatura do webhook
      if (!this.verifyWebhookSignature(event, signature)) {
        throw new Error('Assinatura do webhook inválida');
      }

      // Processar diferentes tipos de eventos
      switch (event.type) {
        case 'payment':
          await this.handlePaymentEvent(event);
          break;
        case 'subscription':
          await this.handleSubscriptionEvent(event);
          break;
        case 'preapproval':
          await this.handlePreapprovalEvent(event);
          break;
        case 'chargeback':
          await this.handleChargebackEvent(event);
          break;
        default:
          console.log('Evento não tratado:', event.type);
      }

      // Registrar o evento no banco de dados
      await this.logWebhookEvent(event);
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw error;
    }
  }

  private verifyWebhookSignature(event: WebhookEvent, signature: string): boolean {
    try {
      const payload = JSON.stringify(event);
      const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
      const calculatedSignature = hmac.update(payload).digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(calculatedSignature)
      );
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      return false;
    }
  }

  private async handlePaymentEvent(event: WebhookEvent) {
    const paymentId = event.data.id;
    const status = event.data.status;

    // Atualizar status do pagamento no banco de dados
    await supabase
      .from('payments')
      .update({ status })
      .eq('payment_id', paymentId);

    // Notificar o usuário se necessário
    if (status === 'approved') {
      await this.notifyUser(paymentId, 'Pagamento aprovado');
    } else if (status === 'rejected') {
      await this.notifyUser(paymentId, 'Pagamento rejeitado');
    }
  }

  private async handleSubscriptionEvent(event: WebhookEvent) {
    const subscriptionId = event.data.id;
    const status = event.data.status;

    // Atualizar status da assinatura no banco de dados
    await supabase
      .from('subscriptions')
      .update({ status })
      .eq('subscription_id', subscriptionId);

    // Notificar o usuário se necessário
    if (status === 'active') {
      await this.notifyUser(subscriptionId, 'Assinatura ativada');
    } else if (status === 'cancelled') {
      await this.notifyUser(subscriptionId, 'Assinatura cancelada');
    }
  }

  private async handlePreapprovalEvent(event: WebhookEvent) {
    const preapprovalId = event.data.id;
    const status = event.data.status;

    // Atualizar status da pré-aprovação no banco de dados
    await supabase
      .from('preapprovals')
      .update({ status })
      .eq('preapproval_id', preapprovalId);

    // Notificar o usuário se necessário
    if (status === 'approved') {
      await this.notifyUser(preapprovalId, 'Pré-aprovação aprovada');
    }
  }

  private async handleChargebackEvent(event: WebhookEvent) {
    const paymentId = event.data.id;
    const status = event.data.status;

    // Atualizar status do chargeback no banco de dados
    await supabase
      .from('chargebacks')
      .insert({
        payment_id: paymentId,
        status,
        created_at: new Date().toISOString(),
      });

    // Notificar o usuário
    await this.notifyUser(paymentId, 'Chargeback registrado');
  }

  private async logWebhookEvent(event: WebhookEvent) {
    await supabase
      .from('webhook_logs')
      .insert({
        event_type: event.type,
        event_data: event.data,
        created_at: new Date().toISOString(),
      });
  }

  private async notifyUser(id: string, message: string) {
    // Implementar notificação ao usuário (push, email, etc.)
    console.log(`Notificação para ${id}: ${message}`);
  }
}

export const webhookService = new WebhookService(); 