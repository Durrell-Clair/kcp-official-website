-- Add plan references to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN plan_id UUID REFERENCES public.plans(id),
ADD COLUMN plan_name TEXT, -- Denormalisé pour historique
ADD COLUMN max_users INTEGER; -- Denormalisé pour historique

-- Index pour améliorer performances
CREATE INDEX idx_subscriptions_plan_id ON public.subscriptions(plan_id);
