import { useParams, useSearchParams } from 'react-router-dom'
import { DevCatalogRenderDocument } from '../components/DevCatalogVisualizer'
import {
  defaultProductDisplayOptions,
  productDisplayFields,
  type ProductDisplayOptions,
} from '../data/mock'
import { getCatalogDesignPresets } from '../lib/mockStore'

function readDisplayOptionsFromSearch(hiddenFields: string | null) {
  const hiddenSet = new Set((hiddenFields ?? '').split(',').filter(Boolean))

  return productDisplayFields.reduce(
    (options, field) => ({
      ...options,
      [field.key]: !hiddenSet.has(field.key),
    }),
    { ...defaultProductDisplayOptions } as ProductDisplayOptions,
  )
}

export function DevCatalogRenderPage() {
  const { designId } = useParams()
  const [searchParams] = useSearchParams()
  const designs = getCatalogDesignPresets()
  const selectedDesign =
    designs.find((design) => design.id === designId) ?? designs[0]
  const displayOptions = readDisplayOptionsFromSearch(searchParams.get('hide'))

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
      <DevCatalogRenderDocument
        design={selectedDesign}
        displayOptions={displayOptions}
      />
    </main>
  )
}
