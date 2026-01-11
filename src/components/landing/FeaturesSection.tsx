import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Shield, 
  WifiOff, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Entrées d'argent",
    description: "Enregistrez toutes vos ventes, paiements reçus et revenus en quelques clics.",
    color: "primary",
  },
  {
    icon: TrendingDown,
    title: "Sorties d'argent",
    description: "Suivez vos dépenses, achats de stock, salaires et autres charges facilement.",
    color: "destructive",
  },
  {
    icon: PieChart,
    title: "Analyse visuelle",
    description: "Des graphiques clairs pour comprendre où va votre argent en un coup d'œil.",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description: "Vos données restent sur votre ordinateur. Aucun risque de piratage en ligne.",
    color: "primary",
  },
  {
    icon: WifiOff,
    title: "Mode hors ligne",
    description: "Fonctionne sans internet. Idéal pour les zones à connexion instable.",
    color: "secondary",
  },
  {
    icon: Zap,
    title: "Ultra rapide",
    description: "Application légère et performante. Pas besoin d'un ordinateur puissant.",
    color: "accent",
  },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case "primary":
      return "bg-primary/10 text-primary";
    case "destructive":
      return "bg-destructive/10 text-destructive";
    case "accent":
      return "bg-accent/20 text-accent-foreground";
    case "secondary":
      return "bg-secondary/10 text-secondary";
    default:
      return "bg-primary/10 text-primary";
  }
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Fonctionnalités
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Tout ce dont vous avez besoin pour <span className="text-gradient">réussir</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            KAMER CASH PME regroupe tous les outils essentiels pour une gestion financière 
            efficace de votre activité.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className={`w-14 h-14 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
