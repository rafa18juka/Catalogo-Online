# Plano de Desenvolvimento - SaaS de Catalogo Virtual Inteligente

Documento criado a partir do `Plano_Mestre_SaaS_Catalogo_Virtual.pdf`.

Data base do briefing: 24/05/2026

## 1. Visao do Produto

Criar um SaaS multiempresa para transformar catalogos em PDF/Drive em catalogos online rapidos, atualizados e inteligentes.

Para o cliente final, a experiencia deve ser tao simples quanto abrir um PDF pelo WhatsApp. Para a empresa e o representante, o sistema deve entregar cadastro, links, metricas, relatorios de interesse, controle de plano e recursos de IA.

### Diferencial principal

O produto nao deve vender "rastreamento". A comunicacao deve usar termos como:

- Relatorio de Interesse do Cliente
- Produtos que chamaram atencao
- Possivel interesse
- Maior atencao

Evitar frases como "o cliente gostou", pois o sistema mede sinais de navegacao, nao intencao real de compra.

## 2. Principios Obrigatorios

1. Cliente final sem atrito: sem login, senha, CPF, telefone ou cadastro completo.
2. Entrada publica simples: pedir no maximo nome ou apelido.
3. Sensacao de PDF online: abrir rapido, rolar facil, tocar na imagem e fechar facil.
4. Catalogo publicado estavel: empresa edita rascunho e publica uma versao.
5. Publico separado do painel: o catalogo nao deve carregar codigo pesado de dashboard.
6. Performance primeiro: nunca carregar imagem original no catalogo publico.
7. Multiempresa desde o inicio: tudo com organizacao/empresa, papeis e seguranca.
8. Dados uteis, nao assustadores: mostrar resumo de interesse, nao microcliques.
9. IA controlada por creditos: toda funcao de IA deve registrar custo, status e consumo.
10. Admin/dev desde cedo: erros, filas, storage, IA, uso e bugs precisam ser visiveis.

## 3. Superficies do Produto

### 3.1 Site comercial

Objetivo: vender a solucao para empresas.

Conteudo esperado:

- Landing page
- Dor do PDF pesado/desatualizado
- Demonstracao do catalogo online
- Planos
- FAQ
- CTA para teste ou demonstracao

### 3.2 Painel da empresa

Objetivo: permitir que a empresa cadastre produtos, imagens, catalogos, representantes e acompanhe resultados.

Modulos:

- Dashboard
- Produtos
- Imagens
- Catalogos
- Representantes
- Relatorios
- IA
- Plano e consumo
- Configuracoes

### 3.3 Painel do representante

Objetivo: o representante compartilha links e acompanha possiveis interesses dos clientes.

Modulos:

- Meus catalogos
- Copiar link
- Compartilhar no WhatsApp
- Clientes recentes
- Produtos com possivel interesse
- Minha performance
- Sugestoes de abordagem
- Avisos da empresa

### 3.4 Catalogo publico

Objetivo: pagina ultra-rapida aberta pelo cliente final no celular.

Regras:

- Sem login
- Entrada com nome/apelido
- Rolagem vertical
- Cards simples de produto
- Imagens otimizadas
- Galeria leve
- Eventos enviados em lote
- Link discreto para politica de privacidade

### 3.5 Painel admin/dev

Objetivo: monitorar saude tecnica e operacional do SaaS.

Modulos:

- Empresas
- Planos
- Uso por empresa
- Erros por rota
- Falhas de upload
- Jobs de imagem
- Storage
- IA e creditos
- Billing
- Logs de auditoria
- Feature flags
- Suporte

## 4. Stack Recomendada

Para construir com Codex neste projeto:

- Frontend: React + TypeScript + Vite
- Estilo: Tailwind CSS
- Banco: Supabase Postgres
- Autenticacao: Supabase Auth
- Seguranca: Supabase RLS
- Storage inicial: Supabase Storage
- Backend/serverless: Supabase Edge Functions ou API Node, conforme necessidade
- Pagamento futuro: Stripe Billing ou gateway brasileiro
- Monitoramento futuro: Sentry
- IA futura: camada plugavel com registro de custos e creditos

### Decisao importante

O catalogo publico deve carregar uma versao publicada, leve e cacheavel, chamada neste plano de `manifesto do catalogo`. Ele nao deve consultar varias tabelas do banco a cada abertura.

