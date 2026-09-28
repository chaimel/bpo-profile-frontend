import type { MIconName } from '~/types/base/ui'

interface NavLink {
	label: string
	to: string
	icon?: MIconName
	// small count shown beside the label (unread inquiries, pending requests)
	badge?: number
	// match the route exactly instead of by prefix
	exact?: boolean
	// path prefix that marks the link active, when it differs from `to`
	match?: string
}

interface NavGroup {
	label: string
	links: NavLink[]
}

interface FooterColumn {
	title: string
	links: NavLink[]
}

export type {
	NavLink,
	NavGroup,
	FooterColumn,
}
