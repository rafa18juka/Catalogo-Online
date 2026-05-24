import { ArrowUpRight, Copy, MessageCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { metrics, products, recentClients } from '../data/mock'

export function CompanyDashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Painel da empresa"
        title="Operacao do catalogo"
        description="Visao de catalogos publicados, clientes recentes, produtos com maior atencao e uso do plano."
        action={
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
            to="/app/catalogs"
          >
            <Plus size={18} aria-hidden="true" />
            Novo catalogo
          </Link>
        }
      />
      <section className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="grid gap-5 px-5 pb-6 sm:px-6 xl:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-950">
              Produtos com maior atencao
            </h2>
            <Link
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
              to="/app/products"
            >
              Ver todos
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-950">
            Clientes recentes
          </h2>
          <div className="space-y-3">
            {recentClients.map((client) => (
              <article
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                key={client.name}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {client.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {client.catalog} · {client.time}
                    </p>
                  </div>
                  <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                    {client.interest}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  Possivel interesse em {client.product}.
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
                    type="button"
                  >
                    <Copy size={16} aria-hidden="true" />
                    Copiar
                  </button>
                  <button
                    className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-[#1f9d68] text-sm font-semibold text-white hover:bg-[#168357]"
                    type="button"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    WhatsApp
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
