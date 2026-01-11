import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-secondary to-secondary/90 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-6">
            Prêt à prendre le contrôle de vos finances ?
          </h2>
          <p className="text-lg text-secondary-foreground/80 mb-10 max-w-2xl mx-auto">
            Rejoignez les entrepreneurs camerounais qui utilisent KAMER CASH PME 
            pour gérer leur activité efficacement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="cta" 
              size="xl" 
              className="bg-primary hover:bg-primary-glow" 
              asChild
            >
              <Link to="/register">
                <span>Commencer maintenant</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
              asChild
            >
              <Link to="/pricing">
                <Download className="w-5 h-5" />
                <span>Voir les tarifs</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
