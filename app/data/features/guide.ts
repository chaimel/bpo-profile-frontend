// Copy for /static/guide, which investors and other reviewers read before
// exploring the static demo. Part 1 is the business: every statement comes
// from the project brief (docs/BPO Profile.pdf, pages cited) or the product
// plan (docs/PLAN.md), and there are no figures, because neither document
// has any. Part 2 is the demo: every claim matches how the pages behave
// today (their stand-ins are commented in app/pages); update it with them.
// Tour stops use the same sample records as ~/data/features/sitemap.
import type {
	GuideAudience,
	GuideFact,
	GuideGoal,
	GuideLink,
	GuidePhase,
	GuidePoint,
	GuideRisk,
	GuideTour,
} from '~/types/features/guide'

const guideIntro = {
	title: 'A guide to BPO Profile',
	lede: 'What BPO Profile is for, who it serves, how it makes money and where it’s going, followed by a hands-on tour of the product. The demo runs on sample data, so every screen opens without an account, including the provider dashboard and the admin tools.',
}

// --- Part 1: the business -------------------------------------

// The goal, the problem and the approach (PDF pp. 2, 8–9).
const goalIntro = {
	label: 'Part 1 · The business',
	title: 'The goal',
	statement: 'A trusted professional network for the global outsourcing industry, where businesses discover, evaluate and connect with BPO providers and the people who build those business relationships.',
}

const goalPoints: GuidePoint[] = [
	{
		title: 'The problem',
		text: 'Visibility in the BPO industry is fragmented, and trustworthy providers are hard to discover. A business looking for a partner searches the open web, compares providers by hand, and still has to work out who to talk to.',
	},
	{
		title: 'The approach',
		text: 'Inspired by the discovery and connection experience of platforms like Zocdoc, BPO Profile helps a business find the right provider and contact the right sales representative directly, without unnecessary barriers in between.',
	},
	{
		title: 'The difference',
		text: 'Most directories organize companies. BPO Profile organizes the company and the people behind it, so a provider’s page introduces the sales professionals who represent it.',
	},
	{
		title: 'More than a directory',
		text: 'It’s a visibility and lead-generation platform, built to help BPO companies strengthen their online presence and search visibility, generate qualified business opportunities, and become easier for clients worldwide to find.',
	},
]

// The journey everything supports (PDF p. 42).
const northStar: GuidePoint[] = [
	{ title: 'Discover', text: 'Find relevant BPO companies and professionals.' },
	{ title: 'Understand', text: 'Explore capabilities, services, industries, locations and expertise.' },
	{ title: 'Connect', text: 'Reach the right sales professional.' },
	{ title: 'Opportunity', text: 'Turn discovery into meaningful business conversations.' },
]

// The three sides and what each needs (PDF p. 13, docs/PLAN.md §2).
const audiencesIntro = {
	title: 'Who it’s for',
	text: 'Three groups meet on BPO Profile. Buyers bring the demand, BPO companies bring the supply, and their sales professionals are the people who turn a listing into a conversation.',
	keeper: 'Behind all three, the BPO Profile team reviews listings, verifies companies and people, and maintains the categories search runs on.',
}

const audiences: GuideAudience[] = [
	{
		icon: 'light-search',
		title: 'Buyers',
		who: 'Businesses looking for customer support, contact center, back-office, technology or other outsourcing.',
		terms: 'Free, no account needed',
		needs: [
			'Find qualified providers without searching the whole internet',
			'Compare services, industries, locations and capabilities',
			'Reach the right person and start a conversation quickly',
		],
		promise: 'We’ll help you find the right provider and the right person to talk to.',
	},
	{
		icon: 'light-building',
		title: 'BPO companies',
		who: 'Outsourcing providers of every size and specialty, represented by their owners and marketing or operations leads.',
		terms: 'Free Basic listing, paid plans for more',
		needs: [
			'Be found by the businesses looking for what they offer',
			'Show their services, locations, certifications and team',
			'Turn profile visits into qualified inquiries',
		],
		promise: 'Put your BPO company and your team in front of the businesses looking for what you offer.',
	},
	{
		icon: 'light-user-friends',
		title: 'Sales professionals',
		who: 'The sales executives and business development representatives who work for those companies.',
		terms: 'Free profile, linked to their company',
		needs: [
			'A professional presence of their own',
			'To be found by expertise, market, language and location',
			'Inquiries that come to them directly',
		],
		promise: 'Build your professional presence and become easier for potential clients to find.',
	},
]

