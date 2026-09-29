// The guide and sitemap under /static, written for investors and other
// reviewers: what BPO Profile is for, and how to explore the static demo.
// Static copy, not an API response.
import type { MIconName } from '~/types/base/ui'

// --- Sitemap ---------------------------------------------------

// Another state of a screen: a ?state= preview, a tab, or a sample
// record in a different status.
interface SitemapState {
	label: string
	to: string
}

interface SitemapScreen {
	title: string
	// the route as the pages folder names it, e.g. /companies/[slug]
	path: string
	// a working address; a dynamic route opens a sample record
	to: string
	summary: string
	// the sample record `to` opens, for dynamic routes; reads after
	// "Opens", e.g. "Northshore CX"
	sample?: string
	states?: SitemapState[]
}

interface SitemapGroup {
	label: string
	screens: SitemapScreen[]
}

// The page shell an area's screens render in.
type SitemapShell = 'site' | 'auth' | 'dashboard' | 'admin'

interface SitemapArea {
	id: string
	title: string
	audience: string
	summary: string
	icon: MIconName
	shell: SitemapShell
	// how to tell, on screen, that you're in this area
	recognize: string
	groups: SitemapGroup[]
}

// A screen placed in its group's tree: depth counts the screens above it
// whose path it extends, so /companies/[slug] sits under /companies.
interface SitemapRow {
	screen: SitemapScreen
	depth: number
}

// --- Guide -----------------------------------------------------

interface GuideFact {
	icon: MIconName
	title: string
	text: string
}

interface GuideStop {
	title: string
	to: string
	text: string
	// what to type or tick, when the stop asks for input
	hint?: string
}

interface GuideTour {
	id: string
	role: string
	title: string
	text: string
	stops: GuideStop[]
}

interface GuideLink {
	label: string
	to: string
}

// --- Guide: the business ---------------------------------------

interface GuidePoint {
	title: string
	text: string
}

interface GuideAudience {
	icon: MIconName
	title: string
	who: string
	// what it costs them to take part
	terms: string
	needs: string[]
	// the brief's core message to them
	promise: string
}

interface GuidePhase {
	name: string
	title: string
	items: string[]
	// the phase this demo's screens belong to
	current?: boolean
}

// A launch goal, with where the demo shows it.
interface GuideGoal {
	text: string
	link: GuideLink
}

interface GuideRisk {
	risk: string
	safeguard: string
	link: GuideLink
}

export type {
	SitemapState,
	SitemapScreen,
	SitemapGroup,
	SitemapShell,
	SitemapArea,
	SitemapRow,
	GuideFact,
	GuideStop,
	GuideTour,
	GuideLink,
	GuidePoint,
	GuideAudience,
	GuidePhase,
	GuideGoal,
	GuideRisk,
}
