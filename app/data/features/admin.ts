// Platform admin stand-ins (docs/API.md §8). Each export is shaped like
// its /api/admin/* response and is derived from the directory's sample
// records wherever it can be, so a listing's plan, team and claims tell
// one story across the public site, the dashboards and the admin.
// Timestamps are UTC; every email uses the reserved .example domain.
import type {
	AdminClaim,
	AdminCompanyDetail,
	AdminCompanyRow,
	AdminLocation,
	AdminProfessionalDetail,
	AdminProfessionalRow,
	AdminTaxonomyTerm,
	AdminUser,
	PublicationCheck,
} from '~/types/features/admin'
import type {
	CompanyRef,
	PlanSlug,
	TaxonomyItem,
	TaxonomyKey,
	TaxonomyTag,
} from '~/types/features/directory'
import type { Inquiry, InquiryPerson } from '~/types/features/inquiry'
import { hostname } from '~/utils/format'
import { type CompanyRecord, companyRecords } from './companies'
import { countryOf, findLocation, locations } from './locations'
import { type ProfessionalRecord, professionalRecords } from './professionals'
import { industries, services, taxonomies } from './taxonomies'

// --- Helpers --------------------------------------------------

const day = 24 * 60 * 60 * 1000

// The samples run up to this moment; generated dates never pass it.
const latest_sample = Date.parse('2026-09-24T12:00:00Z')

function shiftDays(iso: string, days: number): string {
	return new Date(Date.parse(iso) + days * day).toISOString()
}

// A stable "last edited" date some weeks after publication.
function editedAfter(iso: string, seed: number): string {
	const edited = Date.parse(iso) + (((seed * 37) % 90) + 4) * day
	return new Date(Math.min(edited, latest_sample)).toISOString()
}

// "Manila, Philippines"; a country on its own for country-level places.
function placeLabel(id: number | null): string | null {
	const location = findLocation(id)
	if (!location) return null
	const country = countryOf(location)
	return location.id === country.id ? location.name : `${location.name}, ${country.name}`
}

// ASCII mailbox names for the samples: "Andrés" -> "andres".
function mailbox(name: string): string {
	return name
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '.')
}

function tagsFor(ids: number[], list: TaxonomyItem[]): TaxonomyTag[] {
	return ids.flatMap((id) => {
		const item = list.find(entry => entry.id === id)
		return item ? [{ name: item.name, slug: item.slug }] : []
	})
}

// --- Company facts --------------------------------------------

interface CompanyFacts {
	plan: PlanSlug
	plan_expires_at: string | null
	owners: string[]
	inquiry_email: string | null
	created_at: string
	claimed_at: string | null
	verified_at: string | null
	updated_at: string
}

// Admin-side facts for the directory's sample companies. Company
// registration claims a listing when it is created. Kingston Voice
// Partners and Summit Trust & Safety were seeded by the platform;
// Summit was claimed later through the claim workflow.
const companyFacts: Record<number, CompanyFacts> = {
	10: {
		plan: 'professional',
		plan_expires_at: '2027-03-01T00:00:00Z',
		owners: ['Ana Reyes'],
		inquiry_email: 'sales@northshore-cx.example',
		created_at: '2026-02-18T08:10:00Z',
		claimed_at: '2026-02-18T08:10:00Z',
		verified_at: '2026-02-27T14:30:00Z',
		updated_at: '2026-09-19T10:04:00Z',
	},
	11: {
		plan: 'premium',
		plan_expires_at: '2027-02-10T00:00:00Z',
		owners: ['Ramon Aquino'],
		inquiry_email: 'partnerships@meridian-contact.example',
		created_at: '2026-01-28T02:45:00Z',
		claimed_at: '2026-01-28T02:45:00Z',
		verified_at: '2026-02-09T11:20:00Z',
		updated_at: '2026-09-12T06:31:00Z',
	},
	12: {
		plan: 'professional',
		plan_expires_at: null,
		owners: ['Carlos Mejía'],
		inquiry_email: 'sales@andes-nearshore.example',
		created_at: '2026-04-02T15:05:00Z',
		claimed_at: '2026-04-02T15:05:00Z',
		verified_at: '2026-04-15T16:40:00Z',
		updated_at: '2026-08-28T19:12:00Z',
	},
	13: {
		plan: 'basic',
		plan_expires_at: null,
		owners: ['Sofía Ruiz'],
		inquiry_email: 'sales@bajalink.example',
		created_at: '2026-05-21T17:30:00Z',
		claimed_at: '2026-05-21T17:30:00Z',
		verified_at: null,
		updated_at: '2026-09-03T21:02:00Z',
	},
	14: {
		plan: 'basic',
		plan_expires_at: null,
		owners: ['Johan van Wyk'],
		inquiry_email: 'hello@capecoast-contact.example',
		created_at: '2026-01-08T09:15:00Z',
		claimed_at: '2026-01-08T09:15:00Z',
		verified_at: '2026-01-16T12:00:00Z',
		updated_at: '2026-08-19T08:47:00Z',
	},
	15: {
		plan: 'basic',
		plan_expires_at: null,
		owners: ['Tomasz Wiśniewski'],
		inquiry_email: 'sales@vistula-backoffice.example',
		created_at: '2025-10-30T10:00:00Z',
		claimed_at: '2025-10-30T10:00:00Z',
		verified_at: '2025-11-10T13:25:00Z',
		updated_at: '2026-07-30T14:05:00Z',
	},
	16: {
		plan: 'basic',
		plan_expires_at: null,
		owners: [],
		// the public contact address from their website, set when seeded
		inquiry_email: 'info@kingston-voice.example',
		created_at: '2026-06-24T16:00:00Z',
		claimed_at: null,
		verified_at: null,
		updated_at: '2026-07-01T09:00:00Z',
	},
	17: {
		plan: 'basic',
		plan_expires_at: null,
		owners: ['Ravi Shankar'],
		inquiry_email: 'sales@deccan-data.example',
		created_at: '2026-04-22T05:50:00Z',
		claimed_at: '2026-04-22T05:50:00Z',
		verified_at: '2026-05-06T10:10:00Z',
		updated_at: '2026-09-10T04:22:00Z',
	},
	18: {
		plan: 'basic',
		plan_expires_at: null,
		owners: ['Joy Bautista'],
		inquiry_email: 'rcm@pulsehealth-bpo.example',
		created_at: '2026-07-29T01:30:00Z',
		claimed_at: '2026-07-29T01:30:00Z',
		verified_at: null,
		updated_at: '2026-09-16T03:18:00Z',
	},
	19: {
		plan: 'basic',
		plan_expires_at: null,
		owners: ['Karim Mansour'],
		inquiry_email: 'sales@nile-techsupport.example',
		created_at: '2025-11-18T08:00:00Z',
		claimed_at: '2025-11-18T08:00:00Z',
		verified_at: '2025-12-01T09:45:00Z',
		updated_at: '2026-08-07T11:36:00Z',
	},
	20: {
		plan: 'basic',
		plan_expires_at: null,
		owners: ['Mike Donnelly'],
		inquiry_email: 'growth@lakeside-revenue.example',
		created_at: '2026-07-10T14:20:00Z',
		claimed_at: '2026-07-10T14:20:00Z',
		verified_at: null,
		updated_at: '2026-09-08T18:55:00Z',
	},
	21: {
		plan: 'basic',
		plan_expires_at: null,
		owners: ['Anil Deshpande'],
		inquiry_email: 'finance@atlas-ledger.example',
		created_at: '2025-10-14T06:40:00Z',
		claimed_at: '2025-10-14T06:40:00Z',
		verified_at: '2025-10-24T10:30:00Z',
		updated_at: '2026-06-30T07:14:00Z',
	},
	22: {
		plan: 'basic',
		plan_expires_at: null,
		owners: ['Wanjiru Kamau'],
		inquiry_email: 'partnerships@summit-tns.example',
		created_at: '2026-08-10T12:00:00Z',
		// the fulfilled claim below
		claimed_at: '2026-08-22T07:41:00Z',
		verified_at: null,
		updated_at: '2026-09-15T13:09:00Z',
	},
}

