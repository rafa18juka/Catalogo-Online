import { useParams } from 'react-router-dom'
import { DevCatalogRenderDocument } from '../components/DevCatalogVisualizer'
import { getCatalogDesignPresets } from '../lib/mockStore'

export function DevCatalogRenderPage() {
  const { designId } = useParams()
  const designs = getCatalogDesignPresets()
  const selectedDesign =
    designs.find((design) => design.id === designId) ?? designs[0]

  if (!selectedDesign) {
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-200 p-6">
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-950">
            Nenhum modelo disponivel
          </h1>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-200 px-4 py-8 print:bg-white print:p-0">
      <DevCatalogRenderDocument design={selectedDesign} />
    </main>
  )
}