## 5. Arquitetura de Alto Nivel

Fluxo principal:

1. Empresa cria conta.
2. Empresa escolhe ou recebe um plano.
3. Empresa cadastra produtos.
4. Empresa faz upload de imagens.
5. Sistema valida e gera imagens derivadas.
6. Empresa monta um catalogo em rascunho.
7. Empresa publica o catalogo.
8. Sistema gera uma versao publicada e um manifesto leve.
9. Representante compartilha link proprio.
10. Cliente abre pelo WhatsApp, informa nome/apelido e navega.
11. Catalogo envia eventos em lote.
12. Sistema calcula pontuacao de interesse.
13. Representante e empresa veem resumos.
14. Admin/dev acompanha erros, uso, custos e performance.

## 6. Modelo de Dados Base

### Multiempresa e usuarios

- `organizations`
- `organization_users`
- `representatives`
- `representative_invites`

### Produtos e imagens

- `products`
- `product_images`
- `product_categories`
- `product_variations`

### Catalogos

- `catalogs`
- `catalog_versions`
- `catalog_products`
- `catalog_sections`
- `share_links`

### Publico e eventos

- `public_sessions`
- `catalog_events`
- `interest_scores`

### Planos, uso e billing

- `subscriptions`
- `plan_limits`
- `usage_snapshots`

### IA

- `ai_jobs`
- `ai_credit_ledger`

### Admin/dev e auditoria

- `error_logs`
- `audit_logs`
- `feature_flags`

### Regra de seguranca

Toda tabela principal deve ter `organization_id` ou uma relacao clara ate a empresa. RLS deve ser criada desde a primeira migracao.

Representantes so podem ver:

- Os proprios links
- Os proprios clientes/sessoes
- Os catalogos liberados pela empresa
- Os relatorios permitidos

## 7. Papeis e Permissoes

- `saas_admin`: acesso global tecnico e administrativo.
- `owner`: dono da empresa, acesso total dentro da propria organizacao.
- `company_admin`: gestor da empresa, sem financeiro se o dono restringir.
- `catalog_editor`: cadastra produtos, imagens e catalogos.
- `sales_manager`: acompanha representantes e relatorios comerciais.
- `representative`: ve os proprios links, clientes e relatorios.
- `public_visitor`: cliente final sem conta, acesso apenas ao catalogo publico.

## 8. MVP Recomendado

Nao comecar pela IA. O MVP deve provar o fluxo principal.

### Escopo do MVP

1. Base React/TypeScript/Tailwind.
2. Autenticacao e estrutura multiempresa.
3. Painel inicial da empresa.
4. Cadastro de produtos.
5. Upload simples de imagens.
6. Estrutura para imagens otimizadas.
7. Criacao de catalogos.
8. Publicacao de catalogo com versao publicada.
9. Catalogo publico rapido com nome/apelido.
10. Links de compartilhamento por representante.
11. Sessao publica e eventos basicos em lote.
12. Relatorio simples de possivel interesse.
13. Painel basico do representante.
14. Admin/dev minimo para erros e uso.

### Fora do MVP inicial

- Remocao de fundo com IA
- Imagem contextual com IA
- Checkout completo
- Dominio proprio
- White label
- Integracao ERP
- Importacao massiva avancada
- API publica

## 9. Roadmap de Implementacao

### Fase 0 - Base tecnica

Entregaveis:

- Criar app React + TypeScript + Tailwind.
- Definir rotas publicas e privadas.
- Criar layout base.
- Criar design system simples.
- Preparar variaveis de ambiente.
- Conectar Supabase.

### Fase 1 - Multiempresa e autenticacao

Entregaveis:

- Login/cadastro.
- Criacao de organizacao.
- Vinculo usuario/organizacao.
- Papeis iniciais.
- Protecao de rotas.
- Dashboard inicial da empresa.

### Fase 2 - Planos e limites

Entregaveis:

- Tabelas de planos e limites.
- Tela de plano atual.
- Uso de produtos, catalogos, representantes, storage e IA.
- Alertas de limite.
- Estrutura preparada para webhooks de pagamento.

### Fase 3 - Produtos

Entregaveis:

- CRUD de produtos.
- Categoria.
- SKU.
- Descricao.
- Preco opcional.
- Status/estoque.
- Variacoes simples.
- Filtros e busca.

### Fase 4 - Imagens

