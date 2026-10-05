// Public directory contracts. Each shape mirrors docs/API.md §2–3 so
// the static data in ~/data/features can be swapped for the typed API
// client without touching the components.

// --- Catalogs -------------------------------------------------

interface TaxonomyItem {
	id: number
	name: string
	slug: string
	description: string | null
}

// Profile arrays use {id, name, slug}; company cards use {name, slug}.
type TaxonomyRef = Pick<TaxonomyItem, 'id' | 'name' | 'slug'>
type TaxonomyTag = Pick<TaxonomyItem, 'name' | 'slug'>

// The five admin-editable taxonomies (work_model is a fixed enum).
type TaxonomyKey = 'services' | 'industries' | 'capabilities' | 'languages' | 'technologies'

type LocationType = 'country' | 'region' | 'city'

interface LocationItem {
	id: number
	parent_id: number | null
	type: LocationType
	name: string
	slug: string
	iso_code: string | null
}

// Card-level place reference, as in the API examples.
interface LocationRef {
	id: number
	name: string
	country: string
}

// --- Enums ----------------------------------------------------

type CompanySize = '1_10' | '11_50' | '51_200' | '201_500' | '501_1000' | '1000_plus' | 'unknown'
type WorkModel = 'onshore' | 'offshore' | 'nearshore' | 'hybrid' | 'unknown'
type InquiryAction = 'contact' | 'question' | 'quote'
type PublicationStatus = 'draft' | 'pending_review' | 'published' | 'suspended'
type AffiliationStatus = 'pending' | 'approved' | 'rejected'
type DirectorySort = 'relevance' | 'newest' | 'name'

// --- Companies ------------------------------------------------

interface CompanyCard {
	id: number
	slug: string
	name: string
	tagline: string | null
	hq: LocationRef | null
	services: TaxonomyTag[]
	industries: TaxonomyTag[]
	claimed: boolean
	verified: boolean
	featured: boolean
	completeness_score: number
	logo_url: string | null
	logo_alt_text: string | null
}

interface CompanyLocation {
	id: number
	type: LocationType
	name: string
	region: string | null
	country: string
	is_headquarters: boolean
}

interface Certification {
	id: number
	name: string
	issuer: string | null
	year: number | null
}

interface SocialLinks {
	facebook?: string
	instagram?: string
	x?: string
	youtube?: string
}

interface CompanyProfile extends CompanyCard {
	// Plain text; paragraphs split on blank lines. May carry attributed,
	// company-provided client proof (docs/PLAN.md §4.2).
	overview: string | null
	// One differentiator per line.
	why_choose_us: string | null
	founded_year: number | null
	company_size: CompanySize
	work_model: WorkModel
	locations: CompanyLocation[]
	capabilities: TaxonomyRef[]
	technologies: TaxonomyRef[]
	languages: TaxonomyRef[]
	certifications: Certification[]
	website_url: string | null
	linkedin_url: string | null
	other_social_json: SocialLinks | null
	phone: string | null
	cover_url: string | null
	cover_alt_text: string | null
	seo_title: string | null
	seo_description: string | null
	professionals: ProfessionalCard[]
	inquiry_actions: InquiryAction[]
}

// --- Professionals --------------------------------------------

interface CompanyRef {
	id: number
	name: string
	slug: string
}

interface ProfessionalCard {
	id: number
	slug: string
	first_name: string
	last_name: string
	job_title: string
	company: CompanyRef
	location: LocationRef | null
	expertise: string | null
	verified: boolean
	photo_url: string | null
	photo_alt_text: string | null
}

interface ProfessionalProfile extends Omit<ProfessionalCard, 'company'> {
	bio: string | null
	// One highlight per line.
	experience_summary: string | null
	services: TaxonomyRef[]
	industries: TaxonomyRef[]
	languages: TaxonomyRef[]
	// Locations served — distinct from the primary `location`.
	markets: TaxonomyRef[]
	// IANA zone, e.g. "Asia/Manila".
	timezone: string | null
	linkedin_url: string | null
	website_url: string | null
	public_email: string | null
	phone: string | null
	featured: boolean
	completeness_score: number
	seo_title: string | null
	seo_description: string | null
	company: CompanyCard
	inquiry_actions: InquiryAction[]
}

// --- Plans ----------------------------------------------------

type PlanSlug = string
type AnalyticsLevel = 'none' | 'basic' | 'advanced'

interface Plan {
	id: number
	slug: PlanSlug
	name: string
	audience: 'company'
	max_professional_seats: number | null
	max_images: number
	featured_eligible: boolean
	analytics_level: AnalyticsLevel
	sort_order: number
	is_active: boolean
}

// --- Search params (GET /api/companies, /api/professionals) ---

interface CompanySearchParams {
	q?: string
	service?: string
	industry?: string
	// location id, as a string from the query
	location?: string
	// country slug
	country?: string
	size?: CompanySize | ''
	capability?: string
	work_model?: WorkModel | ''
	language?: string
	technology?: string
	sort?: DirectorySort
	page?: number
}

interface ProfessionalSearchParams {
	q?: string
	service?: string
	industry?: string
	location?: string
	country?: string
	language?: string
	sort?: DirectorySort
	page?: number
}

export type {
	TaxonomyItem,
	TaxonomyRef,
	TaxonomyTag,
	TaxonomyKey,
	LocationType,
	LocationItem,
	LocationRef,
	CompanySize,
	WorkModel,
	InquiryAction,
	PublicationStatus,
	AffiliationStatus,
	DirectorySort,
	CompanyCard,
	CompanyLocation,
	Certification,
	SocialLinks,
	CompanyProfile,
	CompanyRef,
	ProfessionalCard,
	ProfessionalProfile,
	PlanSlug,
	AnalyticsLevel,
	Plan,
	CompanySearchParams,
	ProfessionalSearchParams,
}
