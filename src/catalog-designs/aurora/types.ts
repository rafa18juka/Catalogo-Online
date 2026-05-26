import type { CatalogDesignPreset, ProductDisplayOptions } from '../../data/mock'

export type CatalogCoverContent = {
  title: string
  description: string
}

export type AuroraTokens = {
  primary: string
  secondary: string
  background: string
  paper: string
  priceColor: string
}

export type AuroraRendererProps = {
  design: CatalogDesignPreset
  displayOptions: ProductDisplayOptions
  productLimit: number
  companyLogoUrl?: string
  companyName?: string
  coverContent?: CatalogCoverContent
}
