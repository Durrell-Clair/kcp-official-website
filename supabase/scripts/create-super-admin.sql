-- Script SQL pour créer/promouvoir un super admin
-- À exécuter dans Supabase Dashboard > SQL Editor
-- 
-- INSTRUCTIONS:
-- 1. Appliquez d'abord la migration 20250116000001_add_admin_fields.sql si ce n'est pas déjà fait
-- 2. Créez un compte utilisateur normal via le site (inscription) OU utilisez un compte existant
-- 3. Remplacez 'votre-email@example.com' ci-dessous par l'email du compte
-- 4. Exécutez ce script

-- Étape 1: Ajouter les colonnes admin si elles n'existent pas
DO $$
BEGIN
  -- Ajouter is_admin si n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;

  -- Ajouter is_super_admin si n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_super_admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_super_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Étape 2: Vérifier si un super admin existe déjà
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE is_super_admin = true) THEN
    RAISE NOTICE 'Un super admin existe déjà. Utilisez un compte existant ou modifiez manuellement.';
    RETURN;
  END IF;
END $$;

-- Étape 3: Promouvoir un utilisateur existant en super admin
-- ⚠️ REMPLACEZ 'votre-email@example.com' par l'email de votre compte
UPDATE public.profiles
SET 
  is_super_admin = true,
  is_admin = true
WHERE email = 'votre-email@example.com'  -- ⚠️ REMPLACEZ CETTE VALEUR
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE is_super_admin = true);

-- Étape 4: Vérifier le résultat
SELECT 
  user_id,
  email,
  full_name,
  is_admin,
  is_super_admin,
  created_at
FROM public.profiles
WHERE is_super_admin = true;
