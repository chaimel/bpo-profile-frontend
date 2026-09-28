// Static stand-ins for the signed-in dashboards (docs/API.md §5 company
// dashboard, §6 sales dashboard). The session user, Ana Reyes
// (~/data/features/session), owns Northshore CX (company 10) and has her
// own sales profile (professional 45). Each export is shaped like its
// endpoint's response, so pages swap to the typed API client without
// touching a component. People and messages are fictional, and every
// email address uses the reserved .example domain.
import type {
	ChecklistItem,
	CompanyChecklistKey,
	CompanyDashboard,
	DashboardStats,
	EditableCompany,
	EditableProfessional,
	ProfessionalChecklistKey,
	TeamMember,
	TeamOverview,
} from '~/types/features/dashboard'
import type { CompanyRef } from '~/types/features/directory'
import type { Inquiry, InquiryPerson } from '~/types/features/inquiry'
import { companyRecords } from './companies'
import { type ProfessionalRecord, professionalRecords } from './professionals'
import { me } from './session'

// --- Records --------------------------------------------------

function companyRecord(id: number) {
	const record = companyRecords.find(item => item.id === id)
	if (!record) throw new Error(`Unknown company ${id}`)
	return record
}

function professionalRecord(id: number): ProfessionalRecord {
	const record = professionalRecords.find(item => item.id === id)
	if (!record) throw new Error(`Unknown professional ${id}`)
	return record
}

const northshore = companyRecord(10)

const northshoreRef: CompanyRef = {
	id: northshore.id,
	name: northshore.name,
	slug: northshore.slug,
}

// --- GET /api/dashboard/companies/10 --------------------------

const editableCompany: EditableCompany = {
	id: northshore.id,
	slug: northshore.slug,
	name: northshore.name,
	tagline: northshore.tagline,
	overview: northshore.overview,
	why_choose_us: northshore.why_choose_us,
	website_url: northshore.website_url,
	linkedin_url: northshore.linkedin_url,
	founded_year: northshore.founded_year,
	company_size: northshore.company_size,
	work_model: northshore.work_model,
	inquiry_email: 'sales@northshore-cx.example',
	phone: northshore.phone,
	status: 'published',
	// company registration claims the listing (docs/API.md §1)
	claimed_at: '2026-03-01T07:52:00Z',
	verified_at: '2026-03-02T08:40:00Z',
	// assigned by the platform team until billing launches (docs/PLAN.md §4.7)
	plan: { slug: 'basic', name: 'Basic', expires_at: null },
	completeness_score: northshore.completeness_score,
	logo_url: null,
	logo_alt_text: null,
	cover_url: null,
	cover_alt_text: null,
	service_ids: [...northshore.service_ids],
	industry_ids: [...northshore.industry_ids],
	capability_ids: [...northshore.capability_ids],
	language_ids: [...northshore.language_ids],
	technology_ids: [...northshore.technology_ids],
	location_ids: [...northshore.location_ids],
	hq_location_id: northshore.hq_location_id,
	certifications: northshore.certifications.map(certification => ({ ...certification })),
}

// --- GET .../team/{professionalId} and /api/dashboard/professional

// A published Northshore team member: the public record plus the
// fields only the dashboard returns.
function toEditable(record: ProfessionalRecord, verifiedAt: string): EditableProfessional {
	return {
		id: record.id,
		slug: record.slug,
		company: northshoreRef,
		first_name: record.first_name,
		last_name: record.last_name,
		job_title: record.job_title,
		bio: record.bio,
		expertise: record.expertise,
		experience_summary: record.experience_summary,
		timezone: record.timezone,
		location_id: record.location_id,
		linkedin_url: record.linkedin_url,
		website_url: record.website_url,
		public_email: null,
		phone: null,
		status: 'published',
		affiliation_status: 'approved',
		verified_at: record.verified ? verifiedAt : null,
		photo_url: null,
		photo_alt_text: null,
		completeness_score: record.completeness_score,
		service_ids: [...record.service_ids],
		industry_ids: [...record.industry_ids],
		language_ids: [...record.language_ids],
		market_ids: [...record.market_ids],
		has_account: true,
	}
}

const luis = toEditable(professionalRecord(44), '2026-03-05T10:20:00Z')

