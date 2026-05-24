create extension if not exists pgcrypto with schema extensions;

create type public.organization_role as enum (
  'owner',
  'company_admin',
  'catalog_editor',
  'sales_manager',
  'representative'
);

create type public.member_status as enum ('active', 'invited', 'blocked');
create type public.catalog_status as enum ('draft', 'published', 'archived');
create type public.job_status as enum ('queued', 'processing', 'succeeded', 'failed', 'refunded');
create type public.interest_level as enum ('low', 'medium', 'high', 'very_high');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'starter',
  status text not null default 'trial',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_users (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null default 'catalog_editor',
  status public.member_status not null default 'active',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.plan_limits (
  plan text primary key,
  products_limit int not null,
  catalogs_limit int not null,
  representatives_limit int not null,
  storage_mb_limit int not null,
  monthly_events_limit int not null,
  monthly_ai_credits int not null,
  created_at timestamptz not null default now()
);

insert into public.plan_limits (
  plan,
  products_limit,
  catalogs_limit,
  representatives_limit,
  storage_mb_limit,
  monthly_events_limit,
  monthly_ai_credits
) values
  ('starter', 1000, 10, 3, 5120, 50000, 50),
  ('pro', 5000, 100, 25, 20480, 500000, 300),
  ('scale', 20000, 500, 100, 102400, 2500000, 1500),
  ('enterprise', 100000, 2000, 1000, 512000, 10000000, 10000)
on conflict (plan) do nothing;

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  gateway text,
  gateway_customer_id text,
  gateway_subscription_id text,
  plan text not null references public.plan_limits(plan),
  status text not null default 'trialing',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.representatives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text,
  phone text,
  region text,
  status public.member_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.representative_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  representative_id uuid references public.representatives(id) on delete cascade,
  email text,
  phone text,
  token text not null unique default encode(extensions.gen_random_bytes(24), 'hex'),
  status text not null default 'pending',
  expires_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now()
);

create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  title text not null,
  sku text,
  category text,
  description text,
  price numeric(12,2),
  currency text not null default 'BRL',
  status text not null default 'active',
  stock_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku)
);

create table public.product_variations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  value text not null,
  sku text,
  price numeric(12,2),
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  original_path text,
  original_url text,
  thumb_url text,
  card_mobile_url text,
  card_desktop_url text,
  detail_url text,
  zoom_url text,
  placeholder text,
  status text not null default 'queued',
  width int,
  height int,
  size_bytes bigint,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.catalogs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  status public.catalog_status not null default 'draft',
  cover_image_url text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table public.catalog_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  catalog_id uuid not null references public.catalogs(id) on delete cascade,
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  catalog_id uuid not null references public.catalogs(id) on delete cascade,
  section_id uuid references public.catalog_sections(id) on delete set null,
  product_id uuid not null references public.products(id) on delete cascade,
  position int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  unique (catalog_id, product_id)
);

create table public.catalog_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  catalog_id uuid not null references public.catalogs(id) on delete cascade,
  version_number int not null,
  manifest jsonb not null default '{}'::jsonb,
  manifest_url text,
  is_current boolean not null default false,
  published_by uuid references auth.users(id) on delete set null,
  published_at timestamptz not null default now(),
  unique (catalog_id, version_number)
);

create table public.share_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  catalog_id uuid not null references public.catalogs(id) on delete cascade,
  representative_id uuid references public.representatives(id) on delete set null,
  code text not null unique default encode(extensions.gen_random_bytes(8), 'hex'),
  utm jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.public_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  catalog_version_id uuid not null references public.catalog_versions(id) on delete cascade,
  share_link_id uuid references public.share_links(id) on delete set null,
  representative_id uuid references public.representatives(id) on delete set null,
  nickname text not null,
  device text,
  user_agent text,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table public.catalog_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  session_id uuid not null references public.public_sessions(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  event_type text not null,
  duration_ms int,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.interest_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  session_id uuid not null references public.public_sessions(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  score int not null default 0,
  level public.interest_level not null default 'low',
  reasons jsonb not null default '[]'::jsonb,
  computed_at timestamptz not null default now(),
  unique (session_id, product_id)
);

create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  job_type text not null,
  provider text,
  status public.job_status not null default 'queued',
  estimated_cost numeric(12,4),
  actual_cost numeric(12,4),
  credits_charged int not null default 0,
  source_image_id uuid references public.product_images(id) on delete set null,
  result jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ai_job_id uuid references public.ai_jobs(id) on delete set null,
  delta int not null,
  amount_cents int,
  reason text not null,
  created_at timestamptz not null default now()
);

create table public.error_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  route text,
  browser text,
  severity text not null default 'error',
  message text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.usage_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  snapshot_date date not null default current_date,
  products_count int not null default 0,
  catalogs_count int not null default 0,
  representatives_count int not null default 0,
  storage_bytes bigint not null default 0,
  events_count int not null default 0,
  ai_credits_used int not null default 0,
  created_at timestamptz not null default now(),
  unique (organization_id, snapshot_date)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  summary text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_org_member(target_organization_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.organization_users ou
    where ou.organization_id = target_organization_id
      and ou.user_id = auth.uid()
      and ou.status = 'active'
  );
$$;

create or replace function public.has_org_role(
  target_organization_id uuid,
  allowed_roles public.organization_role[]
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.organization_users ou
    where ou.organization_id = target_organization_id
      and ou.user_id = auth.uid()
      and ou.status = 'active'
      and ou.role = any(allowed_roles)
  );
$$;

