import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Shield, Wifi, WifiOff } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero pt-20 lg:pt-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">
          {/* Content */}
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <WifiOff className="w-4 h-4" />
              <span>100% Offline après activation</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Gérez vos finances avec{" "}
              <span className="text-gradient">simplicité</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              KAMER CASH PME est le logiciel de suivi financier conçu spécialement pour les PME 
              et commerçants camerounais. Suivez vos entrées, sorties, pertes et gains en toute simplicité.
            </p>

            {/* Features pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-full text-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span>Données sécurisées</span>
              </div>
              <div className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-full text-sm">
                <WifiOff className="w-4 h-4 text-primary" />
                <span>Fonctionne sans internet</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/register">
                  <span>S'abonner maintenant</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/pricing">
                  <Download className="w-5 h-5" />
                  <span>Voir les tarifs</span>
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Fait pour les entrepreneurs camerounais</p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground">Offline</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-foreground">FCFA</p>
                  <p className="text-xs text-muted-foreground">Monnaie locale</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-foreground">24/7</p>
                  <p className="text-xs text-muted-foreground">Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image / App Preview */}
          <div className="relative animate-float hidden lg:block">
            <div className="relative bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 shadow-2xl">
              {/* Mock App Window */}
              <div className="bg-background rounded-xl overflow-hidden shadow-xl">
                {/* Window Header */}
                <div className="bg-muted px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">KAMER CASH PME</span>
                </div>
                
                {/* Mock Dashboard Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold">Tableau de bord</h3>
                    <span className="text-xs text-muted-foreground">Janvier 2025</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground">Entrées</p>
                      <p className="font-display font-bold text-xl text-primary">+850,000 F</p>
                    </div>
                    <div className="bg-destructive/10 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground">Sorties</p>
                      <p className="font-display font-bold text-xl text-destructive">-320,000 F</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground">Solde actuel</p>
                    <p className="font-display font-bold text-2xl text-foreground">530,000 FCFA</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vente marchandises</span>
                      <span className="text-primary font-medium">+150,000 F</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Achat stock</span>
                      <span className="text-destructive font-medium">-80,000 F</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-background border border-border rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Sécurisé</p>
                  <p className="text-xs text-muted-foreground">Données locales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
