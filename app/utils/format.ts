// Formatting helpers. Dates render in UTC so the server-rendered HTML
// and the hydrated page always agree (the API reports UTC too).
import type { LocationRef } from '~/types/features/directory'

const date_format = new Intl.DateTimeFormat('en-US', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC',
})

const date_time_format = new Intl.DateTimeFormat('en-US', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
	hour: 'numeric',
	minute: '2-digit',
	timeZone: 'UTC',
})

const number_format = new Intl.NumberFormat('en-US')

function fullName(person: { first_name: string, last_name: string }): string {
	return `${person.first_name} ${person.last_name}`
}

// "Luis Cruz" -> "LC", "Northshore CX" -> "NC"
function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map(word => word.charAt(0).toUpperCase())
		.join('')
}

function formatDate(iso: string | null | undefined): string {
	if (!iso) return '—'
	return date_format.format(new Date(iso))
}

function formatDateTime(iso: string | null | undefined): string {
	if (!iso) return '—'
	return `${date_time_format.format(new Date(iso))} UTC`
}

function formatNumber(value: number): string {
	return number_format.format(value)
}

// Conversion is null when there were no views; say so instead of 0%.
function formatRate(rate: number | null): string {
	if (rate === null) return 'Unavailable'
	return `${(rate * 100).toFixed(1)}%`
}

function locationLabel(location: LocationRef | null | undefined): string {
	if (!location) return ''
	if (location.name === location.country) return location.name
	return `${location.name}, ${location.country}`
}

// "Asia/Manila" -> "Manila time". Stable on server and client, unlike a
// live clock or a DST-dependent offset.
function timezoneLabel(zone: string | null | undefined): string {
	if (!zone) return ''
	const city = zone.split('/').pop() ?? zone
	return `${city.replace(/_/g, ' ')} time`
}

// "https://www.northshore-cx.example/about" -> "northshore-cx.example"
function hostname(url: string | null | undefined): string {
	if (!url) return ''
	try {
		return new URL(url).hostname.replace(/^www\./, '')
	}
	catch {
		return url
	}
}

// Split plain-text API fields into paragraphs / lines. Content is
// always rendered as escaped text — never through v-html.
function paragraphs(text: string | null | undefined): string[] {
	if (!text) return []
	return text.split(/\n\s*\n/).map(part => part.trim()).filter(Boolean)
}

function lines(text: string | null | undefined): string[] {
	if (!text) return []
	return text.split('\n').map(part => part.trim()).filter(Boolean)
}

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
	return `${formatNumber(count)} ${count === 1 ? singular : plural}`
}

// The API generates slugs from names (docs/SETUP.md §6); the admin
// forms preview the same rule before saving.
function slugify(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export {
	fullName,
	initials,
	formatDate,
	formatDateTime,
	formatNumber,
	formatRate,
	locationLabel,
	timezoneLabel,
	hostname,
	paragraphs,
	lines,
	pluralize,
	slugify,
}
