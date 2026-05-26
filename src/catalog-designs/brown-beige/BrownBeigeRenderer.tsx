import type { CSSProperties, ReactNode } from 'react'
import {
  devCatalogCollections,
  type DevCatalogCollection,
} from '../../data/devCatalogPreview'
import {
  catalogCoverPresets,
  type Product,
  type ProductDisplayOptions,
} from '../../data/mock'
import { readBrownBeigeTokens } from './tokens'
import type { BrownBeigeRendererProps, CatalogCoverContent } from './types'

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

function getCollectionAnchorId(collectionId: string) {
  return `colecao-${collectionId}`
}

function getSummaryAnchorId() {
  return 'indice-colecoes'
}

function chunkProducts(products: Product[], size: number) {
  const chunks: Product[][] = []

  for (let index = 0; index < products.length; index += size) {
    chunks.push(products.slice(index, index + size))
  }

  return chunks
}

function formatPriceForDesign(price: string) {
  return price.replace('R$', '$').replace(',', '.')
}

function splitCoverTitle(title: string) {
  const normalized = title.trim() || catalogCoverPresets[0].title
  const parts = normalized
    .replace(/\s*&\s*/g, ' & ')
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length <= 1) {
    return { primary: normalized, secondary: '' }
  }

  const midpoint = Math.ceil(parts.length / 2)

  return {
    primary: parts.slice(0, midpoint).join(' '),
    secondary: parts.slice(midpoint).join(' '),
  }
}

