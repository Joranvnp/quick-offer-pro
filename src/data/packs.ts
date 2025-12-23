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
    name: 'Starter "Présence Express"',
    basePrice: 690,
    description: "Pour être joignable vite. Pas de site actuel.",
    defaultTimelineDays: 5,
    features: [
      "One-page pro (Hero + Services + Avis + Contact)",
      "Boutons d'action (Appel / Itinéraire / Email)",
      "Formulaire de contact + anti-spam",
      "Intégration Google Maps + horaires",
      "Mise en ligne + SSL + pages légales",
    ],
  },
  {
    id: "pro",
    name: 'Essentiel "Vitrine Pro"',
    basePrice: 1290,
    description: "Un site propre et rassurant pour présenter votre activité.",
    defaultTimelineDays: 10,
    popular: true,
    features: [
      "Site 4-5 pages (Accueil, Services, À propos, Contact)",
      "SEO local de base (Titres, Metas, Schema)",
      "Optimisation performances (Lighthouse)",
      "Conseils Google Business Profile",
      "Formulaire de devis + CTA",
    ],
  },
  {
    id: "conversion",
    name: 'Conversion "Appels & Réservations"',
    basePrice: 1890,
    description:
      "Objectif : plus d'appels et de réservations (Resto, Garage, Coiffeur...).",
    defaultTimelineDays: 12,
    features: [
      "Tout le pack Vitrine Pro",
      "Optimisation conversion avancée",
      "CTA Sticky mobile (Appeler / Réserver)",
      'Section "Preuves" (Avis, Badges)',
      "Page Menu/Prestations optimisée",
      "Intégration Réservation (TheFork, Calendly, WhatsApp...)",
      "Tracking objectifs (Analytics)",
    ],
  },
  {
    id: "pro-plus",
    name: 'Premium "Image de Marque"',
    basePrice: 2990,
    description: "Pour les établissements visant le haut de gamme.",
    defaultTimelineDays: 14,
    features: [
      "Design premium sur-mesure (Typo, Sections)",
      "Copywriting retravaillé (Accueil + Services)",
      "Galerie photos optimisée + Ambiance",
      "SEO local renforcé (Maillage + Pages ciblées)",
      'Guide "Photos qui convertissent" + "Réponses avis"',
    ],
  },
  {
    id: "redesign",
    name: 'Pack "Refonte Express"',
    basePrice: 1490,
    description: "Modernisation d'un site vieux ou buggé (Avant/Après).",
    defaultTimelineDays: 8,
    features: [
      "Reprise structure + Modernisation design",
      "Correction mobile + CTA clairs",
      "Migration du contenu essentiel",
      "Amélioration Perf & SEO de base",
      "Rapport Avant/Après",
    ],
  },
  {
    id: "subscription",
    name: 'Abonnement "Site + Suivi"',
    basePrice: 990,
    description:
      "Tranquillité d'esprit et maintenance incluse. (Setup 990€ + Mensuel)",
    defaultTimelineDays: 5,
    features: [
      "Mise en place du site (Setup)",
      "Maintenance + Mises à jour incluses",
      "Petites modifications (30-60 min/mois)",
      "Surveillance Uptime + Sécurité",
      "Rapport mensuel (Trafic + Recommandations)",
    ],
  },
];

export const getPackById = (id: string): Pack | undefined => {
  return packs.find((pack) => pack.id === id);
};
