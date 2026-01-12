-- Fix RLS policies for admin access
-- This migration fixes the conflict between "Users can view their own profile" 
-- and "Admins can view all profiles" policies

-- Drop the old conflicting policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a unified SELECT policy that allows:
-- 1. Users to view their own profile (including is_admin and is_super_admin columns)
-- 2. Admins to view all profiles
CREATE POLICY "Users can view own profile, admins can view all"
  ON public.profiles FOR SELECT
  USING (
    -- Users can always see their own profile
    auth.uid() = user_id 
    OR 
    -- Admins can see all profiles
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND (p.is_admin = true OR p.is_super_admin = true)
    )
  );

-- Ensure users can update their own profile (keep existing policy)
-- The existing "Users can update their own profile" policy should remain
-- but we'll recreate it to be safe
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- The "Super admins can update any profile" policy from the previous migration
-- should work correctly now that the SELECT policy is fixed
-- We'll verify it exists, if not, recreate it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Super admins can update any profile'
  ) THEN
    CREATE POLICY "Super admins can update any profile"
      ON public.profiles FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE user_id = auth.uid()
          AND is_super_admin = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE user_id = auth.uid()
          AND is_super_admin = true
        )
      );
  END IF;
END $$;