Entregaveis:

- Upload de imagens.
- Validacao de formato e tamanho.
- Status: processando, pronto, falhou.
- Geracao futura de derivados: `thumb`, `card_mobile`, `card_desktop`, `detail`, `zoom`, `placeholder`.
- Registro de erro para admin/dev.

### Fase 5 - Criador de catalogo

Entregaveis:

- CRUD de catalogos.
- Selecionar produtos.
- Organizar secoes.
- Definir ordem.
- Configurar capa, logo e cores simples.
- Preview.
- Publicar.

### Fase 6 - Manifesto publicado

Entregaveis:

- Criar `catalog_versions`.
- Gerar manifesto com dados prontos.
- Manifesto deve conter:
  - Dados do catalogo
  - Secoes
  - Produtos
  - Ordem
  - URLs das imagens otimizadas
  - Configuracoes visuais
- Catalogo publico deve ler o manifesto.

### Fase 7 - Catalogo publico rapido

Entregaveis:

- Rota publica por slug/codigo.
- Entrada: nome ou apelido.
- Politica de privacidade acessivel.
- Lista vertical de produtos.
- Imagens com lazy loading.
- Galeria leve.
- Botao opcional de WhatsApp/orcamento.
- Layout mobile-first.

### Fase 8 - Eventos e sessoes

Entregaveis:

- Criar sessao publica.
- Registrar device aproximado.
- Eventos em lote:
  - Produto visivel por tempo minimo
  - Abertura de galeria
  - Troca de foto
  - Retorno ao produto
  - Copia de titulo/SKU
  - Clique em WhatsApp/orcamento
- Envio em lote ou ao sair da pagina.

### Fase 9 - Interesse inteligente

Entregaveis:

- Calculo de pontuacao por produto/sessao.
- Niveis: baixo, medio, alto, muito alto.
- Mostrar apenas sinais relevantes.
- Linguagem sempre cuidadosa: "possivel interesse".

Pesos iniciais:

- Produto visivel por 2s+: +1
- Produto visivel por 8s+: +3
- Abriu imagem/galeria: +4
- Passou fotos da galeria: +2
- Voltou no mesmo produto: +5
- Copiou titulo/SKU: +6
- Buscou termo e clicou produto: +4
- Clicou em orcamento/WhatsApp: +10
- Saiu em menos de 10s: -5

Niveis:

- 0 a 6: baixo
- 7 a 14: medio
- 15 a 24: alto
- 25 ou mais: muito alto

### Fase 10 - Representantes

Entregaveis:

- Cadastro/convite de representante.
- Bloquear/aprovar representante.
- Gerar links proprios.
- Painel do representante.
- Clientes recentes.
- Produtos com possivel interesse.
- Performance do representante.

### Fase 11 - Admin/dev

Entregaveis:

- Empresas ativas.
- Uso por empresa.
- Erros por rota.
- Uploads falhos.
- Jobs parados.
- Storage.
- Eventos.
- Logs de auditoria.

### Fase 12 - IA e creditos

Entregaveis:

- Saldo mensal de creditos.
- Compra futura de creditos extras.
- `ai_jobs`.
- `ai_credit_ledger`.
- Recursos:
  - Remover fundo
  - Criar imagem contextual
  - Gerar descricao
  - Sugerir titulo
  - Sugerir tags
- Devolver creditos quando falhar por erro do sistema/provedor.

### Fase 13 - Escala

Entregaveis:

- Importacao CSV/Excel.
- Dominio proprio.
- White label.
- Integracao ERP/estoque.
- API.
- Catalogos por regiao/preco.
- PDF automatico gerado a partir do catalogo online.

## 10. Telas Iniciais a Criar

### Publicas

- `/`
- `/pricing`
- `/login`
- `/signup`
- `/c/:catalogSlug`
- `/c/:catalogSlug/:shareCode`
- `/privacy`

### Painel da empresa

- `/app`
- `/app/products`
- `/app/products/new`
- `/app/products/:id`
- `/app/catalogs`
- `/app/catalogs/new`
- `/app/catalogs/:id`
- `/app/catalogs/:id/preview`
- `/app/representatives`
- `/app/reports`
- `/app/plan`
- `/app/settings`

### Painel do representante

- `/rep`
- `/rep/catalogs`
- `/rep/clients`
- `/rep/performance`

