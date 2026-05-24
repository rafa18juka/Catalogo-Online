import { Building2, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  authenticateCompany,
  registerCompany,
  setCurrentCompany,
} from '../lib/mockStore'
import { AuthLayout } from './AuthLayout'

export function CompanyAuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    tradeName: '',
    legalName: '',
    cnpj: '',
    responsibleName: '',
    responsibleCpf: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    plan: 'Starter',
    stripeCustomerId: '',
    stripeSubscriptionId: '',
  })

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleLogin() {
    const company = authenticateCompany(form.email, form.password)

    if (!company) {
      setMessage('Empresa nao encontrada. Cadastre primeiro pelo formulario.')
      return
    }

    if (company.paymentStatus === 'pending') {
      setMessage('Acesso pendente. A liberacao depende da confirmacao do plano.')
      return
    }

    setCurrentCompany(company.id)
    navigate('/app')
  }

  function handleSignup() {
    if (!form.tradeName || !form.legalName || !form.cnpj || !form.email) {
      setMessage('Preencha os dados obrigatorios da empresa.')
      return
    }

    const company = registerCompany({
      tradeName: form.tradeName,
      legalName: form.legalName,
      cnpj: form.cnpj,
      responsibleName: form.responsibleName,
      responsibleCpf: form.responsibleCpf,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: form.address,
      plan: form.plan,
      stripeCustomerId: form.stripeCustomerId || undefined,
    })

    setCurrentCompany(company.id)
    navigate('/app')
  }

  return (
    <AuthLayout
      title={mode === 'login' ? 'Login da empresa' : 'Cadastro completo'}
      description="Empresas acessam o painel apos pagamento confirmado via Stripe ou liberacao manual no painel dev."
    >
      <form className="mt-6 space-y-4">
        {mode === 'signup' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nome fantasia"
              onChange={(value) => updateField('tradeName', value)}
              value={form.tradeName}
            />
            <Field
              label="Razao social"
              onChange={(value) => updateField('legalName', value)}
              value={form.legalName}
            />
            <Field
              label="CNPJ"
              onChange={(value) => updateField('cnpj', value)}
              value={form.cnpj}
            />
            <Field
              label="Responsavel"
              onChange={(value) => updateField('responsibleName', value)}
              value={form.responsibleName}
            />
            <Field
              label="CPF do responsavel"
              onChange={(value) => updateField('responsibleCpf', value)}
              value={form.responsibleCpf}
            />
            <Field
              label="Telefone"
              onChange={(value) => updateField('phone', value)}
              value={form.phone}
            />
            <Field
              label="Endereco"
              onChange={(value) => updateField('address', value)}
              value={form.address}
            />
            <Field
              label="Plano"
              onChange={(value) => updateField('plan', value)}
              value={form.plan}
            />
          </div>
        ) : null}
        <Field
          label="Email de login"
          onChange={(value) => updateField('email', value)}
          type="email"
          value={form.email}
        />
        <Field
          label="Senha"
          onChange={(value) => updateField('password', value)}
          type="password"
          value={form.password}
        />
        {message ? (
          <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            {message}
          </p>
        ) : null}
        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
          onClick={mode === 'login' ? handleLogin : handleSignup}
          type="button"
        >
          {mode === 'login' ? (
            <LogIn size={18} aria-hidden="true" />
          ) : (
            <Building2 size={18} aria-hidden="true" />
          )}
          {mode === 'login' ? 'Entrar no painel' : 'Cadastrar empresa'}
        </button>
      </form>
      <button
        className="mt-5 w-full text-center text-sm font-semibold text-teal-700"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        type="button"
      >
        {mode === 'login'
          ? 'Cadastrar nova empresa'
          : 'Ja tenho cadastro de empresa'}
      </button>
    </AuthLayout>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}

function Field({ label, value, onChange, type = 'text' }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  )
}
