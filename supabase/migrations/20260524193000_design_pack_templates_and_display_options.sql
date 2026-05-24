alter table public.products
add column if not exists internal_code text,
add column if not exists ean text,
add column if not exists ncm text,
add column if not exists measurements text,
add column if not exists weight text,
add column if not exists master_box text,
add column if not exists minimum_order text,
add column if not exists observations text,
add column if not exists variations text,
add column if not exists stock_text text;

alter table public.catalog_design_presets
add column if not exists template_id text,
add column if not exists package_version text not null default '1.0.0',
add column if not exists package_type text not null default 'catalog_template_pack',
add column if not exists source_type text not null default 'manual',
add column if not exists manifest_json jsonb not null default '{}'::jsonb,
add column if not exists config_json jsonb not null default '{}'::jsonb,
add column if not exists tokens_schema_json jsonb not null default '{}'::jsonb,
add column if not exists supports_fields jsonb not null default '{
  "showProductImage": true,
  "showProductName": true,
  "showPrice": true,
  "showSku": true,
  "showInternalCode": true,
  "showEan": true,
  "showNcm": true,
  "showMeasurements": true,
  "showWeight": true,
  "showMasterBox": true,
  "showMinimumOrder": true,
  "showDescription": true,
  "showObservations": true,
  "showVariations": true,
  "showStock": true
}'::jsonb,
add column if not exists default_display_options jsonb not null default '{
  "showProductImage": true,
  "showProductName": true,
  "showPrice": true,
  "showSku": true,
  "showInternalCode": true,
  "showEan": true,
  "showNcm": true,
  "showMeasurements": true,
  "showWeight": true,
  "showMasterBox": true,
  "showMinimumOrder": true,
  "showDescription": true,
  "showObservations": true,
  "showVariations": true,
  "showStock": true
}'::jsonb,
add column if not exists files_summary jsonb not null default '[]'::jsonb,
add column if not exists imported_at timestamptz;

alter table public.catalogs
add column if not exists display_options jsonb not null default '{
  "showProductImage": true,
  "showProductName": true,
  "showPrice": true,
  "showSku": true,
  "showInternalCode": true,
  "showEan": true,
  "showNcm": true,
  "showMeasurements": true,
  "showWeight": true,
  "showMasterBox": true,
  "showMinimumOrder": true,
  "showDescription": true,
  "showObservations": true,
  "showVariations": true,
  "showStock": true
}'::jsonb;

create unique index if not exists catalog_design_presets_template_id_idx
on public.catalog_design_presets(template_id)
where template_id is not null;

create index if not exists catalog_design_presets_status_source_idx
on public.catalog_design_presets(status, source_type);

update public.catalog_design_presets
set
  template_id = coalesce(template_id, slug),
  source_type = coalesce(source_type, 'manual'),
  package_type = coalesce(package_type, 'catalog_template_pack')
where template_id is null;
