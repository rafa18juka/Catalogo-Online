import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Boxes,
  Brush,
  FileText,
  Gauge,
  Image,
  Link2,
  PackageOpen,
  Users,
} from 'lucide-react'

export type Product = {
  id: string
  companyId?: string
  title: string
  sku: string
  internalCode?: string
  category: string
  description?: string
  ean?: string
  ncm?: string
  measurements?: string
  weight?: string
  masterBox?: string
  minimumOrder?: string
  observations?: string
  variations?: string
  stock?: string
  status: string
  price: string
  image: string
  images?: string[]
  attention: number
}

export type ProductDisplayOptions = {
  showProductImage: boolean
  showProductName: boolean
  showPrice: boolean
  showSku: boolean
  showInternalCode: boolean
  showEan: boolean
  showNcm: boolean
  showMeasurements: boolean
  showWeight: boolean
  showMasterBox: boolean
  showMinimumOrder: boolean
  showDescription: boolean
  showObservations: boolean
  showVariations: boolean
  showStock: boolean
}

export type ProductDisplayOptionKey = keyof ProductDisplayOptions

export const productDisplayFields: Array<{
  key: ProductDisplayOptionKey
  label: string
}> = [
  { key: 'showProductImage', label: 'Imagem' },
  { key: 'showProductName', label: 'Nome' },
  { key: 'showPrice', label: 'Preco' },
  { key: 'showSku', label: 'SKU' },
  { key: 'showInternalCode', label: 'Codigo interno' },
  { key: 'showEan', label: 'EAN' },
  { key: 'showNcm', label: 'NCM' },
  { key: 'showMeasurements', label: 'Medidas' },
  { key: 'showWeight', label: 'Peso' },
  { key: 'showMasterBox', label: 'Caixa master' },
  { key: 'showMinimumOrder', label: 'Pedido minimo' },
  { key: 'showDescription', label: 'Descricao' },
  { key: 'showObservations', label: 'Observacoes' },
  { key: 'showVariations', label: 'Variacoes' },
  { key: 'showStock', label: 'Estoque' },
]

export const defaultProductDisplayOptions: ProductDisplayOptions =
  productDisplayFields.reduce(
    (options, field) => ({ ...options, [field.key]: true }),
    {} as ProductDisplayOptions,
  )

export type Metric = {
  label: string
  value: string
  trend: string
  icon: LucideIcon
  tone: string
}

export type CatalogDesignPreset = {
  id: string
  templateId: string
  packageVersion: string
  sourceType: 'manual' | 'design_pack'
  name: string
  status: 'Rascunho' | 'Publicado'
  audience: string
  description: string
  coverStyle: string
  gridStyle: string
  primaryColor: string
  accentColor: string
  backgroundColor: string
  surfaceColor: string
  textColor: string
  previewImage: string
  previewKind?: 'image' | 'svg' | 'generated'
  supportsFields: ProductDisplayOptions
  defaultDisplayOptions: ProductDisplayOptions
  manifestJson?: unknown
  configJson?: unknown
  tokensSchemaJson?: unknown
  filesSummary?: string[]
  importedAt?: string
}

export type CompanyAccount = {
  id: string
  tradeName: string
  legalName: string
  cnpj: string
  responsibleName: string
  responsibleCpf: string
  email: string
  password: string
  phone: string
  address: string
  plan: string
  paymentStatus: 'paid' | 'pending' | 'manual_active'
  stripeCustomerId?: string
  accessSource: 'stripe' | 'manual'
}

export type RepresentativeAccount = {
  id: string
  kind: 'autonomous' | 'firm_member'
  firmId?: string
  fullName: string
  cpf: string
  email: string
  password: string
  phone: string
}

export type RepresentationFirmAccount = {
  id: string
  tradeName: string
  legalName: string
  cnpj: string
  responsibleName: string
  responsibleCpf: string
  email: string
  password: string
  phone: string
  address: string
}

export type CompanyCatalog = {
  id: string
  companyId: string
  name: string
  slug: string
  designPresetId: string
  displayOptions: ProductDisplayOptions
  isReleasedToRepresentatives: boolean
  productsCount: number
}

export type RepresentativeLink = {
  representativeId: string
  representativeType: 'autonomous' | 'representation_firm'
  companyId: string
  token: string
  linkedAt: string
  status: 'active' | 'revoked'
  revokedAt?: string
}

export const metrics: Metric[] = [
  {
    label: 'Catalogos ativos',
    value: '8',
    trend: '+2 publicados',
    icon: FileText,
    tone: 'bg-teal-50 text-teal-700',
  },
  {
    label: 'Produtos',
    value: '428',
    trend: '72 com imagens prontas',
    icon: Boxes,
    tone: 'bg-amber-50 text-amber-700',
  },
  {
    label: 'Representantes',
    value: '18',
    trend: '14 ativos na semana',
    icon: Users,
    tone: 'bg-sky-50 text-sky-700',
  },
  {
    label: 'Clientes recentes',
    value: '136',
    trend: '31 com possivel interesse',
    icon: Gauge,
    tone: 'bg-rose-50 text-rose-700',
  },
]

