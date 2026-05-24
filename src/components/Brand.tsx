import { Sparkles } from 'lucide-react'

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-lg bg-[#0f766e] text-white shadow-sm">
        <Sparkles size={20} aria-hidden="true" />
      </div>
      <div>
        <p className="text-base font-semibold leading-tight text-slate-950">
          Catalogo Online
        </p>
        <p className="text-xs text-slate-500">SaaS multiempresa</p>
      </div>
    </div>
  )
}
