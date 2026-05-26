import {
  companies as initialCompanies,
  catalogCoverPresets,
  catalogDesignPresets as initialCatalogDesignPresets,
  companyCatalogs as initialCatalogs,
  defaultProductDisplayOptions,
  type CatalogDesignPreset,
  representationFirms as initialRepresentationFirms,
  representatives as initialRepresentatives,
  type CompanyAccount,
  type CompanyCatalog,
  type Product,
  type ProductDisplayOptions,
  type RepresentationFirmAccount,
  type RepresentativeAccount,
  type RepresentativeLink,
} from '../data/mock'

const storagePrefix = 'catalogo.v3.'
const companySessionKey = `${storagePrefix}companySession`
const representativeSessionKey = `${storagePrefix}representativeSession`
const representationFirmSessionKey = `${storagePrefix}representationFirmSession`
const inviteTokensKey = `${storagePrefix}inviteTokens`
const representativeLinksKey = `${storagePrefix}representativeLinks`
const catalogReleasesKey = `${storagePrefix}catalogReleases`
const companiesKey = `${storagePrefix}companies`
const representativesKey = `${storagePrefix}representatives`
const representationFirmsKey = `${storagePrefix}representationFirms`
const catalogsKey = `${storagePrefix}companyCatalogs`
const productsKey = `${storagePrefix}products`
const designsKey = `${storagePrefix}catalogDesignPresets`

type InviteToken = {
  token: string
  companyId: string
  createdAt: string
  usedById?: string
  usedByType?: 'autonomous' | 'representation_firm'
}

type CatalogRelease = {
  catalogId: string
  isReleasedToRepresentatives: boolean
}

const defaultCatalogCoverPreset = catalogCoverPresets[0]

function mergeInitialCatalogDesignPresets(designs: CatalogDesignPreset[]) {
  const designIds = new Set(designs.map((design) => design.id))
  const missingInitialDesigns = initialCatalogDesignPresets.filter(
    (design) => !designIds.has(design.id),
  )

  return [...designs, ...missingInitialDesigns]
}

function readJson<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key)

  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function resetMockData() {
  [
    companySessionKey,
    representativeSessionKey,
    representationFirmSessionKey,
    inviteTokensKey,
    representativeLinksKey,
    catalogReleasesKey,
    companiesKey,
    representativesKey,
    representationFirmsKey,
    catalogsKey,
    productsKey,
    designsKey,
  ].forEach((key) => window.localStorage.removeItem(key))
}

export function getCompanies() {
  return readJson<CompanyAccount[]>(companiesKey, initialCompanies)
}

export function saveCompanies(companies: CompanyAccount[]) {
  writeJson(companiesKey, companies)
}

export function getCompanyById(companyId: string) {
  return getCompanies().find((company) => company.id === companyId) ?? null
}

export function getRepresentatives() {
  return readJson<RepresentativeAccount[]>(representativesKey, initialRepresentatives)
}

export function saveRepresentatives(representatives: RepresentativeAccount[]) {
  writeJson(representativesKey, representatives)
}

export function getRepresentationFirms() {
  return readJson<RepresentationFirmAccount[]>(
    representationFirmsKey,
    initialRepresentationFirms,
  )
}

export function saveRepresentationFirms(firms: RepresentationFirmAccount[]) {
  writeJson(representationFirmsKey, firms)
}

export function getCompanyCatalogs() {
  return readJson<CompanyCatalog[]>(catalogsKey, initialCatalogs).map(
    withCatalogDefaults,
  )
}

export function saveCompanyCatalogs(catalogs: CompanyCatalog[]) {
  writeJson(catalogsKey, catalogs)
}

function withCatalogDefaults(catalog: CompanyCatalog): CompanyCatalog {
  return {
    ...catalog,
    coverTypeId: catalog.coverTypeId ?? defaultCatalogCoverPreset.id,
    coverTitle: catalog.coverTitle ?? defaultCatalogCoverPreset.title,
    coverDescription:
      catalog.coverDescription ?? defaultCatalogCoverPreset.description,
    displayOptions: catalog.displayOptions ?? defaultProductDisplayOptions,
  }
}

export function getCatalogDesignPresets() {
  return mergeInitialCatalogDesignPresets(
    readJson<CatalogDesignPreset[]>(designsKey, initialCatalogDesignPresets),
  )
}

export function saveCatalogDesignPresets(designs: CatalogDesignPreset[]) {
  writeJson(designsKey, designs)
}

