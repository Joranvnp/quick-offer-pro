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

export type ProposalStatus = "draft" | "sent" | "accepted";

export interface ProposalRecord {
  id: string;
  token: string;
  status: ProposalStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  validUntil: string; // YYYY-MM-DD
  sentAt?: string | null;
  acceptedAt?: string | null;
  acceptedMeta?: Record<string, unknown> | null;
  data: ProposalData;
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
