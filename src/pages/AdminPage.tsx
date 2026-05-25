import JSZip from 'jszip'
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  CreditCard,
  Database,
  HardDrive,
  Plus,
  RadioTower,
  Upload,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Brand } from '../components/Brand'
import { DesignPreview } from '../components/DesignPreview'
import {
  defaultProductDisplayOptions,
  productDisplayFields,
  type CatalogDesignPreset,
  type ProductDisplayOptions,
} from '../data/mock'
import {
  createCatalogDesignPreset,
  getCompanyCatalogCount,
  getCompanies,
  getCatalogDesignPresets,
  getRepresentationFirms,
  getRepresentativeLinks,
  getRepresentatives,
  updateCatalogDesignPresetStatus,
} from '../lib/mockStore'

const devEvents = [
  'Stripe pronto para webhook de confirmacao de assinatura',
  'Representante sem vinculo nao visualiza catalogos',
  'Design Pack importado sempre entra como rascunho',
  'Templates publicados precisam suportar todos os campos principais',
]

type ImportReport = {
  name: string
  status: CatalogDesignPreset['status']
  files: string[]
  missingFields: string[]
  rootPath: string
  warnings: string[]
}

const displayOptionAliases: Record<keyof ProductDisplayOptions, string[]> = {
  showProductImage: ['showImages', 'imageUrl'],
  showProductName: ['showProductTitle', 'title', 'name'],
  showPrice: ['showUnitPrice', 'unitPrice', 'price'],
  showSku: ['showCode', 'code', 'sku'],
  showInternalCode: ['showCode', 'code', 'internalCode'],
  showEan: ['showBarcode', 'barcode', 'ean'],
  showNcm: ['showNcm', 'ncm'],
  showMeasurements: ['showMeasures', 'measurements', 'type'],
  showWeight: ['showWeight', 'weight', 'boxQty'],
  showMasterBox: ['showMasterBoxQty', 'masterBoxQty', 'masterBox'],
  showMinimumOrder: ['showMinimumOrder', 'minimumOrder', 'boxQty'],
  showDescription: ['showShortDescription', 'shortDescription', 'description'],
  showObservations: ['showObservations', 'observations', 'shortDescription'],
  showVariations: ['showColorName', 'showColorDots', 'colorName', 'colors'],
  showStock: [
    'showCurrentStock',
    'showOutOfStockBadge',
    'currentStock',
    'outOfStock',
    'stock',
  ],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function readString(
  source: Record<string, unknown> | undefined,
  key: string,
  fallback = '',
) {
  const value = source?.[key]

  return typeof value === 'string' ? value : fallback
}

async function readZipJson(
  zip: JSZip,
  path: string,
): Promise<Record<string, unknown>> {
  const file = zip.file(path)

  if (!file) throw new Error(`Arquivo ${path} nao encontrado.`)

  const raw = await file.async('string')
  const parsed = JSON.parse(raw) as unknown

  if (!isRecord(parsed)) {
    throw new Error(`Arquivo ${path} precisa conter um objeto JSON.`)
  }

  return parsed
}

function findPackRoot(zip: JSZip) {
  if (zip.file('manifest.json')) return ''

  const manifestPath = Object.keys(zip.files).find((path) =>
    path.endsWith('/manifest.json'),
  )

  if (!manifestPath) {
    throw new Error('Arquivo manifest.json nao encontrado no pacote.')
  }

  return manifestPath.replace(/manifest\.json$/, '')
}

function resolvePackPath(rootPath: string, path: string) {
  if (!rootPath || path.startsWith(rootPath)) return path

  return `${rootPath}${path}`.replace(/\\/g, '/')
}

async function readPackJson(
  zip: JSZip,
  rootPath: string,
  path: string,
): Promise<Record<string, unknown>> {
  return readZipJson(zip, resolvePackPath(rootPath, path))
}

function getPackFile(zip: JSZip, rootPath: string, path: string) {
  return zip.file(resolvePackPath(rootPath, path)) ?? zip.file(path)
}

function readNestedString(
  source: Record<string, unknown> | undefined,
  group: string,
  key: string,
  fallback = '',
) {
  const nested = isRecord(source?.[group]) ? source[group] : undefined

  return readString(nested, key, fallback)
}

function readTokenString(
  tokens: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
) {
  return readString(tokens, key, fallback)
}

function getSourceBoolean(source: Record<string, unknown>, keys: string[]) {
  const values = keys
    .map((key) => source[key])
    .filter((value): value is boolean => typeof value === 'boolean')

  if (values.includes(true)) return true
  if (values.includes(false)) return false

  return undefined
}

function normalizeDisplayOptions(value: unknown) {
  const source = isRecord(value) ? value : {}
  const missingFields: string[] = []
  const options = productDisplayFields.reduce((current, field) => {
    const fieldValue = getSourceBoolean(source, [
      field.key,
      ...displayOptionAliases[field.key],
    ])

    if (fieldValue === false) {
      missingFields.push(field.label)
    }

    return { ...current, [field.key]: fieldValue !== false }
  }, {} as ProductDisplayOptions)

  return { options, missingFields }
}

async function readPreview(zip: JSZip, rootPath: string, path: string) {
  const file = getPackFile(zip, rootPath, path)

  if (!file) return { previewImage: '/sample-products/esponja-1.png' }

  if (path.endsWith('.svg')) {
    const svg = await file.async('string')

    return {
      previewImage: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      previewKind: 'svg' as const,
    }
  }

  const extension = path.split('.').pop()?.toLowerCase() ?? 'png'
  const contentType =
    extension === 'jpg' || extension === 'jpeg'
      ? 'image/jpeg'
      : extension === 'webp'
        ? 'image/webp'
        : 'image/png'
  const base64 = await file.async('base64')

  return {
    previewImage: `data:${contentType};base64,${base64}`,
    previewKind: 'image' as const,
  }
}

export function AdminPage() {
  const [manualCompanyName, setManualCompanyName] = useState('')
  const [designs, setDesigns] = useState(getCatalogDesignPresets())
  const [packMessage, setPackMessage] = useState('')
  const [importReport, setImportReport] = useState<ImportReport | null>(null)
  const links = getRepresentativeLinks()
  const companies = getCompanies()
  const representatives = getRepresentatives()
  const firms = getRepresentationFirms()

  const adminMetrics = [
    ['Empresas cadastradas', String(companies.length), Database, 'text-sky-700'],
    [
      'Representantes',
      String(representatives.length + firms.length),
      Users,
      'text-teal-700',
    ],
    ['Vinculos ativos', String(links.length), RadioTower, 'text-rose-700'],
    ['Storage usado', '88 GB', HardDrive, 'text-amber-700'],
  ] as const

  async function handleDesignPackUpload(file: File | null) {
    if (!file) return

    try {
      setPackMessage('Validando pacote...')
      const zip = await JSZip.loadAsync(file)
      const rootPath = findPackRoot(zip)
      const manifest = await readPackJson(zip, rootPath, 'manifest.json')
      const configPath =
        readNestedString(manifest, 'entrypoints', 'config') ||
        'template.config.json'
      const tokensPath =
        readNestedString(manifest, 'entrypoints', 'tokensSchema') ||
        'design-tokens.schema.json'
      const config = await readPackJson(zip, rootPath, configPath)
      const tokensFile = getPackFile(zip, rootPath, tokensPath)
      const tokensSchemaJson = tokensFile
        ? ((JSON.parse(await tokensFile.async('string')) as unknown) ?? {})
        : {}
      const defaultTokens = isRecord(config.defaultTokens)
        ? config.defaultTokens
        : {}
      const manifestFiles = isRecord(manifest.files) ? manifest.files : {}
      const previewPath =
        readString(manifest, 'preview') ||
        readString(manifestFiles, 'preview') ||
        'previews/preview.svg'
      const preview = await readPreview(zip, rootPath, previewPath)
      const packageType = readString(manifest, 'packageType')
      const reactEntrypoint = readNestedString(
        manifest,
        'entrypoints',
        'reactComponent',
      )

      if (packageType !== 'catalog_template_pack') {
        throw new Error('O packageType precisa ser catalog_template_pack.')
      }

      const supports = normalizeDisplayOptions(config.supportsFields)
      const defaults = normalizeDisplayOptions(
        config.defaultDisplayOptions ?? defaultProductDisplayOptions,
      )
      const files = Object.keys(zip.files).filter((path) => !zip.files[path].dir)
      const warnings = [
        rootPath
          ? `Pacote importado com pasta raiz: ${rootPath.replace(/\/$/, '')}`
          : '',
        reactEntrypoint
          ? `Componente React encontrado: ${reactEntrypoint}. Nesta fase ele fica registrado, mas nao e executado como codigo livre.`
          : '',
      ].filter(Boolean)
      const status: CatalogDesignPreset['status'] = 'Rascunho'
      const design = createCatalogDesignPreset({
        templateId:
          readString(manifest, 'templateId') ||
          readString(config, 'templateId') ||
          file.name.replace(/\.zip$/i, ''),
        packageVersion: readString(manifest, 'packageVersion', '1.0.0'),
        sourceType: 'design_pack',
        name: readString(config, 'clientVisibleName') || readString(manifest, 'name'),
        audience: readString(manifest, 'audience', 'Empresas gerais'),
        description:
          readString(config, 'clientVisibleDescription') ||
          readString(manifest, 'description', 'Design Pack importado pelo dev.'),
        coverStyle: readString(config, 'layoutMode', 'HTML/CSS/SVG'),
        gridStyle: readString(config, 'productLayout', 'Layout por componentes'),
        primaryColor: readTokenString(defaultTokens, 'primaryColor', '#0f766e'),
        accentColor: readTokenString(defaultTokens, 'accentColor', '#d97706'),
        backgroundColor: readTokenString(
          defaultTokens,
          'backgroundColor',
          '#f6f7f2',
        ),
        surfaceColor: '#ffffff',
        textColor: readTokenString(defaultTokens, 'textColor', '#0f172a'),
        status,
        previewImage: preview.previewImage,
        previewKind: preview.previewKind ?? 'generated',
        supportsFields: supports.options,
        defaultDisplayOptions: defaults.options,
        manifestJson: manifest,
        configJson: config,
        tokensSchemaJson,
        filesSummary: files,
        importedAt: new Date().toISOString(),
      })

      setDesigns(getCatalogDesignPresets())
      setImportReport({
        name: design.name,
        status,
        files,
        missingFields: supports.missingFields,
        rootPath,
        warnings,
      })
      setPackMessage(
        supports.missingFields.length
          ? 'Pacote importado como rascunho. Revise os campos ausentes antes de publicar.'
          : 'Pacote importado como rascunho e pronto para teste.',
      )
    } catch (error) {
      setPackMessage(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel importar o Design Pack.',
      )
      setImportReport(null)
    }
  }

  function handlePublishDesign(designId: string) {
    updateCatalogDesignPresetStatus(designId, 'Publicado')
    setDesigns(getCatalogDesignPresets())
  }

  return (
    <main className="min-h-screen bg-[#f6f7f2]">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Brand />
          <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            Painel dev - porta 5174
          </span>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Dev/admin
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">
              Empresas, representantes, pagamentos e Design Packs
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              O dev acompanha operacao, logs e pagamentos, importa pacotes de
              design e publica templates validados para as empresas.
            </p>
          </div>
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">
            <Upload size={18} aria-hidden="true" />
            Importar Design Pack
            <input
              accept=".zip,application/zip"
              className="sr-only"
              onChange={(event) =>
                void handleDesignPackUpload(event.target.files?.[0] ?? null)
              }
              type="file"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminMetrics.map(([label, value, Icon, tone]) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              key={label}
            >
              <Icon className={tone} size={22} aria-hidden="true" />
              <p className="mt-4 text-sm text-slate-500">{label}</p>
              <strong className="mt-1 block text-2xl text-slate-950">
                {value}
              </strong>
            </article>
          ))}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
          <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-950">
                    Empresas cadastradas
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Acesso ao painel depende de pagamento confirmado via Stripe
                    ou liberacao manual.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    className="h-9 w-56 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                    onChange={(event) => setManualCompanyName(event.target.value)}
                    placeholder="Empresa via WhatsApp"
                    value={manualCompanyName}
                  />
                  <button
                    className="grid size-9 place-items-center rounded-md bg-teal-700 text-white"
                    title="Criar empresa manual"
                    type="button"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                <div className="grid grid-cols-[1.2fr_1fr_160px_130px] bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <span>Empresa</span>
                  <span>CNPJ</span>
                  <span>Pagamento</span>
                  <span>Catalogos</span>
                </div>
                {companies.map((company) => (
                  <div
                    className="grid grid-cols-[1.2fr_1fr_160px_130px] border-t border-slate-100 px-3 py-3 text-sm"
                    key={company.id}
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {company.tradeName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {company.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {company.legalName}
                      </p>
                    </div>
                    <span className="text-slate-600">{company.cnpj}</span>
                    <span>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          company.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : company.paymentStatus === 'manual_active'
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {company.paymentStatus}
                      </span>
                    </span>
                    <span className="text-slate-600">
                      {getCompanyCatalogCount(company.id)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-950">
                Representantes cadastrados
              </h2>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {representatives.map((representative) => {
                  const entityId = representative.firmId ?? representative.id
                  const entityType = representative.firmId
                    ? 'representation_firm'
                    : 'autonomous'
                  const linkedCompanies = links
                    .filter(
                      (link) =>
                        link.representativeId === entityId &&
                        link.representativeType === entityType &&
                        link.status === 'active',
                    )
                    .map((link) =>
                      companies.find((company) => company.id === link.companyId),
                    )
                    .filter(Boolean)

                  return (
                    <article
                      className="rounded-lg border border-slate-200 p-3"
                      key={representative.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-950">
                            {representative.fullName}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {representative.email}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            CPF {representative.cpf}
                          </p>
                        </div>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                          {linkedCompanies.length} empresas
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">
                        Vinculos:{' '}
                        {linkedCompanies.length
                          ? linkedCompanies
                              .map((company) => company?.tradeName)
                              .join(', ')
                          : 'nenhum'}
                      </p>
                    </article>
                  )
                })}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-950">
                Templates importados
              </h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {designs.map((design) => {
                  const missingFields = productDisplayFields.filter(
                    (field) => !design.supportsFields[field.key],
                  )

                  return (
                    <article
                      className="rounded-lg border border-slate-200 p-3"
                      key={design.id}
                    >
                      <DesignPreview design={design} />
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-950">
                            {design.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {design.sourceType === 'design_pack'
                              ? 'Design Pack importado'
                              : 'Template manual'}
                          </p>
                        </div>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            design.status === 'Publicado'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {design.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {missingFields.length
                          ? `Campos pendentes: ${missingFields
                              .map((field) => field.label)
                              .join(', ')}`
                          : 'Suporta todos os campos principais.'}
                      </p>
                      {design.status === 'Rascunho' && !missingFields.length ? (
                        <button
                          className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-teal-700 px-3 text-sm font-semibold text-white hover:bg-teal-800"
                          onClick={() => handlePublishDesign(design.id)}
                          type="button"
                        >
                          <CheckCircle2 size={16} aria-hidden="true" />
                          Publicar
                        </button>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <Upload className="text-teal-700" size={22} aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-slate-950">
                Importar Design Pack
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                O pacote deve conter manifest.json, template.config.json,
                design-tokens.schema.json, preview, CSS e SVGs. JavaScript livre
                fica fora do fluxo.
              </p>
              <label className="mt-4 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700">
                <Upload size={18} aria-hidden="true" />
                Selecionar .zip
                <input
                  accept=".zip,application/zip"
                  className="sr-only"
                  onChange={(event) =>
                    void handleDesignPackUpload(event.target.files?.[0] ?? null)
                  }
                  type="file"
                />
              </label>
              {packMessage ? (
                <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                  {packMessage}
                </p>
              ) : null}
              {importReport ? (
                <div className="mt-3 rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-slate-950">
                    {importReport.name}
                  </p>
                  <p className="mt-1 text-slate-500">
                    {importReport.files.length} arquivos encontrados
                  </p>
                  {importReport.rootPath ? (
                    <p className="mt-1 text-slate-500">
                      Pasta raiz: {importReport.rootPath.replace(/\/$/, '')}
                    </p>
                  ) : null}
                  <p className="mt-1 text-slate-500">
                    Status inicial: {importReport.status}
                  </p>
                  {importReport.warnings.length ? (
                    <div className="mt-2 space-y-1 text-slate-500">
                      {importReport.warnings.map((warning) => (
                        <p key={warning}>{warning}</p>
                      ))}
                    </div>
                  ) : null}
                  {importReport.missingFields.length ? (
                    <p className="mt-2 text-amber-700">
                      Faltam campos: {importReport.missingFields.join(', ')}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <CreditCard className="text-teal-700" size={22} aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-slate-950">
                Pre-conexao Stripe
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Compra do plano, webhook confirma pagamento pelo CNPJ e a
                empresa ganha acesso. Vendas por WhatsApp entram por liberacao
                manual.
              </p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-950">Atividade recente</h2>
              <div className="mt-4 divide-y divide-slate-100">
                {devEvents.map((event) => (
                  <p className="py-3 text-sm leading-6 text-slate-600" key={event}>
                    {event}
                  </p>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle
                className="text-amber-700"
                size={22}
                aria-hidden="true"
              />
              <h2 className="mt-4 font-semibold text-amber-950">Logs de erro</h2>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Falhas de upload, API lenta e problemas no catalogo publico
                aparecem aqui para o dev agir antes do cliente reclamar.
              </p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <Building2 className="text-sky-700" size={22} aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-slate-950">
                Cadastro manual
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                O formulario ja esta posicionado para criar empresas manualmente
                quando a venda vier pelo WhatsApp.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
