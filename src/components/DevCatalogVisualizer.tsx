import { Eye, FileText } from 'lucide-react'
import type { ReactNode } from 'react'
import { devCatalogPreviewProducts } from '../data/devCatalogPreview'
import {
  defaultProductDisplayOptions,
  type CatalogDesignPreset,
  type Product,
  type ProductDisplayOptions,
} from '../data/mock'

type DevCatalogVisualizerProps = {
  designs: CatalogDesignPreset[]
  selectedDesignId: string
  onSelectDesign: (designId: string) => void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function clampProductsPerPage(value: number) {
  return Math.max(1, Math.min(6, value))
}

function readNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function readConfigToken(
  design: CatalogDesignPreset,
  key: string,
  fallback: string,
) {
  const config = isRecord(design.configJson) ? design.configJson : {}
  const tokens = isRecord(config.defaultTokens) ? config.defaultTokens : {}

  return readString(tokens[key], fallback)
}

function getDesignPreviewLimit(design: CatalogDesignPreset) {
  const config = isRecord(design.configJson) ? design.configJson : {}
  const pages = isRecord(config.pages) ? config.pages : {}
  const productGrid = isRecord(pages.productGrid) ? pages.productGrid : {}
  const rules = isRecord(config.rules) ? config.rules : {}
  const directValue =
    readNumber(productGrid.defaultProductsPerPage) ??
    readNumber(rules.productsPerPage)

  if (directValue) return clampProductsPerPage(directValue)

  if (/vitrine|editorial|premium|presente/i.test(design.name)) return 4

  return 6
}

function isAuroraDesign(design: CatalogDesignPreset) {
  const config = isRecord(design.configJson) ? design.configJson : {}

  return (
    design.templateId === 'aurora_editorial_01' ||
    readString(config.componentKey, '') === 'AuroraEditorialCatalog' ||
    /aurora editorial/i.test(design.name)
  )
}

function getVisibleProductInfo(
  product: Product,
  displayOptions: ProductDisplayOptions,
) {
  return [
    displayOptions.showSku && product.sku ? ['SKU', product.sku] : null,
    displayOptions.showInternalCode && product.internalCode
      ? ['Codigo', product.internalCode]
      : null,
    displayOptions.showEan && product.ean ? ['EAN', product.ean] : null,
    displayOptions.showNcm && product.ncm ? ['NCM', product.ncm] : null,
    displayOptions.showMeasurements && product.measurements
      ? ['Medidas', product.measurements]
      : null,
    displayOptions.showMasterBox && product.masterBox
      ? ['Caixa master', product.masterBox]
      : null,
    displayOptions.showMinimumOrder && product.minimumOrder
      ? ['Pedido minimo', product.minimumOrder]
      : null,
    displayOptions.showStock && product.stock ? ['Estoque', product.stock] : null,
  ].filter((item): item is [string, string] => Boolean(item))
}

export function DevCatalogVisualizer({
  designs,
  selectedDesignId,
  onSelectDesign,
}: DevCatalogVisualizerProps) {
  const selectedDesign =
    designs.find((design) => design.id === selectedDesignId) ?? designs[0]

  if (!selectedDesign) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-950">
          Visualizador de catalogo
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Importe ou publique um design para visualizar o catalogo de teste.
        </p>
      </section>
    )
  }

  const productLimit = getDesignPreviewLimit(selectedDesign)
  const products = devCatalogPreviewProducts.slice(0, productLimit)
  const displayOptions =
    selectedDesign.defaultDisplayOptions ?? defaultProductDisplayOptions
  const catalogPreview = isAuroraDesign(selectedDesign) ? (
    <AuroraEditorialPreview
      design={selectedDesign}
      displayOptions={displayOptions}
      products={products}
      productLimit={productLimit}
    />
  ) : (
    <GenericCatalogPreview
      design={selectedDesign}
      displayOptions={displayOptions}
      products={products}
      productLimit={productLimit}
    />
  )

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-teal-700">
            <Eye size={18} aria-hidden="true" />
            Visualizador de catalogo
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Preview com produtos de teste
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            A pagina usa as imagens da pasta Imagens teste e os dados das fichas
            tecnicas criadas para simular um catalogo real.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
            onChange={(event) => onSelectDesign(event.target.value)}
            value={selectedDesign.id}
          >
            {designs.map((design) => (
              <option key={design.id} value={design.id}>
                {design.name}
              </option>
            ))}
          </select>
          <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
            {productLimit} produtos
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <img
            alt={selectedDesign.name}
            className="aspect-[4/3] w-full rounded-md bg-white object-cover"
            height="240"
            loading="lazy"
            src={selectedDesign.previewImage}
            width="320"
          />
          <h3 className="mt-3 font-semibold text-slate-950">
            {selectedDesign.name}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {selectedDesign.description}
          </p>
          <div className="mt-3 rounded-md bg-white p-3 text-sm text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <FileText size={16} aria-hidden="true" />
              Fichas usadas
            </div>
            <div className="mt-2 space-y-1">
              {products.map((product) => (
                <p className="truncate" key={product.id}>
                  {product.sourceFichaPath}
                </p>
              ))}
            </div>
          </div>
        </aside>

        {catalogPreview}
      </div>
    </section>
  )
}

