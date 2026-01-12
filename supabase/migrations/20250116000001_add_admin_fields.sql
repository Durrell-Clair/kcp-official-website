-- Add admin fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- Create index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_super_admin ON public.profiles(is_super_admin);

-- Update RLS policies to allow admins to view all profiles (for admin panel)
-- Note: Regular users can still only see their own profile due to existing policies

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND (is_admin = true OR is_super_admin = true)
    )
  );

-- Policy: Super admins can update any profile
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

-- Policy: Super admins can promote/demote admins
-- This is handled by the UPDATE policy above, but we add a comment for clarity
COMMENT ON COLUMN public.profiles.is_admin IS 'Indicates if user has admin privileges';
COMMENT ON COLUMN public.profiles.is_super_admin IS 'Indicates if user has super admin privileges (can manage other admins)';
