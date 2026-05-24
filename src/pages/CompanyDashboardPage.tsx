import { Boxes, FileText, Gauge, Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import {
  getCatalogsWithReleaseState,
  getCompanyProducts,
  getCompanyRecentClients,
  getCompanyRepresentativeLinks,
  getCurrentCompany,
} from '../lib/mockStore'

export function CompanyDashboardPage() {
  const company = getCurrentCompany()
  const catalogs = getCatalogsWithReleaseState(company?.id ?? '')
  const products = getCompanyProducts()
  const recentClients = getCompanyRecentClients()
  const representatives = getCompanyRepresentativeLinks(company?.id ?? '')
  const metrics = [
    {
      label: 'Catalogos ativos',
      value: String(catalogs.length),
      trend: `${catalogs.filter((catalog) => catalog.isReleasedToRepresentatives).length} liberados para reps`,
      icon: FileText,
      tone: 'bg-teal-50 text-teal-700',
    },
    {
      label: 'Produtos',
      value: String(products.length),
      trend: 'Nenhum produto cadastrado',
      icon: Boxes,
      tone: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Representantes',
      value: String(representatives.length),
      trend: 'Vinculos ativos',
      icon: Users,
      tone: 'bg-sky-50 text-sky-700',
    },
    {
      label: 'Clientes recentes',
      value: String(recentClients.length),
      trend: 'Sem visitas ainda',
      icon: Gauge,
      tone: 'bg-rose-50 text-rose-700',
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Painel da empresa"
        title="Operacao do catalogo"
        description="Empresa recem-cadastrada comeca em branco: sem produtos, clientes, catalogos ou representantes."
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
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Nenhum produto cadastrado
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Cadastre produtos e imagens para montar os primeiros catalogos.
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Nenhum cliente recente
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            As visitas vao aparecer aqui depois que um catalogo publico for
            compartilhado e acessado.
          </p>
        </div>
      </section>
    </>
  )
}
