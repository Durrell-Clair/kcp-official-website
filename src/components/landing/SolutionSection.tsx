import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  "Suivi des entrées et sorties d'argent",
  "Calcul automatique des pertes et gains",
  "Tableaux de bord clairs et visuels",
  "Fonctionne 100% hors ligne",
  "Sauvegarde locale sécurisée",
  "Interface simple et intuitive",
];

const SolutionSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              La solution
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              KAMER CASH PME : <span className="text-gradient">Votre comptable de poche</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Un logiciel desktop simple et puissant, conçu spécifiquement pour les réalités 
              des entrepreneurs camerounais. Pas besoin d'être comptable pour l'utiliser.
            </p>

            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" asChild>
              <Link to="/register">
                <span>Commencer maintenant</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 lg:p-12">
              <div className="bg-background rounded-xl shadow-xl overflow-hidden">
                {/* Mock feature screenshot */}
                <div className="bg-secondary p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-secondary-foreground text-sm font-medium">Nouvelle transaction</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Type</label>
                    <div className="flex gap-2 mt-1">
                      <div className="flex-1 bg-primary/10 border-2 border-primary text-primary text-center py-2 rounded-lg text-sm font-medium">
                        Entrée
                      </div>
                      <div className="flex-1 bg-muted text-muted-foreground text-center py-2 rounded-lg text-sm">
                        Sortie
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Montant (FCFA)</label>
                    <div className="mt-1 bg-muted rounded-lg p-3 font-display font-bold text-xl">
                      150,000
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Description</label>
                    <div className="mt-1 bg-muted rounded-lg p-3 text-sm">
                      Vente marchandises - Client Dupont
                    </div>
                  </div>
                  <Button variant="cta" className="w-full">
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