// Freemium listings (PDF pp. 4–5, 37; docs/PLAN.md §4.7). The plans
// themselves come from ~/data/features/pricing, so this never drifts
// from /pricing.
const modelIntro = {
	title: 'How it makes money',
	text: 'A freemium listing model. Free listings build the directory, and the directory brings in buyers. Paid plans sell extra visibility and insight to the companies that want more of both.',
	note: 'Online checkout comes in a later phase. Until then, the BPO Profile team sets up paid plans by hand.',
	rules_title: 'What money can’t buy',
}

const modelRules: GuideFact[] = [
	{
		icon: 'light-balance-scale',
		title: 'A higher ranking',
		text: 'Premium visibility only separates results that tie on everything else, and it’s disclosed.',
	},
	{
		icon: 'light-shield',
		title: 'A badge',
		text: 'Claimed, Verified and Profile complete are earned the same way on every plan.',
	},
	{
		icon: 'light-star',
		title: 'An unlabeled spot',
		text: 'When featured placements launch, they will always say Featured and still follow the ranking rules.',
	},
]

// How supply and demand feed each other (PDF pp. 35–36; docs/PLAN.md
// §7, §10). The claim that ends the loop is the brief's: a profile should
// be an asset companies want to claim, maintain and share.
const growthIntro = {
	title: 'How it grows',
	text: 'Supply and demand feed each other. Listings bring buyers through search, buyers’ inquiries make listings worth claiming, and claimed profiles get completed and shared.',
	loop: 'Then round again: more complete profiles rank better, and bring in more buyers.',
}

const growthSteps: GuidePoint[] = [
	{
		title: 'Seed the directory',
		text: 'BPO Profile can list a company from public information before anyone there signs up, so buyers find a useful directory from the first day.',
	},
	{
		title: 'Be found in search',
		text: 'Every company and sales professional has its own page, with the titles, descriptions and structured data search engines read. Service, industry and location pages lead buyers to them.',
	},
	{
		title: 'Turn visits into inquiries',
		text: 'Every page leads to a next step, from a profile to its sales team to a contact form. Views, clicks and inquiries are counted for each provider.',
	},
	{
		title: 'Worth claiming and sharing',
		text: 'A profile that brings in inquiries becomes an asset companies want to claim, keep complete and share, and every share brings in more buyers.',
	},
]

// Four phases (docs/PLAN.md §8). The demo's screens are Phase 1. `later`
// is the brief's longer-term room to grow (PDF pp. 25–26, 41), minus what
// the phases already name.
const roadmapIntro = {
	title: 'Roadmap',
	text: 'Four phases, each building on the one before. Every screen in this demo belongs to Phase 1: the directory, and the minimum workflows needed to launch it publicly.',
	later: 'Further out, the brand leaves room for industry intelligence, events and community, jobs and talent, intelligent matching, and integrations with CRM and scheduling tools, introduced one at a time rather than all at once.',
	current: 'The screens in this demo',
}

const roadmapPhases: GuidePhase[] = [
	{
		name: 'Phase 1',
		title: 'Directory and public launch',
		current: true,
		items: [
			'Search, directories, and company and sales profiles',
			'Inquiries and quote requests',
			'Company and sales dashboards',
			'Claims, verification and team invitations',
			'Moderation, completeness and fair ranking',
			'Basic analytics and hand-assigned plans',
		],
	},
	{
		name: 'Phase 2',
		title: 'Content, growth and deeper analytics',
		items: [
			'Resources: buyer guides, industry insights and company stories',
			'Landing pages built from real listings',
			'Featured placements, always labeled',
			'Analytics breakdowns and trends',
			'Profile reports and a moderation queue',
		],
	},
	{
		name: 'Phase 3',
		title: 'Monetization',
		items: [
			'Online checkout and billing',
			'Plan benefits applied automatically',
			'Premium slots on the home page and directories',
			'Seats, media and analytics by plan',
			'An optional Pro listing for sales professionals',
		],
	},
	{
		name: 'Phase 4',
		title: 'Networking layer',
		items: [
			'Buyer accounts and saved profiles',
			'Messaging and meeting scheduling',
			'Provider comparison, requests for quotes and reviews',
			'CRM-style lead tools',
		],
	},
]