type CatalogPreviewRendererProps = {
  design: CatalogDesignPreset
  products: Product[]
  productLimit: number
  displayOptions: ProductDisplayOptions
}

function AuroraEditorialPreview({
  design,
  displayOptions,
  products,
  productLimit,
}: CatalogPreviewRendererProps) {
  const primary = readConfigToken(design, 'primaryColor', design.primaryColor)
  const secondary = readConfigToken(design, 'secondaryColor', '#0B3B57')
  const background = readConfigToken(
    design,
    'backgroundColor',
    design.backgroundColor,
  )
  const paper = readConfigToken(design, 'paperColor', '#F7F1E8')
  const priceColor = readConfigToken(design, 'priceColor', '#0EA5E9')
  const isSix = productLimit === 6

  return (
    <div className="rounded-lg border border-slate-200 bg-neutral-200 p-4">
      <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
          Aurora Editorial 01
        </p>
        <h3 className="mt-1 text-2xl font-black text-slate-950">
          Preview do design importado
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Capa e pagina de produtos seguem o modelo Aurora salvo no Design Pack.
        </p>
      </div>

      <div className="grid gap-4 2xl:grid-cols-2">
        <AuroraPage
          background={background}
          paper={paper}
          primary={primary}
          secondary={secondary}
        >
          <div className="absolute right-[10%] top-0 z-20">
            <AuroraRibbon color={primary} label="AURORA" />
          </div>
          <div className="absolute left-[9%] top-[8%] z-10 h-[35%] w-[34%] rounded-[8%] border-[18px] border-white bg-white shadow-2xl">
            <div className="h-[72%] rounded-[8%] bg-[#cfe2df]">
              <div className="mx-auto translate-y-[25%] rounded-full bg-[#96c7bf] opacity-70 [aspect-ratio:1] w-[58%]" />
            </div>
          </div>
          <div
            className="absolute left-[9%] top-[54%] z-10 text-[clamp(42px,7vw,76px)] font-black leading-[0.88] tracking-[-0.06em]"
            style={{ color: secondary }}
          >
            Aurora
            <br />
            Editorial
          </div>
          <div
            className="absolute left-[9%] top-[69%] z-10 grid h-9 w-[38%] place-items-center rounded-full text-sm font-black uppercase tracking-wide text-white"
            style={{ backgroundColor: primary }}
          >
            Catalogo B2B
          </div>
          <div className="absolute bottom-[15%] right-[11%] z-10 h-[30%] w-[34%] rounded-[9%] bg-white p-[4%] shadow-2xl">
            <div className="h-[45%] rounded-[8%] bg-[#f2ebdf]" />
            <div className="mt-[13%] h-5 w-[68%] rounded-full bg-slate-800" />
            <div
              className="mt-[8%] grid h-10 w-[78%] place-items-center rounded-full text-2xl font-black"
              style={{ backgroundColor: `${priceColor}22`, color: priceColor }}
            >
              R$ 00,00
            </div>
          </div>
        </AuroraPage>

        <AuroraPage
          background={background}
          paper={paper}
          primary={primary}
          secondary={secondary}
        >
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
            <AuroraRibbon color={primary} label="DECOR" />
          </div>
          <div className="absolute left-[6%] right-[6%] top-[13%] z-10 flex items-center justify-between">
            <div
              className="rounded-full bg-white px-5 py-2 text-sm font-black shadow-md"
              style={{ color: primary }}
            >
              Casa & Decor
            </div>
            <div className="rounded-full bg-white/80 px-5 py-2 text-xs font-black uppercase tracking-wide text-black/45">
              Grade de produtos
            </div>
          </div>
          <div
            className={`absolute left-[5%] right-[5%] top-[20%] z-10 grid ${
              isSix ? 'grid-cols-3 gap-3' : 'grid-cols-2 gap-5'
            }`}
          >
            {products.map((product, index) => (
              <AuroraProductCard
                compact={isSix}
                displayOptions={displayOptions}
                index={index}
                key={product.id}
                priceColor={priceColor}
                primary={primary}
                product={product}
              />
            ))}
          </div>
          <AuroraFooter primary={primary} secondary={secondary} />
        </AuroraPage>
      </div>
    </div>
  )
}

