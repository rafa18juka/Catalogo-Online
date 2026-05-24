import { Bell, Menu, Search, Settings } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { appModules } from '../data/mock'
import { isSupabaseConfigured } from '../lib/supabase'

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#f6f7f2] text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <Brand />
        <nav className="mt-8 space-y-1">
          {appModules.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Supabase {isSupabaseConfigured ? 'conectado' : 'pendente'}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            As chaves entram no `.env.local` quando criarmos o projeto remoto.
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            className="grid size-10 place-items-center rounded-md border border-slate-200 text-slate-600 lg:hidden"
            type="button"
            title="Menu"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
              aria-hidden="true"
            />
            <input
              className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
              placeholder="Buscar produtos, catalogos ou representantes"
              type="search"
            />
          </div>
          <button
            className="grid size-10 place-items-center rounded-md border border-slate-200 text-slate-600"
            type="button"
            title="Notificacoes"
          >
            <Bell size={18} aria-hidden="true" />
          </button>
          <NavLink
            className="grid size-10 place-items-center rounded-md border border-slate-200 text-slate-600"
            title="Configuracoes"
            to="/app/settings"
          >
            <Settings size={18} aria-hidden="true" />
          </NavLink>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
