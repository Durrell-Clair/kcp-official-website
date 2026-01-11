import { supabase } from '@/integrations/supabase/client';
import { PLANS, type Plan } from '@/config/pricing';

export interface PlanFromDB {
  id: string;
  name: string;
  display_name: string;
  price: number;
  max_users: number;
  features: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Récupère tous les plans actifs depuis la base de données
 */
export async function getPlans(): Promise<PlanFromDB[]> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }

  return data || [];
}

/**
 * Récupère un plan par son nom
 */
export async function getPlanByName(name: string): Promise<PlanFromDB | null> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('name', name)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }

  return data;
}

/**
 * Récupère un plan par son ID
 */
export async function getPlanById(id: string): Promise<PlanFromDB | null> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }

  return data;
}

/**
 * Convertit un plan de la config locale en format DB (pour référence)
 */
export function getPlanConfig(name: string): Plan | undefined {
  return PLANS.find(p => p.name === name);
}
