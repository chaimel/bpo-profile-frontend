// Envelope shapes shared by the Laravel API (docs/API.md §3, §10).

interface PaginationMeta {
	current_page: number
	last_page: number
	per_page: number
	total: number
}

interface Paginated<T> {
	data: T[]
	meta: PaginationMeta
}

// Laravel-style 422 body.
interface ValidationErrors {
	message: string
	errors: Record<string, string[]>
}

export type {
	PaginationMeta,
	Paginated,
	ValidationErrors,
}
