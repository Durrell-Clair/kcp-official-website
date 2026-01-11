import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingPreview = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Tarification simple
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Un prix, toutes les fonctionnalités
          </h2>
          <p className="text-lg text-muted-foreground">
            Pas de frais cachés, pas de niveaux compliqués. Un abonnement mensuel unique 
            pour accéder à tout.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-background border-2 border-primary rounded-2xl p-8 relative shadow-glow">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full">
                Offre unique
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="font-display font-bold text-2xl mb-2">Abonnement Mensuel</h3>
              <div className="flex items-end justify-center gap-1">
                <span className="font-display font-bold text-5xl text-foreground">5,000</span>
                <span className="text-muted-foreground mb-2">FCFA/mois</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Accès complet au logiciel",
                "Utilisation 100% offline",
                "Toutes les fonctionnalités",
                "Mises à jour incluses",
                "Sauvegarde locale sécurisée",
                "Support par email",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="cta" size="lg" className="w-full" asChild>
              <Link to="/register">
                <span>S'abonner maintenant</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Paiement par Mobile Money (MTN, Orange) ou carte bancaire
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
