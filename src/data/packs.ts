export interface Pack {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  features: string[];
  bonuses?: string[];
  defaultTimelineDays: number;
  popular?: boolean;
  customPriceDisplay?: string;
  customTimelineDisplay?: string;
  note?: string;
  limits?: string;
  hostingNote?: string;
}

export const packs: Pack[] = [
  {
    id: "starter",
    name: 'Starter "Présence Express"',
    basePrice: 690,
    description:
      "Idéal si vous n'avez pas de site et voulez être joignable rapidement.",
    defaultTimelineDays: 5,
    customTimelineDisplay: "Délai : 3–5 jours",
    features: [
      "Site 1 page (présentation + services + avis + contact)",
      "Boutons d'action : Appeler / Itinéraire / Email",
      "Formulaire de contact (anti-spam)",
      "Google Maps + horaires",
      "Mise en ligne + SSL + pages légales",
      "Optimisation technique des images incluse (compression, vitesse)",
    ],
    bonuses: [
      "1 visuel “bannière” offert (image + mise en page propre)",
      "1 mois de support après mise en ligne (petits ajustements)",
    ],
    hostingNote:
      "Le nom de domaine est enregistré au nom du client. L’hébergement et la maintenance sont proposés via une option Suivi (mensuelle ou annuelle).",
  },
  {
    id: "essential",
    name: 'Essentiel "Vitrine Pro"',
    basePrice: 1290,
    description:
      "Un vrai site complet pour rassurer et présenter votre activité clairement.",
    defaultTimelineDays: 10,
    customTimelineDisplay: "Délai : 7–10 jours",
    popular: true,
    features: [
      "Site 4 à 5 pages (Accueil, Services, À propos, Contact, Mentions)",
      "Optimisation mobile + vitesse",
      "SEO local de base (titres, descriptions, structure)",
      "CTA “Demander un devis / Prendre RDV”",
      "Conseils Google Business Profile",
      "Optimisation technique des images incluse (compression, vitesse)",
    ],
    bonuses: [
      "Mise en place Google Analytics + Search Console",
      "1 visuel “bannière” offert",
      "1 mois de support après mise en ligne",
    ],
    hostingNote:
      "Le nom de domaine est enregistré au nom du client. L’hébergement et la maintenance sont proposés via une option Suivi (mensuelle ou annuelle).",
  },
  {
    id: "business",
    name: 'Business "Site complet + intégrations"',
    basePrice: 2490,
    description:
      "Pour une entreprise qui a plusieurs services, du contenu, et des outils à connecter.",
    defaultTimelineDays: 15,
    customTimelineDisplay: "Délai : 10–20 jours",
    features: [
      "Jusqu’à 10 pages (ou 7 pages + 3 pages “services/ville”)",
      "Design premium (mise en page plus travaillée, rendu plus “marque”)",
      "Site rapide + mobile-first",
      "CTA optimisés (Appeler / Devis / Réserver)",
      "SEO renforcé (structure + maillage interne)",
      "Intégrations incluses (au choix : 1 à 3) : Réservation, Newsletter, WhatsApp, Avis, Maps",
      "Optimisation technique des images incluse (compression, vitesse)",
    ],
    bonuses: [
      "Audit avant/après (mini rapport vitesse + points améliorés)",
      "1 mois de support après mise en ligne",
    ],
    hostingNote:
      "Le nom de domaine est enregistré au nom du client. L’hébergement et la maintenance sont proposés via une option Suivi (mensuelle ou annuelle).",
  },
  {
    id: "custom",
    name: "Sur devis (personnalisé)",
    basePrice: 0,
    description:
      "Quand vous avez un besoin spécifique (site plus grand, fonctionnalités particulières).",
    defaultTimelineDays: 20,
    customPriceDisplay: "Sur devis",
    customTimelineDisplay: "Délai : Selon projet",
    features: [
      "RDV 15 min → proposition claire (1 page) avec prix + délai",
      "Mini-audit rapide + recommandations",
      "Proposition 1 page sous 24–48h",
    ],
    bonuses: [
      "Mini-audit + recommandations",
      "1 visuel bannière offert",
      "1 mois de support après mise en ligne",
    ],
    hostingNote:
      "Le nom de domaine est enregistré au nom du client. L’hébergement et la maintenance sont proposés via une option Suivi (mensuelle ou annuelle).",
  },
];

export const getPackById = (id: string): Pack | undefined => {
  return packs.find((p) => p.id === id);
};
