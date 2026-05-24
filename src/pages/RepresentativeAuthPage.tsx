import { LogIn, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { representatives } from '../data/mock'
import { setCurrentRepresentative } from '../lib/mockStore'
import { AuthLayout } from './AuthLayout'

export function RepresentativeAuthPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(representatives[0].email)
  const [password, setPassword] = useState(representatives[0].password)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')

  function handleLogin() {
    const representative = representatives.find(
      (item) => item.email === email && item.password === password,
    )

    if (!representative) {
      setMessage('Email ou senha do representante invalidos.')
      return
    }

    setCurrentRepresentative(representative.id)
    navigate('/rep')
  }

  return (
    <AuthLayout
      title={mode === 'login' ? 'Login do representante' : 'Cadastro simples'}
      description="O painel do representante e gratuito. Sem vinculo com empresa, ele fica vazio ate informar um token."
    >
      <div className="mt-5 rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm leading-6 text-sky-800">
        Teste: use `cadu.rep@catalogo.test` com senha `RepCadu@123`.
      </div>
      <form className="mt-6 space-y-4">
        {mode === 'signup' ? (
          <>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Nome completo
              </span>
              <input
                className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                placeholder="Nome completo"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">CPF</span>
              <input
                className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
                placeholder="000.000.000-00"
              />
            </label>
          </>
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
            <UserPlus size={18} aria-hidden="true" />
          )}
          {mode === 'login' ? 'Entrar no painel' : 'Cadastrar representante'}
        </button>
      </form>
      <button
        className="mt-5 w-full text-center text-sm font-semibold text-teal-700"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        type="button"
      >
        {mode === 'login'
          ? 'Criar cadastro de representante'
          : 'Ja tenho cadastro'}
      </button>
    </AuthLayout>
  )
}
