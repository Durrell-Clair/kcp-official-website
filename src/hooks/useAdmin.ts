import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface AdminProfile {
  user_id: string;
  is_admin: boolean;
  is_super_admin: boolean;
  full_name: string | null;
  email: string | null;
}

export interface UseAdminReturn {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminProfile: AdminProfile | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour vérifier les permissions admin de l'utilisateur actuel
 */
export function useAdmin(): UseAdminReturn {
  const { user } = useAuth();
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAdminStatus = async () => {
    if (!user) {
      setAdminProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('user_id, is_admin, is_super_admin, full_name, email')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setAdminProfile(data as AdminProfile);
      } else {
        setAdminProfile(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch admin status');
      setError(error);
      setAdminProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStatus();
  }, [user]);

  return {
    isAdmin: adminProfile?.is_admin === true || adminProfile?.is_super_admin === true,
    isSuperAdmin: adminProfile?.is_super_admin === true,
    adminProfile,
    isLoading,
    error,
    refetch: fetchAdminStatus,
  };
}