// What launch success means (docs/PLAN.md §1), each shown in the demo.
const launchIntro = {
	title: 'Launch is a success when',
}

const launchGoals: GuideGoal[] = [
	{
		text: 'A buyer can search, evaluate a company, meet its sales team and send an inquiry, without creating an account.',
		link: { label: 'Take the buyer tour', to: '#tour-buyer' },
	},
	{
		text: 'A BPO company can register, complete its profile and add its sales professionals.',
		link: { label: 'Take the company tour', to: '#tour-provider' },
	},
	{
		text: 'A sales professional can have a dedicated public profile, affiliated with their company.',
		link: { label: 'See a sales pro profile', to: '/professionals/ana-reyes' },
	},
	{
		text: 'A company can claim its existing listing, and the BPO Profile team verifies companies and people by hand.',
		link: { label: 'Take the claim tour', to: '#tour-claim' },
	},
	{
		text: 'Paid listing plans exist as a product, even before online payment ships.',
		link: { label: 'See the listing plans', to: '/pricing' },
	},
]

// The risks the plan names (docs/PLAN.md §11), each with the rule in the
// product that guards against it.
const risksIntro = {
	title: 'Risks we design against',
	text: 'A directory lives or dies on trust. These are the ways BPO Profile could go wrong, and the rule in the product that guards against each one.',
}

const risks: GuideRisk[] = [
	{
		risk: 'Paid placement passes for the best result',
		safeguard: 'Premium visibility is only the final, disclosed tie-breaker, and featured placements will always be labeled.',
		link: { label: 'How results are ranked', to: '/about#ranking' },
	},
	{
		risk: 'Thin profiles crowd out complete ones',
		safeguard: 'Completeness is the second ranking signal after relevance, and the dashboard shows providers what’s left to add.',
		link: { label: 'The dashboard checklist', to: '/dashboard' },
	},
	{
		risk: 'Sales professionals become an afterthought',
		safeguard: 'They get their own directory, their own page and their own contact button, not just a line on the company profile.',
		link: { label: 'The Sales Pros directory', to: '/professionals' },
	},
	{
		risk: 'Someone claims a company they don’t represent',
		safeguard: 'The BPO Profile team reviews every claim, and ownership only changes once the claimant accepts an emailed link.',
		link: { label: 'Claims in the admin', to: '/admin/claims' },
	},
	{
		risk: 'Search pages fill up with empty or duplicate content',
		safeguard: 'Browse pages never link to an empty results page, and combined landing pages will only be built from real listings.',
		link: { label: 'The industries index', to: '/industries' },
	},
]

// --- Part 2: the demo -----------------------------------------

const demoIntro = {
	label: 'Part 2 · The demo',
	text: 'Now see it working: how the preview behaves, the four areas of the product, and four guided tours.',
}

const factsIntro = {
	title: 'How the demo works',
	text: 'It looks and behaves like the product, but it isn’t connected to a server yet. Six things to know before you click around:',
}

const guideFacts: GuideFact[] = [
	{
		icon: 'light-sign-in',
		title: 'No sign-in wall',
		text: 'Every screen opens straight from a link, including the provider dashboard and the admin tools. In the finished product, both require signing in.',
	},
	{
		icon: 'light-keyboard',
		title: 'Any details work',
		text: 'Sign-in accepts any email and password, then any six-digit code. Forms still check what you type, the way they will for real users.',
	},
	{
		icon: 'light-paper-plane',
		title: 'Nothing is sent or saved',
		text: 'Forms show what happens when they succeed, but nothing leaves your browser. Refreshing a page puts it back the way it was.',
	},
	{
		icon: 'light-user-friends',
		title: 'The companies and people are fictional',
		text: 'Every company, person and inquiry is sample data written for this preview. Their web and email addresses use reserved .example domains.',
	},
	{
		icon: 'light-chart-bar',
		title: 'The numbers are placeholders',
		text: 'Profile views, inquiry counts, rates and menu badges are sample figures that show the layout. They aren’t traffic or traction.',
	},
	{
		icon: 'light-alarm-clock',
		title: 'Some features are marked for later',
		text: 'Anything labeled Coming later or Arrives later, such as featured placements, is planned for a later phase and isn’t built yet.',
	},
]