// Listings that exist only in the admin: an admin-created draft, one
// waiting for review, a suspended listing and a soft-deleted one.
const extraCompanyRefs: CompanyRef[] = [
	{ id: 30, name: 'Harborview Support Co.', slug: 'harborview-support-co' },
	{ id: 31, name: 'Pacific Rim Support', slug: 'pacific-rim-support' },
	{ id: 32, name: 'BrightPath BPO', slug: 'brightpath-bpo' },
	{ id: 33, name: 'Old Town Outsourcing', slug: 'old-town-outsourcing' },
]

function companyRef(id: number): CompanyRef {
	const record = companyRecords.find(item => item.id === id)
	if (record) return { id: record.id, name: record.name, slug: record.slug }

	const extra = extraCompanyRefs.find(item => item.id === id)
	if (!extra) throw new Error(`Unknown company ${id}`)
	return extra
}

// --- Professionals --------------------------------------------

// Records with no login are roster profiles their company manages; the
// company can invite the person to claim one later.
const rosterIds = [49, 55]

// Owners who also keep their own sales profile (docs/DATABASE.md §3).
const ownerProfileIds = [45, 61]

// Accounts that appear elsewhere in the samples keep their ids.
const knownAccountIds: Record<number, number> = { 45: 1, 44: 4, 46: 5, 61: 6 }

const recordProfessionals = professionalRecords.map((record): AdminProfessionalDetail => {
	const company = companyRecords.find(item => item.id === record.company_id)
	const is_roster = rosterIds.includes(record.id)
	const is_owner = ownerProfileIds.includes(record.id)
	const created_at = shiftDays(record.published_at, -3)
	const updated_at = editedAfter(record.published_at, record.id)

	return {
		id: record.id,
		slug: record.slug,
		first_name: record.first_name,
		last_name: record.last_name,
		job_title: record.job_title,
		photo_url: null,
		company: companyRef(record.company_id),
		status: 'published',
		affiliation_status: 'approved',
		verified_at: record.verified ? shiftDays(record.published_at, 2) : null,
		has_account: !is_roster,
		completeness_score: record.completeness_score,
		updated_at,
		deleted_at: null,
		expertise: record.expertise,
		location: placeLabel(record.location_id),
		source: is_roster ? 'roster' : 'registration',
		affiliation_reviewed_by: is_owner
			? 'Sam Rivera'
			: (companyFacts[record.company_id]?.owners[0] ?? 'Sam Rivera'),
		affiliation_reviewed_at: shiftDays(created_at, 1),
		membership_role: is_roster ? null : (is_owner ? 'owner' : 'professional'),
		account: is_roster
			? null
			: {
					id: knownAccountIds[record.id] ?? 100 + record.id,
					name: `${record.first_name} ${record.last_name}`,
					email: `${mailbox(record.first_name)}@${hostname(company?.website_url)}`,
					email_verified_at: created_at,
					last_login_at: updated_at,
				},
		moderation_note: null,
		published_at: record.published_at,
		created_at,
	}
})

