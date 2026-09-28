// Static stand-in for the public directory API. Joins the sample
// records into the exact payloads docs/API.md §3 describes, so pages
// swap `searchCompanies(params)` for the typed client later without
// touching a component.
//
// Filtering and ordering here only imitate Laravel. The real ranking —
// relevance, completeness, verification, location/service match,
// quality, then premium visibility — is computed server-side (PDF p. 23).
import type { Paginated } from '~/types/api/common'
import type {
	CompanyCard,
	CompanyLocation,
	CompanyProfile,
	CompanySearchParams,
	InquiryAction,
	ProfessionalCard,
	ProfessionalProfile,
	ProfessionalSearchParams,
	TaxonomyItem,
	TaxonomyKey,
	TaxonomyRef,
	TaxonomyTag,
} from '~/types/features/directory'
import { type CompanyRecord, companyRecords } from './companies'
import { countryOf, findCountryBySlug, findLocation, locations, regionOf, subtreeIds, toLocationRef } from './locations'
import { type ProfessionalRecord, professionalRecords } from './professionals'
import { capabilities, industries, languages, services, taxonomies, technologies } from './taxonomies'

const inquiryActions: InquiryAction[] = ['contact', 'question', 'quote']

// --- Joins ----------------------------------------------------

function pick(ids: number[], list: TaxonomyItem[]): TaxonomyItem[] {
	return ids
		.map(id => list.find(item => item.id === id))
		.filter((item): item is TaxonomyItem => Boolean(item))
}

function tags(ids: number[], list: TaxonomyItem[]): TaxonomyTag[] {
	return pick(ids, list).map(({ name, slug }) => ({ name, slug }))
}

function refs(ids: number[], list: TaxonomyItem[]): TaxonomyRef[] {
	return pick(ids, list).map(({ id, name, slug }) => ({ id, name, slug }))
}

function marketRefs(ids: number[]): TaxonomyRef[] {
	return ids
		.map(id => findLocation(id))
		.filter(location => location !== undefined)
		.map(location => ({ id: location.id, name: location.name, slug: location.slug }))
}

function companyLocations(record: CompanyRecord): CompanyLocation[] {
	return record.location_ids
		.map(id => findLocation(id))
		.filter(location => location !== undefined)
		.map(location => ({
			id: location.id,
			type: location.type,
			name: location.name,
			region: regionOf(location)?.name ?? null,
			country: countryOf(location).name,
			is_headquarters: location.id === record.hq_location_id,
		}))
}

function toCompanyCard(record: CompanyRecord): CompanyCard {
	return {
		id: record.id,
		slug: record.slug,
		name: record.name,
		tagline: record.tagline,
		hq: record.hq_location_id ? toLocationRef(record.hq_location_id) : null,
		services: tags(record.service_ids, services),
		industries: tags(record.industry_ids, industries),
		claimed: record.claimed,
		verified: record.verified,
		featured: false,
		completeness_score: record.completeness_score,
		logo_url: null,
		logo_alt_text: `${record.name} logo`,
	}
}

function companyRef(companyId: number) {
	const company = companyRecords.find(record => record.id === companyId)
	if (!company) throw new Error(`Unknown company ${companyId}`)
	return { id: company.id, name: company.name, slug: company.slug }
}

function toProfessionalCard(record: ProfessionalRecord): ProfessionalCard {
	return {
		id: record.id,
		slug: record.slug,
		first_name: record.first_name,
		last_name: record.last_name,
		job_title: record.job_title,
		company: companyRef(record.company_id),
		location: record.location_id ? toLocationRef(record.location_id) : null,
		expertise: record.expertise,
		verified: record.verified,
		photo_url: null,
		photo_alt_text: `${record.first_name} ${record.last_name}`,
	}
}