// Ana's own sales profile (GET /api/dashboard/professional).
const ana = toEditable(professionalRecord(45), '2026-03-03T09:30:00Z')

// A roster profile Ana created for a colleague. It has no login until
// Miguel accepts the invitation below (docs/API.md §5).
const miguel: EditableProfessional = {
	id: 90,
	slug: 'miguel-ramos',
	company: northshoreRef,
	first_name: 'Miguel',
	last_name: 'Ramos',
	job_title: 'Account Manager',
	bio: null,
	expertise: null,
	experience_summary: null,
	timezone: 'Asia/Manila',
	location_id: 25,
	linkedin_url: null,
	website_url: null,
	public_email: null,
	phone: null,
	status: 'draft',
	affiliation_status: 'approved',
	verified_at: null,
	photo_url: null,
	photo_alt_text: null,
	// name, title, company, one service and a location: 5 of 8 checks
	completeness_score: 63,
	service_ids: [1],
	industry_ids: [1],
	language_ids: [1, 3],
	market_ids: [],
	has_account: false,
}

const editableProfessionals: Record<number, EditableProfessional> = {
	[luis.id]: luis,
	[ana.id]: ana,
	[miguel.id]: miguel,
}

// --- GET /api/dashboard/companies/10/team ---------------------

function toMember(professional: EditableProfessional): TeamMember {
	return {
		id: professional.id,
		slug: professional.slug,
		first_name: professional.first_name,
		last_name: professional.last_name,
		job_title: professional.job_title,
		photo_url: professional.photo_url,
		status: professional.status,
		affiliation_status: professional.affiliation_status,
		verified: professional.verified_at !== null,
		has_account: professional.has_account,
		completeness_score: professional.completeness_score,
	}
}

const team: TeamOverview = {
	members: [luis, ana, miguel].map(toMember),
	requests: [
		{
			professional_id: 91,
			first_name: 'Bea',
			last_name: 'Lim',
			job_title: 'Sales Executive',
			email: 'bea.lim@northshore-cx.example',
			email_verified: true,
			requested_at: '2026-09-22T03:14:00Z',
		},
		{
			// registered, but hasn't completed a first sign-in yet
			professional_id: 92,
			first_name: 'Kevin',
			last_name: 'Ortiz',
			job_title: 'Business Development Associate',
			email: 'kevin.ortiz@northshore-cx.example',
			email_verified: false,
			requested_at: '2026-09-24T11:40:00Z',
		},
	],
	invitations: [
		{
			id: 301,
			professional_id: miguel.id,
			professional_name: `${miguel.first_name} ${miguel.last_name}`,
			email: 'miguel.ramos@northshore-cx.example',
			invited_by: `${me.first_name} ${me.last_name}`,
			created_at: '2026-09-25T02:30:00Z',
			expires_at: '2026-10-02T02:30:00Z',
		},
	],
}

// --- GET /api/dashboard/companies/10/inquiries ----------------

function person(professional: EditableProfessional): InquiryPerson {
	return {
		id: professional.id,
		name: `${professional.first_name} ${professional.last_name}`,
		slug: professional.slug,
	}
}