const areasIntro = {
	title: 'Four areas, four kinds of user',
	text: 'The demo covers everyone who uses BPO Profile. Each area has its own frame, so you can always tell where you are. The menus below are live: click any item to open that screen.',
}

// The chain a new provider goes through, shown in the Joining area.
const joinFlow: GuideLink[] = [
	{ label: 'Get Listed', to: '/register?type=company' },
	{ label: 'Sign in', to: '/login' },
	{ label: 'Enter the emailed code', to: '/login?state=verify' },
	{ label: 'Set up your account', to: '/onboarding' },
	{ label: 'Your dashboard', to: '/dashboard' },
]

const toursIntro = {
	title: 'Guided tours',
	text: 'Four short routes through the product, one for each kind of user. Every stop opens a real screen; your browser’s back button brings you back here.',
}

const guideTours: GuideTour[] = [
	{
		id: 'tour-buyer',
		role: 'As a buyer',
		title: 'Find a provider and get in touch',
		text: 'Buyers never need an account. Follow one from the first search to a sent inquiry.',
		stops: [
			{
				title: 'Home',
				to: '/',
				text: 'Start where buyers start: search from the hero, or jump in through a popular service.',
			},
			{
				title: 'Find a BPO',
				to: '/find?service=customer-support',
				text: 'Results for Customer Support. Narrow them by industry, location, company size, language or work model, and change the sort.',
			},
			{
				title: 'Company profile',
				to: '/companies/northshore-cx',
				text: 'Northshore CX reads like a small website: services, locations, certifications, and badges that say exactly what BPO Profile checked.',
			},
			{
				title: 'The sales team',
				to: '/companies/northshore-cx#team',
				text: 'Every company introduces the people who represent it. Open a card to meet one.',
			},
			{
				title: 'Sales pro profile',
				to: '/professionals/ana-reyes',
				text: 'Ana Reyes’s own page: her expertise, the markets she serves, her languages and her time zone.',
			},
			{
				title: 'Send an inquiry',
				to: '/professionals/ana-reyes#contact',
				text: 'Choose Contact, Ask a question or Request a quote, then send it. The confirmation appears, and nothing is sent.',
				hint: 'Use any name, an email like name@company.com, and a message of at least 10 characters.',
			},
		],
	},
	{
		id: 'tour-provider',
		role: 'As a BPO company',
		title: 'Get listed and run the profile',
		text: 'Create an account and sign in, then manage Northshore CX as its owner, Ana Reyes.',
		stops: [
			{
				title: 'Get Listed',
				to: '/register?type=company',
				text: 'Choose how you’ll use BPO Profile and create the account. It starts signed out; the code emailed at the first sign-in confirms the address.',
				hint: 'Any name and email work. The password needs at least 12 characters.',
			},
			{
				title: 'Sign in',
				to: '/login',
				text: 'Every sign-in takes a password or Google first, then a six-digit code from the inbox.',
				hint: 'Enter any email and password, then any six digits.',
			},
			{
				title: 'Dashboard',
				to: '/dashboard',
				text: 'Ana’s overview: her company, key stats, recent inquiries, and a checklist of what’s left to complete.',
			},
			{
				title: 'Company profile',
				to: '/dashboard/companies/10',
				text: 'Edit what buyers see. The status panel at the top says whether the listing is public.',
			},
			{
				title: 'Team',
				to: '/dashboard/companies/10/team',
				text: 'Invite colleagues, answer requests to join, and edit the team’s profiles.',
			},
			{
				title: 'Inquiries',
				to: '/dashboard/companies/10/inquiries',
				text: 'The shared inbox for every contact, question and quote request the company receives.',
			},
			{
				title: 'Stats',
				to: '/dashboard/companies/10/stats',
				text: 'How buyers found and contacted the company. The figures are samples.',
			},
		],
	},
	{
		id: 'tour-claim',
		role: 'As a BPO taking over its listing',
		title: 'Claim an existing listing',
		text: 'BPO Profile can list a company from public information before anyone there signs up. Here, someone from Kingston Voice Partners claims theirs.',
		stops: [
			{
				title: 'The unclaimed listing',
				to: '/companies/kingston-voice-partners',
				text: 'An unclaimed listing says so, and offers a Claim This Profile link.',
			},
			{
				title: 'Ask to claim it',
				to: '/claim?company=kingston-voice-partners&state=ready',
				text: 'A signed-in account with a verified email sends the request. Nothing about the listing changes yet.',
				hint: 'Tick the box to confirm you represent the company, then submit.',
			},
			{
				title: 'The team reviews it',
				to: '/admin/claims?claim=45',
				text: 'A platform admin checks who’s asking, then approves or rejects. Approval emails the claimant a link; it doesn’t make them the owner.',
			},
			{
				title: 'Accept the emailed link',
				to: '/claim/sample-token',
				text: 'The approved claimant opens the link while signed in and accepts. Only then do they own the listing.',
			},
		],
	},
	{
		id: 'tour-admin',
		role: 'As the BPO Profile team',
		title: 'Keep the directory trustworthy',
		text: 'Platform admins publish listings, verify identities and look after the lists search runs on.',
		stops: [
			{
				title: 'Admin overview',
				to: '/admin',
				text: 'Every queue waiting for a decision, each opening the list it counts.',
			},
			{
				title: 'A listing in review',
				to: '/admin/companies/31',
				text: 'Pacific Rim Support asked for review. Publish it, verify it and set its plan; each decision saves on its own.',
			},
			{
				title: 'Affiliations to confirm',
				to: '/admin/professionals?status=affiliation_pending',
				text: 'Sales pros waiting for confirmation that they work where they say. Affiliation, publication and verification are separate decisions.',
			},
			{
				title: 'Claims',
				to: '/admin/claims',
				text: 'Every request to take over a listing, by status.',
			},
			{
				title: 'Taxonomies',
				to: '/admin/taxonomies/services',
				text: 'The services, industries, capabilities, languages and technologies providers choose from and buyers filter by.',
			},
			{
				title: 'Users',
				to: '/admin/users',
				text: 'Every account, with its role and company memberships.',
			},
		],
	},
]

