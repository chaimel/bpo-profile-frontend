// Every screen in the static demo, for /static/sitemap and the guide.
// Groups follow each area's own navigation (primaryNav, dashboardNav,
// adminNav in ~/data/features/session). Dynamic routes open a sample
// record from the seed data: Northshore CX (id 10), the company Ana Reyes
// owns and the dashboard signs her into; Kingston Voice Partners, the one
// unclaimed listing; and, in the admin, Pacific Rim Support (31), a
// listing waiting for review. Token routes accept any value.
//
// States are the ?state= previews each page file reads (see its
// comments), plus tabs and sample records in other statuses. Keep this
// list in step with app/pages when routes or previews change.
import type { SitemapArea } from '~/types/features/guide'

const sitemapIntro = {
	title: 'Sitemap',
	lede: 'Every screen in the BPO Profile demo, grouped by who uses it. Screens that show one record open on a sample, and the links under each screen open its other states.',
}

const sitemapAreas: SitemapArea[] = [
	{
		id: 'public',
		title: 'Public directory',
		audience: 'Buyers looking for an outsourcing partner. No account needed.',
		summary: 'Search and browse BPO companies and the sales professionals who represent them, then send one of them an inquiry.',
		icon: 'light-search',
		shell: 'site',
		recognize: 'The white header with the main menu, and the slate footer.',
		groups: [
			{
				label: 'Search and profiles',
				screens: [
					{
						title: 'Home',
						path: '/',
						to: '/',
						summary: 'The front door: the hero search, popular services, industries and locations, how it works, and the invitation to get listed.',
					},
					{
						title: 'Find a BPO',
						path: '/find',
						to: '/find',
						summary: 'Keyword search with filters for service, industry, location, company size, capabilities, work model, language and technology.',
						states: [
							{ label: 'Failed search', to: '/find?state=error' },
						],
					},
					{
						title: 'BPO Profiles',
						path: '/companies',
						to: '/companies',
						summary: 'The company directory, filtered by service, industry and country.',
					},
					{
						title: 'Company profile',
						path: '/companies/[slug]',
						to: '/companies/northshore-cx',
						sample: 'Northshore CX',
						summary: 'Reads like a small website: services, locations, certifications, trust badges, the sales team, and a contact form.',
						states: [
							{ label: 'Unclaimed listing', to: '/companies/kingston-voice-partners' },
						],
					},
					{
						title: 'Sales Pros',
						path: '/professionals',
						to: '/professionals',
						summary: 'The directory of sales and business development professionals.',
					},
					{
						title: 'Sales pro profile',
						path: '/professionals/[slug]',
						to: '/professionals/ana-reyes',
						sample: 'Ana Reyes',
						summary: 'One person’s expertise, markets served, languages and time zone, their company, and ways to contact them.',
					},
				],
			},
			{
				label: 'Browse',
				screens: [
					{
						title: 'Services',
						path: '/services',
						to: '/services',
						summary: 'Every service, with how many companies and sales pros offer it.',
					},
					{
						title: 'Industries',
						path: '/industries',
						to: '/industries',
						summary: 'The industries providers serve, each linking to matching companies and people.',
					},
					{
						title: 'Locations',
						path: '/locations',
						to: '/locations',
						summary: 'Countries, regions and cities that have providers.',
					},
				],
			},
			{
				label: 'About BPO Profile',
				screens: [
					{
						title: 'Pricing',
						path: '/pricing',
						to: '/pricing',
						summary: 'Listing plans for BPO companies. Basic is free, and benefits that aren’t built yet are marked Coming later. The six-tier preview adds sample plans to show how the page handles more.',
						states: [
							{ label: 'Six-tier preview', to: '/pricing?state=expanded' },
						],
					},
					{
						title: 'About',
						path: '/about',
						to: '/about',
						summary: 'The product story, what each badge means, and how search results are ranked.',
					},
					{
						title: 'Contact us',
						path: '/contact',
						to: '/contact',
						summary: 'A message form for the BPO Profile team.',
						states: [
							{ label: 'Message sent', to: '/contact?state=sent' },
							{ label: 'Failed send', to: '/contact?state=error' },
						],
					},
					{
						title: 'Terms of use',
						path: '/terms',
						to: '/terms',
						summary: 'Draft terms, written for review and not yet approved by counsel.',
					},
					{
						title: 'Privacy policy',
						path: '/privacy',
						to: '/privacy',
						summary: 'Draft privacy policy, written for review and not yet approved by counsel.',
					},
				],
			},
		],
	},
	{
		id: 'joining',
		title: 'Joining and signing in',
		audience: 'BPO companies and sales professionals creating an account, signing in, or taking over a listing.',
		summary: 'Registration, a two-step sign-in that ends with an emailed code, first-time setup, and the claim and invitation links providers receive by email.',
		icon: 'light-sign-in',
		shell: 'auth',
		recognize: 'Sign-in screens open beside a slate panel. Claim and invitation pages keep the public header.',
		groups: [
			{
				label: 'Create an account',
				screens: [
					{
						title: 'Get Listed',
						path: '/register',
						to: '/register?type=company',
						summary: 'One form, three paths: list a company, create a sales profile, or open an account to accept a claim or an invitation.',
						states: [
							{ label: 'Sales profile path', to: '/register?type=professional' },
							{ label: 'Account only', to: '/register?type=account' },
							{ label: 'Account created', to: '/register?state=created' },
						],
					},
					{
						title: 'Set up your account',
						path: '/onboarding',
						to: '/onboarding',
						summary: 'For a new Google account: create a company, or join one as a sales professional.',
						states: [
							{ label: 'Waiting for review', to: '/onboarding?state=pending' },
							{ label: 'Already set up', to: '/onboarding?state=complete' },
						],
					},
				],
			},
			{
				label: 'Sign in',
				screens: [
					{
						title: 'Sign in',
						path: '/login',
						to: '/login',
						summary: 'Email and password, or Google, then a six-digit code sent by email.',
						states: [
							{ label: 'Enter the code', to: '/login?state=verify' },
							{ label: 'Wrong details', to: '/login?state=error' },
							{ label: 'Wrong code', to: '/login?state=code-error' },
							{ label: 'Code expired', to: '/login?state=expired' },
							{ label: 'Google linked', to: '/login?state=linked' },
						],
					},
					{
						title: 'Check your email',
						path: '/login/verify',
						to: '/login/verify',
						summary: 'Where Google sign-in lands: the same emailed-code step, on its own address.',
						states: [
							{ label: 'Wrong code', to: '/login/verify?state=code-error' },
							{ label: 'First Google sign-in', to: '/login/verify?account=new' },
						],
					},
					{
						title: 'Forgot password',
						path: '/forgot-password',
						to: '/forgot-password',
						summary: 'Ask for a password reset link.',
						states: [
							{ label: 'Link sent', to: '/forgot-password?state=sent' },
						],
					},
					{
						title: 'Reset password',
						path: '/reset-password',
						to: '/reset-password?email=ana@northshore-cx.example',
						summary: 'The page a reset link opens, to choose a new password.',
						states: [
							{ label: 'Password updated', to: '/reset-password?state=updated' },
							{ label: 'Expired link', to: '/reset-password?state=invalid' },
						],
					},
				],
			},
			{
				label: 'Claims and invitations',
				screens: [
					{
						title: 'Claim your profile',
						path: '/claim',
						to: '/claim',
						summary: 'Find an unclaimed listing and ask to take it over.',
						states: [
							{ label: 'Listing chosen', to: '/claim?company=kingston-voice-partners' },
							{ label: 'Signed in', to: '/claim?company=kingston-voice-partners&state=ready' },
							{ label: 'Request sent', to: '/claim?company=kingston-voice-partners&state=submitted' },
						],
					},
					{
						title: 'Accept a claim',
						path: '/claim/[token]',
						to: '/claim/sample-token',
						sample: 'an approved claim for Kingston Voice Partners',
						summary: 'The emailed link an approved claimant opens. Accepting it is what makes them the owner.',
						states: [
							{ label: 'Signed out', to: '/claim/sample-token?state=signed-out' },
							{ label: 'Wrong account', to: '/claim/sample-token?state=wrong-account' },
							{ label: 'Accepted', to: '/claim/sample-token?state=accepted' },
							{ label: 'Invalid link', to: '/claim/sample-token?state=invalid' },
						],
					},
					{
						title: 'Accept an invitation',
						path: '/invitations/[token]',
						to: '/invitations/sample-token',
						sample: 'Miguel Ramos’s invitation to Northshore CX',
						summary: 'The emailed link a colleague opens to join their company’s team.',
						states: [
							{ label: 'Signed out', to: '/invitations/sample-token?state=signed-out' },
							{ label: 'Wrong account', to: '/invitations/sample-token?state=wrong-account' },
							{ label: 'Accepted', to: '/invitations/sample-token?state=accepted' },
							{ label: 'Invalid link', to: '/invitations/sample-token?state=invalid' },
						],
					},
				],
			},
		],
	},
	{
		id: 'dashboard',
		title: 'Provider dashboard',
		audience: 'Company owners and admins, and their sales professionals. You’re signed in as Ana Reyes, who owns Northshore CX and has her own sales profile.',
		summary: 'Edit the company listing, manage the team, answer inquiries, and see how buyers found you.',
		icon: 'light-building',
		shell: 'dashboard',
		recognize: 'A slate sidebar with the company switcher at the top, and the company’s listing status in the top bar.',
		groups: [
			{
				label: 'Overview',
				screens: [
					{
						title: 'Overview',
						path: '/dashboard',
						to: '/dashboard',
						summary: 'Ana’s home: her company, key stats, recent inquiries, and a checklist of what’s left to complete.',
						states: [
							{ label: 'Quiet account', to: '/dashboard?state=empty' },
						],
					},
				],
			},
			{
				label: 'Company',
				screens: [
					{
						title: 'Company profile',
						path: '/dashboard/companies/[companyId]',
						to: '/dashboard/companies/10',
						sample: 'Northshore CX',
						summary: 'Edit what buyers see: the basics, logo and cover, company facts, and contact details.',
						states: [
							{ label: 'Draft', to: '/dashboard/companies/10?state=draft' },
							{ label: 'In review', to: '/dashboard/companies/10?state=pending_review' },
							{ label: 'Suspended', to: '/dashboard/companies/10?state=suspended' },
							{ label: 'Failed save', to: '/dashboard/companies/10?state=error' },
						],
					},
					{
						title: 'Services & expertise',
						path: '/dashboard/companies/[companyId]/services',
						to: '/dashboard/companies/10/services',
						summary: 'Services, industries, capabilities, languages, technologies and certifications: the terms buyers filter by.',
						states: [
							{ label: 'Nothing chosen', to: '/dashboard/companies/10/services?state=empty' },
							{ label: 'Failed save', to: '/dashboard/companies/10/services?state=error' },
						],
					},
					{
						title: 'Locations',
						path: '/dashboard/companies/[companyId]/locations',
						to: '/dashboard/companies/10/locations',
						summary: 'Where the company operates, and which site is its headquarters.',
						states: [
							{ label: 'No locations', to: '/dashboard/companies/10/locations?state=empty' },
							{ label: 'No headquarters', to: '/dashboard/companies/10/locations?state=no-hq' },
							{ label: 'Failed save', to: '/dashboard/companies/10/locations?state=error' },
						],
					},
					{
						title: 'Team',
						path: '/dashboard/companies/[companyId]/team',
						to: '/dashboard/companies/10/team',
						summary: 'Members, requests to join, and invitations.',
						states: [
							{ label: 'Requests tab', to: '/dashboard/companies/10/team?tab=requests' },
							{ label: 'Invitations tab', to: '/dashboard/companies/10/team?tab=invitations' },
							{ label: 'Invite dialog', to: '/dashboard/companies/10/team?invite=90' },
							{ label: 'Empty team', to: '/dashboard/companies/10/team?state=empty' },
						],
					},
					{
						title: 'Team member',
						path: '/dashboard/companies/[companyId]/team/[professionalId]',
						to: '/dashboard/companies/10/team/44',
						sample: 'Luis Cruz',
						summary: 'Edit a colleague’s sales profile on the company’s behalf.',
						states: [
							{ label: 'Profile without a login', to: '/dashboard/companies/10/team/90' },
						],
					},
					{
						title: 'Inquiries',
						path: '/dashboard/companies/[companyId]/inquiries',
						to: '/dashboard/companies/10/inquiries',
						summary: 'The company’s shared inbox for contact, question and quote requests.',
						states: [
							{ label: 'Empty inbox', to: '/dashboard/companies/10/inquiries?state=empty' },
							{ label: 'Failed load', to: '/dashboard/companies/10/inquiries?state=error' },
						],
					},
					{
						title: 'Stats',
						path: '/dashboard/companies/[companyId]/stats',
						to: '/dashboard/companies/10/stats',
						summary: 'Profile views, inquiries, and the inquiry-to-view rate, shown with sample numbers.',
						states: [
							{ label: 'No activity', to: '/dashboard/companies/10/stats?state=empty' },
							{ label: 'Failed load', to: '/dashboard/companies/10/stats?state=error' },
						],
					},
				],
			},
			{
				label: 'Your sales profile',
				screens: [
					{
						title: 'My profile',
						path: '/dashboard/profile',
						to: '/dashboard/profile',
						summary: 'Ana edits her own sales profile.',
						states: [
							{ label: 'Draft', to: '/dashboard/profile?state=draft' },
							{ label: 'In review', to: '/dashboard/profile?state=pending_review' },
							{ label: 'Suspended', to: '/dashboard/profile?state=suspended' },
							{ label: 'Affiliation pending', to: '/dashboard/profile?state=pending' },
							{ label: 'Affiliation rejected', to: '/dashboard/profile?state=rejected' },
						],
					},
					{
						title: 'My inquiries',
						path: '/dashboard/inquiries',
						to: '/dashboard/inquiries',
						summary: 'Inquiries buyers sent to Ana directly.',
						states: [
							{ label: 'Empty inbox', to: '/dashboard/inquiries?state=empty' },
							{ label: 'Failed load', to: '/dashboard/inquiries?state=error' },
						],
					},
					{
						title: 'My stats',
						path: '/dashboard/stats',
						to: '/dashboard/stats',
						summary: 'Views and inquiries for Ana’s own profile, shown with sample numbers.',
						states: [
							{ label: 'No activity', to: '/dashboard/stats?state=empty' },
							{ label: 'Failed load', to: '/dashboard/stats?state=error' },
						],
					},
				],
			},
			{
				label: 'Account',
				screens: [
					{
						title: 'Account settings',
						path: '/dashboard/account',
						to: '/dashboard/account',
						summary: 'Name, email, password, Google sign-in, active sessions, and deleting the account.',
						states: [
							{ label: 'Requests fail', to: '/dashboard/account?state=error' },
							{ label: 'Google needs a fresh sign-in', to: '/dashboard/account?google=stale' },
						],
					},
				],
			},
		],
	},
	{
		id: 'admin',
		title: 'Platform admin',
		audience: 'The BPO Profile team. You’re signed in as Sam Rivera, a platform admin.',
		summary: 'Review and publish listings, verify companies and people, decide claims, and look after the lists search runs on.',
		icon: 'light-shield',
		shell: 'admin',
		recognize: 'A slate sidebar, and a Platform admin badge in the top bar.',
		groups: [
			{
				label: 'Overview',
				screens: [
					{
						title: 'Overview',
						path: '/admin',
						to: '/admin',
						summary: 'Review queues: everything waiting for a decision, each opening the list it counts.',
					},
				],
			},
			{
				label: 'Moderation',
				screens: [
					{
						title: 'Companies',
						path: '/admin/companies',
						to: '/admin/companies',
						summary: 'Every listing in any status, with search and status tabs.',
						states: [
							{ label: 'Waiting for review', to: '/admin/companies?status=pending_review' },
							{ label: 'Drafts', to: '/admin/companies?status=draft' },
							{ label: 'Suspended', to: '/admin/companies?status=suspended' },
							{ label: 'Deleted', to: '/admin/companies?status=deleted' },
						],
					},
					{
						title: 'Company',
						path: '/admin/companies/[id]',
						to: '/admin/companies/31',
						sample: 'Pacific Rim Support, waiting for review',
						summary: 'Moderation, verification, plan, ownership and team for one listing. Each decision saves on its own.',
						states: [
							{ label: 'Published', to: '/admin/companies/10' },
							{ label: 'Admin-created draft', to: '/admin/companies/30' },
							{ label: 'Suspended', to: '/admin/companies/32' },
						],
					},
					{
						title: 'Professionals',
						path: '/admin/professionals',
						to: '/admin/professionals',
						summary: 'Sales professionals across every company. Affiliation, publication and verification are separate decisions.',
						states: [
							{ label: 'Waiting for review', to: '/admin/professionals?status=pending_review' },
							{ label: 'Affiliation pending', to: '/admin/professionals?status=affiliation_pending' },
							{ label: 'Drafts', to: '/admin/professionals?status=draft' },
							{ label: 'Deleted', to: '/admin/professionals?status=deleted' },
						],
					},
					{
						title: 'Professional',
						path: '/admin/professionals/[id]',
						to: '/admin/professionals/94',
						sample: 'Sipho Dlamini, waiting for review',
						summary: 'Affiliation, moderation, verification and the linked account for one person.',
						states: [
							{ label: 'Published', to: '/admin/professionals/45' },
							{ label: 'Affiliation pending', to: '/admin/professionals/91' },
						],
					},
					{
						title: 'Claims',
						path: '/admin/claims',
						to: '/admin/claims',
						summary: 'Requests to take over unclaimed listings. Approving one emails the claimant a link; it doesn’t make them the owner.',
						states: [
							{ label: 'One pending claim', to: '/admin/claims?claim=45' },
							{ label: 'Approved', to: '/admin/claims?status=approved' },
							{ label: 'Rejected', to: '/admin/claims?status=rejected' },
							{ label: 'Fulfilled', to: '/admin/claims?status=fulfilled' },
						],
					},
					{
						title: 'Inquiries',
						path: '/admin/inquiries',
						to: '/admin/inquiries',
						summary: 'Every inquiry to a provider and every message to the BPO Profile team.',
					},
				],
			},
			{
				label: 'Catalog',
				screens: [
					{
						title: 'Taxonomies',
						path: '/admin/taxonomies/[taxonomy]',
						to: '/admin/taxonomies/services',
						sample: 'the services list',
						summary: 'The services, industries, capabilities, languages and technologies providers choose from and buyers filter by.',
					},
					{
						title: 'Locations',
						path: '/admin/locations',
						to: '/admin/locations',
						summary: 'The country, region and city tree behind headquarters, operating sites and search filters.',
					},
				],
			},
			{
				label: 'Accounts',
				screens: [
					{
						title: 'Users',
						path: '/admin/users',
						to: '/admin/users',
						summary: 'Every account, with its role and company memberships.',
						states: [
							{ label: 'Providers', to: '/admin/users?status=provider' },
							{ label: 'Admins', to: '/admin/users?status=admin' },
							{ label: 'Unverified', to: '/admin/users?status=unverified' },
							{ label: 'Deleted', to: '/admin/users?status=deleted' },
						],
					},
				],
			},
		],
	},
]

