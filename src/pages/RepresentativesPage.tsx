import { Copy, KeyRound, MailPlus, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { companies, representatives } from '../data/mock'
import {
  createCompanyInviteToken,
  getCompanyRepresentativeLinks,
  getCurrentCompany,
  getInviteTokens,
} from '../lib/mockStore'

export function RepresentativesPage() {
  const company = getCurrentCompany() ?? companies[0]
  const [tokens, setTokens] = useState(getInviteTokens())
  const [links, setLinks] = useState(getCompanyRepresentativeLinks(company.id))

  function handleCreateToken() {
    createCompanyInviteToken(company.id)
    setTokens(getInviteTokens())
  }

  function handleRefresh() {
    setTokens(getInviteTokens())
    setLinks(getCompanyRepresentativeLinks(company.id))
  }

  const companyTokens = tokens.filter((token) => token.companyId === company.id)

  return (
    <>
      <PageHeader
        eyebrow="Representantes"
        title="Cadastro de fornecedor e tokens"
        description="A empresa gera um token e envia ao representante. Sem esse token, o representante nao acessa nenhum catalogo."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
              onClick={handleRefresh}
              type="button"
            >
              <RefreshCcw size={18} aria-hidden="true" />
              Atualizar
            </button>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
              onClick={handleCreateToken}
              type="button"
            >
              <MailPlus size={18} aria-hidden="true" />
              Gerar token
            </button>
          </div>
        }
      />
      <section className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[420px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">
            Tokens de vinculo da empresa
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Envie um token ao fornecedor. Ele usa no painel gratuito de
            representante para se vincular a {company.tradeName}.
          </p>
          <div className="mt-4 space-y-3">
            {companyTokens.length ? (
              companyTokens.map((token) => (
                <article
                  className="rounded-md border border-slate-200 bg-slate-50 p-3"
                  key={token.token}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-slate-950">
                        {token.token}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {token.usedByRepresentativeId
                          ? 'Ja usado'
                          : 'Disponivel'}
                      </p>
                    </div>
                    <button
                      className="grid size-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600"
                      title="Copiar token"
                      type="button"
                    >
                      <Copy size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-slate-300 p-4 text-center">
                <KeyRound
                  className="mx-auto text-slate-400"
                  size={22}
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-slate-500">
                  Nenhum token gerado ainda.
                </p>
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Representantes vinculados
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              {links.length ? (
                links.map((link) => {
                  const representative = representatives.find(
                    (item) => item.id === link.representativeId,
                  )

                  return (
                    <div
                      className="grid gap-2 py-3 sm:grid-cols-[1fr_auto]"
                      key={`${link.representativeId}-${link.companyId}`}
                    >
                      <div>
                        <p className="font-semibold text-slate-950">
                          {representative?.fullName ?? link.representativeId}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Token usado: {link.token}
                        </p>
                      </div>
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        Vinculado
                      </span>
                    </div>
                  )
                })
              ) : (
                <p className="py-4 text-sm text-slate-500">
                  Nenhum representante vinculado a esta empresa ainda.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Representantes ficticios para teste
            </h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {representatives.map((representative) => (
                <article
                  className="rounded-md border border-slate-200 p-3"
                  key={representative.id}
                >
                  <p className="font-semibold text-slate-950">
                    {representative.fullName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {representative.email}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Senha: {representative.password}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  )
}
