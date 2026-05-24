import type { CatalogDesignPreset } from '../data/mock'
import { products } from '../data/mock'

type DesignPreviewProps = {
  design: CatalogDesignPreset
}

export function DesignPreview({ design }: DesignPreviewProps) {
  const shouldUseUploadedPreview =
    design.sourceType === 'design_pack' || design.previewKind === 'svg'

  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-200 shadow-sm"
      style={{
        backgroundColor: design.backgroundColor,
        color: design.textColor,
      }}
    >
      <div
        className="px-4 py-4"
        style={{ backgroundColor: design.primaryColor, color: '#ffffff' }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
          Preview
        </p>
        <h3 className="mt-1 text-lg font-semibold">{design.name}</h3>
      </div>
      {shouldUseUploadedPreview ? (
        <img
          alt={design.name}
          className="aspect-[16/10] w-full bg-white object-cover"
          height="320"
          loading="lazy"
          src={design.previewImage}
          width="512"
        />
      ) : (
      <div className="grid grid-cols-2 gap-3 p-3">
        {products.slice(0, 2).map((product) => (
          <article
            className="overflow-hidden rounded-md"
            key={`${design.id}-${product.id}`}
            style={{ backgroundColor: design.surfaceColor }}
          >
            <img
              alt={product.title}
              className="aspect-square w-full object-cover"
              height="160"
              loading="lazy"
              src={product.image}
              width="160"
            />
            <div className="p-2">
              <p className="truncate text-sm font-semibold">{product.title}</p>
              <p
                className="mt-1 text-xs font-semibold"
                style={{ color: design.accentColor }}
              >
                {product.price}
              </p>
            </div>
          </article>
        ))}
      </div>
      )}
    </div>
  )
}
