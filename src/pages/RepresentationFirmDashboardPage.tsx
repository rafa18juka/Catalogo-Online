import { Building2, Copy, Link2, LogOut, Send, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import {
  clearCurrentRepresentationFirm,
  getCurrentRepresentationFirm,
  getLinkedCompaniesForRepresentationFirm,
  getReleasedCatalogsForRepresentationFirm,
  getRepresentatives,
  linkAccessWithToken,
  registerFirmRepresentative,
} from '../lib/mockStore'

export function RepresentationFirmDashboardPage() {
  const navigate = useNavigate()
  const firm = getCurrentRepresentationFirm()
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [repForm, setRepForm] = useState({
    fullName: '',
    cpf: '',
    email: '',
    password: '',
    phone: '',
  })
  const [version, setVersion] = useState(0)

  if (!firm) {
    return <Navigate to="/representante/login" replace />
  }

  const activeFirm = firm
  const firmRepresentatives = getRepresentatives().filter(
    (representative) => representative.firmId === activeFirm.id,
  )
  const linkedCompanies = getLinkedCompaniesForRepresentationFirm(activeFirm.id)
  const catalogs = getReleasedCatalogsForRepresentationFirm(activeFirm.id)

  function handleLink() {
    const result = linkAccessWithToken(activeFirm.id, 'representation_firm', token)
    setMessage(result.message)
    setToken('')
    setVersion((current) => current + 1)
  }

  function handleCreateRepresentative() {
    if (!repForm.fullName || !repForm.cpf || !repForm.email || !repForm.password) {
      setMessage('Preencha nome, CPF, email e senha do representante.')
      return
    }

    registerFirmRepresentative(activeFirm.id, repForm)
    setRepForm({ fullName: '', cpf: '', email: '', password: '', phone: '' })
    setVersion((current) => current + 1)
  }

  function handleLogout() {
    clearCurrentRepresentationFirm()
    navigate('/representante/login')
  }

  return (
    <main className="min-h-screen bg-[#f6f7f2]" data-version={version}>
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Brand />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 sm:inline-flex">
              {activeFirm.tradeName}
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
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-6 xl:grid-cols-[420px_1fr]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <Building2 className="text-teal-700" size={24} aria-hidden="true" />
            <h1 className="mt-4 text-xl font-semibold text-slate-950">
              Firma de representacoes
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {activeFirm.legalName} - {activeFirm.cnpj}
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">Vincular empresa</h2>
            <input
              className="mt-4 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm uppercase outline-none focus:border-teal-600 focus:bg-white"
              onChange={(event) => setToken(event.target.value)}
              placeholder="FORN-XXXX-0000"
              value={token}
            />
            <button
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
              onClick={handleLink}
              type="button"
            >
              <Link2 size={18} aria-hidden="true" />
              Vincular
            </button>
            {message ? (
              <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                {message}
              </p>
            ) : null}
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Novo representante da firma
            </h2>
            <div className="mt-4 space-y-3">
              {(
                [
                  ['fullName', 'Nome completo'],
                  ['cpf', 'CPF'],
                  ['email', 'Email'],
                  ['password', 'Senha'],
                  ['phone', 'Telefone'],
                ] as const
              ).map(([name, label]) => (
                <input
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  key={name}
                  onChange={(event) =>
                    setRepForm((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                  placeholder={label}
                  type={name === 'password' ? 'password' : 'text'}
                  value={repForm[name]}
                />
              ))}
            </div>
            <button
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
              onClick={handleCreateRepresentative}
              type="button"
            >
              <UserPlus size={18} aria-hidden="true" />
              Cadastrar representante
            </button>
          </section>
        </aside>
        <div className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Empresas vinculadas
            </h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {linkedCompanies.length ? (
                linkedCompanies.map((company) => (
                  <article
                    className="rounded-md border border-emerald-100 bg-emerald-50 p-3"
                    key={company.id}
                  >
                    <p className="font-semibold text-emerald-950">
                      {company.tradeName}
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      {company.cnpj}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhuma empresa vinculada ainda.
                </p>
              )}
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Representantes da firma
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              {firmRepresentatives.length ? (
                firmRepresentatives.map((representative) => (
                  <div className="py-3" key={representative.id}>
                    <p className="font-semibold text-slate-950">
                      {representative.fullName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {representative.email} - CPF {representative.cpf}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-slate-500">
                  Cadastre o primeiro representante da firma.
                </p>
              )}
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Catalogos das empresas atendidas
            </h2>
            <div className="mt-4 space-y-3">
              {catalogs.length ? (
                catalogs.map((catalog) => {
                      const link = `http://127.0.0.1:5177/c/${catalog.slug}/${activeFirm.id}`

                  return (
                    <div
                      className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3"
                      key={catalog.id}
                    >
                      <div>
                        <p className="font-semibold text-slate-950">
                          {catalog.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {catalog.company?.tradeName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600"
                          type="button"
                        >
                          <Copy size={16} aria-hidden="true" />
                        </button>
                        <a
                          className="grid size-9 place-items-center rounded-md bg-[#1f9d68] text-white"
                          href={`https://wa.me/?text=${encodeURIComponent(link)}`}
                        >
                          <Send size={16} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhum catalogo liberado ainda.
                </p>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
