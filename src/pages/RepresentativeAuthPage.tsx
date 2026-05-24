import { Building2, LogIn, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  authenticateRepresentationFirm,
  authenticateRepresentative,
  registerAutonomousRepresentative,
  registerRepresentationFirm,
  setCurrentRepresentationFirm,
  setCurrentRepresentative,
} from '../lib/mockStore'
import { AuthLayout } from './AuthLayout'

type Mode = 'login' | 'autonomous' | 'firm'

export function RepresentativeAuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    cpf: '',
    tradeName: '',
    legalName: '',
    cnpj: '',
    responsibleName: '',
    responsibleCpf: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  })

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleLogin() {
    const representative = authenticateRepresentative(form.email, form.password)

    if (representative) {
      setCurrentRepresentative(representative.id)
      navigate('/rep')
      return
    }

    const firm = authenticateRepresentationFirm(form.email, form.password)

    if (firm) {
      setCurrentRepresentationFirm(firm.id)
      navigate('/rep-firm')
      return
    }

    setMessage('Login nao encontrado. Cadastre o representante ou a firma.')
  }

  function handleAutonomousSignup() {
    if (!form.fullName || !form.cpf || !form.email || !form.password) {
      setMessage('Preencha nome, CPF, email e senha.')
      return
    }

    const representative = registerAutonomousRepresentative({
      fullName: form.fullName,
      cpf: form.cpf,
      email: form.email,
      password: form.password,
      phone: form.phone,
    })

    setCurrentRepresentative(representative.id)
    navigate('/rep')
  }

  function handleFirmSignup() {
    if (!form.tradeName || !form.legalName || !form.cnpj || !form.email) {
      setMessage('Preencha os dados obrigatorios da firma de representacoes.')
      return
    }

    const firm = registerRepresentationFirm({
      tradeName: form.tradeName,
      legalName: form.legalName,
      cnpj: form.cnpj,
      responsibleName: form.responsibleName,
      responsibleCpf: form.responsibleCpf,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: form.address,
    })

    setCurrentRepresentationFirm(firm.id)
    navigate('/rep-firm')
  }

  return (
    <AuthLayout
      title={
        mode === 'login'
          ? 'Portal do representante'
          : mode === 'firm'
            ? 'Cadastro da firma'
            : 'Cadastro autonomo'
      }
      description="Representantes podem ser autonomos ou fazer parte de uma firma de representacoes."
    >
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {[
          ['login', 'Entrar'],
          ['autonomous', 'Autonomo'],
          ['firm', 'Firma'],
        ].map(([value, label]) => (
          <button
            className={`h-10 rounded-md border text-sm font-semibold ${
              mode === value
                ? 'border-teal-700 bg-teal-50 text-teal-800'
                : 'border-slate-200 text-slate-600'
            }`}
            key={value}
            onClick={() => setMode(value as Mode)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <form className="mt-6 space-y-4">
        {mode === 'autonomous' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nome completo"
              onChange={(value) => updateField('fullName', value)}
              value={form.fullName}
            />
            <Field
              label="CPF"
              onChange={(value) => updateField('cpf', value)}
              value={form.cpf}
            />
            <Field
              label="Telefone"
              onChange={(value) => updateField('phone', value)}
              value={form.phone}
            />
          </div>
        ) : null}
        {mode === 'firm' ? (
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
          onClick={
            mode === 'login'
              ? handleLogin
              : mode === 'firm'
                ? handleFirmSignup
                : handleAutonomousSignup
          }
          type="button"
        >
          {mode === 'login' ? (
            <LogIn size={18} aria-hidden="true" />
          ) : mode === 'firm' ? (
            <Building2 size={18} aria-hidden="true" />
          ) : (
            <UserPlus size={18} aria-hidden="true" />
          )}
          {mode === 'login'
            ? 'Entrar'
            : mode === 'firm'
              ? 'Cadastrar firma'
              : 'Cadastrar autonomo'}
        </button>
      </form>
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
