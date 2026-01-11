import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PricingSection } from "@/components/pricing/PricingSection";
import { Shield, Zap, Headphones, WifiOff } from "lucide-react";

const benefits = [
  {
    icon: WifiOff,
    title: "100% Offline",
    description: "Travaillez sans connexion internet. Idéal pour les zones rurales.",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description: "Vos informations restent sur votre ordinateur, jamais en ligne.",
  },
  {
    icon: Zap,
    title: "Rapide et léger",
    description: "Application optimisée qui fonctionne même sur des PC modestes.",
  },
  {
    icon: Headphones,
    title: "Support inclus",
    description: "Notre équipe vous accompagne par email pour toute question.",
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 lg:pt-28">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                Tarification
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Choisissez le plan <span className="text-gradient">adapté</span> à votre PME
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground">
                Trois options d'abonnement mensuel conçues pour répondre aux besoins de toutes les PME camerounaises.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <PricingSection />
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ce que vous obtenez
              </h2>
              <p className="text-lg text-muted-foreground">
                Avec votre abonnement KAMER CASH PME, vous bénéficiez de nombreux avantages.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-background border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Paiement sécurisé
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Payez facilement via Mobile Money ou carte bancaire
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="bg-accent/20 px-6 py-3 rounded-lg">
                  <span className="font-semibold">MTN MoMo</span>
                </div>
                <div className="bg-accent/20 px-6 py-3 rounded-lg">
                  <span className="font-semibold">Orange Money</span>
                </div>
                <div className="bg-muted px-6 py-3 rounded-lg">
                  <span className="font-semibold">Carte bancaire</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
                Questions fréquentes
              </h2>

              <div className="space-y-6">
                {[
                  {
                    q: "Comment fonctionne l'activation ?",
                    a: "Après votre paiement, vous recevez une clé de licence. Au premier lancement de l'application, entrez cette clé avec votre email. L'application vérifie une seule fois votre licence en ligne, puis fonctionne 100% hors ligne.",
                  },
                  {
                    q: "Que se passe-t-il si mon abonnement expire ?",
                    a: "À l'expiration de votre abonnement, l'application vous demande de renouveler. Vos données restent sauvegardées localement et seront accessibles dès le renouvellement.",
                  },
                  {
                    q: "Puis-je changer de plan ?",
                    a: "Oui, vous pouvez passer à un plan supérieur à tout moment. La différence de prix sera calculée au prorata. Pour passer à un plan inférieur, vous devrez attendre la fin de votre période d'abonnement actuelle.",
                  },
                  {
                    q: "Comment fonctionne le paiement Mobile Money ?",
                    a: "Après inscription, vous pouvez payer directement via MTN MoMo ou Orange Money. La transaction est sécurisée et votre licence est activée immédiatement après confirmation du paiement.",
                  },
                ].map((faq, index) => (
                  <div key={index} className="bg-muted/50 rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
