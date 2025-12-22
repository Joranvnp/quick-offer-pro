import { ProposalData } from "@/types/proposal";

export interface OwnerProposalRef {
  token: string;
  editToken: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "declined";
  prospectCompany: string;
  prospectName: string;
  prospectCity: string;
}

const OWNER_KEY = "qop_owner_proposals_v1";

export function saveProposalSnapshot(token: string, data: ProposalData) {
  localStorage.setItem(`proposal_${token}`, JSON.stringify(data));
}

export function loadProposalSnapshot(token: string): ProposalData | null {
  const raw = localStorage.getItem(`proposal_${token}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProposalData;
  } catch {
    return null;
  }
}

export function upsertOwnerRef(ref: OwnerProposalRef) {
  const list = loadOwnerRefs();
  const idx = list.findIndex((x) => x.token === ref.token);
  if (idx >= 0) list[idx] = { ...list[idx], ...ref };
  else list.unshift(ref);
  localStorage.setItem(OWNER_KEY, JSON.stringify(list));
}

export function loadOwnerRefs(): OwnerProposalRef[] {
  const raw = localStorage.getItem(OWNER_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as OwnerProposalRef[];
  } catch {
    return [];
  }
}

export function removeOwnerRef(token: string) {
  const list = loadOwnerRefs().filter((x) => x.token !== token);
  localStorage.setItem(OWNER_KEY, JSON.stringify(list));
}
