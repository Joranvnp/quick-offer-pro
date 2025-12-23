export type QopPublicProposalRow = {
  token: string;
  proposal: unknown;
  pack_id: string;
  selected_options: string[];
  total_price: number;
  deposit_percent: number;
  deposit_amount: number;
  status: string;
  version: number;
  valid_until: string;
  sent_at: string | null;
  viewed_at?: string | null;
  accepted_at: string | null;
  accepted_meta: unknown;
  declined_at?: string | null;
  declined_meta?: unknown;
  created_at: string;
  updated_at: string;
};

const SB_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const SB_ANON =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";

/** Returns true if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set. */
export const isSupabaseConfigured = () => Boolean(SB_URL && SB_ANON);

class RpcError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "RpcError";
    this.status = status;
  }
}

/**
 * Call a Supabase RPC without @supabase/supabase-js.
 * Requires you to create SECURITY DEFINER functions and lock the table via RLS.
 */
export async function supabaseRpc<T>(
  fnName: string,
  args: Record<string, unknown> = {},
  opts?: { preferRepresentation?: boolean }
): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new RpcError(
      "Supabase not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)."
    );
  }

  const res = await fetch(`${SB_URL}/rest/v1/rpc/${fnName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SB_ANON,
      Authorization: `Bearer ${SB_ANON}`,
      ...(opts?.preferRepresentation
        ? { Prefer: "return=representation" }
        : {}),
    },
    body: JSON.stringify(args),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      (json && (json.message || json.error || json.hint || json.details)) ||
      `RPC ${fnName} failed`;
    throw new RpcError(String(msg), res.status);
  }

  return json as T;
}

// High-level API (uses the SQL file we ship in /supabase/qop.sql)
export async function remoteUpsertProposal(params: {
  token: string;
  editToken: string;
  proposal: unknown;
  packId: string;
  selectedOptions: string[];
  totalPrice: number;
  depositPercent: number;
  depositAmount: number;
  validUntil: string; // YYYY-MM-DD
  clientSource: string[];
  mainAction: string;
  prospectGoal: string;
}): Promise<QopPublicProposalRow | null> {
  const rows = await supabaseRpc<QopPublicProposalRow[]>(
    "qop_upsert_proposal",
    {
      p_token: params.token,
      p_edit_token: params.editToken,
      p_proposal: params.proposal,
      p_pack_id: params.packId,
      p_selected_options: params.selectedOptions,
      p_total_price: params.totalPrice,
      p_deposit_percent: params.depositPercent,
      p_deposit_amount: params.depositAmount,
      p_valid_until: params.validUntil,
      p_client_source: params.clientSource,
      p_main_action: params.mainAction,
      p_prospect_goal: params.prospectGoal,
    },
    { preferRepresentation: true }
  );
  return rows?.[0] ?? null;
}

export async function remotePublicGet(
  token: string
): Promise<QopPublicProposalRow | null> {
  // Prefer the safer function (does NOT return edit_token).
  try {
    const rows = await supabaseRpc<QopPublicProposalRow[]>("qop_public_get", {
      p_token: token,
    });
    return rows?.[0] ?? null;
  } catch {
    // Back-compat if you haven't applied the updated SQL yet:
    const rows = await supabaseRpc<Record<string, unknown>[]>(
      "qop_get_proposal",
      {
        p_token: token,
      }
    );
    const row = rows?.[0];
    if (!row) return null;
    // Never keep edit_token from the public response.
    delete row.edit_token;
    return row as QopPublicProposalRow;
  }
}

export async function remoteMarkSent(token: string): Promise<void> {
  await supabaseRpc<unknown>("qop_mark_sent", { p_token: token });
}

export async function remoteMarkViewed(token: string): Promise<void> {
  await supabaseRpc<unknown>("qop_mark_viewed", { p_token: token });
}

export async function remoteAccept(params: {
  token: string;
  name?: string;
  email?: string;
  clientDate?: string;
}): Promise<void> {
  await supabaseRpc<unknown>("qop_accept", {
    p_token: params.token,
    p_name: params.name ?? null,
    p_email: params.email ?? null,
    p_client_date: params.clientDate ?? null,
  });
}

export async function remoteDecline(params: {
  token: string;
  reason?: string;
}): Promise<void> {
  await supabaseRpc<unknown>("qop_decline", {
    p_token: params.token,
    p_reason: params.reason ?? null,
  });
}
