import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/config/pricing';
import type { PlanFromDB } from '@/services/plans.service';
import { Card } from '@/components/ui/card';

interface PlanCardProps {
  plan: PlanFromDB;
  isPopular?: boolean;
}

export function PlanCard({ plan, isPopular = false }: PlanCardProps) {
  const features = plan.features ? (Array.isArray(plan.features) ? plan.features : []) : [];

  return (
    <Card className={`relative flex flex-col h-full p-8 lg:p-10 ${isPopular ? 'border-2 border-primary shadow-glow' : 'border border-border'}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-sm font-bold px-6 py-2 rounded-full shadow-lg">
            Le plus populaire
          </span>
        </div>
      )}

      <div className="text-center mb-8 pt-4">
        <h3 className="font-display font-bold text-2xl mb-4">{plan.display_name}</h3>
        <div className="flex items-end justify-center gap-1 mb-2">
          <span className="font-display font-bold text-5xl lg:text-6xl text-foreground">
            {formatPrice(plan.price)}
          </span>
          <span className="text-xl text-muted-foreground mb-3">FCFA</span>
        </div>
        <p className="text-muted-foreground">par mois</p>
        <p className="text-sm text-muted-foreground mt-2">
          Jusqu'à {plan.max_users} utilisateur{plan.max_users > 1 ? 's' : ''}
        </p>
      </div>

      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        variant={isPopular ? 'cta' : 'outline'} 
        size="xl" 
        className="w-full" 
        asChild
      >
        <Link to={`/register?plan=${plan.name}`}>
          <span>Choisir {plan.display_name}</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </Button>
    </Card>
  );
}