export function createCatalogDesignPreset(
  design: Omit<
    CatalogDesignPreset,
    'id' | 'status' | 'previewImage' | 'supportsFields' | 'defaultDisplayOptions'
  > &
    Partial<
      Pick<
        CatalogDesignPreset,
        | 'status'
        | 'previewImage'
        | 'supportsFields'
        | 'defaultDisplayOptions'
        | 'previewKind'
      >
    >,
) {
  const newDesign: CatalogDesignPreset = {
    ...design,
    id: createId('design'),
    status: design.status ?? 'Publicado',
    previewImage: design.previewImage ?? '/sample-products/esponja-1.png',
    previewKind: design.previewKind ?? 'generated',
    supportsFields: design.supportsFields ?? defaultProductDisplayOptions,
    defaultDisplayOptions:
      design.defaultDisplayOptions ?? defaultProductDisplayOptions,
  }

  saveCatalogDesignPresets([newDesign, ...getCatalogDesignPresets()])

  return newDesign
}

export function getPublishedCatalogDesignPresets() {
  return getCatalogDesignPresets().filter((design) => design.status === 'Publicado')
}

export function updateCatalogDesignPresetStatus(
  designId: string,
  status: CatalogDesignPreset['status'],
) {
  saveCatalogDesignPresets(
    getCatalogDesignPresets().map((design) =>
      design.id === designId ? { ...design, status } : design,
    ),
  )
}

export function registerCompany(
  company: Omit<CompanyAccount, 'id' | 'paymentStatus' | 'accessSource'>,
) {
  const newCompany: CompanyAccount = {
    ...company,
    id: createId('company'),
    paymentStatus: 'manual_active',
    accessSource: 'manual',
  }

  saveCompanies([...getCompanies(), newCompany])

  return newCompany
}

export function createCompanyCatalog(companyId: string, name = 'Novo catalogo') {
  const slugBase = slugify(name)
  const selectedDesign =
    getPublishedCatalogDesignPresets()[0] ?? getCatalogDesignPresets()[0]
  const catalog: CompanyCatalog = {
    id: createId('catalog'),
    companyId,
    name,
    slug: `${slugBase}-${Date.now().toString().slice(-4)}`,
    designPresetId: selectedDesign?.id ?? 'clean-wholesale',
    coverTypeId: defaultCatalogCoverPreset.id,
    coverTitle: defaultCatalogCoverPreset.title,
    coverDescription: defaultCatalogCoverPreset.description,
    displayOptions:
      selectedDesign?.defaultDisplayOptions ?? defaultProductDisplayOptions,
    isReleasedToRepresentatives: false,
    productsCount: 0,
  }

  saveCompanyCatalogs([...getCompanyCatalogs(), catalog])

  return catalog
}

export function getCompanyProducts() {
  const company = getCurrentCompany()

  if (!company) return [] as Product[]

  return getCompanyProductsByCompanyId(company.id)
}

export function getCompanyProductsByCompanyId(companyId: string) {
  return readJson<Product[]>(productsKey, []).filter(
    (product) => product.companyId === companyId,
  )
}

export function saveProducts(products: Product[]) {
  writeJson(productsKey, products)
}

export function createCompanyProduct(
  product: Omit<Product, 'id' | 'companyId' | 'attention'>,
) {
  const company = getCurrentCompany()

  if (!company) return null

  const newProduct: Product = {
    ...product,
    id: createId('product'),
    companyId: company.id,
    attention: 0,
  }

  saveProducts([newProduct, ...readJson<Product[]>(productsKey, [])])
  refreshCatalogProductCounts(company.id)

  return newProduct
}

export function refreshCatalogProductCounts(companyId: string) {
  const productsCount = getCompanyProductsByCompanyId(companyId).length

  saveCompanyCatalogs(
    getCompanyCatalogs().map((catalog) =>
      catalog.companyId === companyId ? { ...catalog, productsCount } : catalog,
    ),
  )
}

export function updateCompanyCatalogDesign(
  catalogId: string,
  designPresetId: string,
) {
  const design = getCatalogDesignPresets().find((item) => item.id === designPresetId)

  saveCompanyCatalogs(
    getCompanyCatalogs().map((catalog) =>
      catalog.id === catalogId
        ? {
            ...catalog,
            designPresetId,
            displayOptions: design?.defaultDisplayOptions ?? catalog.displayOptions,
          }
        : catalog,
    ),
  )
}

export function updateCompanyCatalogDisplayOptions(
  catalogId: string,
  displayOptions: ProductDisplayOptions,
) {
  saveCompanyCatalogs(
    getCompanyCatalogs().map((catalog) =>
      catalog.id === catalogId ? { ...catalog, displayOptions } : catalog,
    ),
  )
}

