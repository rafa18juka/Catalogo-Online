import { CheckCircle2, Eye, Palette } from 'lucide-react'
import { DesignPreview } from '../components/DesignPreview'
import { PageHeader } from '../components/PageHeader'
import { selectedCatalogDesignId } from '../data/mock'
import { getCatalogDesignPresets } from '../lib/mockStore'

export function CompanyDesignsPage() {
  const catalogDesignPresets = getCatalogDesignPresets()

  return (
    <>
      <PageHeader
        eyebrow="Design do catalogo"
        title="Escolha o preset publicado"
        description="A empresa escolhe aqui qual design aprovado pelo dev sera usado no catalogo online."
      />
      <section className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-4 lg:grid-cols-2">
          {catalogDesignPresets.map((design) => {
            const isSelected = design.id === selectedCatalogDesignId

            return (
              <article
                className={`rounded-lg border bg-white p-4 shadow-sm ${
                  isSelected ? 'border-teal-600' : 'border-slate-200'
                }`}
                key={design.id}
              >
                <DesignPreview design={design} />
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-950">
                      {design.name}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {design.description}
                    </p>
                  </div>
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">
                      <CheckCircle2 size={14} aria-hidden="true" />
                      Em uso
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
                    type="button"
                  >
                    <Eye size={16} aria-hidden="true" />
                    Preview
                  </button>
                  <button
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-teal-700 px-3 text-sm font-semibold text-white hover:bg-teal-800"
                    type="button"
                  >
                    <Palette size={16} aria-hidden="true" />
                    Usar design
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Como funciona</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
            <p>
              O dev cria e publica presets de design. A empresa escolhe um
              preset por catalogo e publica uma versao.
            </p>
            <p>
              O catalogo online carrega o manifesto publicado com produtos,
              imagens otimizadas e o preset escolhido.
            </p>
            <p>
              Representantes compartilham o link da empresa, sem controlar o
              design nem os dados principais.
            </p>
          </div>
        </aside>
      </section>
    </>
  )
}
