create table public.representation_firms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  trade_name text not null,
  legal_name text not null,
  cnpj text not null,
  responsible_name text not null,
  responsible_cpf text not null,
  email text not null unique,
  phone text,
  address text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.representative_profiles
add column if not exists representation_firm_id uuid references public.representation_firms(id) on delete set null,
add column if not exists representative_kind text not null default 'autonomous';

alter table public.representative_company_links
add column if not exists representative_type text not null default 'autonomous',
add column if not exists revoked_at timestamptz;

create trigger set_representation_firms_updated_at
before update on public.representation_firms
for each row execute function public.set_updated_at();

create index representation_firms_user_id_idx
on public.representation_firms(user_id);

create index representative_profiles_firm_id_idx
on public.representative_profiles(representation_firm_id);

alter table public.representation_firms enable row level security;

create policy "firms can view own representation firm"
on public.representation_firms for select
to authenticated
using (user_id = auth.uid());

create policy "firms can create own representation firm"
on public.representation_firms for insert
to authenticated
with check (user_id = auth.uid());

create policy "firms can update own representation firm"
on public.representation_firms for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
