// Static stand-ins for the signed-in session (GET /api/me) and the
// dashboard/admin navigation built from it. Ana Reyes owns Northshore CX
// and also has her own sales profile — the /api/me example in
// docs/API.md §1 — so one account shows both dashboard roles.
import type { NavGroup } from '~/types/app/navigation'
import type { Me } from '~/types/features/dashboard'

const me: Me = {
	id: 1,
	first_name: 'Ana',
	last_name: 'Reyes',
	email: 'ana@northshore-cx.example',
	email_verified_at: '2026-03-01T08:00:00Z',
	platform_role: 'user',
	companies: [
		{ id: 10, name: 'Northshore CX', slug: 'northshore-cx', role: 'owner' },
	],
	professional: { id: 45, slug: 'ana-reyes', company_id: 10, affiliation_status: 'approved' },
}

const adminMe: Me = {
	id: 2,
	first_name: 'Sam',
	last_name: 'Rivera',
	email: 'sam.rivera@bpoprofile.example',
	email_verified_at: '2025-09-01T08:00:00Z',
	platform_role: 'admin',
	companies: [],
	professional: null,
}

// Badge counts are placeholders until the dashboard endpoints exist.
function dashboardNav(companyId: number): NavGroup[] {
	const base = `/dashboard/companies/${companyId}`

	return [
		{
			label: '',
			links: [
				{ label: 'Overview', to: '/dashboard', icon: 'light-home', exact: true },
			],
		},
		{
			label: 'Company',
			links: [
				{ label: 'Company profile', to: base, icon: 'light-building', exact: true },
				{ label: 'Services & expertise', to: `${base}/services`, icon: 'light-tags' },
				{ label: 'Locations', to: `${base}/locations`, icon: 'light-map-marker' },
				{ label: 'Team', to: `${base}/team`, icon: 'light-users', badge: 2 },
				{ label: 'Inquiries', to: `${base}/inquiries`, icon: 'light-envelope', badge: 3 },
				{ label: 'Stats', to: `${base}/stats`, icon: 'light-chart-bar' },
			],
		},
		{
			label: 'Your sales profile',
			links: [
				{ label: 'My profile', to: '/dashboard/profile', icon: 'light-id-card' },
				{ label: 'My inquiries', to: '/dashboard/inquiries', icon: 'light-comments', badge: 1 },
				{ label: 'My stats', to: '/dashboard/stats', icon: 'light-chart-increase' },
			],
		},
		{
			label: 'Account',
			links: [
				{ label: 'Account settings', to: '/dashboard/account', icon: 'light-cog' },
			],
		},
	]
}

const adminNav: NavGroup[] = [
	{
		label: '',
		links: [
			{ label: 'Overview', to: '/admin', icon: 'light-home', exact: true },
		],
	},
	{
		label: 'Moderation',
		links: [
			{ label: 'Companies', to: '/admin/companies', icon: 'light-building' },
			{ label: 'Professionals', to: '/admin/professionals', icon: 'light-id-card' },
			{ label: 'Claims', to: '/admin/claims', icon: 'light-shield', badge: 2 },
			{ label: 'Inquiries', to: '/admin/inquiries', icon: 'light-envelope' },
		],
	},
	{
		label: 'Catalog',
		links: [
			{ label: 'Taxonomies', to: '/admin/taxonomies/services', match: '/admin/taxonomies', icon: 'light-tags' },
			{ label: 'Locations', to: '/admin/locations', icon: 'light-globe' },
		],
	},
	{
		label: 'Accounts',
		links: [
			{ label: 'Users', to: '/admin/users', icon: 'light-users' },
		],
	},
]

export {
	me,
	adminMe,
	dashboardNav,
	adminNav,
}