type AuroraPageProps = {
  children: ReactNode
  background: string
  paper: string
  primary: string
  secondary: string
}

function AuroraPage({
  children,
  background,
  paper,
  primary,
  secondary,
}: AuroraPageProps) {
  return (
    <div className="mx-auto w-full max-w-[794px]">
      <div
        className="relative aspect-[794/1123] overflow-hidden rounded-lg shadow-2xl"
        style={{ backgroundColor: background }}
      >
        <div
          className="absolute -left-[10%] top-[3%] h-[22%] w-[120%] -rotate-6 rounded-[50%]"
          style={{ backgroundColor: paper }}
        />
        <div
          className="absolute -left-[14%] top-[39%] h-[20%] w-[120%] -rotate-[11deg] rounded-[50%] bg-white/45"
        />
        <div
          className="absolute -left-[9%] bottom-[12%] h-[25%] w-[116%] rotate-[8deg] rounded-[50%]"
          style={{ backgroundColor: paper, opacity: 0.7 }}
        />
        <div
          className="absolute -left-[12%] top-[2%] h-[24%] w-[34%] rounded-full opacity-10"
          style={{ backgroundColor: primary }}
        />
        <div
          className="absolute -right-[18%] top-[10%] h-[30%] w-[52%] rounded-full opacity-10"
          style={{ backgroundColor: secondary }}
        />
        <AuroraFooter primary={primary} secondary={secondary} />
        {children}
      </div>
    </div>
  )
}

function AuroraRibbon({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="relative grid h-36 w-28 place-items-center rounded-b-full text-white shadow-lg"
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-white/20" />
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 rounded-full bg-white/15" />
        <span className="max-w-[90px] text-center text-[11px] font-black uppercase tracking-[0.24em]">
          {label}
        </span>
      </div>
    </div>
  )
}

function AuroraFooter({
  primary,
  secondary,
}: {
  primary: string
  secondary: string
}) {
  return (
    <svg
      className="absolute bottom-0 left-0 z-0 h-[12%] w-full"
      preserveAspectRatio="none"
      viewBox="0 0 794 132"
    >
      <path
        d="M0 54 C160 10 276 86 418 42 C565 -5 650 48 794 6 L794 132 L0 132 Z"
        fill={secondary}
      />
      <path
        d="M0 82 C170 34 282 100 430 70 C585 38 682 88 794 45 L794 132 L0 132 Z"
        fill={primary}
        opacity="0.92"
      />
    </svg>
  )
}

type AuroraProductCardProps = {
  product: Product
  displayOptions: ProductDisplayOptions
  primary: string
  priceColor: string
  compact: boolean
  index: number
}