// People the public API never returns: roster rows, applicants waiting
// on their company, a rejected applicant, a profile in review and a
// deleted one (docs/SETUP.md §6).
const extraProfessionals: AdminProfessionalDetail[] = [
	{
		id: 90,
		slug: 'miguel-ramos',
		first_name: 'Miguel',
		last_name: 'Ramos',
		job_title: 'Account Manager',
		photo_url: null,
		company: companyRef(10),
		status: 'draft',
		affiliation_status: 'approved',
		verified_at: null,
		has_account: false,
		completeness_score: 38,
		updated_at: '2026-09-12T07:20:00Z',
		deleted_at: null,
		expertise: null,
		location: 'Manila, Philippines',
		source: 'roster',
		affiliation_reviewed_by: 'Ana Reyes',
		affiliation_reviewed_at: '2026-09-12T07:20:00Z',
		membership_role: null,
		account: null,
		moderation_note: null,
		published_at: null,
		created_at: '2026-09-12T07:20:00Z',
	},
	{
		id: 91,
		slug: 'bea-lim',
		first_name: 'Bea',
		last_name: 'Lim',
		job_title: 'Business Development Associate',
		photo_url: null,
		company: companyRef(10),
		status: 'draft',
		affiliation_status: 'pending',
		verified_at: null,
		has_account: true,
		completeness_score: 52,
		updated_at: '2026-09-23T05:48:00Z',
		deleted_at: null,
		expertise: 'Healthcare scheduling programs',
		location: 'Taguig, Philippines',
		source: 'registration',
		affiliation_reviewed_by: null,
		affiliation_reviewed_at: null,
		membership_role: null,
		account: {
			id: 7,
			name: 'Bea Lim',
			email: 'bea.lim@northshore-cx.example',
			email_verified_at: '2026-09-22T11:05:00Z',
			last_login_at: '2026-09-23T05:40:00Z',
		},
		moderation_note: null,
		published_at: null,
		created_at: '2026-09-22T11:02:00Z',
	},
	{
		// registered, but has never completed the emailed code
		id: 92,
		slug: 'kevin-ortiz',
		first_name: 'Kevin',
		last_name: 'Ortiz',
		job_title: 'Sales Executive',
		photo_url: null,
		company: companyRef(10),
		status: 'draft',
		affiliation_status: 'pending',
		verified_at: null,
		has_account: true,
		completeness_score: 18,
		updated_at: '2026-09-24T08:10:00Z',
		deleted_at: null,
		expertise: null,
		location: null,
		source: 'registration',
		affiliation_reviewed_by: null,
		affiliation_reviewed_at: null,
		membership_role: null,
		account: {
			id: 8,
			name: 'Kevin Ortiz',
			email: 'kevin.ortiz@mail.example',
			email_verified_at: null,
			last_login_at: null,
		},
		moderation_note: null,
		published_at: null,
		created_at: '2026-09-24T08:10:00Z',
	},
	{
		id: 93,
		slug: 'tom-baxter',
		first_name: 'Tom',
		last_name: 'Baxter',
		job_title: 'Partnerships Lead',
		photo_url: null,
		company: companyRef(11),
		status: 'draft',
		affiliation_status: 'rejected',
		verified_at: null,
		has_account: true,
		completeness_score: 41,
		updated_at: '2026-09-06T10:15:00Z',
		deleted_at: null,
		expertise: 'Retail partnerships',
		location: 'Cebu City, Philippines',
		source: 'registration',
		affiliation_reviewed_by: 'Ramon Aquino',
		affiliation_reviewed_at: '2026-09-06T10:15:00Z',
		membership_role: null,
		account: {
			id: 9,
			name: 'Tom Baxter',
			email: 'tom.baxter@mail.example',
			email_verified_at: '2026-09-01T09:30:00Z',
			last_login_at: '2026-09-07T12:00:00Z',
		},
		moderation_note: null,
		published_at: null,
		created_at: '2026-09-01T09:25:00Z',
	},
	{
		id: 94,
		slug: 'sipho-dlamini',
		first_name: 'Sipho',
		last_name: 'Dlamini',
		job_title: 'Business Development Manager',
		photo_url: null,
		company: companyRef(14),
		status: 'pending_review',
		affiliation_status: 'approved',
		verified_at: null,
		has_account: true,
		completeness_score: 84,
		updated_at: '2026-09-23T13:30:00Z',
		deleted_at: null,
		expertise: 'Retail and travel support programs',
		location: 'Johannesburg, South Africa',
		source: 'registration',
		affiliation_reviewed_by: 'Johan van Wyk',
		affiliation_reviewed_at: '2026-09-15T08:00:00Z',
		membership_role: 'professional',
		account: {
			id: 194,
			name: 'Sipho Dlamini',
			email: 'sipho@capecoast-contact.example',
			email_verified_at: '2026-09-14T15:20:00Z',
			last_login_at: '2026-09-23T13:25:00Z',
		},
		moderation_note: null,
		published_at: null,
		created_at: '2026-09-14T15:12:00Z',
	},
	{
		id: 95,
		slug: 'hannah-fischer',
		first_name: 'Hannah',
		last_name: 'Fischer',
		job_title: 'Client Partner, DACH',
		photo_url: null,
		company: companyRef(15),
		status: 'published',
		affiliation_status: 'approved',
		verified_at: '2026-03-12T10:00:00Z',
		has_account: true,
		completeness_score: 79,
		updated_at: '2026-07-30T14:05:00Z',
		deleted_at: '2026-07-30T14:05:00Z',
		expertise: 'German-language finance operations',
		location: 'Warsaw, Poland',
		source: 'registration',
		affiliation_reviewed_by: 'Tomasz Wiśniewski',
		affiliation_reviewed_at: '2026-03-05T09:00:00Z',
		// the professional membership was removed with the profile
		membership_role: null,
		account: {
			id: 195,
			name: 'Hannah Fischer',
			email: 'hannah@vistula-backoffice.example',
			email_verified_at: '2026-03-04T08:00:00Z',
			last_login_at: '2026-07-21T07:45:00Z',
		},
		moderation_note: 'Deleted at the company’s request: Hannah left Vistula in July.',
		published_at: '2026-03-10T09:00:00Z',
		created_at: '2026-03-04T08:00:00Z',
	},
]

