import { ProposalData } from "@/types/proposal";

export type StoredProposal = {
  token: string;
  editToken: string;
  data: ProposalData;
  status: "draft" | "sent" | "viewed" | "accepted" | "declined";
  createdAt: string; // ISO
  updatedAt: string; // ISO
  validUntil: string; // YYYY-MM-DD
};

const INDEX_KEY = "qop_index_v1";
const ITEM_KEY = (token: string) => `qop_proposal_${token}`;

export function getIndex(): string[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? (arr.filter((x) => typeof x === "string") as string[]) : [];
  } catch {
    return [];
  }
}

export function setIndex(tokens: string[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(tokens));
}

export function upsertIndex(token: string) {
  const tokens = getIndex();
  if (!tokens.includes(token)) {
    tokens.unshift(token);
    setIndex(tokens);
  }
}

export function removeFromIndex(token: string) {
  const tokens = getIndex().filter((t) => t !== token);
  setIndex(tokens);
}

export function saveStoredProposal(p: StoredProposal) {
  upsertIndex(p.token);
  localStorage.setItem(ITEM_KEY(p.token), JSON.stringify(p));
}

export function getStoredProposal(token: string): StoredProposal | null {
  try {
    const raw = localStorage.getItem(ITEM_KEY(token));
    return raw ? (JSON.parse(raw) as StoredProposal) : null;
  } catch {
    return null;
  }
}

export function deleteStoredProposal(token: string) {
  localStorage.removeItem(ITEM_KEY(token));
  removeFromIndex(token);
}

export function listStoredProposals(): StoredProposal[] {
  const tokens = getIndex();
  const items = tokens
    .map((t) => getStoredProposal(t))
    .filter(Boolean) as StoredProposal[];
  // most recent first
  return items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function updateStoredProposal(token: string, patch: Partial<StoredProposal>) {
  const cur = getStoredProposal(token);
  if (!cur) return;
  const next: StoredProposal = {
    ...cur,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveStoredProposal(next);
}