function ProductColorDots({ product }: { product: Product }) {
  if (!product.colors?.length) return null

  return (
    <div className="flex items-center gap-1.5">
      {product.colors.map((color) => (
        <span
          className="size-3 rounded-full border border-white/70 shadow-sm"
          key={`${product.id}-${color}`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  )
}

export function BrownBeigeRenderer({
  companyLogoUrl,
  companyName,
  coverContent,
  design,
  displayOptions,
  productLimit,
}: BrownBeigeRendererProps) {
  const tokens = readBrownBeigeTokens(design)
  const productsPerPage = Math.min(Math.max(productLimit, 1), 8)

  return (
    <div className="space-y-8 print:space-y-0">
      <BrownBeigeCoverPage
        companyLogoUrl={companyLogoUrl}
        companyName={companyName}
        coverContent={coverContent}
        tokens={tokens}
      />
      <BrownBeigeSummaryPage tokens={tokens} />
      {devCatalogCollections.flatMap((collection, collectionIndex) => [
        <BrownBeigeCollectionIntroPage
          collection={collection}
          collectionIndex={collectionIndex}
          displayOptions={displayOptions}
          key={`${collection.id}-intro`}
          tokens={tokens}
        />,
        ...chunkProducts(collection.products, productsPerPage).map(
          (products, pageIndex) => (
            <BrownBeigeProductGridPage
              collection={collection}
              key={`${collection.id}-grid-${pageIndex}`}
              pageIndex={pageIndex}
              products={products}
              tokens={tokens}
              displayOptions={displayOptions}
            />
          ),
        ),
      ])}
    </div>
  )
}

function BrownBeigeCoverPage({
  companyLogoUrl,
  companyName,
  coverContent,
  tokens,
}: {
  companyLogoUrl?: string
  companyName?: string
  coverContent?: CatalogCoverContent
  tokens: ReturnType<typeof readBrownBeigeTokens>
}) {
  const featuredProducts = devCatalogCollections
    .slice(0, 3)
    .map((collection) => collection.products[0])
    .filter(Boolean)
  const coverTitle = splitCoverTitle(
    coverContent?.title ?? catalogCoverPresets[0].title,
  )
  const coverDescription =
    coverContent?.description ?? catalogCoverPresets[0].description

  return (
    <BrownBeigePage tokens={tokens}>
      <div className="absolute left-0 top-0 h-[52%] w-[50%] overflow-hidden bg-slate-100">
        <img
          alt={featuredProducts[0]?.title ?? 'Produto em destaque'}
          className="h-full w-full object-cover"
          src={featuredProducts[0]?.image ?? devCatalogCollections[0].heroImage}
        />
      </div>

      <section
        className="absolute right-[3.5%] top-[4.2%] h-[29%] w-[41%] p-8 text-white"
        style={{ backgroundColor: tokens.secondary }}
      >
        <p className="relative z-10 text-lg font-medium">
          {coverTitle.primary || 'Novidade'}
        </p>
        <p className="relative z-10 mt-16 max-w-[150px] text-sm font-medium leading-tight">
          {coverDescription}
        </p>
        <div className="absolute bottom-8 left-8 z-10 bg-white px-3 py-1 text-lg text-slate-900">
          {formatPriceForDesign(featuredProducts[0]?.price ?? 'R$ 18,99')}
        </div>
        <img
          alt={featuredProducts[1]?.title ?? 'Produto'}
          className="absolute right-8 top-12 z-0 h-[63%] w-[45%] object-cover"
          src={featuredProducts[1]?.image ?? devCatalogCollections[1].heroImage}
        />
      </section>

      <BrownBeigeMiniFeature
        product={featuredProducts[1]}
        style={{
          backgroundColor: tokens.primary,
          right: '3.5%',
          top: '35.2%',
        }}
      />
      <BrownBeigeMiniFeature
        product={featuredProducts[2]}
        style={{
          backgroundColor: tokens.paper,
          color: tokens.text,
          right: '3.5%',
          top: '66.2%',
        }}
      />

      <div className="absolute bottom-[25.5%] left-[6%] z-10">
        <h1 className="max-w-[390px] text-[58px] font-light leading-[0.96] tracking-[-0.04em] text-[#2D2B32]">
          {coverTitle.primary}
          {coverTitle.secondary ? (
            <>
              <br />&<br />
              {coverTitle.secondary}
            </>
          ) : null}
        </h1>
      </div>

      <div className="absolute bottom-[9%] left-[10%] flex items-center gap-5 text-[#2D2B32]">
        {companyLogoUrl ? (
          <div className="grid h-20 w-28 place-items-center bg-white p-2 shadow-sm">
            <img
              alt={`Logotipo ${companyName ?? 'Empresa'}`}
              className="max-h-full max-w-full object-contain"
              src={companyLogoUrl}
            />
          </div>
        ) : null}
        <div>
          <p className="text-2xl font-light">
            {companyName ? companyName.toLowerCase() : 'marca da empresa'}
          </p>
          <p className="mt-4 max-w-[300px] truncate text-xl font-light">
            www.site-da-empresa.com.br
          </p>
        </div>
      </div>
    </BrownBeigePage>
  )
}

function BrownBeigeMiniFeature({
  product,
  style,
}: {
  product?: Product
  style: CSSProperties
}) {
  if (!product) return null

  return (
    <section
      className="absolute h-[29%] w-[41%] p-8 text-white"
      style={style}
    >
      <p className="relative z-10 text-lg font-medium">Titulo do produto</p>
      <p className="relative z-10 mt-24 max-w-[135px] text-xs font-medium leading-tight">
        {product.description}
      </p>
      <div className="absolute bottom-8 left-8 z-10 bg-white px-3 py-1 text-lg text-slate-900">
        {formatPriceForDesign(product.price)}
      </div>
      <img
        alt={product.title}
        className="absolute right-8 top-12 z-0 h-[63%] w-[45%] object-cover"
        src={product.image}
      />
    </section>
  )
}

function BrownBeigeSummaryPage({
  tokens,
}: {
  tokens: ReturnType<typeof readBrownBeigeTokens>
}) {
  const midpoint = Math.ceil(devCatalogCollections.length / 2)
  const columns = [
    devCatalogCollections.slice(0, midpoint),
    devCatalogCollections.slice(midpoint),
  ]

  return (
    <BrownBeigePage id={getSummaryAnchorId()} tokens={tokens}>
      <div
        className="absolute left-[16%] top-[7%] h-[16%] w-[66%] rounded-[28px]"
        style={{ backgroundColor: tokens.primary }}
      />
      <div
        className="absolute left-[35%] top-[15%] h-[10%] w-[47%] rounded-b-[28px]"
        style={{ backgroundColor: tokens.secondary }}
      />
      <div
        className="absolute left-[16%] top-[10%] h-[16%] w-[12%] rounded-[28px]"
        style={{ backgroundColor: tokens.paper }}
      />
      <h1 className="absolute left-[16%] top-[10%] z-10 text-[104px] font-light leading-none tracking-[-0.08em] text-white">
        Sumario
      </h1>

      <div className="absolute left-[10%] right-[10%] top-[34%] grid grid-cols-2 gap-x-16 gap-y-5">
        {columns.map((column, columnIndex) => (
          <div className="space-y-5" key={columnIndex}>
            {column.map((collection, index) => {
              const itemNumber = columnIndex * midpoint + index + 1

              return (
                <a
                  className="group flex h-10 items-center rounded-full text-white transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#01385E]"
                  href={`#${getCollectionAnchorId(collection.id)}`}
                  key={collection.id}
                  style={{
                    backgroundColor:
                      itemNumber === 1 ? tokens.secondary : tokens.primary,
                  }}
                >
                  <span
                    className="grid h-12 w-20 -translate-x-1 place-items-center rounded-full text-xl text-[#2D2B32]"
                    style={{ backgroundColor: tokens.paper }}
                  >
                    {String(itemNumber).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 truncate px-4 text-2xl font-light leading-none">
                    {collection.name.toLowerCase()}
                  </span>
                  <span
                    className="grid h-12 w-20 translate-x-1 place-items-center rounded-full text-xl text-[#2D2B32]"
                    style={{ backgroundColor: tokens.paper }}
                  >
                    {String(itemNumber).padStart(2, '0')}
                  </span>
                </a>
              )
            })}
          </div>
        ))}
      </div>
    </BrownBeigePage>
  )
}

function BrownBeigeCollectionIntroPage({
  collection,
  collectionIndex,
  displayOptions,
  tokens,
}: {
  collection: DevCatalogCollection
  collectionIndex: number
  displayOptions: ProductDisplayOptions
  tokens: ReturnType<typeof readBrownBeigeTokens>
}) {
  const featuredProducts = collection.products.slice(0, 2)

  return (
    <BrownBeigePage id={getCollectionAnchorId(collection.id)} tokens={tokens}>
      <BrownBeigeHeroHeader collection={collection} large tokens={tokens} />
      <div className="absolute left-[5.5%] right-[5.5%] top-[35%] space-y-10">
        {featuredProducts.map((product) => (
          <BrownBeigeWideProductCard
            displayOptions={displayOptions}
            key={product.id}
            product={product}
            tokens={tokens}
          />
        ))}
      </div>
      <BrownBeigeFooter
        collection={collection}
        pageNumber={collectionIndex + 1}
        tokens={tokens}
      />
    </BrownBeigePage>
  )
}

function BrownBeigeProductGridPage({
  collection,
  displayOptions,
  pageIndex,
  products,
  tokens,
}: {
  collection: DevCatalogCollection
  displayOptions: ProductDisplayOptions
  pageIndex: number
  products: Product[]
  tokens: ReturnType<typeof readBrownBeigeTokens>
}) {
  return (
    <BrownBeigePage tokens={tokens}>
      <BrownBeigeHeroHeader collection={collection} tokens={tokens} />
      <div className="absolute left-[2.8%] right-[2.8%] top-[15%] grid grid-cols-2 gap-x-9 gap-y-5">
        {products.map((product) => (
          <BrownBeigeCompactProductCard
            displayOptions={displayOptions}
            key={product.id}
            product={product}
            tokens={tokens}
          />
        ))}
      </div>
      <BrownBeigeFooter
        collection={collection}
        pageNumber={pageIndex + 1}
        tokens={tokens}
      />
    </BrownBeigePage>
  )
}

function BrownBeigeHeroHeader({
  collection,
  large = false,
  tokens,
}: {
  collection: DevCatalogCollection
  large?: boolean
  tokens: ReturnType<typeof readBrownBeigeTokens>
}) {
  return (
    <header
      className={`absolute left-0 right-0 top-0 overflow-hidden ${
        large ? 'h-[33%]' : 'h-[11%]'
      }`}
      style={{ backgroundColor: tokens.secondary }}
    >
      <img
        alt={collection.name}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        src={collection.heroImage}
      />
      <div className="absolute inset-0 bg-black/35" />
      <a
        className={`absolute z-10 font-light leading-none tracking-[-0.06em] text-white ${
          large
            ? 'left-[5%] top-[18%] max-w-[48%] text-[86px]'
            : 'left-[3%] top-[18%] max-w-[22%] text-[42px]'
        }`}
        href={`#${getSummaryAnchorId()}`}
      >
        {collection.name}
      </a>
      {large ? (
        <>
          <p className="absolute right-[6%] top-[12%] z-10 text-2xl font-light text-white">
            nova colecao
          </p>
          <p className="absolute right-[7%] top-[54%] z-10 max-w-[260px] text-3xl font-light leading-[0.96] text-white">
            # Redefina Seu Espaco: Onde o Conforto Encontra o Estilo
          </p>
        </>
      ) : null}
    </header>
  )
}

function BrownBeigeWideProductCard({
  displayOptions,
  product,
  tokens,
}: {
  displayOptions: ProductDisplayOptions
  product: Product
  tokens: ReturnType<typeof readBrownBeigeTokens>
}) {
  const productInfo = getVisibleProductInfo(product, displayOptions)

  return (
    <article className="relative h-[214px]">
      <div
        className="absolute left-[25%] top-0 h-[52%] w-[42%] rounded-tr-[24px]"
        style={{ backgroundColor: tokens.primary }}
      />
      <div
        className="absolute bottom-0 left-[29%] h-[70%] w-[48%] rounded-r-[28px]"
        style={{ backgroundColor: tokens.paper }}
      />
      {displayOptions.showProductImage ? (
        <div className="absolute left-0 top-0 h-full w-[38%] overflow-hidden rounded-[28px] border-[3px] border-white bg-white">
          <img
            alt={product.title}
            className="h-full w-full object-cover"
            src={product.image}
          />
          {displayOptions.showSku ? <BrownBeigeSkuBadge product={product} /> : null}
        </div>
      ) : null}
      <div className="absolute left-[41%] top-4 z-10 text-white">
        {displayOptions.showProductName ? (
          <h2 className="max-w-[270px] truncate text-2xl font-light">
            {product.title}
          </h2>
        ) : null}
        {displayOptions.showPrice ? (
          <p className="mt-3 text-5xl font-bold leading-none">
            {formatPriceForDesign(product.price)}
          </p>
        ) : null}
      </div>
      <div className="absolute left-[43%] top-[43%] z-10 w-[31%]">
        <ProductInfoList
          displayOptions={displayOptions}
          product={product}
          productInfo={productInfo}
        />
      </div>
    </article>
  )
}

function BrownBeigeCompactProductCard({
  displayOptions,
  product,
  tokens,
}: {
  displayOptions: ProductDisplayOptions
  product: Product
  tokens: ReturnType<typeof readBrownBeigeTokens>
}) {
  const productInfo = getVisibleProductInfo(product, displayOptions)

  return (
    <article className="relative h-[145px]">
      <div
        className="absolute left-[35%] top-0 h-[50%] w-[54%] rounded-tr-[20px]"
        style={{ backgroundColor: tokens.primary }}
      />
      <div
        className="absolute bottom-0 left-[35%] h-[66%] w-[61%] rounded-r-[24px]"
        style={{ backgroundColor: tokens.paper }}
      />
      {displayOptions.showProductImage ? (
        <div className="absolute left-0 top-0 h-full w-[52%] overflow-hidden rounded-[22px] border-[3px] border-white bg-white">
          <img
            alt={product.title}
            className="h-full w-full object-cover"
            src={product.image}
          />
          {displayOptions.showSku ? <BrownBeigeSkuBadge product={product} /> : null}
        </div>
      ) : null}
      <div className="absolute left-[47%] top-2 z-10 max-w-[47%] text-white">
        {displayOptions.showProductName ? (
          <h2 className="truncate text-base font-light">{product.title}</h2>
        ) : null}
        {displayOptions.showPrice ? (
          <p className="mt-1 text-3xl font-bold leading-none">
            {formatPriceForDesign(product.price)}
          </p>
        ) : null}
      </div>
      <div className="absolute left-[56%] top-[53%] z-10 w-[33%]">
        <ProductInfoList
          compact
          displayOptions={displayOptions}
          product={product}
          productInfo={productInfo.slice(0, 4)}
        />
      </div>
    </article>
  )
}

function BrownBeigeSkuBadge({ product }: { product: Product }) {
  return (
    <span className="absolute bottom-2 left-2 grid h-10 min-w-16 place-items-center rounded-full bg-[#CF874F] px-2 text-xl font-bold leading-none text-white ring-2 ring-white">
      {product.sku.replace(/[^0-9A-Z]/gi, '').slice(-4) || product.sku}
    </span>
  )
}

function ProductInfoList({
  compact = false,
  displayOptions,
  product,
  productInfo,
}: {
  compact?: boolean
  displayOptions: ProductDisplayOptions
  product: Product
  productInfo: Array<[string, string]>
}) {
  return (
    <div
      className={`space-y-0.5 text-[#2D2B32] ${
        compact ? 'text-[9px]' : 'text-base'
      }`}
    >
      {productInfo.map(([label, value]) => (
        <p className="truncate leading-tight" key={`${product.id}-${label}`}>
          <span>{label}: </span>
          {value}
        </p>
      ))}
      {displayOptions.showVariations && product.colors?.length ? (
        <div className="pt-1">
          <ProductColorDots product={product} />
        </div>
      ) : null}
      {displayOptions.showDescription && product.description && !compact ? (
        <p className="line-clamp-2 pt-2 text-xs leading-tight text-[#2D2B32]/70">
          {product.description}
        </p>
      ) : null}
    </div>
  )
}

function BrownBeigeFooter({
  collection,
  pageNumber,
  tokens,
}: {
  collection: DevCatalogCollection
  pageNumber: number
  tokens: ReturnType<typeof readBrownBeigeTokens>
}) {
  return (
    <footer
      className="absolute bottom-0 left-0 right-0 flex h-[6.8%] items-center justify-between px-[5.5%] text-white"
      style={{ backgroundColor: '#7C675A' }}
    >
      <a
        className="text-sm font-light uppercase leading-none"
        href={`#${getSummaryAnchorId()}`}
      >
        {collection.name}
      </a>
      <div
        className="h-8 w-px"
        style={{ backgroundColor: `${tokens.background}99` }}
      />
      <span className="ml-auto text-sm font-light">{pageNumber}</span>
    </footer>
  )
}

type BrownBeigePageProps = {
  children: ReactNode
  id?: string
  tokens: ReturnType<typeof readBrownBeigeTokens>
}

function BrownBeigePage({ children, id, tokens }: BrownBeigePageProps) {
  return (
    <div
      className="mx-auto w-full max-w-[794px] scroll-mt-8 print:max-w-none print:break-after-page"
      id={id}
    >
      <div
        className="relative aspect-[794/1123] overflow-hidden shadow-2xl print:shadow-none"
        style={{ backgroundColor: tokens.background, color: tokens.text }}
      >
        {children}
      </div>
    </div>
  )
}
