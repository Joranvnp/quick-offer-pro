export interface Pack {
  id: string;
  name: string;
  basePrice: number;
  features: string[];
  defaultTimelineDays: number;
  description: string;
  popular?: boolean;
}

export const packs: Pack[] = [
  {
    id: "starter",
    name: "Starter",
    basePrice: 490,
    description: "Parfait pour démarrer avec une présence en ligne simple et efficace.",
    defaultTimelineDays: 5,
    features: [
      "Site one-page responsive",
      "Formulaire de contact",
      "Bouton d'appel à l'action",
      "Hébergement 1 an inclus",
      "Certificat SSL (https)",
      "Design personnalisé",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    basePrice: 890,
    description: "La solution complète pour les entreprises qui veulent être visibles localement.",
    defaultTimelineDays: 10,
    popular: true,
    features: [
      "Site 5 pages",
      "Formulaire de contact avancé",
      "Optimisation SEO local",
      "Création fiche Google Business",
      "Mentions légales & RGPD",
      "Hébergement 1 an inclus",
      "Certificat SSL (https)",
      "Design sur-mesure",
    ],
  },
  {
    id: "pro-plus",
    name: "Pro+",
    basePrice: 1290,
    description: "Pour les ambitieux qui veulent une présence digitale complète.",
    defaultTimelineDays: 14,
    features: [
      "Tout le pack Pro",
      "Section blog (3 articles)",
      "Intégration Google Analytics",
      "Maintenance 1 mois offerte",
      "Formation utilisation (1h)",
      "Optimisation vitesse",
      "Sauvegarde automatique",
    ],
  },
];

export const getPackById = (id: string): Pack | undefined => {
  return packs.find((pack) => pack.id === id);
};
