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
npm run build
```

## Supabase

Crie um `.env.local` a partir do `.env.example` quando o projeto Supabase for conectado:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

As migracoes e RLS entram na proxima fase usando Supabase CLI.

## Rotas iniciais

- `/app`: painel da empresa
- `/app/products`: produtos e imagens
- `/app/catalogs`: criador de catalogos
- `/app/representatives`: representantes
- `/app/reports`: relatorio de interesse
- `/rep`: painel do representante
- `/admin`: admin/dev
- `/c/utilidades-2026/rep-cadu`: catalogo publico
- `/login`, `/signup`, `/pricing`, `/privacy`
