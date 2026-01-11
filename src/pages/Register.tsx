import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/hooks/usePlans";
import { useTranzak } from "@/hooks/useTranzak";
import { formatPrice } from "@/config/pricing";
import { supabase } from "@/integrations/supabase/client";
import { createPayment } from "@/services/payment.service";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().trim().email("Adresse email invalide").max(255),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const Register = () => {
  const [searchParams] = useSearchParams();
  const planName = searchParams.get('plan');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { plan, isLoading: planLoading } = usePlan(planName);
  const { createPaymentRequest } = useTranzak();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const result = registerSchema.safeParse({ name, email, password, confirmPassword });
    
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast({
        title: "Erreur de validation",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, name);

    if (error) {
      setIsLoading(false);
      let errorMessage = "Une erreur est survenue lors de l'inscription.";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "Un compte existe déjà avec cet email.";
      } else if (error.message.includes("Password")) {
        errorMessage = "Le mot de passe ne respecte pas les critères de sécurité.";
      }

      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    // Attendre que la session soit créée
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user;

    // Si un plan est sélectionné, créer un payment request
    if (planName && plan && currentUser) {
      try {
        // Créer payment request Tranzak
        const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
        const paymentResponse = await createPaymentRequest(
          plan.price,
          'XAF',
          `Abonnement ${plan.display_name} - KAMER KASH PME`,
          `${appUrl}/payment/success`,
          `${appUrl}/payment/failure`,
          { plan_id: plan.id, plan_name: plan.name }
        );

        // Sauvegarder payment dans DB
        const payment = await createPayment({
          user_id: currentUser.id,
          plan_id: plan.id,
          amount: plan.price,
          currency: 'XAF',
          tranzak_request_id: paymentResponse.requestId,
          payment_url: paymentResponse.paymentUrl,
          qr_code: paymentResponse.qrCode || null,
          metadata: { plan_name: plan.name },
        });
        
        toast({
          title: "Compte créé avec succès !",
          description: "Redirection vers le paiement...",
        });

        // Rediriger vers la page de paiement
        navigate(`/payment/${payment.id}`);
      } catch (paymentError) {
        console.error('Payment creation error:', paymentError);
        toast({
          title: "Compte créé",
          description: "Une erreur est survenue lors de la création du paiement. Vous pouvez continuer depuis le tableau de bord.",
          variant: "default",
        });
        navigate("/dashboard");
      }
    } else {
      toast({
        title: "Compte créé avec succès !",
        description: "Bienvenue sur KAMER CASH PME !",
      });
      navigate("/dashboard");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/80" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">KC</span>
            </div>
            <span className="font-display font-bold text-2xl text-secondary-foreground">
              KAMER CASH <span className="text-primary">PME</span>
            </span>
          </Link>

          <h1 className="font-display text-4xl lg:text-5xl font-bold text-secondary-foreground mb-6">
            Commencez à gérer vos finances
          </h1>
          <p className="text-secondary-foreground/70 text-lg max-w-md mb-8">
            Créez votre compte en quelques secondes et accédez immédiatement à KAMER CASH PME.
          </p>

          <ul className="space-y-4">
            {[
              "Inscription gratuite et rapide",
              "Paiement sécurisé par Mobile Money",
              "Accès immédiat après paiement",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-secondary-foreground/80">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">KC</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                KAMER CASH <span className="text-primary">PME</span>
              </span>
            </Link>
          </div>

          <div className="bg-background border border-border rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Créer un compte
              </h2>
              <p className="text-muted-foreground">
                Remplissez les informations ci-dessous pour commencer
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="cta" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Création du compte...</span>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                En créant un compte, vous acceptez nos{" "}
                <a href="#" className="text-primary hover:underline">conditions d'utilisation</a>
                {" "}et notre{" "}
                <a href="#" className="text-primary hover:underline">politique de confidentialité</a>.
              </p>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Déjà un compte ?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="hover:text-foreground">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