// Pages about the demo itself. Listed on the sitemap, not counted as
// product screens.
const referenceArea: SitemapArea = {
	id: 'reference',
	title: 'About this demo',
	audience: 'Anyone reviewing the preview.',
	summary: 'This guide and sitemap, the component library, and what a missing page looks like.',
	icon: 'light-book-reader',
	shell: 'site',
	recognize: 'The public header and footer.',
	groups: [
		{
			label: 'Reference',
			screens: [
				{
					title: 'Guide',
					path: '/static/guide',
					to: '/static/guide',
					summary: 'The goal, who it serves, the business model and roadmap, then how the demo works and guided tours. Start here.',
				},
				{
					title: 'Sitemap',
					path: '/static/sitemap',
					to: '/static/sitemap',
					summary: 'Every screen and state on one page.',
				},
				{
					title: 'UI components',
					path: '/styleguide',
					to: '/styleguide',
					summary: 'The design system: every base and shared component with its variants and states.',
				},
				{
					title: 'Page not found',
					path: '(any unknown address)',
					to: '/no-such-page',
					summary: 'What visitors see at an address that doesn’t exist.',
					states: [
						{ label: 'Missing profile', to: '/companies/no-such-company' },
					],
				},
			],
		},
	],
}

// Product screens only, for the totals both pages show.
const sitemapScreens = sitemapAreas.flatMap(area => area.groups.flatMap(group => group.screens))

const sitemapCta = {
	title: 'New to BPO Profile?',
	text: 'The guide explains what it’s for, how it makes money and where it’s going, then walks through the product in four short tours.',
}

export {
	sitemapIntro,
	sitemapAreas,
	referenceArea,
	sitemapScreens,
	sitemapCta,
}
