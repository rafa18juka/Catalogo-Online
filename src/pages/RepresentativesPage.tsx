import { Link2, MailPlus, MessageCircle } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const representatives = [
  ['Cadu Almeida', 'Sul', '42 visitas', '8 clientes quentes'],
  ['Marina Lopes', 'Sudeste', '36 visitas', '5 clientes quentes'],
  ['Equipe Loja Sol', 'Nordeste', '28 visitas', '7 clientes quentes'],
]

export function RepresentativesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Representantes"
        title="Links e desempenho"
        description="Cada representante recebe links proprios e ve somente clientes e interesses permitidos pela empresa."
        action={
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            type="button"
          >
            <MailPlus size={18} aria-hidden="true" />
            Convidar
          </button>
        }
      />
      <section className="grid gap-4 p-5 sm:p-6 xl:grid-cols-3">
        {representatives.map(([name, region, visits, hot]) => (
          <article
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            key={name}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-950">{name}</h2>
                <p className="mt-1 text-sm text-slate-500">Regiao {region}</p>
              </div>
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                Ativo
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Visitas</p>
                <p className="mt-1 font-semibold text-slate-950">{visits}</p>
              </div>
              <div className="rounded-md bg-rose-50 p-3">
                <p className="text-xs text-rose-600">Interesse</p>
                <p className="mt-1 font-semibold text-rose-800">{hot}</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
                type="button"
              >
                <Link2 size={16} aria-hidden="true" />
                Link
              </button>
              <button
                className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-[#1f9d68] text-sm font-semibold text-white hover:bg-[#168357]"
                type="button"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Enviar
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
