# Tranzak Webhook Function

Cette Edge Function Supabase reçoit les webhooks de Tranzak et met à jour les paiements, crée les abonnements et génère les licences.

## Configuration

Cette fonction nécessite les variables d'environnement suivantes :
- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role de Supabase (pour bypass RLS)

## Déploiement

```bash
supabase functions deploy tranzak-webhook
```

## Configuration Tranzak

Dans le dashboard Tranzak, configurez l'URL du webhook :
```
https://[project-ref].supabase.co/functions/v1/tranzak-webhook
```

## Événements

La fonction gère deux types d'événements :
- `SUCCESSFUL` : Paiement réussi → Crée/étend l'abonnement et génère/met à jour la licence
- `FAILED` : Paiement échoué → Met à jour le statut du paiement