const statesIntro = {
	title: 'See every state of a screen',
	text: 'Real screens change with their data: an inbox is empty, a save fails, a listing waits for review. While the demo runs on sample data, adding ?state= to an address shows each of those states. The sitemap lists them all.',
}

const stateExamples: GuideLink[] = [
	{ label: 'A search that failed to load', to: '/find?state=error' },
	{ label: 'A listing waiting for review', to: '/dashboard/companies/10?state=pending_review' },
	{ label: 'An empty company inbox', to: '/dashboard/companies/10/inquiries?state=empty' },
	{ label: 'A sign-in code that expired', to: '/login?state=expired' },
	{ label: 'An invitation opened by the wrong account', to: '/invitations/sample-token?state=wrong-account' },
]

const guideCta = {
	title: 'Every screen on one page',
	text: 'The sitemap lists every screen in the demo, with its address and a link to each of its states.',
}

export {
	guideIntro,
	goalIntro,
	goalPoints,
	northStar,
	audiencesIntro,
	audiences,
	modelIntro,
	modelRules,
	growthIntro,
	growthSteps,
	roadmapIntro,
	roadmapPhases,
	launchIntro,
	launchGoals,
	risksIntro,
	risks,
	demoIntro,
	factsIntro,
	guideFacts,
	areasIntro,
	joinFlow,
	toursIntro,
	guideTours,
	statesIntro,
	stateExamples,
	guideCta,
}
