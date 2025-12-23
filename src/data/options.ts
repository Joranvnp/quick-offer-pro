export interface Option {
  id: string;
  label: string;
  price: number;
  description?: string;
  category: "content" | "visibility" | "functional" | "maintenance" | "other";
  compatiblePacks?: string[]; // If undefined, compatible with all
  isMonthly?: boolean;
}

export const options: Option[] = [
  // Contenu / Visuels
  {
    id: "copywriting-starter",
    label: "Rédaction des textes (Starter)",
    price: 150,
    category: "content",
    compatiblePacks: ["starter"],
  },
  {
    id: "copywriting-essential",
    label: "Rédaction des textes (Essentiel)",
    price: 350,
    category: "content",
    compatiblePacks: ["essential"],
  },
  {
    id: "photos-10",
    label: "Retouches & optimisation photos (10)",
    price: 120,
    description: "Retouche luminosité/couleurs + compression web",
    category: "content",
    compatiblePacks: ["starter", "essential", "business"],
  },
  {
    id: "photos-20",
    label: "Retouches & optimisation photos (20)",
    price: 190,
    description: "Retouche luminosité/couleurs + compression web",
    category: "content",
    compatiblePacks: ["starter", "essential", "business"],
  },
  {
    id: "logo-simple",
    label: "Logo simple",
    price: 250, // Range 250-350, putting base price
    description:
      "Création d'un logo simple et efficace (sur devis pour identité complète)",
    category: "content",
    compatiblePacks: ["starter", "essential", "business"],
  },

  // Visibilité / SEO
  {
    id: "seo-reinforced",
    label: "SEO local : 2 pages ciblées (service/ville)",
    price: 390,
    category: "visibility",
    compatiblePacks: ["essential", "business"],
  },
  {
    id: "gmb-optimization",
    label: "Google Business optimisation complète",
    price: 150,
    category: "visibility",
    compatiblePacks: ["starter", "essential", "business"],
  },
  {
    id: "google-ads-setup",
    label: "Google Ads (setup 1 campagne)",
    price: 390,
    description: "Budget publicitaire non inclus (à payer à Google)",
    category: "visibility",
    compatiblePacks: ["essential", "business"],
  },
  {
    id: "qr-code",
    label: "QR Code + mini affiche",
    price: 60,
    description: "QR vers le site + 1 visuel A4 'Réservez / Appelez'",
    category: "visibility",
    compatiblePacks: ["starter", "essential", "business"],
  },

  // Fonctionnel
  {
    id: "newsletter-setup",
    label: "Newsletter setup",
    price: 150,
    description: "Brevo/Mailchimp + formulaire + template",
    category: "functional",
    compatiblePacks: ["essential"],
  },
  {
    id: "blog-setup",
    label: "Blog (page blog + modèle article)",
    price: 290,
    category: "functional",
    compatiblePacks: ["essential", "business", "custom"],
  },
  {
    id: "multilingual",
    label: "Multilingue (1 langue)",
    price: 250,
    category: "functional",
    compatiblePacks: ["essential", "business", "custom"],
  },
  {
    id: "domain-setup",
    label: "Achat + configuration du domaine",
    price: 50,
    description:
      "Le coût annuel du domaine reste payé par le client. Le domaine reste au nom du client (propriétaire).",
    category: "functional",
    compatiblePacks: ["starter", "essential", "business"],
  },
  {
    id: "page-supp",
    label: "Page standard supplémentaire",
    price: 120,
    description: "Page de présentation, réalisation, équipe...",
    category: "content",
    compatiblePacks: ["essential", "business", "custom"],
  },
  {
    id: "section-supp",
    label: "Section supplémentaire (sur la one-page)",
    price: 80,
    description: "Ajout d'une section (ex: FAQ, Galerie, Tarifs)",
    category: "content",
    compatiblePacks: ["starter"],
  },
  {
    id: "page-service-supp",
    label: "Page SEO supplémentaire (Service/Ville)",
    price: 150,
    description: "Structure optimisée pour le référencement local",
    category: "content",
    compatiblePacks: ["business", "custom"],
  },
  {
    id: "integration-supp",
    label: "Intégration supplémentaire",
    price: 150,
    description:
      "Installation & configuration d'un outil tiers (au-delà des 3 incluses)",
    category: "functional",
    compatiblePacks: ["business"],
  },

  // Suivi / Maintenance (Mensuel)
  {
    id: "maintenance-tech",
    label: 'Suivi "Technique"',
    price: 29,
    description:
      "Hébergement + SSL + sauvegardes + Mises à jour & sécurité (surveillance + correctifs). Bilan annuel (mail rapide). Engagement 3 mois.",
    category: "maintenance",
    isMonthly: true,
  },
  {
    id: "maintenance-std",
    label: 'Suivi "Standard"',
    price: 59,
    description:
      "Tout le technique + 30 min de modifications de contenu + Rapport semestriel. Engagement 3 mois.",
    category: "maintenance",
    isMonthly: true,
  },
  {
    id: "maintenance-plus",
    label: 'Suivi "Plus"',
    price: 99,
    description:
      "Tout le technique + 1h de modifications de contenu + Rapport mensuel. Engagement 3 mois.",
    category: "maintenance",
    isMonthly: true,
  },
  {
    id: "maintenance-news",
    label: "1 mise à jour de contenu / mois",
    price: 79,
    description:
      "Modification de texte/photo/horaires/infos. Hors nouvelles pages.",
    category: "maintenance",
    isMonthly: true,
  },
];

export const getOptionById = (id: string): Option | undefined => {
  return options.find((option) => option.id === id);
};

export const getOptionsForPack = (packId: string): Option[] => {
  return options.filter((option) => {
    if (!option.compatiblePacks) return true;
    return option.compatiblePacks.includes(packId);
  });
};
