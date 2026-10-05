// Static UI content that is not part of the directory API: home copy,
// pricing presentation, and trust/legal pages.
import type { MIconName, Tone } from '~/types/base/ui'
import type { PlanSlug } from '~/types/features/directory'

interface ContentPoint {
	icon: MIconName
	title: string
	text: string
}

interface ContentStep {
	title: string
	text: string
}

// Pricing: benefits are labelled by when they ship (docs/PLAN.md §4.7).
type BenefitAvailability = 'now' | 'later'

interface PlanBenefit {
	label: string
	availability: BenefitAvailability
}

interface PlanPresentation {
	slug: PlanSlug
	name: string
	price_label: string
	price_note: string
	summary: string
	cta_label: string
	cta_to: string
	highlighted: boolean
	benefits: PlanBenefit[]
}

type ComparisonValue = 'yes' | 'no' | 'later' | 'unspecified'

interface PlanComparisonRow {
	label: string
	values: Partial<Record<PlanSlug, ComparisonValue>>
}

interface FaqItem {
	question: string
	answer: string
}

// Trust & legal pages.
interface DocumentSection {
	id: string
	title: string
	paragraphs: string[]
	list?: string[]
}

// --- About -----------------------------------------------------

interface DiscoveryLayer {
	icon: MIconName
	title: string
	lede: string
	text: string
	link: { label: string, to: string }
}

interface TrustBadgeInfo {
	key: string
	label: string
	icon: MIconName
	// matches the tone the badge carries on profiles (core/trust/MTrustBadges)
	tone: Tone
	applies_to: string
	means: string
	does_not_mean: string
}

interface UpcomingBadgeInfo {
	label: string
	icon: MIconName
	tone: Tone
	status: string
	means: string
}

interface RankingPriority {
	title: string
	text: string
	// premium visibility: the final, disclosed tie-breaker
	tie_breaker?: boolean
}

// --- Legal -----------------------------------------------------

interface LegalDocument {
	title: string
	// meta description
	description: string
	lede: string
	// ISO date of the last edit to the draft
	updated: string
	sections: DocumentSection[]
}

export type {
	ContentPoint,
	ContentStep,
	BenefitAvailability,
	PlanBenefit,
	PlanPresentation,
	ComparisonValue,
	PlanComparisonRow,
	FaqItem,
	DocumentSection,
	DiscoveryLayer,
	TrustBadgeInfo,
	UpcomingBadgeInfo,
	RankingPriority,
	LegalDocument,
}
