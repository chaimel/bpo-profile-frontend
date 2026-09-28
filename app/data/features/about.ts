// About page copy. Positioning, mission, vision, the core concept and
// the two discovery layers come from the brand book (PDF pp. 6–9, 39);
// badge meanings from docs/PLAN.md §4.6 and docs/DATABASE.md §6; the
// ranking order from docs/PLAN.md §7 (PDF p. 23); the accessibility
// commitments from docs/SETUP.md §5 (PDF pp. 38–39).
import type {
	ContentPoint,
	DiscoveryLayer,
	RankingPriority,
	TrustBadgeInfo,
	UpcomingBadgeInfo,
} from '~/types/features/content'

const aboutIntro = {
	title: 'About BPO Profile',
	statement: 'BPO Profile brings BPO companies and the professionals behind them into one trusted discovery network.',
	lede: 'We make it easier for businesses to find the right outsourcing partner, understand what they offer, and start a conversation with the person who represents them.',
}

// BPO Company → Sales Professional → Potential Client (PDF p. 6).
const coreConcept: ContentPoint[] = [
	{ icon: 'light-building', title: 'BPO company', text: 'Shows what it offers, where it works, and who represents it.' },
	{ icon: 'light-user', title: 'Sales professional', text: 'The person who answers questions and builds the relationship.' },
	{ icon: 'light-comments', title: 'Potential client', text: 'Finds the right partner and starts the conversation.' },
]

const positioning = {
	is: 'A BPO-focused professional discovery network.',
	text: 'Businesses search by service, industry, and location, evaluate the companies they find, and contact the people who represent them. Searching and sending an inquiry is free, with no account needed.',
	not: [
		'A list of BPO websites',
		'A generic business directory',
		'A job board',
		'A social network',
		'A lead marketplace',
	],
}

const discoveryLayers: { title: string, statement: string, items: DiscoveryLayer[] } = {
	title: 'Two connected discovery layers',
	statement: 'Most directories organize companies. BPO Profile organizes the company and the people behind it.',
	items: [
		{
			icon: 'light-building',
			title: 'Company discovery',
			lede: 'Find the right BPO provider.',
			text: 'Every company profile works like a small professional website: services, industries, locations, capabilities, certifications, and the sales team that represents it.',
			link: { label: 'Browse BPO Profiles', to: '/companies' },
		},
		{
			icon: 'light-user-friends',
			title: 'People discovery',
			lede: 'Find the right sales professional.',
			text: 'Sales executives and business development professionals have their own profiles, tied to their company, with their expertise, markets served, languages, and time zone.',
			link: { label: 'Meet Sales Pros', to: '/professionals' },
		},
	],
}

const mission = 'Make it easier for businesses to discover the right BPO company and connect with the right person.'
const vision = 'To become the professional discovery and networking layer of the global BPO industry.'
const purpose = 'BPO Profile exists to make BPO discovery more accessible, transparent, and human — giving companies and their sales professionals greater visibility, and buyers a direct path to the right conversation.'
const promise = 'Discover the company. Meet the people. Start the conversation.'

// Meaningful badges only (docs/PLAN.md §4.6). None is decorative, and
// none implies another.
const trustIntro = {
	title: 'What our badges mean',
	text: 'Every badge records a specific check. None is decorative, and none implies another: a claimed listing isn’t automatically verified, and verification doesn’t publish a profile.',
	bought: 'No plan can buy these badges. They are earned the same way by every company and sales professional.',
}

