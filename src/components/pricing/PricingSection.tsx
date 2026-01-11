import { PlanCard } from './PlanCard';
import { usePlans } from '@/hooks/usePlans';
import { Loader2 } from 'lucide-react';

export function PricingSection() {
  const { plans, isLoading, error } = usePlans();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive">Erreur lors du chargement des plans. Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Aucun plan disponible pour le moment.</p>
      </div>
    );
  }

  // Trouver le plan "plus" comme populaire (ou le plan du milieu)
  const popularPlanIndex = plans.length > 1 ? Math.floor(plans.length / 2) : -1;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {plans.map((plan, index) => (
        <PlanCard 
          key={plan.id} 
          plan={plan} 
          isPopular={index === popularPlanIndex}
        />
      ))}
    </div>
  );
}
