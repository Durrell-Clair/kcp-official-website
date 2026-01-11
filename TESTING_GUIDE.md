# Guide de Test Local et Déploiement

## Étape 1: Configuration Initiale

### 1.1 Créer le fichier .env

Créez un fichier `.env` à la racine du projet `kcp-official-website/` avec ce contenu :

```env
# Supabase Configuration
VITE_SUPABASE_URL=votre_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=votre_supabase_anon_key

# Tranzak API Configuration (Sandbox pour le développement)
VITE_TRANZAK_APP_ID=votre_tranzak_app_id
VITE_TRANZAK_APP_KEY=votre_tranzak_app_key
VITE_TRANZAK_API_URL=https://sandbox.dsapi.tranzak.me
VITE_TRANZAK_WEBHOOK_SECRET=votre_webhook_secret

# Application URL
VITE_APP_URL=http://localhost:8080
```

### 1.2 Obtenir les identifiants Supabase

1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. Settings > API
4. Copiez :
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_PUBLISHABLE_KEY`

### 1.3 Obtenir les identifiants Tranzak

1. Allez sur https://developer.tranzak.me
2. Connectez-vous ou créez un compte
3. Créez une application
4. Copiez :
   - App ID → `VITE_TRANZAK_APP_ID`
   - App Key → `VITE_TRANZAK_APP_KEY`
5. Pour le webhook secret, générez une chaîne aléatoire (32+ caractères)

### 1.4 Appliquer les migrations Supabase

Avant de tester, vous devez appliquer les migrations Supabase :

```bash
# Installer Supabase CLI (si pas déjà fait)
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
cd kcp-official-website
supabase link --project-ref votre-project-ref

# Appliquer les migrations
supabase db push
```

Ou via le dashboard Supabase :
1. Allez dans SQL Editor
2. Exécutez les fichiers SQL dans `supabase/migrations/` dans l'ordre

## Étape 2: Test Local

### 2.1 Installer les dépendances

```bash
cd kcp-official-website
npm install
```

### 2.2 Lancer le serveur de développement

```bash
npm run dev
```

Le serveur devrait démarrer sur http://localhost:8080

### 2.3 Vérifications

1. **Page d'accueil** : Ouvrez http://localhost:8080
   - Vérifiez que la page se charge sans erreur
   - Vérifiez la console (F12) pour les erreurs

2. **Page Pricing** : http://localhost:8080/pricing
   - Vérifiez que les 3 plans s'affichent
   - Vérifiez que les prix et caractéristiques sont corrects

3. **Inscription** : http://localhost:8080/register?plan=start
   - Testez l'inscription avec un email
   - Vérifiez que le plan sélectionné apparaît
   - Après inscription, vous devriez être redirigé vers /payment/[paymentId]

4. **Page de paiement** : 
   - Vérifiez que le QR code s'affiche (si disponible)
   - Vérifiez que le bouton "Payer maintenant" fonctionne

### 2.4 Tests fonctionnels

#### Test 1: Inscription avec plan
1. Allez sur /pricing
2. Cliquez sur "Choisir PME START"
3. Remplissez le formulaire d'inscription
4. Vérifiez que vous êtes redirigé vers la page de paiement

#### Test 2: Dashboard
1. Connectez-vous
2. Allez sur /dashboard
3. Vérifiez que les informations s'affichent correctement

### 2.5 Erreurs courantes

**Erreur: "VITE_TRANZAK_APP_ID is not set"**
- Vérifiez que le fichier `.env` existe
- Vérifiez que les variables commencent par `VITE_`
- Redémarrez le serveur (`npm run dev`)

**Erreur: Cannot connect to Supabase**
- Vérifiez vos credentials Supabase
- Vérifiez que le projet Supabase est actif

**Erreur: Plans not found**
- Vérifiez que les migrations ont été appliquées
- Vérifiez que les plans existent dans la table `plans`

## Étape 3: Déploiement sur Vercel

### 3.1 Prérequis

1. Compte Vercel (https://vercel.com)
2. Projet connecté à un dépôt Git (GitHub, GitLab, etc.)

### 3.2 Préparer le projet

```bash
# Vérifier que le build fonctionne
cd kcp-official-website
npm run build

# Si le build réussit, vous êtes prêt
```

### 3.3 Déployer via Vercel Dashboard

1. **Connecter le projet**
   - Allez sur https://vercel.com
   - Cliquez sur "Add New" > "Project"
   - Importez votre dépôt Git
   - Sélectionnez le dossier `kcp-official-website`

2. **Configuration du build**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Variables d'environnement**
   - Allez dans Settings > Environment Variables
   - Ajoutez toutes les variables du `.env.example`
   - **Important**: Pour `VITE_TRANZAK_API_URL`, utilisez `https://dsapi.tranzak.me` (production)
   - Pour `VITE_APP_URL`, utilisez votre URL Vercel (ex: `https://votre-projet.vercel.app`)

4. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez que le déploiement se termine

### 3.4 Déployer via CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd kcp-official-website
vercel

# Pour la production
vercel --prod
```

Pendant le déploiement, Vercel vous demandera les variables d'environnement si elles ne sont pas configurées.

### 3.5 Déployer l'Edge Function Supabase

L'Edge Function pour les webhooks doit être déployée séparément :

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
cd kcp-official-website
supabase link --project-ref votre-project-ref

# Déployer la function
supabase functions deploy tranzak-webhook
```

### 3.6 Configurer le webhook Tranzak

Après avoir déployé l'Edge Function :

1. Obtenez l'URL de votre function :
   ```
   https://[votre-project-ref].supabase.co/functions/v1/tranzak-webhook
   ```

2. Dans le dashboard Tranzak :
   - Allez dans votre application
   - Section Webhooks
   - Configurez l'URL du webhook avec l'URL ci-dessus

### 3.7 Vérifications post-déploiement

1. **Site web** : Visitez votre URL Vercel
   - Testez toutes les pages
   - Vérifiez la console pour les erreurs

2. **Paiements** : Testez un paiement réel (en sandbox d'abord)
   - Vérifiez que le webhook est reçu
   - Vérifiez que l'abonnement est créé
   - Vérifiez que la licence est générée

3. **Logs** :
   - Vercel : Dashboard > Deployments > Logs
   - Supabase : Dashboard > Edge Functions > Logs

## Checklist de déploiement

- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Migrations Supabase appliquées
- [ ] Test local réussi (`npm run build` fonctionne)
- [ ] Compte Vercel créé
- [ ] Projet connecté à Git
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Déploiement Vercel réussi
- [ ] Edge Function Supabase déployée
- [ ] Webhook configuré dans Tranzak
- [ ] Tests sur la production réussis

## Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs (Vercel et Supabase)
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que toutes les variables d'environnement sont configurées
4. Consultez le fichier `ENV_SETUP.md` pour plus de détails
