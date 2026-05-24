import { Copy, MessageCircle, Send } from 'lucide-react'
import { Brand } from '../components/Brand'
import { products, recentClients } from '../data/mock'

export function RepresentativeDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f2]">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Brand />
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#1f9d68] px-4 text-sm font-semibold text-white"
            type="button"
          >
            <MessageCircle size={18} aria-hidden="true" />
            WhatsApp
          </button>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Painel do representante
          </h1>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">Meus catalogos</h2>
            <div className="mt-4 space-y-3">
              {['Utilidades 2026', 'Presentes', 'Infantil'].map((catalog) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3"
                  key={catalog}
                >
                  <span className="font-semibold text-slate-800">
                    {catalog}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600"
                      title="Copiar link"
                      type="button"
                    >
                      <Copy size={16} aria-hidden="true" />
                    </button>
                    <button
                      className="grid size-9 place-items-center rounded-md bg-teal-700 text-white"
                      title="Compartilhar"
                      type="button"
                    >
                      <Send size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Produtos com possivel interesse
            </h2>
            <div className="mt-4 space-y-3">
              {products.slice(0, 3).map((product) => (
                <div
                  className="flex items-center gap-3 rounded-md bg-slate-50 p-3"
                  key={product.id}
                >
                  <img
                    alt={product.title}
                    className="size-14 rounded-md object-cover"
                    height="56"
                    loading="lazy"
                    src={product.image}
                    width="56"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">
                      {product.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      {product.attention}% de atencao
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside>
          <h2 className="mb-3 text-lg font-semibold text-slate-950">
            Clientes recentes
          </h2>
          <div className="space-y-3">
            {recentClients.map((client) => (
              <article
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                key={client.name}
              >
                <h3 className="font-semibold text-slate-950">{client.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {client.time} · {client.catalog}
                </p>
                <p className="mt-3 text-sm text-slate-700">
                  Possivel interesse em {client.product}.
                </p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}
