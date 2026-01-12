import { useState, useEffect, useCallback } from 'react';
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
 * Avec rafraîchissement automatique et écoute des changements
 */
export function useAdmin(): UseAdminReturn {
  const { user } = useAuth();
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAdminStatus = useCallback(async () => {
    if (!user) {
      setAdminProfile(null);
      setIsLoading(false);
      setError(null);
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
        // Améliorer les messages d'erreur
        let errorMessage = 'Erreur lors de la récupération du statut admin';
        
        if (fetchError.code === 'PGRST116') {
          // Aucune ligne trouvée - profil n'existe pas encore
          errorMessage = 'Profil utilisateur introuvable';
        } else if (fetchError.code === '42501') {
          // Permission denied - problème RLS
          errorMessage = 'Permission refusée. Vérifiez les politiques RLS.';
        } else if (fetchError.message) {
          errorMessage = fetchError.message;
        }
        
        throw new Error(errorMessage);
      }

      if (data) {
        setAdminProfile(data as AdminProfile);
      } else {
        setAdminProfile(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Échec de la récupération du statut admin');
      setError(error);
      setAdminProfile(null);
      
      // Log en mode développement
      if (import.meta.env.DEV) {
        console.error('[useAdmin] Erreur:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAdminStatus();
  }, [fetchAdminStatus]);

  // Écouter les changements sur la table profiles pour rafraîchir automatiquement
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('admin-profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Rafraîchir le statut admin quand le profil est mis à jour
          if (import.meta.env.DEV) {
            console.log('[useAdmin] Profil mis à jour, rafraîchissement...', payload);
          }
          fetchAdminStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchAdminStatus]);

  return {
    isAdmin: adminProfile?.is_admin === true || adminProfile?.is_super_admin === true,
    isSuperAdmin: adminProfile?.is_super_admin === true,
    adminProfile,
    isLoading,
    error,
    refetch: fetchAdminStatus,
  };
}
