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
    id: "visibility",
    label: "Être mieux trouvé sur Google (visibilité)",
    shortLabel: "Visibilité Google",
  },
  {
    id: "more-calls",
    label: "Avoir plus d'appels",
    shortLabel: "Plus d'appels",
  },
  {
    id: "more-quotes",
    label: "Avoir plus de demandes de devis",
    shortLabel: "Plus de devis",
  },
  {
    id: "more-bookings",
    label: "Avoir plus de réservations / RDV",
    shortLabel: "Plus de RDV",
  },
  {
    id: "showcase",
    label: "Présenter clairement le menu / services",
    shortLabel: "Présenter offre",
  },
  {
    id: "reassurance",
    label: "Rassurer (avis, photos, infos)",
    shortLabel: "Rassurer",
  },
];

export const clientSources = [
  { id: "google", label: "Google / Maps" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "word-of-mouth", label: "Bouche-à-oreille" },
  { id: "platforms", label: "Plateformes (TheFork, Zenchef, Deliveroo…)" },
  { id: "other", label: "Autre" },
];

export const siteActions = [
  { id: "call", label: "Appeler" },
  { id: "book", label: "Réserver" },
  { id: "quote", label: "Demander un devis" },
  { id: "appointment", label: "Prendre rendez-vous" },
  { id: "menu", label: "Voir le menu / tarifs" },
  { id: "directions", label: "Itinéraire" },
];

export const getProblemById = (id: string): Problem | undefined => {
  return problems.find((p) => p.id === id);
};

export const getGoalById = (id: string): Goal | undefined => {
  return goals.find((g) => g.id === id);
};
