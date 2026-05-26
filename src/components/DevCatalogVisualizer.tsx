import { ExternalLink, Eye, FileText } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  devCatalogCollections,
  devCatalogPreviewProducts,
} from '../data/devCatalogPreview'
import {
  defaultProductDisplayOptions,
  productDisplayFields,
  type CatalogDesignPreset,
  type Product,
  type ProductDisplayOptions,
} from '../data/mock'
import {
  AuroraRenderer,
  isAuroraDesign,
  type CatalogCoverContent,
} from '../catalog-designs/aurora'
import {
  BrownBeigeRenderer,
  isBrownBeigeDesign,
} from '../catalog-designs/brown-beige'

type DevCatalogVisualizerProps = {
  designs: CatalogDesignPreset[]
  selectedDesignId: string
  onSelectDesign: (designId: string) => void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function clampProductsPerPage(value: number) {
  return Math.max(1, Math.min(8, value))
}

function readNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
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

function getVisibleProductInfo(
  product: Product,
  displayOptions: ProductDisplayOptions,
) {
  return [
    displayOptions.showEan && product.ean ? ['EAN', product.ean] : null,
    displayOptions.showMeasurements && product.measurements
      ? ['Medidas', product.measurements]
      : null,
    displayOptions.showWeight && product.weight ? ['Peso', product.weight] : null,
    displayOptions.showMasterBox && product.masterBox
      ? ['Master', product.masterBox]
      : null,
    displayOptions.showMinimumOrder && product.minimumOrder
      ? ['Pedido', product.minimumOrder]
      : null,
    displayOptions.showStock && product.stock ? ['Estoque', product.stock] : null,
  ].filter((item): item is [string, string] => Boolean(item))
}

function chunkProducts(products: Product[], size: number) {
  const chunks: Product[][] = []

  for (let index = 0; index < products.length; index += size) {
    chunks.push(products.slice(index, index + size))
  }

  return chunks
}

function buildRenderPath(designId: string, displayOptions: ProductDisplayOptions) {
  const hiddenFields = productDisplayFields
    .filter((field) => !displayOptions[field.key])
    .map((field) => field.key)

  return `/dev/render/${designId}${
    hiddenFields.length ? `?hide=${hiddenFields.join(',')}` : ''
  }`
}

export function DevCatalogVisualizer({
  designs,
  selectedDesignId,
  onSelectDesign,
}: DevCatalogVisualizerProps) {
  const selectedDesign =
    designs.find((design) => design.id === selectedDesignId) ?? designs[0]
  const [displayOptions, setDisplayOptions] = useState<ProductDisplayOptions>(
    defaultProductDisplayOptions,
  )

  if (!selectedDesign) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-950">
          Visualizador de catalogo
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Importe ou publique um design para renderizar o catalogo de teste.
        </p>
      </section>
    )
  }

  const productLimit = getDesignPreviewLimit(selectedDesign)
  const renderPath = buildRenderPath(selectedDesign.id, displayOptions)

  function toggleDisplayOption(key: keyof ProductDisplayOptions, value: boolean) {
    setDisplayOptions((current) => ({ ...current, [key]: value }))
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-teal-700">
            <Eye size={18} aria-hidden="true" />
            Renderizador de catalogo
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Escolha o modelo e renderize
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            O painel dev escolhe o template. A renderizacao abre em uma pagina
            limpa, no formato do catalogo, usando os produtos de teste.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            className="h-10 min-w-56 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
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
            {productLimit} por pagina
          </span>
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            to={renderPath}
          >
            <ExternalLink size={17} aria-hidden="true" />
            Renderizar modelo
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr]">
        <img
          alt={selectedDesign.name}
          className="aspect-[4/3] w-full rounded-lg border border-slate-200 bg-white object-cover"
          height="240"
          loading="lazy"
          src={selectedDesign.previewImage}
          width="320"
        />
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <h3 className="font-semibold text-slate-950">{selectedDesign.name}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {selectedDesign.description}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText size={16} aria-hidden="true" />
            Dados usados na renderizacao
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {devCatalogCollections.slice(0, 6).map((collection) => (
              <div
                className="rounded-md bg-white px-3 py-2 text-sm text-slate-600"
                key={collection.id}
              >
                <p className="truncate font-semibold text-slate-800">
                  {collection.name}
                </p>
                <p className="mt-1 truncate text-xs">
                  {collection.products.length} produtos, 3 imagens por produto
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Total: {devCatalogCollections.length} colecoes,{' '}
            {devCatalogPreviewProducts.length} produtos.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-950">
          Campos visiveis na renderizacao
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {productDisplayFields.map((field) => (
            <label
              className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              key={field.key}
            >
              <span>{field.label}</span>
              <input
                checked={displayOptions[field.key]}
                className="size-4 accent-teal-700"
                onChange={(event) =>
                  toggleDisplayOption(field.key, event.target.checked)
                }
                type="checkbox"
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}

export function DevCatalogRenderDocument({
  design,
  displayOptions,
  companyLogoUrl,
  companyName = 'Empresa',
  coverContent,
}: {
  design: CatalogDesignPreset
  displayOptions?: ProductDisplayOptions
  companyLogoUrl?: string
  companyName?: string
  coverContent?: CatalogCoverContent
}) {
  const productLimit = getDesignPreviewLimit(design)
  const resolvedDisplayOptions =
    displayOptions ?? design.defaultDisplayOptions ?? defaultProductDisplayOptions

  if (isAuroraDesign(design)) {
    return (
      <AuroraRenderer
        companyLogoUrl={companyLogoUrl}
        companyName={companyName}
        coverContent={coverContent}
        design={design}
        displayOptions={resolvedDisplayOptions}
        productLimit={productLimit}
      />
    )
  }

  if (isBrownBeigeDesign(design)) {
    return (
      <BrownBeigeRenderer
        companyLogoUrl={companyLogoUrl}
        companyName={companyName}
        coverContent={coverContent}
        design={design}
        displayOptions={resolvedDisplayOptions}
        productLimit={productLimit}
      />
    )
  }

  return (
    <GenericCatalogDocument
      design={design}
      displayOptions={resolvedDisplayOptions}
      productLimit={productLimit}
    />
  )
}

function GenericCatalogDocument({
  design,
  displayOptions,
  productLimit,
}: {
  design: CatalogDesignPreset
  displayOptions: ProductDisplayOptions
  productLimit: number
}) {
  const gridClass = productLimit <= 4 ? 'grid-cols-2 gap-6' : 'grid-cols-3 gap-4'

  return (
    <div className="space-y-8 print:space-y-0">
      {devCatalogCollections.flatMap((collection) =>
        chunkProducts(collection.products, productLimit).map((products, pageIndex) => (
          <div className="mx-auto w-full max-w-[794px] print:max-w-none" key={`${collection.id}-${pageIndex}`}>
            <div
              className="relative aspect-[794/1123] overflow-hidden p-[6%] shadow-2xl print:shadow-none"
              style={{
                backgroundColor: design.backgroundColor,
                color: design.textColor,
              }}
            >
              <div
                className="absolute left-0 right-0 top-0 h-[16%]"
                style={{ backgroundColor: design.primaryColor }}
              />
              <div className="relative z-10 flex h-full flex-col">
                <header className="text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
                    Catalogo demonstrativo
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold">
                    {collection.name}
                  </h1>
                </header>
                <div className={`mt-[8%] grid ${gridClass}`}>
                  {products.map((product) => {
              const productInfo = getVisibleProductInfo(product, displayOptions)

              return (
                <article
                  className="flex min-h-[330px] flex-col overflow-hidden rounded-lg border border-slate-200 shadow-sm"
                  key={product.id}
                  style={{ backgroundColor: design.surfaceColor }}
                >
                  {displayOptions.showProductImage ? (
                    <img
                      alt={product.title}
                      className="aspect-square w-full bg-slate-100 object-cover"
                      height="320"
                      loading="lazy"
                      src={product.image}
                      width="320"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    {displayOptions.showProductName ? (
                      <h2 className="text-sm font-semibold text-slate-950">
                        {product.title}
                      </h2>
                    ) : null}
                    <dl className="grid gap-1 text-[10px] text-slate-600">
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
                    {displayOptions.showPrice ? (
                      <strong
                        className="mt-auto text-base"
                        style={{ color: design.primaryColor }}
                      >
                        {product.price}
                      </strong>
                    ) : null}
                  </div>
                </article>
              )
                  })}
                </div>
              </div>
            </div>
          </div>
        )),
      )}
    </div>
  )
}