const adminProfessionalDetails: AdminProfessionalDetail[] = [...recordProfessionals, ...extraProfessionals]

function toProfessionalRow(detail: AdminProfessionalDetail): AdminProfessionalRow {
	return {
		id: detail.id,
		slug: detail.slug,
		first_name: detail.first_name,
		last_name: detail.last_name,
		job_title: detail.job_title,
		photo_url: detail.photo_url,
		company: detail.company,
		status: detail.status,
		affiliation_status: detail.affiliation_status,
		verified_at: detail.verified_at,
		has_account: detail.has_account,
		completeness_score: detail.completeness_score,
		updated_at: detail.updated_at,
		deleted_at: detail.deleted_at,
	}
}

// GET /api/admin/professionals
const adminProfessionals: AdminProfessionalRow[] = adminProfessionalDetails.map(toProfessionalRow)

// --- Companies ------------------------------------------------

// Every non-deleted professional attached to the company, in any status.
function teamCount(companyId: number): number {
	return adminProfessionalDetails.filter(item => item.company.id === companyId && !item.deleted_at).length
}

const recordCompanies = companyRecords.map((record): AdminCompanyDetail => {
	const facts = companyFacts[record.id]
	if (!facts) throw new Error(`Missing admin facts for company ${record.id}`)

	return {
		id: record.id,
		slug: record.slug,
		name: record.name,
		logo_url: null,
		hq: placeLabel(record.hq_location_id),
		status: 'published',
		claimed_at: record.claimed ? facts.claimed_at : null,
		verified_at: record.verified ? facts.verified_at : null,
		plan: facts.plan,
		plan_expires_at: facts.plan_expires_at,
		completeness_score: record.completeness_score,
		team_count: teamCount(record.id),
		owners: facts.owners,
		created_at: facts.created_at,
		updated_at: facts.updated_at,
		deleted_at: null,
		tagline: record.tagline,
		website_url: record.website_url,
		inquiry_email: facts.inquiry_email,
		founded_year: record.founded_year,
		company_size: record.company_size,
		work_model: record.work_model,
		services: tagsFor(record.service_ids, services),
		industries: tagsFor(record.industry_ids, industries),
		moderation_note: null,
		published_at: record.published_at,
	}
})

const extraCompanies: AdminCompanyDetail[] = [
	{
		// created by a platform admin; a claim for it is approved and
		// waiting for the claimant to accept the emailed link
		...companyRef(30),
		logo_url: null,
		hq: 'Durban, South Africa',
		status: 'draft',
		claimed_at: null,
		verified_at: null,
		plan: 'basic',
		plan_expires_at: null,
		completeness_score: 34,
		team_count: teamCount(30),
		owners: [],
		created_at: '2026-09-10T13:25:00Z',
		updated_at: '2026-09-22T10:12:00Z',
		deleted_at: null,
		tagline: 'Customer support and back-office teams from Durban.',
		website_url: 'https://harborview-support.example',
		inquiry_email: null,
		founded_year: null,
		company_size: 'unknown',
		work_model: 'offshore',
		services: tagsFor([1, 3], services),
		industries: [],
		moderation_note: null,
		published_at: null,
	},
	{
		...companyRef(31),
		logo_url: null,
		hq: 'Cebu City, Philippines',
		status: 'pending_review',
		claimed_at: '2026-08-30T03:12:00Z',
		verified_at: null,
		plan: 'basic',
		plan_expires_at: null,
		completeness_score: 81,
		team_count: teamCount(31),
		owners: ['Jasmine Lopez'],
		created_at: '2026-08-30T03:12:00Z',
		updated_at: '2026-09-23T02:40:00Z',
		deleted_at: null,
		tagline: 'Customer support and e-commerce operations for Australian and US brands.',
		website_url: 'https://pacificrim-support.example',
		inquiry_email: 'hello@pacificrim-support.example',
		founded_year: 2019,
		company_size: '51_200',
		work_model: 'offshore',
		services: tagsFor([1, 3], services),
		industries: tagsFor([2, 8], industries),
		moderation_note: null,
		published_at: null,
	},
	{
		...companyRef(32),
		logo_url: null,
		hq: 'Mumbai, India',
		status: 'suspended',
		claimed_at: '2025-12-01T07:00:00Z',
		verified_at: null,
		plan: 'basic',
		plan_expires_at: null,
		completeness_score: 68,
		team_count: teamCount(32),
		owners: ['Neil Fernandes'],
		created_at: '2025-12-01T07:00:00Z',
		updated_at: '2026-09-05T15:20:00Z',
		deleted_at: null,
		tagline: 'Back-office and data services at scale.',
		website_url: 'https://brightpath-bpo.example',
		inquiry_email: 'sales@brightpath-bpo.example',
		founded_year: 2015,
		company_size: '201_500',
		work_model: 'offshore',
		services: tagsFor([3, 9], services),
		industries: tagsFor([3, 4], industries),
		moderation_note: 'Suspended Sep 5: the overview repeated client testimonials copied from another company’s website. The owner has been asked to remove them before we review the listing again.',
		published_at: '2025-12-15T09:00:00Z',
	},
	{
		// deleted: memberships were removed, so it is no longer claimed
		...companyRef(33),
		logo_url: null,
		hq: 'Kraków, Poland',
		status: 'published',
		claimed_at: null,
		verified_at: null,
		plan: 'basic',
		plan_expires_at: null,
		completeness_score: 58,
		team_count: teamCount(33),
		owners: [],
		created_at: '2025-09-18T10:00:00Z',
		updated_at: '2026-08-14T09:30:00Z',
		deleted_at: '2026-08-14T09:30:00Z',
		tagline: 'Multilingual customer care from Kraków.',
		website_url: 'https://oldtown-outsourcing.example',
		inquiry_email: 'office@oldtown-outsourcing.example',
		founded_year: 2012,
		company_size: '51_200',
		work_model: 'nearshore',
		services: tagsFor([1], services),
		industries: tagsFor([8, 6], industries),
		moderation_note: 'Deleted after the company confirmed it stopped trading in August.',
		published_at: '2025-10-01T09:00:00Z',
	},
]