// Newest first. Owners and admins see every inquiry to the company,
// including those sent to a team member (docs/DATABASE.md §3).
const companyInquiries: Inquiry[] = [
	{
		// the quote example from docs/API.md §4
		id: 508,
		type: 'quote',
		company: northshoreRef,
		professional: person(luis),
		sender_name: 'Jordan Lee',
		sender_email: 'jordan@harbor-retail.example',
		sender_company: 'Harbor Retail',
		// 555-01xx numbers are reserved for fictional use
		sender_phone: '+1 206 555 0187',
		message: 'We need overnight chat support for two brands.',
		meta_json: { services: ['customer-support'], timeline: '60 days' },
		status: 'new',
		source_path: '/professionals/luis-cruz',
		read_at: null,
		created_at: '2026-09-24T22:41:00Z',
	},
	{
		id: 507,
		type: 'contact',
		company: northshoreRef,
		professional: null,
		sender_name: 'Maya Chen',
		sender_email: 'maya.chen@brightpath-health.example',
		sender_company: 'BrightPath Health',
		sender_phone: null,
		message: 'We run urgent care clinics in Texas and Arizona and need a partner to answer our after-hours scheduling line. Could someone walk us through how your pilots work and what you would need from us to get started?',
		meta_json: null,
		status: 'new',
		source_path: '/companies/northshore-cx',
		read_at: null,
		created_at: '2026-09-24T15:05:00Z',
	},
	{
		id: 506,
		type: 'question',
		company: northshoreRef,
		professional: person(ana),
		sender_name: 'Daniel Okafor',
		sender_email: 'daniel.okafor@clearwell-dental.example',
		sender_company: 'Clearwell Dental Group',
		sender_phone: null,
		message: 'Do your agents work directly in our practice management system, or would we need to set up a separate tool for them? All 14 of our locations share one system.',
		meta_json: null,
		status: 'new',
		source_path: '/professionals/ana-reyes',
		read_at: null,
		created_at: '2026-09-23T09:12:00Z',
	},
	{
		id: 505,
		type: 'quote',
		company: northshoreRef,
		professional: null,
		sender_name: 'Priya Nair',
		sender_email: 'priya.nair@lumen-telehealth.example',
		sender_company: 'Lumen Telehealth',
		sender_phone: '+1 312 555 0164',
		message: 'We are moving our Spanish-language patient line to a new partner early next year. It takes roughly 3,000 calls a month, weekdays from 7am to 9pm Eastern. Could you send a proposal for a pilot team?',
		meta_json: { services: ['customer-support', 'healthcare-bpo'], timeline: 'January 2027', budget: '8–10 agents' },
		status: 'read',
		source_path: '/companies/northshore-cx',
		read_at: '2026-09-19T16:02:00Z',
		created_at: '2026-09-19T14:30:00Z',
	},
	{
		id: 504,
		type: 'contact',
		company: northshoreRef,
		professional: person(luis),
		sender_name: 'Sofia Martinez',
		sender_email: 'sofia.martinez@northgate-benefits.example',
		sender_company: 'Northgate Benefits',
		sender_phone: null,
		message: 'We are reviewing partners for member services during open enrollment in November and December. Could we set up a call next week to talk through how you staff for seasonal peaks?',
		meta_json: null,
		status: 'replied',
		source_path: '/professionals/luis-cruz',
		read_at: '2026-09-15T13:48:00Z',
		created_at: '2026-09-15T13:20:00Z',
	},
	{
		id: 503,
		type: 'question',
		company: northshoreRef,
		professional: null,
		sender_name: 'Tom Becker',
		sender_email: 'tom@cartwheel-supply.example',
		sender_company: 'Cartwheel Supply Co.',
		sender_phone: null,
		message: 'Do you take on e-commerce support, like order tracking and returns, or do you only work with healthcare companies?',
		meta_json: null,
		status: 'archived',
		source_path: '/companies/northshore-cx',
		read_at: '2026-09-08T12:10:00Z',
		created_at: '2026-09-08T10:45:00Z',
	},
	{
		id: 502,
		type: 'quote',
		company: northshoreRef,
		professional: person(ana),
		sender_name: 'Rachel Kim',
		sender_email: 'rachel.kim@meadowcare-clinics.example',
		sender_company: 'MeadowCare Clinics',
		sender_phone: null,
		message: 'We are looking for bilingual support for patient billing questions across six clinics. Could you share pricing for a five-agent pilot?',
		meta_json: { services: ['healthcare-bpo'], timeline: '90 days', budget: 'Five-agent pilot' },
		status: 'replied',
		source_path: '/professionals/ana-reyes',
		read_at: '2026-09-04T09:30:00Z',
		created_at: '2026-09-04T08:05:00Z',
	},
	{
		id: 501,
		type: 'contact',
		company: northshoreRef,
		professional: null,
		sender_name: 'Growth Leads Pro',
		sender_email: 'offers@growthleads-pro.example',
		sender_company: null,
		sender_phone: null,
		message: 'Boost your B2B pipeline with 10,000 verified leads. Reply YES for a free sample list.',
		meta_json: null,
		status: 'spam',
		source_path: '/companies/northshore-cx',
		read_at: '2026-09-02T06:30:00Z',
		created_at: '2026-09-02T04:12:00Z',
	},
]

// GET /api/dashboard/professional/inquiries — only those assigned to Ana.
const myInquiries: Inquiry[] = companyInquiries.filter(inquiry => inquiry.professional?.id === ana.id)

