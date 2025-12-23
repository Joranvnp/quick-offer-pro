-- =========================================================
-- Quick Offer Pro — Supabase schema + RPC (safe public tokens)
-- Version: 2025-12-23
-- Paste & run in Supabase SQL Editor (one run).
-- =========================================================

-- Optional (often already enabled in Supabase):
create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1) TABLE (create if missing)
-- ---------------------------------------------------------
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  edit_token text not null,

  -- main payload (your form)
  proposal jsonb not null,

  -- denormalized values (for search/listing later)
  pack_id text not null,
  selected_options text[] not null default '{}',
  total_price integer not null,
  deposit_percent integer not null,
  deposit_amount integer not null,
  
  -- new discovery fields
  client_source text[] default '{}',
  main_action text default '',
  prospect_goal text default '',

  status text not null default 'draft',
  version integer not null default 1,
  valid_until date not null,

  sent_at timestamptz,
  viewed_at timestamptz,

  accepted_at timestamptz,
  accepted_meta jsonb,

  declined_at timestamptz,
  declined_meta jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- If your table already existed, ensure new columns exist (safe re-run)
alter table public.proposals add column if not exists viewed_at timestamptz;
alter table public.proposals add column if not exists declined_at timestamptz;
alter table public.proposals add column if not exists declined_meta jsonb;
alter table public.proposals add column if not exists client_source text[] default '{}';
alter table public.proposals add column if not exists main_action text default '';
alter table public.proposals add column if not exists prospect_goal text default '';

create index if not exists proposals_token_idx on public.proposals (token);

-- ---------------------------------------------------------
-- 2) AUTO updated_at + version bump
-- ---------------------------------------------------------
create or replace function public.proposals_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' then
    new.version := old.version + 1;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_proposals_touch on public.proposals;
create trigger trg_proposals_touch
before insert or update on public.proposals
for each row execute function public.proposals_touch();

-- ---------------------------------------------------------
-- 3) RLS: lock the table, expose access via SECURITY DEFINER RPC only
-- ---------------------------------------------------------
alter table public.proposals enable row level security;
revoke all on table public.proposals from anon, authenticated;

-- ---------------------------------------------------------
-- 4) PUBLIC VIEW (never expose edit_token)
-- IMPORTANT: we do NOT grant SELECT on this view to anon/authenticated.
-- Access is only via qop_public_get().
-- ---------------------------------------------------------
-- DROP DEPENDENT FUNCTIONS FIRST
drop function if exists public.qop_public_get(text);
drop function if exists public.qop_mark_viewed(text);
drop function if exists public.qop_decline(text, text, text);

drop view if exists public.proposals_public;

create view public.proposals_public as
select
  token,
  proposal,
  pack_id,
  selected_options,
  total_price,
  deposit_percent,
  deposit_amount,
  client_source,
  main_action,
  prospect_goal,
  status,
  version,
  valid_until,
  sent_at,
  viewed_at,
  accepted_at,
  accepted_meta,
  declined_at,
  declined_meta,
  created_at,
  updated_at
from public.proposals;

revoke all on table public.proposals_public from anon, authenticated;

-- ---------------------------------------------------------
-- 5) DROP/RECREATE RPC that may change return types
-- (This avoids: "cannot change return type of existing function")
-- ---------------------------------------------------------
-- (Functions already dropped above to allow view update)

-- (These usually keep same return type; dropping is optional.
-- If you want full reset, uncomment below lines.)
-- drop function if exists public.qop_upsert_proposal(text,text,jsonb,text,text[],integer,integer,integer,date);
-- drop function if exists public.qop_get_proposal(text);
-- drop function if exists public.qop_mark_sent(text);
-- drop function if exists public.qop_accept(text,text,text,text);

