type SearchValue = string | null
type SearchSize = 'sm' | 'md' | 'lg'
type SearchAlign = 'left' | 'right' | 'center'
type SearchWidth = number | string | null

interface SearchProps {
	id?: string
	name?: string
	modelValue?: SearchValue
	placeholder?: string
	autocomplete?: string
	required?: boolean
	hasError?: boolean
	size?: SearchSize
	height?: number | undefined
	align?: SearchAlign
	clearable?: boolean
	width?: SearchWidth
	radius?: 'sm' | 'md' | 'full'
	// accessible name when there is no visible label
	label?: string
}

export type {
	SearchValue,
	SearchSize,
	SearchAlign,
	SearchWidth,
	SearchProps,
}
