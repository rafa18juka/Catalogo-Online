import { Eye, GripVertical, Palette, Send, UploadCloud } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import {
  catalogDesignPresets,
  catalogSections,
  products,
  selectedCatalogDesignId,
} from '../data/mock'

export function CatalogsPage() {
  const selectedDesign = catalogDesignPresets.find(
    (design) => design.id === selectedCatalogDesignId,
  )

  return (
    <>
      <PageHeader
        eyebrow="Catalogos"
        title="Rascunho e publicacao"
        description="Organize secoes, defina ordem, revise o preview e publique uma versao leve para o catalogo publico."
        action={
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            type="button"
          >
            <UploadCloud size={18} aria-hidden="true" />
            Publicar versao
          </button>
        }
      />
      <section className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Catalogo Utilidades 2026
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Slug publico: utilidades-2026
          </p>
          {selectedDesign ? (
            <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-teal-800">
                <Palette size={16} aria-hidden="true" />
                Design em uso
              </div>
              <p className="mt-1 text-sm text-teal-700">{selectedDesign.name}</p>
            </div>
          ) : null}
          <div className="mt-5 space-y-2">
            {catalogSections.map((section) => (
              <button
                className="flex h-11 w-full items-center justify-between rounded-md border border-slate-200 px-3 text-left text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
                key={section}
                type="button"
              >
                {section}
                <GripVertical size={16} aria-hidden="true" />
              </button>
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
              Produtos no catalogo
            </h2>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-600">
              {products.length} itens
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {products.map((product, index) => (
              <div
                className="grid grid-cols-[24px_64px_1fr_auto] items-center gap-3 py-3"
                key={product.id}
              >
                <GripVertical size={16} className="text-slate-400" />
                <img
                  alt={product.title}
                  className="size-16 rounded-md object-cover"
                  height="64"
                  loading="lazy"
                  src={product.image}
                  width="64"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">
                    {product.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    Ordem {index + 1} - {product.category}
                  </p>
                </div>
                <button
                  className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 hover:border-teal-600 hover:text-teal-700"
                  title="Enviar link"
                  type="button"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
