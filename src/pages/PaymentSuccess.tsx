import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, isLoading } = useSubscription();

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
          <Card className="border-green-500">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Paiement réussi !</CardTitle>
              <CardDescription>
                Votre abonnement a été activé avec succès.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription && (
                <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Plan</p>
                    <p className="font-semibold">{subscription.plan_name || 'Plan actif'}</p>
                  </div>
                  {subscription.end_date && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Expire le</p>
                      <p className="font-semibold">
                        {new Date(subscription.end_date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Prochaines étapes :</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0">1</span>
                    <span>Retournez sur votre tableau de bord pour obtenir votre clé de licence</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0">2</span>
                    <span>Téléchargez l'application KAMER CASH PME</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0">3</span>
                    <span>Activez votre licence avec votre email et votre clé</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="cta" className="flex-1" asChild>
                  <Link to="/dashboard">
                    <Key className="w-5 h-5 mr-2" />
                    Voir ma clé de licence
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/dashboard">
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger l'application
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

export default PaymentSuccess;
