import { Activity, Clock, Copy, Image } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { products } from '../data/mock'

const signals = [
  ['Galerias abertas', '284', Image],
  ['Titulos copiados', '61', Copy],
  ['Tempo medio', '3min 48s', Clock],
  ['Clientes quentes', '31', Activity],
]

export function ReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Relatorios"
        title="Interesse do cliente"
        description="Resumo comercial com sinais consolidados, sem expor microcliques ou criar uma experiencia invasiva."
      />
      <section className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {signals.map(([label, value, Icon]) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              key={label as string}
            >
              <Icon className="text-teal-700" size={20} aria-hidden="true" />
              <p className="mt-4 text-sm text-slate-500">{label as string}</p>
              <strong className="mt-1 block text-2xl text-slate-950">
                {value as string}
              </strong>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Ranking por possivel interesse
          </h2>
          <div className="mt-4 space-y-4">
            {products.map((product) => (
              <div key={product.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-800">{product.title}</p>
                  <span className="text-sm font-semibold text-teal-700">
                    {product.attention}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-teal-600"
                    style={{ width: `${product.attention}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
