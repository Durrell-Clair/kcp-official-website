# Edge Function: init-super-admin

Cette Edge Function initialise le super administrateur du système lors du premier déploiement.

## Configuration

### Variables d'environnement requises

Configurez ces variables dans Supabase Dashboard > Project Settings > Edge Functions > Secrets :

- `SUPER_ADMIN_EMAIL` - Email du super administrateur
- `SUPER_ADMIN_PASSWORD` - Mot de passe du super administrateur
- `SUPER_ADMIN_NAME` - Nom du super administrateur (optionnel, défaut: "Super Admin")

Les variables suivantes sont automatiquement disponibles :
- `SUPABASE_URL` - URL du projet Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Clé service role (accès complet)

## Utilisation

### Via Supabase Dashboard

1. Allez dans **Edge Functions** > **init-super-admin**
2. Cliquez sur **Invoke**
3. La fonction vérifiera si un super admin existe déjà
4. Si non, elle créera le compte avec les credentials configurés

### Via cURL

```bash
curl -X POST \
  'https://[project-ref].supabase.co/functions/v1/init-super-admin' \
  -H 'Authorization: Bearer [anon-key]' \
  -H 'Content-Type: application/json'
```

### Via Supabase CLI

```bash
supabase functions invoke init-super-admin
```

## Sécurité

- ⚠️ **Cette fonction ne peut être exécutée qu'une seule fois** pour des raisons de sécurité
- Si un super admin existe déjà, la fonction retournera un message d'avertissement
- Les credentials ne doivent JAMAIS être commités dans le code
- Utilisez uniquement les variables d'environnement Supabase pour les secrets

## Notes

- L'email du super admin sera automatiquement confirmé
- Si un utilisateur avec cet email existe déjà, son profil sera mis à jour pour devenir super admin
- Le mot de passe sera mis à jour si l'utilisateur existe déjà
