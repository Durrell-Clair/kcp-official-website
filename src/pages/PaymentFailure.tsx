import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-destructive/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Paiement échoué</CardTitle>
              <CardDescription>
                Votre paiement n'a pas pu être traité.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Le paiement n'a pas pu être complété. Cela peut être dû à plusieurs raisons :
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Fonds insuffisants sur votre compte Mobile Money</li>
                  <li>Transaction annulée</li>
                  <li>Problème technique temporaire</li>
                  <li>Erreur réseau</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Que faire maintenant ?</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0">1</span>
                    <span>Vérifiez que vous avez suffisamment de fonds sur votre compte Mobile Money</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0">2</span>
                    <span>Réessayez le paiement depuis votre tableau de bord</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0">3</span>
                    <span>Si le problème persiste, contactez notre support</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="cta" className="flex-1" asChild>
                  <Link to="/pricing">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Réessayer le paiement
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/dashboard">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Retour au tableau de bord
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFailure;