export function updateCompanyCatalogCover(
  catalogId: string,
  cover: Pick<
    CompanyCatalog,
    'coverTypeId' | 'coverTitle' | 'coverDescription'
  >,
) {
  saveCompanyCatalogs(
    getCompanyCatalogs().map((catalog) =>
      catalog.id === catalogId ? { ...catalog, ...cover } : catalog,
    ),
  )
}

export function getCompanyRecentClients() {
  return [] as Array<never>
}

export function registerAutonomousRepresentative(
  representative: Omit<RepresentativeAccount, 'id' | 'kind'>,
) {
  const newRepresentative: RepresentativeAccount = {
    ...representative,
    id: createId('rep'),
    kind: 'autonomous',
  }

  saveRepresentatives([...getRepresentatives(), newRepresentative])

  return newRepresentative
}

export function registerRepresentationFirm(
  firm: Omit<RepresentationFirmAccount, 'id'>,
) {
  const newFirm: RepresentationFirmAccount = {
    ...firm,
    id: createId('repfirm'),
  }

  saveRepresentationFirms([...getRepresentationFirms(), newFirm])

  return newFirm
}

export function registerFirmRepresentative(
  firmId: string,
  representative: Omit<RepresentativeAccount, 'id' | 'kind' | 'firmId'>,
) {
  const newRepresentative: RepresentativeAccount = {
    ...representative,
    id: createId('rep'),
    kind: 'firm_member',
    firmId,
  }

  saveRepresentatives([...getRepresentatives(), newRepresentative])

  return newRepresentative
}

export function authenticateCompany(email: string, password: string) {
  return (
    getCompanies().find(
      (company) => company.email === email && company.password === password,
    ) ?? null
  )
}

export function authenticateRepresentative(email: string, password: string) {
  return (
    getRepresentatives().find(
      (representative) =>
        representative.email === email && representative.password === password,
    ) ?? null
  )
}

export function authenticateRepresentationFirm(email: string, password: string) {
  return (
    getRepresentationFirms().find(
      (firm) => firm.email === email && firm.password === password,
    ) ?? null
  )
}

export function getCurrentCompany() {
  const companyId = window.localStorage.getItem(companySessionKey)

  return getCompanies().find((company) => company.id === companyId) ?? null
}

export function setCurrentCompany(companyId: string) {
  window.localStorage.setItem(companySessionKey, companyId)
}

export function clearCurrentCompany() {
  window.localStorage.removeItem(companySessionKey)
}

export function getCurrentRepresentative() {
  const representativeId = window.localStorage.getItem(representativeSessionKey)

  return (
    getRepresentatives().find(
      (representative) => representative.id === representativeId,
    ) ?? null
  )
}

export function setCurrentRepresentative(representativeId: string) {
  window.localStorage.setItem(representativeSessionKey, representativeId)
}

export function clearCurrentRepresentative() {
  window.localStorage.removeItem(representativeSessionKey)
}

export function getCurrentRepresentationFirm() {
  const firmId = window.localStorage.getItem(representationFirmSessionKey)

  return getRepresentationFirms().find((firm) => firm.id === firmId) ?? null
}

export function setCurrentRepresentationFirm(firmId: string) {
  window.localStorage.setItem(representationFirmSessionKey, firmId)
}

export function clearCurrentRepresentationFirm() {
  window.localStorage.removeItem(representationFirmSessionKey)
}

export function getInviteTokens() {
  return readJson<InviteToken[]>(inviteTokensKey, [])
}

export function createCompanyInviteToken(companyId: string) {
  const token = `FORN-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now()
    .toString()
    .slice(-4)}`
  const tokens = getInviteTokens()
  const inviteToken = {
    token,
    companyId,
    createdAt: new Date().toISOString(),
  }

  writeJson(inviteTokensKey, [inviteToken, ...tokens])

  return inviteToken
}

export function getRepresentativeLinks() {
  return readJson<RepresentativeLink[]>(representativeLinksKey, [])
}

export function saveRepresentativeLinks(links: RepresentativeLink[]) {
  writeJson(representativeLinksKey, links)
}

export function linkAccessWithToken(
  entityId: string,
  representativeType: 'autonomous' | 'representation_firm',
  token: string,
) {
  const tokens = getInviteTokens()
  const normalizedToken = token.trim().toUpperCase()
  const invite = tokens.find((item) => item.token === normalizedToken)

  if (!invite) {
    return { ok: false, message: 'Token nao encontrado.' }
  }

  const links = getRepresentativeLinks()
  const alreadyLinked = links.some(
    (link) =>
      link.representativeId === entityId &&
      link.representativeType === representativeType &&
      link.companyId === invite.companyId &&
      link.status === 'active',
  )

  if (!alreadyLinked) {
    saveRepresentativeLinks([
      ...links,
      {
        representativeId: entityId,
        representativeType,
        companyId: invite.companyId,
        token: invite.token,
        linkedAt: new Date().toISOString(),
        status: 'active',
      },
    ])
  }

  writeJson(
    inviteTokensKey,
    tokens.map((item) =>
      item.token === invite.token
        ? {
            ...item,
            usedById: entityId,
            usedByType: representativeType,
          }
        : item,
    ),
  )

  return { ok: true, message: 'Empresa vinculada com sucesso.' }
}