export const products: Product[] = [
  {
    id: 'AR-001',
    title: 'Arara decorativa em pelucia',
    sku: 'AR-001',
    category: 'Decoracao',
    status: 'Disponivel',
    price: 'R$ 42,90',
    image: '/sample-products/arara-1.png',
    attention: 86,
  },
  {
    id: 'TB-014',
    title: 'Tubarao de pelucia azul',
    sku: 'TB-014',
    category: 'Infantil',
    status: 'Disponivel',
    price: 'R$ 58,40',
    image: '/sample-products/tubarao-1.jpeg',
    attention: 78,
  },
  {
    id: 'EP-220',
    title: 'Kit esponja e pano multiuso',
    sku: 'EP-220',
    category: 'Utilidades',
    status: 'Reposicao',
    price: 'R$ 12,50',
    image: '/sample-products/esponja-1.png',
    attention: 64,
  },
  {
    id: 'UX-032',
    title: 'Urso xadrez para presente',
    sku: 'UX-032',
    category: 'Presentes',
    status: 'Disponivel',
    price: 'R$ 49,90',
    image: '/sample-products/urso-1.png',
    attention: 91,
  },
]

export const catalogSections = [
  'Lancamentos',
  'Utilidades domesticas',
  'Presentes',
  'Infantil',
]

export const catalogDesignPresets: CatalogDesignPreset[] = [
  {
    id: 'clean-wholesale',
    templateId: 'atacado_limpo_01',
    packageVersion: '1.0.0',
    sourceType: 'manual',
    name: 'Atacado Limpo',
    status: 'Publicado',
    audience: 'Distribuidoras e fornecedores',
    description:
      'Layout direto, rapido e com foco em lista de produtos para compra recorrente.',
    coverStyle: 'Cabecalho compacto com busca fixa',
    gridStyle: 'Grade de cards objetivos',
    primaryColor: '#0f766e',
    accentColor: '#d97706',
    backgroundColor: '#f6f7f2',
    surfaceColor: '#ffffff',
    textColor: '#0f172a',
    previewImage: '/sample-products/esponja-1.png',
    previewKind: 'generated',
    supportsFields: defaultProductDisplayOptions,
    defaultDisplayOptions: defaultProductDisplayOptions,
  },
  {
    id: 'gift-showcase',
    templateId: 'vitrine_presentes_01',
    packageVersion: '1.0.0',
    sourceType: 'manual',
    name: 'Vitrine Presentes',
    status: 'Rascunho',
    audience: 'Lojas de presentes e decoracao',
    description:
      'Catalogo mais visual, com produtos maiores e destaque para fotos contextuais.',
    coverStyle: 'Capa visual com destaque de colecao',
    gridStyle: 'Cards grandes com preco destacado',
    primaryColor: '#be123c',
    accentColor: '#2563eb',
    backgroundColor: '#fff7ed',
    surfaceColor: '#ffffff',
    textColor: '#1f2937',
    previewImage: '/sample-products/urso-1.png',
    previewKind: 'generated',
    supportsFields: defaultProductDisplayOptions,
    defaultDisplayOptions: defaultProductDisplayOptions,
  },
  {
    id: 'kids-fast',
    templateId: 'infantil_rapido_01',
    packageVersion: '1.0.0',
    sourceType: 'manual',
    name: 'Infantil Rapido',
    status: 'Publicado',
    audience: 'Brinquedos e infantil',
    description:
      'Visual simples e alegre, mantendo performance e leitura facil no celular.',
    coverStyle: 'Topo colorido com secoes visiveis',
    gridStyle: 'Cards arredondados com imagem forte',
    primaryColor: '#2563eb',
    accentColor: '#f59e0b',
    backgroundColor: '#eef6ff',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    previewImage: '/sample-products/tubarao-1.jpeg',
    previewKind: 'generated',
    supportsFields: defaultProductDisplayOptions,
    defaultDisplayOptions: defaultProductDisplayOptions,
  },
]

export const selectedCatalogDesignId = 'clean-wholesale'

export const companies: CompanyAccount[] = []

export const representatives: RepresentativeAccount[] = []

export const representationFirms: RepresentationFirmAccount[] = []

export const companyCatalogs: CompanyCatalog[] = []

export const recentClients = [
  {
    name: 'Cadu',
    catalog: 'Utilidades 2026',
    time: '4min 12s',
    interest: 'Alto',
    product: 'Urso xadrez para presente',
  },
  {
    name: 'Marina',
    catalog: 'Presentes',
    time: '2min 38s',
    interest: 'Medio',
    product: 'Arara decorativa em pelucia',
  },
  {
    name: 'Loja Sol',
    catalog: 'Infantil',
    time: '5min 01s',
    interest: 'Muito alto',
    product: 'Tubarao de pelucia azul',
  },
]

export const appModules = [
  { label: 'Dashboard', href: '/app', icon: BarChart3 },
  { label: 'Produtos', href: '/app/products', icon: PackageOpen },
  { label: 'Imagens', href: '/app/products', icon: Image },
  { label: 'Catalogos', href: '/app/catalogs', icon: FileText },
  { label: 'Designs', href: '/app/designs', icon: Brush },
  { label: 'Representantes', href: '/app/representatives', icon: Users },
  { label: 'Relatorios', href: '/app/reports', icon: Gauge },
  { label: 'Plano', href: '/app/plan', icon: Boxes },
  { label: 'Links publicos', href: '/c/utilidades-2026/rep-cadu', icon: Link2 },
]
