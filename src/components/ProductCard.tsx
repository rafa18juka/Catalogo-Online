import { Copy, Eye, ImageIcon } from 'lucide-react'
import type { Product } from '../data/mock'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="grid grid-cols-[88px_1fr] gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[112px_1fr]">
      <div className="aspect-square overflow-hidden rounded-md bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover"
          loading="lazy"
          width="320"
          height="320"
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-950">
              {product.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {product.sku} · {product.category}
            </p>
          </div>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
            {product.status}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-800">
            {product.price}
          </span>
          <span className="rounded-md bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
            {product.attention}% atencao
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 hover:border-teal-600 hover:text-teal-700"
            type="button"
            title="Ver produto"
          >
            <Eye size={16} aria-hidden="true" />
          </button>
          <button
            className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 hover:border-teal-600 hover:text-teal-700"
            type="button"
            title="Imagens"
          >
            <ImageIcon size={16} aria-hidden="true" />
          </button>
          <button
            className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 hover:border-teal-600 hover:text-teal-700"
            type="button"
            title="Copiar SKU"
          >
            <Copy size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
