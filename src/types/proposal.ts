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

  // Optional payment link (ex: Stripe Payment Link)
  paymentLink?: string;
}

export type ProposalStatus = "draft" | "sent" | "accepted";

export interface ProposalRecord {
  id: string;
  token: string;
  editToken: string;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "sent" | "viewed" | "accepted" | "declined";
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
  paymentLink: "",
};

const base64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

export const generateToken = (lengthBytes: number = 12): string => {
  // 12 bytes => ~16 chars base64url; unguessable enough for public links.
  const bytes = new Uint8Array(lengthBytes);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
};

export const generateEditToken = (lengthBytes: number = 18): string => {
  // Longer secret for edits.
  const bytes = new Uint8Array(lengthBytes);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
};