create trigger set_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create trigger set_representatives_updated_at
before update on public.representatives
for each row execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_product_images_updated_at
before update on public.product_images
for each row execute function public.set_updated_at();

create trigger set_catalogs_updated_at
before update on public.catalogs
for each row execute function public.set_updated_at();

create trigger set_ai_jobs_updated_at
before update on public.ai_jobs
for each row execute function public.set_updated_at();

create index organization_users_user_id_idx on public.organization_users(user_id);
create index representatives_organization_id_idx on public.representatives(organization_id);
create index products_organization_id_idx on public.products(organization_id);
create index products_title_idx on public.products using gin (to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(description, '')));
create index product_images_product_id_idx on public.product_images(product_id);
create index catalogs_organization_id_idx on public.catalogs(organization_id);
create index catalog_versions_catalog_id_idx on public.catalog_versions(catalog_id);
create index share_links_code_idx on public.share_links(code);
create index public_sessions_share_link_id_idx on public.public_sessions(share_link_id);
create index catalog_events_session_id_idx on public.catalog_events(session_id);
create index interest_scores_session_id_idx on public.interest_scores(session_id);
create index error_logs_created_at_idx on public.error_logs(created_at desc);
create index audit_logs_organization_id_idx on public.audit_logs(organization_id);

alter table public.organizations enable row level security;
alter table public.organization_users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.representatives enable row level security;
alter table public.representative_invites enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variations enable row level security;
alter table public.product_images enable row level security;
alter table public.catalogs enable row level security;
alter table public.catalog_sections enable row level security;
alter table public.catalog_products enable row level security;
alter table public.catalog_versions enable row level security;
alter table public.share_links enable row level security;
alter table public.public_sessions enable row level security;
alter table public.catalog_events enable row level security;
alter table public.interest_scores enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.ai_credit_ledger enable row level security;
alter table public.error_logs enable row level security;
alter table public.usage_snapshots enable row level security;
alter table public.audit_logs enable row level security;

create policy "authenticated users can create organizations"
on public.organizations for insert
to authenticated
with check (true);

create policy "members can view organizations"
on public.organizations for select
to authenticated
using (public.is_org_member(id));

create policy "owners and admins can update organizations"
on public.organizations for update
to authenticated
using (public.has_org_role(id, array['owner', 'company_admin']::public.organization_role[]))
with check (public.has_org_role(id, array['owner', 'company_admin']::public.organization_role[]));

create policy "users can bootstrap own organization membership"
on public.organization_users for insert
to authenticated
with check (user_id = auth.uid());

create policy "members can view memberships"
on public.organization_users for select
to authenticated
using (public.is_org_member(organization_id));

create policy "owners and admins can manage memberships"
on public.organization_users for update
to authenticated
using (public.has_org_role(organization_id, array['owner', 'company_admin']::public.organization_role[]))
with check (public.has_org_role(organization_id, array['owner', 'company_admin']::public.organization_role[]));

create policy "anyone can view plan limits"
on public.plan_limits for select
to anon, authenticated
using (true);

create policy "members can view subscriptions"
on public.subscriptions for select
to authenticated
using (public.is_org_member(organization_id));

create policy "owners can manage subscriptions"
on public.subscriptions for all
to authenticated
using (public.has_org_role(organization_id, array['owner']::public.organization_role[]))
with check (public.has_org_role(organization_id, array['owner']::public.organization_role[]));

create policy "members can manage representatives"
on public.representatives for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage representative invites"
on public.representative_invites for all
to authenticated
using (public.has_org_role(organization_id, array['owner', 'company_admin', 'sales_manager']::public.organization_role[]))
with check (public.has_org_role(organization_id, array['owner', 'company_admin', 'sales_manager']::public.organization_role[]));

create policy "members can manage product categories"
on public.product_categories for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage products"
on public.products for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage product variations"
on public.product_variations for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage product images"
on public.product_images for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage catalogs"
on public.catalogs for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage catalog sections"
on public.catalog_sections for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage catalog products"
on public.catalog_products for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage catalog versions"
on public.catalog_versions for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "public can read published catalog versions"
on public.catalog_versions for select
to anon, authenticated
using (is_current = true);

create policy "members can manage share links"
on public.share_links for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "public can read active share links"
on public.share_links for select
to anon, authenticated
using (status = 'active');

create policy "public can create public sessions"
on public.public_sessions for insert
to anon, authenticated
with check (true);

create policy "members can view public sessions"
on public.public_sessions for select
to authenticated
using (public.is_org_member(organization_id));

create policy "public can update own session end"
on public.public_sessions for update
to anon, authenticated
using (true)
with check (true);

create policy "public can create catalog events"
on public.catalog_events for insert
to anon, authenticated
with check (true);

create policy "members can view catalog events"
on public.catalog_events for select
to authenticated
using (public.is_org_member(organization_id));

create policy "members can view interest scores"
on public.interest_scores for select
to authenticated
using (public.is_org_member(organization_id));

create policy "members can manage interest scores"
on public.interest_scores for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage ai jobs"
on public.ai_jobs for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can view ai credits"
on public.ai_credit_ledger for select
to authenticated
using (public.is_org_member(organization_id));

create policy "members can manage error logs"
on public.error_logs for all
to authenticated
using (organization_id is null or public.is_org_member(organization_id))
with check (organization_id is null or public.is_org_member(organization_id));

create policy "members can view usage snapshots"
on public.usage_snapshots for select
to authenticated
using (public.is_org_member(organization_id));

create policy "members can view audit logs"
on public.audit_logs for select
to authenticated
using (organization_id is null or public.is_org_member(organization_id));