export function revokeRepresentativeLink(
  companyId: string,
  representativeId: string,
  representativeType: 'autonomous' | 'representation_firm',
) {
  saveRepresentativeLinks(
    getRepresentativeLinks().map((link) =>
      link.companyId === companyId &&
      link.representativeId === representativeId &&
      link.representativeType === representativeType
        ? { ...link, status: 'revoked', revokedAt: new Date().toISOString() }
        : link,
    ),
  )
}

export function getCatalogsWithReleaseState(companyId: string) {
  const releases = readJson<CatalogRelease[]>(catalogReleasesKey, [])

  return getCompanyCatalogs()
    .filter((catalog) => catalog.companyId === companyId)
    .map((catalog) => {
      const override = releases.find((item) => item.catalogId === catalog.id)

      return {
        ...catalog,
        displayOptions: catalog.displayOptions ?? defaultProductDisplayOptions,
        productsCount: getCompanyProductsByCompanyId(catalog.companyId).length,
        isReleasedToRepresentatives:
          override?.isReleasedToRepresentatives ??
          catalog.isReleasedToRepresentatives,
      }
    })
}

export function setCatalogRelease(catalogId: string, isReleased: boolean) {
  const releases = readJson<CatalogRelease[]>(catalogReleasesKey, [])
  const next = releases.filter((item) => item.catalogId !== catalogId)

  writeJson(catalogReleasesKey, [
    ...next,
    { catalogId, isReleasedToRepresentatives: isReleased },
  ])
}

function getActiveLinksForEntity(
  entityId: string,
  representativeType: 'autonomous' | 'representation_firm',
) {
  return getRepresentativeLinks().filter(
    (link) =>
      link.representativeId === entityId &&
      link.representativeType === representativeType &&
      link.status === 'active',
  )
}

export function getReleasedCatalogsForRepresentative(representativeId: string) {
  const representative = getRepresentatives().find((item) => item.id === representativeId)
  const entityId = representative?.firmId ?? representativeId
  const entityType = representative?.firmId ? 'representation_firm' : 'autonomous'
  const links = getActiveLinksForEntity(entityId, entityType)

  return links.flatMap((link) =>
    getCatalogsWithReleaseState(link.companyId)
      .filter((catalog) => catalog.isReleasedToRepresentatives)
      .map((catalog) => ({
        ...catalog,
        company: getCompanies().find((company) => company.id === link.companyId),
      })),
  )
}

export function getReleasedCatalogsForRepresentationFirm(firmId: string) {
  const links = getActiveLinksForEntity(firmId, 'representation_firm')

  return links.flatMap((link) =>
    getCatalogsWithReleaseState(link.companyId)
      .filter((catalog) => catalog.isReleasedToRepresentatives)
      .map((catalog) => ({
        ...catalog,
        company: getCompanies().find((company) => company.id === link.companyId),
      })),
  )
}

export function getLinkedCompaniesForRepresentative(representativeId: string) {
  const representative = getRepresentatives().find((item) => item.id === representativeId)
  const entityId = representative?.firmId ?? representativeId
  const entityType = representative?.firmId ? 'representation_firm' : 'autonomous'
  const links = getActiveLinksForEntity(entityId, entityType)

  return links
    .map((link) => getCompanies().find((company) => company.id === link.companyId))
    .filter((company): company is CompanyAccount => Boolean(company))
}

export function getLinkedCompaniesForRepresentationFirm(firmId: string) {
  return getActiveLinksForEntity(firmId, 'representation_firm')
    .map((link) => getCompanies().find((company) => company.id === link.companyId))
    .filter((company): company is CompanyAccount => Boolean(company))
}

export function getCompanyRepresentativeLinks(companyId: string) {
  return getRepresentativeLinks().filter(
    (link) => link.companyId === companyId && link.status === 'active',
  )
}

export function getCompanyCatalogCount(companyId: string) {
  return getCatalogsWithReleaseState(companyId).length
}

export function getCatalogBySlug(slug: string): CompanyCatalog | undefined {
  return getCompanyCatalogs().find((catalog) => catalog.slug === slug)
}
