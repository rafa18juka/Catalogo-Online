import {
  AlertTriangle,
  Building2,
  Database,
  HardDrive,
  RadioTower,
  Upload,
} from 'lucide-react'
import { Brand } from '../components/Brand'
import { DesignPreview } from '../components/DesignPreview'
import { catalogDesignPresets } from '../data/mock'

const adminMetrics = [
  ['Empresas ativas', '12', Database, 'text-sky-700'],
  ['Falhas de upload', '3', AlertTriangle, 'text-amber-700'],
  ['Storage usado', '88 GB', HardDrive, 'text-teal-700'],
  ['Eventos hoje', '9.482', RadioTower, 'text-rose-700'],
]

const devEvents = [
  'Empresa Importadora Exemplo publicou catalogo utilidades-2026',
  'Representante Cadu Almeida gerou link WhatsApp',
  'Upload de imagem TIFF recusado em Produtos',
  'Catalogo publico carregou preset Atacado Limpo',
]

export function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f2]">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Brand />
          <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            Painel dev · porta 5174
          </span>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Dev/admin
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">
              Monitoramento e designs de catalogo
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              Aqui o dev acompanha o uso das empresas, recebe logs de erro e
              publica presets de design que as empresas podem escolher.
            </p>
          </div>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            type="button"
          >
            <Upload size={18} aria-hidden="true" />
            Upload de design
          </button>
        </div>

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

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-950">
                  Presets de design
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Designs criados pelo dev e liberados para empresas.
                </p>
              </div>
              <button
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
                type="button"
              >
                <Building2 size={16} aria-hidden="true" />
                Vincular empresa
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {catalogDesignPresets.map((design) => (
                <article
                  className="rounded-lg border border-slate-200 p-3"
                  key={design.id}
                >
                  <DesignPreview design={design} />
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {design.name}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {design.audience}
                      </p>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      {design.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-950">Atividade da empresa</h2>
              <div className="mt-4 divide-y divide-slate-100">
                {devEvents.map((event) => (
                  <p className="py-3 text-sm leading-6 text-slate-600" key={event}>
                    {event}
                  </p>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle
                className="text-amber-700"
                size={22}
                aria-hidden="true"
              />
              <h2 className="mt-4 font-semibold text-amber-950">
                Logs de erro
              </h2>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Falhas de upload, API lenta e problemas no catalogo publico
                aparecem aqui para o dev agir antes do cliente reclamar.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
