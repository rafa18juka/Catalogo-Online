import { Building2, LogIn, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { companies } from '../data/mock'
import { setCurrentCompany } from '../lib/mockStore'

export function CompanyAuthPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(companies[0].email)
  const [password, setPassword] = useState(companies[0].password)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')

  function handleLogin() {
    const company = companies.find(
      (item) => item.email === email && item.password === password,
    )

    if (!company) {
      setMessage('Email ou senha da empresa invalidos.')
      return
    }

    if (company.paymentStatus === 'pending') {
      setMessage('Acesso pendente. A liberacao depende da confirmacao do plano.')
      return
    }

    setCurrentCompany(company.id)
    navigate('/app')
  }

  return (
    <AuthLayout
      title={mode === 'login' ? 'Login da empresa' : 'Cadastro da empresa'}
      description="Empresas acessam o painel apos pagamento confirmado via Stripe ou liberacao manual no painel dev."
    >
      <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-800">
        <ShieldCheck className="mb-2 text-teal-700" size={18} aria-hidden="true" />
        Teste: use `admin@casaverdeatacado.com.br` com senha `CasaVerde@123`.
      </div>
      <form className="mt-6 space-y-4">
        {mode === 'signup' ? (
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              CNPJ da empresa
            </span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
              placeholder="00.000.000/0001-00"
            />
          </label>
        ) : null}
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Senha</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>
        {message ? (
          <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            {message}
          </p>
        ) : null}
        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
          onClick={handleLogin}
          type="button"
        >
          {mode === 'login' ? (
            <LogIn size={18} aria-hidden="true" />
          ) : (
            <Building2 size={18} aria-hidden="true" />
          )}
          {mode === 'login' ? 'Entrar no painel' : 'Criar conta'}
        </button>
      </form>
      <button
        className="mt-5 w-full text-center text-sm font-semibold text-teal-700"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        type="button"
      >
        {mode === 'login'
          ? 'Ainda nao tenho conta de empresa'
          : 'Ja tenho conta de empresa'}
      </button>
    </AuthLayout>
  )
}
