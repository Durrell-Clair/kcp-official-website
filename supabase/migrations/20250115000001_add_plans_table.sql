-- Create plans table for subscription plans
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'start', 'plus', 'pro'
  display_name TEXT NOT NULL, -- 'PME START', 'PME PLUS', 'PME PRO'
  price INTEGER NOT NULL, -- 10000, 20000, 35000 (en FCFA)
  max_users INTEGER NOT NULL, -- 3, 10, 20
  features JSONB, -- Liste des fonctionnalités
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Plans are viewable by everyone (public)
CREATE POLICY "Plans are viewable by everyone"
  ON public.plans FOR SELECT
  USING (true);

-- Function to update updated_at timestamp (create if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Function to update updated_at timestamp
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.plans (name, display_name, price, max_users, features, is_active) VALUES
  (
    'start',
    'PME START',
    10000,
    3,
    '["Toutes fonctions core", "Support WhatsApp", "1 entreprise"]'::jsonb,
    true
  ),
  (
    'plus',
    'PME PLUS',
    20000,
    10,
    '["Toutes fonctions core", "Multi-points de vente", "Export avancé", "Support prioritaire"]'::jsonb,
    true
  ),
  (
    'pro',
    'PME PRO',
    35000,
    20,
    '["Toutes fonctions core", "Multi-points de vente", "API access", "Personnalisations", "Support téléphone dédié"]'::jsonb,
    true
  );
