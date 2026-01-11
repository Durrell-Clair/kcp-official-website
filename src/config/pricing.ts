// Configuration des plans tarifaires
export interface PlanFeature {
  name: string;
}

export interface Plan {
  name: 'start' | 'plus' | 'pro';
  displayName: string;
  price: number; // en FCFA
  maxUsers: number;
  features: string[];
  isPopular?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: 'start',
    displayName: 'PME START',
    price: 10000,
    maxUsers: 3,
    features: [
      'Toutes fonctions core',
      'Support WhatsApp',
      '1 entreprise'
    ]
  },
  {
    name: 'plus',
    displayName: 'PME PLUS',
    price: 20000,
    maxUsers: 10,
    features: [
      'Toutes fonctions core',
      'Multi-points de vente',
      'Export avancé',
      'Support prioritaire'
    ],
    isPopular: true
  },
  {
    name: 'pro',
    displayName: 'PME PRO',
    price: 35000,
    maxUsers: 20,
    features: [
      'Toutes fonctions core',
      'Multi-points de vente',
      'API access',
      'Personnalisations',
      'Support téléphone dédié'
    ]
  }
];

export const getPlanByName = (name: string): Plan | undefined => {
  return PLANS.find(plan => plan.name === name);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR').format(price);
};
