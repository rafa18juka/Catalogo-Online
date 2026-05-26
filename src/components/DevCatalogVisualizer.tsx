import { ExternalLink, Eye, FileText } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  devCatalogCollections,
  devCatalogPreviewProducts,
  type DevCatalogCollection,
} from '../data/devCatalogPreview'
import {
  defaultProductDisplayOptions,
  catalogCoverPresets,
  productDisplayFields,
  type CatalogDesignPreset,
  type Product,
  type ProductDisplayOptions,
} from '../data/mock'

type DevCatalogVisualizerProps = {
  designs: CatalogDesignPreset[]
  selectedDesignId: string
  onSelectDesign: (designId: string) => void
}

type CatalogPreviewRendererProps = {
  design: CatalogDesignPreset
  products: Product[]
  productLimit: number
  displayOptions: ProductDisplayOptions
  companyLogoUrl?: string
  companyName?: string
  coverContent?: CatalogCoverContent
}

type CatalogCoverContent = {
  title: string
  description: string
}

type CategoryBadgeSize = 'large' | 'compact'

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

function ProductColorDots({
  product,
  size = 'normal',
}: {
  product: Product
  size?: 'small' | 'normal'
}) {
  if (!product.colors?.length) return null

  return (
    <div className="flex justify-center gap-1.5">
      {product.colors.map((color) => (
        <span
          className={`rounded-full border border-black/10 shadow-sm ${
            size === 'small' ? 'size-3' : 'size-4'
          }`}
          key={`${product.id}-${color}`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  )
}

function splitCoverTitle(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean)
  const [firstWord = catalogCoverPresets[0].title, ...restWords] = words

  return {
    primary: firstWord.toLowerCase(),
    secondary: restWords.join(' ').toLowerCase(),
  }
}

function getCategoryBadgeLines(name: string, maxLines: number) {
  const words = name
    .replace(/&/g, ' & ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    if (word === '&') {
      if (currentLine) lines.push(currentLine)
      lines.push('&')
      currentLine = ''
      return
    }

    if (!currentLine) {
      currentLine = word
      return
    }

    if (`${currentLine} ${word}`.length <= 12) {
      currentLine = `${currentLine} ${word}`
      return
    }

    lines.push(currentLine)
    currentLine = word
  })

  if (currentLine) lines.push(currentLine)

  while (lines.length > maxLines) {
    let mergeIndex = 0
    let shortestMerge = Infinity

    for (let index = 0; index < lines.length - 1; index += 1) {
      const mergedLength = `${lines[index]} ${lines[index + 1]}`.length

      if (mergedLength < shortestMerge) {
        shortestMerge = mergedLength
        mergeIndex = index
      }
    }

    lines.splice(mergeIndex, 2, `${lines[mergeIndex]} ${lines[mergeIndex + 1]}`)
  }

  return lines.map((line) => line.toUpperCase())
}

function getCategoryBadgeFontSize(lines: string[], isLarge: boolean) {
  const longestLineLength = Math.max(...lines.map((line) => line.length), 1)
  const maxTextWidth = isLarge ? 116 : 88
  const maxTextHeight = isLarge ? 126 : 92
  const maxFontFromWidth = maxTextWidth / (longestLineLength * 0.68)
  const maxFontFromHeight = maxTextHeight / (lines.length * 0.92)
  const maxFont = isLarge ? 32 : 24

  return Math.min(maxFont, maxFontFromWidth, maxFontFromHeight)
}

function getCollectionAnchorId(collectionId: string) {
  return `colecao-${collectionId}`
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
  coverContent = catalogCoverPresets[0],
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
      <AuroraCatalogDocument
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

function AuroraCatalogDocument({
  companyLogoUrl,
  companyName,
  coverContent,
  design,
  displayOptions,
  productLimit,
}: Omit<CatalogPreviewRendererProps, 'products'>) {
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
    <div className="space-y-8 print:space-y-0">
      <AuroraCoverPage
        background={background}
        companyLogoUrl={companyLogoUrl}
        companyName={companyName}
        coverContent={coverContent}
        paper={paper}
        primary={primary}
        secondary={secondary}
      />
      <AuroraSummaryPage
        background={background}
        paper={paper}
        primary={primary}
        secondary={secondary}
      />
      {devCatalogCollections.flatMap((collection, collectionIndex) => [
        <AuroraCollectionIntroPage
          background={background}
          collection={collection}
          collectionIndex={collectionIndex}
          displayOptions={displayOptions}
          key={`${collection.id}-intro`}
          paper={paper}
          priceColor={priceColor}
          primary={primary}
          secondary={secondary}
        />,
        ...chunkProducts(collection.products, productLimit).map(
          (products, pageIndex) => (
            <AuroraProductGridPage
              background={background}
              collection={collection}
              displayOptions={displayOptions}
              isSix={isSix}
              key={`${collection.id}-grid-${pageIndex}`}
              pageIndex={pageIndex}
              paper={paper}
              priceColor={priceColor}
              primary={primary}
              products={products}
              secondary={secondary}
            />
          ),
        ),
      ])}
    </div>
  )
}

function AuroraCoverPage({
  background,
  companyLogoUrl,
  companyName,
  coverContent,
  paper,
  primary,
  secondary,
}: {
  background: string
  companyLogoUrl?: string
  companyName?: string
  coverContent?: CatalogCoverContent
  paper: string
  primary: string
  secondary: string
}) {
  const coverImages = [
    {
      alt: 'Capim dos pampas Aurora',
      src: '/test-products/capim-dos-pampas-capa.png',
    },
    {
      alt: 'Arara decorativa Aurora',
      src: '/test-products/arara-capa.png',
    },
    {
      alt: 'Kit esponja e pano Aurora',
      src: '/test-products/kit-esponja-pano-capa.jpeg',
    },
  ]
  const coverTitle = splitCoverTitle(
    coverContent?.title ?? catalogCoverPresets[0].title,
  )
  const coverDescription =
    coverContent?.description ?? catalogCoverPresets[0].description

  return (
    <AuroraPage
      background={background}
      paper={paper}
      primary={primary}
      secondary={secondary}
    >
      <div className="absolute right-[7%] top-0 z-30">
        <AuroraRibbon
          color={primary}
          label={companyName ?? 'Empresa'}
          logoUrl={companyLogoUrl}
        />
      </div>

      <figure
        className="absolute left-[5%] top-[4%] z-10 h-[60%] w-[43%] overflow-hidden bg-white shadow-2xl"
        style={{ border: `8px solid ${secondary}` }}
      >
        <img
          alt={coverImages[0].alt}
          className="h-full w-full scale-110 object-cover"
          src={coverImages[0].src}
        />
      </figure>

      <figure
        className="absolute right-[5%] top-[7%] z-10 h-[40%] w-[43%] overflow-hidden bg-white shadow-2xl"
        style={{ border: `8px solid ${secondary}` }}
      >
        <img
          alt={coverImages[1].alt}
          className="h-full w-full scale-110 object-cover"
          src={coverImages[1].src}
        />
      </figure>

      <figure
        className="absolute left-[12%] top-[50%] z-20 h-[31%] w-[42%] overflow-hidden bg-white shadow-2xl"
        style={{ border: `8px solid ${secondary}` }}
      >
        <img
          alt={coverImages[2].alt}
          className="h-full w-full scale-105 object-cover"
          src={coverImages[2].src}
        />
      </figure>

      <div className="absolute right-[5.5%] top-[52%] z-20 w-[39%]">
        <div>
          <h1
            className="text-[108px] font-black italic leading-[0.72]"
            style={{ color: secondary }}
          >
            {coverTitle.primary}
          </h1>
          {coverTitle.secondary ? (
            <p
              className="text-[54px] font-semibold leading-[0.9]"
              style={{ color: secondary }}
            >
              {coverTitle.secondary}
            </p>
          ) : null}
        </div>
        <p className="mt-9 max-w-[360px] text-[22px] font-semibold leading-snug text-slate-600">
          {coverDescription}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-[14%] right-[7%] z-10 text-[118px] font-black italic leading-none text-black/15"
      >
        2026
      </div>
    </AuroraPage>
  )
}

function AuroraSummaryPage({
  background,
  paper,
  primary,
  secondary,
}: {
  background: string
  paper: string
  primary: string
  secondary: string
}) {
  const midpoint = Math.ceil(devCatalogCollections.length / 2)
  const columns = [
    devCatalogCollections.slice(0, midpoint),
    devCatalogCollections.slice(midpoint),
  ]

  return (
    <AuroraPage
      background={background}
      paper={paper}
      primary={primary}
      secondary={secondary}
    >
      <div className="absolute left-[8%] top-[8%] z-10 max-w-[52%]">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-black/40">
          Sumario
        </p>
        <h1
          className="mt-5 text-6xl font-black leading-[0.94]"
          style={{ color: secondary }}
        >
          Colecoes
          <br />
          do catalogo
        </h1>
      </div>
      <div className="absolute right-[8%] top-[10%] z-10 w-[30%] rounded-[28px] bg-white/85 p-5 shadow-xl ring-1 ring-black/5">
        <p
          className="text-sm font-black uppercase tracking-[0.2em]"
          style={{ color: primary }}
        >
          Indice de colecoes
        </p>
        <p className="mt-3 text-2xl font-black leading-tight text-slate-900">
          {devCatalogCollections.length} colecoes completas
        </p>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
          Navegue pelas linhas comerciais e encontre rapidamente cada categoria.
        </p>
      </div>
      <div className="absolute left-[8%] right-[8%] top-[31%] z-10">
        <div className="flex items-center gap-4">
          <div
            className="h-10 w-10 rounded-full border-2"
            style={{ borderColor: primary }}
          />
          <div className="h-px flex-1" style={{ backgroundColor: primary }} />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5">
          {columns.map((column, columnIndex) => (
            <div className="space-y-3" key={columnIndex}>
              {column.map((collection, index) => {
                const itemNumber = columnIndex * midpoint + index + 1

                return (
                  <a
                    className="flex h-14 items-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                    href={`#${getCollectionAnchorId(collection.id)}`}
                    key={collection.id}
                  >
                    <div
                      className="grid h-full w-16 place-items-center text-sm font-black text-white"
                      style={{ backgroundColor: collection.color }}
                    >
                      {String(itemNumber).padStart(2, '0')}
                    </div>
                    <div
                      className="min-w-0 flex-1 px-3 text-sm font-black text-slate-900"
                    >
                      <p className="truncate">{collection.name}</p>
                      <p className="truncate text-[8px] font-bold uppercase tracking-wide text-slate-400">
                        {collection.products.length} produtos
                      </p>
                    </div>
                    <div className="pr-4 text-sm font-black text-slate-400">
                      {String(itemNumber * 5).padStart(2, '0')}
                    </div>
                  </a>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </AuroraPage>
  )
}

function AuroraCollectionIntroPage({
  background,
  collection,
  collectionIndex,
  displayOptions,
  paper,
  priceColor,
  primary,
  secondary,
}: {
  background: string
  collection: DevCatalogCollection
  collectionIndex: number
  displayOptions: ProductDisplayOptions
  paper: string
  priceColor: string
  primary: string
  secondary: string
}) {
  const featuredProducts = collection.products.slice(0, 2)

  return (
    <AuroraPage
      background={background}
      id={getCollectionAnchorId(collection.id)}
      paper={paper}
      primary={primary}
      secondary={secondary}
    >
      <div className="absolute right-[8%] top-0 z-20">
        <AuroraCategoryBadge
          collection={collection}
          number={collectionIndex + 1}
          size="large"
        />
      </div>
      <div className="absolute left-[8%] top-[8%] z-10 max-w-[70%]">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-black/35">
          Colecao
        </p>
        <h1
          className="mt-5 rounded-r-[40px] bg-white/80 px-7 py-5 text-6xl font-black leading-none shadow-sm"
          style={{ color: collection.color }}
        >
          {collection.name}
        </h1>
        <p className="mt-5 max-w-[520px] text-lg font-semibold leading-tight text-black/55">
          {collection.description}
        </p>
      </div>
      <div className="absolute left-[8%] top-[30%] z-10 h-[34%] w-[55%] overflow-hidden rounded-[42px] border-[10px] border-white bg-white shadow-2xl">
        <img
          alt={collection.name}
          className="h-full w-full object-cover"
          src={collection.heroImage}
        />
      </div>
      <div className="absolute bottom-[31%] right-[7%] z-10 w-[27%] rounded-[34px] bg-white/90 p-5 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
          Linha
        </p>
        <p
          className="mt-2 text-2xl font-black leading-tight"
          style={{ color: collection.color }}
        >
          {collection.products.length} itens
        </p>
      </div>
      <div className="absolute bottom-[10%] left-[7%] right-[7%] z-10 grid grid-cols-2 gap-7">
        {featuredProducts.map((product, index) => (
          <AuroraFeaturedProductCard
            displayOptions={displayOptions}
            index={index}
            key={product.id}
            priceColor={priceColor}
            primary={collection.color}
            product={product}
          />
        ))}
      </div>
    </AuroraPage>
  )
}

function AuroraProductGridPage({
  background,
  collection,
  displayOptions,
  isSix,
  pageIndex,
  paper,
  priceColor,
  primary,
  products,
  secondary,
}: {
  background: string
  collection: DevCatalogCollection
  displayOptions: ProductDisplayOptions
  isSix: boolean
  pageIndex: number
  paper: string
  priceColor: string
  primary: string
  products: Product[]
  secondary: string
}) {
  return (
    <AuroraPage
      background={background}
      paper={paper}
      primary={primary}
      secondary={secondary}
    >
      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
        <AuroraCategoryBadge collection={collection} size="compact" />
      </div>
      <div className="absolute left-[6%] right-[6%] top-[13%] z-10 flex items-center justify-between">
        <div
          className="rounded-full bg-white px-5 py-2 text-sm font-black shadow-md"
          style={{ color: collection.color }}
        >
          {collection.name}
        </div>
        <div className="rounded-full bg-white/80 px-5 py-2 text-xs font-black uppercase tracking-wide text-black/45">
          Pagina {pageIndex + 1}
        </div>
      </div>
      <div
        className={`absolute left-[5%] right-[5%] top-[18%] z-10 grid ${
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
            primary={collection.color}
            product={product}
          />
        ))}
      </div>
    </AuroraPage>
  )
}

type AuroraPageProps = {
  children: ReactNode
  background: string
  id?: string
  paper: string
  primary: string
  secondary: string
}

function AuroraPage({
  children,
  background,
  id,
  paper,
  primary,
  secondary,
}: AuroraPageProps) {
  return (
    <div
      className="mx-auto w-full max-w-[1040px] scroll-mt-8 print:max-w-none print:break-after-page"
      id={id}
    >
      <div
        className="relative aspect-[794/1123] overflow-hidden bg-[#EEF5F4] shadow-2xl print:shadow-none"
        style={{ backgroundColor: background }}
      >
        <div
          className="absolute -left-[10%] top-[3%] h-[22%] w-[120%] -rotate-6 rounded-[50%]"
          style={{ backgroundColor: paper }}
        />
        <div className="absolute -left-[14%] top-[39%] h-[20%] w-[120%] -rotate-[11deg] rounded-[50%] bg-white/45" />
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

function AuroraCategoryBadge({
  collection,
  number,
  size = 'large',
}: {
  collection: DevCatalogCollection
  number?: number
  size?: CategoryBadgeSize
}) {
  const isLarge = size === 'large'
  const lines = getCategoryBadgeLines(collection.name, isLarge ? 5 : 4)
  const fontSize = getCategoryBadgeFontSize(lines, isLarge)
  const outerSize = isLarge ? 'h-44 w-32' : 'h-36 w-24'
  const textInset = isLarge ? 'inset-x-1 top-7 bottom-8' : 'inset-x-1 top-6 bottom-7'

  return (
    <div
      className={`relative overflow-hidden rounded-b-[44px] text-white shadow-lg ${outerSize}`}
      style={{ backgroundColor: collection.color }}
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-white/25" />
      <div className="absolute inset-x-3 top-5 h-px bg-white/45" />
      <div
        className={`absolute ${textInset} flex flex-col items-center justify-center text-center`}
      >
        {lines.map((line, index) => (
          <span
            className={
              line === '&'
                ? 'font-serif font-semibold opacity-90'
                : 'font-black'
            }
            key={`${collection.id}-${line}-${index}`}
            style={{
              fontSize: `${line === '&' ? fontSize * 0.8 : fontSize}px`,
              letterSpacing: line === '&' ? 0 : '0.01em',
              lineHeight: line === '&' ? 0.9 : 0.88,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'clip',
              whiteSpace: 'nowrap',
            }}
          >
            {line}
          </span>
        ))}
      </div>
      {number ? (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[0.22em] text-white/70">
          {String(number).padStart(2, '0')}
        </span>
      ) : null}
    </div>
  )
}

function AuroraRibbon({
  color,
  label,
  logoUrl,
}: {
  color: string
  label: string
  logoUrl?: string
}) {
  return (
    <div
      className={`relative grid place-items-center rounded-b-full text-white shadow-lg ${
        logoUrl ? 'h-[202px] w-[157px]' : 'h-36 w-28'
      }`}
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-white/20" />
      {logoUrl ? (
        <div className="mx-auto flex h-[178px] w-[137px] items-center justify-center rounded-b-full bg-white/95 px-1 pb-6 pt-2 shadow-inner">
          <img
            alt={`Logotipo ${label}`}
            className="h-full w-full scale-[1.35] object-contain"
            src={logoUrl}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-white/15" />
          <span className="max-w-[90px] text-center text-[11px] font-black uppercase tracking-[0.24em]">
            {label}
          </span>
        </div>
      )}
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
  compact?: boolean
  index: number
}

function AuroraFeaturedProductCard({
  product,
  displayOptions,
  primary,
  priceColor,
  index,
}: AuroraProductCardProps) {
  const productInfo = getVisibleProductInfo(product, displayOptions)
  const discount = index === 1 ? '30%' : ''

  return (
    <article className="relative flex min-h-[270px] overflow-hidden rounded-[34px] bg-white p-4 shadow-2xl ring-1 ring-black/5">
      <div
        className="absolute -left-12 -top-12 h-32 w-32 rounded-full opacity-10"
        style={{ backgroundColor: primary }}
      />
      <div className="relative w-[46%] shrink-0 overflow-hidden rounded-[28px] bg-slate-100">
        {displayOptions.showProductImage ? (
          <img
            alt={product.title}
            className="h-full w-full object-cover"
            src={product.image}
          />
        ) : null}
        {displayOptions.showSku ? (
          <div
            className="absolute bottom-3 right-3 rounded-xl px-3 py-1.5 text-xs font-black leading-none text-white shadow-lg"
            style={{ backgroundColor: primary }}
          >
            {product.sku}
          </div>
        ) : null}
        {discount ? (
          <div className="absolute right-3 top-3 grid size-12 -rotate-12 place-items-center rounded-full border-2 border-dashed border-white bg-red-600 text-[12px] font-black text-white shadow-lg">
            {discount}
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col pl-4 text-left">
        {displayOptions.showProductName ? (
          <h4 className="text-lg font-black uppercase leading-tight text-slate-950">
            {product.title}
          </h4>
        ) : null}
        <div className="my-3 h-px w-28 bg-black/20" />
        {displayOptions.showPrice ? (
          <div
            className="w-fit rounded-2xl bg-white px-4 py-2 text-3xl font-black leading-none shadow-sm"
            style={{ color: priceColor }}
          >
            {product.price}
          </div>
        ) : null}
        {displayOptions.showVariations && product.colors?.length ? (
          <div className="mt-3">
            <ProductColorDots product={product} />
          </div>
        ) : null}
        {displayOptions.showDescription ? (
          <p className="mt-3 line-clamp-3 text-[11px] font-medium leading-relaxed text-black/65">
            {product.description}
          </p>
        ) : null}
        <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1 pt-3 text-[9px] text-black/75">
          {productInfo.slice(0, 6).map(([label, value]) => (
            <div className="flex min-w-0 gap-1 leading-tight" key={label}>
              <dt className="shrink-0 font-black uppercase text-black/55">
                {label}:
              </dt>
              <dd className="min-w-0 truncate">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
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
    <article className="relative flex h-full flex-col overflow-hidden rounded-[30px] bg-white p-4 text-center shadow-xl ring-1 ring-black/5">
      <div
        className="absolute -left-10 -top-10 h-24 w-24 rounded-full opacity-10"
        style={{ backgroundColor: primary }}
      />
      <div
        className={`relative overflow-hidden rounded-3xl bg-slate-100 ${
          compact ? 'h-40' : 'h-56'
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
              compact ? 'min-h-[34px] text-[11px]' : 'min-h-[42px] text-[15px]'
            }`}
          >
            {product.title}
          </h4>
        ) : null}
        <div className="mx-auto my-2 h-px w-24 bg-black/20" />
        {displayOptions.showPrice ? (
          <div
            className={`mx-auto rounded-2xl bg-white px-4 py-2 text-center font-black leading-none shadow-sm ${
              compact ? 'text-2xl' : 'text-3xl'
            }`}
            style={{ color: priceColor }}
          >
            {product.price}
          </div>
        ) : null}
        {displayOptions.showVariations && product.colors?.length ? (
          <div className="mt-2">
            <ProductColorDots product={product} size={compact ? 'small' : 'normal'} />
          </div>
        ) : null}
        {displayOptions.showDescription ? (
          <p
            className={`mt-2 line-clamp-2 font-medium leading-tight text-black/65 ${
              compact ? 'text-[8px]' : 'text-[10px]'
            }`}
          >
            {product.description}
          </p>
        ) : null}
        <dl
          className={`mt-auto grid grid-cols-2 pt-2 text-left ${
            compact ? 'gap-x-2 gap-y-0.5 text-[8px]' : 'gap-x-3 gap-y-1 text-[9px]'
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

function GenericCatalogDocument({
  design,
  displayOptions,
  productLimit,
}: Omit<CatalogPreviewRendererProps, 'products'>) {
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