-- ---------------------------------------------------------
-- 6) RPC: Upsert (create/update) by token + edit_token
-- Returns the saved row (includes edit_token, but caller already has it).
-- ---------------------------------------------------------
create or replace function public.qop_upsert_proposal(
  p_token text,
  p_edit_token text,
  p_proposal jsonb,
  p_pack_id text,
  p_selected_options text[],
  p_total_price integer,
  p_deposit_percent integer,
  p_deposit_amount integer,
  p_valid_until date,
  p_client_source text[] default '{}',
  p_main_action text default '',
  p_prospect_goal text default ''
)
returns setof public.proposals
language sql
security definer
set search_path = public
as $$
  insert into public.proposals (
    token, edit_token, proposal,
    pack_id, selected_options,
    total_price, deposit_percent, deposit_amount,
    valid_until,
    client_source, main_action, prospect_goal
  ) values (
    p_token, p_edit_token, p_proposal,
    p_pack_id, coalesce(p_selected_options, '{}'),
    p_total_price, p_deposit_percent, p_deposit_amount,
    p_valid_until,
    coalesce(p_client_source, '{}'), coalesce(p_main_action, ''), coalesce(p_prospect_goal, '')
  )
  on conflict (token)
  do update set
    proposal = excluded.proposal,
    pack_id = excluded.pack_id,
    selected_options = excluded.selected_options,
    total_price = excluded.total_price,
    deposit_percent = excluded.deposit_percent,
    deposit_amount = excluded.deposit_amount,
    valid_until = excluded.valid_until,
    client_source = excluded.client_source,
    main_action = excluded.main_action,
    prospect_goal = excluded.prospect_goal
  where public.proposals.edit_token = p_edit_token
  returning *;
$$;

-- ---------------------------------------------------------
-- 7) RPC: Read-only fetch by token (OWNER-UNSAFE, legacy)
-- NOTE: This returns the full row including edit_token.
-- Keep it ONLY if your OWNER (edit page) uses it.
-- Public page should use qop_public_get instead.
-- ---------------------------------------------------------
create or replace function public.qop_get_proposal(
  p_token text
)
returns setof public.proposals
language sql
security definer
set search_path = public
as $$
  select *
  from public.proposals
  where token = p_token
  limit 1;
$$;

-- ---------------------------------------------------------
-- 8) RPC: Public fetch (SAFE) by token (no edit_token)
-- ---------------------------------------------------------
create function public.qop_public_get(
  p_token text
)
returns setof public.proposals_public
language sql
security definer
set search_path = public
as $$
  select *
  from public.proposals_public
  where token = p_token
  limit 1;
$$;

-- ---------------------------------------------------------
-- 9) RPC: Mark as sent (called when you copy/share)
-- ---------------------------------------------------------
create or replace function public.qop_mark_sent(
  p_token text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.proposals
    set
      sent_at = coalesce(sent_at, now()),
      status = case when status = 'draft' then 'sent' else status end
  where token = p_token;
end;
$$;

-- ---------------------------------------------------------
-- 10) RPC: Mark as viewed (called when public link is opened)
-- ---------------------------------------------------------
create function public.qop_mark_viewed(
  p_token text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.proposals
    set
      viewed_at = coalesce(viewed_at, now()),
      status = case when status in ('draft','sent') then status else status end
  where token = p_token;
end;
$$;

-- ---------------------------------------------------------
-- 11) RPC: Accept (called by prospect). Stores minimal metadata.
-- ---------------------------------------------------------
create or replace function public.qop_accept(
  p_token text,
  p_name text default null,
  p_email text default null,
  p_client_date text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.proposals
    set
      status = 'accepted',
      accepted_at = coalesce(accepted_at, now()),
      accepted_meta = coalesce(accepted_meta, '{}'::jsonb) ||
        jsonb_strip_nulls(
          jsonb_build_object(
            'name', p_name,
            'email', p_email,
            'client_date', p_client_date
          )
        )
  where token = p_token;
end;
$$;

-- ---------------------------------------------------------
-- 12) RPC: Decline (called by prospect)
-- ---------------------------------------------------------
create function public.qop_decline(
  p_token text,
  p_reason text default null,
  p_client_date text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.proposals
    set
      status = 'declined',
      declined_at = coalesce(declined_at, now()),
      declined_meta = coalesce(declined_meta, '{}'::jsonb) ||
        jsonb_strip_nulls(
          jsonb_build_object(
            'reason', p_reason,
            'client_date', p_client_date
          )
        )
  where token = p_token
    and status <> 'accepted'; -- avoid overwriting accepted
end;
$$;

-- ---------------------------------------------------------
-- 13) Permissions: allow anon/authenticated to execute RPC functions
-- ---------------------------------------------------------
grant execute on function public.qop_upsert_proposal(text,text,jsonb,text,text[],integer,integer,integer,date) to anon, authenticated;
grant execute on function public.qop_get_proposal(text) to anon, authenticated;
grant execute on function public.qop_public_get(text) to anon, authenticated;
grant execute on function public.qop_mark_sent(text) to anon, authenticated;
grant execute on function public.qop_mark_viewed(text) to anon, authenticated;
grant execute on function public.qop_accept(text,text,text,text) to anon, authenticated;
grant execute on function public.qop_decline(text,text,text) to anon, authenticated;
