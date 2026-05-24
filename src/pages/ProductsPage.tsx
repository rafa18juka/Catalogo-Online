import { Filter, Plus, Upload } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { getCompanyProducts } from '../lib/mockStore'

export function ProductsPage() {
  const products = getCompanyProducts()

  return (
    <>
      <PageHeader
        eyebrow="Produtos"
        title="Cadastro e imagens"
        description="A empresa comeca sem produtos. O cadastro real entra nesta area."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
              type="button"
            >
              <Upload size={18} aria-hidden="true" />
              Importar
            </button>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
              type="button"
            >
              <Plus size={18} aria-hidden="true" />
              Produto
            </button>
          </div>
        }
      />
      <section className="p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
          <input
            className="h-10 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            placeholder="Buscar por titulo, SKU ou categoria"
            type="search"
          />
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
            type="button"
          >
            <Filter size={18} aria-hidden="true" />
            Filtros
          </button>
        </div>
        {products.length ? (
          <div className="grid gap-3 xl:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Nenhum produto cadastrado
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Os produtos de exemplo nao entram mais na conta da empresa. Eles
              ficam apenas como assets de teste visual.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
