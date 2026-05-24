import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'

const plans = [
  ['Starter', 'Pequenas empresas', '1.000 produtos', '3 representantes'],
  ['Pro', 'Distribuidoras medias', '5.000 produtos', '25 representantes'],
  ['Scale', 'Operacoes maiores', 'Mais storage', 'API e dominio proprio'],
]

export function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f2]">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Brand />
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white"
            to="/signup"
          >
            Comecar
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="max-w-3xl text-3xl font-semibold text-slate-950">
          Planos para trocar PDF pesado por catalogos rapidos e mensuraveis.
        </h1>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map(([name, audience, limit, reps]) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              key={name}
            >
              <h2 className="text-xl font-semibold text-slate-950">{name}</h2>
              <p className="mt-1 text-sm text-slate-500">{audience}</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {[limit, reps, 'Relatorio de interesse', 'Creditos de IA'].map(
                  (item) => (
                    <li className="flex items-center gap-2" key={item}>
                      <CheckCircle2
                        className="text-teal-700"
                        size={17}
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
