import type { CatalogDesignPreset } from '../../data/mock'
import type { BrownBeigeTokens } from './types'

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

export function isBrownBeigeDesign(design: CatalogDesignPreset) {
  const config = isRecord(design.configJson) ? design.configJson : {}

  return (
    design.templateId === 'brown_beige_modern_01' ||
    readString(config.componentKey, '') === 'BrownBeigeModernCatalog' ||
    /brown beige|bege moderno|casa moderna/i.test(design.name)
  )
}

export function readBrownBeigeTokens(
  design: CatalogDesignPreset,
): BrownBeigeTokens {
  return {
    primary: readConfigToken(design, 'primaryColor', design.primaryColor),
    secondary: readConfigToken(design, 'secondaryColor', '#01385E'),
    background: readConfigToken(
      design,
      'backgroundColor',
      design.backgroundColor,
    ),
    paper: readConfigToken(design, 'paperColor', '#EEE1D1'),
    text: readConfigToken(design, 'textColor', design.textColor),
    priceColor: readConfigToken(design, 'priceColor', '#FFFFFF'),
  }
}
