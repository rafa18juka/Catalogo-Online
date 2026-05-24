export type AppSurface = 'company' | 'dev' | 'representative' | 'catalog'

export const surfacePorts: Record<AppSurface, string> = {
  company: '5175',
  dev: '5174',
  representative: '5176',
  catalog: '5177',
}

export function getSurfaceFromPort(port: string): AppSurface {
  if (port === surfacePorts.dev) return 'dev'
  if (port === surfacePorts.representative) return 'representative'
  if (port === surfacePorts.catalog) return 'catalog'

  return 'company'
}

export function getDefaultPathForSurface(surface: AppSurface) {
  if (surface === 'dev') return '/dev'
  if (surface === 'representative') return '/portal'
  if (surface === 'catalog') return '/c/utilidades-2026/rep-cadu'

  return '/portal'
}
