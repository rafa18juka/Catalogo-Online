import type { CatalogDesignPreset, ProductDisplayOptions } from '../../data/mock'

export type CatalogCoverContent = {
  title: string
  description: string
}

export type BrownBeigeTokens = {
  primary: string
  secondary: string
  background: string
  paper: string
  text: string
  priceColor: string
}

export type BrownBeigeRendererProps = {
  design: CatalogDesignPreset
  displayOptions: ProductDisplayOptions
  productLimit: number
  companyLogoUrl?: string
  companyName?: string
  coverContent?: CatalogCoverContent
}
