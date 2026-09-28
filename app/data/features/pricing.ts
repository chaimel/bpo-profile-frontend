// Company listing plans: the catalog (GET /api/plans — docs/API.md §2,
// docs/DATABASE.md §4.2) and how the pricing page presents it
// (docs/PLAN.md §4.7). There are no prices: checkout arrives in Phase 3,
// and until then the BPO Profile team assigns paid plans by hand. The
// page describes each plan's intended package and labels every benefit
// as available now or coming later — never as a promise.
import type { FaqItem, PlanComparisonRow, PlanPresentation } from '~/types/features/content'
import type { Plan } from '~/types/features/directory'

// featured_eligible and analytics_level describe the intended package.
// Paid entitlements are only enforced from Phase 3, so at launch every
// company dashboard shows the same basic counts.
// Seat and image limits are PLACEHOLDERS: they have not been decided,
// are not enforced until Phase 3, and are never shown on the page.
const plans: Plan[] = [
	{
		id: 1,
		slug: 'basic',
		name: 'Basic',
		audience: 'company',
		max_professional_seats: null, // placeholder
		max_images: 2, // placeholder — a logo and a cover, the Phase 1 media
		featured_eligible: false,
		analytics_level: 'none',
		sort_order: 1,
		is_active: true,
	},
	{
		id: 2,
		slug: 'professional',
		name: 'Professional',
		audience: 'company',
		max_professional_seats: null, // placeholder
		max_images: 2, // placeholder
		featured_eligible: false,
		analytics_level: 'basic',
		sort_order: 2,
		is_active: true,
	},
	{
		id: 3,
		slug: 'premium',
		name: 'Premium',
		audience: 'company',
		max_professional_seats: null, // placeholder
		max_images: 2, // placeholder
		featured_eligible: true,
		analytics_level: 'advanced',
		sort_order: 3,
		is_active: true,
	},
]

const pricingIntro = {
	title: 'Listing plans for BPO companies',
	lede: 'Start with a free Basic listing and get in front of businesses looking for outsourcing partners. Professional and Premium add more as those features launch — and no plan can buy a higher search ranking.',
	note: 'Online checkout isn’t open yet. Our team sets up Professional and Premium plans by request.',
}

// Basic is highlighted: it is free and everything in it works today.
const planPresentations: PlanPresentation[] = [
	{
		slug: 'basic',
		name: 'Basic',
		price_label: 'Free',
		price_note: 'No payment details needed.',
		summary: 'Everything you need to be found, understood, and contacted: your company, your sales team, and inquiries from buyers.',
		cta_label: 'Get Listed',
		cta_to: '/register?type=company',
		highlighted: true,
		benefits: [
			{ label: 'Standard company listing in search and the directory', availability: 'now' },
			{ label: 'Company information: services, industries, locations, capabilities, and certifications', availability: 'now' },
			{ label: 'Sales team profiles linked to your company', availability: 'now' },
			{ label: 'Inquiries and quote requests, in your dashboard and by email', availability: 'now' },
			{ label: 'Basic visibility across search results and browse pages', availability: 'now' },
		],
	},
	{
		slug: 'professional',
		name: 'Professional',
		price_label: 'Talk to our team',
		price_note: 'Assigned by the BPO Profile team until checkout opens.',
		summary: 'Everything in Basic, with basic analytics today and a fuller profile as media features launch.',
		cta_label: 'Talk to our team',
		cta_to: '/contact',
		highlighted: false,
		benefits: [
			{ label: 'Basic analytics: profile views, search impressions, clicks, and inquiries', availability: 'now' },
			{ label: 'A fuller profile with more images and media', availability: 'later' },
			{ label: 'A larger sales team allowance', availability: 'later' },
			{ label: 'Additional visibility across the directory', availability: 'later' },
		],
	},
	{
		slug: 'premium',
		name: 'Premium',
		price_label: 'Talk to our team',
		price_note: 'Assigned by the BPO Profile team until checkout opens.',
		summary: 'Everything in Professional, plus featured eligibility, promotional slots, and advanced analytics as they launch.',
		cta_label: 'Talk to our team',
		cta_to: '/contact',
		highlighted: false,
		benefits: [
			{ label: 'Eligibility for featured placements, always labeled as Featured', availability: 'later' },
			{ label: 'Promotional slots on the home page and directory pages', availability: 'later' },
			{ label: 'Advanced analytics with breakdowns and trends', availability: 'later' },
			{ label: 'Premium visibility as a final, disclosed tie-breaker in search', availability: 'later' },
		],
	},
]

