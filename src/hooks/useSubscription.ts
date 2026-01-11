import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  start_date: string | null;
  end_date: string | null;
  payment_method: string | null;
  amount: number;
  currency: string;
  plan_id: string | null;
  plan_name: string | null;
  max_users: number | null;
}

export interface UseSubscriptionReturn {
  subscription: Subscription | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Fetch active subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subscriptionError) {
        throw subscriptionError;
      }

      if (subscriptionData) {
        setSubscription(subscriptionData as Subscription);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch subscription');
      setError(error);
      console.error('Error fetching subscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
  };
}
