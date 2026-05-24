create table public.catalog_design_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'draft',
  audience text,
  description text,
  cover_style text,
  grid_style text,
  tokens jsonb not null default '{}'::jsonb,
  preview_image_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.catalog_design_assets (
  id uuid primary key default gen_random_uuid(),
  design_preset_id uuid not null references public.catalog_design_presets(id) on delete cascade,
  asset_type text not null,
  storage_path text,
  public_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.organization_catalog_designs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  design_preset_id uuid not null references public.catalog_design_presets(id) on delete restrict,
  status text not null default 'active',
  selected_by uuid references auth.users(id) on delete set null,
  selected_at timestamptz not null default now(),
  unique (organization_id, design_preset_id)
);

alter table public.catalogs
add column catalog_design_preset_id uuid references public.catalog_design_presets(id) on delete set null;

create trigger set_catalog_design_presets_updated_at
before update on public.catalog_design_presets
for each row execute function public.set_updated_at();

create index catalog_design_assets_preset_id_idx
on public.catalog_design_assets(design_preset_id);

create index organization_catalog_designs_organization_id_idx
on public.organization_catalog_designs(organization_id);

create index catalogs_catalog_design_preset_id_idx
on public.catalogs(catalog_design_preset_id);

alter table public.catalog_design_presets enable row level security;
alter table public.catalog_design_assets enable row level security;
alter table public.organization_catalog_designs enable row level security;

create policy "authenticated users can view published catalog design presets"
on public.catalog_design_presets for select
to authenticated
using (status = 'published');

create policy "authenticated users can view published catalog design assets"
on public.catalog_design_assets for select
to authenticated
using (
  exists (
    select 1
    from public.catalog_design_presets cdp
    where cdp.id = catalog_design_assets.design_preset_id
      and cdp.status = 'published'
  )
);

create policy "members can manage organization catalog designs"
on public.organization_catalog_designs for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can view organization catalog designs"
on public.organization_catalog_designs for select
to authenticated
using (public.is_org_member(organization_id));

insert into public.catalog_design_presets (
  name,
  slug,
  status,
  audience,
  description,
  cover_style,
  grid_style,
  tokens,
  preview_image_url
) values
  (
    'Atacado Limpo',
    'clean-wholesale',
    'published',
    'Distribuidoras e fornecedores',
    'Layout direto, rapido e com foco em lista de produtos para compra recorrente.',
    'Cabecalho compacto com busca fixa',
    'Grade de cards objetivos',
    '{"primaryColor":"#0f766e","accentColor":"#d97706","backgroundColor":"#f6f7f2","surfaceColor":"#ffffff","textColor":"#0f172a"}'::jsonb,
    '/sample-products/esponja-1.png'
  ),
  (
    'Infantil Rapido',
    'kids-fast',
    'published',
    'Brinquedos e infantil',
    'Visual simples e alegre, mantendo performance e leitura facil no celular.',
    'Topo colorido com secoes visiveis',
    'Cards arredondados com imagem forte',
    '{"primaryColor":"#2563eb","accentColor":"#f59e0b","backgroundColor":"#eef6ff","surfaceColor":"#ffffff","textColor":"#111827"}'::jsonb,
    '/sample-products/tubarao-1.jpeg'
  )
on conflict (slug) do nothing;
