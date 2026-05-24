import { Building2, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'

export function PortalPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7f2] px-4 py-8">
      <section className="w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <Brand />
        <h1 className="mt-8 text-3xl font-semibold text-slate-950">
          Portal de acesso
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Escolha qual painel deseja acessar. Esse sera o link unico do tipo
          `www.seucatalogo.com.br/portal`.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            className="rounded-lg border border-slate-200 p-5 hover:border-teal-600 hover:bg-teal-50"
            to="/empresa/login"
          >
            <Building2 className="text-teal-700" size={26} aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-950">
              Entrar no painel da empresa
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Para empresas que publicam catalogos, geram tokens e controlam
              representantes.
            </p>
          </Link>
          <Link
            className="rounded-lg border border-slate-200 p-5 hover:border-teal-600 hover:bg-teal-50"
            to="/representante/login"
          >
            <UserRound className="text-teal-700" size={26} aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-950">
              Entrar no painel do representante
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Para representantes autonomos, firmas de representacao e
              vendedores vinculados a firmas.
            </p>
          </Link>
        </div>
      </section>
    </main>
  )
}