const adminCompanyDetails: AdminCompanyDetail[] = [...recordCompanies, ...extraCompanies]

function toCompanyRow(detail: AdminCompanyDetail): AdminCompanyRow {
	return {
		id: detail.id,
		slug: detail.slug,
		name: detail.name,
		logo_url: detail.logo_url,
		hq: detail.hq,
		status: detail.status,
		claimed_at: detail.claimed_at,
		verified_at: detail.verified_at,
		plan: detail.plan,
		plan_expires_at: detail.plan_expires_at,
		completeness_score: detail.completeness_score,
		team_count: detail.team_count,
		owners: detail.owners,
		created_at: detail.created_at,
		updated_at: detail.updated_at,
		deleted_at: detail.deleted_at,
	}
}

// GET /api/admin/companies
const adminCompanies: AdminCompanyRow[] = adminCompanyDetails.map(toCompanyRow)

// --- Publication checks ---------------------------------------
// What the API verifies before it accepts status = published
// (docs/DATABASE.md §4.3, §4.5). The admin screens show the same list.

function companyPublicationChecks(company: AdminCompanyDetail): PublicationCheck[] {
	return [
		{
			key: 'inquiry_email',
			label: 'Fallback inquiry email is set',
			met: Boolean(company.inquiry_email),
			detail: company.inquiry_email
				? `${company.inquiry_email}. Private: it receives inquiries when no one else can.`
				: 'Missing. The company adds it in its dashboard; it’s never shown publicly.',
		},
		{
			key: 'not_deleted',
			label: 'Listing isn’t deleted',
			met: !company.deleted_at,
			detail: company.deleted_at ? 'Restore the company before publishing it.' : '',
		},
	]
}

function professionalPublicationChecks(
	professional: AdminProfessionalDetail,
	company: AdminCompanyDetail | undefined,
): PublicationCheck[] {
	const affiliation_detail: Record<AdminProfessionalDetail['affiliation_status'], string> = {
		approved: '',
		pending: 'Still pending. Review it in the affiliation section.',
		rejected: 'The affiliation was rejected, so the profile stays private.',
	}
	const company_live = Boolean(company && company.status === 'published' && !company.deleted_at)

	return [
		{
			key: 'affiliation',
			label: 'Affiliation is approved',
			met: professional.affiliation_status === 'approved',
			detail: affiliation_detail[professional.affiliation_status],
		},
		{
			key: 'company',
			label: 'Company is published',
			met: company_live,
			detail: company_live ? '' : `${professional.company.name} isn’t public, so its team can’t be either.`,
		},
		{
			key: 'fallback',
			label: 'Company fallback inbox is set',
			met: Boolean(company?.inquiry_email),
			detail: company?.inquiry_email
				? ''
				: `${professional.company.name} has no fallback inquiry email for this profile’s contact form.`,
		},
		{
			key: 'not_deleted',
			label: 'Profile isn’t deleted',
			met: !professional.deleted_at,
			detail: professional.deleted_at ? 'Restore the profile before publishing it.' : '',
		},
	]
}

// --- Users ----------------------------------------------------

// Every live professional with a login has an account.
const professionalUsers = adminProfessionalDetails.flatMap((professional): AdminUser[] => {
	const account = professional.account
	if (!account || professional.deleted_at) return []

	return [{
		id: account.id,
		first_name: professional.first_name,
		last_name: professional.last_name,
		email: account.email,
		platform_role: 'user',
		email_verified_at: account.email_verified_at,
		companies: professional.membership_role
			? [{ name: professional.company.name, slug: professional.company.slug, role: professional.membership_role }]
			: [],
		professional: { slug: professional.slug, affiliation_status: professional.affiliation_status },
		last_login_at: account.last_login_at,
		created_at: professional.created_at,
		deleted_at: null,
	}]
})

// Owners who don't keep a sales profile of their own.
const ownerUsers = adminCompanyDetails.flatMap(company => company.owners
	.filter(owner => !professionalUsers.some(user => `${user.first_name} ${user.last_name}` === owner))
	.map((owner, index): AdminUser => {
		const space = owner.indexOf(' ')
		const first_name = owner.slice(0, space)
		const last_name = owner.slice(space + 1)

		return {
			id: 2000 + company.id * 10 + index,
			first_name,
			last_name,
			email: `${mailbox(first_name)}@${hostname(company.website_url)}`,
			platform_role: 'user',
			email_verified_at: company.created_at,
			companies: [{ name: company.name, slug: company.slug, role: 'owner' }],
			professional: null,
			last_login_at: company.updated_at,
			created_at: company.created_at,
			deleted_at: null,
		}
	}))

