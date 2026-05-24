import { Eye, Palette, Plus, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { catalogDesignPresets, selectedCatalogDesignId } from '../data/mock'
import {
  createCompanyCatalog,
  getCatalogsWithReleaseState,
  getCurrentCompany,
  setCatalogRelease,
} from '../lib/mockStore'

export function CatalogsPage() {
  const company = getCurrentCompany()
  const [companyCatalogs, setCompanyCatalogs] = useState(
    getCatalogsWithReleaseState(company?.id ?? ''),
  )
  const selectedDesign = catalogDesignPresets.find(
    (design) => design.id === selectedCatalogDesignId,
  )

  function refreshCatalogs() {
    setCompanyCatalogs(getCatalogsWithReleaseState(company?.id ?? ''))
  }

  function handleToggleCatalog(catalogId: string, isReleased: boolean) {
    setCatalogRelease(catalogId, isReleased)
    refreshCatalogs()
  }

  function handleCreateCatalog() {
    if (!company) return

    createCompanyCatalog(company.id)
    refreshCatalogs()
  }

  return (
    <>
      <PageHeader
        eyebrow="Catalogos"
        title="Rascunho e publicacao"
        description="A empresa comeca sem catalogos. Crie um catalogo vazio quando estiver pronto para montar produtos."
        action={
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            onClick={handleCreateCatalog}
            type="button"
          >
            <Plus size={18} aria-hidden="true" />
            Criar catalogo
          </button>
        }
      />
      <section className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Design selecionado
          </h2>
          {selectedDesign ? (
            <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-teal-800">
                <Palette size={16} aria-hidden="true" />
                {selectedDesign.name}
              </div>
              <p className="mt-1 text-sm text-teal-700">
                Usado nos catalogos publicados quando a empresa escolher este
                preset.
              </p>
            </div>
          ) : null}
          <button
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
            type="button"
          >
            <Eye size={18} aria-hidden="true" />
            Preview
          </button>
        </aside>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-950">
              Catalogos da empresa
            </h2>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-600">
              {companyCatalogs.length} catalogos
            </span>
          </div>
          {companyCatalogs.length ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {companyCatalogs.map((catalog) => (
                <article
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  key={catalog.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {catalog.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        /c/{catalog.slug} - {catalog.productsCount} produtos
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">
                        Liberar
                      </span>
                      <input
                        checked={catalog.isReleasedToRepresentatives}
                        className="size-4 accent-teal-700"
                        onChange={(event) =>
                          handleToggleCatalog(catalog.id, event.target.checked)
                        }
                        type="checkbox"
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <UploadCloud
                className="mx-auto text-slate-400"
                size={28}
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-semibold text-slate-950">
                Nenhum catalogo criado
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Crie um catalogo vazio, depois cadastre produtos e publique
                quando estiver pronto.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