function toCompanyProfile(record: CompanyRecord): CompanyProfile {
	return {
		...toCompanyCard(record),
		overview: record.overview,
		why_choose_us: record.why_choose_us,
		founded_year: record.founded_year,
		company_size: record.company_size,
		work_model: record.work_model,
		locations: companyLocations(record),
		capabilities: refs(record.capability_ids, capabilities),
		technologies: refs(record.technology_ids, technologies),
		languages: refs(record.language_ids, languages),
		certifications: record.certifications,
		website_url: record.website_url,
		linkedin_url: record.linkedin_url,
		other_social_json: null,
		phone: record.phone,
		cover_url: null,
		cover_alt_text: null,
		seo_title: null,
		seo_description: null,
		professionals: professionalRecords
			.filter(professional => professional.company_id === record.id)
			.map(toProfessionalCard),
		inquiry_actions: inquiryActions,
	}
}

function toProfessionalProfile(record: ProfessionalRecord): ProfessionalProfile {
	const company = companyRecords.find(item => item.id === record.company_id)
	if (!company) throw new Error(`Unknown company ${record.company_id}`)

	return {
		...toProfessionalCard(record),
		bio: record.bio,
		experience_summary: record.experience_summary,
		services: refs(record.service_ids, services),
		industries: refs(record.industry_ids, industries),
		languages: refs(record.language_ids, languages),
		markets: marketRefs(record.market_ids),
		timezone: record.timezone,
		linkedin_url: record.linkedin_url,
		website_url: record.website_url,
		public_email: null,
		phone: null,
		featured: false,
		completeness_score: record.completeness_score,
		seo_title: null,
		seo_description: null,
		company: toCompanyCard(company),
		inquiry_actions: inquiryActions,
	}
}

// --- Lists & lookups ------------------------------------------

const companyCards: CompanyCard[] = companyRecords.map(toCompanyCard)
const professionalCards: ProfessionalCard[] = professionalRecords.map(toProfessionalCard)

// GET /api/companies/{slug}
function findCompany(slug: string): CompanyProfile | undefined {
	const record = companyRecords.find(item => item.slug === slug)
	return record ? toCompanyProfile(record) : undefined
}

// GET /api/professionals/{slug}
function findProfessional(slug: string): ProfessionalProfile | undefined {
	const record = professionalRecords.find(item => item.slug === slug)
	return record ? toProfessionalProfile(record) : undefined
}

// --- Search stand-ins -----------------------------------------

function idFor(key: TaxonomyKey, slug: string | undefined): number | undefined {
	if (!slug) return undefined
	return taxonomies[key].find(item => item.slug === slug)?.id
}

// Geographic filters match the selected location and its descendants;
// country + location must agree (docs/API.md §3).
function geoIds(params: { location?: string, country?: string }): number[] | null {
	const country = params.country ? findCountryBySlug(params.country) : undefined
	const location = params.location ? findLocation(Number(params.location)) : undefined

	if (location) {
		if (country && countryOf(location).id !== country.id) return []
		return subtreeIds(location.id)
	}
	if (country) return subtreeIds(country.id)
	return null
}

function matchesTerm(values: (string | null)[], term: string): boolean {
	if (!term) return true
	return values.join(' ').toLowerCase().includes(term)
}

function paginate<T>(items: T[], page: number | undefined, perPage: number): Paginated<T> {
	const last_page = Math.max(1, Math.ceil(items.length / perPage))
	const current_page = Math.min(Math.max(1, page ?? 1), last_page)
	const start = (current_page - 1) * perPage

	return {
		data: items.slice(start, start + perPage),
		meta: { current_page, last_page, per_page: perPage, total: items.length },
	}
}

