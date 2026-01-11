-- Create payments table for Tranzak payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'XAF',
  
  -- Tranzak specific fields
  tranzak_request_id TEXT UNIQUE, -- requestId de Tranzak
  tranzak_transaction_id TEXT, -- transactionId de Tranzak (après paiement)
  payment_url TEXT, -- URL de paiement Tranzak
  qr_code TEXT, -- QR code Tranzak (optionnel)
  
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  payment_method TEXT, -- 'mobile_money_mtn', 'mobile_money_orange'
  
  metadata JSONB, -- Données supplémentaires de Tranzak
  webhook_data JSONB, -- Données reçues du webhook
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_payments_tranzak_request_id ON public.payments(tranzak_request_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_plan_id ON public.payments(plan_id);

-- Function to update updated_at timestamp
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
