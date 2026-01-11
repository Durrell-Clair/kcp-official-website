import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setIsLoading(false);
      let errorMessage = "Une erreur est survenue lors de la connexion.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Connexion réussie",
      description: "Redirection vers votre tableau de bord...",
    });
    
    navigate("/dashboard");
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
            Bienvenue sur votre espace
          </h1>
          <p className="text-secondary-foreground/70 text-lg max-w-md">
            Connectez-vous pour accéder à votre tableau de bord, télécharger l'application 
            et gérer votre abonnement.
          </p>
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
                Connexion
              </h2>
              <p className="text-muted-foreground">
                Entrez vos identifiants pour accéder à votre compte
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
                  <span>Connexion en cours...</span>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Créer un compte
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

export default Login;
