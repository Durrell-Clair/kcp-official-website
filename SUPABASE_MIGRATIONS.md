# Guide d'Application des Migrations Supabase

Ce guide explique comment appliquer les migrations Supabase pour créer les tables nécessaires au fonctionnement du site KAMER CASH PME.

## Tables à créer

Les migrations créent les tables suivantes :
- `public.plans` - Plans d'abonnement (START, PLUS, PRO)
- `public.subscriptions` - Abonnements des utilisateurs
- `public.payments` - Historique des paiements Tranzak
- `public.profiles` - Profils utilisateurs
- `public.licenses` - Licences pour l'application Electron

## Ordre d'exécution des migrations

Les migrations doivent être exécutées dans l'ordre suivant :

1. `20260111172230_fb95678a-6c99-4e97-8d9b-373a7b6513f8.sql` - Crée les tables de base (profiles, subscriptions, licenses) et les fonctions
2. `20250115000001_add_plans_table.sql` - Crée la table `plans` avec les 3 plans d'abonnement
3. `20250115000002_update_subscriptions_table.sql` - Ajoute les colonnes `plan_id`, `plan_name`, `max_users` à la table `subscriptions`
4. `20250115000003_add_payments_table.sql` - Crée la table `payments` pour suivre les paiements Tranzak

## Méthode 1 : Via Supabase Dashboard (Recommandé pour débuter)

### Étape 1 : Accéder au SQL Editor

1. Connectez-vous à [https://supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** dans le menu de gauche

### Étape 2 : Exécuter les migrations

Pour chaque fichier de migration dans l'ordre :

1. Ouvrez le fichier SQL dans votre éditeur local
2. Copiez tout le contenu du fichier
3. Collez-le dans le SQL Editor de Supabase
4. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter`)
5. Vérifiez qu'il n'y a pas d'erreurs dans les résultats

### Étape 3 : Vérifier que les tables existent

Exécutez cette requête pour vérifier que toutes les tables sont créées :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('plans', 'subscriptions', 'payments', 'profiles', 'licenses')
ORDER BY table_name;
```

Vous devriez voir les 5 tables listées.

### Étape 4 : Vérifier que les plans sont insérés

Exécutez cette requête pour vérifier que les 3 plans sont présents :

```sql
SELECT name, display_name, price, max_users, is_active 
FROM public.plans 
ORDER BY price;
```

Vous devriez voir :
- `start` - PME START - 10000 FCFA - 3 utilisateurs
- `plus` - PME PLUS - 20000 FCFA - 10 utilisateurs
- `pro` - PME PRO - 35000 FCFA - 20 utilisateurs

## Méthode 2 : Via Supabase CLI (Recommandé pour production)

### Prérequis

1. Installer Supabase CLI :
   ```bash
   npm install -g supabase
   ```

2. Se connecter :
   ```bash
   supabase login
   ```

3. Lier le projet :
   ```bash
   cd kcp-official-website
   supabase link --project-ref votre-project-ref
   ```
   
   Le `project-ref` se trouve dans l'URL de votre projet Supabase : `https://[project-ref].supabase.co`

### Appliquer les migrations

```bash
cd kcp-official-website
supabase db push
```

Cette commande appliquera toutes les migrations dans l'ordre.

### Vérifier les migrations

```bash
supabase migration list
```

## Résolution de problèmes

### Erreur : "function update_updated_at_column() does not exist"

Si vous obtenez cette erreur, c'est que la fonction n'a pas été créée. La migration `20250115000001_add_plans_table.sql` crée maintenant cette fonction automatiquement, mais si vous avez une version antérieure, exécutez d'abord la migration `20260111172230_fb95678a-6c99-4e97-8d9b-373a7b6513f8.sql`.

### Erreur : "table plans already exists"

Si la table existe déjà mais est vide, vous pouvez simplement insérer les plans :

```sql
INSERT INTO public.plans (name, display_name, price, max_users, features, is_active) VALUES
  (
    'start',
    'PME START',
    10000,
    3,
    '["Toutes fonctions core", "Support WhatsApp", "1 entreprise"]'::jsonb,
    true
  ),
  (
    'plus',
    'PME PLUS',
    20000,
    10,
    '["Toutes fonctions core", "Multi-points de vente", "Export avancé", "Support prioritaire"]'::jsonb,
    true
  ),
  (
    'pro',
    'PME PRO',
    35000,
    20,
    '["Toutes fonctions core", "Multi-points de vente", "API access", "Personnalisations", "Support téléphone dédié"]'::jsonb,
    true
  )
ON CONFLICT (name) DO NOTHING;
```

### Erreur : "permission denied for schema public"

Assurez-vous d'être connecté avec un compte ayant les droits d'administration sur le projet Supabase.

## Vérification finale

Après avoir appliqué toutes les migrations, testez le site :

1. Allez sur `/pricing` - Les 3 plans devraient s'afficher
2. Essayez de créer un compte - Le processus devrait fonctionner
3. Vérifiez les logs Supabase pour d'éventuelles erreurs

## Notes importantes

- Les migrations sont idempotentes dans la mesure du possible (utilisent `CREATE OR REPLACE` et `ON CONFLICT`)
- Ne supprimez jamais les tables en production sans sauvegarder les données
- Les politiques RLS (Row Level Security) sont activées pour protéger les données utilisateurs
- La table `plans` est publique (tous les utilisateurs peuvent la lire) car elle contient uniquement des informations de tarification
