# Configuration des Variables d'Environnement

Ce guide explique comment configurer les variables d'environnement pour Tranzak et Supabase.

## Variables Nécessaires

### Variables Tranzak

- `VITE_TRANZAK_APP_ID` - Votre App ID Tranzak (obtenu depuis https://developer.tranzak.me)
- `VITE_TRANZAK_APP_KEY` - Votre App Key Tranzak
- `VITE_TRANZAK_API_URL` - URL de l'API Tranzak (sandbox ou production)
  - Sandbox: `https://sandbox.dsapi.tranzak.me`
  - Production: `https://dsapi.tranzak.me`
- `VITE_TRANZAK_WEBHOOK_SECRET` - Secret pour vérifier les webhooks (optionnel mais recommandé)

### Variables Supabase

- `VITE_SUPABASE_URL` - URL de votre projet Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Clé publique (anon key) de Supabase

### Variable Application

- `VITE_APP_URL` - URL de votre application (pour les redirections)
  - Développement: `http://localhost:8080`
  - Production: `https://votre-domaine.com`

## 1. Développement Local

### Étape 1: Créer le fichier .env

Créez un fichier `.env` à la racine du projet `kcp-official-website/` :

```bash
# Dans kcp-official-website/
touch .env
```

### Étape 2: Ajouter les variables

Ouvrez le fichier `.env` et ajoutez les variables suivantes :

```env
# Supabase Configuration
VITE_SUPABASE_URL=votre_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=votre_supabase_anon_key

# Tranzak API Configuration (Sandbox)
VITE_TRANZAK_APP_ID=votre_tranzak_app_id
VITE_TRANZAK_APP_KEY=votre_tranzak_app_key
VITE_TRANZAK_API_URL=https://sandbox.dsapi.tranzak.me
VITE_TRANZAK_WEBHOOK_SECRET=votre_webhook_secret

# Application URL
VITE_APP_URL=http://localhost:8080
```

### Étape 3: Obtenir les identifiants Tranzak

1. Visitez https://developer.tranzak.me
2. Créez un compte ou connectez-vous
3. Créez une nouvelle application
4. Copiez l'**App ID** et l'**App Key**
5. Pour le webhook secret, vous pouvez générer une chaîne aléatoire sécurisée

### Étape 4: Obtenir les identifiants Supabase

1. Visitez https://supabase.com
2. Accédez à votre projet
3. Allez dans **Settings** > **API**
4. Copiez l'**Project URL** (VITE_SUPABASE_URL)
5. Copiez l'**anon public** key (VITE_SUPABASE_PUBLISHABLE_KEY)

### Important

Le fichier `.env` est normalement ignoré par Git (pour la sécurité). Ne commitez JAMAIS ce fichier avec vos vraies clés !

## 2. Production (Vercel)

### Étape 1: Accéder aux Settings du projet Vercel

1. Connectez-vous à https://vercel.com
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**

### Étape 2: Ajouter les variables

Pour chaque variable, cliquez sur **Add New** et ajoutez :

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | Votre URL Supabase | Production, Preview, Development |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Votre clé Supabase | Production, Preview, Development |
| `VITE_TRANZAK_APP_ID` | Votre App ID Tranzak | Production, Preview, Development |
| `VITE_TRANZAK_APP_KEY` | Votre App Key Tranzak | Production, Preview, Development |
| `VITE_TRANZAK_API_URL` | `https://dsapi.tranzak.me` (production) | Production |
| `VITE_TRANZAK_WEBHOOK_SECRET` | Votre webhook secret | Production, Preview, Development |
| `VITE_APP_URL` | `https://votre-domaine.com` | Production |

**Important**: Pour la production, utilisez `https://dsapi.tranzak.me` (pas sandbox).

### Étape 3: Redéployer

Après avoir ajouté les variables, redéployez votre application :

1. Allez dans **Deployments**
2. Cliquez sur les trois points (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**

Ou simplement poussez un nouveau commit, Vercel redéploiera automatiquement.

## 3. Supabase Edge Functions (Webhook)

Pour l'Edge Function `tranzak-webhook`, vous devez aussi configurer les variables d'environnement dans Supabase.

### Étape 1: Via Supabase Dashboard

1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. Allez dans **Project Settings** > **Edge Functions** > **Secrets**
4. Ajoutez les secrets suivants :

- `SUPABASE_URL` - L'URL de votre projet (déjà disponible normalement)
- `SUPABASE_SERVICE_ROLE_KEY` - La clé service role (dans Settings > API > service_role key)

**Note**: L'Edge Function n'a pas besoin des clés Tranzak car elle reçoit les webhooks depuis Tranzak, pas l'inverse.

### Étape 2: Via CLI Supabase (Recommandé)

```bash
# Installer Supabase CLI si pas déjà fait
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref votre-project-ref

# Définir les secrets
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

## 4. Configuration Tranzak Dashboard

Après avoir déployé l'Edge Function, vous devez configurer l'URL du webhook dans le dashboard Tranzak :

1. Connectez-vous à https://developer.tranzak.me
2. Allez dans votre application
3. Trouvez la section **Webhooks**
4. Configurez l'URL du webhook :

```
https://[votre-project-ref].supabase.co/functions/v1/tranzak-webhook
```

Remplacez `[votre-project-ref]` par l'identifiant de votre projet Supabase (visible dans l'URL de votre projet).

## Vérification

### Développement Local

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Ouvrez la console du navigateur (F12)
3. Vérifiez qu'il n'y a pas d'erreurs liées aux variables manquantes

### Production

1. Vérifiez les logs de déploiement Vercel
2. Testez une transaction sur votre site de production
3. Vérifiez les logs de l'Edge Function dans Supabase Dashboard

## Sécurité

⚠️ **IMPORTANT** :

- Ne commitez JAMAIS le fichier `.env` avec vos vraies clés
- Utilisez des clés différentes pour le développement et la production
- Le webhook secret doit être une chaîne aléatoire sécurisée (32+ caractères)
- Ne partagez jamais vos clés publiquement

## Dépannage

### Erreur: "VITE_TRANZAK_APP_ID is not set"

- Vérifiez que le fichier `.env` existe dans `kcp-official-website/`
- Vérifiez que les variables commencent bien par `VITE_`
- Redémarrez le serveur de développement (`npm run dev`)

### Les variables ne sont pas prises en compte dans Vercel

- Vérifiez que vous avez sélectionné le bon environnement (Production/Preview/Development)
- Redéployez l'application après avoir ajouté les variables
- Vérifiez l'orthographe des noms de variables (sensible à la casse)

### Webhook ne fonctionne pas

- Vérifiez que l'URL du webhook dans Tranzak est correcte
- Vérifiez que l'Edge Function est bien déployée
- Consultez les logs de l'Edge Function dans Supabase Dashboard
