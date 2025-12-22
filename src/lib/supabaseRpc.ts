import { getSupabaseConfig } from "./env";

type RpcError = { message: string; details?: string; hint?: string; code?: string };

async function rpc<T>(fn: string, payload: Record<string, unknown>): Promise<T> {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) throw new Error("Supabase not configured");

  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: anonKey,
      authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify(payload ?? {}),
  });

  if (!res.ok) {
    let err: RpcError | undefined;
    try {
      err = (await res.json()) as RpcError;
    } catch {
      // ignore
    }
    throw new Error(err?.message || `RPC ${fn} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export const qopRpc = {
  ownerUpsert: (args: {
    token: string;
    editToken: string;
    data: unknown;
    status?: "draft" | "sent" | "viewed" | "accepted" | "declined";
  }) =>
    rpc<{ token: string; status: string; version: number; updated_at: string }>(
      "qop_owner_upsert",
      {
        p_token: args.token,
        p_edit_token: args.editToken,
        p_data: args.data,
        p_status: args.status ?? null,
      }
    ),

  publicGet: (token: string) =>
    rpc<
      | {
          token: string;
          data: any;
          status: string;
          version: number;
          created_at: string;
          updated_at: string;
          sent_at: string | null;
          viewed_at: string | null;
          accepted_at: string | null;
          declined_at: string | null;
          decision_meta: any;
        }
      | null
    >("qop_public_get", { p_token: token }),

  publicMarkViewed: (token: string) =>
    rpc<{ token: string; status: string; viewed_at: string | null } | null>(
      "qop_public_mark_viewed",
      { p_token: token }
    ),

  publicAccept: (args: { token: string; name?: string; email?: string }) =>
    rpc<{ token: string; status: string; accepted_at: string | null } | null>(
      "qop_public_accept",
      { p_token: args.token, p_name: args.name ?? null, p_email: args.email ?? null }
    ),

  publicDecline: (args: { token: string; reason?: string }) =>
    rpc<{ token: string; status: string; declined_at: string | null } | null>(
      "qop_public_decline",
      { p_token: args.token, p_reason: args.reason ?? null }
    ),

  ownerList: (editTokens: string[]) =>
    rpc<any[]>("qop_owner_list", { p_edit_tokens: editTokens }),

  ownerDelete: (editToken: string) =>
    rpc<{ token: string; deleted: true } | null>("qop_owner_delete", {
      p_edit_token: editToken,
    }),
};