// --- GET .../stats and /api/dashboard/professional/stats ------
// PLACEHOLDERS: every figure below stands in for the stats endpoints
// until they exist; none is a real measurement. Only the inquiry counts
// are derived — from the accepted (non-spam) inquiries above in the same
// window — so the inbox and the stats tell one story.

const statsWindow = { from: '2026-08-27', to: '2026-09-25' }

function inquiryCounts(list: Inquiry[]): DashboardStats['inquiries'] {
	const accepted = list.filter(inquiry =>
		inquiry.status !== 'spam'
		&& inquiry.created_at.slice(0, 10) >= statsWindow.from
		&& inquiry.created_at.slice(0, 10) <= statsWindow.to,
	)
	const count = (type: Inquiry['type']) => accepted.filter(inquiry => inquiry.type === type).length

	return { contact: count('contact'), question: count('question'), quote: count('quote') }
}

// Accepted inquiries ÷ profile views; null when there were no views.
function conversionRate(inquiries: DashboardStats['inquiries'], views: number): number | null {
	const total = inquiries.contact + inquiries.question + inquiries.quote
	return views > 0 ? total / views : null
}

const companyProfileViews = 388 // placeholder
const salesProfileViews = 224 // placeholder
const companyInquiryCounts = inquiryCounts(companyInquiries)

const companyStats: DashboardStats = {
	...statsWindow,
	search_impressions: 4820, // placeholder
	profile_views: companyProfileViews + salesProfileViews,
	company_profile_views: companyProfileViews,
	sales_profile_views: salesProfileViews,
	cta_clicks: 71, // placeholder
	website_clicks: 46, // placeholder
	inquiries: companyInquiryCounts,
	lead_conversion_rate: conversionRate(companyInquiryCounts, companyProfileViews + salesProfileViews),
}

const myProfileViews = 131 // placeholder, within the company's sales-profile views
const myInquiryCounts = inquiryCounts(myInquiries)

const myStats: DashboardStats = {
	...statsWindow,
	search_impressions: 1240, // placeholder
	profile_views: myProfileViews,
	// company scope only
	company_profile_views: null,
	sales_profile_views: null,
	cta_clicks: 18, // placeholder
	// Ana's profile lists no website, so there is nothing to click
	website_clicks: 0,
	inquiries: myInquiryCounts,
	lead_conversion_rate: conversionRate(myInquiryCounts, myProfileViews),
}

// What either stats endpoint returns for a window with no activity —
// used by the ?state=empty previews.
function noActivityStats(scope: 'company' | 'professional'): DashboardStats {
	return {
		...statsWindow,
		search_impressions: 0,
		profile_views: 0,
		company_profile_views: scope === 'company' ? 0 : null,
		sales_profile_views: scope === 'company' ? 0 : null,
		cta_clicks: 0,
		website_clicks: 0,
		inquiries: { contact: 0, question: 0, quote: 0 },
		lead_conversion_rate: null,
	}
}

// --- Company-scoped lookups -----------------------------------
// Company dashboard routes need an accepted owner or admin membership
// (docs/API.md §5). The stand-in applies the same rule, so an unknown or
// foreign company id resolves to nothing and the page renders a 404.

type CompanyData = Omit<CompanyDashboard, 'membership'>

const companyData: Record<number, CompanyData> = {
	[editableCompany.id]: { company: editableCompany, team, inquiries: companyInquiries, stats: companyStats },
}

function managedCompany(companyId: number): CompanyData | undefined {
	const manages = me.companies.some(company => company.id === companyId && company.role !== 'professional')
	return manages ? companyData[companyId] : undefined
}

// GET /api/dashboard/companies/{companyId}
function findEditableCompany(companyId: number): EditableCompany | undefined {
	return managedCompany(companyId)?.company
}

// GET .../team
function findTeam(companyId: number): TeamOverview | undefined {
	return managedCompany(companyId)?.team
}

// GET .../team/{professionalId} — a profile from another company is a 404.
function findTeamProfessional(companyId: number, professionalId: number): EditableProfessional | undefined {
	const data = managedCompany(companyId)
	if (!data?.team.members.some(member => member.id === professionalId)) return undefined

	const professional = editableProfessionals[professionalId]
	return professional?.company.id === companyId ? professional : undefined
}

