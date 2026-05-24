# Catalogo Online

SaaS de catalogo virtual inteligente para empresas, representantes e clientes finais.

## Stack inicial

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase client preparado

## Scripts

```bash
npm install
npm run dev
npm run dev:dev
npm run dev:company
npm run dev:rep
npm run dev:catalog
npm run build
```

## Ambientes locais

Cada superficie pode rodar em uma porta propria:

- Dev/admin: `http://127.0.0.1:5174/`
- Empresa: `http://127.0.0.1:5175/`
- Representante: `http://127.0.0.1:5176/`
- Catalogo publico: `http://127.0.0.1:5177/`

A raiz de cada porta redireciona para a superficie correta.

## Dados ficticios para teste

As contas nao vem mais pre-cadastradas na aplicacao. Use
`dados_teste_cadastros.txt` para cadastrar manualmente:

- 1 empresa compradora do SaaS
- 1 firma de representacoes
- 1 representante dessa firma
- 1 representante autonomo

Fluxo base: acesse `/portal`, cadastre os perfis, gere token na empresa,
vincule no painel da firma ou do representante autonomo e teste a revogacao.

## Supabase

Crie um `.env.local` a partir do `.env.example` quando o projeto Supabase for conectado:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

As migracoes e RLS entram na proxima fase usando Supabase CLI.

### CLI

O Supabase CLI esta instalado como dependencia de desenvolvimento.

Comandos principais:

```bash
npm run supabase -- --version
npm run supabase:link -- --project-ref seu_project_ref
npm run supabase:push
```

Para linkar e aplicar migracoes no projeto remoto, sera necessario autenticar o CLI com um token pessoal do Supabase.

## Rotas iniciais

- `/app`: painel da empresa
- `/app/products`: produtos e imagens
- `/app/catalogs`: criador de catalogos
- `/app/designs`: escolha do design do catalogo
- `/app/representatives`: representantes
- `/app/reports`: relatorio de interesse
- `/rep`: painel do representante
- `/dev` ou `/admin`: admin/dev
- `/c/utilidades-2026/rep-cadu`: catalogo publico
- `/login`, `/signup`, `/pricing`, `/privacy`
