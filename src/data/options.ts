export interface Option {
  id: string;
  name: string;
  price: number;
  description: string;
  compatiblePacks: string[];
}

export const options: Option[] = [
  {
    id: "logo",
    name: "Création de logo",
    price: 150,
    description: "Logo professionnel + déclinaisons",
    compatiblePacks: ["starter", "pro", "pro-plus"],
  },
  {
    id: "photos",
    name: "Photos professionnelles",
    price: 200,
    description: "5 photos retouchées pour votre site",
    compatiblePacks: ["starter", "pro", "pro-plus"],
  },
  {
    id: "copywriting",
    name: "Rédaction des textes",
    price: 250,
    description: "Textes optimisés rédigés pour vous",
    compatiblePacks: ["starter", "pro", "pro-plus"],
  },
  {
    id: "maintenance",
    name: "Maintenance +1 mois",
    price: 90,
    description: "Support et mises à jour pendant 1 mois",
    compatiblePacks: ["pro", "pro-plus"],
  },
  {
    id: "social",
    name: "Setup réseaux sociaux",
    price: 120,
    description: "Création/optimisation de vos pages",
    compatiblePacks: ["starter", "pro", "pro-plus"],
  },
  {
    id: "domain",
    name: "Nom de domaine premium",
    price: 50,
    description: "Domaine .fr ou .com de votre choix",
    compatiblePacks: ["starter", "pro", "pro-plus"],
  },
];

export const getOptionById = (id: string): Option | undefined => {
  return options.find((option) => option.id === id);
};

export const getOptionsForPack = (packId: string): Option[] => {
  return options.filter((option) => option.compatiblePacks.includes(packId));
};