function AuroraProductCard({
  product,
  displayOptions,
  primary,
  priceColor,
  compact,
  index,
}: AuroraProductCardProps) {
  const productInfo = getVisibleProductInfo(product, displayOptions)
  const discount = index === 1 ? '30%' : index === 3 ? '15%' : ''

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white p-3 text-center shadow-xl ring-1 ring-black/5">
      <div
        className="absolute -left-10 -top-10 h-24 w-24 rounded-full opacity-10"
        style={{ backgroundColor: primary }}
      />
      <div
        className={`relative overflow-hidden rounded-3xl bg-slate-100 ${
          compact ? 'h-28' : 'h-40'
        }`}
      >
        {displayOptions.showProductImage ? (
          <img
            alt={product.title}
            className="h-full w-full object-cover"
            height="280"
            loading="lazy"
            src={product.image}
            width="280"
          />
        ) : null}
        {displayOptions.showSku ? (
          <div
            className="absolute bottom-2 right-2 rounded-xl px-2 py-1 text-xs font-black leading-none text-white shadow-lg"
            style={{ backgroundColor: primary }}
          >
            {product.sku}
          </div>
        ) : null}
        {discount ? (
          <div className="absolute right-2 top-2 grid h-10 w-10 -rotate-12 place-items-center rounded-full border-2 border-dashed border-white bg-red-600 text-[11px] font-black text-white shadow-lg">
            {discount}
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        {displayOptions.showProductName ? (
          <h4
            className={`mx-auto max-w-[94%] font-black uppercase leading-tight ${
              compact ? 'min-h-[30px] text-[10px]' : 'min-h-[38px] text-sm'
            }`}
          >
            {product.title}
          </h4>
        ) : null}
        <div className="mx-auto my-2 h-px w-24 bg-black/20" />
        {displayOptions.showPrice ? (
          <div
            className={`mx-auto rounded-2xl bg-white px-4 py-2 text-center font-black leading-none shadow-sm ${
              compact ? 'text-xl' : 'text-3xl'
            }`}
            style={{ color: priceColor }}
          >
            {product.price}
          </div>
        ) : null}
        {displayOptions.showVariations ? (
          <div className="mt-2 flex justify-center gap-1.5">
            {['#0F766E', '#D8C7AA', '#E7E5E4'].map((color) => (
              <span
                className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                key={`${product.id}-${color}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ) : null}
        {displayOptions.showDescription ? (
          <p
            className={`mt-2 line-clamp-2 font-medium leading-tight text-black/65 ${
              compact ? 'text-[7px]' : 'text-[9px]'
            }`}
          >
            {product.description}
          </p>
        ) : null}
        <dl
          className={`mt-auto grid grid-cols-2 pt-2 text-left ${
            compact ? 'gap-x-2 gap-y-0.5 text-[7px]' : 'gap-x-3 gap-y-1 text-[8px]'
          }`}
        >
          {productInfo.slice(0, compact ? 6 : 8).map(([label, value]) => (
            <div className="flex min-w-0 gap-1 leading-tight" key={label}>
              <dt className="shrink-0 font-black uppercase text-black/55">
                {label}:
              </dt>
              <dd className="min-w-0 truncate text-black/75">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}

function GenericCatalogPreview({
  design,
  displayOptions,
  products,
  productLimit,
}: CatalogPreviewRendererProps) {
  const gridClass = productLimit <= 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'

  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-200"
      style={{
        backgroundColor: design.backgroundColor,
        color: design.textColor,
      }}
    >
      <div
        className="p-5 text-white"
        style={{ backgroundColor: design.primaryColor }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
          Catalogo demonstrativo
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Colecao Casa 2026</h3>
            <p className="mt-1 text-sm opacity-85">
              Linha de teste com imagens reais do projeto
            </p>
          </div>
          <span
            className="w-fit rounded-md px-3 py-2 text-sm font-semibold"
            style={{
              backgroundColor: design.accentColor,
              color: '#ffffff',
            }}
          >
            Pagina produto
          </span>
        </div>
      </div>

      <div className={`grid gap-3 p-4 ${gridClass}`}>
        {products.map((product) => {
          const productInfo = getVisibleProductInfo(product, displayOptions)

          return (
            <article
              className="flex min-h-[360px] flex-col overflow-hidden rounded-lg border border-slate-200 shadow-sm"
              key={product.id}
              style={{ backgroundColor: design.surfaceColor }}
            >
              {displayOptions.showProductImage ? (
                <img
                  alt={product.title}
                  className="aspect-square w-full bg-slate-100 object-cover"
                  height="360"
                  loading="lazy"
                  src={product.image}
                  width="360"
                />
              ) : null}
              <div className="flex flex-1 flex-col gap-3 p-3">
                {displayOptions.showProductName ? (
                  <h4 className="text-sm font-semibold text-slate-950">
                    {product.title}
                  </h4>
                ) : null}
                <p className="text-xs font-semibold text-slate-500">
                  {product.category}
                </p>
                <dl className="grid gap-1 text-xs text-slate-600">
                  {productInfo.slice(0, productLimit <= 4 ? 6 : 4).map(
                    ([label, value]) => (
                      <div
                        className="flex justify-between gap-2 rounded-md bg-slate-50 px-2 py-1"
                        key={`${product.id}-${label}`}
                      >
                        <dt className="font-semibold">{label}</dt>
                        <dd className="text-right">{value}</dd>
                      </div>
                    ),
                  )}
                </dl>
                {displayOptions.showDescription ? (
                  <p className="line-clamp-3 text-xs leading-5 text-slate-500">
                    {product.description}
                  </p>
                ) : null}
                <div className="mt-auto flex items-center justify-between gap-3">
                  {displayOptions.showPrice ? (
                    <strong
                      className="text-base"
                      style={{ color: design.primaryColor }}
                    >
                      {product.price}
                    </strong>
                  ) : (
                    <span />
                  )}
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    {product.status}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
