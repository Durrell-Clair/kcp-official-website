-- Script SQL pour promouvoir un utilisateur existant en super admin
-- À exécuter dans Supabase Dashboard > SQL Editor
-- 
-- INSTRUCTIONS:
-- 1. Créez d'abord un compte utilisateur normal via le site (inscription)
-- 2. Remplacez 'votre-email@example.com' ci-dessous par l'email du compte
-- 3. Exécutez ce script

-- Vérifier si un super admin existe déjà
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE is_super_admin = true) THEN
    RAISE NOTICE 'Un super admin existe déjà. Utilisez un compte existant ou modifiez manuellement.';
    RETURN;
  END IF;
END $$;

-- Promouvoir un utilisateur existant en super admin
-- Remplacez 'votre-email@example.com' par l'email de votre compte
UPDATE public.profiles
SET 
  is_super_admin = true,
  is_admin = true
WHERE email = 'votre-email@example.com'  -- ⚠️ REMPLACEZ CETTE VALEUR
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE is_super_admin = true);

-- Vérifier le résultat
SELECT 
  user_id,
  email,
  full_name,
  is_admin,
  is_super_admin,
  created_at
FROM public.profiles
WHERE is_super_admin = true;
