import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Payment } from '@/services/payment.service';
import { formatPrice } from '@/config/pricing';

interface TranzakPaymentFormProps {
  payment: Payment;
  onRedirect: () => void;
  isLoading?: boolean;
}

export function TranzakPaymentForm({ payment, onRedirect, isLoading = false }: TranzakPaymentFormProps) {
  if (!payment.payment_url) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur de paiement</CardTitle>
          <CardDescription>L'URL de paiement n'est pas disponible.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finaliser votre paiement</CardTitle>
        <CardDescription>
          Montant à payer : <strong>{formatPrice(payment.amount)} {payment.currency}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {payment.qr_code && (
          <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-xl">
            <QrCode className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Scannez le code QR avec votre application Mobile Money
            </p>
            <div 
              className="bg-white p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: payment.qr_code }}
            />
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Ou cliquez sur le bouton ci-dessous pour être redirigé vers la page de paiement Tranzak
          </p>
          
          <Button
            variant="cta"
            size="lg"
            className="w-full"
            onClick={onRedirect}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Redirection...
              </>
            ) : (
              <>
                <span>Payer maintenant</span>
                <ExternalLink className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Les paiements sont sécurisés par Tranzak. Vous pouvez payer via MTN MoMo ou Orange Money.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
