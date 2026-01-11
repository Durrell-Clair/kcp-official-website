import { AlertTriangle, FileQuestion, TrendingDown, Calculator } from "lucide-react";

const problems = [
  {
    icon: FileQuestion,
    title: "Pas de visibilité",
    description: "Impossible de savoir exactement combien vous gagnez ou perdez chaque mois.",
  },
  {
    icon: TrendingDown,
    title: "Pertes non identifiées",
    description: "L'argent disparaît sans que vous puissiez en tracer l'origine.",
  },
  {
    icon: Calculator,
    title: "Calculs manuels",
    description: "Cahiers, Excel, calculs à la main... Source d'erreurs et perte de temps.",
  },
  {
    icon: AlertTriangle,
    title: "Décisions à l'aveugle",
    description: "Comment développer votre business sans données fiables ?",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Le problème
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Gérer ses finances sans outil adapté, c'est <span className="text-destructive">risqué</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Beaucoup de PME et commerçants camerounais perdent de l'argent simplement parce qu'ils 
            n'ont pas d'outil simple pour suivre leurs finances au quotidien.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{problem.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
