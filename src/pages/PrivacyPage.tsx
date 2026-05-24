import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f2] px-4 py-8">
      <article className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <Link to="/app">
          <Brand />
        </Link>
        <h1 className="mt-8 text-3xl font-semibold text-slate-950">
          Politica de Privacidade
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
          <p>
            Coletamos o nome ou apelido informado para identificar a visita ao
            catalogo e apoiar o atendimento comercial.
          </p>
          <p>
            Tambem registramos dados basicos de navegacao, como produtos
            visualizados, tempo aproximado e interacoes com imagens.
          </p>
          <p>
            Nao coletamos CPF, dados bancarios, senhas ou dados sensiveis no
            catalogo publico.
          </p>
          <p>
            O titular pode solicitar correcao ou exclusao pelo canal informado
            pela empresa responsavel pelo catalogo.
          </p>
        </div>
      </article>
    </main>
  )
}
