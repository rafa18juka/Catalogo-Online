import type { Metric } from '../data/mock'

type MetricCardProps = {
  metric: Metric
}

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = metric.icon

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{metric.label}</p>
          <strong className="mt-2 block text-3xl font-semibold text-slate-950">
            {metric.value}
          </strong>
        </div>
        <span className={`rounded-lg p-2 ${metric.tone}`}>
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">{metric.trend}</p>
    </article>
  )
}
