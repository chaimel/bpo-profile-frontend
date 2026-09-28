// Platform administration (docs/API.md §8).
import type { CompanyRole, PlatformRole } from '~/types/features/dashboard'
import type {
	AffiliationStatus,
	CompanyRef,
	CompanySize,
	LocationItem,
	LocationType,
	PlanSlug,
	PublicationStatus,
	TaxonomyItem,
	TaxonomyTag,
	WorkModel,
} from '~/types/features/directory'
import type { ClaimStatus } from '~/types/features/onboarding'

interface AdminCompanyRow {
	id: number
	slug: string
	name: string
	logo_url: string | null
	// "Manila, Philippines"
	hq: string | null
	status: PublicationStatus
	claimed_at: string | null
	verified_at: string | null
	plan: PlanSlug
	plan_expires_at: string | null
	completeness_score: number
	team_count: number
	owners: string[]
	created_at: string
	updated_at: string
	deleted_at: string | null
}

interface AdminProfessionalRow {
	id: number
	slug: string
	first_name: string
	last_name: string
	job_title: string
	photo_url: string | null
	company: CompanyRef
	status: PublicationStatus
	affiliation_status: AffiliationStatus
	verified_at: string | null
	has_account: boolean
	completeness_score: number
	updated_at: string
	deleted_at: string | null
}

interface AdminClaim {
	id: number
	company: CompanyRef & {
		hq: string | null
		website_url: string | null
	}
	claimant: {
		id: number
		name: string
		email: string
		email_verified_at: string | null
	}
	status: ClaimStatus
	reviewed_by: string | null
	reviewed_at: string | null
	// internal only — never shown to the claimant
	review_note: string | null
	token_sent_at: string | null
	token_expires_at: string | null
	created_at: string
}

interface AdminUser {
	id: number
	first_name: string
	last_name: string
	email: string
	platform_role: PlatformRole
	email_verified_at: string | null
	companies: {
		name: string
		slug: string
		role: CompanyRole
	}[]
	professional: {
		slug: string
		affiliation_status: AffiliationStatus
	} | null
	last_login_at: string | null
	created_at: string
	deleted_at: string | null
}

interface AdminTaxonomyTerm extends TaxonomyItem {
	sort_order: number
	is_active: boolean
	// companies + professionals using the term
	usage_count: number
	deleted_at: string | null
}

interface AdminLocation extends LocationItem {
	sort_order: number
	is_active: boolean
	deleted_at: string | null
}

// --- Details and payloads ----------------------------------------

// GET /api/admin/companies/{id}
interface AdminCompanyDetail extends AdminCompanyRow {
	tagline: string | null
	website_url: string | null
	// private fallback inbox; publication requires it (docs/DATABASE.md §4.3)
	inquiry_email: string | null
	founded_year: number | null
	company_size: CompanySize
	work_model: WorkModel
	services: TaxonomyTag[]
	industries: TaxonomyTag[]
	// latest internal moderation note; never shown to the company
	moderation_note: string | null
	published_at: string | null
}

// The login linked to a professional profile.
interface AdminLinkedAccount {
	id: number
	name: string
	email: string
	email_verified_at: string | null
	last_login_at: string | null
}

// GET /api/admin/professionals/{id}
interface AdminProfessionalDetail extends AdminProfessionalRow {
	expertise: string | null
	// primary location, "Manila, Philippines"
	location: string | null
	// a self-registered applicant, or a roster row the company created
	source: 'registration' | 'roster'
	affiliation_reviewed_by: string | null
	affiliation_reviewed_at: string | null
	// the accepted membership at this company, if any
	membership_role: CompanyRole | null
	account: AdminLinkedAccount | null
	moderation_note: string | null
	published_at: string | null
	created_at: string
}

// One condition the API checks before it accepts status = published.
interface PublicationCheck {
	key: string
	label: string
	met: boolean
	// empty when there is nothing to add
	detail: string
}

// POST /api/admin/companies — always a draft, unclaimed listing
interface AdminCompanyPayload {
	name: string
	website_url: string | null
	hq_location_id: number | null
}

// POST /api/admin/professionals — a draft roster profile with no login
interface AdminProfessionalPayload {
	company_id: number
	first_name: string
	last_name: string
	job_title: string
}

// POST /api/admin/users — no ownership shortcut
interface AdminUserPayload {
	first_name: string
	last_name: string
	email: string
	platform_role: PlatformRole
}

// POST / PATCH /api/admin/{taxonomy}
interface AdminTermPayload {
	name: string
	slug: string
	description: string | null
	is_active: boolean
}

// POST / PATCH /api/admin/locations
interface AdminLocationPayload {
	type: LocationType
	parent_id: number | null
	name: string
	slug: string
	iso_code: string | null
	is_active: boolean
}

export type {
	AdminCompanyRow,
	AdminProfessionalRow,
	AdminClaim,
	AdminUser,
	AdminTaxonomyTerm,
	AdminLocation,
	AdminCompanyDetail,
	AdminLinkedAccount,
	AdminProfessionalDetail,
	PublicationCheck,
	AdminCompanyPayload,
	AdminProfessionalPayload,
	AdminUserPayload,
	AdminTermPayload,
	AdminLocationPayload,
}
