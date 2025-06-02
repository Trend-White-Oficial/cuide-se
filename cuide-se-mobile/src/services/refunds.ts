import { supabase } from './supabase';
import { mercadoPagoService } from './mercadoPago';

export interface Refund {
  id: string;
  payment_id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_id: string;
  admin_id?: string;
  notes?: string;
}

export interface RefundRequest {
  payment_id: string;
  amount: number;
  reason: string;
  notes?: string;
}

class RefundService {
  async createRefundRequest(request: RefundRequest): Promise<Refund> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Usuário não autenticado');

      // Verificar se o pagamento existe e está elegível para reembolso
      const payment = await mercadoPagoService.getPaymentStatus(request.payment_id);
      if (!this.isPaymentEligibleForRefund(payment)) {
        throw new Error('Pagamento não elegível para reembolso');
      }

      // Criar solicitação de reembolso no banco de dados
      const { data, error } = await supabase
        .from('refunds')
        .insert({
          payment_id: request.payment_id,
          amount: request.amount,
          reason: request.reason,
          status: 'pending',
          user_id: session.user.id,
          notes: request.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Notificar administradores sobre nova solicitação
      await this.notifyAdmins(data);

      return data as Refund;
    } catch (error) {
      console.error('Erro ao criar solicitação de reembolso:', error);
      throw error;
    }
  }

  async processRefund(refundId: string, approved: boolean, adminId: string, notes?: string): Promise<Refund> {
    try {
      const refund = await this.getRefundById(refundId);
      if (!refund) throw new Error('Reembolso não encontrado');

      if (approved) {
        // Processar reembolso no Mercado Pago
        await mercadoPagoService.refundPayment(refund.payment_id, refund.amount);
      }

      // Atualizar status do reembolso
      const { data, error } = await supabase
        .from('refunds')
        .update({
          status: approved ? 'approved' : 'rejected',
          admin_id: adminId,
          notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', refundId)
        .select()
        .single();

      if (error) throw error;

      // Notificar usuário sobre o resultado
      await this.notifyUser(refund.user_id, approved ? 'Reembolso aprovado' : 'Reembolso rejeitado');

      return data as Refund;
    } catch (error) {
      console.error('Erro ao processar reembolso:', error);
      throw error;
    }
  }

  async getRefundById(id: string): Promise<Refund | null> {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Refund;
    } catch (error) {
      console.error('Erro ao buscar reembolso:', error);
      return null;
    }
  }

  async getUserRefunds(userId: string): Promise<Refund[]> {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Refund[];
    } catch (error) {
      console.error('Erro ao buscar reembolsos do usuário:', error);
      throw error;
    }
  }

  async getPendingRefunds(): Promise<Refund[]> {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Refund[];
    } catch (error) {
      console.error('Erro ao buscar reembolsos pendentes:', error);
      throw error;
    }
  }

  private isPaymentEligibleForRefund(payment: any): boolean {
    // Implementar lógica de elegibilidade
    // Exemplo: verificar se o pagamento foi aprovado e está dentro do prazo
    return payment.status === 'approved' && this.isWithinRefundPeriod(payment.created_at);
  }

  private isWithinRefundPeriod(createdAt: string): boolean {
    const paymentDate = new Date(createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 90; // 90 dias para solicitar reembolso
  }

  private async notifyAdmins(refund: Refund): Promise<void> {
    // Implementar notificação para administradores
    console.log('Notificar admins sobre novo reembolso:', refund.id);
  }

  private async notifyUser(userId: string, message: string): Promise<void> {
    // Implementar notificação para o usuário
    console.log('Notificar usuário:', userId, message);
  }
}

export const refundService = new RefundService(); 