# Scripts SQL Supabase

## create-super-admin.sql

Script pour promouvoir un utilisateur existant en super administrateur.

### Méthode recommandée : Utiliser l'Edge Function

La méthode la plus simple est d'utiliser l'Edge Function `init-super-admin` :

1. Configurez les secrets dans Supabase Dashboard > Edge Functions > Secrets
2. Déployez la fonction `init-super-admin`
3. Invoquez la fonction depuis le dashboard

### Méthode alternative : Script SQL

Si l'Edge Function ne fonctionne pas, vous pouvez utiliser ce script SQL :

1. **Créez d'abord un compte utilisateur normal** :
   - Allez sur votre site
   - Créez un compte avec l'email que vous voulez utiliser comme admin

2. **Exécutez le script SQL** :
   - Allez dans Supabase Dashboard > SQL Editor
   - Ouvrez le fichier `create-super-admin.sql`
   - Remplacez `'votre-email@example.com'` par votre email
   - Exécutez le script

3. **Vérifiez le résultat** :
   - Le script affichera les informations du super admin créé
   - Vous pouvez maintenant vous connecter avec cet email et accéder à `/admin`
