import { LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'

export function LoginPage() {
  return (
    <AuthLayout
      title="Entrar"
      description="A autenticacao real sera conectada ao Supabase Auth na proxima fase."
    >
      <form className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            placeholder="voce@empresa.com.br"
            type="email"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Senha</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            placeholder="********"
            type="password"
          />
        </label>
        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
          type="button"
        >
          <LogIn size={18} aria-hidden="true" />
          Acessar painel
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Ainda sem conta?{' '}
        <Link className="font-semibold text-teal-700" to="/signup">
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  )
}
