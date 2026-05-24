import { Filter, ImagePlus, Plus, Upload } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { createCompanyProduct, getCompanyProducts } from '../lib/mockStore'

type ProductForm = {
  title: string
  sku: string
  category: string
  description: string
  price: string
  status: string
  images: string[]
}

const emptyForm: ProductForm = {
  title: '',
  sku: '',
  category: '',
  description: '',
  price: '',
  status: 'Disponivel',
  images: [],
}

export function ProductsPage() {
  const [products, setProducts] = useState(getCompanyProducts())
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [message, setMessage] = useState('')

  function updateField(name: keyof ProductForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleImages(files: FileList | null) {
    if (!files) return

    const selectedFiles = Array.from(files).slice(0, 5)

    Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result))
            reader.readAsDataURL(file)
          }),
      ),
    ).then((images) => {
      setForm((current) => ({ ...current, images }))
    })
  }

  function handleCreateProduct() {
    if (!form.title || !form.sku || !form.category) {
      setMessage('Preencha titulo, SKU e categoria.')
      return
    }

    createCompanyProduct({
      title: form.title,
      sku: form.sku,
      category: form.category,
      description: form.description,
      price: form.price ? `R$ ${form.price}` : 'Sem preco',
      status: form.status,
      image: form.images[0] ?? '/sample-products/esponja-1.png',
      images: form.images,
    })
    setProducts(getCompanyProducts())
    setForm(emptyForm)
    setMessage('Produto cadastrado.')
  }

  return (
    <>
      <PageHeader
        eyebrow="Produtos"
        title="Cadastro e imagens"
        description="Cadastre produtos completos com ate 5 imagens. A empresa comeca sem produtos."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
              type="button"
            >
              <Upload size={18} aria-hidden="true" />
              Importar
            </button>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
              onClick={handleCreateProduct}
              type="button"
            >
              <Plus size={18} aria-hidden="true" />
              Salvar produto
            </button>
          </div>
        }
      />
      <section className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[420px_1fr]">
        <form className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Novo produto</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Titulo"
              onChange={(value) => updateField('title', value)}
              value={form.title}
            />
            <Field
              label="SKU"
              onChange={(value) => updateField('sku', value)}
              value={form.sku}
            />
            <Field
              label="Categoria"
              onChange={(value) => updateField('category', value)}
              value={form.category}
            />
            <Field
              label="Preco"
              onChange={(value) => updateField('price', value)}
              value={form.price}
            />
            <Field
              label="Status"
              onChange={(value) => updateField('status', value)}
              value={form.status}
            />
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Descricao
            </span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:bg-white"
              onChange={(event) => updateField('description', event.target.value)}
              value={form.description}
            />
          </label>
          <label className="mt-4 block rounded-lg border border-dashed border-slate-300 p-4 text-center">
            <ImagePlus
              className="mx-auto text-slate-400"
              size={24}
              aria-hidden="true"
            />
            <span className="mt-2 block text-sm font-semibold text-slate-700">
              Ate 5 imagens
            </span>
            <input
              accept="image/*"
              className="mt-3 text-sm"
              multiple
              onChange={(event) => handleImages(event.target.files)}
              type="file"
            />
          </label>
          {form.images.length ? (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {form.images.map((image, index) => (
                <img
                  alt={`Imagem ${index + 1}`}
                  className="aspect-square rounded-md object-cover"
                  key={image}
                  src={image}
                />
              ))}
            </div>
          ) : null}
          {message ? (
            <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
              {message}
            </p>
          ) : null}
        </form>

        <div>
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
            <input
              className="h-10 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
              placeholder="Buscar por titulo, SKU ou categoria"
              type="search"
            />
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
              type="button"
            >
              <Filter size={18} aria-hidden="true" />
              Filtros
            </button>
          </div>
          {products.length ? (
            <div className="grid gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                Nenhum produto cadastrado
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Cadastre o primeiro produto usando o formulario ao lado.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

function Field({ label, value, onChange }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  )
}
