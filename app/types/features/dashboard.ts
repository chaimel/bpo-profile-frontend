// Signed-in dashboards (docs/API.md §1 /api/me, §5 company, §6 sales).
import type {
	AffiliationStatus,
	Certification,
	CompanyRef,
	CompanySize,
	PlanSlug,
	PublicationStatus,
	WorkModel,
} from '~/types/features/directory'
import type { Inquiry } from '~/types/features/inquiry'

type PlatformRole = 'user' | 'admin'
type CompanyRole = 'owner' | 'admin' | 'professional'

// --- GET /api/me ----------------------------------------------

interface MeCompany {
	id: number
	name: string
	slug: string
	role: CompanyRole
}

interface MeProfessional {
	id: number
	slug: string
	company_id: number
	affiliation_status: AffiliationStatus
}

interface Me {
	id: number
	first_name: string
	last_name: string
	email: string
	email_verified_at: string | null
	platform_role: PlatformRole
	// accepted memberships only
	companies: MeCompany[]
	// the user's own profile, including a pending or rejected affiliation
	professional: MeProfessional | null
}

// --- GET /api/dashboard/companies/{companyId} -----------------

interface EditableCompany {
	id: number
	slug: string
	name: string
	tagline: string | null
	overview: string | null
	why_choose_us: string | null
	website_url: string | null
	linkedin_url: string | null
	founded_year: number | null
	company_size: CompanySize
	work_model: WorkModel
	// private fallback inbox; required before publication, never shown publicly
	inquiry_email: string | null
	phone: string | null
	status: PublicationStatus
	claimed_at: string | null
	verified_at: string | null
	plan: {
		slug: PlanSlug
		name: string
		expires_at: string | null
	}
	completeness_score: number
	logo_url: string | null
	logo_alt_text: string | null
	cover_url: string | null
	cover_alt_text: string | null
	// PUT .../taxonomies
	service_ids: number[]
	industry_ids: number[]
	capability_ids: number[]
	language_ids: number[]
	technology_ids: number[]
	// PUT .../locations — HQ must be one of location_ids
	location_ids: number[]
	hq_location_id: number | null
	certifications: Certification[]
}

// --- GET /api/dashboard/professional | .../team/{professionalId}

interface EditableProfessional {
	id: number
	slug: string
	company: CompanyRef
	first_name: string
	last_name: string
	job_title: string
	bio: string | null
	expertise: string | null
	experience_summary: string | null
	timezone: string | null
	location_id: number | null
	linkedin_url: string | null
	website_url: string | null
	public_email: string | null
	phone: string | null
	status: PublicationStatus
	affiliation_status: AffiliationStatus
	verified_at: string | null
	photo_url: string | null
	photo_alt_text: string | null
	completeness_score: number
	service_ids: number[]
	industry_ids: number[]
	language_ids: number[]
	market_ids: number[]
	// a company-created roster profile has no login until an invitation is accepted
	has_account: boolean
}

// --- GET .../team ---------------------------------------------

interface TeamMember {
	id: number
	slug: string
	first_name: string
	last_name: string
	job_title: string
	photo_url: string | null
	status: PublicationStatus
	affiliation_status: AffiliationStatus
	verified: boolean
	has_account: boolean
	completeness_score: number
}

// A self-registered professional waiting for owner/admin review.
interface AffiliationRequest {
	professional_id: number
	first_name: string
	last_name: string
	job_title: string
	email: string
	// approval requires the applicant's verified email
	email_verified: boolean
	requested_at: string
}

interface TeamInvitation {
	id: number
	professional_id: number
	professional_name: string
	email: string
	invited_by: string
	created_at: string
	expires_at: string
}

interface TeamOverview {
	members: TeamMember[]
	requests: AffiliationRequest[]
	invitations: TeamInvitation[]
}

// --- GET .../stats (inclusive UTC dates, default last 30 days) --

interface DashboardStats {
	from: string
	to: string
	search_impressions: number
	profile_views: number
	// company scope only; their sum is profile_views
	company_profile_views: number | null
	sales_profile_views: number | null
	cta_clicks: number
	website_clicks: number
	inquiries: {
		contact: number
		question: number
		quote: number
	}
	// accepted inquiries / profile views; null when views are zero
	lead_conversion_rate: number | null
}

// --- Overview and completeness --------------------------------

// Everything the overview shows for one managed company.
interface CompanyDashboard {
	membership: MeCompany
	company: EditableCompany
	team: TeamOverview
	inquiries: Inquiry[]
	stats: DashboardStats
}

// One line of a completeness checklist (docs/DATABASE.md §6).
interface ChecklistItem<K extends string = string> {
	key: K
	label: string
	done: boolean
	// share of the 0–100 score
	weight: number
}

type CompanyChecklistKey = 'name' | 'logo' | 'overview' | 'website' | 'hq' | 'service' | 'industry' | 'location' | 'professional' | 'why_choose_us'

type ProfessionalChecklistKey = 'photo' | 'name' | 'title' | 'company' | 'bio' | 'service' | 'location' | 'contact'

export type {
	PlatformRole,
	CompanyRole,
	MeCompany,
	MeProfessional,
	Me,
	EditableCompany,
	EditableProfessional,
	TeamMember,
	AffiliationRequest,
	TeamInvitation,
	TeamOverview,
	DashboardStats,
	CompanyDashboard,
	ChecklistItem,
	CompanyChecklistKey,
	ProfessionalChecklistKey,
}
