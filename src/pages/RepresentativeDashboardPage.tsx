import { Copy, Link2, MessageCircle, Send, UserPlus } from 'lucide-react'
import { Brand } from '../components/Brand'
import { linkedRepresentative, products, recentClients } from '../data/mock'

export function RepresentativeDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f2]">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Brand />
          <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            Representante · porta 5176
          </span>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-950">
              Cadastro do representante
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Cadastro simples do fornecedor e vinculo com empresa por token de
              convite.
            </p>
            <form className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Nome</span>
                <input
                  className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  defaultValue={linkedRepresentative.name}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Documento do fornecedor
                </span>
                <input
                  className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  defaultValue={linkedRepresentative.supplierDocument}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Token da empresa
                </span>
                <input
                  className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  defaultValue={linkedRepresentative.inviteToken}
                />
              </label>
              <button
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
                type="button"
              >
                <UserPlus size={18} aria-hidden="true" />
                Vincular empresa
              </button>
            </form>
          </section>
          <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h2 className="font-semibold text-emerald-950">Vinculo ativo</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              {linkedRepresentative.name} esta vinculado a{' '}
              {linkedRepresentative.company}.
            </p>
          </section>
        </aside>

        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Painel do representante
          </h1>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">Catalogos liberados</h2>
            <div className="mt-4 space-y-3">
              {['Utilidades 2026', 'Presentes', 'Infantil'].map((catalog) => (
                <div
                  className="flex flex-col gap-3 rounded-md border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                  key={catalog}
                >
                  <div>
                    <span className="font-semibold text-slate-800">
                      {catalog}
                    </span>
                    <p className="mt-1 text-sm text-slate-500">
                      Link pessoal com identificacao do representante.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600"
                      title="Copiar link"
                      type="button"
                    >
                      <Copy size={16} aria-hidden="true" />
                    </button>
                    <a
                      className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600"
                      href={linkedRepresentative.shareLink}
                      title="Abrir catalogo"
                    >
                      <Link2 size={16} aria-hidden="true" />
                    </a>
                    <a
                      className="grid size-9 place-items-center rounded-md bg-[#1f9d68] text-white"
                      href={`https://wa.me/?text=${encodeURIComponent(linkedRepresentative.shareLink)}`}
                      title="Compartilhar no WhatsApp"
                    >
                      <Send size={16} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_320px]">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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
                    <MessageCircle
                      className="text-emerald-700"
                      size={18}
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </section>
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
                    <h3 className="font-semibold text-slate-950">
                      {client.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {client.time} - {client.catalog}
                    </p>
                    <p className="mt-3 text-sm text-slate-700">
                      Possivel interesse em {client.product}.
                    </p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
