-- Quick Offer Pro (Mini-Proposition 1 page)
-- Supabase schema + RPC functions for safe public links (token) + owner edits (edit_token).
--
-- Apply this file in Supabase (SQL Editor) in one run.

-- Optional (often already enabled):
-- create extension if not exists pgcrypto;

-- 1) TABLE
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

  status text not null default 'draft',
  version integer not null default 1,
  valid_until date not null,

  sent_at timestamptz,
  accepted_at timestamptz,
  accepted_meta jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists proposals_token_idx on public.proposals (token);

-- 2) AUTO updated_at + version bump
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

-- 3) RLS: lock the table, expose access via SECURITY DEFINER RPC only
alter table public.proposals enable row level security;
revoke all on table public.proposals from anon, authenticated;

-- 4) RPC: Upsert (create/update) by token + edit_token
-- Returns the saved row.
create or replace function public.qop_upsert_proposal(
  p_token text,
  p_edit_token text,
  p_proposal jsonb,
  p_pack_id text,
  p_selected_options text[],
  p_total_price integer,
  p_deposit_percent integer,
  p_deposit_amount integer,
  p_valid_until date
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
    valid_until
  ) values (
    p_token, p_edit_token, p_proposal,
    p_pack_id, coalesce(p_selected_options, '{}'),
    p_total_price, p_deposit_percent, p_deposit_amount,
    p_valid_until
  )
  on conflict (token)
  do update set
    proposal = excluded.proposal,
    pack_id = excluded.pack_id,
    selected_options = excluded.selected_options,
    total_price = excluded.total_price,
    deposit_percent = excluded.deposit_percent,
    deposit_amount = excluded.deposit_amount,
    valid_until = excluded.valid_until
  where public.proposals.edit_token = p_edit_token
  returning *;
$$;

-- 5) RPC: Read-only fetch by token (for public view)
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

-- 6) RPC: Mark as sent (called when you copy/share)
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

-- 7) RPC: Accept (called by prospect). Stores minimal metadata.
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
      accepted_at = now(),
      accepted_meta = jsonb_strip_nulls(
        jsonb_build_object(
          'name', p_name,
          'email', p_email,
          'client_date', p_client_date
        )
      )
  where token = p_token;
end;
$$;

-- 8) Permissions: allow anon/authenticated to execute RPC functions
grant execute on function public.qop_upsert_proposal(text,text,jsonb,text,text[],integer,integer,integer,date) to anon, authenticated;
grant execute on function public.qop_get_proposal(text) to anon, authenticated;
grant execute on function public.qop_mark_sent(text) to anon, authenticated;
grant execute on function public.qop_accept(text,text,text,text) to anon, authenticated;
