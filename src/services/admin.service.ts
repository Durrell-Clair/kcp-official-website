import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWithSubscription extends UserProfile {
  subscription?: {
    id: string;
    status: string;
    plan_name: string | null;
    start_date: string | null;
    end_date: string | null;
  } | null;
  payment_count?: number;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  pendingPayments: number;
  recentUsers: number; // Users created in last 30 days
}

/**
 * Récupère toutes les statistiques admin
 */
export async function getAdminStats(): Promise<AdminStats> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Get active subscriptions
  const { count: activeSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get total revenue (sum of completed payments)
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed');

  const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  // Get pending payments
  const { count: pendingPayments } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Get recent users (last 30 days)
  const { count: recentUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  return {
    totalUsers: totalUsers || 0,
    activeSubscriptions: activeSubscriptions || 0,
    totalRevenue,
    pendingPayments: pendingPayments || 0,
    recentUsers: recentUsers || 0,
  };
}

/**
 * Récupère tous les utilisateurs avec leurs abonnements
 */
export async function getAllUsers(): Promise<UserWithSubscription[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  if (!profiles) {
    return [];
  }

  // Get subscriptions for each user
  const userIds = profiles.map(p => p.user_id);
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('id, user_id, status, plan_name, start_date, end_date')
    .in('user_id', userIds)
    .order('created_at', { ascending: false });

  // Get payment counts
  const { data: payments } = await supabase
    .from('payments')
    .select('user_id')
    .in('user_id', userIds);

  const paymentCounts = payments?.reduce((acc, p) => {
    acc[p.user_id] = (acc[p.user_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Combine data
  return profiles.map(profile => {
    const userSubscription = subscriptions?.find(s => s.user_id === profile.user_id);
    const paymentCount = paymentCounts[profile.user_id] || 0;

    return {
      ...profile,
      subscription: userSubscription || null,
      payment_count: paymentCount,
    };
  });
}

/**
 * Met à jour le statut admin d'un utilisateur
 * Seul un super admin peut faire cela
 */
export async function updateUserAdminStatus(
  userId: string,
  isAdmin: boolean,
  isSuperAdmin: boolean
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      is_admin: isAdmin,
      is_super_admin: isSuperAdmin,
    })
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

/**
 * Désactive un compte utilisateur
 */
export async function deactivateUser(userId: string): Promise<void> {
  // Note: Supabase Auth doesn't have a built-in "deactivated" status
  // We could add a custom field or use metadata
  // For now, we'll just log this action
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      deactivated: true,
      deactivated_at: new Date().toISOString(),
    },
  });

  if (error) {
    throw error;
  }
}

/**
 * Récupère les détails complets d'un utilisateur
 */
export async function getUserDetails(userId: string): Promise<UserWithSubscription | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!profile) {
    return null;
  }

  // Get subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status, plan_name, start_date, end_date')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get payment count
  const { count: paymentCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return {
    ...profile,
    subscription: subscription || null,
    payment_count: paymentCount || 0,
  };
}
