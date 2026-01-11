import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
}

interface Subscription {
  id: string;
  user_id: string;
  status: "active" | "expired" | "cancelled" | "pending";
  start_date: string | null;
  end_date: string | null;
  payment_method: string | null;
  amount: number;
  currency: string;
}

interface License {
  id: string;
  user_id: string;
  license_key: string;
  device_fingerprint: string | null;
  activated_at: string | null;
  expires_at: string;
  is_active: boolean;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setSubscription(null);
      setLicense(null);
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch active subscription
      const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subscriptionData) {
        setSubscription(subscriptionData as Subscription);
      }

      // Fetch active license
      const { data: licenseData } = await supabase
        .from("licenses")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (licenseData) {
        setLicense(licenseData as License);
      }

      setIsLoading(false);
    };

    fetchUserData();
  }, [user]);

  return { profile, subscription, license, isLoading };
};