// Platform admins, account-only claimants and a deleted account.
const accountUsers: AdminUser[] = [
	{
		id: 2,
		first_name: 'Sam',
		last_name: 'Rivera',
		email: 'sam.rivera@bpoprofile.example',
		platform_role: 'admin',
		email_verified_at: '2025-09-01T08:00:00Z',
		companies: [],
		professional: null,
		last_login_at: '2026-09-25T07:58:00Z',
		created_at: '2025-09-01T08:00:00Z',
		deleted_at: null,
	},
	{
		id: 3,
		first_name: 'Nora',
		last_name: 'Castillo',
		email: 'nora.castillo@bpoprofile.example',
		platform_role: 'admin',
		email_verified_at: '2025-09-15T09:00:00Z',
		companies: [],
		professional: null,
		last_login_at: '2026-09-24T16:20:00Z',
		created_at: '2025-09-15T09:00:00Z',
		deleted_at: null,
	},
	{
		id: 20,
		first_name: 'Devon',
		last_name: 'Campbell',
		email: 'devon@kingston-voice.example',
		platform_role: 'user',
		email_verified_at: '2026-09-17T12:40:00Z',
		companies: [],
		professional: null,
		last_login_at: '2026-09-18T14:02:00Z',
		created_at: '2026-09-17T12:31:00Z',
		deleted_at: null,
	},
	{
		id: 21,
		first_name: 'Andre',
		last_name: 'Williams',
		email: 'andre.williams@mail.example',
		platform_role: 'user',
		email_verified_at: '2026-09-20T17:02:00Z',
		companies: [],
		professional: null,
		last_login_at: '2026-09-21T09:30:00Z',
		created_at: '2026-09-20T16:55:00Z',
		deleted_at: null,
	},
	{
		id: 22,
		first_name: 'Grace',
		last_name: 'Mendoza',
		email: 'grace@harborview-support.example',
		platform_role: 'user',
		email_verified_at: '2026-09-15T08:20:00Z',
		companies: [],
		professional: null,
		last_login_at: '2026-09-16T11:40:00Z',
		created_at: '2026-09-15T08:12:00Z',
		deleted_at: null,
	},
	{
		id: 23,
		first_name: 'Ryan',
		last_name: 'Thompson',
		email: 'ryan.t@mail.example',
		platform_role: 'user',
		email_verified_at: '2026-07-30T19:05:00Z',
		companies: [],
		professional: null,
		last_login_at: '2026-07-31T10:12:00Z',
		created_at: '2026-07-30T19:00:00Z',
		deleted_at: null,
	},
	{
		// deleted: sessions revoked, memberships removed
		id: 30,
		first_name: 'Marco',
		last_name: 'Diaz',
		email: 'marco.diaz@mail.example',
		platform_role: 'user',
		email_verified_at: '2026-04-02T10:00:00Z',
		companies: [],
		professional: null,
		last_login_at: '2026-06-18T08:30:00Z',
		created_at: '2026-04-02T09:55:00Z',
		deleted_at: '2026-08-02T13:15:00Z',
	},
]

// GET /api/admin/users — newest first
const adminUsers: AdminUser[] = [...accountUsers, ...professionalUsers, ...ownerUsers]
	.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))

// --- Claims ---------------------------------------------------

function claimCompany(id: number): AdminClaim['company'] {
	const company = adminCompanyDetails.find(item => item.id === id)
	if (!company) throw new Error(`Unknown company ${id}`)
	return { id: company.id, name: company.name, slug: company.slug, hq: company.hq, website_url: company.website_url }
}

// GET /api/admin/claims — newest first. Claim links expire seven days
// after they are sent in these samples (placeholder; the real expiry
// is a server setting).
const adminClaims: AdminClaim[] = [
	{
		id: 45,
		company: claimCompany(16),
		claimant: { id: 21, name: 'Andre Williams', email: 'andre.williams@mail.example', email_verified_at: '2026-09-20T17:02:00Z' },
		status: 'pending',
		reviewed_by: null,
		reviewed_at: null,
		review_note: null,
		token_sent_at: null,
		token_expires_at: null,
		created_at: '2026-09-21T09:34:00Z',
	},
	{
		id: 44,
		company: claimCompany(16),
		claimant: { id: 20, name: 'Devon Campbell', email: 'devon@kingston-voice.example', email_verified_at: '2026-09-17T12:40:00Z' },
		status: 'pending',
		reviewed_by: null,
		reviewed_at: null,
		review_note: null,
		token_sent_at: null,
		token_expires_at: null,
		created_at: '2026-09-18T14:05:00Z',
	},
	{
		id: 43,
		company: claimCompany(30),
		claimant: { id: 22, name: 'Grace Mendoza', email: 'grace@harborview-support.example', email_verified_at: '2026-09-15T08:20:00Z' },
		status: 'approved',
		reviewed_by: 'Sam Rivera',
		reviewed_at: '2026-09-22T10:12:00Z',
		review_note: 'Grace is listed as operations director on the company website and wrote from the company domain. Confirmed by phone on Sep 22.',
		token_sent_at: '2026-09-22T10:12:00Z',
		token_expires_at: '2026-09-29T10:12:00Z',
		created_at: '2026-09-16T11:48:00Z',
	},
	{
		id: 42,
		company: claimCompany(22),
		claimant: { id: 6, name: 'Wanjiru Kamau', email: 'wanjiru@summit-tns.example', email_verified_at: '2026-08-18T09:40:00Z' },
		status: 'fulfilled',
		reviewed_by: 'Sam Rivera',
		reviewed_at: '2026-08-21T09:05:00Z',
		review_note: 'Head of partnerships per the company website; wrote from the company domain. Summit’s office confirmed by email.',
		token_sent_at: '2026-08-21T09:05:00Z',
		token_expires_at: '2026-08-28T09:05:00Z',
		created_at: '2026-08-19T15:20:00Z',
	},
	{
		id: 41,
		company: claimCompany(16),
		claimant: { id: 23, name: 'Ryan Thompson', email: 'ryan.t@mail.example', email_verified_at: '2026-07-30T19:05:00Z' },
		status: 'rejected',
		reviewed_by: 'Nora Castillo',
		reviewed_at: '2026-08-04T15:30:00Z',
		review_note: 'Couldn’t confirm Ryan works for Kingston Voice Partners. He used a personal email, the company’s public number didn’t recognize his name, and he didn’t send the proof of employment we asked for.',
		token_sent_at: null,
		token_expires_at: null,
		created_at: '2026-07-31T10:05:00Z',
	},
]

