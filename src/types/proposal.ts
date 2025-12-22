export interface ProposalData {
  // Prospect info
  prospectName: string;
  prospectCompany: string;
  prospectSector: string;
  prospectCity: string;
  prospectProblem: string;
  prospectGoal: string;

  // Offer
  packId: string;
  selectedOptions: string[];

  // Pricing
  depositPercent: number;

  // Owner info
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerWebsite: string;
  ownerSiret: string;

  // Settings
  tone: "neutral" | "confident" | "simple";
}

export interface Proposal extends ProposalData {
  id: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "sent" | "viewed" | "accepted";
  pdfUrl?: string;
}

export const defaultProposalData: ProposalData = {
  prospectName: "",
  prospectCompany: "",
  prospectSector: "",
  prospectCity: "",
  prospectProblem: "",
  prospectGoal: "",
  packId: "pro",
  selectedOptions: [],
  depositPercent: 30,
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  ownerWebsite: "",
  ownerSiret: "",
  tone: "neutral",
};

export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 8);
};
