// Home page copy (PDF pp. 18, 32–35; docs/PLAN.md §4.1). Directory
// counts on the page are computed from the directory data, never typed in.
import type { ContentPoint, ContentStep } from '~/types/features/content'

const hero = {
	title: 'Find the right BPO.',
	accent: 'Meet the right people.',
	lede: 'Explore BPO companies, services, industries, locations, and sales professionals — all in one professional network.',
	prompt: 'What kind of BPO partner are you looking for?',
}

// The key differentiator: two connected discovery layers (PDF p. 6).
const layers = {
	statement: 'Most directories organize companies. BPO Profile organizes the company and the people behind it.',
	company: {
		title: 'Company discovery',
		lede: 'Find the right BPO provider.',
		points: [
			'Search by service, industry, location, size, language, and work model',
			'Profiles that read like a small professional website',
			'Services, capabilities, locations, and certifications in one place',
		],
	},
	people: {
		title: 'People discovery',
		lede: 'Find the right sales professional.',
		points: [
			'Every company shows the team that represents it',
			'Profiles with expertise, markets served, languages, and time zone',
			'Contact the person directly — no gatekeeping forms',
		],
	},
}

const pillars: ContentPoint[] = [
	{ icon: 'light-search', title: 'Discovery', text: 'Find the right BPO without searching the entire internet.' },
	{ icon: 'light-user-friends', title: 'Connection', text: 'Go beyond the company profile and connect with the person behind it.' },
	{ icon: 'light-shield', title: 'Trust', text: 'Know who you’re contacting and what they offer.' },
	{ icon: 'light-comments', title: 'Opportunity', text: 'Every profile can become a business conversation.' },
]

// The north-star journey (PDF p. 39).
const steps: ContentStep[] = [
	{ title: 'Discover', text: 'Search BPO companies and sales professionals by what you need.' },
	{ title: 'Understand', text: 'Compare services, industries, locations, capabilities, and expertise.' },
	{ title: 'Connect', text: 'Reach the right person with a question, a message, or a quote request.' },
	{ title: 'Opportunity', text: 'Turn a good match into a real business conversation.' },
]

const getListed = {
	title: 'Put your company in front of businesses looking for outsourcing partners.',
	text: 'Create a free company profile, add your sales team, and receive inquiries in your dashboard. Already listed? Claim your profile to take control of it.',
	professionals: {
		title: 'Sales and business development professional?',
		text: 'Build your professional presence and become easier to discover.',
	},
}

export {
	hero,
	layers,
	pillars,
	steps,
	getListed,
}
