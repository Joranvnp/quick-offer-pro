import { isSupabaseConfigured, supabase } from "./supabase";
import { ProposalData, ProposalRecord } from "@/types/proposal";
import { calculatePricing } from "./pricing";

type UpsertParams = {
  token: string;
  editToken: string;
  data: ProposalData;
  validUntil: string; // YYYY-MM-DD
};

function todayISODate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function computeValidUntil(days: number = 14, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function mapRowToRecord(row: any): ProposalRecord {
  return {
    id: row.id,
    token: row.token,
    status: row.status,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    validUntil: row.valid_until,
    sentAt: row.sent_at,
    acceptedAt: row.accepted_at,
    acceptedMeta: row.accepted_meta,
    data: row.proposal as ProposalData,
  };
}

export async function upsertProposal(params: UpsertParams): Promise<ProposalRecord> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase n'est pas configuré. Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local.");
  }
  const { token, editToken, data, validUntil } = params;

  const pricing = calculatePricing(data.packId, data.selectedOptions, data.depositPercent);

  const { data: rows, error } = await supabase.rpc("qop_upsert_proposal", {
    p_token: token,
    p_edit_token: editToken,
    p_proposal: data,
    p_pack_id: data.packId,
    p_selected_options: data.selectedOptions,
    p_total_price: pricing.totalPrice,
    p_deposit_percent: data.depositPercent,
    p_deposit_amount: pricing.depositAmount,
    p_valid_until: validUntil,
  });

  if (error) throw error;
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row) {
    throw new Error("Unable to save proposal (edit token mismatch)." );
  }
  return mapRowToRecord(row);
}

export async function getProposalByToken(token: string): Promise<ProposalRecord | null> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase n'est pas configuré.");
  }
  const { data: rows, error } = await supabase.rpc("qop_get_proposal", {
    p_token: token,
  });

  if (error) throw error;
  const row = Array.isArray(rows) ? rows[0] : rows;
  return row ? mapRowToRecord(row) : null;
}

export async function markProposalSent(token: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.rpc("qop_mark_sent", { p_token: token });
  if (error) throw error;
}

export async function acceptProposal(token: string, meta?: { name?: string; email?: string }): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase n'est pas configuré.");
  }
  const { error } = await supabase.rpc("qop_accept", {
    p_token: token,
    p_name: meta?.name ?? null,
    p_email: meta?.email ?? null,
    p_client_date: todayISODate(),
  });
  if (error) throw error;
}