### Admin/dev

- `/admin`
- `/admin/organizations`
- `/admin/errors`
- `/admin/storage`
- `/admin/ai`
- `/admin/billing`
- `/admin/logs`

## 11. Performance do Catalogo Publico

Checklist tecnico:

- Bundle publico separado do dashboard.
- Manifesto cacheavel.
- Imagens com dimensoes fixas.
- Lazy loading abaixo da primeira dobra.
- Primeiras imagens priorizadas.
- Nada de imagem original.
- Eventos em lote.
- Sem scripts terceiros pesados.
- Medir LCP, INP e CLS.
- Usar `IntersectionObserver` para visibilidade real dos produtos.
- Considerar lista virtualizada para catalogos muito grandes.

Tamanhos de imagem:

- `thumb`: 120 a 180 px
- `card_mobile`: 320 a 480 px
- `card_desktop`: 640 a 768 px
- `detail`: 900 a 1200 px
- `zoom`: 1400 a 1800 px
- `placeholder`: cor dominante ou blur leve

## 12. Privacidade

Texto de entrada sugerido:

- Titulo: Como podemos te identificar?
- Campo: Nome ou apelido
- Botao: Acessar catalogo
- Texto pequeno: Ao continuar, voce concorda com nossa Politica de Privacidade.

Politica deve informar:

- Coleta de nome/apelido informado.
- Coleta de dados basicos de navegacao no catalogo.
- Uso para atendimento comercial e relatorios de interesse.
- Nao coleta CPF, dados bancarios, senhas ou dados sensiveis no catalogo publico.
- Prazo de retencao, por exemplo 90 ou 180 dias.
- Canal para solicitar exclusao/correcao.

## 13. Criterios de Aceite do MVP

- Empresa consegue criar conta e acessar painel.
- Usuario nao consegue ver dados de outra empresa.
- Empresa consegue cadastrar produtos.
- Empresa consegue subir imagens com feedback claro.
- Imagem original nao aparece diretamente no catalogo publico.
- Empresa consegue criar, visualizar e publicar catalogo.
- Link publico abre no celular sem login.
- Cliente informa apenas nome/apelido.
- Catalogo carrega rapido em 4G comum.
- Galeria abre e fecha facil no celular.
- Eventos sao enviados em lote.
- Representante ve resumo de possivel interesse.
- Empresa ve desempenho por catalogo e representante.
- Admin/dev recebe erros de upload e falhas importantes.
- Uso de storage, eventos e IA aparece por empresa.
- Politica de privacidade esta acessivel antes da entrada.
- Existe rollback ou manutencao de versao publicada anterior.

## 14. Riscos e Prevencoes

| Risco | Prevencao |
| --- | --- |
| Catalogo pesado | Separar publico do dashboard, usar manifesto, cache e imagens derivadas. |
| Cadastro cansativo | Criar fluxo simples, depois importacao em massa e IA auxiliar. |
| Metricas assustarem o cliente final | Aviso discreto, politica clara e relatorios apenas para empresa/rep. |
| IA gerar custo alto | Creditos, limites mensais, alertas e logs por job. |
| Vazamento multiempresa | RLS desde o inicio, testes de permissao e logs. |
| Representante nao usar painel | Link facil, WhatsApp e relatorios simples. |
| Empresa nao perceber valor | Dashboard com produtos quentes, reps ativos e comparativo contra PDF/Drive. |
| Imagens ruins | Validacao, compressao, alertas de qualidade e IA futura. |

## 15. Ordem Recomendada Para Comecar com Codex

1. Criar o projeto React + TypeScript + Tailwind.
2. Montar layout base, rotas e telas placeholder.
3. Configurar Supabase.
4. Criar migracoes iniciais de multiempresa.
5. Implementar autenticacao.
6. Implementar painel inicial da empresa.
7. Implementar produtos.
8. Implementar imagens.
9. Implementar catalogos e publicacao.
10. Implementar catalogo publico.
11. Implementar sessoes/eventos.
12. Implementar relatorio de interesse.
13. Implementar representantes.
14. Implementar admin/dev basico.

## 16. Proxima Acao

Comecar pela Fase 0:

- Inicializar aplicacao.
- Instalar dependencias.
- Criar estrutura de pastas.
- Criar rotas principais.
- Criar layout base.
- Deixar o projeto pronto para conectar ao Supabase.

