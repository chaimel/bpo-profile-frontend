import type { icons } from '~/data/ui/icons'

type MIconName = keyof typeof icons
type MIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string

// Semantic tones shared by badges, alerts and status markers. A tone is
// never the only signal — every use pairs it with a word or an icon.
type Tone = 'neutral' | 'brand' | 'slate' | 'success' | 'warning' | 'danger'

interface SelectOption {
	label: string
	value: string
	disabled?: boolean
}

interface TabItem {
	value: string
	label: string
	count?: number
	icon?: MIconName
}

interface DropdownItem {
	label: string
	value: string
	icon?: MIconName
	to?: string
	href?: string
	tone?: 'default' | 'danger'
	// draws a rule above the item to separate groups
	divided?: boolean
	disabled?: boolean
}

interface BreadcrumbItem {
	label: string
	to?: string
}

interface TableColumn {
	key: string
	label: string
	align?: 'left' | 'center' | 'right'
	width?: string
	// hide the column below a breakpoint to keep tables readable on phones
	hideBelow?: 'md' | 'lg'
	// keep the header announced but visually hidden (e.g. an actions column)
	srOnlyLabel?: boolean
}

export type {
	MIconName,
	MIconSize,
	Tone,
	SelectOption,
	TabItem,
	DropdownItem,
	BreadcrumbItem,
	TableColumn,
}
