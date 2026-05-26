import type { CatalogDesignPreset } from '../../data/mock'
import type { AuroraTokens } from './types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function readConfigToken(
  design: CatalogDesignPreset,
  key: string,
  fallback: string,
) {
  const config = isRecord(design.configJson) ? design.configJson : {}
  const tokens = isRecord(config.defaultTokens) ? config.defaultTokens : {}

  return readString(tokens[key], fallback)
}

export function isAuroraDesign(design: CatalogDesignPreset) {
  const config = isRecord(design.configJson) ? design.configJson : {}

  return (
    design.templateId === 'aurora_editorial_01' ||
    readString(config.componentKey, '') === 'AuroraEditorialCatalog' ||
    /aurora editorial/i.test(design.name)
  )
}

export function readAuroraTokens(design: CatalogDesignPreset): AuroraTokens {
  return {
    primary: readConfigToken(design, 'primaryColor', design.primaryColor),
    secondary: readConfigToken(design, 'secondaryColor', '#0B3B57'),
    background: readConfigToken(
      design,
      'backgroundColor',
      design.backgroundColor,
    ),
    paper: readConfigToken(design, 'paperColor', '#F7F1E8'),
    priceColor: readConfigToken(design, 'priceColor', '#0EA5E9'),
  }
}
