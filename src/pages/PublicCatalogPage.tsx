import { Check, Copy, MessageCircle, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  defaultProductDisplayOptions,
  type Product,
  type ProductDisplayOptions,
} from '../data/mock'
import {
  getCatalogBySlug,
  getCatalogDesignPresets,
  getCompanyById,
  getCompanyProductsByCompanyId,
} from '../lib/mockStore'

function getProductInfo(product: Product, displayOptions: ProductDisplayOptions) {
  return [
    displayOptions.showSku && product.sku
      ? ['SKU', product.sku]
      : null,
    displayOptions.showInternalCode && product.internalCode
      ? ['Codigo', product.internalCode]
      : null,
    displayOptions.showEan && product.ean ? ['EAN', product.ean] : null,
    displayOptions.showNcm && product.ncm ? ['NCM', product.ncm] : null,
    displayOptions.showMeasurements && product.measurements
      ? ['Medidas', product.measurements]
      : null,
    displayOptions.showWeight && product.weight ? ['Peso', product.weight] : null,
    displayOptions.showMasterBox && product.masterBox
      ? ['Caixa master', product.masterBox]
      : null,
    displayOptions.showMinimumOrder && product.minimumOrder
      ? ['Pedido minimo', product.minimumOrder]
      : null,
    displayOptions.showStock && product.stock ? ['Estoque', product.stock] : null,
  ].filter((item): item is [string, string] => Boolean(item))
}