// GET .../inquiries
function findCompanyInquiries(companyId: number): Inquiry[] | undefined {
	return managedCompany(companyId)?.inquiries
}

// GET .../stats
function findCompanyStats(companyId: number): DashboardStats | undefined {
	return managedCompany(companyId)?.stats
}

// One entry per accepted owner/admin membership in GET /api/me.
function companyDashboards(): CompanyDashboard[] {
	return me.companies.flatMap((membership) => {
		const data = managedCompany(membership.id)
		return data ? [{ membership, ...data }] : []
	})
}

// GET /api/dashboard/professional — the signed-in user's own profile.
function findOwnProfessional(): EditableProfessional | undefined {
	return me.professional ? editableProfessionals[me.professional.id] : undefined
}

// --- Completeness checklists (docs/DATABASE.md §6) ------------
// The API stores the real score and recalculates it on save. These
// mirror its checklists so the dashboards can show what's left and
// preview a score while editing. Company weights are example defaults,
// as the doc allows, and add up to 100.

const profileCompleteThreshold = 80

type CompanyChecklistInput = Pick<
	EditableCompany,
	'name' | 'logo_url' | 'overview' | 'website_url' | 'hq_location_id' | 'service_ids' | 'industry_ids' | 'location_ids' | 'why_choose_us'
>

function filled(value: string | null | undefined): boolean {
	return Boolean(value && value.trim())
}

function companyChecklist(company: CompanyChecklistInput, teamSize: number): ChecklistItem<CompanyChecklistKey>[] {
	return [
		{ key: 'name', label: 'Company name', done: filled(company.name), weight: 10 },
		{ key: 'logo', label: 'Upload your logo', done: filled(company.logo_url), weight: 8 },
		{ key: 'overview', label: 'Write an overview', done: filled(company.overview), weight: 12 },
		{ key: 'website', label: 'Add your website', done: filled(company.website_url), weight: 10 },
		{ key: 'hq', label: 'Set your headquarters', done: company.hq_location_id !== null, weight: 10 },
		{ key: 'service', label: 'Choose at least one service', done: company.service_ids.length > 0, weight: 10 },
		{ key: 'industry', label: 'Choose at least one industry', done: company.industry_ids.length > 0, weight: 10 },
		{ key: 'location', label: 'Add an operating location', done: company.location_ids.length > 0, weight: 10 },
		{ key: 'professional', label: 'Add a sales professional', done: teamSize > 0, weight: 10 },
		{ key: 'why_choose_us', label: 'Say why buyers should choose you', done: filled(company.why_choose_us), weight: 10 },
	]
}

// Same checks as the shared professional editor, equally weighted.
function professionalChecklist(professional: EditableProfessional): ChecklistItem<ProfessionalChecklistKey>[] {
	const hasContact = professional.has_account || filled(professional.public_email) || filled(professional.phone)
	const checks: Omit<ChecklistItem<ProfessionalChecklistKey>, 'weight'>[] = [
		{ key: 'photo', label: 'Add a photo', done: filled(professional.photo_url) },
		{ key: 'name', label: 'Add your name', done: filled(professional.first_name) && filled(professional.last_name) },
		{ key: 'title', label: 'Add your job title', done: filled(professional.job_title) },
		{ key: 'company', label: 'Company', done: true },
		{ key: 'bio', label: 'Write a bio', done: filled(professional.bio) },
		{ key: 'service', label: 'Choose at least one service', done: professional.service_ids.length > 0 },
		{ key: 'location', label: 'Set your location', done: professional.location_id !== null },
		{ key: 'contact', label: 'Add a contact path', done: hasContact },
	]

	return checks.map(check => ({ ...check, weight: 100 / checks.length }))
}

function checklistScore(items: ChecklistItem[]): number {
	return Math.round(items.reduce((total, item) => total + (item.done ? item.weight : 0), 0))
}

export {
	editableCompany,
	team,
	editableProfessionals,
	companyInquiries,
	myInquiries,
	companyStats,
	myStats,
	noActivityStats,
	findEditableCompany,
	findTeam,
	findTeamProfessional,
	findCompanyInquiries,
	findCompanyStats,
	companyDashboards,
	findOwnProfessional,
	profileCompleteThreshold,
	companyChecklist,
	professionalChecklist,
	checklistScore,
}
