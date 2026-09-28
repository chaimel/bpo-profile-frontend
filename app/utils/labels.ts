// Display labels for API enums. One place, so a status reads the same
// on the public site, the dashboards and the admin.
import type { MIconName, SelectOption, Tone } from '~/types/base/ui'
import type { CompanyRole, PlatformRole } from '~/types/features/dashboard'
import type {
	AffiliationStatus,
	CompanySize,
	DirectorySort,
	PlanSlug,
	PublicationStatus,
	WorkModel,
} from '~/types/features/directory'
import type { InquiryStatus, InquiryType } from '~/types/features/inquiry'
import type { ClaimStatus } from '~/types/features/onboarding'

// Every status pairs its tone with a word and an icon — never color alone.
interface StatusMeta {
	label: string
	tone: Tone
	icon: MIconName
}

const companySizeLabels: Record<CompanySize, string> = {
	'1_10': '1–10 employees',
	'11_50': '11–50 employees',
	'51_200': '51–200 employees',
	'201_500': '201–500 employees',
	'501_1000': '501–1,000 employees',
	'1000_plus': '1,000+ employees',
	'unknown': 'Not specified',
}

const workModelLabels: Record<WorkModel, string> = {
	onshore: 'Onshore',
	offshore: 'Offshore',
	nearshore: 'Nearshore',
	hybrid: 'Hybrid',
	unknown: 'Not specified',
}

const sortLabels: Record<DirectorySort, string> = {
	relevance: 'Relevance',
	newest: 'Newest',
	name: 'Name (A–Z)',
}

const planLabels: Record<PlanSlug, string> = {
	basic: 'Basic',
	professional: 'Professional',
	premium: 'Premium',
}

const inquiryTypeLabels: Record<InquiryType, string> = {
	contact: 'Contact',
	question: 'Question',
	quote: 'Quote request',
	platform: 'Platform message',
}

const companyRoleLabels: Record<CompanyRole, string> = {
	owner: 'Owner',
	admin: 'Admin',
	professional: 'Sales professional',
}

const platformRoleLabels: Record<PlatformRole, string> = {
	user: 'Provider account',
	admin: 'Platform admin',
}

const publicationStatusMeta: Record<PublicationStatus, StatusMeta> = {
	draft: { label: 'Draft', tone: 'neutral', icon: 'light-file-edit' },
	pending_review: { label: 'Pending review', tone: 'warning', icon: 'light-alarm-clock' },
	published: { label: 'Published', tone: 'success', icon: 'light-check-circle' },
	suspended: { label: 'Suspended', tone: 'danger', icon: 'light-exclamation-triangle' },
}

const affiliationStatusMeta: Record<AffiliationStatus, StatusMeta> = {
	pending: { label: 'Affiliation pending', tone: 'warning', icon: 'light-alarm-clock' },
	approved: { label: 'Affiliation approved', tone: 'success', icon: 'light-user-check' },
	rejected: { label: 'Affiliation rejected', tone: 'danger', icon: 'light-times-circle' },
}

const inquiryStatusMeta: Record<InquiryStatus, StatusMeta> = {
	new: { label: 'New', tone: 'brand', icon: 'light-envelope' },
	read: { label: 'Read', tone: 'neutral', icon: 'light-eye' },
	replied: { label: 'Replied', tone: 'success', icon: 'light-paper-plane' },
	archived: { label: 'Archived', tone: 'slate', icon: 'light-box-full' },
	spam: { label: 'Spam', tone: 'danger', icon: 'light-flag' },
}

const claimStatusMeta: Record<ClaimStatus, StatusMeta> = {
	pending: { label: 'Pending review', tone: 'warning', icon: 'light-alarm-clock' },
	approved: { label: 'Approved — token sent', tone: 'brand', icon: 'light-envelope-text' },
	rejected: { label: 'Rejected', tone: 'danger', icon: 'light-times-circle' },
	fulfilled: { label: 'Fulfilled', tone: 'success', icon: 'light-check-circle' },
}

// Ready-made select options for the enum filters and editors.
function toOptions<T extends string>(labels: Record<T, string>, omit: T[] = []): SelectOption[] {
	return (Object.keys(labels) as T[])
		.filter(value => !omit.includes(value))
		.map(value => ({ label: labels[value], value }))
}

const companySizeOptions = toOptions(companySizeLabels, ['unknown'])
const workModelOptions = toOptions(workModelLabels, ['unknown'])
const sortOptions = toOptions(sortLabels)

export type { StatusMeta }

export {
	companySizeLabels,
	workModelLabels,
	sortLabels,
	planLabels,
	inquiryTypeLabels,
	companyRoleLabels,
	platformRoleLabels,
	publicationStatusMeta,
	affiliationStatusMeta,
	inquiryStatusMeta,
	claimStatusMeta,
	toOptions,
	companySizeOptions,
	workModelOptions,
	sortOptions,
}
