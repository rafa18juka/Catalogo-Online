import { CheckCircle2, CreditCard, Database, WandSparkles } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const limits = [
  ['Produtos', '428 de 1.000', 43],
  ['Catalogos', '8 de 10', 80],
  ['Representantes', '18 de 25', 72],
  ['Storage', '4.2 GB de 20 GB', 21],
  ['Creditos IA', '120 de 300', 40],
]

export function PlanPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plano e consumo"
        title="Plano Pro"
        description="Controle de limites para produtos, catalogos, representantes, storage, eventos e creditos de IA."
        action={
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            type="button"
          >
            <CreditCard size={18} aria-hidden="true" />
            Gerenciar
          </button>
        }
      />
      <section className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Limites do plano
          </h2>
          <div className="mt-5 space-y-5">
            {limits.map(([label, text, value]) => (
              <div key={label as string}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-800">{label as string}</p>
                  <span className="text-sm text-slate-500">{text as string}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-teal-600"
                    style={{ width: `${value as number}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <Database className="text-sky-700" size={22} aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-950">
              Banco preparado
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              A CLI do Supabase entra na proxima fase para criar migracoes,
              RLS e buckets.
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <WandSparkles
              className="text-amber-700"
              size={22}
              aria-hidden="true"
            />
            <h2 className="mt-4 font-semibold text-slate-950">IA por creditos</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Jobs de imagem e texto serao registrados com custo, status e
              devolucao automatica em caso de falha.
            </p>
          </article>
          <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2
              className="text-emerald-700"
              size={22}
              aria-hidden="true"
            />
            <h2 className="mt-4 font-semibold text-emerald-950">
              Publicacao estavel
            </h2>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              Catalogos publicados terao versoes independentes do rascunho.
            </p>
          </article>
        </aside>
      </section>
    </>
  )
}
