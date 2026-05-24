import {
  AlertTriangle,
  Building2,
  CreditCard,
  Database,
  HardDrive,
  Plus,
  RadioTower,
  Upload,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Brand } from '../components/Brand'
import { DesignPreview } from '../components/DesignPreview'
import {
  createCatalogDesignPreset,
  getCompanyCatalogCount,
  getCompanies,
  getCatalogDesignPresets,
  getRepresentationFirms,
  getRepresentativeLinks,
  getRepresentatives,
} from '../lib/mockStore'

const devEvents = [
  'Empresa Casa Verde Atacado aguardando catalogos liberados para reps',
  'Stripe pronto para webhook de confirmacao de assinatura',
  'Representante sem vinculo nao visualiza catalogos',
  'Upload de design publicado como preset Atacado Limpo',
]

export function AdminPage() {
  const [manualCompanyName, setManualCompanyName] = useState('')
  const [designs, setDesigns] = useState(getCatalogDesignPresets())
  const [designForm, setDesignForm] = useState({
    name: '',
    audience: '',
    description: '',
    primaryColor: '#0f766e',
    accentColor: '#d97706',
    backgroundColor: '#f6f7f2',
    surfaceColor: '#ffffff',
    textColor: '#0f172a',
  })
  const links = getRepresentativeLinks()
  const companies = getCompanies()
  const representatives = getRepresentatives()
  const firms = getRepresentationFirms()

  const adminMetrics = [
    ['Empresas cadastradas', String(companies.length), Database, 'text-sky-700'],
    [
      'Representantes',
      String(representatives.length + firms.length),
      Users,
      'text-teal-700',
    ],
    ['Vinculos ativos', String(links.length), RadioTower, 'text-rose-700'],
    ['Storage usado', '88 GB', HardDrive, 'text-amber-700'],
  ] as const

  function updateDesignField(name: keyof typeof designForm, value: string) {
    setDesignForm((current) => ({ ...current, [name]: value }))
  }

  function handleCreateDesign() {
    if (!designForm.name) return

    createCatalogDesignPreset({
      name: designForm.name,
      audience: designForm.audience || 'Empresas gerais',
      description: designForm.description || 'Preset criado pelo painel dev.',
      coverStyle: 'Cabecalho configuravel',
      gridStyle: 'Grade de cards',
      primaryColor: designForm.primaryColor,
      accentColor: designForm.accentColor,
      backgroundColor: designForm.backgroundColor,
      surfaceColor: designForm.surfaceColor,
      textColor: designForm.textColor,
    })
    setDesigns(getCatalogDesignPresets())
    setDesignForm((current) => ({ ...current, name: '', audience: '', description: '' }))
  }

  return (
    <main className="min-h-screen bg-[#f6f7f2]">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Brand />
          <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            Painel dev - porta 5174
          </span>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Dev/admin
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">
              Empresas, representantes, pagamentos e designs
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              O dev observa o que empresas e representantes fazem, recebe logs,
              libera usuarios manualmente e publica presets de catalogo.
            </p>
          </div>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            type="button"
          >
            <Upload size={18} aria-hidden="true" />
            Upload de design
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminMetrics.map(([label, value, Icon, tone]) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              key={label}
            >
              <Icon className={tone} size={22} aria-hidden="true" />
              <p className="mt-4 text-sm text-slate-500">{label}</p>
              <strong className="mt-1 block text-2xl text-slate-950">
                {value}
              </strong>
            </article>
          ))}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
          <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-950">
                    Empresas cadastradas
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Acesso ao painel depende de pagamento confirmado via Stripe
                    ou liberacao manual.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    className="h-9 w-56 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                    onChange={(event) => setManualCompanyName(event.target.value)}
                    placeholder="Empresa via WhatsApp"
                    value={manualCompanyName}
                  />
                  <button
                    className="grid size-9 place-items-center rounded-md bg-teal-700 text-white"
                    title="Criar empresa manual"
                    type="button"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                <div className="grid grid-cols-[1.2fr_1fr_160px_130px] bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <span>Empresa</span>
                  <span>CNPJ</span>
                  <span>Pagamento</span>
                  <span>Catalogos</span>
                </div>
                {companies.map((company) => (
                  <div
                    className="grid grid-cols-[1.2fr_1fr_160px_130px] border-t border-slate-100 px-3 py-3 text-sm"
                    key={company.id}
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {company.tradeName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {company.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {company.legalName}
                      </p>
                    </div>
                    <span className="text-slate-600">{company.cnpj}</span>
                    <span>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          company.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : company.paymentStatus === 'manual_active'
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {company.paymentStatus}
                      </span>
                    </span>
                    <span className="text-slate-600">
                      {getCompanyCatalogCount(company.id)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-950">
                Representantes cadastrados
              </h2>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {representatives.map((representative) => {
                  const entityId = representative.firmId ?? representative.id
                  const entityType = representative.firmId
                    ? 'representation_firm'
                    : 'autonomous'
                  const linkedCompanies = links
                    .filter(
                      (link) =>
                        link.representativeId === entityId &&
                        link.representativeType === entityType &&
                        link.status === 'active',
                    )
                    .map((link) =>
                      companies.find((company) => company.id === link.companyId),
                    )
                    .filter(Boolean)

                  return (
                    <article
                      className="rounded-lg border border-slate-200 p-3"
                      key={representative.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-950">
                            {representative.fullName}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {representative.email}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            CPF {representative.cpf}
                          </p>
                        </div>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                          {linkedCompanies.length} empresas
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">
                        Vinculos:{' '}
                        {linkedCompanies.length
                          ? linkedCompanies
                              .map((company) => company?.tradeName)
                              .join(', ')
                          : 'nenhum'}
                      </p>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <CreditCard className="text-teal-700" size={22} aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-slate-950">
                Pre-conexao Stripe
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                O fluxo previsto e: compra do plano no site, webhook Stripe
                confirma pagamento, empresa ganha acesso ao painel. Vendas por
                WhatsApp podem ser liberadas manualmente aqui.
              </p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-950">Criador de design</h2>
              <div className="mt-4 space-y-3">
                <input
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  onChange={(event) => updateDesignField('name', event.target.value)}
                  placeholder="Nome do preset"
                  value={designForm.name}
                />
                <input
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  onChange={(event) =>
                    updateDesignField('audience', event.target.value)
                  }
                  placeholder="Publico/segmento"
                  value={designForm.audience}
                />
                <textarea
                  className="min-h-20 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:bg-white"
                  onChange={(event) =>
                    updateDesignField('description', event.target.value)
                  }
                  placeholder="Descricao"
                  value={designForm.description}
                />
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      ['primaryColor', 'Primaria'],
                      ['accentColor', 'Destaque'],
                      ['backgroundColor', 'Fundo'],
                      ['surfaceColor', 'Cards'],
                      ['textColor', 'Texto'],
                    ] as const
                  ).map(([name, label]) => (
                    <label className="text-sm font-semibold text-slate-700" key={name}>
                      {label}
                      <input
                        className="mt-2 h-10 w-full rounded-md border border-slate-200"
                        onChange={(event) => updateDesignField(name, event.target.value)}
                        type="color"
                        value={designForm[name]}
                      />
                    </label>
                  ))}
                </div>
                <button
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
                  onClick={handleCreateDesign}
                  type="button"
                >
                  <Plus size={16} aria-hidden="true" />
                  Criar design
                </button>
              </div>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-950">Presets publicados</h2>
              <div className="mt-4 space-y-4">
                {designs.slice(0, 3).map((design) => (
                  <DesignPreview design={design} key={design.id} />
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-950">Atividade recente</h2>
              <div className="mt-4 divide-y divide-slate-100">
                {devEvents.map((event) => (
                  <p className="py-3 text-sm leading-6 text-slate-600" key={event}>
                    {event}
                  </p>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle
                className="text-amber-700"
                size={22}
                aria-hidden="true"
              />
              <h2 className="mt-4 font-semibold text-amber-950">Logs de erro</h2>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Falhas de upload, API lenta e problemas no catalogo publico
                aparecem aqui para o dev agir antes do cliente reclamar.
              </p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <Building2 className="text-sky-700" size={22} aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-slate-950">
                Cadastro manual
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                O formulario ja esta posicionado para criar empresas manualmente
                quando a venda vier pelo WhatsApp.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
