export interface Option {
  id: string;
  name: string;
  price: number;
  description: string;
  compatiblePacks: string[];
  isMonthly?: boolean;
}

export const options: Option[] = [
  // Starter "Présence Express"
  {
    id: "redaction-express",
    name: "Rédaction Express",
    price: 150,
    description:
      "Jusqu'à 3 sections (hero + services + contact). 1 aller-retour.",
    compatiblePacks: ["starter"],
  },
  {
    id: "photos-starter",
    name: "Photos optimisées (10)",
    price: 120,
    description: "Compression + recadrage léger. Photos fournies.",
    compatiblePacks: ["starter"],
  },
  {
    id: "g-business-mini",
    name: "Google Business mini-optimisation",
    price: 90,
    description:
      "Catégorie, description courte, lien site, horaires, 5 services.",
    compatiblePacks: ["starter"],
  },
  {
    id: "booking-link",
    name: "Réservation / prise de RDV (lien)",
    price: 90,
    description: "TheFork/Zenchef/Calendly/Planity/WhatsApp (lien + bouton).",
    compatiblePacks: ["starter"],
  },
  {
    id: "qr-code",
    name: "QR Code + mini affiche",
    price: 60,
    description: 'QR vers le site + 1 visuel A4 "Réservez / Appelez".',
    compatiblePacks: ["starter"],
  },

  // Essentiel "Vitrine Pro"
  {
    id: "page-supp",
    name: "Page supplémentaire",
    price: 120,
    description: "Page standard (texte + 1 image).",
    compatiblePacks: [
      "pro",
      "conversion",
      "pro-plus",
      "redesign",
      "subscription",
    ],
  },
  {
    id: "faq",
    name: "FAQ (6–8 questions)",
    price: 120,
    description: "Réduit les objections + améliore confiance.",
    compatiblePacks: [
      "pro",
      "conversion",
      "pro-plus",
      "redesign",
      "subscription",
    ],
  },
  {
    id: "form-advanced",
    name: "Formulaire devis avancé",
    price: 150,
    description: "Champs adaptés (date, type de demande), email auto.",
    compatiblePacks: [
      "pro",
      "conversion",
      "pro-plus",
      "redesign",
      "subscription",
    ],
  },
  {
    id: "gallery",
    name: "Galerie photos (jusqu'à 20)",
    price: 190,
    description: "Optimisation + mise en page.",
    compatiblePacks: [
      "pro",
      "conversion",
      "pro-plus",
      "redesign",
      "subscription",
    ],
  },
  {
    id: "seo-local-plus",
    name: "SEO local renforcé (2 pages)",
    price: 390,
    description: 'Ex: "Restaurant à Ville" + "Privatisation".',
    compatiblePacks: [
      "pro",
      "conversion",
      "pro-plus",
      "redesign",
      "subscription",
    ],
  },
  {
    id: "analytics",
    name: "Analytics + objectifs",
    price: 120,
    description: "Clic téléphone, formulaire, réservation.",
    compatiblePacks: [
      "pro",
      "conversion",
      "pro-plus",
      "redesign",
      "subscription",
    ],
  },

  // Conversion "Appels & Réservations"
  {
    id: "ab-test",
    name: "A/B test simple CTA (30 jours)",
    price: 190,
    description: "2 variantes CTA + recommandation après 30 jours.",
    compatiblePacks: ["conversion", "pro-plus", "subscription"],
  },
  {
    id: "promo-page",
    name: 'Page "Offres / Menu du moment"',
    price: 120,
    description: "Page facile à mettre à jour.",
    compatiblePacks: ["conversion", "pro-plus", "subscription"],
  },
  {
    id: "reviews",
    name: "Avis clients (mise en avant)",
    price: 90,
    description: 'Intégration + mise en forme + section "preuves".',
    compatiblePacks: ["conversion", "pro-plus", "subscription"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business + bouton",
    price: 80,
    description: "Lien + message pré-rempli (devis/réservation).",
    compatiblePacks: ["conversion", "pro-plus", "subscription"],
  },
  {
    id: "schema",
    name: "Schema Local + FAQ schema",
    price: 120,
    description: "Rich results (selon cas).",
    compatiblePacks: ["conversion", "pro-plus", "subscription"],
  },

  // Premium "Image de Marque"
  {
    id: "mini-identity",
    name: "Mini identité visuelle",
    price: 290,
    description: "Palette + typo + 3 règles d'usage + 1 bannière.",
    compatiblePacks: ["pro-plus", "subscription"],
  },
  {
    id: "photo-retouch",
    name: "Retouches photos (10)",
    price: 250,
    description: "Retouche plus poussée (lumière, crop, cohérence).",
    compatiblePacks: ["pro-plus", "subscription"],
  },
  {
    id: "translation",
    name: "Traduction EN (pages principales)",
    price: 250,
    description: "Accueil + Services + Contact.",
    compatiblePacks: ["pro-plus", "subscription"],
  },
  {
    id: "privatization",
    name: 'Page "Privatisation / Événements"',
    price: 190,
    description: "Très rentable pour les restos.",
    compatiblePacks: ["pro-plus", "subscription"],
  },
  {
    id: "social-kit",
    name: "Kit réseaux sociaux (3 visuels)",
    price: 150,
    description: "Posts format IG/FB + style cohérent.",
    compatiblePacks: ["pro-plus", "subscription"],
  },

  // Refonte Express
  {
    id: "migration-extended",
    name: "Migration contenu étendue",
    price: 250,
    description: "Au-delà des pages clés (jusqu'à +5 pages).",
    compatiblePacks: ["redesign"],
  },
  {
    id: "seo-redirect",
    name: "Redirection SEO (jusqu'à 15 URLs)",
    price: 150,
    description: "Évite de perdre le référencement.",
    compatiblePacks: ["redesign"],
  },
  {
    id: "perf-cleanup",
    name: "Nettoyage perf (images/scripts)",
    price: 190,
    description: "Focus Core Web Vitals (dans la limite du template).",
    compatiblePacks: ["redesign"],
  },

  // Abonnement "Site + Suivi" (Récurrent)
  {
    id: "actu-monthly",
    name: "1 actu / mois",
    price: 79,
    description: "Actu courte + 1 image. 1 aller-retour.",
    compatiblePacks: ["subscription"],
    isMonthly: true,
  },
  {
    id: "article-monthly",
    name: "1 article SEO / mois",
    price: 129,
    description: "300–600 mots. Orienté SEO local. 1 aller-retour.",
    compatiblePacks: ["subscription"],
    isMonthly: true,
  },
  {
    id: "g-business-monthly",
    name: "Gestion Google Business",
    price: 99,
    description: "1 post + vérif infos + 1 recommandation.",
    compatiblePacks: ["subscription"],
    isMonthly: true,
  },
  {
    id: "ads-monthly",
    name: "Gestion Ads (mensuel)",
    price: 250,
    description: "Optimisations + reporting. Budget pub non inclus.",
    compatiblePacks: ["subscription"],
    isMonthly: true,
  },

  // Global / Autres
  {
    id: "maintenance-monthly",
    name: "Maintenance mensuelle",
    price: 99,
    description: "30 min/mois + MAJ sécurité.",
    compatiblePacks: ["starter", "pro", "conversion", "pro-plus", "redesign"],
    isMonthly: true,
  },
  {
    id: "evolution-pack",
    name: "Pack évolutions (3h)",
    price: 290,
    description: "Idéal pour ajouter une page / changer un bloc.",
    compatiblePacks: [
      "starter",
      "pro",
      "conversion",
      "pro-plus",
      "redesign",
      "subscription",
    ],
  },
];

export const getOptionById = (id: string): Option | undefined => {
  return options.find((option) => option.id === id);
};

export const getOptionsForPack = (packId: string): Option[] => {
  return options.filter((option) => option.compatiblePacks.includes(packId));
};
