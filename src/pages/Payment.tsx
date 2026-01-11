import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { TranzakPaymentForm } from '@/components/payment/TranzakPaymentForm';
import { PaymentStatus } from '@/components/payment/PaymentStatus';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Payment = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { payment, isLoading, error } = usePayment(paymentId || null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (payment && payment.user_id !== user.id) {
      toast({
        title: 'Erreur',
        description: "Vous n'avez pas accès à ce paiement.",
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    // Si le paiement est complété, rediriger vers success
    if (payment && payment.status === 'completed') {
      navigate('/payment/success');
      return;
    }

    // Si le paiement a échoué, rediriger vers failure
    if (payment && payment.status === 'failed') {
      navigate('/payment/failure');
      return;
    }
  }, [payment, user, navigate, toast]);

  const handleRedirect = () => {
    if (!payment?.payment_url) {
      toast({
        title: 'Erreur',
        description: "L'URL de paiement n'est pas disponible.",
        variant: 'destructive',
      });
      return;
    }

    setIsRedirecting(true);
    window.location.href = payment.payment_url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement du paiement...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-background border border-border rounded-2xl p-8 text-center">
              <h1 className="font-display text-2xl font-bold mb-4">Paiement introuvable</h1>
              <p className="text-muted-foreground mb-6">
                {error?.message || "Le paiement demandé n'existe pas ou n'est plus disponible."}
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Retour au tableau de bord
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Paiement</h1>
            <p className="text-muted-foreground">Finalisez votre paiement pour activer votre abonnement</p>
          </div>

          <PaymentStatus status={payment.status} />

          {payment.status === 'pending' && (
            <TranzakPaymentForm
              payment={payment}
              onRedirect={handleRedirect}
              isLoading={isRedirecting}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
