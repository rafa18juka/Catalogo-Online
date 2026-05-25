import { Eye, FileText } from 'lucide-react'
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
  const gridClass = productLimit <= 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'

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

        <div
          className="overflow-hidden rounded-lg border border-slate-200"
          style={{
            backgroundColor: selectedDesign.backgroundColor,
            color: selectedDesign.textColor,
          }}
        >
          <div
            className="p-5 text-white"
            style={{ backgroundColor: selectedDesign.primaryColor }}
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
                  backgroundColor: selectedDesign.accentColor,
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
                  style={{ backgroundColor: selectedDesign.surfaceColor }}
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
                          style={{ color: selectedDesign.primaryColor }}
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
      </div>
    </section>
  )
}