const trustBadges: TrustBadgeInfo[] = [
	{
		key: 'claimed',
		label: 'Claimed',
		icon: 'light-shield',
		tone: 'slate',
		applies_to: 'Companies',
		means: 'A signed-in company admin controls this listing.',
		does_not_mean: 'That we’ve verified the company’s identity. Claiming and verification are separate reviews.',
	},
	{
		key: 'verified-company',
		label: 'Verified company',
		icon: 'light-check-circle',
		tone: 'brand',
		applies_to: 'Companies',
		means: 'Our team reviewed the company’s legal and website identity.',
		does_not_mean: 'An endorsement or a rating. It doesn’t cover service quality or the company’s own claims, such as client testimonials.',
	},
	{
		key: 'verified-professional',
		label: 'Verified professional',
		icon: 'light-user-check',
		tone: 'brand',
		applies_to: 'Sales professionals',
		means: 'Our team confirmed the person belongs to the company they represent.',
		does_not_mean: 'A rating of their work. Confirming an email address at sign-in doesn’t earn this badge.',
	},
	{
		key: 'complete',
		label: 'Profile complete',
		icon: 'light-clipboard-check',
		tone: 'success',
		applies_to: 'Companies and sales professionals',
		means: 'The profile scores 80% or more on our completeness check — things like a logo or photo, an overview, services, locations, and a way to get in touch.',
		does_not_mean: 'That the profile has been verified or checked for accuracy.',
	},
]

// Featured placements are Phase 2 (docs/PLAN.md §4.6).
const featuredBadge: UpcomingBadgeInfo = {
	label: 'Featured',
	icon: 'light-star',
	tone: 'warning',
	status: 'Arrives later',
	means: 'A paid or editorially selected placement. When featured placements launch, they will always carry this label and never skip the ranking rules below.',
}

const rankingIntro = {
	title: 'How results are ranked',
	text: 'Every search uses the same order, for every company and on every plan. Each step only comes into play when results are tied on the steps before it.',
}

const rankingPriorities: RankingPriority[] = [
	{ title: 'Relevance', text: 'How well a profile matches your search terms and the filters you chose.' },
	{ title: 'Profile completeness', text: 'Complete profiles give you more to evaluate, so they come before thin ones.' },
	{ title: 'Verification', text: 'Profiles our team has verified come before profiles that haven’t been reviewed yet.' },
	{ title: 'Location and service match', text: 'How closely a provider’s locations and services match what you asked for.' },
	{ title: 'Quality signals', text: 'Usable images, substantive profile copy, and valid contact information.' },
	{ title: 'Premium visibility', text: 'A final, disclosed tie-breaker between results that are equal on everything above. It never overrides them.', tie_breaker: true },
]

const rankingNotes = [
	'If results are still tied after all six, a stable record order keeps them consistent from one visit to the next.',
	'Sorting by newest or by name is always your choice, and it never skips filters or visibility rules.',
	'Premium visibility isn’t switched on yet. When it is, it will only separate results that tie on everything else.',
]

const accessibility = {
	title: 'Accessibility is part of the experience',
	text: 'BPO Profile should work for everyone who uses it — buyers, company teams, and sales professionals alike. Accessibility isn’t a separate checklist for us; it is how we build every page. We’re building BPO Profile so that:',
	points: [
		'Every page works with a keyboard, with a visible focus outline',
		'Forms have visible labels, clear instructions, and specific error messages',
		'Text and controls keep strong contrast against their background',
		'Badges and statuses always use words or icons, never color alone',
		'Meaningful images have descriptive alt text, and decorative ones stay silent',
		'Layouts adapt to phones, tablets, and larger text sizes',
	],
	contact: 'Found something that doesn’t work for you?',
}

const aboutCta = {
	buyers: {
		title: 'Looking for a BPO?',
		text: 'Search by service, industry, and location, then contact the right person directly.',
	},
	providers: {
		title: 'Run a BPO?',
		text: 'Put your company and your team in front of the businesses looking for what you offer.',
	},
}

export {
	aboutIntro,
	coreConcept,
	positioning,
	discoveryLayers,
	mission,
	vision,
	purpose,
	promise,
	trustIntro,
	trustBadges,
	featuredBadge,
	rankingIntro,
	rankingPriorities,
	rankingNotes,
	accessibility,
	aboutCta,
}
