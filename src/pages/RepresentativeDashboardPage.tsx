import { Copy, Link2, LogOut, MessageCircle, Send, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { products, recentClients } from '../data/mock'
import {
  clearCurrentRepresentative,
  getCurrentRepresentative,
  getLinkedCompaniesForRepresentative,
  getReleasedCatalogsForRepresentative,
  linkRepresentativeWithToken,
} from '../lib/mockStore'

export function RepresentativeDashboardPage() {
  const navigate = useNavigate()
  const representative = getCurrentRepresentative()
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [version, setVersion] = useState(0)

  if (!representative) {
    return <Navigate to="/representante/login" replace />
  }

  const activeRepresentative = representative
  const linkedCompanies = getLinkedCompaniesForRepresentative(activeRepresentative.id)
  const releasedCatalogs = getReleasedCatalogsForRepresentative(
    activeRepresentative.id,
  )

  function handleLink() {
    const result = linkRepresentativeWithToken(activeRepresentative.id, token)
    setMessage(result.message)
    setToken('')
    setVersion((current) => current + 1)
  }

  function handleLogout() {
    clearCurrentRepresentative()
    navigate('/representante/login')
  }

  return (
    <main className="min-h-screen bg-[#f6f7f2]" data-version={version}>
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Brand />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 sm:inline-flex">
              {activeRepresentative.fullName}
            </span>
            <button
              className="grid size-10 place-items-center rounded-md border border-slate-200 text-slate-600"
              onClick={handleLogout}
              title="Sair"
              type="button"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-950">
              Vincular a uma empresa
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Cole o token enviado pela empresa. Um representante pode se
              vincular a varias empresas.
            </p>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">
                Token da empresa
              </span>
              <input
                className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm uppercase outline-none focus:border-teal-600 focus:bg-white"
                onChange={(event) => setToken(event.target.value)}
                placeholder="FORN-XXXX-0000"
                value={token}
              />
            </label>
            <button
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
              onClick={handleLink}
              type="button"
            >
              <UserPlus size={18} aria-hidden="true" />
              Vincular empresa
            </button>
            {message ? (
              <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                {message}
              </p>
            ) : null}
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">Empresas vinculadas</h2>
            <div className="mt-4 space-y-2">
              {linkedCompanies.length ? (
                linkedCompanies.map((company) => (
                  <div
                    className="rounded-md border border-emerald-100 bg-emerald-50 p-3"
                    key={company.id}
                  >
                    <p className="font-semibold text-emerald-950">
                      {company.tradeName}
                    </p>
                    <p className="mt-1 text-xs text-emerald-700">
                      {company.cnpj}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-500">
                  Nenhuma empresa vinculada ainda.
                </p>
              )}
            </div>
          </section>
        </aside>

        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Painel do representante
          </h1>
          {!linkedCompanies.length ? (
            <section className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <Link2 className="mx-auto text-slate-400" size={34} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                Nenhum catalogo disponivel
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Este painel fica vazio ate o representante usar um token de uma
                empresa. Depois do vinculo, aparecem apenas catalogos liberados.
              </p>
            </section>
          ) : (
            <>
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="font-semibold text-slate-950">
                  Catalogos liberados
                </h2>
                <div className="mt-4 space-y-3">
                  {releasedCatalogs.length ? (
                    releasedCatalogs.map((catalog) => {
                      const link = `http://127.0.0.1:5177/c/${catalog.slug}/${activeRepresentative.id}`

                      return (
                        <div
                          className="flex flex-col gap-3 rounded-md border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                          key={`${catalog.companyId}-${catalog.id}`}
                        >
                          <div>
                            <span className="font-semibold text-slate-800">
                              {catalog.name}
                            </span>
                            <p className="mt-1 text-sm text-slate-500">
                              {catalog.company?.tradeName} - {catalog.productsCount}{' '}
                              produtos
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
                              href={link}
                              title="Abrir catalogo"
                            >
                              <Link2 size={16} aria-hidden="true" />
                            </a>
                            <a
                              className="grid size-9 place-items-center rounded-md bg-[#1f9d68] text-white"
                              href={`https://wa.me/?text=${encodeURIComponent(link)}`}
                              title="Compartilhar no WhatsApp"
                            >
                              <Send size={16} aria-hidden="true" />
                            </a>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="py-4 text-sm text-slate-500">
                      A empresa esta vinculada, mas ainda nao liberou catalogos.
                    </p>
                  )}
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
            </>
          )}
        </div>
      </section>
    </main>
  )
}
