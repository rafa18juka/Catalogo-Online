alter table public.organizations
add column if not exists legal_name text,
add column if not exists cnpj text,
add column if not exists responsible_name text,
add column if not exists contact_email text,
add column if not exists contact_phone text,
add column if not exists payment_status text not null default 'pending',
add column if not exists access_source text not null default 'stripe',
add column if not exists stripe_customer_id text,
add column if not exists stripe_subscription_id text;

alter table public.catalogs
add column if not exists is_released_to_representatives boolean not null default false;

create table public.representative_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  cpf text not null,
  email text not null unique,
  phone text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.representative_company_links (
  id uuid primary key default gen_random_uuid(),
  representative_profile_id uuid not null references public.representative_profiles(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invite_token_id uuid references public.representative_invites(id) on delete set null,
  status text not null default 'active',
  linked_at timestamptz not null default now(),
  unique (representative_profile_id, organization_id)
);

alter table public.representative_invites
add column if not exists used_by_representative_profile_id uuid references public.representative_profiles(id) on delete set null,
add column if not exists used_at timestamptz;

create trigger set_representative_profiles_updated_at
before update on public.representative_profiles
for each row execute function public.set_updated_at();

create index representative_profiles_user_id_idx
on public.representative_profiles(user_id);

create index representative_company_links_rep_idx
on public.representative_company_links(representative_profile_id);

create index representative_company_links_org_idx
on public.representative_company_links(organization_id);

alter table public.representative_profiles enable row level security;
alter table public.representative_company_links enable row level security;

create policy "representatives can view own profile"
on public.representative_profiles for select
to authenticated
using (user_id = auth.uid());

create policy "representatives can create own profile"
on public.representative_profiles for insert
to authenticated
with check (user_id = auth.uid());

create policy "representatives can update own profile"
on public.representative_profiles for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "company members can view representative links"
on public.representative_company_links for select
to authenticated
using (public.is_org_member(organization_id));

create policy "representatives can view own company links"
on public.representative_company_links for select
to authenticated
using (
  exists (
    select 1
    from public.representative_profiles rp
    where rp.id = representative_company_links.representative_profile_id
      and rp.user_id = auth.uid()
  )
);

create policy "representatives can create own company links"
on public.representative_company_links for insert
to authenticated
with check (
  exists (
    select 1
    from public.representative_profiles rp
    where rp.id = representative_company_links.representative_profile_id
      and rp.user_id = auth.uid()
  )
);

create policy "company members can manage representative links"
on public.representative_company_links for update
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));