function ProductColorSwatches({ product }: { product: Product }) {
  if (!product.colors?.length) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {product.colors.map((color) => (
        <span
          className="size-4 rounded-full border border-slate-200 shadow-sm"
          key={`${product.id}-${color}`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  )
}

export function PublicCatalogPage() {
  const { catalogSlug, shareCode } = useParams()
  const [visitorName, setVisitorName] = useState('')
  const [hasEntered, setHasEntered] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  )
  const catalog = getCatalogBySlug(catalogSlug ?? '')
  const company = catalog ? getCompanyById(catalog.companyId) : null
  const catalogProducts = useMemo(
    () => (catalog ? getCompanyProductsByCompanyId(catalog.companyId) : []),
    [catalog],
  )
  const selectedProduct = useMemo(
    () => catalogProducts.find((product) => product.id === selectedProductId),
    [catalogProducts, selectedProductId],
  )
  const designs = getCatalogDesignPresets()
  const selectedDesign =
    designs.find((design) => design.id === catalog?.designPresetId) ?? designs[0]
  const displayOptions = catalog?.displayOptions ?? defaultProductDisplayOptions

  if (!hasEntered) {
    return (
      <main
        className="grid min-h-screen place-items-center px-4 py-8"
        style={{ backgroundColor: selectedDesign.backgroundColor }}
      >
        <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div
            className="mx-auto mb-5 grid size-12 place-items-center rounded-lg text-white"
            style={{ backgroundColor: selectedDesign.primaryColor }}
          >
            <Check size={22} aria-hidden="true" />
          </div>
          <h1 className="text-center text-2xl font-semibold text-slate-950">
            Como podemos te identificar?
          </h1>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">
              Nome ou apelido
            </span>
            <input
              className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-base outline-none focus:border-teal-600 focus:bg-white"
              onChange={(event) => setVisitorName(event.target.value)}
              placeholder="Ex.: Cadu"
              value={visitorName}
            />
          </label>
          <button
            className="mt-4 h-12 w-full rounded-md text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!visitorName.trim()}
            onClick={() => setHasEntered(true)}
            style={{ backgroundColor: selectedDesign.primaryColor }}
            type="button"
          >
            Acessar catalogo
          </button>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            Ao continuar, voce concorda com nossa{' '}
            <Link className="font-semibold text-teal-700" to="/privacy">
              Politica de Privacidade
            </Link>
            .
          </p>
        </section>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: selectedDesign.backgroundColor,
        color: selectedDesign.textColor,
      }}
    >
      <header
        className="sticky top-0 z-20 border-b px-4 py-3 shadow-sm"
        style={{
          backgroundColor: selectedDesign.surfaceColor,
          borderColor: `${selectedDesign.primaryColor}22`,
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {company?.logoUrl ? (
              <div className="grid size-12 shrink-0 place-items-center rounded-md border border-slate-200 bg-white p-1.5">
                <img
                  alt={`Logotipo ${company.tradeName}`}
                  className="max-h-full max-w-full object-contain"
                  src={company.logoUrl}
                />
              </div>
            ) : null}
            <div className="min-w-0">
              <p
                className="text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ color: selectedDesign.primaryColor }}
              >
                {company?.tradeName ?? selectedDesign.name}
              </p>
              <h1 className="truncate text-lg font-semibold">
                {catalog?.name ?? 'Catalogo indisponivel'}
              </h1>
              <p className="truncate text-xs text-slate-500">
                {catalogSlug} - {shareCode ?? 'link direto'}
              </p>
            </div>
          </div>
          <a
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-white"
            href="https://wa.me/"
            style={{ backgroundColor: '#1f9d68' }}
          >
            <MessageCircle size={18} aria-hidden="true" />
            Orcamento
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-4">
        <div className="relative mb-4">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
            aria-hidden="true"
          />
          <input
            className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-teal-600"
            placeholder="Buscar produto"
            type="search"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {catalogProducts.map((product) => {
            const productInfo = getProductInfo(product, displayOptions)

            return (
              <article
                className="overflow-hidden rounded-lg border border-slate-200 shadow-sm"
                key={product.id}
                style={{ backgroundColor: selectedDesign.surfaceColor }}
              >
                {displayOptions.showProductImage && product.image ? (
                  <button
                    className="block aspect-square w-full overflow-hidden bg-slate-100"
                    onClick={() => setSelectedProductId(product.id)}
                    type="button"
                  >
                    <img
                      alt={product.title}
                      className="h-full w-full object-cover"
                      height="480"
                      loading="lazy"
                      src={product.image}
                      width="480"
                    />
                  </button>
                ) : null}
                <div className="flex min-h-44 flex-col gap-3 p-3">
                  {displayOptions.showProductName && product.title ? (
                    <h2 className="text-base font-semibold">{product.title}</h2>
                  ) : null}
                  <p className="text-sm text-slate-500">{product.category}</p>
                  {productInfo.length ? (
                    <dl className="grid gap-2 text-xs text-slate-600">
                      {productInfo.map(([label, value]) => (
                        <div
                          className="flex items-start justify-between gap-3 rounded-md bg-slate-50 px-2 py-1"
                          key={`${product.id}-${label}`}
                        >
                          <dt className="font-semibold text-slate-500">{label}</dt>
                          <dd className="text-right text-slate-700">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {displayOptions.showDescription && product.description ? (
                    <p className="text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>
                  ) : null}
                  {displayOptions.showVariations &&
                  (product.variations || product.colors?.length) ? (
                    <div className="space-y-2">
                      <ProductColorSwatches product={product} />
                      {product.variations ? (
                        <p className="text-sm text-slate-500">
                          Variacoes: {product.variations}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  {displayOptions.showObservations && product.observations ? (
                    <p className="text-sm text-slate-500">
                      Obs.: {product.observations}
                    </p>
                  ) : null}
                  <div className="mt-auto flex items-center justify-between gap-3">
                    {displayOptions.showPrice && product.price ? (
                      <span
                        className="font-semibold"
                        style={{ color: selectedDesign.primaryColor }}
                      >
                        {product.price}
                      </span>
                    ) : (
                      <span />
                    )}
                    <button
                      className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600"
                      title="Copiar produto"
                      type="button"
                    >
                      <Copy size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        {!catalogProducts.length ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Nenhum produto publicado
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Este catalogo ainda nao possui produtos publicados.
            </p>
          </div>
        ) : null}
      </section>

      {selectedProduct ? (
        <div
          className="fixed inset-0 z-30 grid place-items-center bg-slate-950/70 p-4"
          onClick={() => setSelectedProductId(null)}
        >
          <section
            className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-3">
              <h2 className="font-semibold text-slate-950">
                {selectedProduct.title}
              </h2>
              <button
                className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600"
                onClick={() => setSelectedProductId(null)}
                title="Fechar"
                type="button"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <img
              alt={selectedProduct.title}
              className="max-h-[70vh] w-full bg-slate-100 object-contain"
              height="900"
              src={selectedProduct.image}
              width="900"
            />
          </section>
        </div>
      ) : null}
    </main>
  )
}
