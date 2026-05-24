import { Palette, Save } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

export function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Configuracoes"
        title="Marca e preferencias"
        description="Dados de contato, logo, cores, dominio futuro e permissoes da organizacao."
        action={
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            type="button"
          >
            <Save size={18} aria-hidden="true" />
            Salvar
          </button>
        }
      />
      <section className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[1fr_360px]">
        <form className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Nome da empresa
              </span>
              <input
                className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                defaultValue="Importadora Exemplo"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Slug publico
              </span>
              <input
                className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                defaultValue="importadora-exemplo"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                WhatsApp comercial
              </span>
              <input
                className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                defaultValue="+55 11 99999-0000"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Email de privacidade
              </span>
              <input
                className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                defaultValue="privacidade@empresa.com.br"
              />
            </label>
          </div>
        </form>
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <Palette className="text-teal-700" size={22} aria-hidden="true" />
          <h2 className="mt-4 font-semibold text-slate-950">
            Aparencia do catalogo
          </h2>
          <div className="mt-4 flex gap-2">
            {['#0f766e', '#d97706', '#be123c', '#2563eb'].map((color) => (
              <button
                aria-label={`Usar cor ${color}`}
                className="size-9 rounded-md border border-white shadow ring-1 ring-slate-200"
                key={color}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            As cores entram no manifesto publicado para manter o catalogo
            publico leve e cacheavel.
          </p>
        </aside>
      </section>
    </>
  )
}
