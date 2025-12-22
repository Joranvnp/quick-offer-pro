export function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  return {
    url: url?.trim() || "",
    anonKey: anonKey?.trim() || "",
    enabled: Boolean(url && anonKey),
  };
}
