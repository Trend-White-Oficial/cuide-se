export interface Payment {
  id: string;
  user_id: string;
  appointment_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  payment_details?: {
    card_last_four?: string;
    card_brand?: string;
    pix_code?: string;
    bank_transfer_info?: {
      bank: string;
      agency: string;
      account: string;
    };
  };
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
} 