// GET /api/companies
function searchCompanies(params: CompanySearchParams = {}, perPage = 10): Paginated<CompanyCard> {
	const term = (params.q ?? '').trim().toLowerCase()
	const service = idFor('services', params.service)
	const industry = idFor('industries', params.industry)
	const capability = idFor('capabilities', params.capability)
	const language = idFor('languages', params.language)
	const technology = idFor('technologies', params.technology)
	const geo = geoIds(params)

	const matches = companyRecords.filter((record) => {
		if (params.service && !record.service_ids.includes(service ?? -1)) return false
		if (params.industry && !record.industry_ids.includes(industry ?? -1)) return false
		if (params.capability && !record.capability_ids.includes(capability ?? -1)) return false
		if (params.language && !record.language_ids.includes(language ?? -1)) return false
		if (params.technology && !record.technology_ids.includes(technology ?? -1)) return false
		if (params.size && record.company_size !== params.size) return false
		if (params.work_model && record.work_model !== params.work_model) return false
		if (geo && !record.location_ids.some(id => geo.includes(id))) return false

		return matchesTerm([
			record.name,
			record.tagline,
			...tags(record.service_ids, services).map(tag => tag.name),
			...tags(record.industry_ids, industries).map(tag => tag.name),
		], term)
	})

	const sorted = [...matches].sort((a, b) => {
		if (params.sort === 'name') return a.name.localeCompare(b.name)
		if (params.sort === 'newest') return b.published_at.localeCompare(a.published_at)
		// relevance stand-in: completeness, then verification, then id
		return b.completeness_score - a.completeness_score
			|| Number(b.verified) - Number(a.verified)
			|| a.id - b.id
	})

	return paginate(sorted.map(toCompanyCard), params.page, perPage)
}

// GET /api/professionals
function searchProfessionals(params: ProfessionalSearchParams = {}, perPage = 12): Paginated<ProfessionalCard> {
	const term = (params.q ?? '').trim().toLowerCase()
	const service = idFor('services', params.service)
	const industry = idFor('industries', params.industry)
	const language = idFor('languages', params.language)
	const geo = geoIds(params)

	const matches = professionalRecords.filter((record) => {
		if (params.service && !record.service_ids.includes(service ?? -1)) return false
		if (params.industry && !record.industry_ids.includes(industry ?? -1)) return false
		if (params.language && !record.language_ids.includes(language ?? -1)) return false
		// primary location only — served markets are not physical presence
		if (geo && (record.location_id === null || !geo.includes(record.location_id))) return false

		return matchesTerm([
			record.first_name,
			record.last_name,
			record.job_title,
			record.expertise,
			companyRef(record.company_id).name,
		], term)
	})

	const sorted = [...matches].sort((a, b) => {
		if (params.sort === 'name') return a.last_name.localeCompare(b.last_name)
		if (params.sort === 'newest') return b.published_at.localeCompare(a.published_at)
		return b.completeness_score - a.completeness_score
			|| Number(b.verified) - Number(a.verified)
			|| a.id - b.id
	})

	return paginate(sorted.map(toProfessionalCard), params.page, perPage)
}

// --- Counts for the browse indexes ----------------------------

function companyCountBy(key: 'services' | 'industries', id: number): number {
	const field = key === 'services' ? 'service_ids' : 'industry_ids'
	return companyRecords.filter(record => record[field].includes(id)).length
}

function professionalCountBy(key: 'services' | 'industries', id: number): number {
	const field = key === 'services' ? 'service_ids' : 'industry_ids'
	return professionalRecords.filter(record => record[field].includes(id)).length
}

// Companies operating anywhere inside a location's subtree.
function companyCountIn(locationId: number): number {
	const ids = subtreeIds(locationId)
	return companyRecords.filter(record => record.location_ids.some(id => ids.includes(id))).length
}

// Locations that actually have providers — the index never links to
// an empty place (docs/PLAN.md §7).
function locationsWithCompanies() {
	return locations.filter(location => companyCountIn(location.id) > 0)
}

// Companies still open to a claim request.
const unclaimedCompanies: CompanyCard[] = companyCards.filter(company => !company.claimed)

export {
	companyCards,
	professionalCards,
	unclaimedCompanies,
	findCompany,
	findProfessional,
	searchCompanies,
	searchProfessionals,
	companyCountBy,
	professionalCountBy,
	companyCountIn,
	locationsWithCompanies,
}
