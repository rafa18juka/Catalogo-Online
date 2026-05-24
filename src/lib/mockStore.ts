import {
  companies,
  companyCatalogs,
  type CompanyAccount,
  type CompanyCatalog,
  representatives,
  type RepresentativeLink,
} from '../data/mock'

const companySessionKey = 'catalogo.companySession'
const representativeSessionKey = 'catalogo.representativeSession'
const inviteTokensKey = 'catalogo.inviteTokens'
const representativeLinksKey = 'catalogo.representativeLinks'
const catalogReleasesKey = 'catalogo.catalogReleases'

type InviteToken = {
  token: string
  companyId: string
  createdAt: string
  usedByRepresentativeId?: string
}

type CatalogRelease = {
  catalogId: string
  isReleasedToRepresentatives: boolean
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

export function getCurrentCompany() {
  const companyId = window.localStorage.getItem(companySessionKey)

  return companies.find((company) => company.id === companyId) ?? null
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
    representatives.find((representative) => representative.id === representativeId) ??
    null
  )
}

export function setCurrentRepresentative(representativeId: string) {
  window.localStorage.setItem(representativeSessionKey, representativeId)
}

export function clearCurrentRepresentative() {
  window.localStorage.removeItem(representativeSessionKey)
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

export function linkRepresentativeWithToken(
  representativeId: string,
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
      link.representativeId === representativeId &&
      link.companyId === invite.companyId,
  )

  if (!alreadyLinked) {
    writeJson(representativeLinksKey, [
      ...links,
      {
        representativeId,
        companyId: invite.companyId,
        token: invite.token,
        linkedAt: new Date().toISOString(),
      },
    ])
  }

  writeJson(
    inviteTokensKey,
    tokens.map((item) =>
      item.token === invite.token
        ? { ...item, usedByRepresentativeId: representativeId }
        : item,
    ),
  )

  return { ok: true, message: 'Empresa vinculada com sucesso.' }
}

export function getCatalogsWithReleaseState(companyId: string) {
  const releases = readJson<CatalogRelease[]>(catalogReleasesKey, [])

  return companyCatalogs
    .filter((catalog) => catalog.companyId === companyId)
    .map((catalog) => {
      const override = releases.find((item) => item.catalogId === catalog.id)

      return {
        ...catalog,
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

export function getReleasedCatalogsForRepresentative(representativeId: string) {
  const links = getRepresentativeLinks().filter(
    (link) => link.representativeId === representativeId,
  )

  return links.flatMap((link) =>
    getCatalogsWithReleaseState(link.companyId)
      .filter((catalog) => catalog.isReleasedToRepresentatives)
      .map((catalog) => ({
        ...catalog,
        company: companies.find((company) => company.id === link.companyId),
      })),
  )
}

export function getLinkedCompaniesForRepresentative(representativeId: string) {
  const links = getRepresentativeLinks().filter(
    (link) => link.representativeId === representativeId,
  )

  return links
    .map((link) => companies.find((company) => company.id === link.companyId))
    .filter((company): company is CompanyAccount => Boolean(company))
}

export function getCompanyRepresentativeLinks(companyId: string) {
  return getRepresentativeLinks().filter((link) => link.companyId === companyId)
}

export function getCompanyCatalogCount(companyId: string) {
  return getCatalogsWithReleaseState(companyId).length
}

export function getCatalogBySlug(slug: string): CompanyCatalog | undefined {
  return companyCatalogs.find((catalog) => catalog.slug === slug)
}
