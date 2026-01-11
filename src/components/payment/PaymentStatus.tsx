import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusProps {
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
}

export function PaymentStatus({ status, message }: PaymentStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'En attente',
      description: 'Votre paiement est en cours de traitement',
      variant: 'secondary' as const,
      className: 'text-yellow-600',
    },
    completed: {
      icon: CheckCircle,
      label: 'Payé',
      description: 'Votre paiement a été confirmé avec succès',
      variant: 'default' as const,
      className: 'text-green-600',
    },
    failed: {
      icon: XCircle,
      label: 'Échoué',
      description: 'Votre paiement a échoué. Veuillez réessayer',
      variant: 'destructive' as const,
      className: 'text-red-600',
    },
    cancelled: {
      icon: AlertCircle,
      label: 'Annulé',
      description: 'Le paiement a été annulé',
      variant: 'secondary' as const,
      className: 'text-gray-600',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className={`w-8 h-8 ${config.className}`} />
          <div>
            <CardTitle>Statut du paiement</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </CardContent>
    </Card>
  );
}
