import { Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'

export function SignupPage() {
  return (
    <AuthLayout
      title="Criar empresa"
      description="Fluxo inicial para abrir organizacao, dono e plano de teste."
    >
      <form className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Nome da empresa
          </span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            placeholder="Importadora Exemplo"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            placeholder="voce@empresa.com.br"
            type="email"
          />
        </label>
        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
          type="button"
        >
          <Building2 size={18} aria-hidden="true" />
          Comecar
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Ja tem conta?{' '}
        <Link className="font-semibold text-teal-700" to="/login">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
