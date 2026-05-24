import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'

type AuthLayoutProps = {
  title: string
  description: string
  children: ReactNode
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen bg-[#f6f7f2] px-4 py-8 lg:grid-cols-[1fr_460px]">
      <section className="hidden place-items-center p-8 lg:grid">
        <div className="max-w-xl">
          <Brand />
          <h1 className="mt-10 text-4xl font-semibold leading-tight text-slate-950">
            Catalogo rapido para cliente, painel inteligente para equipe.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Estrutura inicial para empresas, representantes, catalogos
            publicados e relatorios de possivel interesse.
          </p>
        </div>
      </section>
      <section className="m-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <Link to="/app">
          <Brand />
        </Link>
        <h2 className="mt-8 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        {children}
      </section>
    </main>
  )
}
