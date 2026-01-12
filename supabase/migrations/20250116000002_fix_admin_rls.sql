-- Fix RLS policies for admin access
-- This migration fixes the conflict between "Users can view their own profile" 
-- and "Admins can view all profiles" policies
-- 
-- IMPORTANT: We use a SECURITY DEFINER function to avoid infinite recursion
-- when checking admin status, as it bypasses RLS policies.

-- Drop the old conflicting policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile, admins can view all" ON public.profiles;

-- Create a helper function to check if a user is admin
-- This function uses SECURITY DEFINER to bypass RLS and avoid recursion
CREATE OR REPLACE FUNCTION public.is_user_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT COALESCE(is_admin, false) OR COALESCE(is_super_admin, false) INTO is_admin_user
  FROM public.profiles
  WHERE user_id = check_user_id;
  
  RETURN COALESCE(is_admin_user, false);
END;
$$;

-- Create a unified SELECT policy that allows:
-- 1. Users to view their own profile (including is_admin and is_super_admin columns)
-- 2. Admins to view all profiles
-- This uses the helper function to avoid recursion
CREATE POLICY "Users can view own profile, admins can view all"
  ON public.profiles FOR SELECT
  USING (
    -- Users can always see their own profile
    auth.uid() = user_id 
    OR 
    -- Admins can see all profiles (using helper function to avoid recursion)
    public.is_user_admin()
  );

-- Ensure users can update their own profile (keep existing policy)
-- The existing "Users can update their own profile" policy should remain
-- but we'll recreate it to be safe
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Drop and recreate the "Super admins can update any profile" policy
-- to use the helper function and avoid recursion
DROP POLICY IF EXISTS "Super admins can update any profile" ON public.profiles;

-- Create a helper function to check if a user is super admin
CREATE OR REPLACE FUNCTION public.is_user_super_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  is_super_admin_user BOOLEAN;
BEGIN
  SELECT COALESCE(is_super_admin, false) INTO is_super_admin_user
  FROM public.profiles
  WHERE user_id = check_user_id;
  
  RETURN COALESCE(is_super_admin_user, false);
END;
$$;

-- Create the super admin update policy using the helper function
CREATE POLICY "Super admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_user_super_admin())
  WITH CHECK (public.is_user_super_admin());
