import { Copy, KeyRound, MailPlus, RefreshCcw, XCircle } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import {
  createCompanyInviteToken,
  getCompanyRepresentativeLinks,
  getCurrentCompany,
  getInviteTokens,
  getRepresentationFirms,
  getRepresentatives,
  revokeRepresentativeLink,
} from '../lib/mockStore'

export function RepresentativesPage() {
  const company = getCurrentCompany()
  const [tokens, setTokens] = useState(getInviteTokens())
  const [links, setLinks] = useState(
    getCompanyRepresentativeLinks(company?.id ?? ''),
  )

  if (!company) return null

  const activeCompany = company

  function refresh() {
    setTokens(getInviteTokens())
    setLinks(getCompanyRepresentativeLinks(activeCompany.id))
  }

  function handleCreateToken() {
    createCompanyInviteToken(activeCompany.id)
    refresh()
  }

  function handleRevoke(
    representativeId: string,
    representativeType: 'autonomous' | 'representation_firm',
  ) {
    revokeRepresentativeLink(activeCompany.id, representativeId, representativeType)
    refresh()
  }

  const companyTokens = tokens.filter((token) => token.companyId === activeCompany.id)
  const representatives = getRepresentatives()
  const firms = getRepresentationFirms()

  return (
    <>
      <PageHeader
        eyebrow="Representantes"
        title="Tokens e vinculos"
        description="A empresa gera um token para o fornecedor. Depois do vinculo, pode revogar o acesso a qualquer momento."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
              onClick={refresh}
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
          <h2 className="font-semibold text-slate-950">Tokens gerados</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Envie um token ao representante autonomo ou firma de representacoes.
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
                        {token.usedById ? 'Ja usado' : 'Disponivel'}
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

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">
            Representantes vinculados
          </h2>
          <div className="mt-4 divide-y divide-slate-100">
            {links.length ? (
              links.map((link) => {
                const representative =
                  link.representativeType === 'autonomous'
                    ? representatives.find((item) => item.id === link.representativeId)
                    : undefined
                const firm =
                  link.representativeType === 'representation_firm'
                    ? firms.find((item) => item.id === link.representativeId)
                    : representative?.firmId
                      ? firms.find((item) => item.id === representative.firmId)
                      : undefined

                return (
                  <div
                    className="grid gap-3 py-3 sm:grid-cols-[1fr_auto]"
                    key={`${link.representativeId}-${link.companyId}`}
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {representative?.fullName ?? firm?.tradeName ?? 'Vinculo'}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Empresa do representante:{' '}
                        {firm?.tradeName ?? 'Representante autonomo'}
                      </p>
                    </div>
                    <button
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      onClick={() =>
                        handleRevoke(link.representativeId, link.representativeType)
                      }
                      type="button"
                    >
                      <XCircle size={16} aria-hidden="true" />
                      Revogar
                    </button>
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
      </section>
    </>
  )
}
