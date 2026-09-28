// Site-wide copy and navigation. Wording comes from the brand book
// (PDF pp. 18, 32–35). Phase 2 destinations such as Resources stay out
// of the nav until they have content (docs/PLAN.md §6).
import type { FooterColumn, NavLink } from '~/types/app/navigation'

const siteName = 'BPO Profile'
const siteDomain = 'bpoprofile.com'
const masterMessage = 'Find BPO companies. Meet the people behind them.'
const siteDescription
	= 'BPO Profile makes it easier to discover outsourcing providers, explore their capabilities, and connect directly with the sales professionals who represent them.'

const primaryNav: NavLink[] = [
	{ label: 'Find a BPO', to: '/find' },
	{ label: 'BPO Profiles', to: '/companies' },
	{ label: 'Sales Pros', to: '/professionals' },
	{ label: 'Services', to: '/services' },
	{ label: 'Industries', to: '/industries' },
	{ label: 'Locations', to: '/locations' },
	{ label: 'Pricing', to: '/pricing' },
]

const footerColumns: FooterColumn[] = [
	{
		title: 'Discover',
		links: [
			{ label: 'Find a BPO', to: '/find' },
			{ label: 'BPO Profiles', to: '/companies' },
			{ label: 'Sales Pros', to: '/professionals' },
			{ label: 'Services', to: '/services' },
			{ label: 'Industries', to: '/industries' },
			{ label: 'Locations', to: '/locations' },
		],
	},
	{
		title: 'For providers',
		links: [
			{ label: 'Get Listed', to: '/register?type=company' },
			{ label: 'Create your sales profile', to: '/register?type=professional' },
			{ label: 'Claim your profile', to: '/claim' },
			{ label: 'Listing plans', to: '/pricing' },
			{ label: 'Sign In', to: '/login' },
		],
	},
	{
		title: 'BPO Profile',
		links: [
			{ label: 'About', to: '/about' },
			{ label: 'What our badges mean', to: '/about#trust' },
			{ label: 'How results are ranked', to: '/about#ranking' },
			{ label: 'Contact us', to: '/contact' },
			{ label: 'Terms', to: '/terms' },
			{ label: 'Privacy', to: '/privacy' },
		],
	},
]

export {
	siteName,
	siteDomain,
	masterMessage,
	siteDescription,
	primaryNav,
	footerColumns,
}