const planComparison: PlanComparisonRow[] = [
	{ label: 'Company listing in search and the directory', values: { basic: 'yes', professional: 'yes', premium: 'yes' } },
	{ label: 'Company profile: services, industries, locations, and capabilities', values: { basic: 'yes', professional: 'yes', premium: 'yes' } },
	{ label: 'Sales team profiles', values: { basic: 'yes', professional: 'yes', premium: 'yes' } },
	{ label: 'Inquiries and quote requests from buyers', values: { basic: 'yes', professional: 'yes', premium: 'yes' } },
	{ label: 'Claimed, Verified, and Profile complete badges, earned through review', values: { basic: 'yes', professional: 'yes', premium: 'yes' } },
	{ label: 'Basic analytics', values: { basic: 'no', professional: 'yes', premium: 'yes' } },
	{ label: 'Fuller profile with more images and media', values: { basic: 'no', professional: 'later', premium: 'later' } },
	{ label: 'Larger sales team allowance', values: { basic: 'no', professional: 'later', premium: 'later' } },
	{ label: 'Additional visibility', values: { basic: 'no', professional: 'later', premium: 'later' } },
	{ label: 'Featured placement eligibility', values: { basic: 'no', professional: 'no', premium: 'later' } },
	{ label: 'Promotional slots', values: { basic: 'no', professional: 'no', premium: 'later' } },
	{ label: 'Advanced analytics', values: { basic: 'no', professional: 'no', premium: 'later' } },
	{ label: 'Premium visibility as a final, disclosed tie-breaker', values: { basic: 'no', professional: 'no', premium: 'later' } },
]

const comparisonNote = 'Paid plan limits aren’t enforced until checkout opens, so for now every listed company’s dashboard includes basic activity counts.'

// Premium placement never overrides relevance, completeness,
// verification, location/service match or quality (docs/PLAN.md §4.7).
const rankingDisclosure = {
	title: 'Paid plans never buy the top spot',
	text: 'Every search uses the same order for every company, on every plan. Premium visibility comes last: a disclosed tie-breaker between results that are equal on everything above it.',
	status: 'Premium visibility isn’t switched on yet. When featured placements arrive, they’ll always be labeled.',
}

const pricingFaq: FaqItem[] = [
	{
		question: 'Do buyers pay to use BPO Profile?',
		answer: 'No. Businesses looking for a BPO can search, compare profiles, and send inquiries for free, and they never need an account. Plans are only for BPO companies that list with us.',
	},
	{
		question: 'How do I upgrade to Professional or Premium today?',
		answer: 'Online checkout isn’t open yet, so upgrades go through our team. Send us a message from the contact page and we’ll talk through what each plan includes right now. Until checkout opens, the BPO Profile team assigns plans by hand.',
	},
	{
		question: 'What does “Coming later” mean?',
		answer: 'It marks a benefit that is part of a plan’s design but isn’t built yet. We label it so you always know exactly what a plan includes today.',
	},
	{
		question: 'Can individual sales professionals buy a listing?',
		answer: 'Not today. Sales professionals create a free profile that is affiliated with their company’s listing. An optional individual listing for sales professionals may come later.',
	},
	{
		question: 'Does Premium buy the top spot in search?',
		answer: 'No. Results are ordered by relevance, profile completeness, verification, location and service match, and quality signals. Premium visibility only separates results that are tied on all of those, it is always disclosed, and it isn’t switched on yet.',
	},
	{
		question: 'Can a paid plan get my company verified?',
		answer: 'No. Claimed, Verified company, Verified professional, and Profile complete are earned through our reviews and your own profile, the same way on every plan.',
	},
]

export {
	plans,
	pricingIntro,
	planPresentations,
	planComparison,
	comparisonNote,
	rankingDisclosure,
	pricingFaq,
}
