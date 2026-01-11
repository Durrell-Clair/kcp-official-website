import { supabase } from '@/integrations/supabase/client';

export interface Payment {
  id: string;
  subscription_id: string | null;
  user_id: string;
  plan_id: string | null;
  amount: number;
  currency: string;
  tranzak_request_id: string | null;
  tranzak_transaction_id: string | null;
  payment_url: string | null;
  qr_code: string | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method: string | null;
  metadata: Record<string, any> | null;
  webhook_data: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CreatePaymentInput {
  user_id: string;
  plan_id: string;
  amount: number;
  currency?: string;
  tranzak_request_id: string;
  payment_url: string;
  qr_code?: string;
  metadata?: Record<string, any>;
}

/**
 * Crée un nouveau paiement
 */
export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: input.user_id,
      plan_id: input.plan_id,
      amount: input.amount,
      currency: input.currency || 'XAF',
      tranzak_request_id: input.tranzak_request_id,
      payment_url: input.payment_url,
      qr_code: input.qr_code,
      status: 'pending',
      metadata: input.metadata || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating payment:', error);
    throw error;
  }

  return data;
}

/**
 * Récupère un paiement par son ID
 */
export async function getPaymentById(id: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }

  return data;
}

/**
 * Récupère un paiement par requestId Tranzak
 */
export async function getPaymentByTranzakRequestId(requestId: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('tranzak_request_id', requestId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching payment by requestId:', error);
    throw error;
  }

  return data;
}

/**
 * Récupère tous les paiements d'un utilisateur
 */
export async function getPaymentsByUserId(userId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }

  return data || [];
}

/**
 * Met à jour le statut d'un paiement (utilisé par le webhook)
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: Payment['status'],
  tranzak_transaction_id?: string,
  webhook_data?: Record<string, any>
): Promise<Payment> {
  const updateData: any = {
    status,
    webhook_data: webhook_data || null,
  };

  if (tranzak_transaction_id) {
    updateData.tranzak_transaction_id = tranzak_transaction_id;
  }

  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }

  return data;
}

/**
 * Met à jour le payment_method d'un paiement
 */
export async function updatePaymentMethod(
  paymentId: string,
  payment_method: string
): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .update({ payment_method })
    .eq('id', paymentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }

  return data;
}
