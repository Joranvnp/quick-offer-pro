export interface Problem {
  id: string;
  label: string;
  shortLabel: string;
}

export interface Goal {
  id: string;
  label: string;
  shortLabel: string;
}

export const problems: Problem[] = [
  {
    id: "no-site",
    label: "Pas de site internet actuellement",
    shortLabel: "Pas de site web",
  },
  {
    id: "old-site",
    label: "Site internet vieillissant ou obsolète",
    shortLabel: "Site vieux/obsolète",
  },
  {
    id: "no-leads",
    label: "Pas assez de demandes entrantes",
    shortLabel: "Pas de demandes",
  },
  {
    id: "not-mobile",
    label: "Site non adapté aux mobiles",
    shortLabel: "Pas mobile-friendly",
  },
];

export const goals: Goal[] = [
  {
    id: "more-calls",
    label: "Recevoir plus d'appels de prospects",
    shortLabel: "Plus d'appels",
  },
  {
    id: "more-quotes",
    label: "Obtenir plus de demandes de devis",
    shortLabel: "Plus de devis",
  },
  {
    id: "bookings",
    label: "Permettre les réservations en ligne",
    shortLabel: "Réservations en ligne",
  },
  {
    id: "credibility",
    label: "Améliorer ma crédibilité professionnelle",
    shortLabel: "Plus de crédibilité",
  },
];

export const getProblemById = (id: string): Problem | undefined => {
  return problems.find((p) => p.id === id);
};

export const getGoalById = (id: string): Goal | undefined => {
  return goals.find((g) => g.id === id);
};
