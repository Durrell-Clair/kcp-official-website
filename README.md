# KAMER CASH PME - Site Officiel

Site web officiel pour KAMER CASH PME, le logiciel de gestion financière conçu pour les PME et commerçants camerounais.

## 🎯 Description

KAMER CASH PME est une plateforme web permettant aux PME camerounaises de s'abonner à un logiciel de gestion financière. Le site permet aux utilisateurs de :

- Créer un compte
- Choisir parmi 3 plans d'abonnement mensuel (START, PLUS, PRO)
- Payer via Mobile Money (MTN MoMo, Orange Money) via l'API Tranzak
- Gérer leur abonnement et consulter leur historique de paiements

## 🛠️ Technologies

Ce projet utilise :

- **Frontend** :
  - [Vite](https://vitejs.dev/) - Build tool et dev server
  - [React](https://react.dev/) - Bibliothèque UI
  - [TypeScript](https://www.typescriptlang.org/) - Typage statique
  - [React Router](https://reactrouter.com/) - Routing
  - [shadcn/ui](https://ui.shadcn.com/) - Composants UI
  - [Tailwind CSS](https://tailwindcss.com/) - Styling

- **Backend** :
  - [Supabase](https://supabase.com/) - Base de données PostgreSQL, authentification, Edge Functions
  - [Tranzak API](https://developer.tranzak.me/) - Paiements Mobile Money

- **Déploiement** :
  - [Vercel](https://vercel.com/) - Hosting et déploiement

## 📋 Prérequis

- Node.js 18+ et npm (ou yarn, pnpm)
- Un compte Supabase
- Un compte Tranzak Developer (pour les paiements)

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=votre_cle_supabase
VITE_TRANZAK_APP_ID=votre_app_id
VITE_TRANZAK_APP_KEY=votre_app_key
VITE_TRANZAK_API_URL=https://sandbox.dsapi.tranzak.me
VITE_TRANZAK_WEBHOOK_SECRET=votre_webhook_secret
VITE_APP_URL=http://localhost:8080
```

Pour plus de détails, consultez [`ENV_SETUP.md`](./ENV_SETUP.md).

### 3. Configuration de la base de données

Appliquez les migrations Supabase pour créer les tables nécessaires. Consultez [`SUPABASE_MIGRATIONS.md`](./SUPABASE_MIGRATIONS.md) pour les instructions détaillées.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:8080`.

## 📚 Documentation

- [`ENV_SETUP.md`](./ENV_SETUP.md) - Configuration des variables d'environnement
- [`QUICK_START.md`](./QUICK_START.md) - Guide de démarrage rapide
- [`SUPABASE_MIGRATIONS.md`](./SUPABASE_MIGRATIONS.md) - Application des migrations Supabase
- [`TESTING_GUIDE.md`](./TESTING_GUIDE.md) - Guide de test local

## 🏗️ Structure du projet

```
kcp-official-website/
├── public/              # Assets statiques (logo, favicon)
├── src/
│   ├── components/      # Composants React réutilisables
│   │   ├── layout/     # Header, Footer
│   │   ├── landing/    # Sections de la page d'accueil
│   │   ├── pricing/    # Composants de tarification
│   │   ├── payment/    # Composants de paiement
│   │   └── ui/         # Composants shadcn/ui
│   ├── config/         # Configuration (pricing, tranzak)
│   ├── contexts/       # Contextes React (Auth)
│   ├── hooks/          # Hooks personnalisés
│   ├── integrations/    # Intégrations (Supabase)
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services API
│   └── main.tsx        # Point d'entrée
├── supabase/
│   ├── functions/      # Edge Functions (webhooks)
│   └── migrations/    # Migrations SQL
└── vercel.json         # Configuration Vercel
```

## 🚢 Déploiement

### Déploiement sur Vercel

1. **Connecter le projet** :
   - Allez sur [vercel.com](https://vercel.com)
   - Importez votre dépôt Git
   - Sélectionnez le dossier `kcp-official-website`

2. **Configuration** :
   - Framework Preset: Vite (détecté automatiquement)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Variables d'environnement** :
   - Ajoutez toutes les variables du `.env` dans Vercel Dashboard
   - **Important** : Pour la production, utilisez `https://dsapi.tranzak.me` (pas sandbox)

4. **Déployer** :
   - Vercel déploiera automatiquement à chaque push sur la branche principale

Pour plus de détails, consultez [`QUICK_START.md`](./QUICK_START.md).

## 🔧 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Vérifie le code avec ESLint

## 📝 Plans d'abonnement

Le site propose 3 plans d'abonnement mensuel :

- **PME START** : 10,000 FCFA/mois - 3 utilisateurs
- **PME PLUS** : 20,000 FCFA/mois - 10 utilisateurs
- **PME PRO** : 35,000 FCFA/mois - 20 utilisateurs

Les plans sont stockés dans la table `public.plans` de Supabase.

## 🔐 Sécurité

- Les variables d'environnement sensibles ne doivent jamais être commitées
- Le fichier `.env` est dans `.gitignore`
- Les clés API doivent être différentes entre développement et production
- Les webhooks Tranzak sont vérifiés avec un secret partagé

## 📞 Support

Pour toute question ou problème :

- Email : support@kamercash.cm
- Site : https://www.kamer-cash-pme.com

## 📄 Licence

© 2025 KAMER CASH PME. Tous droits réservés.
