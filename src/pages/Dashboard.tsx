import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  LogOut, 
  User, 
  Calendar, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  Users,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { usePlanById } from "@/hooks/usePlans";
import { useUserPayments } from "@/hooks/usePayment";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/config/pricing";

const Dashboard = () => {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const { plan: currentPlan, isLoading: planLoading } = usePlanById(subscription?.plan_id || null);
  const { payments, isLoading: paymentsLoading } = useUserPayments();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch profile and license from useUserData (keep existing functionality)
  const [profile, setProfile] = useState<any>(null);
  const [license, setLicense] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) setProfile(profileData);

      const { data: licenseData } = await supabase
        .from("licenses")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (licenseData) setLicense(licenseData);
      setDataLoading(false);
    };

    fetchUserData();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const copyLicenseKey = () => {
    if (license?.license_key) {
      navigator.clipboard.writeText(license.license_key);
      toast({
        title: "Clé copiée",
        description: "La clé de licence a été copiée dans le presse-papiers.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || dataLoading || subscriptionLoading || planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isSubscriptionActive = subscription?.status === "active";
  const displayName = profile?.full_name || user.email?.split("@")[0] || "Utilisateur";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">KC</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground hidden sm:block">
                KAMER CASH <span className="text-primary">PME</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Gérez votre abonnement et téléchargez l'application KAMER CASH PME.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subscription Status Card */}
          <div className="lg:col-span-2 bg-background border border-border rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isSubscriptionActive ? "bg-primary/10" : "bg-destructive/10"
              }`}>
                {isSubscriptionActive ? (
                  <CheckCircle className="w-6 h-6 text-primary" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-destructive" />
                )}
              </div>
              <div>
                <h2 className="font-display font-semibold text-xl">Statut de l'abonnement</h2>
                <p className={`text-sm font-medium ${
                  isSubscriptionActive ? "text-primary" : "text-destructive"
                }`}>
                  {subscription ? (isSubscriptionActive ? "Actif" : "Expiré") : "Aucun abonnement"}
                </p>
              </div>
            </div>

            {subscription ? (
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date de début</span>
                  </div>
                  <p className="font-semibold">
                    {subscription.start_date 
                      ? new Date(subscription.start_date).toLocaleDateString('fr-FR')
                      : "Non définie"
                    }
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date d'expiration</span>
                  </div>
                  <p className="font-semibold">
                    {subscription.end_date 
                      ? new Date(subscription.end_date).toLocaleDateString('fr-FR')
                      : "Non définie"
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-xl p-6 mb-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas encore d'abonnement actif.
                </p>
                <Button variant="cta" asChild>
                  <Link to="/pricing">Voir les tarifs</Link>
                </Button>
              </div>
            )}

            {subscription && !isSubscriptionActive && (
              <Button variant="cta" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/pricing">Renouveler mon abonnement</Link>
              </Button>
            )}
            
            {!subscription && (
              <Button variant="cta" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/pricing">S'abonner maintenant</Link>
              </Button>
            )}
          </div>

          {/* User Info Card */}
          <div className="bg-background border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Mon compte</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* License Key Card */}
          <div className="lg:col-span-2 bg-background border border-border rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Key className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xl">Clé de licence</h2>
                <p className="text-sm text-muted-foreground">
                  {license ? "Utilisez cette clé pour activer votre application" : "Disponible après abonnement"}
                </p>
              </div>
            </div>

            {license ? (
              <>
                <div className="bg-muted rounded-xl p-4 flex items-center justify-between gap-4 mb-4">
                  <code className="font-mono text-lg font-semibold break-all">
                    {license.license_key}
                  </code>
                  <Button variant="ghost" size="icon" onClick={copyLicenseKey}>
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Important :</strong> Cette clé est liée à votre ordinateur. 
                  Ne la partagez pas avec d'autres personnes.
                </p>
              </>
            ) : (
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <p className="text-muted-foreground">
                  Votre clé de licence sera générée après votre premier paiement.
                </p>
              </div>
            )}
          </div>

          {/* Download Card */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xl">Télécharger</h2>
              </div>
            </div>

            <p className="text-primary-foreground/80 mb-6">
              Téléchargez KAMER CASH PME pour Windows et commencez à gérer vos finances.
            </p>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              disabled={!isSubscriptionActive}
            >
              <Download className="w-5 h-5" />
              <span>Télécharger pour Windows</span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            {!isSubscriptionActive && (
              <p className="text-sm text-primary-foreground/60 mt-3 text-center">
                Abonnez-vous pour télécharger
              </p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-background border border-border rounded-2xl p-6 lg:p-8">
          <h2 className="font-display font-semibold text-xl mb-4">
            Comment activer l'application ?
          </h2>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">1</span>
              <span>Téléchargez et installez KAMER CASH PME sur votre ordinateur</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">2</span>
              <span>Au premier lancement, entrez votre email et votre clé de licence</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">3</span>
              <span>L'application vérifie votre licence (connexion internet requise une seule fois)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">4</span>
              <span>Une fois activée, l'application fonctionne 100% hors ligne</span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
