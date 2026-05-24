import { AlertTriangle, Database, HardDrive, RadioTower } from 'lucide-react'
import { Brand } from '../components/Brand'

const adminMetrics = [
  ['Empresas ativas', '12', Database, 'text-sky-700'],
  ['Falhas de upload', '3', AlertTriangle, 'text-amber-700'],
  ['Storage usado', '88 GB', HardDrive, 'text-teal-700'],
  ['Eventos hoje', '9.482', RadioTower, 'text-rose-700'],
]

export function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f2]">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto max-w-6xl">
          <Brand />
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="text-2xl font-semibold text-slate-950">
          Admin e saude do SaaS
        </h1>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminMetrics.map(([label, value, Icon, tone]) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              key={label as string}
            >
              <Icon className={tone as string} size={22} aria-hidden="true" />
              <p className="mt-4 text-sm text-slate-500">{label as string}</p>
              <strong className="mt-1 block text-2xl text-slate-950">
                {value as string}
              </strong>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Eventos recentes</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {[
              'Empresa X tentou subir TIFF de 18MB',
              'Manifesto utilidades-2026 publicado',
              'Job de imagem contextual falhou no provedor',
              'Catalogo publico com LCP acima de 2.5s',
            ].map((event) => (
              <p className="py-3 text-sm text-slate-600" key={event}>
                {event}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
