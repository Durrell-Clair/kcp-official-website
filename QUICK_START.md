# Guide Rapide : Test Local et Déploiement

## ✅ État actuel

- ✅ Code compilé avec succès
- ✅ Types TypeScript corrigés
- ✅ Imports corrigés
- ✅ Fonts déplacées dans index.html

## 📋 Test en Local

### 1. Créer le fichier .env

Créez un fichier `.env` à la racine de `kcp-official-website/` :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=votre_cle_supabase
VITE_TRANZAK_APP_ID=votre_app_id
VITE_TRANZAK_APP_KEY=votre_app_key
VITE_TRANZAK_API_URL=https://sandbox.dsapi.tranzak.me
VITE_TRANZAK_WEBHOOK_SECRET=votre_secret
VITE_APP_URL=http://localhost:8080
```

### 2. Lancer le serveur de développement

```bash
cd kcp-official-website
npm run dev
```

Ouvrez http://localhost:8080 dans votre navigateur.

### 3. Vérifications

- [ ] Page d'accueil charge correctement
- [ ] Page /pricing affiche les 3 plans
- [ ] Page /register fonctionne
- [ ] Pas d'erreurs dans la console (F12)

## 🚀 Déploiement sur Vercel

### Option 1: Via Vercel Dashboard (Recommandé)

1. **Connecter votre projet**
   - Allez sur https://vercel.com
   - Cliquez "Add New" > "Project"
   - Importez votre dépôt Git (GitHub/GitLab)
   - Sélectionnez le dossier `kcp-official-website`

2. **Configuration automatique**
   - Framework Preset: Vite (détecté automatiquement)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Variables d'environnement**
   - Settings > Environment Variables
   - Ajoutez toutes les variables du `.env`
   - **Important**: Pour production, utilisez `https://dsapi.tranzak.me` (pas sandbox)

4. **Déployer**
   - Cliquez "Deploy"
   - Attendez 2-3 minutes
   - Votre site sera disponible sur `https://votre-projet.vercel.app`

### Option 2: Via CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer (dans kcp-official-website/)
cd kcp-official-website
vercel

# Pour production
vercel --prod
```

Pendant le déploiement, Vercel vous demandera les variables d'environnement.

## ⚙️ Configuration Post-Déploiement

### 1. Mettre à jour VITE_APP_URL

Après le premier déploiement, mettez à jour `VITE_APP_URL` dans Vercel avec votre URL de production :
```
VITE_APP_URL=https://votre-projet.vercel.app
```

Puis redéployez.

### 2. Déployer l'Edge Function Supabase

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

### 3. Configurer le webhook Tranzak

1. Obtenez l'URL de votre Edge Function :
   ```
   https://[project-ref].supabase.co/functions/v1/tranzak-webhook
   ```

2. Dans le dashboard Tranzak :
   - Section Webhooks
   - Ajoutez l'URL ci-dessus

## ✅ Checklist de Déploiement

- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Test local réussi (`npm run dev`)
- [ ] Build réussi (`npm run build`)
- [ ] Projet connecté à Vercel
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Premier déploiement réussi
- [ ] `VITE_APP_URL` mis à jour avec l'URL de production
- [ ] Edge Function Supabase déployée
- [ ] Webhook configuré dans Tranzak

## 🐛 Dépannage

**Build échoue sur Vercel**
- Vérifiez les logs de build dans Vercel Dashboard
- Vérifiez que toutes les variables d'environnement sont configurées

**Site ne charge pas**
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez la console du navigateur (F12)

**Paiements ne fonctionnent pas**
- Vérifiez que les clés Tranzak sont correctes
- Vérifiez que l'Edge Function est déployée
- Vérifiez les logs de l'Edge Function dans Supabase

Pour plus de détails, consultez `TESTING_GUIDE.md` et `ENV_SETUP.md`.