// --- Inquiries ------------------------------------------------

function person(id: number): InquiryPerson {
	const record = professionalRecords.find(item => item.id === id)
	if (!record) throw new Error(`Unknown professional ${id}`)
	return { id: record.id, name: `${record.first_name} ${record.last_name}`, slug: record.slug }
}

// GET /api/admin/inquiries — provider inquiries and platform contacts,
// newest first. Sender content is read-only everywhere.
const adminInquiries: Inquiry[] = [
	{
		id: 312,
		type: 'quote',
		company: companyRef(10),
		professional: null,
		sender_name: 'Megan Park',
		sender_email: 'megan.park@clearwater-health.example',
		sender_company: 'Clearwater Health',
		sender_phone: null,
		message: 'We’re a telehealth provider moving our after-hours patient line to a bilingual English and Spanish team by January. Could you share how a pilot would work and how you train agents on HIPAA?',
		meta_json: { services: ['customer-support', 'healthcare-bpo'], timeline: 'Within 3 months', budget: '10–20 agents' },
		status: 'new',
		source_path: '/companies/northshore-cx',
		read_at: null,
		created_at: '2026-09-24T15:42:00Z',
	},
	{
		id: 311,
		type: 'platform',
		company: null,
		professional: null,
		sender_name: 'Hannah Clarke',
		sender_email: 'hannah.clarke@harbourline.example',
		sender_company: 'Harbourline Solutions',
		sender_phone: null,
		message: 'Our company is listed on BPO Profile, but we didn’t create the listing and some details are out of date. How do we claim it so we can fix them and add our team?',
		meta_json: null,
		status: 'new',
		source_path: '/contact',
		read_at: null,
		created_at: '2026-09-24T10:15:00Z',
	},
	{
		id: 310,
		type: 'quote',
		company: companyRef(12),
		professional: person(48),
		sender_name: 'Brian Walsh',
		sender_email: 'brian.walsh@tripnest.example',
		sender_company: 'TripNest',
		// 555-01xx numbers are reserved for fictional use
		sender_phone: '+1 415 555 0187',
		message: 'We’re comparing nearshore partners for a bilingual booking and changes team, and we’d like to start with a small pilot before the winter travel season. What does your pilot usually look like?',
		meta_json: { services: ['customer-support', 'sales-outsourcing'], timeline: 'Next quarter', budget: 'Around 25 agents' },
		status: 'new',
		source_path: '/professionals/valentina-restrepo',
		read_at: null,
		created_at: '2026-09-23T19:26:00Z',
	},
	{
		id: 309,
		type: 'contact',
		company: companyRef(22),
		professional: person(61),
		sender_name: 'Priya Desai',
		sender_email: 'priya@kindred-social.example',
		sender_company: 'Kindred Social',
		sender_phone: null,
		message: 'We’re launching in francophone Africa and need French-language moderation with proper wellbeing support. Could we set up a call next week?',
		meta_json: null,
		status: 'read',
		source_path: '/professionals/wanjiru-kamau',
		read_at: '2026-09-23T08:02:00Z',
		created_at: '2026-09-22T21:40:00Z',
	},
	{
		id: 308,
		type: 'contact',
		company: companyRef(10),
		professional: person(44),
		sender_name: 'Daniel Okafor',
		sender_email: 'daniel@brightsmile-dental.example',
		sender_company: 'BrightSmile Dental Group',
		sender_phone: null,
		message: 'Luis, we met briefly at the patient experience summit. We’d like to talk about Spanish-language scheduling support for our clinics. Do you have time next week?',
		meta_json: null,
		status: 'replied',
		source_path: '/professionals/luis-cruz',
		read_at: '2026-09-22T09:10:00Z',
		created_at: '2026-09-21T18:05:00Z',
	},
	{
		id: 307,
		type: 'platform',
		company: null,
		professional: null,
		sender_name: 'Rafael Torres',
		sender_email: 'rafael.torres@mail.example',
		sender_company: null,
		sender_phone: null,
		message: 'The Baja Link Services profile still lists a Guadalajara site. I worked there until the spring and I believe that office has closed. Could someone check?',
		meta_json: null,
		status: 'new',
		source_path: '/contact',
		read_at: null,
		created_at: '2026-09-21T16:48:00Z',
	},
	{
		id: 306,
		type: 'question',
		company: companyRef(11),
		professional: null,
		sender_name: 'Sophie Laurent',
		sender_email: 'sophie@lumen-retail.example',
		sender_company: 'Lumen Retail',
		sender_phone: null,
		message: 'Do you support French-language chat for our Canadian customers, or English only?',
		meta_json: null,
		status: 'replied',
		source_path: '/companies/meridian-contact-group',
		read_at: '2026-09-20T12:02:00Z',
		created_at: '2026-09-20T11:30:00Z',
	},
	{
		id: 305,
		type: 'question',
		company: companyRef(14),
		professional: person(51),
		sender_name: 'Oliver Grant',
		sender_email: 'oliver.grant@northwind-outdoor.example',
		sender_company: 'Northwind Outdoor',
		sender_phone: null,
		message: 'How quickly can you add coverage for Black Friday? We’d need extra agents from early November through January.',
		meta_json: null,
		status: 'read',
		source_path: '/professionals/thabo-nkosi',
		read_at: '2026-09-19T07:45:00Z',
		created_at: '2026-09-18T16:22:00Z',
	},
	{
		id: 304,
		type: 'contact',
		company: companyRef(16),
		professional: null,
		sender_name: 'Lead Boost Pro',
		sender_email: 'offers@leadboost.example',
		sender_company: null,
		sender_phone: null,
		message: 'Buy verified B2B contact lists today! Best prices guaranteed. Reply now for a free sample list.',
		meta_json: null,
		status: 'spam',
		source_path: '/companies/kingston-voice-partners',
		read_at: '2026-09-17T09:00:00Z',
		created_at: '2026-09-16T23:51:00Z',
	},
	{
		id: 303,
		type: 'quote',
		company: companyRef(15),
		professional: null,
		sender_name: 'Lukas Becker',
		sender_email: 'lukas.becker@rheinwerk-logistik.example',
		sender_company: 'Rheinwerk Logistik',
		sender_phone: null,
		message: 'We’d like to move German-language accounts payable to Poland next year and keep approvals with our finance team here. Can you walk us through your transition process?',
		meta_json: { services: ['finance-accounting'], timeline: 'Within 6 months', budget: 'Accounts payable, about four people' },
		status: 'replied',
		source_path: '/companies/vistula-back-office',
		read_at: '2026-09-15T08:30:00Z',
		created_at: '2026-09-14T13:10:00Z',
	},
	{
		id: 302,
		type: 'platform',
		company: null,
		professional: null,
		sender_name: 'Emily Chen',
		sender_email: 'emily.chen@harbourpoint.example',
		sender_company: 'Harbour Point Consulting',
		sender_phone: null,
		message: 'Is there a way to export a shortlist of providers? We’re preparing a vendor review for a client.',
		meta_json: null,
		status: 'replied',
		source_path: '/contact',
		read_at: '2026-09-12T15:00:00Z',
		created_at: '2026-09-12T13:20:00Z',
	},
	{
		id: 301,
		type: 'contact',
		company: companyRef(17),
		professional: null,
		sender_name: 'Aisha Rahman',
		sender_email: 'aisha@labelworks-ai.example',
		sender_company: 'LabelWorks AI',
		sender_phone: null,
		message: 'We need an image annotation team working to a written quality rubric. Is a two-week paid pilot possible?',
		meta_json: null,
		status: 'archived',
		source_path: '/companies/deccan-data-works',
		read_at: '2026-09-09T10:00:00Z',
		created_at: '2026-09-08T17:45:00Z',
	},
]

