import { Eye, Palette, Plus, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import {
  catalogCoverPresets,
  productDisplayFields,
  type ProductDisplayOptions,
} from '../data/mock'
import {
  createCompanyCatalog,
  getCatalogsWithReleaseState,
  getCurrentCompany,
  getPublishedCatalogDesignPresets,
  setCatalogRelease,
  updateCompanyCatalogDesign,
  updateCompanyCatalogCover,
  updateCompanyCatalogDisplayOptions,
} from '../lib/mockStore'

export function CatalogsPage() {
  const company = getCurrentCompany()
  const [companyCatalogs, setCompanyCatalogs] = useState(
    getCatalogsWithReleaseState(company?.id ?? ''),
  )
  const publishedDesigns = getPublishedCatalogDesignPresets()

  function refreshCatalogs() {
    setCompanyCatalogs(getCatalogsWithReleaseState(company?.id ?? ''))
  }

  function handleToggleCatalog(catalogId: string, isReleased: boolean) {
    setCatalogRelease(catalogId, isReleased)
    refreshCatalogs()
  }

  function handleDesignChange(catalogId: string, designPresetId: string) {
    updateCompanyCatalogDesign(catalogId, designPresetId)
    refreshCatalogs()
  }

  function handleCoverPresetChange(catalogId: string, presetId: string) {
    const preset =
      catalogCoverPresets.find((item) => item.id === presetId) ??
      catalogCoverPresets[0]

    updateCompanyCatalogCover(catalogId, {
      coverTypeId: preset.id,
      coverTitle: preset.title,
      coverDescription: preset.description,
    })
    refreshCatalogs()
  }

  function handleCoverTextChange(
    catalogId: string,
    current: {
      coverTitle: string
      coverDescription: string
    },
    key: 'coverTitle' | 'coverDescription',
    value: string,
  ) {
    updateCompanyCatalogCover(catalogId, {
      coverTypeId: 'custom',
      coverTitle: key === 'coverTitle' ? value : current.coverTitle,
      coverDescription:
        key === 'coverDescription' ? value : current.coverDescription,
    })
    refreshCatalogs()
  }

  function handleDisplayOptionChange(
    catalogId: string,
    options: ProductDisplayOptions,
    key: keyof ProductDisplayOptions,
    value: boolean,
  ) {
    updateCompanyCatalogDisplayOptions(catalogId, { ...options, [key]: value })
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
        title="Design, campos e publicacao"
        description="Crie catalogos, escolha um template publicado e oculte apenas os campos que nao devem aparecer."
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
            Templates publicados
          </h2>
          <div className="mt-4 space-y-3">
            {publishedDesigns.map((design) => (
              <div
                className="rounded-lg border border-teal-100 bg-teal-50 p-3"
                key={design.id}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-800">
                  <Palette size={16} aria-hidden="true" />
                  {design.name}
                </div>
                <p className="mt-1 text-sm text-teal-700">
                  {design.description}
                </p>
              </div>
            ))}
          </div>
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
            <div className="grid gap-3">
              {companyCatalogs.map((catalog) => {
                const selectedDesign = publishedDesigns.find(
                  (design) => design.id === catalog.designPresetId,
                )

                return (
                  <article
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    key={catalog.id}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {catalog.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          /c/{catalog.slug} - {catalog.productsCount} produtos
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Design: {selectedDesign?.name ?? 'nao selecionado'}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                          onChange={(event) =>
                            handleDesignChange(catalog.id, event.target.value)
                          }
                          value={catalog.designPresetId}
                        >
                          {publishedDesigns.map((design) => (
                            <option key={design.id} value={design.id}>
                              {design.name}
                            </option>
                          ))}
                        </select>
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <span className="text-xs font-semibold text-slate-600">
                            Liberar
                          </span>
                          <input
                            checked={catalog.isReleasedToRepresentatives}
                            className="size-4 accent-teal-700"
                            onChange={(event) =>
                              handleToggleCatalog(
                                catalog.id,
                                event.target.checked,
                              )
                            }
                            type="checkbox"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-sm font-semibold text-slate-950">
                        Chamada da capa
                      </p>
                      <div className="mt-3 grid gap-3 lg:grid-cols-[220px_1fr]">
                        <label className="block">
                          <span className="text-xs font-semibold text-slate-600">
                            Tipo
                          </span>
                          <select
                            className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                            onChange={(event) =>
                              handleCoverPresetChange(
                                catalog.id,
                                event.target.value,
                              )
                            }
                            value={catalog.coverTypeId}
                          >
                            {catalogCoverPresets.map((preset) => (
                              <option key={preset.id} value={preset.id}>
                                {preset.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs font-semibold text-slate-600">
                            Titulo da capa
                          </span>
                          <input
                            className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
                            onChange={(event) =>
                              handleCoverTextChange(
                                catalog.id,
                                catalog,
                                'coverTitle',
                                event.target.value,
                              )
                            }
                            value={catalog.coverTitle}
                          />
                        </label>
                      </div>
                      <label className="mt-3 block">
                        <span className="text-xs font-semibold text-slate-600">
                          Texto da capa
                        </span>
                        <textarea
                          className="mt-1 min-h-20 w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
                          onChange={(event) =>
                            handleCoverTextChange(
                              catalog.id,
                              catalog,
                              'coverDescription',
                              event.target.value,
                            )
                          }
                          value={catalog.coverDescription}
                        />
                      </label>
                    </div>

                    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-sm font-semibold text-slate-950">
                        Campos visiveis no catalogo
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {productDisplayFields.map((field) => (
                          <label
                            className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                            key={field.key}
                          >
                            <span>{field.label}</span>
                            <input
                              checked={catalog.displayOptions[field.key]}
                              className="size-4 accent-teal-700"
                              onChange={(event) =>
                                handleDisplayOptionChange(
                                  catalog.id,
                                  catalog.displayOptions,
                                  field.key,
                                  event.target.checked,
                                )
                              }
                              type="checkbox"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </article>
                )
              })}
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
