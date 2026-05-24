import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Boxes,
  FileText,
  Gauge,
  Image,
  Link2,
  PackageOpen,
  Users,
} from 'lucide-react'

export type Product = {
  id: string
  title: string
  sku: string
  category: string
  status: string
  price: string
  image: string
  attention: number
}

export type Metric = {
  label: string
  value: string
  trend: string
  icon: LucideIcon
  tone: string
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
  { label: 'Representantes', href: '/app/representatives', icon: Users },
  { label: 'Relatorios', href: '/app/reports', icon: Gauge },
  { label: 'Plano', href: '/app/plan', icon: Boxes },
  { label: 'Links publicos', href: '/c/utilidades-2026/rep-cadu', icon: Link2 },
]