// --- Taxonomies -----------------------------------------------

// Which ids a record holds for each taxonomy. Professionals pick
// services, industries and languages only.
const companyTermIds: Record<TaxonomyKey, (record: CompanyRecord) => number[]> = {
	services: record => record.service_ids,
	industries: record => record.industry_ids,
	capabilities: record => record.capability_ids,
	languages: record => record.language_ids,
	technologies: record => record.technology_ids,
}

const professionalTermIds: Record<TaxonomyKey, (record: ProfessionalRecord) => number[]> = {
	services: record => record.service_ids,
	industries: record => record.industry_ids,
	capabilities: () => [],
	languages: record => record.language_ids,
	technologies: () => [],
}

function termsFor(key: TaxonomyKey): AdminTaxonomyTerm[] {
	return taxonomies[key].map((item, index): AdminTaxonomyTerm => ({
		...item,
		sort_order: index + 1,
		is_active: true,
		usage_count:
			companyRecords.filter(record => companyTermIds[key](record).includes(item.id)).length
			+ professionalRecords.filter(record => professionalTermIds[key](record).includes(item.id)).length,
		deleted_at: null,
	}))
}

// GET /api/admin/{taxonomy} — every term, including inactive and
// soft-deleted ones the public catalogs hide.
const adminTaxonomyTerms: Record<TaxonomyKey, AdminTaxonomyTerm[]> = {
	services: termsFor('services'),
	industries: termsFor('industries'),
	capabilities: termsFor('capabilities'),
	// seeded ahead of demand; hidden until a provider needs it
	languages: termsFor('languages').map(term => (term.slug === 'japanese' ? { ...term, is_active: false } : term)),
	technologies: [
		...termsFor('technologies'),
		{
			id: 15,
			name: 'Avaya Aura',
			slug: 'avaya-aura',
			description: null,
			sort_order: 15,
			is_active: false,
			usage_count: 0,
			deleted_at: '2026-06-18T11:20:00Z',
		},
	],
}

// --- Locations ------------------------------------------------

// GET /api/admin/locations — the whole tree, with the places the
// public catalog hides.
const adminLocations: AdminLocation[] = [
	...locations.map((location): AdminLocation => ({
		...location,
		sort_order: locations.filter(item => item.parent_id === location.parent_id).indexOf(location) + 1,
		is_active: true,
		deleted_at: null,
	})),
	// added ahead of a provider opening there; not in filters yet
	{ id: 28, parent_id: 1, type: 'city', name: 'Iloilo City', slug: 'iloilo-city', iso_code: null, sort_order: 4, is_active: false, deleted_at: null },
	// removed when its only provider left the directory
	{ id: 44, parent_id: 4, type: 'city', name: 'Monterrey', slug: 'monterrey', iso_code: null, sort_order: 4, is_active: false, deleted_at: '2026-05-12T09:30:00Z' },
]

// --- Lookups --------------------------------------------------

// GET /api/admin/companies/{id}
function findAdminCompany(id: number): AdminCompanyDetail | undefined {
	return adminCompanyDetails.find(company => company.id === id)
}

// GET /api/admin/professionals/{id}
function findAdminProfessional(id: number): AdminProfessionalDetail | undefined {
	return adminProfessionalDetails.find(professional => professional.id === id)
}


export {
	adminCompanies,
	adminCompanyDetails,
	adminProfessionals,
	adminProfessionalDetails,
	adminClaims,
	adminUsers,
	adminInquiries,
	adminTaxonomyTerms,
	adminLocations,
	findAdminCompany,
	findAdminProfessional,
	companyPublicationChecks,
	professionalPublicationChecks,
}
